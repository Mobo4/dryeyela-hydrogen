# How to Find Environment Variables in Shopify Hydrogen

**Problem:** Can't find "Shopify Admin → Hydrogen → Environment variables"

**Solution:** The path depends on where you're accessing Hydrogen from. Here are all the ways:

---

## 🎯 Method 1: Shopify Partners Dashboard (Recommended)

**If you created the app in Shopify Partners:**

1. **Go to:** https://partners.shopify.com/
2. **Log in** with your Partners account
3. **Click:** "Apps" (left sidebar)
4. **Find your app:** `6fb6965ac343c320d244cdee6b60959f`
5. **Click** on the app name
6. **Click:** "Hydrogen" (left sidebar, under the app)
7. **Click:** "Storefront settings" (or look for your storefront)
8. **Click:** "Environments and variables" (or "Environment variables")
9. **Select environment:** Click on the environment (usually "Production" or "Preview")
10. **Add variables:** Click "Add variable" for each one

---

## 🎯 Method 2: Shopify Admin (If Hydrogen Channel is Visible)

**If you see "Hydrogen" in Shopify Admin:**

1. **Go to:** https://admin.shopify.com/store/dryeyela-ai
2. **Look for:** "Hydrogen" or "Headless" in the left sidebar
3. **Click** on it
4. **Click:** "Storefront settings" (or "Settings")
5. **Click:** "Environments and variables"
6. **Select environment:** Click on the environment
7. **Add variables:** Click "Add variable"

---

## 🎯 Method 3: Direct Storefront Link

**If you have a storefront ID:**

1. **Go to:** https://partners.shopify.com/
2. **Navigate to:** Apps → Your App → Hydrogen
3. **Find storefront:** Look for storefront ID `1000013955`
4. **Click** on the storefront
5. **Click:** "Environments and variables" (or "Environment variables")
6. **Select environment**
7. **Add variables**

---

## 🎯 Method 4: Using Shopify CLI (Alternative)

**If you can't find it in the UI, use the CLI:**

### Step 1: Install Shopify CLI (if not already)

```bash
npm install -g @shopify/cli @shopify/theme
```

### Step 2: Link Your Storefront

```bash
cd /Users/alex/Documents/Projects/dryeyela-hydrogen
shopify auth login
shopify hydrogen link
```

**When prompted:**
- Select your storefront: `1000013955` (or choose from list)
- Confirm linking

### Step 3: Push Environment Variables from Local File

**Create/update `.env.local` with all variables:**

```bash
# Edit .env.local
nano .env.local
```

**Add these variables:**

```env
SESSION_SECRET=uD7QK0Dg6BHB1gGNak0jlR9iQgVxMlYUQ4GvB1d+AgU=
PUBLIC_STORE_DOMAIN=dryeyela-ai.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN=your_token_here
PUBLIC_STOREFRONT_ID=your_storefront_id_here
PUBLIC_CHECKOUT_DOMAIN=checkout.shopify.com
PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID=your_client_id_here
PUBLIC_CUSTOMER_ACCOUNT_API_URL=https://shopify.com/customer-account/api
```

**Push to Shopify:**

```bash
shopify hydrogen env push
```

**When prompted:**
- Select environment: "Production" or "Preview"
- Confirm pushing variables

**What happens:**
- Variables from `.env.local` are pushed to Shopify Oxygen
- They're now available for deployments

---

## 🔍 Still Can't Find It?

### Check These:

1. **Are you logged into the right account?**
   - Shopify Partners account (for app management)
   - Shopify Admin account (for store management)

2. **Does your app have Hydrogen enabled?**
   - Go to: Partners → Apps → Your App
   - Check if "Hydrogen" appears in the left sidebar
   - If not, you may need to enable Hydrogen channel

3. **Is the storefront connected?**
   - Check if storefront ID `1000013955` exists
   - Verify GitHub repository is connected

4. **Try searching:**
   - In Shopify Partners: Search for "Environment variables"
   - In Shopify Admin: Search for "Hydrogen" or "Headless"

---

## 📋 Required Variables to Add

**Once you find the Environment Variables section, add these:**

| Variable Name | Value | Where to Get |
|--------------|-------|--------------|
| `SESSION_SECRET` | `uD7QK0Dg6BHB1gGNak0jlR9iQgVxMlYUQ4GvB1d+AgU=` | ✅ Already generated |
| `PUBLIC_STORE_DOMAIN` | `dryeyela-ai.myshopify.com` | ✅ Your store |
| `PUBLIC_STOREFRONT_API_TOKEN` | _(get from app)_ | ⚠️ See below |
| `PUBLIC_STOREFRONT_ID` | _(get from app)_ | ⚠️ See below |
| `PUBLIC_CHECKOUT_DOMAIN` | `checkout.shopify.com` | ✅ Standard |
| `PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID` | _(get from Hydrogen)_ | ⚠️ See below |

---

## 🔑 Get Missing Values

### Storefront API Token & Storefront ID

1. **Shopify Partners** → **Apps** → Your App (`6fb6965ac343c320d244cdee6b60959f`)
2. **Click:** "API credentials" tab
3. **Scroll to:** "Storefront API" section
4. **If not installed:** Click "Install app"
5. **Click:** "Reveal token"
6. **Copy:** Token → Use as `PUBLIC_STOREFRONT_API_TOKEN`
7. **Copy:** Storefront ID → Use as `PUBLIC_STOREFRONT_ID`

### Customer Account API Client ID

1. **Shopify Partners** → **Apps** → Your App → **Hydrogen**
2. **Click:** "Customer Account API" (or look in settings)
3. **Copy:** Client ID → Use as `PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID`

---

## ✅ After Adding Variables

1. **Save** all variables
2. **Trigger new deployment:**
   ```bash
   cd /Users/alex/Documents/Projects/dryeyela-hydrogen
   git commit --allow-empty -m "Trigger deployment after env vars"
   git push origin feature/hybrid-data-sync
   ```
3. **Wait 2-3 minutes** for deployment
4. **Check site:** https://dryeyela-ai-a5f3264567a9c264ad2d.o2.myshopify.dev/

---

## 🆘 Need More Help?

**If you still can't find Environment Variables:**

1. **Try CLI method** (Method 4 above) - it's the most reliable
2. **Check Shopify documentation:** https://shopify.dev/docs/storefronts/headless/hydrogen/environments
3. **Contact Shopify Support** - They can guide you to the exact location

**Share these details:**
- Which account you're logged into (Partners vs Admin)
- What you see in the left sidebar
- Screenshot of what you see (if possible)
