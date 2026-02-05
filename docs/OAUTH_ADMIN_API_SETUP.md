# OAuth Setup for Admin API Access Token

**Purpose:** Get Admin API access token via OAuth flow to manage Hydrogen deployments programmatically.

---

## 🔍 Understanding Token Types

### 1. Client ID & Secret (You Have These)
- **Client ID:** `6fb6965ac343c320d244cdee6b60959f`
- **Client Secret:** `shpss_xxxxxxxxxxxxx` (stored in `.env.local`)
- **Purpose:** Used to exchange authorization code for access token
- **Location:** `.env.local`

### 2. Admin API Access Token (Get via OAuth)
- **Purpose:** Make Admin API calls (query storefronts, manage deployments)
- **How to get:** Complete OAuth flow (see below)
- **Format:** `shpat_XXXXXXXXXXXXXXXXXXXXXXXXXXXX`
- **Location:** `.env.local` (after OAuth)

### 3. Oxygen Deployment Token (Different!)
- **Purpose:** Deploy Hydrogen storefronts via GitHub Actions
- **How to get:** Shopify Admin → Hydrogen → Deployments → Create token
- **Format:** 40+ character hex string
- **Location:** GitHub Secrets only

---

## 🚀 Get Admin API Access Token

### Step 1: Run OAuth Flow

```bash
cd /Users/alex/Documents/Projects/dryeyela-hydrogen
node scripts/get-admin-api-token.mjs
```

**What happens:**
1. Script generates OAuth URL
2. Opens browser (or shows URL to open)
3. You approve app installation
4. Shopify redirects to `localhost:3001`
5. Script exchanges code for access token
6. Token saved to `.env.local` as `SHOPIFY_ADMIN_ACCESS_TOKEN`

### Step 2: Verify Token

**Check `.env.local`:**
```bash
grep SHOPIFY_ADMIN_ACCESS_TOKEN .env.local
```

Should show: `SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxxxxxxxxxx`

---

## 🔧 Use Admin API Access Token

### Query Hydrogen Storefronts

```bash
node scripts/query-hydrogen-storefronts.mjs
```

**What it does:**
- Uses Admin API access token
- Queries GraphQL Admin API
- Shows Hydrogen storefronts
- Shows deployment tokens (if available)

### Use Token in Scripts

The token is now in `.env.local` and can be used by other scripts:

```javascript
const env = loadEnv();
const accessToken = env.SHOPIFY_ADMIN_ACCESS_TOKEN;

// Use in API calls
fetch(`https://${shop}.myshopify.com/admin/api/2024-10/products.json`, {
  headers: {
    'X-Shopify-Access-Token': accessToken,
  },
});
```

---

## 📋 OAuth Flow Details

### What Happens:

1. **Authorization Request:**
   ```
   GET https://{shop}.myshopify.com/admin/oauth/authorize?
     client_id={APP_ID}&
     scope={SCOPES}&
     redirect_uri={REDIRECT_URI}
   ```

2. **Merchant Approves:**
   - Shopify redirects to `redirect_uri` with `code` parameter

3. **Token Exchange:**
   ```
   POST https://{shop}.myshopify.com/admin/oauth/access_token
   {
     "client_id": "{APP_ID}",
     "client_secret": "{APP_SECRET}",
     "code": "{AUTHORIZATION_CODE}"
   }
   ```

4. **Response:**
   ```json
   {
     "access_token": "shpat_XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     "scope": "read_products,write_products,..."
   }
   ```

---

## ⚠️ Important Notes

### Admin API Access Token vs Deployment Token

**These are DIFFERENT:**

| Token | Purpose | How to Get | Where Used |
|-------|---------|------------|------------|
| **Admin API Access Token** | Admin API calls | OAuth flow | `.env.local`, API scripts |
| **Oxygen Deployment Token** | Deploy storefronts | Shopify Admin UI | GitHub Secrets only |

**You still need the Oxygen deployment token for GitHub Actions!**

The Admin API access token lets you:
- Query storefront information
- Check deployment status
- Manage storefronts via API

But it **does NOT** replace the deployment token for GitHub Actions.

---

## 🔑 Get Deployment Token (Still Needed)

Even after getting Admin API access token, you still need the **Oxygen deployment token**:

1. **Shopify Partners** → Apps → Your App → Hydrogen → Deployments
2. Click **"Create deployment token"**
3. Copy token (40+ characters)
4. Add to GitHub Secrets:
   ```bash
   gh secret set OXYGEN_DEPLOYMENT_TOKEN_1000013955 \
     --repo Mobo4/dryeyela-hydrogen \
     --body "DEPLOYMENT_TOKEN_HERE"
   ```

---

## 📚 Related Documentation

- **Token Format Guide:** `docs/TOKEN_FORMAT_GUIDE.md`
- **Get Deployment Token:** `docs/GET_CORRECT_DEPLOYMENT_TOKEN.md`
- **OAuth Documentation:** https://shopify.dev/docs/apps/auth/oauth
