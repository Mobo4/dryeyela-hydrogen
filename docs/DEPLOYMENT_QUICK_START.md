# ⚡ Quick Start: Deploy in 5 Minutes

**For:** Testing your storefront with real Shopify data (not public)

---

## 🎯 The Simple Version

```
1. Save code → 2. Push to GitHub → 3. Get preview URL → 4. Test!
```

That's it! Here's how:

---

## 📝 Step-by-Step (Copy & Paste)

### 1. Save Your Code

Open Terminal and run:

```bash
cd /Users/alex/Documents/Projects/dryeyela-hydrogen
git add .
git commit -m "Deploy for testing"
git push origin feature/hybrid-data-sync
```

**Wait 30 seconds** for upload to finish.

### 2. Get Preview URL

1. Go to: `https://github.com/Mobo4/dryeyela-hydrogen/actions`
2. Click the **latest workflow** (top of list)
3. Wait 2-5 minutes for deployment
4. Scroll to **"Deploy"** step
5. Copy the **Preview URL** (looks like `https://xxx.oxygen.app`)

### 3. Test!

1. Paste URL in browser
2. Your storefront loads! 🎉
3. Test products, pages, everything

---

## ✅ First Time Setup (Do Once)

If this is your first deployment, you need to:

### A. Connect GitHub to Shopify

1. Shopify Admin → Settings → Channels → Hydrogen
2. Click "Connect GitHub repository"
3. Select: `Mobo4/dryeyela-hydrogen`

### B. Add Deployment Token

1. Shopify Admin → Hydrogen → Deployments
2. Click "Create deployment token"
3. Copy token
4. GitHub → Settings → Secrets → Actions → New secret
5. Name: `OXYGEN_DEPLOYMENT_TOKEN_1000013955`
6. Value: Paste token

### C. Set Environment Variables

1. Shopify Admin → Hydrogen → Environment variables
2. Add these (if you have them):
   - `PUBLIC_STOREFRONT_API_TOKEN`
   - `PUBLIC_STORE_DOMAIN`
   - `PUBLIC_JUDGEME_SHOP_DOMAIN` (if using Judge.me)
   - `PUBLIC_GORGIAS_APP_ID` (if using Gorgias)
   - `PUBLIC_KLAVIYO_API_KEY` (if using Klaviyo)

---

## 🔄 Deploy Again (After Changes)

Made changes? Just repeat Step 1 & 2 above!

```bash
git add .
git commit -m "Your changes"
git push origin feature/hybrid-data-sync
```

Wait 2-5 minutes, get new preview URL, test again!

---

## 🎯 What You Get

- ✅ **Preview URL** - Private link to test
- ✅ **Real Shopify Data** - Your actual products
- ✅ **Not Public** - Only you can see it
- ✅ **Safe** - Your live store unchanged

---

## ❓ Troubleshooting

**Deployment failed?**
- Check GitHub Actions → See error message
- Usually: Missing environment variable or build error

**Can't find preview URL?**
- Wait 2-3 more minutes
- Check Shopify Admin → Hydrogen → Deployments

**Preview URL shows error?**
- Check environment variables are set
- Try deploying again

---

## 📚 Full Guide

For detailed instructions, see: `docs/BEGINNER_DEPLOYMENT_GUIDE.md`

---

**That's it!** Push your code and get a preview URL in 5 minutes! 🚀
