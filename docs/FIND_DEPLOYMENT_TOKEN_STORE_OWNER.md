# Find Deployment Token - For Store Owners

**For:** Store owners building Hydrogen storefronts for their own store  
**Not for:** Developers creating apps for the Shopify App Store

---

## 🎯 Quick Answer

**Go directly to Shopify Admin:**
- **URL:** https://admin.shopify.com/store/eyecarecenter
- **Path:** Settings → Channels → Hydrogen → Deployments
- **Look for:** "Deployment tokens" section

---

## 📍 Step-by-Step Instructions

### Step 1: Log into Shopify Admin

1. Go to: https://admin.shopify.com/store/eyecarecenter
2. Log in with your store owner account

### Step 2: Navigate to Hydrogen

**Try these paths (one should work):**

**Path A:**
- Click **"Settings"** (bottom left)
- Click **"Channels"**
- Click **"Hydrogen"**

**Path B:**
- Click **"Settings"** (bottom left)
- Click **"Apps and sales channels"**
- Find **"Hydrogen"** in the list
- Click on it

**Path C:**
- Look in the left sidebar for **"Sales channels"**
- Click **"Hydrogen"**

**Path D:**
- Click **"Online Store"**
- Look for **"Hydrogen"** section

### Step 3: Open Deployments Tab

1. Once in Hydrogen settings, click the **"Deployments"** tab
2. You should see your storefront listed
3. Storefront ID should be: `1000093695`

### Step 4: Find/Create Deployment Token

**Look for one of these sections:**

- **"Deployment tokens"**
- **"API tokens"**
- **"Deployment credentials"**
- **"Access tokens"**

**If you see existing tokens:**
- Click **"Reveal"** or **"Show"** button
- Copy the full token (40+ characters)

**If no tokens exist:**
- Click **"Create deployment token"**
- Or: **"Generate token"**
- Or: **"Add token"**
- Copy the token immediately (you won't see it again!)

---

## 🔍 What If I Can't Find Hydrogen?

### Check These:

1. **Do you have Hydrogen enabled?**
   - Hydrogen is available for Shopify Plus stores
   - Or stores with Hydrogen-enabled plans

2. **Check Sales Channels:**
   - Settings → Sales channels
   - Look for Hydrogen in the list

3. **Check Apps:**
   - Settings → Apps and sales channels
   - Look for Hydrogen app

4. **Direct URL (if available):**
   - https://admin.shopify.com/store/eyecarecenter/settings/channels/hydrogen
   - Or: https://admin.shopify.com/store/eyecarecenter/hydrogen

---

## 🔑 Token Format

**What you're looking for:**

- ✅ **Length:** 40+ characters
- ✅ **Format:** Usually hexadecimal or alphanumeric
- ✅ **Example:** `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`

**NOT these (you already have these):**
- ❌ Storefront API Token (32 chars): `f4d49a0b9ff5261da43caf42cc1dfbe5`
- ❌ Admin API Token (`shpat_...`): `shpat_xxxxxxxxxxxxx`

---

## ✅ Good News: Token Already Set!

**I checked GitHub Secrets and found:**
- ✅ `OXYGEN_DEPLOYMENT_TOKEN_1000093695` - Already added!

**You don't need to create a new token** - it's already configured!

---

## 🚀 Next Steps

Since the token is already set, you can:

1. **Deploy to preview:**
   ```bash
   git push origin feature/hybrid-data-sync
   ```

2. **Check deployment status:**
   ```bash
   node scripts/check-preview-status.mjs
   ```

3. **Monitor with Ralph loop:**
   ```bash
   node scripts/ralph-loop-check-build.mjs
   ```

---

## 🆘 Still Can't Find It?

**If you can't find the Hydrogen section:**

1. **Check your Shopify plan:**
   - Hydrogen requires Shopify Plus or Hydrogen-enabled plan
   - Contact Shopify support to enable Hydrogen

2. **Try Shopify CLI:**
   ```bash
   shopify auth login
   shopify hydrogen link
   # May show deployment token during linking
   ```

3. **Check GitHub Secrets:**
   ```bash
   gh secret list --repo Mobo4/dryeyela-hydrogen
   ```
   - If token already exists, you're good to go!

---

## 📚 Related Documentation

- **Add Token:** `docs/ADD_DEPLOYMENT_TOKEN.md`
- **Token Format:** `docs/TOKEN_FORMAT_GUIDE.md`
- **Deployment Guide:** `docs/GITHUB_DEPLOYMENT_GUIDE.md`
