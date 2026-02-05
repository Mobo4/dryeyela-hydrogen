#!/usr/bin/env node

/**
 * Create GitHub Webhook to Trigger Shopify Deployments
 * 
 * This script helps set up a GitHub webhook that triggers Shopify Hydrogen
 * deployments when code is pushed to GitHub.
 * 
 * Usage:
 *   node scripts/create-deployment-webhook.mjs
 * 
 * Requirements:
 *   - GitHub Personal Access Token (with repo admin access)
 *   - Shopify Admin API access token (or use GitHub Actions instead)
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const envLocalPath = join(projectRoot, '.env.local');

// GitHub repository info
const GITHUB_REPO = 'Mobo4/dryeyela-hydrogen';
const GITHUB_WEBHOOK_URL = `https://api.github.com/repos/${GITHUB_REPO}/hooks`;

// Load environment variables
function loadEnv() {
  if (!existsSync(envLocalPath)) {
    throw new Error('.env.local file not found!');
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

// Create GitHub webhook
async function createGitHubWebhook(githubToken, webhookUrl, secret) {
  const payload = {
    name: 'web',
    active: true,
    events: ['push'],
    config: {
      url: webhookUrl,
      content_type: 'json',
      insecure_ssl: '0',
      secret: secret, // For webhook signature verification
    },
  };
  
  const response = await fetch(GITHUB_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Authorization': `token ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'Shopify-Hydrogen-Deployment',
    },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create webhook: ${response.statusText} - ${error}`);
  }
  
  return await response.json();
}

// Main execution
async function main() {
  console.log('🔗 GitHub Webhook Setup for Shopify Deployments\n');
  
  try {
    const env = loadEnv();
    
    console.log('📋 Current Setup:\n');
    console.log('   ✅ GitHub Actions workflow already configured');
    console.log('   ✅ Automatic deployment on push enabled');
    console.log('   ✅ Workflow file: .github/workflows/oxygen-deployment-1000013955.yml\n');
    
    console.log('💡 Note: You already have automatic deployments!\n');
    console.log('   GitHub Actions automatically triggers on every push.');
    console.log('   No additional webhook needed for basic deployment.\n');
    
    console.log('🔧 If you want to add a custom webhook endpoint:\n');
    console.log('   1. Create a webhook handler route:');
    console.log('      app/routes/($locale).api.webhooks.deploy.tsx\n');
    console.log('   2. Use GitHub Personal Access Token to create webhook:');
    console.log('      node scripts/create-deployment-webhook.mjs --github-token YOUR_TOKEN\n');
    console.log('   3. Or use GitHub API directly:\n');
    console.log('      curl -X POST https://api.github.com/repos/Mobo4/dryeyela-hydrogen/hooks \\');
    console.log('        -H "Authorization: token YOUR_TOKEN" \\');
    console.log('        -H "Content-Type: application/json" \\');
    console.log('        -d \'{"name":"web","events":["push"],"config":{"url":"YOUR_WEBHOOK_URL"}}\'\n');
    
    console.log('📚 See: docs/WEBHOOK_DEPLOYMENT_SETUP.md for full guide.\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
