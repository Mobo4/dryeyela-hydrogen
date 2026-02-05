# Blank Page Troubleshooting Guide

**Issue:** The deployed site at `https://dryeyela-ai-a5f3264567a9c264ad2d.o2.myshopify.dev/` shows a blank page.

## 🔍 Most Common Causes

### 1. Missing Required Environment Variables

The Hydrogen storefront **requires** these environment variables to work:

#### **Critical (Required for Site to Load):**
```
SESSION_SECRET
PUBLIC_STOREFRONT_API_TOKEN
PUBLIC_STORE_DOMAIN
PUBLIC_STOREFRONT_ID
PUBLIC_CHECKOUT_DOMAIN
PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID
PUBLIC_CUSTOMER_ACCOUNT_API_URL
SHOP_ID
```

#### **Optional (For App Integrations):**
```
PUBLIC_JUDGEME_SHOP_DOMAIN
PUBLIC_GORGIAS_APP_ID
PUBLIC_KLAVIYO_API_KEY
```

## ✅ Step-by-Step Fix

### Step 1: Check Environment Variables in Shopify Admin

1. Go to: **Shopify Admin** → **Hydrogen** (or **Headless**)
2. Click **"Environment variables"** tab
3. Verify ALL required variables are set (see list above)

### Step 2: Get Missing Values

#### **SESSION_SECRET**
- Generate a random string (32+ characters)
- Example: `openssl rand -base64 32`
- Or use: https://randomkeygen.com/

#### **PUBLIC_STOREFRONT_API_TOKEN**
1. Shopify Admin → **Apps** → **Manage private apps**
2. Create a new private app (or use existing)
3. Enable **Storefront API** access
4. Copy the **Storefront API access token**

#### **PUBLIC_STORE_DOMAIN**
- Your store domain: `dryeyela-ai.myshopify.com` (or your actual domain)

#### **PUBLIC_STOREFRONT_ID**
1. Shopify Admin → **Settings** → **Apps and sales channels**
2. Click **"Develop apps"**
3. Find your Storefront API app
4. Copy the **Storefront ID** (looks like: `gid://shopify/Storefront/123456`)

#### **PUBLIC_CHECKOUT_DOMAIN**
- Usually: `checkout.shopify.com` or your custom checkout domain

#### **PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID**
1. Shopify Admin → **Hydrogen** → **Customer Account API**
2. Copy the **Client ID**

#### **PUBLIC_CUSTOMER_ACCOUNT_API_URL**
- Usually: `https://shopify.com` or your custom domain

#### **SHOP_ID**
1. Shopify Admin → **Settings** → **Plan and permissions**
2. Copy your **Shop ID** (numeric, like: `12345678`)

### Step 3: Add Missing Variables

1. In Shopify Admin → **Hydrogen** → **Environment variables**
2. Click **"Add variable"** for each missing one
3. Enter the **exact variable name** (case-sensitive!)
4. Enter the **value**
5. Click **"Save"**

### Step 4: Redeploy

After adding environment variables, trigger a new deployment:

```bash
cd /Users/alex/Documents/Projects/dryeyela-hydrogen
git commit --allow-empty -m "Trigger deployment after env var update"
git push origin feature/hybrid-data-sync
```

Or push any code change to trigger deployment.

## 🔍 Debugging Steps

### Check Browser Console

1. Open the blank page: `https://dryeyela-ai-a5f3264567a9c264ad2d.o2.myshopify.dev/`
2. Press `F12` (or right-click → Inspect)
3. Go to **Console** tab
4. Look for **red error messages**
5. Common errors:
   - `SESSION_SECRET environment variable is not set`
   - `PUBLIC_STOREFRONT_API_TOKEN is required`
   - `Failed to fetch` (API errors)

### Check Network Tab

1. In browser DevTools, go to **Network** tab
2. Refresh the page
3. Look for failed requests (red status codes)
4. Check the **Response** tab for error messages

### Check GitHub Actions Logs

1. Go to: https://github.com/Mobo4/dryeyela-hydrogen/actions
2. Click the latest workflow run
3. Check for build/deployment errors
4. Look for environment variable warnings

## 🚨 Common Error Messages

### "SESSION_SECRET environment variable is not set"
- **Fix:** Add `SESSION_SECRET` in Shopify Admin → Environment variables

### "PUBLIC_STOREFRONT_API_TOKEN is required"
- **Fix:** Add `PUBLIC_STOREFRONT_API_TOKEN` with your Storefront API token

### "Failed to query storefront"
- **Fix:** Check that `PUBLIC_STOREFRONT_API_TOKEN` is valid and has correct permissions

### "Storefront ID mismatch"
- **Fix:** Verify `PUBLIC_STOREFRONT_ID` matches your Storefront API app ID

## 📋 Quick Checklist

- [ ] All 8 required environment variables are set
- [ ] Variable names are **exactly** as shown (case-sensitive)
- [ ] Values are correct (no extra spaces)
- [ ] Storefront API token has proper permissions
- [ ] Deployment completed successfully (check GitHub Actions)
- [ ] Browser console shows no errors
- [ ] Network tab shows successful API requests

## 🆘 Still Not Working?

1. **Check deployment logs** in GitHub Actions
2. **Verify environment variables** are saved (not just typed)
3. **Try a fresh deployment** (push a small change)
4. **Check Shopify Admin** → Hydrogen → Deployments for error messages
5. **Contact Shopify Support** if deployment keeps failing

## 📝 Notes

- Environment variables are **case-sensitive**
- Changes to environment variables require a **new deployment** to take effect
- The deployment URL format: `https://[storefront-id].o2.myshopify.dev/`
- Preview deployments use the same environment variables as production
