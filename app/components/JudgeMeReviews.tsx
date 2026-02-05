import { useEffect, useRef } from 'react';

interface JudgeMeReviewsProps {
  productId: string;
  shopDomain?: string;
  fallbackReviews?: Array<{
    id: string;
    author: string;
    rating: number;
    title: string;
    text: string;
    date: string;
  }>;
}

/**
 * Judge.me Reviews Widget Component
 * 
 * Lazy-loads Judge.me widget script and displays reviews.
 * Falls back to static reviews if Judge.me is not configured.
 * 
 * @param productId - Shopify product ID (GID format: gid://shopify/Product/123456)
 * @param shopDomain - Judge.me shop domain (e.g., 'your-store')
 * @param fallbackReviews - Static reviews to show if Judge.me fails
 */
export function JudgeMeReviews({ 
  productId, 
  shopDomain,
  fallbackReviews = [] 
}: JudgeMeReviewsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Only load on client side
    if (typeof window === 'undefined') return;
    
    // Extract numeric product ID from GID format
    const numericId = productId.replace('gid://shopify/Product/', '');

    // Load Judge.me widget script (only once)
    if (!scriptLoadedRef.current && shopDomain) {
      const script = document.createElement('script');
      script.src = `https://cdn.judge.me/widget.js`;
      script.async = true;
      script.onload = () => {
        scriptLoadedRef.current = true;
        
        // Initialize Judge.me widget
        if ((window as any).judge_me_widget) {
          (window as any).judge_me_widget.init({
            shop_domain: shopDomain,
            product_id: numericId,
          });
        }
      };
      document.body.appendChild(script);
    }

    // Alternative: Use Judge.me metafield data if available
    // This would be fetched in the loader and passed as props
  }, [productId, shopDomain]);

  // Show fallback reviews if Judge.me is not configured
  if (!shopDomain && fallbackReviews.length > 0) {
    return <FallbackReviews reviews={fallbackReviews} />;
  }

  return (
    <section className="bg-white py-16 px-4 border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#152c52] mb-4">
            Customer Reviews
          </h2>
        </div>
        
        {/* Judge.me widget container */}
        <div 
          ref={containerRef}
          className="judge-me-reviews"
          data-product-id={productId.replace('gid://shopify/Product/', '')}
        />
        
        {/* Fallback if widget doesn't load */}
        {fallbackReviews.length > 0 && (
          <div className="mt-8">
            <FallbackReviews reviews={fallbackReviews} />
          </div>
        )}
      </div>
    </section>
  );
}

function FallbackReviews({ reviews }: { reviews: Array<{
  id: string;
  author: string;
  rating: number;
  title: string;
  text: string;
  date: string;
}> }) {
  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <>
      <div className="flex justify-center items-center gap-2 mb-8">
        <div className="flex text-yellow-400">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className="text-2xl">
              {star <= Math.round(averageRating) ? '★' : '☆'}
            </span>
          ))}
        </div>
        <span className="text-slate-600 font-medium">
          ({reviews.length} reviews)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm"
          >
            <div className="flex text-yellow-400 mb-3 text-sm">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>{star <= review.rating ? '★' : '☆'}</span>
              ))}
            </div>
            <h3 className="font-bold text-[#152c52] mb-2">{review.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              "{review.text}"
            </p>
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span className="font-semibold text-slate-500">
                {review.author}
              </span>
              <span>{new Date(review.date).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
