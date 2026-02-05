# 🚀 Beginner's Guide: Deploy to Shopify (Without Going Live)

**Date:** February 2026  
**For:** Testing with real Shopify data without publishing publicly

---

## 🎯 What You'll Get

When you deploy, you'll get:
- ✅ **Preview URL** - A private link to test your storefront
- ✅ **Real Shopify Data** - Your actual products, collections, pages
- ✅ **Not Public** - Only you (and people you share the link with) can see it
- ✅ **Safe Testing** - Your live store stays unchanged

**Think of it like:** Uploading photos to Google Drive - they're there, but only you can see them unless you share the link!

---

## 📋 Before You Start: Quick Checklist

Make sure you have:
- [ ] GitHub account (you already have this!)
- [ ] Shopify store (you already have this!)
- [ ] Code saved locally (you already have this!)
- [ ] Shopify CLI installed (we'll check this)

---

## 🔍 Step 0: Check Your Setup

### Check if Shopify CLI is installed:

Open Terminal (Mac) or Command Prompt (Windows) and type:

```bash
shopify version
```

**If you see a version number** (like `3.74.1`): ✅ You're good! Skip to Step 1.

**If you see "command not found"**: Install it:

```bash
npm install -g @shopify/cli @shopify/theme
```

Wait for it to finish, then try `shopify version` again.

---

## 🔗 Step 1: Connect GitHub to Shopify (One-Time Setup)

This connects your code to your Shopify store. You only do this once!

### 1.1. Go to Shopify Admin

1. Open your browser
2. Go to: `https://admin.shopify.com/store/YOUR_STORE_NAME`
3. Log in if needed

### 1.2. Find Hydrogen Settings

1. Click **"Settings"** (bottom left)
2. Click **"Channels"** or **"Sales channels"**
3. Look for **"Hydrogen"** or **"Headless"** and click it

**Can't find it?** Try:
- Settings → Apps and sales channels → Hydrogen
- Or search "Hydrogen" in the Shopify admin search bar

### 1.3. Connect Your GitHub Repository

1. Click **"Connect GitHub repository"** or **"Set up deployment"**
2. Click **"Authorize Shopify"** (if asked)
3. Select your repository: `Mobo4/dryeyela-hydrogen`
4. Click **"Connect"**

**What happens:** Shopify creates a special connection so it can see your code.

---

## 🔑 Step 2: Get Your Deployment Token (One-Time Setup)

This is like a password that lets Shopify deploy your code.

### 2.1. Create the Token

1. Still in Shopify Admin → Hydrogen/Headless
2. Click **"Deployments"** tab
3. Click **"Create deployment token"** or **"Generate token"**
4. **Copy the token** (it's a long string of letters/numbers)
5. **Save it somewhere safe** (like a text file)

**Important:** This token is secret! Don't share it publicly.

### 2.2. Add Token to GitHub Secrets

1. Go to: `https://github.com/Mobo4/dryeyela-hydrogen`
2. Click **"Settings"** (top menu)
3. Click **"Secrets and variables"** → **"Actions"** (left sidebar)
4. Click **"New repository secret"**
5. Name: `OXYGEN_DEPLOYMENT_TOKEN_1000013955`
6. Value: Paste your token
7. Click **"Add secret"**

**What happens:** GitHub now has permission to deploy to Shopify.

---

## ⚙️ Step 3: Set Environment Variables (One-Time Setup)

These are settings your storefront needs to work (like API keys).

### 3.1. Go to Environment Variables

1. In Shopify Admin → Hydrogen/Headless
2. Click **"Environment variables"** tab
3. You'll see a list (might be empty)

### 3.2. Add Your Variables

Click **"Add variable"** for each of these:

| Variable Name | What It Is | Where to Find It |
|--------------|------------|------------------|
| `PUBLIC_STOREFRONT_API_TOKEN` | Your store's API token | Shopify Admin → Apps → Manage private apps → Create → Storefront API |
| `PUBLIC_STORE_DOMAIN` | Your store domain | Usually `your-store.myshopify.com` |
| `PUBLIC_JUDGEME_SHOP_DOMAIN` | Judge.me shop name | Judge.me app settings (if using) |
| `PUBLIC_GORGIAS_APP_ID` | Gorgias app ID | Gorgias app settings (if using) |
| `PUBLIC_KLAVIYO_API_KEY` | Klaviyo API key | Klaviyo account settings (if using) |

**For each variable:**
1. Click **"Add variable"**
2. Enter the **Name** (exactly as shown above)
3. Enter the **Value**
4. Click **"Save"**

**Don't have some of these?** That's okay! Only add the ones you have. You can add more later.

---

## 💻 Step 4: Save Your Code to GitHub

Now let's upload your code so Shopify can see it.

### 4.1. Open Terminal

1. On Mac: Press `Cmd + Space`, type "Terminal", press Enter
2. On Windows: Press `Win + R`, type "cmd", press Enter

### 4.2. Go to Your Project Folder

Type this (press Enter after each line):

```bash
cd /Users/alex/Documents/Projects/dryeyela-hydrogen
```

**Check you're in the right place:**
```bash
pwd
```

You should see: `/Users/alex/Documents/Projects/dryeyela-hydrogen`

### 4.3. Check What Changed

```bash
git status
```

You'll see a list of files that changed. This is normal!

### 4.4. Save Your Changes

```bash
git add .
```

This tells Git: "I want to save all these changes"

```bash
git commit -m "Add app integrations and static page fallbacks"
```

This saves your changes with a message (like saving a file with a name).

### 4.5. Upload to GitHub

```bash
git push origin feature/hybrid-data-sync
```

**What happens:**
- Your code uploads to GitHub
- This might take 30 seconds to 2 minutes
- You'll see progress messages

**If it asks for username/password:**
- Use your GitHub username
- For password, use a **Personal Access Token** (not your regular password)
- Get token: GitHub → Settings → Developer settings → Personal access tokens → Generate new token

---

## 🚀 Step 5: Watch the Deployment

GitHub will automatically deploy your code to Shopify!

### 5.1. Go to GitHub Actions

1. Open: `https://github.com/Mobo4/dryeyela-hydrogen`
2. Click **"Actions"** tab (top menu)
3. You'll see a list of "workflow runs"

### 5.2. Find Your Deployment

1. Look for the most recent one (should say "Add app integrations..." or similar)
2. Click on it
3. You'll see a list of steps running

**What you'll see:**
- ✅ "Set up job" (green checkmark = working)
- ✅ "Install dependencies" (installing packages)
- ✅ "Build" (building your storefront)
- ✅ "Deploy" (uploading to Shopify)
- ✅ "Run tests" (testing everything works)

**This takes 2-5 minutes.** Grab a coffee! ☕

### 5.3. Get Your Preview URL

1. Scroll down to the **"Deploy"** step
2. Look for a line that says something like:
   ```
   Preview URL: https://your-store-12345.oxygen.app
   ```
3. **Copy that URL!**

**Can't find it?** Look for:
- "Deployment URL"
- "Preview deployment"
- Or check Shopify Admin → Hydrogen → Deployments

---

## 🎉 Step 6: Test Your Storefront!

### 6.1. Open Your Preview URL

1. Paste the URL in your browser
2. Press Enter
3. **Your storefront should load!** 🎊

### 6.2. What to Test

Try clicking around:
- ✅ Homepage loads
- ✅ Products show up (with real Shopify data!)
- ✅ Collections work
- ✅ Search works
- ✅ Pages work (contact, FAQ, etc.)
- ✅ Cart works (test adding items)

### 6.3. Share with Others (Optional)

Want to show someone? Just send them the preview URL!

**Important:** This URL is private - only people you share it with can see it. Your live store is still safe!

---

## 🔄 Step 7: Make Changes and Deploy Again

Made changes? Deploy again the same way:

```bash
# 1. Save changes
git add .
git commit -m "Describe what you changed"

# 2. Upload
git push origin feature/hybrid-data-sync

# 3. Wait 2-5 minutes
# 4. Get new preview URL from GitHub Actions
```

**Each deployment gets a new preview URL** - your old one still works too!

---

## 🎯 Step 8: When Ready, Make It Live (Optional)

**Right now, your storefront is only visible via preview URL.**

To make it your public storefront:

### Option A: Set a Custom Domain

1. Shopify Admin → Hydrogen → Domains
2. Add your domain (e.g., `dryeyela.com`)
3. Update DNS settings (your domain provider will help)
4. Now your storefront is live at `dryeyela.com`!

### Option B: Use Shopify Subdomain

1. Shopify Admin → Hydrogen → Settings
2. Enable "Use as primary storefront"
3. Your storefront becomes the main storefront

**Important:** Your old Shopify theme stays as backup. You can switch back anytime!

---

## ❓ Common Questions

### Q: Will this affect my live store?
**A:** No! Preview deployments are completely separate. Your live store stays exactly as it is.

### Q: How long does deployment take?
**A:** Usually 2-5 minutes. First deployment might take longer (5-10 minutes).

### Q: Can I deploy multiple times?
**A:** Yes! Deploy as many times as you want. Each deployment creates a new preview URL.

### Q: What if deployment fails?
**A:** Check GitHub Actions → Click the failed workflow → Read the error message. Common issues:
- Missing environment variables (go back to Step 3)
- Build errors (test locally first: `npm run build`)
- Wrong deployment token (go back to Step 2)

### Q: Where do I see all my deployments?
**A:** Shopify Admin → Hydrogen → Deployments (shows all preview deployments)

### Q: Can I delete old deployments?
**A:** Yes! In Shopify Admin → Hydrogen → Deployments, click the three dots → Delete

### Q: Is the preview URL permanent?
**A:** Preview URLs stay active, but if you delete the deployment, the URL stops working.

---

## 🐛 Troubleshooting

### Problem: "Deployment failed"

**Solution:**
1. Go to GitHub Actions → Click failed workflow
2. Scroll to the error (usually red text)
3. Common fixes:
   - **"Missing environment variable"** → Go to Step 3, add missing variable
   - **"Build failed"** → Test locally: `npm run build` (fix errors first)
   - **"Invalid token"** → Go to Step 2, create new token

### Problem: "Can't find Hydrogen in Shopify Admin"

**Solution:**
- Make sure you have a Shopify Plus plan (or Hydrogen-enabled plan)
- Or use Shopify CLI to deploy manually (see below)

### Problem: "Preview URL shows error page"

**Solution:**
1. Wait 2-3 minutes (deployment might still be finishing)
2. Check browser console (F12 → Console tab) for errors
3. Check environment variables are set correctly (Step 3)
4. Try deploying again

### Problem: "Git push asks for password"

**Solution:**
1. Use GitHub Personal Access Token (not regular password)
2. Get token: GitHub → Settings → Developer settings → Personal access tokens
3. Generate token with `repo` permissions
4. Use token as password

---

## 🎓 Quick Reference

### Deploy Commands (Copy & Paste)

```bash
# Save changes
git add .
git commit -m "Your message here"

# Upload to GitHub (triggers auto-deployment)
git push origin feature/hybrid-data-sync
```

### Check Deployment Status

1. GitHub: `https://github.com/Mobo4/dryeyela-hydrogen/actions`
2. Shopify: Admin → Hydrogen → Deployments

### Test Locally First

```bash
# Start local server
npm run dev

# Test build works
npm run build
```

---

## ✅ Success Checklist

You're done when:
- [ ] Code pushed to GitHub
- [ ] GitHub Actions shows ✅ (green checkmarks)
- [ ] Preview URL works in browser
- [ ] Can see real Shopify products
- [ ] All pages load correctly

---

## 🎉 You Did It!

Your storefront is now deployed and ready to test! 

**Remember:**
- Preview URL = Private testing (not public)
- Make changes → Push to GitHub → Get new preview URL
- When ready → Set custom domain to go live

**Need help?** Check the error messages in GitHub Actions - they usually tell you exactly what's wrong!

---

**Next Steps:**
1. Test everything thoroughly
2. Share preview URL with team/stakeholders
3. Make any needed changes
4. When ready, set custom domain to go live

Good luck! 🚀
