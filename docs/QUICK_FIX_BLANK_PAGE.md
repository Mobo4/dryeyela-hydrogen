# Quick Fix: Blank Page / 404 Error

**Your site:** `https://dryeyela-ai-a5f3264567a9c264ad2d.o2.myshopify.dev/`  
**Status:** Returns 404 (blank page)

## 🚨 Immediate Action Required

### The Problem
The site is deployed but returning 404, which usually means:
1. **Missing environment variables** (most common)
2. **Deployment didn't complete** properly
3. **Route configuration issue**

## ✅ Quick Fix (5 Minutes)

### Step 1: Verify Environment Variables

Go to **Shopify Admin** → **Hydrogen** → **Environment variables**

**Check these 8 REQUIRED variables exist:**

```
✅ SESSION_SECRET
✅ PUBLIC_STOREFRONT_API_TOKEN
✅ PUBLIC_STORE_DOMAIN
✅ PUBLIC_STOREFRONT_ID
✅ PUBLIC_CHECKOUT_DOMAIN
✅ PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID
✅ PUBLIC_CUSTOMER_ACCOUNT_API_URL
✅ SHOP_ID
```

**If ANY are missing, add them:**

1. Click **"Add variable"**
2. Copy the **exact name** from above
3. Get the value (see Step 2)
4. Click **"Save"**

### Step 2: Get Missing Values

#### **SESSION_SECRET** (if missing)
- Generate: `openssl rand -base64 32`
- Or use: https://randomkeygen.com/ (use "CodeIgniter Encryption Keys")

#### **PUBLIC_STOREFRONT_API_TOKEN** (if missing)
1. Shopify Admin → **Settings** → **Apps and sales channels**
2. Click **"Develop apps"** → **"Create an app"**
3. Name: `Hydrogen Storefront`
4. Click **"Configure Storefront API scopes"**
5. Enable: `unauthenticated_read_product_listings`
6. Click **"Save"** → **"Install app"**
7. Go to **"API credentials"** → **"Storefront API"** → **"Reveal token"**
8. Copy token

#### **PUBLIC_STORE_DOMAIN** (if missing)
- Your store: `dryeyela-ai.myshopify.com` (or your actual domain)

#### **PUBLIC_STOREFRONT_ID** (if missing)
1. Same app as above → **"API credentials"**
2. Copy the **Storefront ID** (looks like: `gid://shopify/Storefront/123456`)

#### **PUBLIC_CHECKOUT_DOMAIN** (if missing)
- Usually: `checkout.shopify.com`

#### **PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID** (if missing)
1. Shopify Admin → **Hydrogen** → **Customer Account API**
2. Copy **Client ID**

#### **PUBLIC_CUSTOMER_ACCOUNT_API_URL** (if missing)
- Usually: `https://shopify.com`

#### **SHOP_ID** (if missing)
1. Shopify Admin → **Settings** → **Plan and permissions**
2. Copy **Shop ID** (numeric)

### Step 3: Trigger New Deployment

After adding variables, trigger a deployment:

```bash
cd /Users/alex/Documents/Projects/dryeyela-hydrogen
git commit --allow-empty -m "Trigger deployment - fix env vars"
git push origin feature/hybrid-data-sync
```

**Or** make a small change and push:
```bash
echo "# Deployment trigger" >> README.md
git add README.md
git commit -m "Trigger deployment"
git push origin feature/hybrid-data-sync
```

### Step 4: Wait & Check

1. Go to: https://github.com/Mobo4/dryeyela-hydrogen/actions
2. Wait for deployment to complete (2-3 minutes)
3. Check the site again: `https://dryeyela-ai-a5f3264567a9c264ad2d.o2.myshopify.dev/`

## 🔍 Still 404? Check These

### 1. Check Deployment Status
- Shopify Admin → **Hydrogen** → **Deployments**
- Look for **green checkmark** ✅
- If **red X** ❌, click to see error

### 2. Check GitHub Actions
- https://github.com/Mobo4/dryeyela-hydrogen/actions
- Click latest workflow
- Check for **build errors** or **deployment failures**

### 3. Check Browser Console
- Open the site
- Press `F12` → **Console** tab
- Look for **red errors**
- Common: "Failed to fetch", "Network error"

## 📞 Need Help?

If still not working after checking all above:
1. **Screenshot** the GitHub Actions error (if any)
2. **Screenshot** Shopify Admin → Hydrogen → Deployments
3. **Copy** any browser console errors
4. Share these for further debugging

## ✅ Success Checklist

- [ ] All 8 environment variables are set
- [ ] Variable names match exactly (case-sensitive)
- [ ] New deployment triggered
- [ ] Deployment completed successfully (green checkmark)
- [ ] Site loads (not blank/404)
- [ ] Browser console shows no errors
