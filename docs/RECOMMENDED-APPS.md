# DryEyeLA - Recommended Apps & Integrations

Based on competitive analysis of dryeyerescue.com, these apps will help achieve SEO dominance and maximize conversions.

## HIGH PRIORITY Apps

### 1. Okendo Reviews (Product Reviews)
**Purpose**: Display product reviews with star ratings, photos, and Q&A
**Cost**: $19-$119/month
**Why**: dryeyerescue uses Okendo for their review carousel and detailed product reviews

**Implementation**:
- Install from Shopify App Store
- Configure review request emails
- Add review widgets to product pages
- Enable review carousel on homepage

**Alternatives**: Judge.me ($15/mo), Loox ($9.99/mo)

---

### 2. Klaviyo (Email Marketing)
**Purpose**: Email automation, abandoned cart recovery, newsletters
**Cost**: Free up to 250 contacts, then $20+/month
**Why**: Essential for customer retention and dry eye education campaigns

**Implementation**:
- Connect to Shopify
- Set up flows: Welcome, Abandoned Cart, Post-Purchase
- Create dry eye education newsletter series
- Segment by product type purchased

---

### 3. Gorgias (Customer Support)
**Purpose**: Help desk with live chat, tickets, social integration
**Cost**: $10-$750/month based on ticket volume
**Why**: dryeyerescue uses Gorgias for customer support

**Implementation**:
- Install chat widget
- Create FAQ macros for common dry eye questions
- Set up autoresponders for after-hours

**Alternatives**: Zendesk, Tidio (free tier available)

---

## MEDIUM PRIORITY Apps

### 4. Postscript (SMS Marketing)
**Purpose**: SMS campaigns and abandoned cart texts
**Cost**: Pay-per-message model
**Why**: High open rates for time-sensitive promotions

**Implementation**:
- Collect phone numbers at checkout
- Send shipping notifications
- Promotional campaigns for new products

---

### 5. Loop Subscriptions (Subscription Management)
**Purpose**: Recurring orders for consumable products
**Cost**: $99-$399/month
**Why**: Perfect for omega-3 supplements and eye drops that need regular replenishment

**Implementation**:
- Enable "Subscribe & Save" on consumables
- Offer 10-15% discount for subscriptions
- Target products: PRN DE3, Optase drops, vitamins

**Alternatives**: Recharge ($99/mo), Bold Subscriptions

---

### 6. Searchanise (Search Enhancement)
**Purpose**: Advanced search with filters and autocomplete
**Cost**: Free-$39/month
**Why**: Help customers find products by symptom, ingredient, or brand

**Implementation**:
- Configure search filters for product type, brand, symptoms
- Add instant search suggestions
- Track search terms for SEO keywords

---

## SEO & Analytics Apps

### 7. JSON-LD for SEO
**Purpose**: Enhanced structured data for Google rich results
**Cost**: $9.99/month
**Why**: Better search visibility with rich snippets

**Already implemented in Hydrogen** - Just ensure product schema is correct

---

### 8. Google Analytics 4 + Google Ads
**Purpose**: Traffic analysis and advertising
**Cost**: Free (GA4), Pay-per-click (Ads)

**Implementation**:
```javascript
// Add to root.tsx or use Hydrogen's Analytics provider
gtag('config', 'G-XXXXXXXXXX');
gtag('config', 'AW-XXXXXXXXXX'); // Google Ads
```

---

### 9. Microsoft Clarity (Heatmaps)
**Purpose**: Free heatmaps and session recordings
**Cost**: FREE
**Why**: Understand user behavior and optimize conversions

---

## LOW PRIORITY (Future Phases)

### 10. EasyGift (Gift Cards)
**Purpose**: Enhanced gift card functionality
**Cost**: Free-$14.99/month

### 11. Rebuy (Upsells & Cross-sells)
**Purpose**: Smart product recommendations
**Cost**: $99-$499/month

### 12. Shogun (Page Builder)
**Purpose**: Landing page builder
**Cost**: $39-$499/month

---

## Implementation Priority Order

### Phase 1 (Week 1-2) - Essential
1. ✅ Klaviyo - Email marketing setup
2. ✅ Okendo or Judge.me - Reviews
3. ✅ Google Analytics 4

### Phase 2 (Week 3-4) - Growth
4. Gorgias or Tidio - Customer support
5. Postscript - SMS (optional)
6. Microsoft Clarity - Heatmaps

### Phase 3 (Month 2+) - Optimization
7. Loop Subscriptions - Recurring revenue
8. Searchanise - Better search
9. Rebuy - Upsells

---

## Shopify App Store Links

- Okendo: https://apps.shopify.com/okendo
- Judge.me: https://apps.shopify.com/judgeme
- Klaviyo: https://apps.shopify.com/klaviyo-email-marketing
- Gorgias: https://apps.shopify.com/helpdesk
- Postscript: https://apps.shopify.com/postscript
- Loop: https://apps.shopify.com/loop-subscriptions
- Searchanise: https://apps.shopify.com/searchanise

---

## Notes

- dryeyerescue.com uses Amazon Pay and PayPal - consider enabling these
- They also have an iOS app (app-id=6448961238) - mobile app could be Phase 4
- Their Google Ads ID: AW-407726965 (for competitive research)
