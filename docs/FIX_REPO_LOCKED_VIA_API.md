# Fix Locked Repository via API/CLI

**Problem:** GitHub repository shows as "locked" when trying to create Hydrogen storefront.

**Solution:** Use Shopify CLI or Admin API to check and fix the connection.

---

## 🚀 Quick Fix: Use Shopify CLI (Easiest)

### Step 1: Install Shopify CLI (if not installed)

```bash
npm install -g @shopify/cli @shopify/theme
```

### Step 2: Authenticate

```bash
shopify auth login
```

Select your store: `dryeyela-ai`

### Step 3: Link Storefront

```bash
cd /Users/alex/Documents/Projects/dryeyela-hydrogen
shopify hydrogen link
```

**What happens:**
- CLI will show available storefronts
- Select storefront ID `1000013955` (or create new if needed)
- Confirm connection to `Mobo4/dryeyela-hydrogen`

### Step 4: Verify Connection

```bash
shopify hydrogen env pull
```

This will pull environment variables and verify the connection.

---

## 🔧 Alternative: Use Our Script

### Option 1: Check Status (No Auth Required)

```bash
cd /Users/alex/Documents/Projects/dryeyela-hydrogen
node scripts/fix-storefront-connection.mjs
```

This will:
- Check if Shopify CLI is installed
- Check if you're authenticated
- Show current storefront ID
- Provide next steps

### Option 2: Auto-Link (Requires Auth)

```bash
# First authenticate
shopify auth login

# Then run script with --link flag
node scripts/fix-storefront-connection.mjs --link
```

---

## 🔐 Advanced: Use Admin API

If you have Admin API access:

### Step 1: Get Admin API Token

1. Shopify Admin → Settings → Apps and sales channels
2. Click **"Develop apps"** → **"Create an app"**
3. Name: `Hydrogen Admin Access`
4. Configure Admin API scopes:
   - `read_hydrogen_storefronts`
   - `write_hydrogen_storefronts`
5. Install app
6. Copy Admin API access token

### Step 2: Run API Check Script

```bash
cd /Users/alex/Documents/Projects/dryeyela-hydrogen
SHOPIFY_ADMIN_API_TOKEN=your_token \
SHOPIFY_STORE_DOMAIN=dryeyela-ai.myshopify.com \
node scripts/check-storefront-api.mjs
```

This will:
- Check all Hydrogen storefronts
- Find your storefront (ID: 1000013955)
- Show connection status
- Show GitHub repository connection

---

## 📋 What "Locked" Means

**"Locked" = Already Connected**

Your repository `Mobo4/dryeyela-hydrogen` is already connected to a Hydrogen storefront. You don't need to create a new one!

**To verify:**
1. Shopify Admin → Hydrogen → Deployments
2. Look for storefront ID: `1000013955`
3. Check if it shows `Mobo4/dryeyela-hydrogen` as connected

**If you see it:** ✅ You're already connected! Just need to:
- Get deployment token
- Set environment variables
- Trigger deployment

---

## 🔄 If You Need to Disconnect/Reconnect

### Via Shopify Admin:

1. **Hydrogen** → **Deployments** tab
2. Find storefront `1000013955`
3. Click **"Disconnect repository"** or **"Unlink"**
4. Confirm
5. Click **"Connect GitHub repository"** again
6. Select `Mobo4/dryeyela-hydrogen`

### Via GitHub:

1. Go to: https://github.com/settings/applications
2. Click **"Authorized GitHub Apps"** tab
3. Find **"Shopify"**
4. Click **"Revoke"**
5. Reconnect in Shopify Admin

---

## ✅ Verification Checklist

After fixing, verify:

- [ ] Shopify CLI: `shopify auth status` shows logged in
- [ ] Storefront linked: `shopify hydrogen link` shows your storefront
- [ ] GitHub Actions: https://github.com/Mobo4/dryeyela-hydrogen/actions shows workflows
- [ ] Shopify Admin: Hydrogen → Deployments shows your storefront
- [ ] Repository: Shows as connected (not locked)

---

## 🆘 Still Having Issues?

**Try these:**

1. **Clear browser cache** and try Shopify Admin again
2. **Use incognito/private window** to avoid cache issues
3. **Check GitHub permissions:**
   - https://github.com/settings/applications
   - Make sure Shopify has repository access
4. **Contact Shopify Support** with:
   - Storefront ID: `1000013955`
   - Repository: `Mobo4/dryeyela-hydrogen`
   - Store: `dryeyela-ai.myshopify.com`

---

## 📚 Related Scripts

- `scripts/fix-storefront-connection.mjs` - CLI-based fix
- `scripts/check-storefront-api.mjs` - API-based check

---

## 💡 Recommended Approach

**For most users:** Use Shopify CLI (`shopify hydrogen link`)

**For developers:** Use the script (`node scripts/fix-storefront-connection.mjs`)

**For troubleshooting:** Use Admin API script with your token
