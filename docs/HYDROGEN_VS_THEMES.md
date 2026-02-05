# Hydrogen Storefronts vs Shopify Themes

**Short Answer:** **NO** - You don't connect Hydrogen to themes. They are **completely separate systems**.

---

## 🎯 Key Difference

### Shopify Themes (Traditional Storefront)
- **Location:** Shopify Admin → Online Store → Themes
- **Technology:** Liquid templates, theme files
- **Deployment:** Upload theme files directly to Shopify
- **Purpose:** Classic Shopify storefront

### Hydrogen Storefronts (Headless - What You're Building)
- **Location:** Shopify Partners → Apps → Hydrogen → Deployments
- **Technology:** Remix/React, TypeScript, deployed to Oxygen
- **Deployment:** GitHub Actions → Shopify Oxygen
- **Purpose:** Modern headless storefront

**They run independently!** You can have both at the same time.

---

## 🔗 What Gets Connected Where

### Your Current Setup

**GitHub Repository:** `Mobo4/dryeyela-hydrogen`
- **Connected to:** Hydrogen Storefront (ID: `1000013955`)
- **NOT connected to:** Shopify Themes
- **Deployment:** Via GitHub Actions workflow

**Workflow File:** `.github/workflows/oxygen-deployment-1000013955.yml`
- **Triggers on:** ANY push to ANY branch
- **Deploys to:** Shopify Oxygen (Hydrogen hosting)
- **Current branch:** `feature/hybrid-data-sync`

---

## 🌿 Branch Strategy for Hydrogen

### Current Setup (Development)
```
feature/hybrid-data-sync  →  Deploys to Oxygen (preview)
```

### Recommended Setup (Production)
```
main  →  Deploys to Oxygen (production)
feature/*  →  Deploys to Oxygen (preview)
```

**What to do:**

1. **Keep feature branch for testing:**
   - Current: `feature/hybrid-data-sync` deploys on push
   - Good for: Testing changes before production

2. **Connect main branch for production:**
   - When ready, merge `feature/hybrid-data-sync` → `main`
   - Push to `main` triggers production deployment
   - Or configure workflow to only deploy from `main`

---

## 🔧 How to Configure Branch Deployment

### Option 1: Deploy from Main Only (Recommended)

**Update workflow file** `.github/workflows/oxygen-deployment-1000013955.yml`:

```yaml
on:
  push:
    branches:
      - main  # Only deploy from main branch
```

**Then:**
- Feature branches: Test locally, no auto-deploy
- Main branch: Auto-deploys to production

### Option 2: Deploy from All Branches (Current)

**Current setup:**
```yaml
on: [push]  # Deploys from any branch
```

**Then:**
- Every push triggers deployment
- Good for: Testing all changes
- Bad for: Too many deployments

### Option 3: Deploy from Specific Branches

```yaml
on:
  push:
    branches:
      - main
      - feature/hybrid-data-sync
```

---

## 📋 Step-by-Step: Connect Main Branch

### Step 1: Merge Feature Branch to Main

```bash
cd /Users/alex/Documents/Projects/dryeyela-hydrogen

# Switch to main
git checkout main

# Pull latest
git pull origin main

# Merge feature branch
git merge feature/hybrid-data-sync

# Push to main
git push origin main
```

**What happens:**
- GitHub Actions triggers on `main` push
- Builds and deploys Hydrogen storefront
- Creates production deployment

### Step 2: Update Workflow (Optional)

**If you want main-only deployments:**

```bash
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
      - main
```

**Then commit:**
```bash
git add .github/workflows/oxygen-deployment-1000013955.yml
git commit -m "chore: deploy only from main branch"
git push origin main
```

---

## 🎨 Themes vs Hydrogen: Can You Have Both?

**Yes!** You can run both simultaneously:

### Scenario 1: Hydrogen Only (Recommended)
- **Theme:** Unpublished or hidden
- **Hydrogen:** Active storefront
- **Domain:** Points to Hydrogen

### Scenario 2: Both Running
- **Theme:** Available at `your-store.myshopify.com`
- **Hydrogen:** Available at preview URL or custom domain
- **Use case:** Testing Hydrogen while theme is live

### Scenario 3: Theme Only (Not Using Hydrogen)
- **Theme:** Active storefront
- **Hydrogen:** Not deployed or disconnected
- **Use case:** Decided not to use Hydrogen

---

## 🔍 How to Check What's Connected

### Check Hydrogen Connection

**GitHub → Shopify:**
1. Go to: Shopify Partners → Apps → Your App → Hydrogen
2. Click "Deployments" tab
3. Look for connected repository: `Mobo4/dryeyela-hydrogen`
4. Check branch: Should show which branch is connected

**GitHub → Workflow:**
1. Go to: https://github.com/Mobo4/dryeyela-hydrogen/actions
2. Check workflow runs
3. See which branch triggered each deployment

### Check Theme Connection

**Shopify Admin:**
1. Go to: Shopify Admin → Online Store → Themes
2. See published theme
3. Themes are NOT connected to GitHub (they're uploaded directly)

---

## ✅ Recommended Setup

### For Production:

1. **Main branch** → Production Hydrogen deployment
2. **Feature branches** → Preview deployments (optional)
3. **Theme** → Unpublished (if using Hydrogen only)

### Workflow Configuration:

```yaml
# .github/workflows/oxygen-deployment-1000013955.yml
on:
  push:
    branches:
      - main  # Production deployments
  pull_request:
    branches:
      - main  # Preview deployments for PRs
```

---

## 🚨 Common Confusion

### ❌ Wrong Understanding:
- "I need to connect GitHub to Shopify Themes"
- "Themes and Hydrogen are the same thing"
- "I upload Hydrogen code to Themes section"

### ✅ Correct Understanding:
- **Themes:** Traditional Shopify storefront (Liquid)
- **Hydrogen:** Modern headless storefront (React/Remix)
- **GitHub:** Connects to Hydrogen deployments, NOT themes
- **Both can exist:** But typically you use one or the other

---

## 📚 Related Documentation

- **Deployment Guide:** `docs/GITHUB_DEPLOYMENT_GUIDE.md`
- **First Deployment:** `docs/FIRST_DEPLOYMENT_GUIDE.md`
- **Branch Strategy:** `docs/DEPLOYMENT_CHECKLIST.md`

---

## 🎯 Summary

**Your Question:** "Do I connect the main branch to the themes of the store?"

**Answer:** 
- ❌ **NO** - Hydrogen doesn't connect to themes
- ✅ **YES** - Connect main branch to Hydrogen deployments
- ✅ **YES** - Merge feature branch to main when ready for production
- ✅ **YES** - Configure workflow to deploy from main branch

**Next Steps:**
1. Merge `feature/hybrid-data-sync` → `main`
2. Update workflow to deploy from `main` only (optional)
3. Push to `main` to trigger production deployment
4. Hydrogen storefront will be live (separate from themes)
