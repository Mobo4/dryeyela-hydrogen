#!/usr/bin/env node

/**
 * Setup GitHub CLI for Ralph Loop Monitoring
 * 
 * Checks and helps set up GitHub CLI for build monitoring.
 */

import { execSync } from 'child_process';

console.log('🔧 GitHub CLI Setup for Ralph Loop\n');

// Check if gh is installed
function checkInstallation() {
  try {
    execSync('which gh', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

// Check authentication
function checkAuth() {
  try {
    execSync('gh auth status', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

// Main
if (!checkInstallation()) {
  console.log('❌ GitHub CLI not installed\n');
  console.log('📦 Install options:\n');
  console.log('   macOS (Homebrew):');
  console.log('     brew install gh\n');
  console.log('   npm:');
  console.log('     npm install -g @github/cli\n');
  console.log('   Then authenticate:');
  console.log('     gh auth login\n');
  process.exit(1);
}

console.log('✅ GitHub CLI installed\n');

if (!checkAuth()) {
  console.log('⚠️  GitHub CLI not authenticated\n');
  console.log('🔐 Authenticate with:');
  console.log('   gh auth login\n');
  console.log('   Follow the prompts to authenticate\n');
  process.exit(1);
}

console.log('✅ GitHub CLI authenticated\n');
console.log('🚀 Ready to run Ralph Loop!\n');
console.log('   Run: node scripts/ralph-loop-check-build.mjs\n');
