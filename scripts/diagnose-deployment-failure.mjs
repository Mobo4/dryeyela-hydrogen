#!/usr/bin/env node

/**
 * Diagnose GitHub Actions Deployment Failure
 * 
 * This script helps identify why "Deploy to Oxygen" is failing
 * with exit code 1 in GitHub Actions.
 * 
 * Usage:
 *   node scripts/diagnose-deployment-failure.mjs
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🔍 Diagnosing GitHub Actions Deployment Failure\n');
console.log('=' .repeat(60) + '\n');

// Check 1: Build works locally
console.log('1️⃣  Checking if build works locally...\n');
try {
  console.log('   Running: npm run build');
  execSync('npm run build', { 
    cwd: projectRoot, 
    stdio: 'pipe',
    timeout: 60000 
  });
  console.log('   ✅ Build succeeds locally\n');
} catch (error) {
  console.log('   ❌ Build FAILS locally!');
  console.log('   Error:', error.message);
  console.log('   ⚠️  Fix build errors before deployment will work\n');
  process.exit(1);
}

// Check 2: Workflow file exists
console.log('2️⃣  Checking GitHub Actions workflow file...\n');
const workflowPath = join(projectRoot, '.github/workflows/oxygen-deployment-1000013955.yml');
if (existsSync(workflowPath)) {
  console.log('   ✅ Workflow file exists: .github/workflows/oxygen-deployment-1000013955.yml\n');
  
  const workflowContent = readFileSync(workflowPath, 'utf-8');
  
  // Check for deployment token reference
  if (workflowContent.includes('OXYGEN_DEPLOYMENT_TOKEN_1000013955')) {
    console.log('   ✅ Workflow references deployment token\n');
  } else {
    console.log('   ❌ Workflow missing deployment token reference!\n');
  }
  
  // Check for shopify hydrogen deploy command
  if (workflowContent.includes('shopify hydrogen deploy')) {
    console.log('   ✅ Workflow includes deployment command\n');
  } else {
    console.log('   ❌ Workflow missing deployment command!\n');
  }
} else {
  console.log('   ❌ Workflow file NOT found!\n');
  console.log('   Create: .github/workflows/oxygen-deployment-1000013955.yml\n');
}

// Check 3: Package.json has required scripts
console.log('3️⃣  Checking package.json...\n');
const packageJsonPath = join(projectRoot, 'package.json');
if (existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  
  if (packageJson.scripts?.build) {
    console.log('   ✅ Build script exists\n');
  } else {
    console.log('   ❌ Build script missing!\n');
  }
  
  // Check for Shopify CLI
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  if (deps['@shopify/cli'] || deps['@shopify/hydrogen']) {
    console.log('   ✅ Shopify dependencies found\n');
  } else {
    console.log('   ⚠️  Shopify dependencies may be missing\n');
  }
} else {
  console.log('   ❌ package.json not found!\n');
}

// Check 4: Common deployment failure causes
console.log('4️⃣  Common Deployment Failure Causes:\n');
console.log('   ⚠️  MOST COMMON: Missing deployment token in GitHub Secrets');
console.log('      - Go to: https://github.com/Mobo4/dryeyela-hydrogen/settings/secrets/actions');
console.log('      - Check if OXYGEN_DEPLOYMENT_TOKEN_1000013955 exists');
console.log('      - If missing, add it (get token from Shopify Admin)\n');

console.log('   ⚠️  Token expired or invalid');
console.log('      - Generate new token in Shopify Admin → Hydrogen → Deployments');
console.log('      - Update GitHub Secret with new token\n');

console.log('   ⚠️  Build step failing');
console.log('      - Check GitHub Actions logs for build errors');
console.log('      - Fix TypeScript/linting errors\n');

console.log('   ⚠️  Shopify CLI version mismatch');
console.log('      - GitHub Actions uses npx shopify (latest)');
console.log('      - Ensure compatibility with your Hydrogen version\n');

console.log('   ⚠️  Missing environment variables');
console.log('      - Deployment succeeds but site shows 404');
console.log('      - Set env vars in Shopify Oxygen\n');

// Check 5: GitHub Actions URL
console.log('5️⃣  Next Steps:\n');
console.log('   📋 Check GitHub Actions logs:');
console.log('      https://github.com/Mobo4/dryeyela-hydrogen/actions\n');
console.log('   📋 Look for specific error in "Deploy to Oxygen" job\n');
console.log('   📋 Common error messages:');
console.log('      - "Failed to authenticate" → Missing/invalid token');
console.log('      - "Build failed" → Check build logs');
console.log('      - "Module not found" → Dependency issue');
console.log('      - "Command failed" → Check command output\n');

// Check 6: Verify deployment token format
console.log('6️⃣  Deployment Token Requirements:\n');
console.log('   ✅ Token name: OXYGEN_DEPLOYMENT_TOKEN_1000013955 (exact match)');
console.log('   ✅ Token format: Usually starts with "shpat_" or similar');
console.log('   ✅ Token location: GitHub → Settings → Secrets → Actions\n');

console.log('=' .repeat(60) + '\n');
console.log('💡 Quick Fix:\n');
console.log('   1. Get deployment token from Shopify Admin');
console.log('   2. Add to GitHub Secrets: OXYGEN_DEPLOYMENT_TOKEN_1000013955');
console.log('   3. Push again: git push origin feature/hybrid-data-sync');
console.log('   4. Check GitHub Actions: https://github.com/Mobo4/dryeyela-hydrogen/actions\n');
