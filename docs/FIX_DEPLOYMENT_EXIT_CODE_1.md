# Fix: "Deploy to Oxygen" Exit Code 1 Error

**Error:** GitHub Actions deployment fails with "Process completed with exit code 1"

**Location:** `.github/workflows/oxygen-deployment-1000013955.yml` → "Deploy to Oxygen" job

---

## 🔍 Most Common Causes (90% of cases)

### 1. Missing Deployment Token in GitHub Secrets ⚠️ **MOST COMMON**

**Error in logs:** `Failed to authenticate` or `Token not found`

**Fix:**

1. **Get deployment token from Shopify:**
   - Go to: **Shopify Partners** → **Apps** → Your App → **Hydrogen** → **Deployments**
   - Or: **Shopify Admin** → **Hydrogen** → **Deployments**
   - Click **"Create deployment token"** or **"Generate token"**
   - **Copy the token** (long string)

2. **Add to GitHub Secrets:**
   - Go to: https://github.com/Mobo4/dryeyela-hydrogen/settings/secrets/actions
   - Click **"New repository secret"**
   - **Name:** `OXYGEN_DEPLOYMENT_TOKEN_1000013955` ⚠️ **EXACT name!**
   - **Secret:** Paste token
   - Click **"Add secret"**

3. **Trigger new deployment:**
   ```bash
   git commit --allow-empty -m "Trigger deployment after adding token"
   git push origin feature/hybrid-data-sync
   ```

---

### 2. Token Expired or Invalid

**Error in logs:** `Authentication failed` or `Invalid token`

**Fix:**

1. **Generate new token** (same steps as above)
2. **Update GitHub Secret** with new token
3. **Push again** to trigger deployment

---

### 3. Build Step Failing Before Deployment

**Error in logs:** Build errors, TypeScript errors, linting errors

**Check locally:**
```bash
cd /Users/alex/Documents/Projects/dryeyela-hydrogen
npm run build
npm run typecheck
npm run lint
```

**Fix:** Fix any errors shown, then commit and push

---

### 4. Missing Dependencies

**Error in logs:** `Module not found` or `Cannot find module`

**Fix:**
```bash
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push origin feature/hybrid-data-sync
```

---

### 5. Shopify CLI Version Issue

**Error in logs:** `shopify: command not found` or CLI version mismatch

**Fix:** The workflow uses `npx shopify` which should auto-install, but if it fails:

Update workflow to specify version:
```yaml
- name: Build and Publish to Oxygen
  run: |
    npm install -g @shopify/cli@latest
    shopify hydrogen deploy --auth-bypass-token --token "${{ secrets.OXYGEN_DEPLOYMENT_TOKEN_1000013955 }}"
```

---

## 🔍 How to Check the Actual Error

### Step 1: View GitHub Actions Logs

1. Go to: https://github.com/Mobo4/dryeyela-hydrogen/actions
2. Click on the **failed workflow run** (red ❌)
3. Click on **"Deploy to Oxygen"** job
4. Scroll down to see the error message

### Step 2: Look for Specific Error Messages

**Common errors and fixes:**

| Error Message | Cause | Fix |
|--------------|-------|-----|
| `Failed to authenticate` | Missing/invalid token | Add token to GitHub Secrets |
| `Token not found` | Secret name wrong | Use exact name: `OXYGEN_DEPLOYMENT_TOKEN_1000013955` |
| `Build failed` | Code errors | Fix build errors locally first |
| `Module not found` | Missing dependencies | Run `npm install` and commit `package-lock.json` |
| `shopify: command not found` | CLI not installed | Workflow should auto-install, check logs |
| `You are not authorized` | Token permissions | Generate new token with correct permissions |

---

## ✅ Diagnostic Script

Run this to check your setup:

```bash
cd /Users/alex/Documents/Projects/dryeyela-hydrogen
node scripts/diagnose-deployment-failure.mjs
```

This will:
- ✅ Check if build works locally
- ✅ Verify workflow file exists
- ✅ Check package.json configuration
- ✅ List common failure causes
- ✅ Provide specific fix steps

---

## 🚀 Quick Fix Checklist

**Before checking logs, verify:**

- [ ] **Build works locally** (`npm run build` succeeds)
- [ ] **Workflow file exists** (`.github/workflows/oxygen-deployment-1000013955.yml`)
- [ ] **Deployment token in GitHub Secrets** (name: `OXYGEN_DEPLOYMENT_TOKEN_1000013955`)
- [ ] **Token is valid** (not expired, correct format)
- [ ] **No build errors** (TypeScript, linting pass)

**If all above are ✅, check GitHub Actions logs for specific error.**

---

## 📋 Step-by-Step Fix

### If Token is Missing:

1. **Get token:**
   - Shopify Partners → Apps → Your App → Hydrogen → Deployments
   - Click "Create deployment token"
   - Copy token

2. **Add to GitHub:**
   - https://github.com/Mobo4/dryeyela-hydrogen/settings/secrets/actions
   - New repository secret
   - Name: `OXYGEN_DEPLOYMENT_TOKEN_1000013955`
   - Value: Paste token
   - Add secret

3. **Trigger deployment:**
   ```bash
   git push origin feature/hybrid-data-sync
   ```

### If Build is Failing:

1. **Check locally:**
   ```bash
   npm run build
   ```

2. **Fix errors** shown

3. **Commit and push:**
   ```bash
   git add .
   git commit -m "Fix build errors"
   git push origin feature/hybrid-data-sync
   ```

---

## 🆘 Still Not Working?

**Share these details:**

1. **GitHub Actions log URL** (from failed workflow)
2. **Exact error message** (from "Deploy to Oxygen" job)
3. **Build status locally** (`npm run build` output)
4. **Token status** (exists in GitHub Secrets? name correct?)

**Check logs here:**
- https://github.com/Mobo4/dryeyela-hydrogen/actions
- Click failed workflow → "Deploy to Oxygen" → Scroll to error

---

## 📚 Related Documentation

- **Deployment Troubleshooting:** `docs/DEPLOYMENT_FAILURE_TROUBLESHOOTING.md`
- **Fix Deployment Failure:** `docs/FIX_DEPLOYMENT_FAILURE.md`
- **No Deployments:** `docs/NO_DEPLOYMENTS_TROUBLESHOOTING.md`
- **Deployment Checklist:** `docs/DEPLOYMENT_CHECKLIST.md`
