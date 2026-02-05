#!/usr/bin/env node
/**
 * Check and Fix Storefront Connection via Shopify Admin API
 * 
 * This script uses the Shopify Admin API to check storefront status
 * and provide API-based solutions for fixing the locked repository.
 * 
 * Requirements:
 * - SHOPIFY_ADMIN_API_TOKEN environment variable
 * - SHOPIFY_STORE_DOMAIN environment variable (e.g., dryeyela-ai.myshopify.com)
 * 
 * Usage:
 *   SHOPIFY_ADMIN_API_TOKEN=your_token SHOPIFY_STORE_DOMAIN=dryeyela-ai.myshopify.com node scripts/check-storefront-api.mjs
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || 'dryeyela-ai.myshopify.com';
const STOREFRONT_ID = '1000013955'; // From workflow file

console.log('🔍 Checking Storefront via Admin API...\n');

if (!ADMIN_API_TOKEN) {
  console.log('❌ SHOPIFY_ADMIN_API_TOKEN environment variable not set');
  console.log('\n📝 To use this script:');
  console.log('   1. Get Admin API token from Shopify Admin → Apps → Develop apps');
  console.log('   2. Run: SHOPIFY_ADMIN_API_TOKEN=your_token node scripts/check-storefront-api.mjs\n');
  console.log('💡 Alternative: Use the Shopify CLI method instead:');
  console.log('   node scripts/fix-storefront-connection.mjs\n');
  process.exit(1);
}

// GraphQL query to check Hydrogen storefronts
const CHECK_STOREFRONT_QUERY = `
  query {
    hydrogenStorefronts(first: 10) {
      edges {
        node {
          id
          title
          productionUrl
          currentDeployment {
            id
            status
            url
          }
          gitHubRepository {
            owner
            name
          }
        }
      }
    }
  }
`;

async function checkStorefront() {
  const url = `https://${STORE_DOMAIN}/admin/api/2024-10/graphql.json`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_API_TOKEN,
      },
      body: JSON.stringify({
        query: CHECK_STOREFRONT_QUERY,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.errors) {
      console.log('❌ GraphQL Errors:');
      data.errors.forEach(err => console.log(`   - ${err.message}`));
      
      if (data.errors.some(e => e.message.includes('hydrogenStorefronts'))) {
        console.log('\n⚠️  This might mean:');
        console.log('   - You need Admin API access to Hydrogen storefronts');
        console.log('   - Or the Hydrogen channel is not enabled');
        console.log('\n💡 Try using Shopify CLI instead:');
        console.log('   shopify hydrogen link\n');
      }
      return;
    }
    
    const storefronts = data.data?.hydrogenStorefronts?.edges || [];
    
    console.log(`✅ Found ${storefronts.length} Hydrogen storefront(s)\n`);
    
    if (storefronts.length === 0) {
      console.log('⚠️  No storefronts found');
      console.log('   This might mean you need to create one first.\n');
      return;
    }
    
    // Find our storefront
    const ourStorefront = storefronts.find(
      edge => edge.node.id.includes(STOREFRONT_ID) || 
              edge.node.gitHubRepository?.name === 'dryeyela-hydrogen'
    );
    
    if (ourStorefront) {
      const sf = ourStorefront.node;
      console.log('✅ Found your storefront:');
      console.log(`   ID: ${sf.id}`);
      console.log(`   Title: ${sf.title || 'Untitled'}`);
      console.log(`   Production URL: ${sf.productionUrl || 'Not set'}`);
      
      if (sf.gitHubRepository) {
        console.log(`   GitHub: ${sf.gitHubRepository.owner}/${sf.gitHubRepository.name}`);
        console.log('   ✅ Repository is connected!\n');
      } else {
        console.log('   ⚠️  No GitHub repository connected\n');
      }
      
      if (sf.currentDeployment) {
        console.log('   Current Deployment:');
        console.log(`   Status: ${sf.currentDeployment.status}`);
        console.log(`   URL: ${sf.currentDeployment.url || 'N/A'}\n`);
      }
    } else {
      console.log('⚠️  Your storefront not found in the list');
      console.log('   Available storefronts:');
      storefronts.forEach(edge => {
        const sf = edge.node;
        console.log(`   - ${sf.id} (${sf.title || 'Untitled'})`);
        if (sf.gitHubRepository) {
          console.log(`     GitHub: ${sf.gitHubRepository.owner}/${sf.gitHubRepository.name}`);
        }
      });
      console.log();
    }
    
  } catch (error) {
    console.log('❌ Error checking storefront:');
    console.log(`   ${error.message}\n`);
    console.log('💡 This might mean:');
    console.log('   - Invalid Admin API token');
    console.log('   - Token doesn\'t have Hydrogen permissions');
    console.log('   - Network error\n');
    console.log('💡 Try using Shopify CLI instead:');
    console.log('   shopify hydrogen link\n');
  }
}

checkStorefront();
