# 🛍️ Shopify Admin Setup: Connect GitHub & View Deployments

**Date:** February 2026  
**Purpose:** Step-by-step guide for connecting your GitHub repository in Shopify Admin

---

## 🎯 What You'll Do in Shopify Admin

You need to:
1. ✅ Connect your GitHub repository
2. ✅ Get a deployment token
3. ✅ Set environment variables
4. ✅ View your deployments

**Time needed:** 10-15 minutes (one-time setup)

---

## 📍 Step 1: Find Hydrogen/Headless Settings in Shopify Admin

### Option A: Direct Navigation (Easiest)

1. **Log into Shopify Admin**
   - Go to: `https://admin.shopify.com/store/YOUR_STORE_NAME`
   - Enter your credentials

2. **Navigate to Hydrogen Settings**
   - Click **"Settings"** (bottom left, gear icon)
   - Click **"Channels"** or **"Sales channels"**
   - Look for **"Hydrogen"** or **"Headless"** and click it

### Option B: Search Method

1. In Shopify Admin, use the **search bar** (top)
2. Type: `Hydrogen` or `Headless`
3. Click on the result

### Option C: Alternative Path

If you can't find it:
- **Settings** → **Apps and sales channels** → **Hydrogen**
- Or: **Settings** → **Channels** → **Hydrogen**

**Can't find it?** You might need to:
- Enable Hydrogen in your Shopify plan
- Or contact Shopify support to enable headless storefronts

---

## 🔗 Step 2: Connect Your GitHub Repository

### 2.1. Find the Connection Section

Once in Hydrogen/Headless settings, look for:
- **"Connect repository"** button
- **"GitHub integration"** section
- **"Deployments"** tab → **"Connect GitHub"**

### 2.2. Connect Your Repo

1. Click **"Connect GitHub repository"** or **"Connect repository"**
2. **Authorize Shopify** (if prompted)
   - This allows Shopify to access your GitHub account
   - Click **"Authorize Shopify"**
3. **Select your repository**
   - Look for: `Mobo4/dryeyela-hydrogen` or `dryeyela-hydrogen`
   - Click on it
4. **Click "Connect"** or **"Save"**

**What happens:**
- Shopify creates a connection to your GitHub repo
- Shopify can now see your code
- Automatic deployments will be set up

**Note:** Shopify might automatically add a GitHub Actions workflow file (you already have one, so this is fine!)

---

## 🔑 Step 3: Get Your Deployment Token

This token lets GitHub deploy your code to Shopify.

### 3.1. Go to Deployments Section

1. In Hydrogen settings, click **"Deployments"** tab
2. You'll see a list of deployments (might be empty at first)

### 3.2. Create Deployment Token

1. Look for **"Deployment token"** or **"Create token"** button
2. Click **"Create deployment token"** or **"Generate token"**
3. **Copy the token immediately!**
   - It's a long string like: `shpat_xxxxxxxxxxxxxxxxxxxxx`
   - You won't be able to see it again after closing the window
   - Save it in a text file or password manager

### 3.3. Add Token to GitHub Secrets

1. **Go to GitHub:**
   - Open: `https://github.com/Mobo4/dryeyela-hydrogen`
   - Click **"Settings"** (top menu, next to "Insights")

2. **Go to Secrets:**
   - Click **"Secrets and variables"** (left sidebar)
   - Click **"Actions"** (under "Secrets and variables")

3. **Add New Secret:**
   - Click **"New repository secret"** button
   - **Name:** `OXYGEN_DEPLOYMENT_TOKEN_1000013955`
     - ⚠️ **Important:** Use this EXACT name (matches your workflow file)
   - **Secret:** Paste your deployment token
   - Click **"Add secret"**

**What happens:**
- GitHub now has permission to deploy to Shopify
- Your GitHub Actions workflow can use this token
- Deployments will work automatically

---

## ⚙️ Step 4: Set Environment Variables

These are settings your storefront needs to work properly.

### 4.1. Go to Environment Variables

1. In Hydrogen settings, click **"Environment variables"** tab
2. You'll see a list (might be empty)

### 4.2. Add Required Variables

Click **"Add variable"** for each of these:

| Variable Name | What It Is | Where to Find It |
|--------------|------------|------------------|
| `PUBLIC_STOREFRONT_API_TOKEN` | Your store's API token | See instructions below |
| `PUBLIC_STORE_DOMAIN` | Your store domain | Usually `your-store.myshopify.com` |
| `PUBLIC_JUDGEME_SHOP_DOMAIN` | Judge.me shop name | Judge.me app settings (if using) |
| `PUBLIC_GORGIAS_APP_ID` | Gorgias app ID | Gorgias app settings (if using) |
| `PUBLIC_KLAVIYO_API_KEY` | Klaviyo API key | Klaviyo account settings (if using) |

**For each variable:**
1. Click **"Add variable"**
2. Enter the **Name** (exactly as shown above, including `PUBLIC_` prefix)
3. Enter the **Value**
4. Click **"Save"**

### 4.3. Get Storefront API Token

If you need to create a Storefront API token:

1. **Shopify Admin** → **Settings** → **Apps and sales channels**
2. Click **"Develop apps"** (or **"Manage private apps"**)
3. Click **"Create an app"**
4. Name it: `Hydrogen Storefront`
5. Click **"Configure Admin API scopes"** → **"Save"**
6. Click **"Configure Storefront API scopes"**
7. Enable: `unauthenticated_read_product_listings`, `unauthenticated_read_products`
8. Click **"Save"**
9. Click **"Install app"**
10. Go to **"API credentials"** tab
11. Under **"Storefront API"**, click **"Reveal token"**
12. Copy the token → Use as `PUBLIC_STOREFRONT_API_TOKEN`

---

## 🚀 Step 5: View Your Deployments

### 5.1. Check Deployments Tab

1. In Hydrogen settings, click **"Deployments"** tab
2. You'll see a list of all deployments

**What you'll see:**
- Deployment status (Building, Deployed, Failed)
- Preview URLs (for testing)
- Deployment date/time
- Branch name (e.g., `feature/hybrid-data-sync`)

### 5.2. Get Preview URL

1. Find your latest deployment
2. Look for **"Preview URL"** or **"View deployment"**
3. Click it to open your storefront
4. **Copy the URL** to share with others

**Preview URLs look like:**
```
https://your-store-12345.oxygen.app
```

---

## 🔄 Step 6: Trigger Your First Deployment

### From Your Computer:

1. **Open Terminal**
2. **Navigate to your project:**
   ```bash
   cd /Users/alex/Documents/Projects/dryeyela-hydrogen
   ```

3. **Save and push your code:**
   ```bash
   git add .
   git commit -m "Initial deployment with template updates"
   git push origin feature/hybrid-data-sync
   ```

4. **Wait 2-5 minutes**

5. **Check GitHub Actions:**
   - Go to: `https://github.com/Mobo4/dryeyela-hydrogen/actions`
   - Click the latest workflow run
   - Watch it deploy (you'll see progress)

6. **Get Preview URL:**
   - From GitHub Actions output, OR
   - From Shopify Admin → Hydrogen → Deployments

---

## 📱 Step 7: View Deployment in Shopify Admin

### In Shopify Admin → Hydrogen → Deployments:

You'll see:
- ✅ **Status:** Building, Deployed, or Failed
- ✅ **Preview URL:** Click to open your storefront
- ✅ **Branch:** Which branch was deployed
- ✅ **Date:** When it was deployed
- ✅ **Actions:** View logs, delete deployment

### Click on a Deployment:

- See detailed logs
- View build output
- Check for errors
- Copy preview URL

---

## 🎯 Quick Reference: Where to Find Things

### In Shopify Admin:

| What You Need | Where to Find It |
|--------------|------------------|
| **Hydrogen Settings** | Settings → Channels → Hydrogen |
| **Connect GitHub** | Hydrogen → Connect repository |
| **Deployment Token** | Hydrogen → Deployments → Create token |
| **Environment Variables** | Hydrogen → Environment variables |
| **View Deployments** | Hydrogen → Deployments |
| **Preview URLs** | Hydrogen → Deployments → Click deployment |

### In GitHub:

| What You Need | Where to Find It |
|--------------|------------------|
| **Add Secrets** | Repo → Settings → Secrets → Actions |
| **View Deployments** | Repo → Actions tab |
| **Deployment Status** | Repo → Actions → Click workflow run |

---

## ✅ Checklist: Is Everything Set Up?

Check these in Shopify Admin:

- [ ] **GitHub repository connected** (Hydrogen → Shows your repo name)
- [ ] **Deployment token created** (Hydrogen → Deployments → Token exists)
- [ ] **Token added to GitHub Secrets** (GitHub → Settings → Secrets → `OXYGEN_DEPLOYMENT_TOKEN_1000013955` exists)
- [ ] **Environment variables set** (Hydrogen → Environment variables → At least `PUBLIC_STOREFRONT_API_TOKEN` and `PUBLIC_STORE_DOMAIN`)
- [ ] **First deployment triggered** (Pushed code to GitHub)
- [ ] **Preview URL works** (Can open storefront in browser)

---

## 🐛 Troubleshooting

### Problem: "Can't find Hydrogen in Shopify Admin"

**Solutions:**
- Make sure you have Shopify Plus or Hydrogen-enabled plan
- Try: Settings → Apps and sales channels → Hydrogen
- Contact Shopify support to enable headless storefronts

### Problem: "GitHub repository not connecting"

**Solutions:**
- Make sure you authorized Shopify GitHub App
- Check you have access to the repository
- Try disconnecting and reconnecting

### Problem: "Deployment token not working"

**Solutions:**
- Make sure token is in GitHub Secrets with EXACT name: `OXYGEN_DEPLOYMENT_TOKEN_1000013955`
- Check token wasn't expired or regenerated
- Create a new token and update GitHub Secrets

### Problem: "Environment variables not loading"

**Solutions:**
- Make sure variables start with `PUBLIC_` prefix
- Check variable names match exactly (case-sensitive)
- Redeploy after adding variables (push code again)

### Problem: "Preview URL shows error"

**Solutions:**
- Wait 2-3 minutes (deployment might still be building)
- Check deployment status in Shopify Admin
- Check GitHub Actions for error messages
- Verify environment variables are set correctly

---

## 🎓 Understanding the Flow

```
Your Computer (Code)
    ↓
GitHub (Repository)
    ↓
GitHub Actions (Automatic)
    ↓
Shopify Oxygen (Hosting)
    ↓
Preview URL (Testing)
```

**What happens:**
1. You push code to GitHub
2. GitHub Actions automatically runs
3. Builds your Hydrogen storefront
4. Deploys to Shopify Oxygen
5. Creates preview URL
6. You can view it in Shopify Admin → Deployments

---

## 🎉 Success Indicators

You'll know it's working when:

✅ **In Shopify Admin:**
- Hydrogen → Deployments shows your deployments
- Status shows "Deployed" (green checkmark)
- Preview URL works in browser

✅ **In GitHub:**
- Actions tab shows workflow runs
- All steps have green checkmarks ✅
- Deployment step shows preview URL

✅ **In Browser:**
- Preview URL loads your storefront
- Products show up
- Pages work correctly

---

## 📞 Next Steps After Setup

1. **Test your storefront:**
   - Open preview URL
   - Click around
   - Test products, cart, search

2. **Make changes:**
   - Edit code locally
   - Push to GitHub
   - Get new preview URL
   - Test again

3. **When ready for production:**
   - Merge to `main` branch
   - Set custom domain (optional)
   - Make it live!

---

## 💡 Pro Tips

- **Preview URLs are private** - Only people you share the link with can see them
- **Each deployment gets a new URL** - Old ones still work
- **Deployments take 2-5 minutes** - Be patient!
- **Check GitHub Actions first** - It shows detailed logs if something fails
- **Environment variables are case-sensitive** - Copy names exactly

---

**You're all set!** Once you complete these steps, every time you push code to GitHub, Shopify will automatically deploy it and give you a preview URL to test! 🚀
