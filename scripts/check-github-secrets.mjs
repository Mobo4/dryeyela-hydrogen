#!/usr/bin/env node

/**
 * Check GitHub Secrets Configuration
 * 
 * Provides instructions to verify deployment token is set in GitHub Secrets.
 * 
 * Usage:
 *   node scripts/check-github-secrets.mjs
 */

console.log('🔐 GitHub Secrets Configuration Check\n');
console.log('=' .repeat(60) + '\n');

console.log('📋 Required GitHub Secret:\n');
console.log('   Name: OXYGEN_DEPLOYMENT_TOKEN_1000013955');
console.log('   Purpose: Authenticate GitHub Actions to deploy to Shopify Oxygen\n');

console.log('🔍 How to Check if Secret Exists:\n');
console.log('   1. Go to: https://github.com/Mobo4/dryeyela-hydrogen/settings/secrets/actions');
console.log('   2. Look for: OXYGEN_DEPLOYMENT_TOKEN_1000013955');
console.log('   3. If NOT found → Add it (see steps below)');
console.log('   4. If found → Verify it\'s not expired\n');

console.log('➕ How to Add Secret (if missing):\n');
console.log('   1. Get deployment token from Shopify:');
console.log('      - Shopify Partners → Apps → Your App → Hydrogen → Deployments');
console.log('      - Click "Create deployment token"');
console.log('      - Copy the token\n');
console.log('   2. Add to GitHub:');
console.log('      - Go to: https://github.com/Mobo4/dryeyela-hydrogen/settings/secrets/actions');
console.log('      - Click "New repository secret"');
console.log('      - Name: OXYGEN_DEPLOYMENT_TOKEN_1000013955');
console.log('      - Secret: Paste token');
console.log('      - Click "Add secret"\n');

console.log('⚠️  Important:\n');
console.log('   - Secret name MUST be exact: OXYGEN_DEPLOYMENT_TOKEN_1000013955');
console.log('   - This matches the workflow file reference');
console.log('   - Case-sensitive, no spaces\n');

console.log('🔄 After Adding Secret:\n');
console.log('   1. Trigger new deployment:');
console.log('      git commit --allow-empty -m "Trigger deployment"');
console.log('      git push origin feature/hybrid-data-sync\n');
console.log('   2. Check GitHub Actions:');
console.log('      https://github.com/Mobo4/dryeyela-hydrogen/actions\n');

console.log('=' .repeat(60) + '\n');
