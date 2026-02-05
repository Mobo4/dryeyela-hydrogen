# Quick Wins Implementation Guide

**Priority:** High-Impact, Low-Effort Improvements  
**Estimated Time:** 8-12 hours total  
**Expected Impact:** +10-15% conversion rate, +15-20% SEO visibility

---

## 1. Sticky Add to Cart Widget (2-3 hours)

**Impact:** 10-20% increase in add-to-cart rate  
**File:** `app/routes/($locale).products.$productHandle.tsx`

### Implementation Steps:

1. Create sticky widget component:
```typescript
// app/components/PDP/StickyPurchaseBar.tsx
import { useInView } from 'react-intersection-observer';
import { AddToCartButton } from '~/components/AddToCartButton';
import { Money } from '@shopify/hydrogen';

export function StickyPurchaseBar({ product, selectedVariant }: {...}) {
  const { ref, inView } = useInView({
    threshold: 0,
    onChange: (inView) => {
      // Show sticky bar when purchase widget scrolls out of view
      setShowSticky(!inView);
    }
  });
  
  const [showSticky, setShowSticky] = useState(false);
  
  if (!showSticky || !selectedVariant) return null;
  
  return (
    <>
      <div ref={ref} className="h-1" /> {/* Scroll marker */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-besilos-navy/10 shadow-2xl z-50 animate-slide-up">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Product Info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <img
                src={selectedVariant.image || product.images[0]?.src}
                alt={product.title}
                className="w-16 h-16 object-cover rounded-lg border border-gray-200 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-besilos-navy truncate text-sm md:text-base">
                  {product.title}
                </h3>
                <p className="text-lg font-bold text-besilos-navy">
                  <Money data={selectedVariant.price} withoutTrailingZeros />
                </p>
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <div className="flex-shrink-0">
              <AddToCartButton
                lines={[{ merchandiseId: selectedVariant.id, quantity: 1 }]}
                className="bg-besilos-navy text-white px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-besilos-blue transition-colors whitespace-nowrap"
              >
                Add to Cart
              </AddToCartButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
```

2. Add to product page:
```typescript
// In app/routes/($locale).products.$productHandle.tsx
import { StickyPurchaseBar } from '~/components/PDP/StickyPurchaseBar';

// Add before closing </div> of main product section
<StickyPurchaseBar product={product} selectedVariant={selectedVariant} />
```

3. Add CSS animation:
```css
/* app/styles/app.css */
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
```

---

## 2. Exit Intent Popup (2-3 hours)

**Impact:** 3-8% email capture rate  
**File:** `app/components/ExitIntentPopup.tsx` (new)

### Implementation Steps:

1. Create component:
```typescript
// app/components/ExitIntentPopup.tsx
import { useState, useEffect } from 'react';
import { trackKlaviyoEvent } from '~/hooks/useKlaviyoRefill';

export function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [hasShown, setHasShown] = useState(false);
  
  useEffect(() => {
    // Check if already shown in this session
    if (sessionStorage.getItem('exitIntentShown') === 'true') {
      return;
    }
    
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves from top of screen
      if (e.clientY <= 0 && !hasShown) {
        setShow(true);
        setHasShown(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };
    
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasShown]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track email capture
    trackKlaviyoEvent('Exit Intent Email Capture', {
      email,
      timestamp: new Date().toISOString()
    });
    
    // Add to Klaviyo list
    if (typeof window !== 'undefined' && (window as any)._learnq) {
      (window as any)._learnq.push(['identify', { email }]);
    }
    
    setShow(false);
    // Show success message or redirect
    alert('Check your email for your discount code!');
  };
  
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-scale-in">
        <button
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="text-center mb-6">
          <h3 className="text-2xl md:text-3xl font-bold text-besilos-navy mb-2">
            Wait! Get 10% Off Your First Order
          </h3>
          <p className="text-gray-600">
            Enter your email to receive a special discount code
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-besilos-blue focus:outline-none"
            placeholder="Enter your email"
            required
          />
          <button
            type="submit"
            className="w-full bg-besilos-navy text-white py-3 rounded-lg font-semibold hover:bg-besilos-blue transition-colors"
          >
            Get My Discount Code
          </button>
        </form>
        
        <button
          onClick={() => setShow(false)}
          className="mt-4 text-gray-400 hover:text-gray-600 text-sm w-full"
        >
          No thanks, I'll pay full price
        </button>
      </div>
    </div>
  );
}
```

2. Add to root layout:
```typescript
// app/root.tsx
import { ExitIntentPopup } from '~/components/ExitIntentPopup';

// In Layout component, add before closing </body>
<ExitIntentPopup />
```

3. Add animations:
```css
/* app/styles/app.css */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scale-in {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out;
}
```

---

## 3. Enhanced SEO Schema (1-2 hours)

**Impact:** Rich snippets in Google, +15-25% CTR  
**File:** `app/lib/seo.server.ts`

### Implementation Steps:

1. Add FAQ Schema:
```typescript
// In app/lib/seo.server.ts - Enhance productJsonLd function
function productJsonLd({ product, selectedVariant, url }: {...}) {
  // ... existing code ...
  
  const schemas = [
    // Existing BreadcrumbList
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      // ... existing breadcrumb code ...
    },
    // Existing Product schema
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      // ... existing product code ...
      // ADD AggregateRating
      aggregateRating: product.aggregateRating ? {
        '@type': 'AggregateRating',
        ratingValue: product.aggregateRating.ratingValue,
        reviewCount: product.aggregateRating.reviewCount,
        bestRating: '5',
        worstRating: '1'
      } : undefined,
    }
  ];
  
  // ADD FAQ Schema if product has FAQs
  if (product.faqs && product.faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: product.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    });
  }
  
  return schemas;
}
```

2. Add Open Graph tags:
```typescript
// In product() function
function product({ product, url, selectedVariant }: {...}): SeoConfig {
  return {
    // ... existing fields ...
    openGraph: {
      type: 'product',
      url,
      title: product?.seo?.title ?? product?.title,
      description: truncate(product?.seo?.description ?? product?.description ?? '', 200),
      images: [
        {
          url: selectedVariant?.image?.url ?? product?.images?.[0]?.src ?? '',
          width: 1200,
          height: 630,
          alt: product?.title ?? '',
        }
      ],
      siteName: 'DryEyeLA',
    },
    twitter: {
      card: 'summary_large_image',
      title: product?.seo?.title ?? product?.title,
      description: truncate(product?.seo?.description ?? product?.description ?? '', 200),
      image: selectedVariant?.image?.url ?? product?.images?.[0]?.src ?? '',
    },
    canonical: url.split('?')[0], // Remove query params
  };
}
```

---

## 4. Enhanced E-commerce Tracking (2-3 hours)

**Impact:** Better conversion tracking, data-driven decisions  
**File:** `app/lib/analytics.ts` (new)

### Implementation Steps:

1. Create analytics utility:
```typescript
// app/lib/analytics.ts
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export function trackAddToCart(product: Product, variant: Variant, quantity: number = 1) {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'add_to_cart', {
    currency: variant.price.currencyCode,
    value: parseFloat(variant.price.amount) * quantity,
    items: [{
      item_id: variant.id,
      item_name: product.title,
      item_category: product.vendor || 'Uncategorized',
      item_brand: product.vendor,
      price: variant.price.amount,
      quantity: quantity
    }]
  });
}

export function trackViewItem(product: Product, variant: Variant) {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'view_item', {
    currency: variant.price.currencyCode,
    value: parseFloat(variant.price.amount),
    items: [{
      item_id: variant.id,
      item_name: product.title,
      item_category: product.vendor || 'Uncategorized',
      item_brand: product.vendor,
      price: variant.price.amount
    }]
  });
}

export function trackBeginCheckout(cart: Cart) {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  const items = cart.lines.edges.map(edge => ({
    item_id: edge.node.merchandise.id,
    item_name: edge.node.merchandise.product.title,
    item_category: edge.node.merchandise.product.vendor,
    price: edge.node.merchandise.price.amount,
    quantity: edge.node.quantity
  }));
  
  window.gtag('event', 'begin_checkout', {
    currency: cart.cost.totalAmount.currencyCode,
    value: parseFloat(cart.cost.totalAmount.amount),
    items
  });
}

export function trackPurchase(order: Order) {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'purchase', {
    transaction_id: order.id,
    value: parseFloat(order.totalPrice.amount),
    currency: order.currencyCode,
    items: order.lineItems.map(item => ({
      item_id: item.variant.id,
      item_name: item.title,
      quantity: item.quantity,
      price: item.variant.price.amount
    }))
  });
}
```

2. Integrate into components:
```typescript
// app/components/AddToCartButton.tsx
import { trackAddToCart } from '~/lib/analytics';

// In CartForm render function
<Button
  onClick={() => {
    trackAddToCart(product, variant, quantity);
  }}
  // ... rest of props
>
  {children}
</Button>

// app/routes/($locale).products.$productHandle.tsx
import { trackViewItem } from '~/lib/analytics';

useEffect(() => {
  if (product && selectedVariant) {
    trackViewItem(product, selectedVariant);
  }
}, [product?.id, selectedVariant?.id]);
```

---

## 5. Image Lazy Loading Optimization (1-2 hours)

**Impact:** 20-30% faster initial page load  
**File:** `app/components/OptimizedImage.tsx` (new)

### Implementation Steps:

1. Create optimized image component:
```typescript
// app/components/OptimizedImage.tsx
import { useInView } from 'react-intersection-observer';
import { Image, type ImageProps } from '@shopify/hydrogen';

export function OptimizedImage({ data, ...props }: ImageProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '50px' // Start loading 50px before entering viewport
  });
  
  return (
    <div ref={ref} className="w-full h-full">
      {inView ? (
        <Image data={data} loading="lazy" decoding="async" {...props} />
      ) : (
        <div className="w-full h-full bg-gray-200 animate-pulse" />
      )}
    </div>
  );
}
```

2. Replace Image components in ProductCard:
```typescript
// app/components/ProductCard.tsx
import { OptimizedImage } from '~/components/OptimizedImage';

// Replace <Image> with <OptimizedImage>
<OptimizedImage
  className={...}
  data={image}
  alt={image.altText || `Picture of ${product.title}`}
/>
```

---

## Testing Checklist

After implementing each feature:

- [ ] **Sticky Cart**: Test on mobile and desktop, verify it appears when scrolling past purchase widget
- [ ] **Exit Intent**: Test mouse leave from top, verify email capture works, check Klaviyo integration
- [ ] **SEO Schema**: Validate with Google Rich Results Test, check structured data in Google Search Console
- [ ] **Analytics**: Verify events fire in GA4 Real-Time reports, check e-commerce tracking
- [ ] **Lazy Loading**: Test page load speed with Lighthouse, verify images load on scroll

---

## Expected Results

After implementing all 5 quick wins:

- **Conversion Rate**: +10-15% increase
- **Page Load Speed**: -20-30% improvement
- **SEO Visibility**: +15-25% organic traffic
- **Email Capture**: +3-8% email list growth
- **User Engagement**: +5-10% time on site

---

**Next Steps:** After implementing quick wins, move to medium-priority improvements from the main analysis document.
