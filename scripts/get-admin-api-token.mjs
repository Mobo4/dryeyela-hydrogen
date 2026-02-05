#!/usr/bin/env node

/**
 * Get Shopify Admin API Access Token via OAuth
 * 
 * Completes OAuth flow to get Admin API access token for managing deployments.
 * 
 * Usage:
 *   node scripts/get-admin-api-token.mjs
 */

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { execSync } from 'child_process';
import { createServer } from 'http';

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

// OAuth configuration
const SHOPIFY_OAUTH_SCOPES = [
  'read_products',
  'write_products',
  'read_orders',
  'read_content',
  'read_customers',
  'read_script_tags',
  'write_script_tags',
].join(',');

async function getAdminApiToken() {
  const env = loadEnv();
  const { SHOPIFY_APP_ID, SHOPIFY_APP_SECRET, PUBLIC_STORE_DOMAIN } = env;
  
  if (!SHOPIFY_APP_ID || !SHOPIFY_APP_SECRET) {
    throw new Error('SHOPIFY_APP_ID and SHOPIFY_APP_SECRET required in .env.local');
  }
  
  const shop = PUBLIC_STORE_DOMAIN.replace('.myshopify.com', '');
  const redirectUri = 'http://localhost:3001/oauth/callback';
  
  console.log('🔐 Shopify Admin API OAuth Flow\n');
  console.log('=' .repeat(60));
  console.log(`App ID: ${SHOPIFY_APP_ID}`);
  console.log(`Store: ${shop}.myshopify.com`);
  console.log(`Scopes: ${SHOPIFY_OAUTH_SCOPES}`);
  console.log('=' .repeat(60) + '\n');
  
  // Step 1: Generate OAuth URL
  const oauthUrl = `https://${shop}.myshopify.com/admin/oauth/authorize?` +
    `client_id=${SHOPIFY_APP_ID}&` +
    `scope=${SHOPIFY_OAUTH_SCOPES}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}`;
  
  console.log('📋 Step 1: Authorize App\n');
  console.log('1. Open this URL in your browser:');
  console.log(`   ${oauthUrl}\n`);
  console.log('2. Approve the app installation');
  console.log('3. You will be redirected to localhost:3001\n');
  
  // Step 2: Start local server to catch callback
  return new Promise((resolve, reject) => {
    const server = createServer(async (req, res) => {
      const url = new URL(req.url, `http://${req.headers.host}`);
      
      if (url.pathname === '/oauth/callback') {
        const code = url.searchParams.get('code');
        const shopParam = url.searchParams.get('shop');
        
        if (!code) {
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end('<h1>Error: No authorization code received</h1>');
          server.close();
          reject(new Error('No authorization code'));
          return;
        }
        
        console.log('\n✅ Authorization code received!\n');
        console.log('📋 Step 2: Exchanging code for access token...\n');
        
        // Step 3: Exchange code for access token
        try {
          const tokenResponse = await fetch(`https://${shop}.myshopify.com/admin/oauth/access_token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              client_id: SHOPIFY_APP_ID,
              client_secret: SHOPIFY_APP_SECRET,
              code: code,
            }),
          });
          
          if (!tokenResponse.ok) {
            const error = await tokenResponse.text();
            throw new Error(`Token exchange failed: ${tokenResponse.statusText} - ${error}`);
          }
          
          const tokenData = await tokenResponse.json();
          const accessToken = tokenData.access_token;
          
          console.log('✅ Access token obtained!\n');
          console.log('=' .repeat(60));
          console.log(`Access Token: ${accessToken.substring(0, 20)}...`);
          console.log(`Scopes: ${tokenData.scope || 'N/A'}`);
          console.log('=' .repeat(60) + '\n');
          
          // Save to .env.local
          let envContent = readFileSync(envLocalPath, 'utf-8');
          
          if (envContent.includes('SHOPIFY_ADMIN_ACCESS_TOKEN=')) {
            envContent = envContent.replace(
              /SHOPIFY_ADMIN_ACCESS_TOKEN=.*/,
              `SHOPIFY_ADMIN_ACCESS_TOKEN=${accessToken}`
            );
          } else {
            envContent += `\n# Admin API Access Token (from OAuth)\nSHOPIFY_ADMIN_ACCESS_TOKEN=${accessToken}\n`;
          }
          
          writeFileSync(envLocalPath, envContent);
          console.log('✅ Access token saved to .env.local\n');
          
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <h1>✅ Success!</h1>
            <p>Access token obtained and saved to .env.local</p>
            <p>You can close this window.</p>
            <script>setTimeout(() => window.close(), 3000);</script>
          `);
          
          server.close();
          resolve(accessToken);
          
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'text/html' });
          res.end(`<h1>Error</h1><p>${error.message}</p>`);
          server.close();
          reject(error);
        }
      } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
      }
    });
    
    server.listen(3001, () => {
      console.log('🌐 Local server started on http://localhost:3001');
      console.log('   Waiting for OAuth callback...\n');
      console.log('💡 Open the URL above in your browser\n');
    });
    
    // Timeout after 5 minutes
    setTimeout(() => {
      server.close();
      reject(new Error('OAuth timeout - no callback received within 5 minutes'));
    }, 300000);
  });
}

// Main
async function main() {
  try {
    const accessToken = await getAdminApiToken();
    
    console.log('🚀 Next Steps:\n');
    console.log('1. Use Admin API to query Hydrogen storefronts:');
    console.log('   node scripts/query-hydrogen-storefronts.mjs\n');
    console.log('2. Get deployment token via API (if available)');
    console.log('3. Or get deployment token from Shopify Admin UI\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
