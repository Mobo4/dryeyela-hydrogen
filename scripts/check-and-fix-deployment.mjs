#!/usr/bin/env node

/**
 * Check and Fix Deployment - Ralph Loop
 * 
 * Checks GitHub Secrets, identifies issues, and monitors until build succeeds.
 * 
 * Usage:
 *   node scripts/check-and-fix-deployment.mjs
 */

import { execSync } from 'child_process';

const GITHUB_REPO = 'Mobo4/dryeyela-hydrogen';
const REQUIRED_SECRET = 'OXYGEN_DEPLOYMENT_TOKEN_1000013955';

console.log('🔄 Ralph Loop: Check and Fix Deployment\n');
console.log('=' .repeat(60) + '\n');

// Check if secret exists (we can't read the value, but can check if it exists)
function checkSecretExists() {
  try {
    // List all secrets (names only)
    const output = execSync(
      `gh secret list --repo ${GITHUB_REPO}`,
      { encoding: 'utf-8', stdio: 'pipe' }
    );
    
    const secrets = output.split('\n').map(line => line.split(/\s+/)[0]).filter(Boolean);
    return secrets.includes(REQUIRED_SECRET);
  } catch (error) {
    // If command fails, assume we can't check (permissions issue)
    console.log('   ⚠️  Cannot check secrets (may need repo admin access)');
    return null;
  }
}

// Main Ralph Loop
async function ralphLoop() {
  console.log('🔍 VERIFY: Checking deployment setup...\n');
  
  // Check 1: Secret exists?
  console.log('1️⃣  Checking GitHub Secrets...');
  const secretExists = checkSecretExists();
  
  if (secretExists === false) {
    console.log('   ❌ Secret NOT found: ' + REQUIRED_SECRET);
    console.log('\n💡 REFINE: Fix Required\n');
    console.log('   📋 Steps to add deployment token:\n');
    console.log('   1. Get token from Shopify:');
    console.log('      - Shopify Partners → Apps → Your App → Hydrogen → Deployments');
    console.log('      - Click "Create deployment token"');
    console.log('      - Copy the token\n');
    console.log('   2. Add to GitHub Secrets:');
    console.log('      - Go to: https://github.com/Mobo4/dryeyela-hydrogen/settings/secrets/actions');
    console.log('      - Click "New repository secret"');
    console.log('      - Name: ' + REQUIRED_SECRET);
    console.log('      - Secret: Paste token');
    console.log('      - Click "Add secret"\n');
    console.log('   3. After adding, run this script again to verify\n');
    
    console.log('⏸️  Waiting for you to add the secret...');
    console.log('   Press Ctrl+C to exit, then run again after adding secret\n');
    
    // Wait and check again
    let attempts = 0;
    const maxWait = 60; // Wait up to 60 checks (10 minutes)
    
    while (attempts < maxWait) {
      await sleep(10000); // Check every 10 seconds
      attempts++;
      
      const exists = checkSecretExists();
      if (exists === true) {
        console.log('\n✅ Secret found! Continuing to monitor build...\n');
        break;
      } else if (exists === false) {
        process.stdout.write(`\r   Still waiting... (${attempts}/${maxWait})`);
      }
    }
    
    if (attempts >= maxWait) {
      console.log('\n\n⏱️  Timeout waiting for secret. Please add it manually and run again.\n');
      process.exit(1);
    }
  } else if (secretExists === true) {
    console.log('   ✅ Secret exists: ' + REQUIRED_SECRET);
  } else {
    console.log('   ⚠️  Cannot verify (check manually)');
  }
  
  console.log('\n2️⃣  Monitoring build status...\n');
  
  // Now monitor the build
  const { spawn } = await import('child_process');
  
  // Run the Ralph loop check build script
  const ralphProcess = spawn('node', [
    'scripts/ralph-loop-check-build.mjs',
    '--max-attempts', '60',
    '--interval', '15'
  ], {
    cwd: process.cwd(),
    stdio: 'inherit'
  });
  
  ralphProcess.on('exit', (code) => {
    if (code === 0) {
      console.log('\n🎉 SUCCESS: Build completed successfully!\n');
    } else {
      console.log('\n❌ Build failed. Check logs above for details.\n');
    }
    process.exit(code);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main
async function main() {
  try {
    await ralphLoop();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
