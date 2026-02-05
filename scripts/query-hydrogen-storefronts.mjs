#!/usr/bin/env node

/**
 * Query Hydrogen Storefronts via Admin API
 * 
 * Uses Admin API access token to query Hydrogen storefronts and get deployment info.
 * 
 * Usage:
 *   node scripts/query-hydrogen-storefronts.mjs
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const envLocalPath = join(projectRoot, '.env.local');

// Load environment variables
function loadEnv() {
  if (!existsSync(envLocalPath)) {
    throw new Error('.env.local file not found!');
  }
  
  const envContent = readFileSync(envLocalPath, 'utf-8');
  const env = {};
  
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([A-Z_]+)=(.*)$/);
    if (match) {
      const [, key, value] = match;
      env[key] = value.replace(/^["']|["']$/g, '');
    }
  }
  
  return env;
}

// Query Hydrogen storefronts using GraphQL Admin API
async function queryHydrogenStorefronts() {
  const env = loadEnv();
  const { SHOPIFY_ADMIN_ACCESS_TOKEN, PUBLIC_STORE_DOMAIN } = env;
  
  if (!SHOPIFY_ADMIN_ACCESS_TOKEN) {
    console.error('❌ SHOPIFY_ADMIN_ACCESS_TOKEN not found in .env.local');
    console.error('   Run: node scripts/get-admin-api-token.mjs first\n');
    process.exit(1);
  }
  
  const shop = PUBLIC_STORE_DOMAIN.replace('.myshopify.com', '');
  
  console.log('🔍 Querying Hydrogen Storefronts via Admin API\n');
  console.log('=' .repeat(60));
  console.log(`Store: ${shop}.myshopify.com`);
  console.log('=' .repeat(60) + '\n');
  
  // GraphQL query for Hydrogen storefronts
  const query = `
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
              createdAt
            }
            gitHubRepository {
              owner
              name
            }
            deploymentTokens(first: 5) {
              edges {
                node {
                  id
                  name
                  createdAt
                  lastUsedAt
                }
              }
            }
          }
        }
      }
    }
  `;
  
  try {
    const response = await fetch(`https://${shop}.myshopify.com/admin/api/2024-10/graphql.json`, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API request failed: ${response.statusText} - ${error}`);
    }
    
    const data = await response.json();
    
    if (data.errors) {
      console.error('❌ GraphQL Errors:');
      data.errors.forEach(err => console.error(`   - ${err.message}`));
      console.error('\n');
      return null;
    }
    
    const storefronts = data.data?.hydrogenStorefronts?.edges || [];
    
    if (storefronts.length === 0) {
      console.log('⚠️  No Hydrogen storefronts found\n');
      console.log('💡 This might mean:');
      console.log('   - Storefront not created yet');
      console.log('   - Different API permissions needed');
      console.log('   - Need to use Partners API instead\n');
      return null;
    }
    
    console.log(`✅ Found ${storefronts.length} storefront(s):\n`);
    
    storefronts.forEach(({ node: sf }, index) => {
      console.log(`${index + 1}. ${sf.title || 'Untitled'}`);
      console.log(`   ID: ${sf.id}`);
      console.log(`   Production URL: ${sf.productionUrl || 'N/A'}`);
      
      if (sf.currentDeployment) {
        console.log(`   Current Deployment: ${sf.currentDeployment.status}`);
        console.log(`   Deployment URL: ${sf.currentDeployment.url || 'N/A'}`);
      }
      
      if (sf.gitHubRepository) {
        console.log(`   GitHub: ${sf.gitHubRepository.owner}/${sf.gitHubRepository.name}`);
      }
      
      if (sf.deploymentTokens?.edges?.length > 0) {
        console.log(`   Deployment Tokens: ${sf.deploymentTokens.edges.length} found`);
        sf.deploymentTokens.edges.forEach(({ node: token }) => {
          console.log(`     - ${token.name} (created: ${token.createdAt})`);
        });
      }
      
      console.log('');
    });
    
    return storefronts;
    
  } catch (error) {
    console.error('❌ Error querying storefronts:', error.message);
    return null;
  }
}

// Main
async function main() {
  try {
    await queryHydrogenStorefronts();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
