import { useEffect, useState } from 'react';

interface Product {
  id: string;
  title: string;
  handle: string;
  refillDays?: number; // Days until refill is needed (default: 90)
}

interface OrderData {
  productId: string;
  orderDate: Date;
  quantity: number;
}

/**
 * Klaviyo Refill Logic Hook
 * 
 * Tracks when customers should refill products and sends Klaviyo events.
 * Integrates with Klaviyo for "Time to Refill" email campaigns.
 * 
 * @param product - Product to track refill for
 * @param lastOrderDate - Date of last order (optional, would come from customer account)
 */
export function useKlaviyoRefill(product: Product, lastOrderDate?: Date) {
  const [daysSinceOrder, setDaysSinceOrder] = useState<number | null>(null);
  const [shouldRefill, setShouldRefill] = useState(false);

  useEffect(() => {
    if (!lastOrderDate) {
      // In a real implementation, fetch from customer account API
      // For now, we'll track based on localStorage or session
      const storedDate = localStorage.getItem(`lastOrder_${product.id}`);
      if (storedDate) {
        lastOrderDate = new Date(storedDate);
      } else {
        return; // No order data available
      }
    }

    const now = new Date();
    const days = Math.floor((now.getTime() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24));
    setDaysSinceOrder(days);

    const refillThreshold = product.refillDays || 90; // Default 90 days
    const needsRefill = days >= refillThreshold;
    setShouldRefill(needsRefill);

    // Track Klaviyo event if refill is needed
    if (needsRefill && typeof window !== 'undefined') {
      trackKlaviyoRefillEvent(product, days);
    }
  }, [product, lastOrderDate]);

  return {
    daysSinceOrder,
    shouldRefill,
    refillThreshold: product.refillDays || 90,
  };
}

/**
 * Track Klaviyo "Time to Refill" event
 */
function trackKlaviyoRefillEvent(product: Product, daysSinceOrder: number) {
  if (typeof window === 'undefined') return;

  // Initialize Klaviyo queue if not exists
  (window as any)._learnq = (window as any)._learnq || [];

  // Track refill event
  (window as any)._learnq.push([
    'track',
    'Time to Refill',
    {
      ProductID: product.id,
      ProductName: product.title,
      ProductHandle: product.handle,
      DaysSinceOrder: daysSinceOrder,
      RefillThreshold: product.refillDays || 90,
      Timestamp: new Date().toISOString(),
    },
  ]);
}

/**
 * Track product view for Klaviyo
 */
export function trackKlaviyoProductView(product: Product) {
  if (typeof window === 'undefined') return;

  (window as any)._learnq = (window as any)._learnq || [];
  (window as any)._learnq.push([
    'track',
    'Viewed Product',
    {
      ProductID: product.id,
      ProductName: product.title,
      ProductHandle: product.handle,
    },
  ]);
}

/**
 * Track add to cart for Klaviyo
 */
export function trackKlaviyoAddToCart(product: Product, variantId: string, quantity: number = 1) {
  if (typeof window === 'undefined') return;

  (window as any)._learnq = (window as any)._learnq || [];
  (window as any)._learnq.push([
    'track',
    'Added to Cart',
    {
      ProductID: product.id,
      ProductName: product.title,
      VariantID: variantId,
      Quantity: quantity,
      Value: 0, // Would calculate from variant price
    },
  ]);
}
