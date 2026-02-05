# Shopify App Version Form - Information Guide

**URL:** https://dev.shopify.com/dashboard/22991897/apps/319572377601/versions/new

**Purpose:** Create a new app version for Hydrogen storefront deployment

---

## 📋 Form Fields to Fill

### 1. Version Name
**Suggested Value:**
```
Hydrogen Storefront v2026-02-04
```
or
```
DryEyeLA Hydrogen Storefront
```

### 2. Version Description (if required)
**Suggested Value:**
```
Hydrogen storefront deployment for dryeyela-hydrogen repository. 
Connects GitHub repository Mobo4/dryeyela-hydrogen to Shopify store dryeyela-ai.
Enables automated deployments via GitHub Actions.
```

### 3. App Type / Configuration
- **App Type:** Headless Storefront / Hydrogen
- **Repository:** `Mobo4/dryeyela-hydrogen`
- **Branch:** `feature/hybrid-data-sync` (or `main` for production)

### 4. Storefront ID (if required)
**Value:** `1000013955`

(This is from your workflow file: `.github/workflows/oxygen-deployment-1000013955.yml`)

### 5. Store Domain (if required)
**Value:** `dryeyela-ai.myshopify.com`

---

## 🤖 Automated Form Filling

I've created a script that will:
1. Open the browser
2. Navigate to the form
3. Fill in the fields automatically
4. Wait for you to review and submit

**Run it:**
```bash
cd /Users/alex/Documents/Projects/dryeyela-hydrogen
node scripts/fill-shopify-app-form.mjs
```

**Note:** The script will:
- Open a visible browser window
- Fill in the form fields
- Wait 30 seconds for you to review
- **NOT auto-submit** (you submit manually)

---

## 📝 Manual Form Filling (If Script Doesn't Work)

### Step 1: Navigate to Form
1. Go to: https://dev.shopify.com/dashboard/22991897/apps/319572377601/versions/new
2. Log in if needed

### Step 2: Fill Version Name
- **Field:** Version name / Name
- **Value:** `Hydrogen Storefront v2026-02-04`

### Step 3: Fill Description (if shown)
- **Field:** Description / Version description
- **Value:** `Hydrogen storefront for dryeyela-hydrogen repository`

### Step 4: Configure Repository (if shown)
- **Repository:** `Mobo4/dryeyela-hydrogen`
- **Branch:** `feature/hybrid-data-sync`
- **Storefront ID:** `1000013955`

### Step 5: Submit
- Click **"Create version"** or **"Save"** button
- Review any confirmation dialogs
- Confirm submission

---

## 🔍 What This Form Does

Creating an app version in Shopify Partners allows you to:
- Link your GitHub repository to Shopify
- Enable automated deployments
- Manage storefront configurations
- Track deployment versions

**After submitting:**
- Shopify will create the connection
- GitHub Actions will be able to deploy
- You'll see deployments in Shopify Admin → Hydrogen → Deployments

---

## ✅ After Form Submission

1. **Check Connection:**
   - Go to: Shopify Admin → Hydrogen → Deployments
   - Verify storefront `1000013955` is connected

2. **Get Deployment Token:**
   - Hydrogen → Deployments → Create deployment token
   - Add to GitHub Secrets: `OXYGEN_DEPLOYMENT_TOKEN_1000013955`

3. **Set Environment Variables:**
   - Hydrogen → Environment variables
   - Add required variables (see `docs/CHROME_ERROR_SETUP.md`)

4. **Trigger Deployment:**
   ```bash
   git push origin feature/hybrid-data-sync
   ```

---

## 🆘 Troubleshooting

**Form won't load:**
- Make sure you're logged into Shopify Partners
- Check URL is correct
- Try incognito/private window

**Fields not found:**
- Shopify may have updated the form structure
- Use browser DevTools to inspect form fields
- Fill manually using the values above

**Submission fails:**
- Check all required fields are filled
- Verify repository name is correct: `Mobo4/dryeyela-hydrogen`
- Check storefront ID matches: `1000013955`

---

## 📚 Related Documentation

- **Full Setup Guide:** `docs/SHOPIFY_ADMIN_SETUP.md`
- **Deployment Guide:** `docs/GITHUB_DEPLOYMENT_GUIDE.md`
- **Environment Variables:** `docs/CHROME_ERROR_SETUP.md`
- **Troubleshooting:** `docs/NO_DEPLOYMENTS_TROUBLESHOOTING.md`
