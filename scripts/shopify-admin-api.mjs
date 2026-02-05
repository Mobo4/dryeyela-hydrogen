#!/usr/bin/env node

/**
 * Shopify Admin API Client
 * 
 * Uses app credentials to interact with Shopify Admin API
 * for managing webhooks, app configuration, and deployments.
 * 
 * Usage:
 *   node scripts/shopify-admin-api.mjs <command> [options]
 * 
 * Commands:
 *   - list-webhooks          List all webhooks
 *   - create-webhook         Create a new webhook
 *   - delete-webhook <id>    Delete a webhook by ID
 *   - get-storefronts        List Hydrogen storefronts
 *   - trigger-deployment    Trigger a deployment
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createHmac } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const envLocalPath = join(projectRoot, '.env.local');

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

// Get Admin API access token using OAuth
async function getAdminApiToken(env) {
  const { SHOPIFY_APP_ID, SHOPIFY_APP_SECRET, PUBLIC_STORE_DOMAIN } = env;
  
  if (!SHOPIFY_APP_ID || !SHOPIFY_APP_SECRET) {
    throw new Error('SHOPIFY_APP_ID and SHOPIFY_APP_SECRET required in .env.local');
  }
  
  // For Admin API, we need an access token from OAuth flow
  // This is a simplified version - in production, you'd use the full OAuth flow
  console.log('⚠️  Note: Admin API requires OAuth access token.');
  console.log('   For webhook management, use Shopify Partners API or Admin API with access token.');
  console.log('   See: https://shopify.dev/docs/api/admin-rest/2024-10/resources/webhook\n');
  
  return null;
}

// List webhooks using Admin API
async function listWebhooks(storeDomain, accessToken) {
  const url = `https://${storeDomain}/admin/api/2024-10/webhooks.json`;
  
  const response = await fetch(url, {
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to list webhooks: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.webhooks || [];
}

// Create webhook using Admin API
async function createWebhook(storeDomain, accessToken, webhookData) {
  const url = `https://${storeDomain}/admin/api/2024-10/webhooks.json`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ webhook: webhookData }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create webhook: ${response.statusText} - ${error}`);
  }
  
  const data = await response.json();
  return data.webhook;
}

// Delete webhook using Admin API
async function deleteWebhook(storeDomain, accessToken, webhookId) {
  const url = `https://${storeDomain}/admin/api/2024-10/webhooks/${webhookId}.json`;
  
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete webhook: ${response.statusText}`);
  }
  
  return true;
}

// Get Hydrogen storefronts using GraphQL Admin API
async function getHydrogenStorefronts(storeDomain, accessToken) {
  const query = `
    query {
      hydrogenStorefronts(first: 10) {
        edges {
          node {
            id
            title
            productionUrl
            currentDeployment {
              id
              status
              url
            }
            gitHubRepository {
              owner
              name
            }
          }
        }
      }
    }
  `;
  
  const url = `https://${storeDomain}/admin/api/2024-10/graphql.json`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to query storefronts: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.data?.hydrogenStorefronts?.edges || [];
}

// Main CLI handler
async function main() {
  const [command, ...args] = process.argv.slice(2);
  
  if (!command) {
    console.log('Shopify Admin API Client\n');
    console.log('Usage: node scripts/shopify-admin-api.mjs <command> [options]\n');
    console.log('Commands:');
    console.log('  list-webhooks          List all webhooks');
    console.log('  create-webhook         Create a new webhook');
    console.log('  delete-webhook <id>    Delete a webhook by ID');
    console.log('  get-storefronts        List Hydrogen storefronts');
    console.log('\nNote: Admin API requires OAuth access token.');
    console.log('See: docs/ADMIN_API_SETUP.md for setup instructions.\n');
    process.exit(1);
  }
  
  try {
    const env = loadEnv();
    const { PUBLIC_STORE_DOMAIN } = env;
    
    // For Admin API, you need an OAuth access token
    // This would typically come from an OAuth flow
    // For now, we'll show instructions
    console.log('⚠️  Admin API requires OAuth access token.');
    console.log('   See: docs/ADMIN_API_SETUP.md for full setup.\n');
    
    if (command === 'get-storefronts') {
      console.log('📋 Hydrogen Storefronts:\n');
      console.log('   Use Shopify Partners API or GraphQL Admin API with access token.');
      console.log('   See: scripts/check-storefront-api.mjs for example.\n');
    } else if (command === 'list-webhooks') {
      console.log('📋 Webhooks:\n');
      console.log('   Use Admin API REST endpoint:');
      console.log('   GET https://' + PUBLIC_STORE_DOMAIN + '/admin/api/2024-10/webhooks.json\n');
      console.log('   Or use Shopify Partners API for app-level webhooks.\n');
    } else if (command === 'create-webhook') {
      console.log('📝 Create Webhook:\n');
      console.log('   Use Admin API REST endpoint:');
      console.log('   POST https://' + PUBLIC_STORE_DOMAIN + '/admin/api/2024-10/webhooks.json\n');
      console.log('   See: scripts/create-deployment-webhook.mjs for example.\n');
    } else {
      console.error(`Unknown command: ${command}`);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { listWebhooks, createWebhook, deleteWebhook, getHydrogenStorefronts };
