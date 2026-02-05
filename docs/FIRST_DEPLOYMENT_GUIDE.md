# First Deployment Guide

**Status:** Ready to deploy! 🚀

---

## ✅ What's Ready

- ✅ **Code is complete** - All Hydrogen storefront code is in place
- ✅ **Build works** - `npm run build` succeeds locally
- ✅ **GitHub workflow configured** - `.github/workflows/oxygen-deployment-1000013955.yml`
- ✅ **Repository connected** - Storefront ID: `1000013955`
- ✅ **App credentials configured** - App ID: `6fb6965ac343c320d244cdee6b60959f`

---

## 🚀 Trigger First Deployment

### Step 1: Push Code to GitHub

```bash
cd /Users/alex/Documents/Projects/dryeyela-hydrogen
git add -A
git commit -m "Initial deployment"
git push origin feature/hybrid-data-sync
```

**What happens:**
- Code is pushed to GitHub
- GitHub Actions workflow triggers automatically
- Build process starts
- Deployment to Shopify Oxygen begins

### Step 2: Monitor Deployment

**GitHub Actions:**
1. Go to: https://github.com/Mobo4/dryeyela-hydrogen/actions
2. Click the latest workflow run
3. Watch the "Deploy to Oxygen" job
4. Wait 2-5 minutes for completion

**Shopify Admin:**
1. Go to: Shopify Admin → Hydrogen → Deployments
2. You should see a new deployment appear
3. Status will show: Building → Deployed (or Failed)

---

## ⚠️ Before Deployment Succeeds

**You still need these environment variables in Shopify Oxygen:**

Go to: **Shopify Admin → Hydrogen → Environment variables**

**Add these REQUIRED variables:**

| Variable | Value | Status |
|----------|-------|--------|
| `SESSION_SECRET` | `uD7QK0Dg6BHB1gGNak0jlR9iQgVxMlYUQ4GvB1d+AgU=` | ✅ Ready |
| `PUBLIC_STORE_DOMAIN` | `dryeyela-ai.myshopify.com` | ✅ Ready |
| `PUBLIC_STOREFRONT_API_TOKEN` | _(get from app)_ | ⚠️ **NEEDED** |
| `PUBLIC_STOREFRONT_ID` | _(get from app)_ | ⚠️ **NEEDED** |
| `PUBLIC_CHECKOUT_DOMAIN` | `checkout.shopify.com` | ✅ Ready |
| `PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID` | _(get from Hydrogen)_ | ⚠️ **NEEDED** |
| `PUBLIC_CUSTOMER_ACCOUNT_API_URL` | `https://shopify.com/customer-account/api` | ✅ Ready |

**Without these, deployment will succeed but site will show 404!**

---

## 🔑 Get Missing Values

### 1. Storefront API Token

1. **Shopify Admin** → **Settings** → **Apps and sales channels**
2. Click **"Develop apps"**
3. Find app: `6fb6965ac343c320d244cdee6b60959f`
4. Click on it → **"API credentials"** tab
5. Under **"Storefront API"** → **"Reveal token"**
6. Copy token → Add to Shopify Oxygen as `PUBLIC_STOREFRONT_API_TOKEN`

### 2. Storefront ID

1. Same app → **"API credentials"** tab
2. Copy **"Storefront ID"** (looks like: `gid://shopify/Storefront/123456`)
3. Add to Shopify Oxygen as `PUBLIC_STOREFRONT_ID`

### 3. Customer Account API Client ID

1. **Shopify Admin** → **Hydrogen** → **Customer Account API**
2. Copy **Client ID**
3. Add to Shopify Oxygen as `PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID`

---

## 📋 Deployment Checklist

**Before pushing:**
- [x] Code is complete
- [x] Build works locally (`npm run build`)
- [x] GitHub workflow file exists
- [x] Repository is connected to Shopify

**After pushing:**
- [ ] GitHub Actions workflow runs
- [ ] Build completes successfully
- [ ] Deployment to Oxygen succeeds
- [ ] Environment variables are set in Shopify Oxygen
- [ ] Site loads at preview URL (not 404)

---

## 🔍 Check Deployment Status

### GitHub Actions
- **URL:** https://github.com/Mobo4/dryeyela-hydrogen/actions
- **Look for:** Latest workflow run with "Deploy to Oxygen" job
- **Status:** ✅ Green = Success, ❌ Red = Failed, ⏳ Yellow = Running

### Shopify Admin
- **Path:** Hydrogen → Deployments
- **Look for:** New deployment with status
- **Preview URL:** Click deployment to see preview URL

---

## 🎯 Expected Result

**After successful deployment:**

1. **GitHub Actions:** ✅ Green checkmark
2. **Shopify Admin:** Deployment shows "Deployed" status
3. **Preview URL:** Site loads (not 404)
   - Example: `https://dryeyela-ai-xxxxx.o2.myshopify.dev/`

**If you still see 404:**
- Check environment variables are set
- Verify `PUBLIC_STOREFRONT_API_TOKEN` is correct
- Check deployment logs in GitHub Actions

---

## 🆘 Troubleshooting

### Deployment Fails in GitHub Actions

**Check:**
1. GitHub Actions logs for error message
2. Most common: Missing `OXYGEN_DEPLOYMENT_TOKEN_1000013955` in GitHub Secrets
3. See: `docs/FIX_DEPLOYMENT_FAILURE.md`

### Deployment Succeeds but Site Shows 404

**Check:**
1. Environment variables are set in Shopify Oxygen
2. `PUBLIC_STOREFRONT_API_TOKEN` is valid
3. `PUBLIC_STORE_DOMAIN` matches your store
4. See: `docs/CHROME_ERROR_SETUP.md`

### No Deployment Appears

**Check:**
1. GitHub repository is connected in Shopify Admin
2. Deployment token is in GitHub Secrets
3. Code was pushed to correct branch
4. See: `docs/NO_DEPLOYMENTS_TROUBLESHOOTING.md`

---

## 📚 Related Documentation

- **Deployment Failure:** `docs/FIX_DEPLOYMENT_FAILURE.md`
- **Environment Variables:** `docs/CHROME_ERROR_SETUP.md`
- **No Deployments:** `docs/NO_DEPLOYMENTS_TROUBLESHOOTING.md`
- **Credentials:** `docs/CREDENTIALS_SUMMARY.md`
