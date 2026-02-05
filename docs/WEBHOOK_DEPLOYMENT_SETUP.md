# Webhook Deployment Setup

**Purpose:** Configure webhooks to trigger Shopify Hydrogen deployments automatically.

---

## 🎯 Current Setup

**✅ You already have automatic deployments!**

Your GitHub Actions workflow (`.github/workflows/oxygen-deployment-1000013955.yml`) automatically triggers deployments on every push. No additional webhook needed for basic functionality.

---

## 🔧 Advanced: Custom Webhook Endpoint

If you want to trigger deployments from external services (Shopify events, CI/CD, etc.), you can set up a custom webhook endpoint.

### Option 1: GitHub Webhook → Your Endpoint

**Use case:** Trigger deployments from GitHub webhooks to your custom endpoint.

**Setup:**

1. **Create webhook handler** (already created):
   - Route: `app/routes/($locale).api.webhooks.deploy.tsx`
   - Handles POST requests to `/api/webhooks/deploy`

2. **Configure GitHub webhook:**
   ```bash
   # Using GitHub CLI
   gh api repos/Mobo4/dryeyela-hydrogen/hooks \
     -X POST \
     -f name=web \
     -f active=true \
     -f events[]=push \
     -f config[url]=https://your-domain.com/api/webhooks/deploy \
     -f config[content_type]=json \
     -f config[secret]=YOUR_WEBHOOK_SECRET
   ```

3. **Add webhook secret to environment:**
   ```env
   GITHUB_WEBHOOK_SECRET=your_secret_here
   ```

### Option 2: Shopify Webhook → Trigger Deployment

**Use case:** Trigger deployments when Shopify events occur (product updates, order changes, etc.).

**Setup:**

1. **Create webhook in Shopify Admin:**
   - Go to: Shopify Admin → Settings → Notifications → Webhooks
   - Click "Create webhook"
   - Event: `products/update` (or other events)
   - Format: JSON
   - URL: `https://your-domain.com/api/webhooks/deploy`

2. **Or use Admin API:**
   ```bash
   node scripts/create-shopify-webhook.mjs \
     --event products/update \
     --url https://your-domain.com/api/webhooks/deploy
   ```

---

## 📋 Using Shopify Admin API

### Setup Admin API Access

**Requirements:**
- App credentials (already configured)
- OAuth access token (from app installation)

**Get OAuth Access Token:**

1. **Install your app in a store:**
   - Go to: Shopify Partners → Apps → Your App
   - Click "Test on development store"
   - Authorize the app

2. **Get access token:**
   - After installation, Shopify provides an access token
   - Store it securely (add to `.env.local` as `SHOPIFY_ADMIN_ACCESS_TOKEN`)

### Admin API Scripts

**List webhooks:**
```bash
node scripts/shopify-admin-api.mjs list-webhooks
```

**Create webhook:**
```bash
node scripts/create-deployment-webhook.mjs
```

**Get Hydrogen storefronts:**
```bash
node scripts/shopify-admin-api.mjs get-storefronts
```

---

## 🔐 Webhook Security

### Signature Verification

The webhook handler (`app/routes/($locale).api.webhooks.deploy.tsx`) verifies signatures:

**GitHub webhooks:**
- Uses `X-Hub-Signature-256` header
- Verifies using `GITHUB_WEBHOOK_SECRET`

**Shopify webhooks:**
- Uses `X-Shopify-Hmac-Sha256` header
- Verifies using `SHOPIFY_APP_SECRET`

### Environment Variables

Add to `.env.local`:
```env
# Webhook secrets
GITHUB_WEBHOOK_SECRET=your_github_webhook_secret
SHOPIFY_APP_SECRET=shpss_xxxxxxxxxxxxx

# Admin API (if using)
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxxxxxxxxxx
```

---

## 🚀 Deployment Trigger Flow

### Current Flow (GitHub Actions)

```
Push to GitHub
  ↓
GitHub Actions triggers
  ↓
Build Hydrogen storefront
  ↓
Deploy to Shopify Oxygen
  ↓
Create preview URL
```

### Custom Webhook Flow

```
External Event (GitHub/Shopify/etc.)
  ↓
Webhook POST to /api/webhooks/deploy
  ↓
Verify signature
  ↓
Trigger deployment via Admin API
  ↓
Deploy to Shopify Oxygen
```

---

## 📝 Example: Trigger Deployment on Product Update

**Scenario:** Automatically redeploy when products are updated in Shopify.

**Setup:**

1. **Create Shopify webhook:**
   ```bash
   curl -X POST https://dryeyela-ai.myshopify.com/admin/api/2024-10/webhooks.json \
     -H "X-Shopify-Access-Token: YOUR_ACCESS_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "webhook": {
         "topic": "products/update",
         "address": "https://your-domain.com/api/webhooks/deploy",
         "format": "json"
       }
     }'
   ```

2. **Webhook handler processes event:**
   - Receives product update payload
   - Verifies signature
   - Triggers deployment

3. **Deployment runs:**
   - Builds Hydrogen storefront
   - Deploys to Oxygen
   - Updates preview URL

---

## 🛠️ Scripts Available

| Script | Purpose |
|--------|---------|
| `scripts/shopify-admin-api.mjs` | Admin API client utilities |
| `scripts/create-deployment-webhook.mjs` | Create GitHub webhook |
| `scripts/create-shopify-webhook.mjs` | Create Shopify webhook (to be created) |

---

## ✅ Checklist

- [x] GitHub Actions workflow configured (automatic deployments)
- [ ] Custom webhook endpoint created (`app/routes/($locale).api.webhooks.deploy.tsx`)
- [ ] Webhook secrets configured in `.env.local`
- [ ] GitHub webhook configured (if using)
- [ ] Shopify webhook configured (if using)
- [ ] Signature verification tested
- [ ] Deployment trigger tested

---

## 🆘 Troubleshooting

**Webhook not triggering:**
- Check webhook URL is accessible (not localhost)
- Verify signature verification is working
- Check webhook logs in Shopify Admin

**Deployment not starting:**
- Verify `OXYGEN_DEPLOYMENT_TOKEN_1000013955` is set
- Check Admin API access token is valid
- Review webhook handler logs

**Signature verification failing:**
- Ensure webhook secret matches
- Check signature header is present
- Verify body is not modified (no parsing before verification)

---

## 📚 Related Documentation

- **Webhook Delivery:** `docs/WEBHOOK_DELIVERY_SETUP.md`
- **Admin API:** `docs/ADMIN_API_SETUP.md` (to be created)
- **Deployment Guide:** `docs/FIRST_DEPLOYMENT_GUIDE.md`
