#!/usr/bin/env node

/**
 * Get Deployment Token via Admin API
 * 
 * Attempts to get or create deployment token using Admin API.
 * Note: Deployment tokens may need to be created via Partners API or UI.
 * 
 * Usage:
 *   node scripts/get-deployment-token-via-api.mjs
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const envLocalPath = join(projectRoot, '.env.local');

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

async function getDeploymentToken() {
  const env = loadEnv();
  const { SHOPIFY_ADMIN_ACCESS_TOKEN, PUBLIC_STORE_DOMAIN } = env;
  
  if (!SHOPIFY_ADMIN_ACCESS_TOKEN) {
    console.error('❌ SHOPIFY_ADMIN_ACCESS_TOKEN not found');
    console.error('   Run: node scripts/get-admin-api-token.mjs first\n');
    process.exit(1);
  }
  
  const shop = PUBLIC_STORE_DOMAIN.replace('.myshopify.com', '');
  const storefrontId = '1000013955'; // Your storefront ID
  
  console.log('🔑 Getting Deployment Token via Admin API\n');
  console.log('=' .repeat(60));
  console.log(`Storefront ID: ${storefrontId}`);
  console.log('=' .repeat(60) + '\n');
  
  // Note: Deployment tokens are typically managed via Partners API or UI
  // Admin API may not support creating them directly
  
  console.log('⚠️  Note: Deployment tokens are typically created via:');
  console.log('   1. Shopify Partners Dashboard → Apps → Hydrogen → Deployments');
  console.log('   2. Shopify Admin → Hydrogen → Deployments');
  console.log('   3. Partners API (if available)\n');
  
  console.log('💡 Alternative: Use Shopify CLI to get deployment token\n');
  console.log('   shopify auth login');
  console.log('   shopify hydrogen link');
  console.log('   # Follow prompts - may show deployment token\n');
  
  console.log('📋 Or get it manually:');
  console.log('   1. Go to: Shopify Partners → Apps → Your App → Hydrogen');
  console.log('   2. Click "Deployments" tab');
  console.log('   3. Click "Create deployment token"');
  console.log('   4. Copy the token (40+ characters)\n');
  
  // Try to query storefronts to see if we can get token info
  try {
    const { default: queryStorefronts } = await import('./query-hydrogen-storefronts.mjs');
    console.log('🔍 Querying storefronts for token information...\n');
    // This would need to be refactored to export the function
  } catch (error) {
    // Ignore - just show instructions
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  getDeploymentToken().catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
}
