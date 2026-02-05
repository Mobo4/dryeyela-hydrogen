# App Integrations Guide

**Last Updated:** February 2026

This document describes the Shopify app integrations implemented in the DryEyeLA Hydrogen storefront.

## Implemented Integrations

### 1. Judge.me Reviews

**Status**: ✅ Implemented  
**Component**: `app/components/JudgeMeReviews.tsx`

**Features**:
- Lazy-loaded widget script
- Fetches reviews via Shopify metafields or widget
- Fallback to static reviews if Judge.me not configured
- Displays star ratings and review content

**Configuration**:
```bash
# .env
PUBLIC_JUDGEME_SHOP_DOMAIN=your-store-name
```

**Usage**:
```tsx
<JudgeMeReviews 
  productId={product.id}
  shopDomain={process.env.PUBLIC_JUDGEME_SHOP_DOMAIN}
  fallbackReviews={product.reviews || []}
/>
```

**Setup Steps**:
1. Install Judge.me app from Shopify App Store
2. Configure review request emails in Judge.me dashboard
3. Add `PUBLIC_JUDGEME_SHOP_DOMAIN` to environment variables
4. Reviews will automatically appear on product pages

---

### 2. Semantic Search with Visual Autocomplete

**Status**: ✅ Implemented  
**Components**: 
- `app/components/SearchAutocomplete.tsx`
- `app/routes/($locale).api.search.tsx`

**Features**:
- Real-time search suggestions as you type
- Visual results with product images and prices
- Debounced queries (300ms) for performance
- Click outside to close dropdown
- Navigate to full search results page

**API Route**: `/api/search?q=query&limit=5`

**Usage**:
```tsx
<SearchAutocomplete 
  locale="en"
  placeholder="Search products..."
  className="w-full"
/>
```

**Setup Steps**:
1. No additional setup required - uses Shopify Storefront API
2. Ensure Storefront API token has search permissions
3. Search is automatically available in header

---

### 3. Gorgias Chat Widget

**Status**: ✅ Implemented  
**Component**: `app/components/GorgiasChat.tsx`

**Features**:
- Lazy-loaded after page load (1 second delay)
- Only loads on client-side
- Non-blocking - doesn't affect initial page render
- Automatically injects chat widget

**Configuration**:
```bash
# .env
PUBLIC_GORGIAS_APP_ID=your-gorgias-app-id
```

**Usage**:
```tsx
<GorgiasChat 
  appId={process.env.PUBLIC_GORGIAS_APP_ID}
  enabled={!!process.env.PUBLIC_GORGIAS_APP_ID}
/>
```

**Setup Steps**:
1. Install Gorgias app from Shopify App Store
2. Get your App ID from Gorgias dashboard
3. Add `PUBLIC_GORGIAS_APP_ID` to environment variables
4. Chat widget will appear automatically

---

### 4. Klaviyo Email Marketing & Refill Logic

**Status**: ✅ Implemented  
**Component**: `app/hooks/useKlaviyoRefill.ts`

**Features**:
- Product view tracking
- Add to cart tracking
- "Time to Refill" event tracking
- Smart refill logic based on days since last order
- Configurable refill thresholds per product

**Configuration**:
```bash
# .env
PUBLIC_KLAVIYO_API_KEY=your-klaviyo-api-key
```

**Usage**:
```tsx
// Track product view
trackKlaviyoProductView({
  id: product.id,
  title: product.title,
  handle: product.handle,
});

// Track add to cart
trackKlaviyoAddToCart(product, variantId, quantity);

// Use refill hook
const { daysSinceOrder, shouldRefill } = useKlaviyoRefill(product, lastOrderDate);
```

**Setup Steps**:
1. Install Klaviyo app from Shopify App Store
2. Get API key from Klaviyo dashboard
3. Add `PUBLIC_KLAVIYO_API_KEY` to environment variables
4. Create "Time to Refill" email flow in Klaviyo
5. Set up segments based on product purchase history

**Klaviyo Events Tracked**:
- `Viewed Product` - When user views a product page
- `Added to Cart` - When user adds product to cart
- `Time to Refill` - When days since last order >= refill threshold

---

## Environment Variables

Add these to your `.env` file and Shopify Oxygen environment variables:

```bash
# Judge.me Reviews
PUBLIC_JUDGEME_SHOP_DOMAIN=your-store-name

# Gorgias Chat
PUBLIC_GORGIAS_APP_ID=your-gorgias-app-id

# Klaviyo
PUBLIC_KLAVIYO_API_KEY=your-klaviyo-api-key

# Shopify (already configured)
PUBLIC_STOREFRONT_API_TOKEN=your-token
PUBLIC_STORE_DOMAIN=your-store.myshopify.com
PUBLIC_STOREFRONT_API_VERSION=2025-01
```

## Content Security Policy (CSP)

The CSP headers in `app/entry.server.tsx` have been updated to allow:

- **Judge.me**: `https://cdn.judge.me` (scripts), `https://api.judge.me` (API)
- **Gorgias**: `https://config.gorgias.chat` (scripts), `https://api.gorgias.chat` (API)
- **Klaviyo**: `https://a.klaviyo.com` (scripts and API)

## Testing

### Judge.me
1. Visit a product page
2. Scroll to reviews section
3. Verify reviews widget loads (or fallback reviews display)

### Search Autocomplete
1. Click search bar in header
2. Type at least 2 characters
3. Verify autocomplete dropdown appears with product results
4. Click a result to navigate to product page

### Gorgias Chat
1. Load any page
2. Wait 1-2 seconds after page load
3. Verify chat widget appears in bottom-right corner

### Klaviyo Tracking
1. Open browser DevTools → Network tab
2. Filter by "klaviyo.com"
3. Visit a product page
4. Verify `Viewed Product` event is sent
5. Add product to cart
6. Verify `Added to Cart` event is sent

## Troubleshooting

### Widgets Not Loading
- Check CSP headers allow the domains
- Verify environment variables are set correctly
- Check browser console for script loading errors
- Ensure app is installed in Shopify Admin

### Search Not Working
- Verify Storefront API token has search permissions
- Check API route is accessible: `/api/search?q=test`
- Verify GraphQL query syntax is correct

### Klaviyo Events Not Sending
- Verify Klaviyo script is loaded (check Network tab)
- Check `_learnq` array exists in window object
- Verify API key is correct
- Check Klaviyo dashboard for received events

## Next Steps

### Future Enhancements
1. **MESA Integration** - Background automation for customer tagging
2. **Shopify Search App** - Enhanced semantic search with filters
3. **Matrixify/Stock Sync** - Automated CSV imports for vendor data
4. **Smart Dashboard** - Customer account page with refill reminders

### Deployment Checklist
- [ ] Add all environment variables to Shopify Oxygen
- [ ] Install all apps in Shopify Admin
- [ ] Configure Judge.me review request emails
- [ ] Set up Klaviyo email flows
- [ ] Test all integrations in production
- [ ] Monitor CSP headers in production
- [ ] Verify analytics tracking
