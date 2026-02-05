# Next Steps After App Credentials Setup

**Date:** February 5, 2026  
**App ID:** `6fb6965ac343c320d244cdee6b60959f`

---

## ✅ What's Done

- ✅ App credentials configured (`6fb6965ac343c320d244cdee6b60959f`)
- ✅ App secret stored in `.env.local`
- ✅ Session secret generated
- ✅ `.env.local` added to `.gitignore` (safe from git)

---

## 🔑 What You Still Need

### 1. Storefront API Token (Required)

**Get it from Shopify Admin:**

1. Go to: **https://admin.shopify.com/store/dryeyela-ai**
2. **Settings** → **Apps and sales channels**
3. Click **"Develop apps"**
4. Find app: `6fb6965ac343c320d244cdee6b60959f`
5. Click on the app
6. **"API credentials"** tab
7. Under **"Storefront API"**:
   - If not installed, click **"Install app"**
   - Click **"Reveal token"**
   - **Copy the token**

**Add it to:**
- `.env.local`: `PUBLIC_STOREFRONT_API_TOKEN=your_token`
- Shopify Oxygen → Environment variables

### 2. Storefront ID (Required)

**From the same app:**
- **"API credentials"** tab
- Look for **"Storefront ID"**
- Copy it (looks like: `gid://shopify/Storefront/123456`)

**Add it to:**
- `.env.local`: `PUBLIC_STOREFRONT_ID=your_storefront_id`
- Shopify Oxygen → Environment variables

### 3. Customer Account API Client ID (If using customer accounts)

**From Shopify Admin:**
- **Hydrogen** → **Customer Account API**
- Copy **Client ID**

**Add it to:**
- `.env.local`: `PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID=your_client_id`
- Shopify Oxygen → Environment variables

---

## ⚙️ Set Environment Variables in Shopify Oxygen

**Critical Step:** These must be set for deployments to work!

1. **Go to:** Shopify Admin → Hydrogen → Environment variables

2. **Add these variables:**

```
SESSION_SECRET=uD7QK0Dg6BHB1gGNak0jlR9iQgVxMlYUQ4GvB1d+AgU=
PUBLIC_STORE_DOMAIN=dryeyela-ai.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN=your_token_here
PUBLIC_STOREFRONT_ID=your_storefront_id_here
PUBLIC_CHECKOUT_DOMAIN=checkout.shopify.com
PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID=your_client_id_here
PUBLIC_CUSTOMER_ACCOUNT_API_URL=https://shopify.com/customer-account/api
```

**Important:** Replace `your_token_here`, `your_storefront_id_here`, and `your_client_id_here` with actual values!

---

## 🚀 After Setting Variables

### Test Locally

```bash
cd /Users/alex/Documents/Projects/dryeyela-hydrogen
npm run dev
```

Visit: http://localhost:3000

### Deploy to Shopify

```bash
git add .
git commit -m "feat: configure app credentials and environment setup"
git push origin feature/hybrid-data-sync
```

Check deployment: https://github.com/Mobo4/dryeyela-hydrogen/actions

---

## 📋 Quick Reference

**App Credentials:**
- App ID: `6fb6965ac343c320d244cdee6b60959f`
- App Secret: `shpss_xxxxxxxxxxxxx` (stored in `.env.local`, not committed)
- Store: `dryeyela-ai.myshopify.com`
- Session Secret: `uD7QK0Dg6BHB1gGNak0jlR9iQgVxMlYUQ4GvB1d+AgU=`

**Still Need:**
- Storefront API Token (from app credentials)
- Storefront ID (from app credentials)
- Customer Account API Client ID (from Hydrogen settings)

---

## 🆘 Troubleshooting

**If deployment fails:**
- Check all environment variables are set in Shopify Oxygen
- Verify Storefront API token is correct
- Check GitHub Actions logs for specific errors

**If site shows 404:**
- Verify `PUBLIC_STOREFRONT_API_TOKEN` is set
- Verify `PUBLIC_STORE_DOMAIN` is correct
- Check `SESSION_SECRET` is set

**If can't find app:**
- Make sure app is installed in your store
- Check app ID matches: `6fb6965ac343c320d244cdee6b60959f`
- Verify you're logged into the correct Shopify account

---

## 📚 Related Documentation

- **Credentials Setup:** `docs/APP_CREDENTIALS_SETUP.md`
- **Environment Variables:** `docs/CHROME_ERROR_SETUP.md`
- **Deployment Guide:** `docs/GITHUB_DEPLOYMENT_GUIDE.md`
