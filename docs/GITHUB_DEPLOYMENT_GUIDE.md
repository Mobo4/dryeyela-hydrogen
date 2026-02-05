# GitHub & Deployment Guide for Shopify Hydrogen

## 🎯 Quick Answer

**You don't need a fork!** Forks are only for contributing to other people's projects. Since this is YOUR project, you work directly in your own GitHub repository.

## 📋 Current Setup Status

✅ **You already have deployment configured!** 

Your repository has:
- GitHub Actions workflow: `.github/workflows/oxygen-deployment-1000013955.yml`
- Automatic deployment on every push
- CI/CD pipeline set up

## 🚀 How Shopify Hydrogen Deployment Works (2026)

### Method 1: Automatic GitHub Deployment (Recommended - Already Set Up!)

**How it works:**
1. You push code to GitHub
2. GitHub Actions automatically runs
3. Builds your Hydrogen storefront
4. Deploys to Shopify Oxygen
5. Creates preview URL for testing

**Your workflow file already does this!** Every time you push to your repository, it:
- Installs dependencies
- Builds the project
- Deploys to Oxygen using `shopify hydrogen deploy`
- Runs end-to-end tests

### Method 2: Manual Deployment (For Testing)

If you want to deploy manually from your local machine:

```bash
# Make sure you're logged in
npx shopify auth login

# Deploy to Oxygen
npx shopify hydrogen deploy --token "$YOUR_DEPLOYMENT_TOKEN"
```

## 🔧 Setup Steps (If Not Already Done)

### Step 1: Connect GitHub to Shopify

1. Go to **Shopify Admin** → **Settings** → **Channels** → **Hydrogen** (or **Headless**)
2. Click **"Connect GitHub repository"**
3. Authorize Shopify GitHub App
4. Select your repository: `dryeyela-hydrogen`
5. Shopify will automatically add the deployment workflow file (you already have it!)

### Step 2: Get Deployment Token

1. In Shopify Admin → **Hydrogen/Headless** → **Deployments**
2. Click **"Create deployment token"**
3. Copy the token
4. Add to GitHub Secrets:
   - Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
   - Add secret: `OXYGEN_DEPLOYMENT_TOKEN_1000013955`
   - Paste your token

### Step 3: Set Environment Variables in Shopify

1. In Shopify Admin → **Hydrogen/Headless** → **Environment variables**
2. Add all your app integration variables:
   ```
   PUBLIC_JUDGEME_SHOP_DOMAIN=your-store-name
   PUBLIC_GORGIAS_APP_ID=your-gorgias-app-id
   PUBLIC_KLAVIYO_API_KEY=your-klaviyo-api-key
   PUBLIC_STOREFRONT_API_TOKEN=your-token
   PUBLIC_STORE_DOMAIN=your-store.myshopify.com
   ```

## 📝 GitHub Workflow Explained

Your `.github/workflows/oxygen-deployment-1000013955.yml` file:

```yaml
# This runs automatically on every push
on: [push]

jobs:
  deploy:
    # 1. Checks out your code
    # 2. Sets up Node.js
    # 3. Installs dependencies
    # 4. Builds and deploys to Oxygen
    # 5. Runs tests
```

**What happens:**
- ✅ Every push triggers deployment
- ✅ Creates preview URL for testing
- ✅ Runs automated tests
- ✅ Deploys to production when you merge to `main`

## 🌿 Branch Strategy (Recommended)

### Option 1: Simple (Good for Solo Developer)
```
main branch
  └── Push directly → Auto-deploys
```

### Option 2: Feature Branches (Better for Teams)
```
main branch (production)
  └── feature/hybrid-data-sync (your current branch)
      └── Push → Creates preview deployment
      └── Merge to main → Deploys to production
```

**Your current setup:** You're on `feature/hybrid-data-sync` branch, which is perfect!

## 🔄 Deployment Process

### Automatic (Recommended)
1. **Make changes locally**
   ```bash
   git add .
   git commit -m "Add app integrations"
   git push origin feature/hybrid-data-sync
   ```

2. **GitHub Actions runs automatically**
   - Check Actions tab in GitHub
   - See deployment progress
   - Get preview URL

3. **Test preview deployment**
   - Click the preview URL from GitHub Actions
   - Test your changes
   - Verify everything works

4. **Merge to main** (when ready for production)
   ```bash
   git checkout main
   git merge feature/hybrid-data-sync
   git push origin main
   ```
   - This triggers production deployment

### Manual (If Needed)
```bash
# Build locally
npm run build

# Deploy manually
npx shopify hydrogen deploy --token "$YOUR_TOKEN"
```

## 🎯 Publishing to Shopify Store

**Important:** Hydrogen storefronts are **separate** from your Shopify theme!

### Your Store Has Two Frontends:

1. **Shopify Theme** (classic storefront)
   - Located in Shopify Admin → Online Store → Themes
   - This is your traditional storefront

2. **Hydrogen Storefront** (headless - what you're building)
   - Deployed to Oxygen (Shopify's hosting)
   - Separate URL (e.g., `your-store.myshopify.com` or custom domain)
   - This is your new Hydrogen storefront

### To Make Hydrogen Your Main Storefront:

1. **Set Custom Domain** (Optional)
   - In Shopify Admin → Hydrogen → Domains
   - Add your custom domain (e.g., `dryeyela.com`)
   - Update DNS settings

2. **Or Use Shopify Subdomain**
   - Your Hydrogen storefront is automatically available at:
   - `https://your-store.myshopify.com` (if configured)
   - Or Oxygen preview URL

3. **Disable Theme** (If Using Hydrogen Only)
   - Shopify Admin → Online Store → Themes
   - Unpublish old theme (optional)
   - Hydrogen runs independently

## ✅ Checklist Before First Deployment

- [ ] GitHub repository connected to Shopify
- [ ] Deployment token added to GitHub Secrets
- [ ] Environment variables set in Shopify Admin
- [ ] All app integrations configured (Judge.me, Gorgias, Klaviyo)
- [ ] Test locally: `npm run dev`
- [ ] Build works: `npm run build`
- [ ] Push to GitHub and check Actions tab

## 🐛 Troubleshooting

### Deployment Fails

**Check:**
1. GitHub Actions tab → See error logs
2. Verify deployment token is correct
3. Check environment variables are set
4. Ensure `package.json` scripts work locally

### Preview URL Not Working

**Check:**
1. Wait 2-3 minutes after deployment
2. Check GitHub Actions for deployment URL
3. Verify Oxygen deployment succeeded
4. Check browser console for errors

### Environment Variables Not Loading

**Check:**
1. Variables set in Shopify Admin → Hydrogen → Environment variables
2. Variables prefixed with `PUBLIC_` are available in browser
3. Restart deployment after adding variables

## 📚 Resources

- [Shopify Hydrogen Deployment Docs](https://shopify.dev/docs/storefronts/headless/hydrogen/deployments) (Updated Feb 2026)
- [GitHub Actions for Hydrogen](https://shopify.dev/docs/storefronts/headless/hydrogen/deployments/github)
- [Oxygen Deployment Guide](https://shopify.dev/docs/storefronts/headless/hydrogen/deployments/oxygen)

## 🎓 Key Concepts

### Fork vs. Your Own Repo

**Fork** = Copy of someone else's project (for contributing)
- ❌ **You don't need this** - this is YOUR project

**Your Own Repo** = Your project repository
- ✅ **This is what you have** - work directly here

### Deployment vs. Publishing

**Deployment** = Pushing code to hosting (Oxygen)
- ✅ Happens automatically via GitHub Actions

**Publishing** = Making it live for customers
- ✅ Happens when you merge to `main` branch
- ✅ Or manually promote preview to production

## 🚀 Next Steps

1. **Push your current changes:**
   ```bash
   git add .
   git commit -m "Add app integrations: Judge.me, Gorgias, Klaviyo, Search"
   git push origin feature/hybrid-data-sync
   ```

2. **Check GitHub Actions:**
   - Go to your repo → Actions tab
   - Watch deployment progress
   - Get preview URL

3. **Test preview deployment:**
   - Click preview URL
   - Test all integrations
   - Verify everything works

4. **When ready, merge to main:**
   ```bash
   git checkout main
   git merge feature/hybrid-data-sync
   git push origin main
   ```

5. **Set up custom domain** (optional):
   - Shopify Admin → Hydrogen → Domains
   - Add your domain
   - Update DNS

---

**You're all set!** Your deployment is already configured. Just push your code and GitHub Actions will handle the rest! 🎉
