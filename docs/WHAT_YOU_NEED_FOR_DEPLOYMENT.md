# What You Need for Hydrogen Deployment

**Quick Answer:** You need to create a **Shopify App** (not a dev store) to get the API token.

---

## ✅ What You DON'T Need

- ❌ **Dev Store** - You can use your existing Shopify store (`dryeyela-ai`)
- ❌ **Shopify Plus** - Hydrogen works on regular Shopify plans (but check if Hydrogen channel is available)
- ❌ **Separate Account** - Use your existing Shopify account

---

## ✅ What You DO Need

### 1. **Shopify App** (Required - 5 minutes)

**Why:** You need a Storefront API token to connect your Hydrogen storefront to Shopify.

**How to create:**

1. **Go to Shopify Admin:**
   - Navigate to: **Settings** → **Apps and sales channels**
   - Click **"Develop apps"** (or **"Manage private apps"**)

2. **Create New App:**
   - Click **"Create an app"**
   - Name: `Hydrogen Storefront` (or any name you like)
   - Click **"Create app"**

3. **Configure Storefront API:**
   - Click **"Configure Storefront API scopes"**
   - Enable these permissions:
     - ✅ `unauthenticated_read_product_listings`
     - ✅ `unauthenticated_read_products`
     - ✅ `unauthenticated_read_collections`
     - ✅ `unauthenticated_read_content`
   - Click **"Save"**

4. **Install App:**
   - Click **"Install app"** button
   - Confirm installation

5. **Get the Token:**
   - Click **"API credentials"** tab
   - Scroll to **"Storefront API"** section
   - Click **"Reveal token"** (or **"Reveal"**)
   - **Copy the token** (long string like `shpat_xxxxxxxxxxxxx`)
   - ⚠️ **Save this token!** You'll need it for environment variables

6. **Use the Token:**
   - Go to: **Hydrogen** → **Environment variables**
   - Add variable: `PUBLIC_STOREFRONT_API_TOKEN`
   - Value: Paste the token you copied

---

### 2. **Hydrogen Channel** (Check if enabled)

**How to check:**

1. Go to: **Settings** → **Channels** → Look for **"Hydrogen"** or **"Headless"**
2. If you see it: ✅ You're good!
3. If you don't see it:
   - Try: **Apps** → Search for **"Hydrogen"**
   - Or: **Settings** → **Apps and sales channels** → **Hydrogen**
   - If still not there, you may need to enable it or contact Shopify support

---

### 3. **GitHub Repository Connection** (One-time setup)

**Already done!** Your repo is: `Mobo4/dryeyela-hydrogen`

**To verify:**
1. Go to: **Hydrogen** → **Deployments**
2. Check if your GitHub repo is connected
3. If not, click **"Connect GitHub repository"**

---

### 4. **Deployment Token** (Required for GitHub Actions)

**This is different from the Storefront API token!**

**How to get:**

1. Go to: **Hydrogen** → **Deployments** tab
2. Click **"Create deployment token"** or **"Generate token"**
3. **Copy the token** immediately
4. Add to GitHub Secrets:
   - Go to: https://github.com/Mobo4/dryeyela-hydrogen/settings/secrets/actions
   - Click **"New repository secret"**
   - Name: `OXYGEN_DEPLOYMENT_TOKEN_1000013955`
   - Value: Paste the token
   - Click **"Add secret"**

---

## 📋 Complete Setup Checklist

- [ ] **Shopify App created** (Settings → Apps → Develop apps → Create app)
- [ ] **Storefront API token obtained** (From the app you created)
- [ ] **Storefront API token added** to Hydrogen → Environment variables as `PUBLIC_STOREFRONT_API_TOKEN`
- [ ] **Hydrogen channel enabled** (Check Settings → Channels → Hydrogen)
- [ ] **GitHub repository connected** (Hydrogen → Shows your repo)
- [ ] **Deployment token created** (Hydrogen → Deployments → Create token)
- [ ] **Deployment token added** to GitHub Secrets (`OXYGEN_DEPLOYMENT_TOKEN_1000013955`)
- [ ] **Environment variables set** (At minimum: `PUBLIC_STOREFRONT_API_TOKEN` and `PUBLIC_STORE_DOMAIN`)

---

## 🎯 Summary

**You need:**
1. ✅ **One Shopify App** (to get Storefront API token)
2. ✅ **One Deployment Token** (for GitHub Actions)
3. ✅ **Your existing Shopify store** (no dev store needed)

**You don't need:**
- ❌ Dev store
- ❌ Shopify Plus (usually)
- ❌ Multiple accounts

---

## 🆘 Common Questions

**Q: Can I use my existing store?**  
A: Yes! Use `dryeyela-ai.myshopify.com` - no dev store needed.

**Q: Do I need Shopify Plus?**  
A: Usually no, but Hydrogen channel availability depends on your plan. Check with Shopify support if you can't find it.

**Q: Can I use the same app for multiple things?**  
A: Yes, but it's better to create a dedicated app for Hydrogen to keep permissions organized.

**Q: What if I can't find "Develop apps"?**  
A: Try: Settings → Apps and sales channels → Manage private apps → Create app

---

## 📚 Next Steps

After creating the app and getting tokens:

1. **Set environment variables** in Hydrogen → Environment variables
2. **Add deployment token** to GitHub Secrets
3. **Push code** to trigger deployment
4. **Check deployments** in Hydrogen → Deployments tab

See `docs/SHOPIFY_ADMIN_SETUP.md` for detailed step-by-step instructions.
