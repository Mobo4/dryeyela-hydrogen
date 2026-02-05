#!/usr/bin/env node

/**
 * Sync Shopify Environment Variables
 * 
 * Updates .env.local with environment variables from Shopify Hydrogen configuration.
 * 
 * Usage:
 *   node scripts/sync-shopify-env-vars.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const envLocalPath = join(projectRoot, '.env.local');

// Environment variables from Shopify Hydrogen dashboard
// IMPORTANT: These values should be copied from Shopify Admin → Hydrogen → Environment Variables
// DO NOT hardcode secrets - use environment variables or prompt user
const SHOPIFY_ENV_VARS = {
  // Custom variables (set these from Shopify dashboard)
  SESSION_SECRET: process.env.SESSION_SECRET || 'b144f52c64723ed2a147742ac2a93df00c4d83da',
  
  // Read-only variables (provided by Shopify - get from dashboard)
  PRIVATE_STOREFRONT_API_TOKEN: process.env.PRIVATE_STOREFRONT_API_TOKEN || 'shpat_xxxxxxxxxxxxx', // Get from Shopify dashboard
  PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID: process.env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID || 'e64256e4-9a2c-4e4e-b919-9bb98b342e4a',
  PUBLIC_CUSTOMER_ACCOUNT_API_URL: process.env.PUBLIC_CUSTOMER_ACCOUNT_API_URL || 'https://shopify.com/27691679833',
  PUBLIC_STORE_DOMAIN: process.env.PUBLIC_STORE_DOMAIN || 'eyecarecenter.myshopify.com',
  PUBLIC_STOREFRONT_API_TOKEN: process.env.PUBLIC_STOREFRONT_API_TOKEN || 'f4d49a0b9ff5261da43caf42cc1dfbe5',
  PUBLIC_STOREFRONT_ID: process.env.PUBLIC_STOREFRONT_ID || '1000093695',
  SHOP_ID: process.env.SHOP_ID || '27691679833',
};

function loadEnv() {
  if (!existsSync(envLocalPath)) {
    return {};
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

function updateEnvFile() {
  console.log('🔄 Syncing Shopify Environment Variables\n');
  console.log('=' .repeat(60));
  
  let envContent = existsSync(envLocalPath) 
    ? readFileSync(envLocalPath, 'utf-8')
    : '';
  
  // Keep existing app credentials and other custom vars
  const existingEnv = loadEnv();
  
  // Update or add Shopify variables
  let updated = false;
  let added = [];
  let changed = [];
  
  Object.entries(SHOPIFY_ENV_VARS).forEach(([key, value]) => {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    
    if (envContent.match(regex)) {
      // Update existing
      const oldValue = existingEnv[key];
      if (oldValue !== value) {
        envContent = envContent.replace(regex, `${key}=${value}`);
        changed.push({ key, old: oldValue, new: value });
        updated = true;
      }
    } else {
      // Add new
      if (envContent && !envContent.endsWith('\n')) {
        envContent += '\n';
      }
      envContent += `${key}=${value}\n`;
      added.push(key);
      updated = true;
    }
  });
  
  // Write updated file
  if (updated) {
    writeFileSync(envLocalPath, envContent);
    
    console.log('✅ Environment variables synced!\n');
    
    if (added.length > 0) {
      console.log('📝 Added variables:');
      added.forEach(key => console.log(`   + ${key}`));
      console.log('');
    }
    
    if (changed.length > 0) {
      console.log('🔄 Updated variables:');
      changed.forEach(({ key, old, new: newVal }) => {
        console.log(`   ~ ${key}`);
        console.log(`     Old: ${old?.substring(0, 20)}...`);
        console.log(`     New: ${newVal?.substring(0, 20)}...`);
      });
      console.log('');
    }
  } else {
    console.log('✅ All variables already up to date!\n');
  }
  
  // Show summary
  console.log('📋 Current Configuration:\n');
  console.log(`   Storefront ID: ${SHOPIFY_ENV_VARS.PUBLIC_STOREFRONT_ID}`);
  console.log(`   Store Domain: ${SHOPIFY_ENV_VARS.PUBLIC_STORE_DOMAIN}`);
  console.log(`   Shop ID: ${SHOPIFY_ENV_VARS.SHOP_ID}`);
  console.log('');
  
  console.log('🚀 Next Steps:\n');
  console.log('   1. Verify local development works:');
  console.log('      npm run dev\n');
  console.log('   2. Check if deployment token is set:');
  console.log('      node scripts/check-github-secrets.mjs\n');
  console.log('   3. Deploy to preview:');
  console.log('      git push origin feature/hybrid-data-sync\n');
  
  console.log('=' .repeat(60));
}

updateEnvFile();
