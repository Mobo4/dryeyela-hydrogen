# Shopify App Credentials Setup

**Date:** February 2026  
**App ID:** `6fb6965ac343c320d244cdee6b60959f`  
**App Secret:** `shpss_xxxxxxxxxxxxx` (stored in `.env.local`, not committed)

---

## ✅ Credentials Configured

Your Shopify app credentials have been set up:

- **App ID:** `6fb6965ac343c320d244cdee6b60959f`
- **App Secret:** `shpss_xxxxxxxxxxxxx` (stored in `.env.local`, not committed to git)
- **Store Domain:** `dryeyela-ai.myshopify.com`

These are stored in `.env.local` (not committed to git).

---

## 🔐 Security Notes

**⚠️ IMPORTANT:**
- App Secret is sensitive - never commit to git
- `.env.local` is in `.gitignore` (safe)
- These credentials are for server-side use only
- Don't expose in client-side code

---

## 📋 What These Credentials Are For

### App ID & Secret
- Used for OAuth authentication
- Server-side API access
- Admin API operations
- App installation flows

### Storefront API Token (Still Needed)
You still need to get the **Storefront API Token** separately:

1. **Shopify Admin** → **Settings** → **Apps and sales channels**
2. Click **"Develop apps"**
3. Find your app (ID: `6fb6965ac343c320d244cdee6b60959f`)
4. Click **"API credentials"** tab
5. Under **"Storefront API"**, click **"Reveal token"**
6. Copy the token → Use as `PUBLIC_STOREFRONT_API_TOKEN`

---

## 🔧 Using These Credentials

### For Local Development

The credentials are in `.env.local` and will be loaded automatically by Hydrogen.

### For Shopify Oxygen Deployment

You need to add these to **Shopify Admin** → **Hydrogen** → **Environment variables**:

**Required Variables:**
- `PUBLIC_STOREFRONT_API_TOKEN` (get from app credentials)
- `PUBLIC_STORE_DOMAIN` = `dryeyela-ai.myshopify.com`
- `SESSION_SECRET` (generate with `openssl rand -base64 32`)

**Optional Variables:**
- `PUBLIC_STOREFRONT_ID` (from app credentials)
- `PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID` (if using customer accounts)
- `PUBLIC_CHECKOUT_DOMAIN` = `checkout.shopify.com`

**Note:** App ID and Secret are typically not needed as environment variables for Hydrogen - they're used during app installation/OAuth flows.

---

## 🚀 Next Steps

1. **Get Storefront API Token** (see above)
2. **Generate Session Secret:**
   ```bash
   openssl rand -base64 32
   ```
3. **Add to Shopify Oxygen Environment Variables:**
   - Go to: Shopify Admin → Hydrogen → Environment variables
   - Add all `PUBLIC_*` variables
   - Add `SESSION_SECRET`

4. **Test Connection:**
   ```bash
   shopify hydrogen link
   ```

5. **Deploy:**
   ```bash
   git push origin feature/hybrid-data-sync
   ```

---

## 📚 Related Documentation

- **Environment Variables:** `docs/CHROME_ERROR_SETUP.md`
- **Deployment Guide:** `docs/GITHUB_DEPLOYMENT_GUIDE.md`
- **Admin Setup:** `docs/SHOPIFY_ADMIN_SETUP.md`

---

## 🆘 Troubleshooting

**If credentials don't work:**
- Verify app is installed in your store
- Check app has correct API scopes enabled
- Ensure Storefront API is configured
- Verify store domain matches: `dryeyela-ai.myshopify.com`

**If Storefront API token is missing:**
- Go to app → API credentials → Storefront API
- Click "Install app" if not already installed
- Reveal and copy the token
