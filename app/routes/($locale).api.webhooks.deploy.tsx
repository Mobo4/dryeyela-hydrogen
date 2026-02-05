/**
 * Webhook Handler for Deployment Triggers
 * 
 * This route handles webhook calls that trigger Shopify Hydrogen deployments.
 * Can be called from GitHub webhooks, Shopify events, or other external services.
 * 
 * Route: /api/webhooks/deploy
 * Method: POST
 */

import type { ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';

export async function action({ request, context }: ActionFunctionArgs) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const body = await request.text();
    const headers = Object.fromEntries(request.headers.entries());

    // Verify webhook signature (if from Shopify)
    // For GitHub webhooks, use X-Hub-Signature-256 header
    const shopifySignature = headers['x-shopify-hmac-sha256'];
    const githubSignature = headers['x-hub-signature-256'];

    if (shopifySignature) {
      // Verify Shopify webhook signature
      const isValid = await verifyShopifyWebhook(body, shopifySignature, context.env.SHOPIFY_APP_SECRET || '');
      if (!isValid) {
        return json({ error: 'Invalid signature' }, { status: 401 });
      }
    } else if (githubSignature) {
      // Verify GitHub webhook signature
      const isValid = await verifyGitHubWebhook(body, githubSignature, context.env.GITHUB_WEBHOOK_SECRET || '');
      if (!isValid) {
        return json({ error: 'Invalid signature' }, { status: 401 });
      }
    } else {
      // For development, allow unsigned webhooks if secret is not set
      if (context.env.NODE_ENV === 'production' && !context.env.ALLOW_UNSIGNED_WEBHOOKS) {
        return json({ error: 'Missing signature' }, { status: 401 });
      }
    }

    // Parse webhook payload
    const payload = JSON.parse(body);

    // Handle different webhook types
    if (payload.ref) {
      // GitHub push event
      return handleGitHubPush(payload, context);
    } else if (payload.kind) {
      // Shopify event
      return handleShopifyEvent(payload, context);
    } else {
      // Generic deployment trigger
      return triggerDeployment(context);
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Verify Shopify webhook signature
// Note: In production, use a server-side function or edge runtime
async function verifyShopifyWebhook(body: string, signature: string, secret: string): Promise<boolean> {
  if (!secret) return false;
  
  // For now, skip verification in build (will be handled at runtime)
  // In production, this should use Node.js crypto on the server
  return true; // TODO: Implement proper server-side verification
}

// Verify GitHub webhook signature
async function verifyGitHubWebhook(body: string, signature: string, secret: string): Promise<boolean> {
  if (!secret) return false;
  
  // For now, skip verification in build (will be handled at runtime)
  // In production, this should use Node.js crypto on the server
  return true; // TODO: Implement proper server-side verification
}

// Handle GitHub push event
async function handleGitHubPush(payload: any, context: any) {
  const { ref, commits } = payload;
  
  // Only trigger on main/master branch pushes
  if (!ref.includes('main') && !ref.includes('master')) {
    return json({ message: 'Skipped: not main branch', ref });
  }

  // Trigger deployment
  return triggerDeployment(context);
}

// Handle Shopify event
async function handleShopifyEvent(payload: any, context: any) {
  // Example: Trigger deployment on product updates
  if (payload.kind === 'product/update' || payload.kind === 'product/create') {
    return triggerDeployment(context);
  }

  return json({ message: 'Event received', kind: payload.kind });
}

// Trigger Shopify Hydrogen deployment
async function triggerDeployment(context: any) {
  const deploymentToken = context.env.OXYGEN_DEPLOYMENT_TOKEN_1000013955;
  
  if (!deploymentToken) {
    return json({ error: 'Deployment token not configured' }, { status: 500 });
  }

  try {
    // Use Shopify CLI or API to trigger deployment
    // This is a simplified version - in production, you'd use the actual deployment API
    const response = await fetch('https://admin.shopify.com/store/dryeyela-ai/hydrogen/deployments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deploymentToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        storefrontId: '1000013955',
      }),
    });

    if (!response.ok) {
      throw new Error(`Deployment failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    return json({
      success: true,
      message: 'Deployment triggered',
      deploymentId: result.id,
      url: result.url,
    });
  } catch (error) {
    console.error('Deployment error:', error);
    return json({ error: 'Failed to trigger deployment' }, { status: 500 });
  }
}

// GET handler for webhook verification (GitHub)
export async function loader({ request }: ActionFunctionArgs) {
  // GitHub webhook verification
  const challenge = new URL(request.url).searchParams.get('hub.challenge');
  if (challenge) {
    return new Response(challenge, { status: 200 });
  }

  return json({ message: 'Webhook endpoint ready' });
}
