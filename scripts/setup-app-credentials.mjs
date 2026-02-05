#!/usr/bin/env node
/**
 * Setup Shopify App Credentials
 * 
 * This script helps configure the Shopify app credentials for Hydrogen deployment.
 * 
 * Usage:
 *   node scripts/setup-app-credentials.mjs
 */

import { writeFileSync, existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// App credentials - these should be set via environment variables or .env.local
// For security, actual secrets are not hardcoded in scripts
const APP_ID = process.env.SHOPIFY_APP_ID || '6fb6965ac343c320d244cdee6b60959f';
const APP_SECRET = process.env.SHOPIFY_APP_SECRET || ''; // Get from .env.local
const STORE_DOMAIN = process.env.PUBLIC_STORE_DOMAIN || 'dryeyela-ai.myshopify.com';

console.log('🔐 Setting up Shopify App Credentials...\n');

// Check if .env.local exists
const envLocalPath = join(projectRoot, '.env.local');
const envExamplePath = join(projectRoot, '.env.local.example');

let envContent = '';

if (existsSync(envLocalPath)) {
  console.log('⚠️  .env.local already exists');
  const existing = readFileSync(envLocalPath, 'utf-8');
  
  // Check if credentials are already set
  if (existing.includes(APP_ID)) {
    console.log('✅ App credentials already configured\n');
  } else {
    console.log('📝 Adding app credentials to existing .env.local...\n');
    envContent = existing + `\n# Shopify App Credentials\nSHOPIFY_APP_ID=${APP_ID}\nSHOPIFY_APP_SECRET=${APP_SECRET}\n`;
  }
} else {
  console.log('📝 Creating .env.local file...\n');
  
  // Create from example if it exists
  if (existsSync(envExamplePath)) {
    envContent = readFileSync(envExamplePath, 'utf-8');
    envContent = envContent.replace('your_storefront_api_token_here', '');
    envContent = envContent.replace('your_storefront_id', '');
    envContent = envContent.replace('your_session_secret_here', '');
  } else {
    // Create basic template
    envContent = `# Shopify App Credentials
SHOPIFY_APP_ID=${APP_ID}
SHOPIFY_APP_SECRET=${APP_SECRET}

# Store Domain
PUBLIC_STORE_DOMAIN=${STORE_DOMAIN}

# Storefront API Token (get from Shopify Admin → Apps → Develop apps)
PUBLIC_STOREFRONT_API_TOKEN=

# Storefront ID (get from same app)
PUBLIC_STOREFRONT_ID=

# Session Secret (generate with: openssl rand -base64 32)
SESSION_SECRET=

# Customer Account API (if using)
PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID=
PUBLIC_CUSTOMER_ACCOUNT_API_URL=https://shopify.com/customer-account/api

# Checkout Domain
PUBLIC_CHECKOUT_DOMAIN=checkout.shopify.com

# App Integrations (optional)
PUBLIC_JUDGEME_SHOP_DOMAIN=
PUBLIC_GORGIAS_APP_ID=
PUBLIC_KLAVIYO_API_KEY=
`;
  }
  
  // Update with actual credentials (read from .env.local if exists)
  if (existsSync(envLocalPath)) {
    const existingEnv = readFileSync(envLocalPath, 'utf-8');
    const existingAppId = existingEnv.match(/SHOPIFY_APP_ID=(.+)/)?.[1]?.trim();
    const existingAppSecret = existingEnv.match(/SHOPIFY_APP_SECRET=(.+)/)?.[1]?.trim();
    const existingStoreDomain = existingEnv.match(/PUBLIC_STORE_DOMAIN=(.+)/)?.[1]?.trim();
    
    if (existingAppId) APP_ID = existingAppId;
    if (existingAppSecret) APP_SECRET = existingAppSecret;
    if (existingStoreDomain) STORE_DOMAIN = existingStoreDomain;
  }
  
  envContent = envContent.replace(/SHOPIFY_APP_ID=.*/, `SHOPIFY_APP_ID=${APP_ID}`);
  if (APP_SECRET) {
    envContent = envContent.replace(/SHOPIFY_APP_SECRET=.*/, `SHOPIFY_APP_SECRET=${APP_SECRET}`);
  }
  envContent = envContent.replace(/PUBLIC_STORE_DOMAIN=.*/, `PUBLIC_STORE_DOMAIN=${STORE_DOMAIN}`);
}

// Write the file
writeFileSync(envLocalPath, envContent, 'utf-8');
console.log('✅ Created/Updated .env.local with app credentials\n');

// Verify .gitignore includes .env.local
const gitignorePath = join(projectRoot, '.gitignore');
let gitignoreContent = '';
if (existsSync(gitignorePath)) {
  gitignoreContent = readFileSync(gitignorePath, 'utf-8');
}

if (!gitignoreContent.includes('.env.local')) {
  console.log('📝 Adding .env.local to .gitignore...\n');
  gitignoreContent += '\n# Local environment variables\n.env.local\n';
  writeFileSync(gitignorePath, gitignoreContent, 'utf-8');
  console.log('✅ Updated .gitignore\n');
} else {
  console.log('✅ .env.local is already in .gitignore\n');
}

console.log('📋 Next Steps:\n');
console.log('1. Get Storefront API Token:');
console.log('   - Shopify Admin → Settings → Apps and sales channels');
console.log('   - Click "Develop apps" → Find your app');
console.log('   - Go to "API credentials" → Storefront API → Reveal token');
console.log('   - Add to .env.local as PUBLIC_STOREFRONT_API_TOKEN\n');

console.log('2. Get Storefront ID:');
console.log('   - Same app → API credentials → Storefront ID');
console.log('   - Add to .env.local as PUBLIC_STOREFRONT_ID\n');

console.log('3. Generate Session Secret:');
console.log('   - Run: openssl rand -base64 32');
console.log('   - Add to .env.local as SESSION_SECRET\n');

console.log('4. Set Environment Variables in Shopify Oxygen:');
console.log('   - Shopify Admin → Hydrogen → Environment variables');
console.log('   - Add all PUBLIC_* variables from .env.local\n');

console.log('✅ Setup complete!\n');
