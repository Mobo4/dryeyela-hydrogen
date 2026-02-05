# Deployment Checklist - Fix "Refused to Connect" Error

**Error:** "Refused to connect" at `www.dryeyela.com`

**Cause:** Hydrogen storefront is not deployed yet. Hydrogen storefronts are **headless** - they need to be deployed first before they can be accessed.

---

## ✅ Current Status Check

### 1. Code Status

**Check if code is pushed to GitHub:**
```bash
cd /Users/alex/Documents/Projects/dryeyela-hydrogen
git log --oneline -5
git status
```

**Expected:** Latest commit should be `98503f8` (or newer) with message about deployment setup.

### 2. GitHub Actions Status

**Check deployment workflow:**
- Go to: https://github.com/Mobo4/dryeyela-hydrogen/actions
- Look for latest workflow run
- Status should be:
  - ✅ **Green** = Deployment succeeded
  - ⏳ **Yellow** = Deployment in progress (wait 2-5 minutes)
  - ❌ **Red** = Deployment failed (check logs)

### 3. Shopify Hydrogen Dashboard

**Check deployment status:**
- Go to: Shopify Partners → Apps → Your App → Hydrogen
- Or: Shopify Admin → Hydrogen → Deployments
- Look for deployment with status:
  - **Building** = In progress
  - **Deployed** = Success ✅
  - **Failed** = Error ❌

---

## 🚀 Fix Steps

### Step 1: Ensure Code is Pushed

**If you have uncommitted changes:**

```bash
cd /Users/alex/Documents/Projects/dryeyela-hydrogen
git add -A
git commit -m "feat: add webhook and Admin API setup"
git push origin feature/hybrid-data-sync
```

**What happens:**
- Code pushes to GitHub
- GitHub Actions automatically triggers
- Build starts (2-3 minutes)
- Deployment begins (2-3 minutes)

### Step 2: Monitor Deployment

**GitHub Actions:**
1. Go to: https://github.com/Mobo4/dryeyela-hydrogen/actions
2. Click latest workflow run
3. Watch "Deploy to Oxygen" job
4. Wait for completion (total ~5 minutes)

**Shopify Dashboard:**
1. Go to: Shopify Partners → Apps → Your App → Hydrogen
2. Click "Deployments" tab
3. Look for new deployment
4. Status should change: Building → Deployed

### Step 3: Get Preview URL

**After deployment succeeds:**

1. **From GitHub Actions:**
   - Click completed workflow
   - Look for "Deployment URL" in output
   - Format: `https://dryeyela-ai-xxxxx.o2.myshopify.dev/`

2. **From Shopify Dashboard:**
   - Go to: Hydrogen → Deployments
   - Click on latest deployment
   - Copy "Preview URL"

### Step 4: Test Preview URL

**Visit the preview URL:**
- Should load your Hydrogen storefront
- Should NOT show 404 or "refused to connect"
- Should display your products and pages

**If still showing 404:**
- Check environment variables are set (see Step 5)
- Wait 1-2 minutes for propagation
- Try hard refresh (Cmd+Shift+R)

### Step 5: Set Environment Variables (Critical!)

**Before site works, you MUST set environment variables:**

**Go to:** Shopify Partners → Apps → Your App → Hydrogen → Storefront settings → Environments and variables

**Or use CLI:**
```bash
shopify hydrogen env push
```

**Required variables:**
- `SESSION_SECRET` = `uD7QK0Dg6BHB1gGNak0jlR9iQgVxMlYUQ4GvB1d+AgU=`
- `PUBLIC_STORE_DOMAIN` = `dryeyela-ai.myshopify.com`
- `PUBLIC_STOREFRONT_API_TOKEN` = _(get from app credentials)_
- `PUBLIC_STOREFRONT_ID` = _(get from app credentials)_
- `PUBLIC_CHECKOUT_DOMAIN` = `checkout.shopify.com`

**Without these, deployment succeeds but site shows 404!**

---

## 🔍 Troubleshooting

### Deployment Fails in GitHub Actions

**Check logs:**
1. Go to: https://github.com/Mobo4/dryeyela-hydrogen/actions
2. Click failed workflow
3. Click "Deploy to Oxygen" job
4. Scroll to see error

**Common errors:**
- `Missing OXYGEN_DEPLOYMENT_TOKEN_1000013955` → Add to GitHub Secrets
- `Build failed` → Check build logs
- `Authentication failed` → Token expired or wrong

### Deployment Succeeds but Site Shows 404

**Causes:**
1. **Missing environment variables** → Set in Shopify Oxygen
2. **Invalid Storefront API token** → Get correct token from app
3. **Wrong store domain** → Verify `PUBLIC_STORE_DOMAIN`

**Fix:**
- Set all environment variables (see Step 5)
- Verify `PUBLIC_STOREFRONT_API_TOKEN` is correct
- Trigger new deployment after setting variables

### "Refused to Connect" Error

**This means:**
- No deployment exists yet
- Deployment failed
- Domain not connected

**Fix:**
1. Check deployment status (GitHub Actions + Shopify Dashboard)
2. If no deployment, push code to trigger one
3. If deployment failed, check logs and fix errors
4. If deployment succeeded, use preview URL (not custom domain yet)

---

## 📋 Quick Checklist

**Before deployment:**
- [ ] Code is pushed to GitHub
- [ ] GitHub Actions workflow file exists
- [ ] Deployment token in GitHub Secrets
- [ ] Build works locally (`npm run build`)

**After deployment:**
- [ ] GitHub Actions shows ✅ (green)
- [ ] Shopify Dashboard shows "Deployed"
- [ ] Preview URL loads (not 404)
- [ ] Environment variables are set
- [ ] Site displays correctly

**For custom domain:**
- [ ] Deployment is working on preview URL
- [ ] Custom domain configured in Shopify
- [ ] DNS records updated
- [ ] SSL certificate issued

---

## 🎯 Expected Timeline

**First deployment:**
- **0-1 min:** GitHub Actions starts
- **1-3 min:** Build completes
- **3-5 min:** Deployment to Oxygen
- **5-6 min:** Preview URL available

**Total:** ~5-6 minutes

**Subsequent deployments:** Usually faster (2-3 minutes)

---

## 📚 Related Documentation

- **First Deployment:** `docs/FIRST_DEPLOYMENT_GUIDE.md`
- **Environment Variables:** `docs/FIND_ENVIRONMENT_VARIABLES.md`
- **Troubleshooting:** `docs/NO_DEPLOYMENTS_TROUBLESHOOTING.md`
- **Deployment Status:** `docs/DEPLOYMENT_STATUS.md`

---

## 🆘 Still Not Working?

**Share these details:**
1. GitHub Actions status (✅/❌/⏳)
2. Shopify Dashboard deployment status
3. Error message (if any)
4. Preview URL (if available)
5. Environment variables status (set/not set)
