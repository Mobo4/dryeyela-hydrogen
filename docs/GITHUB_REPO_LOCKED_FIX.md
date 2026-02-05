# GitHub Repository Locked - Fix Guide

**Problem:** When trying to create a Hydrogen storefront, GitHub repo shows as "locked" or "already connected".

---

## 🔍 Why This Happens

Your repository `Mobo4/dryeyela-hydrogen` is **already connected** to a Hydrogen storefront (ID: `1000013955`).

**Evidence:** Your workflow file shows:
```yaml
#! oxygen_storefront_id: 1000013955
```

This means Shopify already knows about your repo and has it linked to a storefront.

---

## ✅ Solution: Use Existing Storefront (Recommended)

**You don't need to create a new storefront!** Your repo is already connected.

### Step 1: Find Your Existing Storefront

1. **Go to Shopify Admin:**
   - Navigate to: **Settings** → **Channels** → **Hydrogen** (or **Headless**)
   - Or: **Apps** → **Hydrogen**

2. **Check Deployments:**
   - Click **"Deployments"** tab
   - You should see your storefront listed (ID: `1000013955`)

3. **If you see it:**
   - ✅ Your repo is already connected!
   - Skip to "Next Steps" below

---

## 🔧 Solution: Disconnect and Reconnect (If Needed)

**Only do this if you can't find the existing storefront or want to start fresh.**

### Option A: Disconnect from Shopify Admin

1. **Go to Hydrogen Settings:**
   - Shopify Admin → Hydrogen → Deployments

2. **Find Connected Repository:**
   - Look for `Mobo4/dryeyela-hydrogen`
   - Click **"Disconnect"** or **"Unlink repository"**

3. **Confirm Disconnection:**
   - This will remove the connection
   - Your code stays in GitHub (safe!)

4. **Reconnect:**
   - Click **"Connect GitHub repository"**
   - Select `Mobo4/dryeyela-hydrogen`
   - Click **"Connect"**

### Option B: Remove GitHub App Authorization

If Option A doesn't work:

1. **Go to GitHub:**
   - https://github.com/settings/applications
   - Click **"Authorized GitHub Apps"** tab

2. **Find Shopify:**
   - Look for **"Shopify"** in the list
   - Click on it

3. **Revoke Access:**
   - Click **"Revoke"** or **"Uninstall"**
   - Confirm

4. **Reconnect in Shopify:**
   - Go back to Shopify Admin → Hydrogen
   - Click **"Connect GitHub repository"**
   - You'll be asked to authorize again
   - Select your repository

---

## 🎯 Next Steps (After Confirming Connection)

### 1. Check Deployment Token

1. **Hydrogen** → **Deployments** tab
2. Look for **"Deployment token"** or **"Create token"**
3. If missing, create one
4. Add to GitHub Secrets: `OXYGEN_DEPLOYMENT_TOKEN_1000013955`

### 2. Set Environment Variables

1. **Hydrogen** → **Environment variables** tab
2. Add required variables:
   - `PUBLIC_STOREFRONT_API_TOKEN` (from Shopify App)
   - `PUBLIC_STORE_DOMAIN` (e.g., `dryeyela-ai.myshopify.com`)

### 3. Trigger Deployment

```bash
cd /Users/alex/Documents/Projects/dryeyela-hydrogen
git push origin feature/hybrid-data-sync
```

Check GitHub Actions: https://github.com/Mobo4/dryeyela-hydrogen/actions

---

## 🔍 Verify Your Setup

### Check 1: Repository Connection

**In Shopify Admin:**
- Hydrogen → Deployments → Should show your repo name

**In GitHub:**
- Settings → Integrations → GitHub Apps → Should show Shopify connected

### Check 2: Workflow File

Your `.github/workflows/oxygen-deployment-1000013955.yml` file should exist and have:
```yaml
#! oxygen_storefront_id: 1000013955
```

✅ **If this exists:** Your repo is properly connected!

---

## ❓ Common Questions

**Q: Can I have multiple storefronts connected to one repo?**  
A: No, one repo = one storefront. But you can have multiple branches deploy to the same storefront.

**Q: What if I want to use a different repo?**  
A: Disconnect the current one first, then connect the new repo.

**Q: Will disconnecting delete my code?**  
A: No! Your code stays in GitHub. Disconnecting just removes the Shopify connection.

**Q: Can I change the storefront ID?**  
A: The storefront ID (`1000013955`) is assigned by Shopify. You can't change it, but you can create a new storefront and connect your repo to that instead.

---

## 🆘 Still Locked?

**Try these:**

1. **Clear Browser Cache:**
   - Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
   - Or use incognito/private window

2. **Check GitHub Permissions:**
   - GitHub → Settings → Applications → Authorized GitHub Apps
   - Make sure Shopify has proper permissions

3. **Contact Shopify Support:**
   - They can manually disconnect/reconnect your repo
   - Provide them with:
     - Repository: `Mobo4/dryeyela-hydrogen`
     - Storefront ID: `1000013955`
     - Your store domain: `dryeyela-ai.myshopify.com`

---

## 📚 Related Guides

- **Full Setup:** `docs/SHOPIFY_ADMIN_SETUP.md`
- **Deployment Guide:** `docs/GITHUB_DEPLOYMENT_GUIDE.md`
- **Troubleshooting:** `docs/NO_DEPLOYMENTS_TROUBLESHOOTING.md`
