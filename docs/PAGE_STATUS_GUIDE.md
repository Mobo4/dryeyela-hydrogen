# Page Status Guide - What Works Locally vs. Production

**Date:** February 2026

## 🔍 Understanding Page Behavior

### How Pages Work in Hydrogen

Your Hydrogen storefront has **two types of pages**:

1. **Static Pages** - Defined in code (always work)
2. **Dynamic Shopify Pages** - Fetched from Shopify Admin (need to exist in Shopify)

## ✅ Pages That Work Locally (No Shopify Required)

These pages are **hardcoded** in your codebase and work immediately:

### Static Pages (Always Work)
- ✅ `/` - Homepage
- ✅ `/pages/learn` - Learn page (hardcoded)
- ✅ `/pages/prn` - PRN brand page (hardcoded)
- ✅ `/pages/avenova` - Avenova brand page (hardcoded)
- ✅ `/pages/eyepromise` - EyePromise brand page (hardcoded)
- ✅ `/pages/about` - About page (fetches from Shopify, but has fallback)
- ✅ `/products/de3-omega` - Product page (uses local fallback data)
- ✅ `/products/kids-omega` - Product page (uses local fallback data)
- ✅ `/collections/all` - All products collection
- ✅ `/search` - Search page
- ✅ `/symptoms` - Symptoms index
- ✅ `/brands` - Brands index

## ⚠️ Pages That Need Shopify Setup

These pages **query Shopify** and will show 404 if the page doesn't exist in Shopify Admin:

### Dynamic Shopify Pages (Need Setup)
- ⚠️ `/pages/about` - **Works if page exists in Shopify Admin**
- ⚠️ `/pages/contact` - **Needs to be created in Shopify Admin**
- ⚠️ `/pages/faq` - **Needs to be created in Shopify Admin**
- ⚠️ `/pages/treatment-guide` - **Needs to be created in Shopify Admin**
- ⚠️ `/pages/shipping-returns` - **Needs to be created in Shopify Admin**
- ⚠️ `/pages/terms-conditions` - **Needs to be created in Shopify Admin**
- ⚠️ `/pages/careers` - **Needs to be created in Shopify Admin**

### Collections (Need Setup)
- ⚠️ `/collections/eye-drops-lubricants` - **Works if collection exists**
- ⚠️ `/collections/vitamins-supplements` - **Works if collection exists**
- ⚠️ `/collections/[any-collection]` - **Shows "Coming Soon" if doesn't exist**

## 🔧 How to Fix Missing Pages

### Option 1: Create Pages in Shopify Admin (Recommended for Production)

1. Go to **Shopify Admin** → **Online Store** → **Pages**
2. Click **"Add page"**
3. Create pages with these exact handles:
   - `about`
   - `contact`
   - `faq`
   - `treatment-guide`
   - `shipping-returns`
   - `terms-conditions`
   - `careers`
4. Add content to each page
5. **Publish** the pages

**Result:** Pages will work immediately in both local dev and production!

### Option 2: Create Static Fallback Pages (For Development)

Create hardcoded route files like `/pages/learn.tsx`:

```typescript
// app/routes/($locale).pages.contact.tsx
export default function ContactPage() {
  return (
    <div>
      <h1>Contact Us</h1>
      <p>Contact form here...</p>
    </div>
  );
}
```

**Result:** Works locally, but you'll need Shopify pages for production anyway.

## 📋 Current Page Status

### ✅ Working Pages (Tested)
- `/` - Homepage ✅
- `/pages/learn` - Learn page ✅
- `/pages/prn` - PRN brand page ✅
- `/pages/about` - About page ✅ (if exists in Shopify)
- `/products/de3-omega` - Product page ✅
- `/collections/all` - All products ✅

### ⚠️ May Show 404 (Need Shopify Setup)
- `/pages/contact` - Contact page
- `/pages/faq` - FAQ page
- `/pages/treatment-guide` - Treatment guide
- `/pages/shipping-returns` - Shipping & returns
- `/pages/terms-conditions` - Terms & conditions
- `/pages/careers` - Careers page

### 🔄 Collections Behavior
- **If collection exists in Shopify:** Shows products ✅
- **If collection doesn't exist:** Shows "Coming Soon" with fallback UI ✅
- **Collections with local fallback:** Work immediately ✅

## 🎯 Will Pages Work on Real Site?

### Yes, IF:
1. ✅ Pages are created in Shopify Admin
2. ✅ Collections are created in Shopify Admin
3. ✅ Products are published to Hydrogen sales channel
4. ✅ Environment variables are set correctly

### No, IF:
1. ❌ Pages don't exist in Shopify Admin (will show 404)
2. ❌ Collections don't exist (will show "Coming Soon")
3. ❌ Products not published to Hydrogen channel
4. ❌ Missing environment variables

## 🚀 Quick Fix: Create Missing Pages

### Step 1: Create Pages in Shopify Admin

1. **Login to Shopify Admin**
2. **Go to:** Online Store → Pages
3. **Create these pages** (use exact handles):

| Handle | Title | Content |
|--------|-------|---------|
| `contact` | Contact Us | Add contact form or info |
| `faq` | Frequently Asked Questions | Add FAQ content |
| `treatment-guide` | Treatment Guide | Add treatment information |
| `shipping-returns` | Shipping & Returns | Add shipping policy |
| `terms-conditions` | Terms & Conditions | Add terms |
| `careers` | Careers | Add job listings or info |

### Step 2: Verify Pages Work

After creating pages:
1. **Local:** Refresh browser - pages should load
2. **Production:** Deploy and test - pages will work

## 🔍 Testing Page Status

### Check if Page Exists in Shopify:
```bash
# Test locally
curl http://localhost:3000/pages/contact

# If 404: Page doesn't exist in Shopify
# If 200: Page exists and works!
```

### Check Collections:
```bash
curl http://localhost:3000/collections/eye-drops-lubricants

# If 404: Collection doesn't exist
# If 200: Collection exists
# If "Coming Soon": Collection doesn't exist but fallback shows
```

## 💡 Best Practice

**For Production:**
1. Create all pages in Shopify Admin first
2. This ensures pages work in both dev and production
3. Content can be edited in Shopify Admin without code changes
4. Better SEO (pages indexed by Shopify)

**For Development:**
- Static pages (like `/pages/learn`) work immediately
- Dynamic pages need Shopify setup
- Collections show "Coming Soon" if missing (graceful fallback)

## 📝 Summary

**What works locally:**
- ✅ Static pages (learn, prn, avenova, etc.)
- ✅ Product pages (with local fallback)
- ✅ Collections (with fallback UI)
- ✅ Search functionality

**What needs Shopify setup:**
- ⚠️ Dynamic pages (contact, faq, etc.) - Create in Shopify Admin
- ⚠️ Collections - Create in Shopify Admin
- ⚠️ Products - Publish to Hydrogen channel

**Will it work on real site?**
- ✅ **YES** - If pages/collections exist in Shopify Admin
- ❌ **NO** - If pages/collections don't exist (will show 404 or "Coming Soon")

---

**Next Step:** Create missing pages in Shopify Admin to ensure everything works in production!
