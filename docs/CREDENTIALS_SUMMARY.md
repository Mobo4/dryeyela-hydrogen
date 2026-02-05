# Shopify App Credentials - Summary

**Date:** February 5, 2026  
**Status:** ✅ Configured

---

## ✅ Credentials Configured

### App Credentials (Shopify Partners)
- **App ID:** `6fb6965ac343c320d244cdee6b60959f`
- **App Secret:** `shpss_xxxxxxxxxxxxx` (stored in `.env.local`, not committed)
- **Store Domain:** `dryeyela-ai.myshopify.com`
- **Session Secret:** `uD7QK0Dg6BHB1gGNak0jlR9iQgVxMlYUQ4GvB1d+AgU=` ✅ Generated
- **Webhook Delivery Service Account:** `delivery@shopify-pubsub-webhooks.iam.gserviceaccount.com` ✅ Added

### Still Needed
- ⚠️ **PUBLIC_STOREFRONT_API_TOKEN** - Get from Shopify Admin (see below)
- ⚠️ **PUBLIC_STOREFRONT_ID** - Get from same app
- ⚠️ **PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID** - Get from Hydrogen settings

---

## 📍 Where Credentials Are Stored

- **Local:** `.env.local` (not committed to git ✅)
- **Shopify Oxygen:** Need to add to Environment Variables (see below)

---

## 🔑 Get Storefront API Token

**Steps:**

1. **Go to Shopify Admin:**
   - https://admin.shopify.com/store/dryeyela-ai

2. **Navigate to Apps:**
   - Settings → Apps and sales channels
   - Click **"Develop apps"**

3. **Find Your App:**
   - Look for app ID: `6fb6965ac343c320d244cdee6b60959f`
   - Click on it

4. **Get Storefront API Token:**
   - Click **"API credentials"** tab
   - Scroll to **"Storefront API"** section
   - Click **"Reveal token"** (or **"Install app"** first if needed)
   - **Copy the token** (long string starting with `shpat_` or `shpca_`)

5. **Add to Files:**
   - Add to `.env.local`: `PUBLIC_STOREFRONT_API_TOKEN=your_token_here`
   - Add to Shopify Oxygen → Environment variables

---

## ⚙️ Set Environment Variables in Shopify Oxygen

**Go to:** Shopify Admin → Hydrogen → Environment variables

**Add these variables:**

| Variable Name | Value | Status |
|--------------|-------|--------|
| `SESSION_SECRET` | `uD7QK0Dg6BHB1gGNak0jlR9iQgVxMlYUQ4GvB1d+AgU=` | ✅ Ready |
| `PUBLIC_STORE_DOMAIN` | `dryeyela-ai.myshopify.com` | ✅ Ready |
| `PUBLIC_STOREFRONT_API_TOKEN` | _(get from app)_ | ⚠️ Need to get |
| `PUBLIC_STOREFRONT_ID` | _(get from app)_ | ⚠️ Need to get |
| `PUBLIC_CHECKOUT_DOMAIN` | `checkout.shopify.com` | ✅ Ready |
| `PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID` | _(get from Hydrogen)_ | ⚠️ Need to get |
| `PUBLIC_CUSTOMER_ACCOUNT_API_URL` | `https://shopify.com/customer-account/api` | ✅ Ready |

**Note:** `SHOPIFY_WEBHOOK_DELIVERY_SERVICE_ACCOUNT` is for webhook configuration, not typically needed as an environment variable in Hydrogen.

---

## 🚀 Next Steps

1. **Get Storefront API Token** (see instructions above)
2. **Add to `.env.local`:**
   ```bash
   PUBLIC_STOREFRONT_API_TOKEN=your_token_here
   ```
3. **Add to Shopify Oxygen Environment Variables:**
   - Go to: Hydrogen → Environment variables
   - Add all variables from the table above
4. **Get Storefront ID:**
   - Same app → API credentials → Storefront ID
   - Add to both `.env.local` and Shopify Oxygen
5. **Get Customer Account API Client ID:**
   - Hydrogen → Customer Account API → Copy Client ID
   - Add to both `.env.local` and Shopify Oxygen
6. **Configure Webhooks (if needed):**
   - See `docs/WEBHOOK_DELIVERY_SETUP.md` for webhook setup
   - Use service account: `delivery@shopify-pubsub-webhooks.iam.gserviceaccount.com`
7. **Deploy:**
   ```bash
   git push origin feature/hybrid-data-sync
   ```

---

## 🔐 Security Notes

✅ **Safe (Not Committed):**
- `.env.local` is in `.gitignore`
- App Secret is stored locally only
- Session Secret is generated and stored locally
- Webhook service account email is stored locally

⚠️ **For Shopify Oxygen:**
- Add `PUBLIC_*` variables to Shopify Admin → Hydrogen → Environment variables
- Add `SESSION_SECRET` to Shopify Oxygen (not public)
- **Never commit** `.env.local` to git

---

## 📚 Related Files

- **Local Config:** `.env.local` (your credentials)
- **Example:** `.env.local.example` (template)
- **Setup Script:** `scripts/setup-app-credentials.mjs`
- **Token Helper:** `scripts/get-storefront-token.mjs`
- **Webhook Setup:** `docs/WEBHOOK_DELIVERY_SETUP.md`

---

## ✅ Checklist

- [x] App credentials configured in `.env.local`
- [x] Session secret generated
- [x] Webhook delivery service account added
- [x] `.env.local` added to `.gitignore`
- [ ] Storefront API token obtained
- [ ] Storefront ID obtained
- [ ] Customer Account API Client ID obtained
- [ ] All variables added to Shopify Oxygen
- [ ] Webhooks configured (if needed)
- [ ] Deployment tested
