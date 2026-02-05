import { defer, type MetaFunction, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData } from '@remix-run/react';
import { useState, useEffect } from 'react';
import { PRN_PRODUCTS, getPrnProduct } from '~/data/prn-products';
import { VariantSelector } from '~/components/VariantSelector';
import { JudgeMeReviews } from '~/components/JudgeMeReviews';
import { ProductRecommendations } from '~/components/ProductRecommendations';
import { trackKlaviyoProductView } from '~/hooks/useKlaviyoRefill';
import { TrustBadges } from '~/components/sections';

// Generic Product Page for PRN Products
// Handles dynamic routing based on 'productHandle' param

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.product) return [{ title: 'Product Not Found' }];
  const { product } = data;
  return [
    { title: product.seodata.title },
    { name: 'description', content: product.seodata.description },
    { property: 'og:title', content: product.seodata.title },
    { property: 'og:description', content: product.seodata.description },
    { property: 'og:image', content: product.images[0].src },
    { property: 'og:url', content: product.seodata.url },
    { property: 'og:type', content: 'product' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ];
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { productHandle } = params;

  if (!productHandle) {
    throw new Response('Missing product handle', { status: 400 });
  }

  // Step 1: Try to fetch from Shopify
  let shopifyProduct = null;
  try {
    const result = await context.storefront.query(PRODUCT_QUERY, {
      variables: {
        handle: productHandle,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    });
    shopifyProduct = result?.product;
  } catch (error) {
    console.warn(`[HybridLoader] Shopify query failed for "${productHandle}":`, error);
    // Continue to local fallback
  }

  // Step 2: Get local enrichment data (if available)
  const localProduct = getPrnProduct(productHandle);

  // Step 3: Merge or Fallback
  let product = null;
  let isHybrid = false;

  if (shopifyProduct) {
    // HYBRID MODE: Use Shopify data + Local enrichment
    isHybrid = true;
    const shopifyImages = shopifyProduct.images?.nodes || [];
    const shopifyVariants = shopifyProduct.variants?.nodes || [];

    product = {
      // Core data from Shopify
      id: shopifyProduct.id,
      handle: shopifyProduct.handle,
      title: shopifyProduct.title,
      description: shopifyProduct.description,

      // Enrichment from Local (fallback to empty if not available)
      subtitle: localProduct?.subtitle || '',
      doctorNote: localProduct?.doctorNote || null,
      science: localProduct?.science || null,
      benefits: localProduct?.benefits || [],
      ingredients: localProduct?.ingredients || [],
      faqs: localProduct?.faqs || [],
      reviews: localProduct?.reviews || [],
      relatedProducts: localProduct?.relatedProducts || [],

      // Images: Prefer Shopify, fallback to local
      images: shopifyImages.length > 0
        ? shopifyImages.map((img: any) => ({ src: img.url, alt: img.altText || shopifyProduct.title }))
        : (localProduct?.images || []),

      // Variants: Transform Shopify format + merge local metadata
      variants: shopifyVariants.map((v: any) => {
        const localVariant = localProduct?.variants?.find((lv: any) => lv.sku === v.sku);
        return {
          id: v.id,
          title: v.title,
          sku: v.sku,
          price: parseFloat(v.price?.amount || '0'),
          image: v.image?.url || shopifyImages[0]?.url || localProduct?.images?.[0]?.src,
          recommended: localVariant?.recommended || false,
          savings: localVariant?.savings || null,
        };
      }),

      // SEO from Shopify or Local
      seodata: {
        title: shopifyProduct.seo?.title || shopifyProduct.title,
        description: shopifyProduct.seo?.description || shopifyProduct.description,
        url: `https://dryeyela.com/products/${productHandle}`,
      },
    };
  } else if (localProduct) {
    // LOCAL ONLY MODE: Use local data directly (dev/unsynced products)
    product = localProduct;
  }

  if (!product) {
    throw new Response('Product Not Found', { status: 404 });
  }

  // Resolve related products
  const relatedProducts = (product.relatedProducts || [])
    .map((relatedId: string) => getPrnProduct(relatedId) || Object.values(PRN_PRODUCTS).find(p => p.id === relatedId))
    .filter(Boolean);

  // Pass app config for client components
  const appConfig = {
    judgeMeShopDomain: context.env.PUBLIC_JUDGEME_SHOP_DOMAIN,
  };

  return defer({ product, relatedProducts, isHybrid, error: null, appConfig });
}

// GraphQL Query for Shopify Product
const PRODUCT_QUERY = `#graphql
  query Product(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      handle
      title
      description
      seo {
        title
        description
      }
      images(first: 10) {
        nodes {
          url
          altText
          width
          height
        }
      }
      variants(first: 20) {
        nodes {
          id
          title
          sku
          price {
            amount
            currencyCode
          }
          image {
            url
          }
        }
      }
    }
  }
` as const;


export default function GenericProductPage() {
  const { product, relatedProducts, error, appConfig } = useLoaderData<typeof loader>();

  // If loader caught an error, display it
  if (error) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Product</h1>
        <p className="text-slate-600">{error}</p>
      </div>
    );
  }

  // Initialize state based on the CURRENT product
  // Use safe navigation operator and fallback
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.find((v: any) => v.recommended) || product?.variants?.[0]
  );

  // Sync state when product changes (if client-side navigation happens)
  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants?.find((v: any) => v.recommended) || product.variants?.[0]);
    }
  }, [product]);

  // Track product view for Klaviyo
  useEffect(() => {
    if (product) {
      trackKlaviyoProductView({
        id: product.id,
        title: product.title,
        handle: product.handle || '',
      });
    }
  }, [product]);

  if (!product) return null;
  // Fallback if no variants exist but product does (should render simplified view, but for now null)
  if (!selectedVariant && product.variants?.length) return null;

  return (
    <div className="bg-white text-slate-800 font-sans">
      {/* Hero Section */}
      <section className="bg-[#fcfbfc] pt-12 pb-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Product Image Column - Clean grey background, professional studio photography */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="relative w-full max-w-lg aspect-square rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden mb-8 group" style={{ backgroundColor: '#F5F5F5' }}>
              {/* Product Image - High resolution, sharp textures, dramatic but clear professional studio lighting */}
              <img
                key={selectedVariant?.id || 'main'}
                src={selectedVariant?.image || product.images[0].src}
                alt={selectedVariant?.title || product.title}
                className="w-full h-full object-contain p-8 md:p-12 relative z-10 transition-transform duration-500 group-hover:scale-105 animate-fade-in image-render-crisp-edges"
                style={{ 
                  animation: 'fadeIn 0.5s ease-in-out',
                  imageRendering: '-webkit-optimize-contrast'
                }}
              />
            </div>
          </div>

          {/* Product Details Column */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h1 className="text-4xl md:text-[2.5rem] font-bold text-[#152c52] leading-tight mb-2">
                {product.title}
              </h1>
              <p className="text-lg text-slate-500 font-medium">
                {product.subtitle}
              </p>
            </div>

            <div className="prose text-slate-600 leading-relaxed">
              <p>{product.description}</p>
            </div>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && selectedVariant && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Select Supply</h3>
                <VariantSelector
                  variants={product.variants}
                  selectedVariant={selectedVariant}
                  onSelect={setSelectedVariant}
                />

                <div className="mt-8 pt-6 border-t border-slate-100">
                  {/* Placeholder for Add to Cart */}
                  <button className="w-full bg-[#356ecb] hover:bg-[#2a58a3] text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all text-lg flex justify-between items-center group">
                    <span>Add to Cart</span>
                    <span className="opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-transform">
                      ${selectedVariant.price}
                    </span>
                  </button>
                  <p className="text-center text-xs text-slate-400 mt-3">
                    Free Shipping on all US orders over $50
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Doctor's Take Section */}
      {product.doctorNote && (
        <section className="bg-[#152c52] py-16 px-4">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="w-48 md:w-64 flex-shrink-0 relative">
              <div className="absolute inset-0 bg-blue-400 rounded-xl opacity-20 transform translate-x-2 translate-y-2"></div>
              <img
                src={product.doctorNote.image}
                alt={product.doctorNote.author}
                className="w-full h-auto rounded-xl border-4 border-white shadow-2xl relative z-10 bg-slate-200"
              />
            </div>
            <div className="flex-1 text-center md:text-left text-white">
              <h2 className="text-3xl font-bold mb-2">Doctor's Take</h2>
              <div className="h-1 w-20 bg-blue-400 mx-auto md:mx-0 mb-6"></div>
              <blockquote className="text-xl md:text-2xl font-light italic leading-relaxed opacity-90 mb-6">
                "{product.doctorNote.quote}"
              </blockquote>
              <div>
                <cite className="font-bold text-lg not-italic block">{product.doctorNote.author}</cite>
                <span className="text-blue-300 text-sm uppercase tracking-wider">{product.doctorNote.role}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Benefits Grid */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#152c52] mb-4">Clinically Proven Benefits</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Scientifically formulated to support tear film health and provide lasting dry eye relief.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {product.benefits.map((benefit: any, index: number) => (
              <div key={index} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#356ecb] transition-colors duration-300">
                  <span className="text-2xl text-[#356ecb] group-hover:text-white transition-colors duration-300">✓</span>
                </div>
                <h3 className="text-xl font-bold text-[#152c52] mb-3">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Science / Explanation Section */}
      {product.science && (
        <section className="bg-[#152c52] py-20 px-4 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-400 rounded-full opacity-10 blur-3xl"></div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{product.science.title}</h2>
              <p className="text-blue-100 text-lg leading-relaxed mb-8">
                {product.science.description}
              </p>
              <ul className="space-y-4">
                {product.science.points.map((point: string, i: number) => (
                  <li key={i} className="flex items-start">
                    <span className="bg-blue-500 rounded-full p-1 mr-3 mt-1 shadow-lg">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </span>
                    <span className="text-lg">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-300 mb-2">3x</div>
                <div className="text-xl">Better Absorption</div>
                <div className="text-sm text-blue-200 mt-2">vs. Ethyl Ester Fish Oils</div>
              </div>
              <div className="mt-8 border-t border-white/10 pt-8 grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-white mb-1">rTG</div>
                  <div className="text-xs text-blue-200">Form found in nature</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">2.2g</div>
                  <div className="text-xs text-blue-200">EPA + DHA per serving</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Ingredients & Comparison */}
      <section className="bg-slate-50 py-20 px-4 border-t border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl font-bold text-[#152c52] mb-6">Transparency You Can Trust</h2>
            <p className="text-slate-600 mb-8 max-w-lg">
              We believe in full transparency. No hidden fillers, just pure, potent ingredients designed for your eye health.
            </p>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-[#152c52] mb-4 border-b border-slate-100 pb-2">Ingredients List</h3>
              <ul className="space-y-4">
                {product.ingredients.map((ing: string, i: number) => (
                  <li key={i} className="flex items-start text-slate-700">
                    <span className="mr-3 text-[#4A9F53] mt-1 shrink-0">●</span>
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            {product.images[1] && (
              <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-200 transform hover:scale-[1.02] transition-transform duration-500">
                <img
                  src={product.images[1]?.src}
                  alt="Comparison Chart"
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-center text-xs text-slate-400 mt-4 uppercase tracking-wider">Market Comparison</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#152c52] mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {product.faqs.map((faq: any, i: number) => (
            <details key={i} className="group bg-white rounded-lg border border-slate-200 shadow-sm open:shadow-md transition-shadow">
              <summary className="flex cursor-pointer items-center justify-between p-6 list-none">
                <span className="text-lg font-bold text-[#152c52]">{faq.question}</span>
                <span className="text-blue-500 transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="px-6 pb-6 text-slate-600 group-open:animate-fadeIn">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges
        badges={[
          { number: '100%', label: 'Doctor Approved', linkTo: '/pages/about' },
          { number: '20+', label: 'Years Experience', linkTo: '/pages/about' },
          { number: '4,500+', label: 'Customer Reviews', linkTo: '/pages/about' },
          { number: '100K+', label: 'Monthly Subscriptions', linkTo: '/collections/all' },
        ]}
      />

      {/* Reviews Section - Judge.me Integration */}
      <JudgeMeReviews 
        productId={product.id}
        shopDomain={appConfig?.judgeMeShopDomain}
        fallbackReviews={product.reviews || []}
      />

      {/* Recommendations Section */}
      <ProductRecommendations products={relatedProducts as any[]} />
    </div>
  );
}
