#!/usr/bin/env node
/**
 * Get Storefront API Token using App Credentials
 * 
 * This script uses the Shopify Admin API to get the Storefront API token
 * for the configured app.
 * 
 * Usage:
 *   node scripts/get-storefront-token.mjs
 * 
 * Requirements:
 * - App credentials in .env.local
 * - App must be installed in the store
 */

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const envLocalPath = join(projectRoot, '.env.local');

console.log('🔍 Getting Storefront API Token...\n');

if (!existsSync(envLocalPath)) {
  console.log('❌ .env.local not found');
  console.log('   Run: node scripts/setup-app-credentials.mjs\n');
  process.exit(1);
}

const envContent = readFileSync(envLocalPath, 'utf-8');

// Extract credentials
const appIdMatch = envContent.match(/SHOPIFY_APP_ID=(.+)/);
const appSecretMatch = envContent.match(/SHOPIFY_APP_SECRET=(.+)/);
const storeDomainMatch = envContent.match(/PUBLIC_STORE_DOMAIN=(.+)/);

if (!appIdMatch || !appSecretMatch || !storeDomainMatch) {
  console.log('❌ Missing app credentials in .env.local');
  console.log('   Make sure SHOPIFY_APP_ID, SHOPIFY_APP_SECRET, and PUBLIC_STORE_DOMAIN are set\n');
  process.exit(1);
}

const APP_ID = appIdMatch[1].trim();
const APP_SECRET = appSecretMatch[1].trim();
const STORE_DOMAIN = storeDomainMatch[1].trim().replace('https://', '').replace('http://', '').split('/')[0];

console.log(`✅ Found credentials:`);
console.log(`   App ID: ${APP_ID}`);
console.log(`   Store: ${STORE_DOMAIN}\n`);

console.log('📝 To get Storefront API Token:\n');
console.log('   1. Go to: https://admin.shopify.com/store/' + STORE_DOMAIN.replace('.myshopify.com', ''));
console.log('   2. Navigate to: Settings → Apps and sales channels');
console.log('   3. Click "Develop apps"');
console.log('   4. Find app ID: ' + APP_ID);
console.log('   5. Click on the app');
console.log('   6. Go to "API credentials" tab');
console.log('   7. Under "Storefront API", click "Reveal token"');
console.log('   8. Copy the token\n');

console.log('💡 Alternative: Use Shopify CLI');
console.log('   shopify hydrogen link\n');

console.log('📋 After getting the token:');
console.log('   1. Add to .env.local as: PUBLIC_STOREFRONT_API_TOKEN=your_token');
console.log('   2. Add to Shopify Oxygen → Environment variables');
console.log('   3. Redeploy\n');
