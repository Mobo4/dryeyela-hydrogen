# Token Format Guide - Fix "Error processing deployment token"

**Error:** `Error processing deployment token. Please check your token and try again.`

**Token provided:** `86360b8fcf51c6476adca419631ac43b` (32 characters)

---

## 🔍 Issue Identified

The token `86360b8fcf51c6476adca419631ac43b` is **32 characters**, which is:
- ✅ Correct length for some Shopify tokens
- ❌ **NOT** the correct format for Oxygen deployment tokens

**Oxygen deployment tokens are typically:**
- 40+ characters long
- Generated specifically from: Shopify Admin → Hydrogen → Deployments
- Different from Storefront API tokens or App secrets

---

## 🎯 What Token Types You Have

### 1. `86360b8fcf51c6476adca419631ac43b` (32 chars)
**This appears to be:**
- ✅ **Storefront API Token** (used for `PUBLIC_STOREFRONT_API_TOKEN`)
- ❌ **NOT** an Oxygen deployment token

**Where to use it:**
- `.env.local`: `PUBLIC_STOREFRONT_API_TOKEN=86360b8fcf51c6476adca419631ac43b`
- Shopify Oxygen Environment Variables: `PUBLIC_STOREFRONT_API_TOKEN`

### 2. `delivery@shopify-pubsub-webhooks.iam.gserviceaccount.com`
**This is:**
- ✅ **Webhook delivery service account** (already configured)
- Used for Google Cloud Pub/Sub webhook delivery

---

## 🔑 Get the CORRECT Deployment Token

**The token you need is DIFFERENT from the Storefront API token!**

### Step 1: Get Oxygen Deployment Token

1. **Go to Shopify Partners:**
   - https://partners.shopify.com/
   - Apps → Your App (`6fb6965ac343c320d244cdee6b60959f`)
   - Hydrogen → Storefront settings → Deployments

2. **OR go to Shopify Admin:**
   - https://admin.shopify.com/store/dryeyela-ai
   - Hydrogen → Deployments

3. **Create Deployment Token:**
   - Click **"Create deployment token"** or **"Generate token"**
   - **This is DIFFERENT from Storefront API token!**
   - Copy the token (should be 40+ characters)

4. **Add to GitHub Secrets:**
   ```bash
   gh secret set OXYGEN_DEPLOYMENT_TOKEN_1000013955 \
     --repo Mobo4/dryeyela-hydrogen \
     --body "YOUR_DEPLOYMENT_TOKEN_HERE"
   ```

---

## 📋 Token Summary

| Token Type | Value | Where to Use | Status |
|------------|-------|--------------|--------|
| **Storefront API Token** | `86360b8fcf51c6476adca419631ac43b` | `.env.local` + Shopify Oxygen | ✅ Added to .env.local |
| **Oxygen Deployment Token** | _(need to get)_ | GitHub Secrets | ⚠️ **NEEDED** |
| **Webhook Service Account** | `delivery@shopify-pubsub-webhooks.iam.gserviceaccount.com` | Webhook config | ✅ Configured |

---

## ✅ What I've Done

1. ✅ Added Storefront API token to `.env.local` (`PUBLIC_STOREFRONT_API_TOKEN`)
2. ✅ Added token to GitHub Secrets (but it's the wrong type)
3. ⚠️ Need correct Oxygen deployment token

---

## 🔧 Next Steps

### Option 1: Get Correct Deployment Token (Recommended)

1. **Get token from Shopify:**
   - Shopify Partners → Apps → Your App → Hydrogen → Deployments
   - Click "Create deployment token"
   - Copy the token (40+ chars)

2. **Update GitHub Secret:**
   ```bash
   gh secret set OXYGEN_DEPLOYMENT_TOKEN_1000013955 \
     --repo Mobo4/dryeyela-hydrogen \
     --body "NEW_DEPLOYMENT_TOKEN"
   ```

3. **Trigger deployment:**
   ```bash
   git commit --allow-empty -m "Test with correct deployment token"
   git push origin feature/hybrid-data-sync
   ```

### Option 2: Use Shopify CLI to Get Token

```bash
cd /Users/alex/Documents/Projects/dryeyela-hydrogen
shopify auth login
shopify hydrogen link
# This may show the deployment token or help you get it
```

---

## 🔍 Verify Token Types

**Run this to check what tokens you have:**
```bash
node scripts/verify-deployment-token.mjs
```

**Check GitHub Secrets:**
```bash
gh secret list --repo Mobo4/dryeyela-hydrogen
```

---

## 📚 Related Documentation

- **Deployment Token Setup:** `docs/FIX_DEPLOYMENT_EXIT_CODE_1.md`
- **Environment Variables:** `docs/FIND_ENVIRONMENT_VARIABLES.md`
- **Ralph Loop:** `docs/RALPH_LOOP_DEPLOYMENT.md`
