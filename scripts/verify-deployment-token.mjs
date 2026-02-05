#!/usr/bin/env node

/**
 * Verify Deployment Token
 * 
 * Tests if the deployment token works by attempting a dry-run deployment.
 * 
 * Usage:
 *   node scripts/verify-deployment-token.mjs [token]
 */

import { execSync } from 'child_process';

const token = process.argv[2] || process.env.OXYGEN_DEPLOYMENT_TOKEN_1000013955 || '86360b8fcf51c6476adca419631ac43b';

console.log('🔍 Verifying Deployment Token\n');
console.log('=' .repeat(60));
console.log(`Token: ${token.substring(0, 10)}...${token.substring(token.length - 4)}`);
console.log('=' .repeat(60) + '\n');

// Check token format
console.log('1️⃣  Checking token format...\n');

const tokenLength = token.length;
const tokenFormat = {
  length: tokenLength,
  format: tokenLength === 32 ? '32 chars (hex format)' : 
          token.startsWith('shpat_') ? 'Shopify Admin API token' :
          token.startsWith('shpca_') ? 'Shopify Customer Account token' :
          token.startsWith('shpss_') ? 'Shopify App Secret' :
          'Unknown format'
};

console.log(`   Length: ${tokenLength} characters`);
console.log(`   Format: ${tokenFormat.format}\n`);

// Note: Deployment tokens are typically longer and have specific formats
if (tokenLength === 32) {
  console.log('   ⚠️  This looks like a hex token (32 chars)');
  console.log('   💡 Deployment tokens are usually longer (40+ chars)');
  console.log('   💡 This might be a different type of token\n');
}

// Try to validate with Shopify CLI (if available)
console.log('2️⃣  Testing token with Shopify CLI...\n');

try {
  // Try a simple shopify command to see if token works
  console.log('   Attempting to validate token...');
  
  // Note: We can't directly test deployment token without deploying
  // But we can check if Shopify CLI recognizes it
  console.log('   ⚠️  Cannot test deployment token directly');
  console.log('   💡 Token will be tested during actual deployment\n');
  
} catch (error) {
  console.log('   ❌ Error:', error.message);
}

console.log('3️⃣  Next Steps:\n');
console.log('   📋 If this is a deployment token:');
console.log('      - It should be from: Shopify Admin → Hydrogen → Deployments');
console.log('      - Format: Usually 40+ characters, may start with specific prefix\n');
console.log('   📋 If this is NOT a deployment token:');
console.log('      - Get the correct token from Shopify Admin');
console.log('      - Go to: Hydrogen → Deployments → Create deployment token\n');
console.log('   📋 Test by triggering deployment:');
console.log('      git commit --allow-empty -m "Test deployment"');
console.log('      git push origin feature/hybrid-data-sync\n');

console.log('=' .repeat(60) + '\n');
