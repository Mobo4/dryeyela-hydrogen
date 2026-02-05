# Shopify Admin API Setup

**Purpose:** Use Shopify Admin API to manage app configuration, webhooks, and deployments.

---

## 🔑 Authentication

### Option 1: OAuth Access Token (Recommended)

**Get access token from app installation:**

1. **Install app in store:**
   - Go to: Shopify Partners → Apps → Your App (`6fb6965ac343c320d244cdee6b60959f`)
   - Click "Test on development store"
   - Authorize the app

2. **Get access token:**
   - After installation, Shopify redirects with `code` parameter
   - Exchange code for access token using OAuth flow
   - Store token in `.env.local` as `SHOPIFY_ADMIN_ACCESS_TOKEN`

### Option 2: Private App Access Token

**Create private app:**

1. **Shopify Admin** → **Settings** → **Apps and sales channels**
2. Click **"Develop apps"** → **"Create an app"**
3. Name: `Hydrogen Admin API`
4. **Configure Admin API scopes:**
   - `read_products`
   - `write_products`
   - `read_orders`
   - `read_webhooks`
   - `write_webhooks`
5. **Install app** → Get access token
6. Add to `.env.local`: `SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxxxxxxxxxx`

---

## 📋 Admin API Endpoints

### Webhooks

**List webhooks:**
```bash
GET https://dryeyela-ai.myshopify.com/admin/api/2024-10/webhooks.json
Headers:
  X-Shopify-Access-Token: YOUR_ACCESS_TOKEN
```

**Create webhook:**
```bash
POST https://dryeyela-ai.myshopify.com/admin/api/2024-10/webhooks.json
Headers:
  X-Shopify-Access-Token: YOUR_ACCESS_TOKEN
  Content-Type: application/json
Body:
{
  "webhook": {
    "topic": "products/update",
    "address": "https://your-domain.com/api/webhooks/deploy",
    "format": "json"
  }
}
```

**Delete webhook:**
```bash
DELETE https://dryeyela-ai.myshopify.com/admin/api/2024-10/webhooks/WEBHOOK_ID.json
Headers:
  X-Shopify-Access-Token: YOUR_ACCESS_TOKEN
```

### Hydrogen Storefronts (GraphQL)

**Query storefronts:**
```graphql
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
      }
    }
  }
}
```

**Endpoint:**
```bash
POST https://dryeyela-ai.myshopify.com/admin/api/2024-10/graphql.json
Headers:
  X-Shopify-Access-Token: YOUR_ACCESS_TOKEN
  Content-Type: application/json
```

---

## 🛠️ Using the Scripts

### List Webhooks

```bash
node scripts/shopify-admin-api.mjs list-webhooks
```

**Note:** Requires `SHOPIFY_ADMIN_ACCESS_TOKEN` in `.env.local`.

### Create Webhook

```bash
node scripts/create-deployment-webhook.mjs
```

### Get Storefronts

```bash
node scripts/shopify-admin-api.mjs get-storefronts
```

---

## 🔐 Security Best Practices

1. **Never commit access tokens** to git
2. **Use environment variables** for all secrets
3. **Rotate tokens** regularly
4. **Use minimal scopes** (only what's needed)
5. **Verify webhook signatures** always

---

## 📚 Related Documentation

- **Webhook Setup:** `docs/WEBHOOK_DEPLOYMENT_SETUP.md`
- **App Credentials:** `docs/APP_CREDENTIALS_SETUP.md`
- **Shopify Admin API:** https://shopify.dev/docs/api/admin-rest
