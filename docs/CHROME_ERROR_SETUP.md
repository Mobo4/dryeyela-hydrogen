# Chrome Error: 404 Page - Setup Instructions

## 🔍 What You're Seeing

**Error:** The page shows a **404 error** (black page with "404" text)

**What this means:** Your deployment exists, but the storefront can't load because **environment variables are missing**.

---

## ✅ Where to Go: Shopify Admin Setup

### Step 1: Open Shopify Admin

1. Go to: **https://admin.shopify.com/store/dryeyela-ai**
2. Log in if needed

### Step 2: Navigate to Hydrogen Settings

**Path:** `Settings` → `Apps and sales channels` → Find **"Hydrogen"** or **"Headless"**

**OR** direct link (if available):
- Look for **"Hydrogen"** or **"Headless"** in the left sidebar
- Click on it

### Step 3: Go to Environment Variables

1. In the Hydrogen/Headless section, click the **"Environment variables"** tab
2. You'll see a list (probably empty or partially filled)

---

## 🔑 Required Environment Variables

**You MUST add these 8 variables:**

### 1. SESSION_SECRET
- **Generate:** Open Terminal and run: `openssl rand -base64 32`
- **Or use:** https://randomkeygen.com/ (select "CodeIgniter Encryption Keys")
- Copy the generated string

### 2. PUBLIC_STOREFRONT_API_TOKEN
**Where to get it:**
1. In Shopify Admin → **Settings** → **Apps and sales channels**
2. Click **"Develop apps"** (or **"Manage private apps"**)
3. Click **"Create an app"**
4. Name: `Hydrogen Storefront`
5. Click **"Configure Storefront API scopes"**
6. Check: `unauthenticated_read_product_listings`
7. Click **"Save"**
8. Click **"Install app"**
9. Go to **"API credentials"** tab
10. Under **"Storefront API"**, click **"Reveal token"**
11. **Copy the token** (long string)

### 3. PUBLIC_STORE_DOMAIN
- **Value:** `dryeyela-ai.myshopify.com`
- (Your store's domain)

### 4. PUBLIC_STOREFRONT_ID
**Where to get it:**
1. Same app as above (Hydrogen Storefront)
2. In **"API credentials"** tab
3. Look for **"Storefront ID"**
4. Copy it (looks like: `gid://shopify/Storefront/123456`)

### 5. PUBLIC_CHECKOUT_DOMAIN
- **Value:** `checkout.shopify.com`
- (Standard Shopify checkout domain)

### 6. PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID
**Where to get it:**
1. In Shopify Admin → **Hydrogen** → **Customer Account API**
2. Look for **"Client ID"**
3. Copy it

### 7. PUBLIC_CUSTOMER_ACCOUNT_API_URL
- **Value:** `https://shopify.com`
- (Standard Shopify URL)

### 8. SHOP_ID
**Where to get it:**
1. Shopify Admin → **Settings** → **Plan and permissions**
2. Look for **"Shop ID"** (numeric, like: `12345678`)
3. Copy it

---

## 📝 How to Add Each Variable

For **each** variable above:

1. In **Environment variables** tab, click **"Add variable"**
2. **Name:** Copy the EXACT name (case-sensitive!)
   - Example: `PUBLIC_STOREFRONT_API_TOKEN` (not `public_storefront_api_token`)
3. **Value:** Paste the value you copied
4. Click **"Save"**

**Repeat for all 8 variables.**

---

## 🚀 After Adding Variables

### Step 1: Trigger New Deployment

After adding all variables, you need to trigger a new deployment:

**Option A: Push code (recommended)**
```bash
cd /Users/alex/Documents/Projects/dryeyela-hydrogen
git push origin feature/hybrid-data-sync
```

**Option B: Empty commit**
```bash
cd /Users/alex/Documents/Projects/dryeyela-hydrogen
git commit --allow-empty -m "Trigger deployment after env vars"
git push origin feature/hybrid-data-sync
```

### Step 2: Wait for Deployment

1. Go to: **Shopify Admin** → **Hydrogen** → **Deployments**
2. Wait 2-3 minutes for deployment to complete
3. Look for **green checkmark** ✅

### Step 3: Check Your Site

1. Go back to: `https://dryeyela-ai-a5f3264567a9c264ad2d.o2.myshopify.dev/`
2. Refresh the page
3. It should now load! 🎉

---

## 🆘 Still Getting 404?

### Check These:

1. **Variable Names:** Are they EXACTLY as shown? (case-sensitive)
2. **Variable Values:** Did you copy the FULL value? (no spaces before/after)
3. **Deployment Status:** Is it showing ✅ (green) or ❌ (red)?
4. **GitHub Actions:** Check https://github.com/Mobo4/dryeyela-hydrogen/actions
   - Look for any build errors

### Common Mistakes:

- ❌ `public_storefront_api_token` (wrong - lowercase)
- ✅ `PUBLIC_STOREFRONT_API_TOKEN` (correct - uppercase)

- ❌ `PUBLIC_STOREFRONT_API_TOKEN ` (wrong - extra space)
- ✅ `PUBLIC_STOREFRONT_API_TOKEN` (correct - no spaces)

---

## 📍 Quick Reference Links

- **Shopify Admin:** https://admin.shopify.com/store/dryeyela-ai
- **GitHub Actions:** https://github.com/Mobo4/dryeyela-hydrogen/actions
- **Your Site:** https://dryeyela-ai-a5f3264567a9c264ad2d.o2.myshopify.dev/

---

## ✅ Checklist

- [ ] Opened Shopify Admin
- [ ] Found Hydrogen/Headless settings
- [ ] Opened Environment variables tab
- [ ] Added all 8 required variables
- [ ] Verified variable names are exact (case-sensitive)
- [ ] Verified values are correct (no extra spaces)
- [ ] Triggered new deployment (git push)
- [ ] Waited for deployment to complete (2-3 min)
- [ ] Checked site again (should work now!)
