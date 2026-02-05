# Where to Find/Create the Deployment Token

**Token Name:** `OXYGEN_DEPLOYMENT_TOKEN_1000093695`  
**Storefront ID:** `1000093695`

---

## 🔍 Where to Find It

### Option 1: Shopify Admin (For Your Own Store)

**Step-by-step:**

1. **Go to Shopify Admin:**
   - https://admin.shopify.com/store/eyecarecenter
   - Log in to your store

2. **Navigate to Hydrogen:**
   - Go to **Settings** → **Channels** → **Hydrogen**
   - Or: **Settings** → **Apps and sales channels** → **Hydrogen**
   - Or: Look for **"Hydrogen"** in the left sidebar under **"Sales channels"**

3. **Open Deployments:**
   - Click the **"Deployments"** tab
   - You should see your storefront listed (ID: `1000093695`)

4. **Find/Create Token:**
   - Look for **"Deployment tokens"** or **"API tokens"** section
   - If you see existing tokens, click **"Reveal"** or **"Show"** to see them
   - If no tokens exist, click **"Create deployment token"** or **"Generate token"**

5. **Copy the Token:**
   - The token will be shown (may be masked with dots)
   - Click **"Reveal"** or **"Show"** to see the full token
   - Copy the entire token (should be 40+ characters)

---

### Option 2: Direct URL (If Available)

**Alternative paths in Shopify Admin:**

- **Path 1:** Settings → Channels → Hydrogen → Deployments
- **Path 2:** Settings → Apps and sales channels → Hydrogen → Deployments  
- **Path 3:** Sales channels → Hydrogen → Deployments
- **Path 4:** Online Store → Hydrogen → Deployments

**Once in Deployments:**
1. Find storefront ID: `1000093695`
2. Look for **"Deployment tokens"** section
3. Click **"Create token"** or **"Reveal"** existing token
4. Copy the token (40+ characters)

---

## 🔑 Token Format

**What the token looks like:**

- **Length:** 40+ characters (usually 40-64 characters)
- **Format:** Usually hexadecimal or alphanumeric
- **Example:** `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0` (40+ chars)

**NOT the same as:**
- ❌ Storefront API Token (32 chars): `f4d49a0b9ff5261da43caf42cc1dfbe5`
- ❌ Admin API Token (starts with `shpat_`): `shpat_xxxxxxxxxxxxx`

---

## 📋 What If I Can't Find It?

### Check These Locations:

1. **Shopify Admin → Settings → Channels → Hydrogen → Deployments**
   - Primary location for store owners

2. **Shopify Admin → Settings → Apps and sales channels → Hydrogen → Deployments**
   - Alternative path

3. **Shopify Admin → Sales channels → Hydrogen → Deployments**
   - Another alternative path

3. **GitHub Actions Workflow File:**
   - Check if token was already added: `.github/workflows/oxygen-deployment-1000093695.yml`
   - Look for `OXYGEN_DEPLOYMENT_TOKEN_1000093695` in the workflow

4. **GitHub Secrets:**
   - Check if it's already there: https://github.com/Mobo4/dryeyela-hydrogen/settings/secrets/actions
   - Look for `OXYGEN_DEPLOYMENT_TOKEN_1000093695`

---

## 🆕 Create a New Token

**If you need to create a new token:**

1. **In Shopify Admin → Settings → Channels → Hydrogen → Deployments**

2. **Find "Deployment Tokens" section** (usually near the top or bottom of the Deployments page)

3. **Click "Create deployment token"** or **"Generate token"** button

4. **Give it a name** (optional):
   - Example: "GitHub Actions Deployment"
   - Or: "Production Deployment Token"

5. **Copy the token immediately** (you won't be able to see it again!)

6. **Add to GitHub Secrets:**
   ```bash
   gh secret set OXYGEN_DEPLOYMENT_TOKEN_1000093695 \
     --repo Mobo4/dryeyela-hydrogen \
     --body "PASTE_TOKEN_HERE"
   ```

---

## ✅ Verify Token Was Added

**Check if token exists in GitHub:**

```bash
gh secret list --repo Mobo4/dryeyela-hydrogen | grep OXYGEN_DEPLOYMENT_TOKEN_1000093695
```

**Or use the check script:**

```bash
node scripts/check-github-secrets.mjs
```

---

## 🚨 Important Notes

### Token Security:

- ⚠️ **Tokens are shown only once** when created
- ⚠️ **Copy immediately** - you can't retrieve it later
- ⚠️ **If lost, create a new one** and update GitHub Secrets
- ✅ **Tokens are stored encrypted** in GitHub Secrets
- ✅ **Only GitHub Actions can access them**

### Token Types:

| Token Type | Purpose | Format | Where Used |
|------------|---------|--------|------------|
| **Deployment Token** | Deploy to Oxygen | 40+ chars | GitHub Secrets |
| **Storefront API Token** | Query products/data | 32 chars | `.env.local` |
| **Admin API Token** | Admin API calls | `shpat_...` | `.env.local` |

---

## 📚 Related Documentation

- **Add Token:** `docs/ADD_DEPLOYMENT_TOKEN.md`
- **Get Correct Token:** `docs/GET_CORRECT_DEPLOYMENT_TOKEN.md`
- **Token Format Guide:** `docs/TOKEN_FORMAT_GUIDE.md`

---

## 🆘 Still Can't Find It?

**Try these:**

1. **Check if token already exists:**
   ```bash
   gh secret list --repo Mobo4/dryeyela-hydrogen
   ```

2. **Check GitHub Actions logs:**
   - If deployment failed, it might show what token format is expected

3. **Contact Shopify Support:**
   - They can help locate the deployment token section

4. **Use Shopify CLI:**
   ```bash
   shopify auth login
   shopify hydrogen link
   # May show deployment token during linking
   ```
