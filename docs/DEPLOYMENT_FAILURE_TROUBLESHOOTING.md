# Deployment Failure Troubleshooting

**Issue:** Build failed to deploy to Oxygen

## 🔍 Common Causes

### 1. Missing Deployment Token (Most Common)

**Error:** `Failed to authenticate` or `Token not found`

**Fix:**
1. Go to: **Shopify Admin** → **Hydrogen** → **Deployments**
2. Click **"Create deployment token"** or **"Generate token"**
3. Copy the token
4. Go to: **GitHub** → **Settings** → **Secrets and variables** → **Actions**
5. Add secret: `OXYGEN_DEPLOYMENT_TOKEN_1000013955`
6. Paste the token
7. Click **"Add secret"**

### 2. Build Errors

**Error:** TypeScript errors, linting errors, or build failures

**Check locally:**
```bash
npm run build
npm run typecheck
npm run lint
```

**Fix:** Fix the errors shown, then commit and push again

### 3. Missing Dependencies

**Error:** `Module not found` or `Cannot find module`

**Fix:**
```bash
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

### 4. Shopify CLI Issues

**Error:** `shopify hydrogen deploy` fails

**Fix:**
- Make sure you have the latest Shopify CLI:
  ```bash
  npm install -g @shopify/cli @shopify/theme
  ```

### 5. Environment Variables Missing

**Error:** Build succeeds but site shows 404

**Fix:** Add environment variables in Shopify Admin (see `CHROME_ERROR_SETUP.md`)

---

## 🔍 How to Check the Error

### Option 1: GitHub Actions Page
1. Go to: https://github.com/Mobo4/dryeyela-hydrogen/actions
2. Click on the failed workflow run
3. Click on **"Deploy to Oxygen"** job
4. Scroll to see the error message

### Option 2: Check Build Locally
```bash
cd /Users/alex/Documents/Projects/dryeyela-hydrogen
npm run build
```

If this fails locally, fix the errors before pushing.

---

## ✅ Quick Fixes

### If Missing Token:
1. Get token from Shopify Admin
2. Add to GitHub Secrets
3. Push again: `git push origin feature/hybrid-data-sync`

### If Build Errors:
1. Fix errors locally
2. Test: `npm run build`
3. Commit and push

### If TypeScript Errors:
The build might still work even with TypeScript errors (they're warnings). But if deployment fails, you may need to fix critical ones.

---

## 🆘 Still Not Working?

Share the exact error message from GitHub Actions and I can help fix it!
