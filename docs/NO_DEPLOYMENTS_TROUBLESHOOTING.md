# No Hydrogen Deployments - Troubleshooting Guide

**Problem:** You don't see any deployments in Shopify Admin or GitHub Actions.

---

## 🔍 Quick Diagnosis

### Check 1: Are GitHub Actions Running?

1. Go to: **https://github.com/Mobo4/dryeyela-hydrogen/actions**
2. Do you see any workflow runs?
   - ✅ **Yes** → Go to Check 2
   - ❌ **No** → Go to "First Time Setup" below

### Check 2: Are Workflows Failing?

1. In GitHub Actions, click the latest workflow run
2. Check the status:
   - ✅ **Green checkmark** → Deployment succeeded! Check Shopify Admin for preview URL
   - ❌ **Red X** → See "Deployment Failures" section below
   - ⏳ **Yellow circle** → Still running, wait 2-5 minutes

---

## 🚀 First Time Setup (If No Deployments Exist)

### Step 1: Connect GitHub Repository to Shopify

1. **Go to Shopify Admin:**
   - Navigate to: **Settings** → **Channels** → **Hydrogen** (or **Headless**)
   - If you don't see "Hydrogen", try: **Apps** → **Hydrogen** or **Headless**

2. **Connect Repository:**
   - Click **"Connect GitHub repository"** or **"Link repository"**
   - Authorize Shopify GitHub App (if prompted)
   - Select repository: `Mobo4/dryeyela-hydrogen`
   - Click **"Connect"**

**What happens:**
- Shopify creates a connection to your GitHub repo
- Shopify can now see your code
- Automatic deployments will be set up

---

### Step 2: Get Deployment Token

**This is REQUIRED for deployments to work!**

1. **In Shopify Admin:**
   - Go to: **Hydrogen** → **Deployments** tab
   - Look for **"Deployment token"** or **"Create token"** button
   - Click **"Create deployment token"** or **"Generate token"**
   - **Copy the token immediately!** (Long string like `shpat_xxxxxxxxxxxxx`)
   - ⚠️ **You won't be able to see it again** after closing

2. **Add Token to GitHub Secrets:**
   - Go to: **https://github.com/Mobo4/dryeyela-hydrogen**
   - Click **"Settings"** (top menu)
   - Click **"Secrets and variables"** → **"Actions"** (left sidebar)
   - Click **"New repository secret"**
   - **Name:** `OXYGEN_DEPLOYMENT_TOKEN_1000013955`
     - ⚠️ **CRITICAL:** Use this EXACT name (matches your workflow file)
   - **Secret:** Paste the token you copied
   - Click **"Add secret"**

**What happens:**
- GitHub now has permission to deploy to Shopify
- Your GitHub Actions workflow can use this token
- Deployments will work automatically

---

### Step 3: Trigger First Deployment

After setting up the token, trigger a deployment:

```bash
cd /Users/alex/Documents/Projects/dryeyela-hydrogen
git commit --allow-empty -m "Trigger first deployment"
git push origin feature/hybrid-data-sync
```

**OR** just push any changes:

```bash
git add .
git commit -m "Initial deployment"
git push origin feature/hybrid-data-sync
```

---

### Step 4: Check Deployment Status

1. **GitHub Actions:**
   - Go to: **https://github.com/Mobo4/dryeyela-hydrogen/actions**
   - Wait 2-5 minutes
   - Click the latest workflow run
   - Look for **"Deploy to Oxygen"** job
   - If successful, you'll see a preview URL in the output

2. **Shopify Admin:**
   - Go to: **Hydrogen** → **Deployments** tab
   - You should see a new deployment appear
   - Click it to see the preview URL

---

## ❌ Deployment Failures

### Error: "Failed to authenticate" or "Invalid token"

**Solution:**
- Token is missing or incorrect in GitHub Secrets
- Go back to Step 2 above
- Make sure token name is EXACTLY: `OXYGEN_DEPLOYMENT_TOKEN_1000013955`
- Create a new token if needed

### Error: "Build failed"

**Solution:**
- Check the build logs in GitHub Actions
- Look for specific error messages
- Common issues:
  - Missing dependencies (run `npm install` locally)
  - TypeScript errors (fix in your code)
  - Missing environment variables (see below)

### Error: "Module not found"

**Solution:**
- Run `npm install` locally to update `package-lock.json`
- Commit and push the updated lock file
- Redeploy

---

## ⚙️ Required Environment Variables

**These must be set in Shopify Admin** for your storefront to work:

1. **Go to:** Shopify Admin → Hydrogen → Environment variables

2. **Add these variables:**

| Variable Name | What It Is | Required? |
|--------------|------------|-----------|
| `PUBLIC_STOREFRONT_API_TOKEN` | Your store's API token | ✅ Yes |
| `PUBLIC_STORE_DOMAIN` | Your store domain (e.g., `dryeyela.myshopify.com`) | ✅ Yes |
| `PUBLIC_JUDGEME_SHOP_DOMAIN` | Judge.me shop domain | ⚠️ If using Judge.me |
| `PUBLIC_GORGIAS_APP_ID` | Gorgias app ID | ⚠️ If using Gorgias |
| `PUBLIC_KLAVIYO_API_KEY` | Klaviyo API key | ⚠️ If using Klaviyo |

**How to get `PUBLIC_STOREFRONT_API_TOKEN`:**
1. Shopify Admin → Settings → Apps and sales channels
2. Click **"Develop apps"** → **"Create an app"**
3. Name it: "Hydrogen Storefront"
4. Click **"Configure Admin API scopes"**
5. Enable: `read_products`, `read_content`, `read_customers`
6. Click **"Save"**
7. Click **"API credentials"** tab
8. Under **"Storefront API"**, click **"Install app"**
9. Copy the **"Storefront API access token"**
10. Use this as `PUBLIC_STOREFRONT_API_TOKEN`

---

## ✅ Checklist

Before expecting deployments to work:

- [ ] **GitHub repository connected** to Shopify (Hydrogen → Shows your repo name)
- [ ] **Deployment token created** (Hydrogen → Deployments → Token exists)
- [ ] **Token added to GitHub Secrets** (GitHub → Settings → Secrets → `OXYGEN_DEPLOYMENT_TOKEN_1000013955` exists)
- [ ] **Environment variables set** (Hydrogen → Environment variables → At least `PUBLIC_STOREFRONT_API_TOKEN` and `PUBLIC_STORE_DOMAIN`)
- [ ] **Code pushed to GitHub** (Triggered a deployment)
- [ ] **GitHub Actions workflow running** (Check https://github.com/Mobo4/dryeyela-hydrogen/actions)

---

## 🆘 Still Not Working?

**Share these details:**

1. **GitHub Actions status:**
   - Go to: https://github.com/Mobo4/dryeyela-hydrogen/actions
   - Screenshot or copy the error message

2. **Shopify Admin status:**
   - Go to: Hydrogen → Deployments
   - Screenshot what you see

3. **Checklist status:**
   - Which items above are ✅ and which are ❌?

---

## 📚 Related Guides

- **Quick Fix:** `docs/FIX_DEPLOYMENT_FAILURE.md`
- **Full Setup:** `docs/SHOPIFY_ADMIN_SETUP.md`
- **Beginner Guide:** `docs/BEGINNER_DEPLOYMENT_GUIDE.md`
