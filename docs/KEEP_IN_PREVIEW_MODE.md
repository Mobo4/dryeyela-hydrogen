# Keep Hydrogen Storefront in Preview Mode

**Goal:** Deploy and test Hydrogen storefront without making it live/public.

---

## ✅ Good News: Default is Preview Mode!

**Hydrogen deployments are preview-only by default.** They don't automatically replace your live storefront.

### How It Works:

1. **Preview Deployments:**
   - Get a preview URL (e.g., `dryeyela-ai-xxxxx.o2.myshopify.dev`)
   - Only accessible via that specific URL
   - Does NOT affect your live storefront
   - Does NOT replace your theme

2. **Making It Live (Later):**
   - Requires explicit action in Shopify Admin
   - Set custom domain
   - Publish to production
   - Until then, it stays in preview

---

## 🔒 Current Setup: Already in Preview Mode

**Your workflow:** `.github/workflows/oxygen-deployment-1000013955.yml`
- Deploys on push to `feature/hybrid-data-sync`
- Creates preview deployments
- Does NOT make it live automatically

**What you get:**
- Preview URL after each deployment
- Test with real Shopify data
- No impact on live storefront
- Safe to experiment

---

## 🎯 How to Keep It in Preview

### Option 1: Keep Current Setup (Recommended)

**Current workflow:** Deploys from `feature/hybrid-data-sync` branch
- ✅ Already in preview mode
- ✅ Safe to test
- ✅ Won't go live

**Just keep working on feature branch:**
```bash
# Continue working on feature branch
git checkout feature/hybrid-data-sync

# Make changes, commit, push
git add .
git commit -m "feat: your changes"
git push origin feature/hybrid-data-sync

# This creates preview deployment (not live!)
```

### Option 2: Prevent Main Branch Deployments

**Update workflow to only deploy from feature branch:**

Edit `.github/workflows/oxygen-deployment-1000013955.yml`:

```yaml
on:
  push:
    branches:
      - feature/hybrid-data-sync  # Only deploy from feature branch
      # - main  # Commented out - prevents production deployments
```

**Then:**
- Feature branch → Preview deployments ✅
- Main branch → No deployments ❌
- Safe until you're ready

---

## 🧪 Testing in Preview Mode

### Step 1: Deploy to Preview

**Push to feature branch:**
```bash
git push origin feature/hybrid-data-sync
```

**What happens:**
- GitHub Actions builds and deploys
- Creates preview URL
- Does NOT affect live store

### Step 2: Get Preview URL

**From GitHub Actions:**
1. Go to: https://github.com/Mobo4/dryeyela-hydrogen/actions
2. Click latest workflow run
3. Look for "Deployment URL" in output
4. Format: `https://dryeyela-ai-xxxxx.o2.myshopify.dev/`

**From Shopify Dashboard:**
1. Go to: Shopify Partners → Apps → Your App → Hydrogen → Deployments
2. Click on latest deployment
3. Copy "Preview URL"

### Step 3: Test Preview URL

**Visit the preview URL:**
- ✅ Shows your Hydrogen storefront
- ✅ Uses real Shopify data
- ✅ Fully functional
- ✅ **NOT accessible to public** (only via this URL)
- ✅ **Does NOT replace your live store**

---

## 🚫 What Won't Happen (Preview Mode)

### Your Live Storefront Stays Unchanged:

- ✅ **Theme stays active** (if you have one)
- ✅ **Public URL unchanged** (`dryeyela.com` or `your-store.myshopify.com`)
- ✅ **Customers see existing storefront**
- ✅ **No disruption**

### Preview URL is Private:

- ✅ Only accessible via specific preview URL
- ✅ Not indexed by search engines
- ✅ Not linked from your live site
- ✅ Safe for testing

---

## 🔐 How to Make It Live (When Ready)

**When you're ready to go live, you'll need to:**

1. **Set Custom Domain** (Optional):
   - Shopify Partners → Apps → Hydrogen → Domains
   - Add `dryeyela.com` (or your domain)
   - Update DNS records

2. **Publish to Production**:
   - Shopify Partners → Apps → Hydrogen → Deployments
   - Click "Publish" or "Make Live"
   - This replaces your theme/storefront

3. **Or Keep Both**:
   - Keep theme for some routes
   - Use Hydrogen for specific pages
   - Configure routing in Shopify

**Until you do this, it stays in preview!**

---

## 📋 Recommended Workflow

### Development Phase (Current):

```bash
# Work on feature branch
git checkout feature/hybrid-data-sync

# Make changes
# ... edit files ...

# Commit and push
git add .
git commit -m "feat: new feature"
git push origin feature/hybrid-data-sync

# ✅ Creates preview deployment
# ✅ Test at preview URL
# ✅ Safe - not live
```

### When Ready for Production:

```bash
# Merge to main (when ready)
git checkout main
git merge feature/hybrid-data-sync
git push origin main

# Then in Shopify Admin:
# 1. Set custom domain (if desired)
# 2. Publish to production
# 3. Make it live
```

---

## ⚙️ Update Workflow to Stay in Preview

**To be extra safe, update workflow:**

```bash
cd /Users/alex/Documents/Projects/dryeyela-hydrogen

# Edit workflow file
code .github/workflows/oxygen-deployment-1000013955.yml
```

**Change:**
```yaml
# From:
on: [push]

# To:
on:
  push:
    branches:
      - feature/hybrid-data-sync  # Only feature branch
```

**Then commit:**
```bash
git add .github/workflows/oxygen-deployment-1000013955.yml
git commit -m "chore: restrict deployments to feature branch only (preview mode)"
git push origin feature/hybrid-data-sync
```

**Result:**
- ✅ Only feature branch deploys
- ✅ Main branch won't trigger deployments
- ✅ Extra safety until you're ready

---

## 🎯 Summary

**Current Status:**
- ✅ Already in preview mode
- ✅ Safe to test
- ✅ Won't go live automatically

**To Stay in Preview:**
- ✅ Keep working on `feature/hybrid-data-sync` branch
- ✅ Optional: Update workflow to only deploy from feature branch
- ✅ Don't merge to main until ready
- ✅ Don't publish in Shopify Admin until ready

**When Ready to Go Live:**
- Set custom domain in Shopify
- Publish to production
- Make it live

**Until then, it's safe!** 🎉

---

## 📚 Related Documentation

- **Deployment Guide:** `docs/GITHUB_DEPLOYMENT_GUIDE.md`
- **Hydrogen vs Themes:** `docs/HYDROGEN_VS_THEMES.md`
- **First Deployment:** `docs/FIRST_DEPLOYMENT_GUIDE.md`
