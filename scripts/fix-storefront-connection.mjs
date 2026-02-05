#!/usr/bin/env node
/**
 * Fix Hydrogen Storefront GitHub Repository Connection
 * 
 * This script uses Shopify CLI/API to:
 * 1. Check current storefront connection status
 * 2. Verify repository connection
 * 3. Provide instructions to fix locked repository
 * 
 * Usage:
 *   node scripts/fix-storefront-connection.mjs
 * 
 * Or with Shopify CLI:
 *   shopify hydrogen link
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🔍 Checking Hydrogen Storefront Connection...\n');

// Check if Shopify CLI is installed
function checkShopifyCLI() {
  try {
    const version = execSync('shopify version', { encoding: 'utf-8' }).trim();
    console.log(`✅ Shopify CLI installed: ${version}`);
    return true;
  } catch (error) {
    console.log('❌ Shopify CLI not found');
    console.log('   Install with: npm install -g @shopify/cli @shopify/theme\n');
    return false;
  }
}

// Check workflow file for storefront ID
function getStorefrontId() {
  const workflowPath = join(projectRoot, '.github', 'workflows', 'oxygen-deployment-1000013955.yml');
  
  if (!existsSync(workflowPath)) {
    console.log('⚠️  Workflow file not found');
    return null;
  }
  
  try {
    const content = readFileSync(workflowPath, 'utf-8');
    const match = content.match(/oxygen_storefront_id:\s*(\d+)/);
    if (match) {
      const storefrontId = match[1];
      console.log(`✅ Found storefront ID: ${storefrontId}`);
      return storefrontId;
    }
  } catch (error) {
    console.log('⚠️  Could not read workflow file');
  }
  
  return null;
}

// Check if user is logged into Shopify CLI
function checkShopifyAuth() {
  try {
    execSync('shopify auth status', { encoding: 'utf-8', stdio: 'pipe' });
    console.log('✅ Authenticated with Shopify CLI');
    return true;
  } catch (error) {
    console.log('⚠️  Not authenticated with Shopify CLI');
    console.log('   Run: shopify auth login\n');
    return false;
  }
}

// Try to link storefront
function linkStorefront() {
  console.log('\n🔗 Attempting to link storefront...\n');
  
  try {
    // Use Shopify CLI to link
    const output = execSync('shopify hydrogen link', { 
      encoding: 'utf-8',
      stdio: 'inherit',
      cwd: projectRoot
    });
    console.log('\n✅ Storefront linked successfully!');
    return true;
  } catch (error) {
    console.log('\n⚠️  Link command failed or requires interaction');
    return false;
  }
}

// Main execution
async function main() {
  console.log('='.repeat(60));
  console.log('Hydrogen Storefront Connection Fixer');
  console.log('='.repeat(60));
  console.log();
  
  const hasCLI = checkShopifyCLI();
  const storefrontId = getStorefrontId();
  const isAuthenticated = hasCLI && checkShopifyAuth();
  
  console.log();
  console.log('📋 Current Status:');
  console.log(`   Storefront ID: ${storefrontId || 'Not found'}`);
  console.log(`   Shopify CLI: ${hasCLI ? 'Installed' : 'Not installed'}`);
  console.log(`   Authenticated: ${isAuthenticated ? 'Yes' : 'No'}`);
  console.log();
  
  if (!hasCLI) {
    console.log('❌ Cannot proceed without Shopify CLI');
    console.log('\n📝 Next Steps:');
    console.log('   1. Install Shopify CLI: npm install -g @shopify/cli @shopify/theme');
    console.log('   2. Run: shopify auth login');
    console.log('   3. Run this script again\n');
    process.exit(1);
  }
  
  if (!isAuthenticated) {
    console.log('❌ Not authenticated with Shopify');
    console.log('\n📝 Next Steps:');
    console.log('   1. Run: shopify auth login');
    console.log('   2. Select your store: dryeyela-ai');
    console.log('   3. Run this script again\n');
    process.exit(1);
  }
  
  if (!storefrontId) {
    console.log('⚠️  Storefront ID not found in workflow file');
    console.log('   This might mean the repository is not connected yet.\n');
  } else {
    console.log(`✅ Repository is configured for storefront: ${storefrontId}`);
    console.log('   If it shows as "locked", the connection already exists.\n');
  }
  
  console.log('🔧 Solution Options:\n');
  console.log('Option 1: Use Shopify Admin (Recommended)');
  console.log('   1. Go to: Shopify Admin → Hydrogen → Deployments');
  console.log('   2. Find storefront ID:', storefrontId || '1000013955');
  console.log('   3. If it exists, you\'re already connected!');
  console.log('   4. If you want to reconnect, click "Disconnect" then "Connect" again\n');
  
  console.log('Option 2: Use Shopify CLI');
  console.log('   1. Run: shopify hydrogen link');
  console.log('   2. Select your store: dryeyela-ai');
  console.log('   3. Select storefront:', storefrontId || 'or create new');
  console.log('   4. Confirm connection\n');
  
  console.log('Option 3: Manual API Fix (Advanced)');
  console.log('   If the above don\'t work, you may need to:');
  console.log('   1. Disconnect via Shopify Admin → Hydrogen → Deployments');
  console.log('   2. Revoke GitHub App access: https://github.com/settings/applications');
  console.log('   3. Reconnect in Shopify Admin\n');
  
  // Try to link if user wants
  if (process.argv.includes('--link')) {
    linkStorefront();
  } else {
    console.log('💡 Tip: Run with --link flag to attempt automatic linking:');
    console.log('   node scripts/fix-storefront-connection.mjs --link\n');
  }
  
  console.log('='.repeat(60));
}

main().catch(console.error);
