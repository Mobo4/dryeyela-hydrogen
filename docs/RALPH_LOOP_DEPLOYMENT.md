# Ralph Loop: Monitor Deployment Until Success

**Purpose:** Continuously monitor GitHub Actions build until it succeeds, using Ralph loop pattern (verify → iterate → refine).

---

## 🎯 What is Ralph Loop?

**Ralph Loop Pattern:**
1. **VERIFY** - Check current status
2. **ITERATE** - Wait and check again
3. **REFINE** - Fix issues found
4. **VERIFY** - Check again until success

---

## 🚀 Quick Start

### Run Ralph Loop Monitor

```bash
cd /Users/alex/Documents/Projects/dryeyela-hydrogen
node scripts/ralph-loop-check-build.mjs
```

**What it does:**
- ✅ Checks GitHub Actions build status every 10 seconds
- ✅ Shows progress in real-time
- ✅ Exits when build succeeds
- ✅ Shows error details if build fails

### Options

```bash
# Check more frequently (every 5 seconds)
node scripts/ralph-loop-check-build.mjs --interval 5

# Check for longer (60 attempts = 10 minutes)
node scripts/ralph-loop-check-build.mjs --max-attempts 60
```

---

## 🔧 Check and Fix Deployment (Full Ralph Loop)

**This script checks secrets AND monitors build:**

```bash
node scripts/check-and-fix-deployment.mjs
```

**What it does:**
1. ✅ Checks if deployment token exists in GitHub Secrets
2. ✅ Provides instructions if missing
3. ✅ Waits for you to add it (if needed)
4. ✅ Monitors build until success

---

## 📋 Current Issue Detected

**Error:** `OXYGEN_DEPLOYMENT_TOKEN_1000013955 not found in GitHub Secrets`

**Status:** ❌ Build failing due to missing token

---

## 🔧 Fix Steps

### Step 1: Get Deployment Token

1. **Go to Shopify Partners:**
   - https://partners.shopify.com/
   - Apps → Your App (`6fb6965ac343c320d244cdee6b60959f`)
   - Hydrogen → Deployments

2. **Create Token:**
   - Click "Create deployment token" or "Generate token"
   - Copy the token (long string)

### Step 2: Add to GitHub Secrets

1. **Go to GitHub:**
   - https://github.com/Mobo4/dryeyela-hydrogen/settings/secrets/actions

2. **Add Secret:**
   - Click "New repository secret"
   - **Name:** `OXYGEN_DEPLOYMENT_TOKEN_1000013955` (exact!)
   - **Secret:** Paste token
   - Click "Add secret"

### Step 3: Run Ralph Loop Again

```bash
node scripts/check-and-fix-deployment.mjs
```

**Or just push code:**
```bash
git push origin feature/hybrid-data-sync
```

---

## 🔍 What Ralph Loop Checks

### Verification Steps:

1. ✅ **Build Status** - Is it running/completed/failed?
2. ✅ **Conclusion** - Success or failure?
3. ✅ **Deployment Job** - Did "Deploy to Oxygen" succeed?
4. ✅ **Error Details** - What failed (if any)?

### Iteration:

- Checks every 10 seconds (configurable)
- Up to 30 attempts (5 minutes) by default
- Shows real-time status updates

### Refinement:

- Identifies specific failures
- Provides fix instructions
- Suggests next steps

---

## 📊 Example Output

```
🔄 Ralph Loop: Monitoring GitHub Actions Build

[11:08:27 PM] Attempt 1/30
────────────────────────────────────────────────────────────
🔍 VERIFY: Checking build status...
   Run #17: fix: improve deployment error handling
   Status: in_progress
   Conclusion: pending
   ⏳ Build in progress...
   🔄 Waiting 10s before next check

[11:08:37 PM] Attempt 2/30
────────────────────────────────────────────────────────────
🔍 VERIFY: Checking build status...
   Status: completed
   Conclusion: failure

❌ FAILURE: Build failed
────────────────────────────────────────────────────────────
   Error: OXYGEN_DEPLOYMENT_TOKEN_1000013955 not found

💡 Common fixes:
   1. Add token to GitHub Secrets
   2. Verify token is valid
   3. Check build logs
```

---

## 🛠️ Scripts Available

| Script | Purpose |
|--------|---------|
| `ralph-loop-check-build.mjs` | Monitor build status until success |
| `check-and-fix-deployment.mjs` | Check secrets + monitor build |
| `diagnose-deployment-failure.mjs` | Diagnose why build failed |
| `check-github-secrets.mjs` | Check if secrets are configured |

---

## ✅ Success Criteria

**Ralph Loop completes successfully when:**

1. ✅ GitHub Actions workflow completes
2. ✅ "Deploy to Oxygen" job succeeds
3. ✅ Deployment URL is generated
4. ✅ Exit code 0

**Then you can:**
- Visit preview URL
- Test the deployment
- Set environment variables (if needed)

---

## 🆘 Troubleshooting

### Script Fails to Start

**Error:** `GitHub CLI not found`
```bash
brew install gh
gh auth login
```

### Can't Check Secrets

**Error:** `Cannot check secrets`
- You may need repo admin access
- Or check manually: https://github.com/Mobo4/dryeyela-hydrogen/settings/secrets/actions

### Build Keeps Failing

**Run diagnostic:**
```bash
node scripts/diagnose-deployment-failure.mjs
```

**Check logs:**
```bash
gh run view --repo Mobo4/dryeyela-hydrogen --log-failed
```

---

## 📚 Related Documentation

- **Deployment Failure:** `docs/FIX_DEPLOYMENT_EXIT_CODE_1.md`
- **Deployment Checklist:** `docs/DEPLOYMENT_CHECKLIST.md`
- **GitHub Setup:** `docs/GITHUB_DEPLOYMENT_GUIDE.md`
