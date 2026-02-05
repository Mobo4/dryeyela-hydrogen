#!/usr/bin/env node

/**
 * Push Environment Variables to Shopify Hydrogen
 * 
 * This script helps push environment variables from .env.local to Shopify Oxygen
 * using the Shopify CLI.
 * 
 * Usage:
 *   node scripts/push-env-vars.mjs
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const envLocalPath = join(projectRoot, '.env.local');

console.log('🚀 Shopify Hydrogen Environment Variables Pusher\n');

// Check if .env.local exists
if (!existsSync(envLocalPath)) {
  console.error('❌ Error: .env.local file not found!');
  console.error('   Please create .env.local first with your environment variables.');
  console.error('   See: .env.local.example for reference\n');
  process.exit(1);
}

// Read .env.local
const envContent = readFileSync(envLocalPath, 'utf-8');

// Parse environment variables
const envVars = {};
const lines = envContent.split('\n');

for (const line of lines) {
  const trimmed = line.trim();
  // Skip comments and empty lines
  if (!trimmed || trimmed.startsWith('#')) continue;
  
  const match = trimmed.match(/^([A-Z_]+)=(.*)$/);
  if (match) {
    const [, key, value] = match;
    // Remove quotes if present
    const cleanValue = value.replace(/^["']|["']$/g, '');
    envVars[key] = cleanValue;
  }
}

// Check required variables
const requiredVars = [
  'SESSION_SECRET',
  'PUBLIC_STORE_DOMAIN',
];

const missingRequired = requiredVars.filter(v => !envVars[v] || envVars[v].includes('your_') || envVars[v].includes('_here'));

if (missingRequired.length > 0) {
  console.warn('⚠️  Warning: Some required variables are missing or have placeholder values:');
  missingRequired.forEach(v => console.warn(`   - ${v}`));
  console.warn('');
}

// Show what will be pushed
console.log('📋 Environment Variables Found:\n');
const publicVars = Object.keys(envVars).filter(k => k.startsWith('PUBLIC_'));
const privateVars = Object.keys(envVars).filter(k => !k.startsWith('PUBLIC_') && k !== 'SHOPIFY_APP_SECRET' && k !== 'SHOPIFY_WEBHOOK_DELIVERY_SERVICE_ACCOUNT');

console.log('Public Variables (will be pushed):');
publicVars.forEach(key => {
  const value = envVars[key];
  const displayValue = value && value.length > 50 ? `${value.substring(0, 50)}...` : value;
  console.log(`   ✅ ${key} = ${displayValue || '(empty)'}`);
});

console.log('\nPrivate Variables (will be pushed):');
privateVars.forEach(key => {
  const value = envVars[key];
  const displayValue = key === 'SESSION_SECRET' && value ? '***hidden***' : (value && value.length > 50 ? `${value.substring(0, 50)}...` : value);
  console.log(`   ✅ ${key} = ${displayValue || '(empty)'}`);
});

console.log('\n⚠️  Note: SHOPIFY_APP_SECRET and webhook configs are NOT pushed (server-side only)\n');

// Instructions
console.log('📝 Next Steps:\n');
console.log('1. Make sure you have the Storefront API Token:');
console.log('   - Go to: Shopify Partners → Apps → Your App → API credentials');
console.log('   - Under "Storefront API", click "Reveal token"');
console.log('   - Add to .env.local: PUBLIC_STOREFRONT_API_TOKEN=your_token\n');

console.log('2. Link your storefront (if not already linked):');
console.log('   shopify auth login');
console.log('   shopify hydrogen link\n');

console.log('3. Push environment variables:');
console.log('   shopify hydrogen env push\n');

console.log('4. When prompted:');
console.log('   - Select environment: "Production" or "Preview"');
console.log('   - Confirm pushing variables\n');

console.log('5. After pushing, trigger a new deployment:');
console.log('   git commit --allow-empty -m "Trigger deployment after env vars"');
console.log('   git push origin feature/hybrid-data-sync\n');

console.log('📚 For more help, see: docs/FIND_ENVIRONMENT_VARIABLES.md\n');
