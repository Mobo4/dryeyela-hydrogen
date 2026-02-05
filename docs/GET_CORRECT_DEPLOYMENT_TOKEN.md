# Get the Correct Oxygen Deployment Token

**Current Issue:** The token `86360b8fcf51c6476adca419631ac43b` is a **Storefront API token**, not an **Oxygen deployment token**.

---

## 🎯 Two Different Tokens Needed

### 1. Storefront API Token ✅ (You Have This)
- **Value:** `86360b8fcf51c6476adca419631ac43b`
- **Purpose:** Connect Hydrogen storefront to Shopify Storefront API
- **Where:** `.env.local` + Shopify Oxygen Environment Variables
- **Status:** ✅ Added to `.env.local`

### 2. Oxygen Deployment Token ⚠️ (You Need This)
- **Purpose:** Deploy Hydrogen storefront to Shopify Oxygen via GitHub Actions
- **Where:** GitHub Secrets only
- **Status:** ⚠️ **MISSING** - Need to get this

---

## 🔑 How to Get Oxygen Deployment Token

### Method 1: Shopify Partners Dashboard (Recommended)

1. **Go to:** https://partners.shopify.com/
2. **Log in** with your Partners account
3. **Navigate to:**
   - Apps → Your App (`6fb6965ac343c320d244cdee6b60959f`)
   - Hydrogen → Storefront settings
   - Deployments tab
4. **Create Token:**
   - Click **"Create deployment token"** or **"Generate token"**
   - Name it (e.g., "GitHub Actions Deployment")
   - **Copy the token** (should be 40+ characters, different from Storefront API token)

### Method 2: Shopify Admin

1. **Go to:** https://admin.shopify.com/store/dryeyela-ai
2. **Navigate to:** Hydrogen → Deployments
3. **Create Token:**
   - Click **"Create deployment token"**
   - Copy the token

### Method 3: Shopify CLI

```bash
cd /Users/alex/Documents/Projects/dryeyela-hydrogen
shopify auth login
shopify hydrogen link
# Follow prompts - may show deployment token or help you get it
```

---

## ➕ Add Token to GitHub Secrets

**After getting the deployment token:**

```bash
gh secret set OXYGEN_DEPLOYMENT_TOKEN_1000013955 \
  --repo Mobo4/dryeyela-hydrogen \
  --body "YOUR_DEPLOYMENT_TOKEN_HERE"
```

**Or manually:**
1. Go to: https://github.com/Mobo4/dryeyela-hydrogen/settings/secrets/actions
2. Click "New repository secret"
3. Name: `OXYGEN_DEPLOYMENT_TOKEN_1000013955`
4. Value: Paste deployment token
5. Add secret

---

## 🔍 Token Format Comparison

| Token Type | Length | Format | Example |
|------------|--------|--------|---------|
| **Storefront API Token** | 32 chars | Hex string | `86360b8fcf51c6476adca419631ac43b` |
| **Oxygen Deployment Token** | 40+ chars | Longer hex/string | `shpat_xxxxxxxxxxxxx` or longer hex |
| **App Secret** | Varies | Starts with `shpss_` | `shpss_xxxxxxxxxxxxx` |

---

## ✅ Verification

**After adding deployment token:**

1. **Check secret exists:**
   ```bash
   gh secret list --repo Mobo4/dryeyela-hydrogen
   ```
   Should show: `OXYGEN_DEPLOYMENT_TOKEN_1000013955`

2. **Trigger deployment:**
   ```bash
   git commit --allow-empty -m "Test deployment with correct token"
   git push origin feature/hybrid-data-sync
   ```

3. **Monitor with Ralph loop:**
   ```bash
   node scripts/ralph-loop-check-build.mjs
   ```

---

## 🆘 Still Getting "Error processing deployment token"?

**Possible causes:**
1. **Wrong token type** - Using Storefront API token instead of deployment token
2. **Token expired** - Generate new token
3. **Token for wrong storefront** - Ensure token matches storefront ID `1000013955`
4. **Token format issue** - Should be 40+ characters

**Fix:**
- Get fresh token from Shopify Admin → Hydrogen → Deployments
- Ensure it's specifically a "deployment token" (not Storefront API token)
- Update GitHub Secret with new token

---

## 📚 Related Documentation

- **Token Format Guide:** `docs/TOKEN_FORMAT_GUIDE.md`
- **Deployment Failure:** `docs/FIX_DEPLOYMENT_EXIT_CODE_1.md`
- **Ralph Loop:** `docs/RALPH_LOOP_DEPLOYMENT.md`
