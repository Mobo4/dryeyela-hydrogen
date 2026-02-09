import {
  json,
  type LoaderFunctionArgs,
  type MetaArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';
import {SYMPTOMS, SEO_CONFIG} from '~/data/navigation';
import {Link} from '@remix-run/react';
import {Heading, Text} from '~/components/Text';
import {ProductSwimlane} from '~/components/ProductSwimlane';
import {LOCAL_COLLECTIONS} from '~/data/local-collections';
// Compact inline header replaces PageHero and TrustBadges

/**
 * Symptom Page
 *
 * Displays products recommended for treating a specific symptom.
 * Uses LOCAL_COLLECTIONS based on symptom's recommendedCategories mapping:
 * - dry-gritty-eyes: eye-drops-lubricants, vitamins-supplements
 * - burning-stinging-eyes: eye-drops-lubricants, eyelid-sprays
 * - eye-redness: eye-drops-lubricants, eyelid-cleansers
 * - watery-eyes: eye-drops-lubricants, vitamins-supplements
 * - severe-chronic-dry-eye: eye-drops-lubricants, eye-masks, vitamins-supplements
 * - blepharitis-mgd: eyelid-cleansers, eyelid-sprays, eye-masks
 */

/**
 * Get products for a symptom based on its recommendedCategories
 */
function getProductsForSymptom(symptom: typeof SYMPTOMS[0]) {
  const recommendedCategories = symptom.recommendedCategories || [];
  const products: any[] = [];
  const seenIds = new Set<string>();

  // Collect products from each recommended category
  for (const categoryHandle of recommendedCategories) {
    const categoryProducts = LOCAL_COLLECTIONS[categoryHandle] || [];
    for (const product of categoryProducts) {
      // Avoid duplicates
      if (!seenIds.has(product.id)) {
        seenIds.add(product.id);
        products.push(product);
      }
    }
  }

  // Limit to 8 products for optimal display
  return products.slice(0, 8);
}

export async function loader({params}: LoaderFunctionArgs) {
  const {symptomHandle} = params;

  const symptom = SYMPTOMS.find((s) => s.handle === symptomHandle);

  if (!symptom) {
    throw new Response('Symptom not found', {status: 404});
  }

  // Get products from LOCAL_COLLECTIONS based on symptom's recommendedCategories
  const localProducts = getProductsForSymptom(symptom);

  return json({
    symptom,
    products: {nodes: localProducts},
    seo: {
      title: `${symptom.title} Treatment Products`,
      description: symptom.description,
    },
  });
}

export const meta = ({data}: MetaArgs<typeof loader>) => {
  if (!data?.symptom) return [];

  return getSeoMeta({
    title: data.seo.title,
    description: data.seo.description,
    titleTemplate: SEO_CONFIG.titleTemplate,
  });
};

export default function SymptomPage() {
  const {symptom, products} = useLoaderData<typeof loader>();

  return (
    <>
      {/* Compact Symptom Header */}
      <div className="bg-gradient-to-r from-besilos-navy to-besilos-navy/90 py-4 md:py-5">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <nav className="text-xs text-white/60 mb-1.5 flex items-center gap-1.5">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/symptoms" className="hover:text-white transition-colors">Symptoms</Link>
            <span>/</span>
            <span className="text-white/40">{symptom.title}</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">
                Relief for {symptom.title}
              </h1>
              <p className="text-white/70 text-sm mt-0.5 line-clamp-1 max-w-2xl">
                {symptom.heroText || symptom.description}
              </p>
            </div>
            <div className="flex items-center gap-3 md:gap-4 text-xs text-white/70 shrink-0">
              {products?.nodes?.length > 0 && (
                <span className="bg-white/10 px-3 py-1 rounded-full font-semibold">{products.nodes.length} Products</span>
              )}
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Doctor Approved
              </span>
              <span className="hidden md:inline">Free Shipping $100+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      {products?.nodes?.length > 0 ? (
        <section className="py-8 md:py-10 bg-white">
          <div className="max-w-[1600px] mx-auto px-4 md:px-8">
            <ProductSwimlane
              products={products}
              title=""
              count={12}
            />
          </div>
        </section>
      ) : (
        <section className="py-12 md:py-16 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
            <div className="bg-white rounded-2xl p-10 shadow-lg border border-gray-100">
              <Heading as="h2" size="display" className="text-besilos-navy mb-4 text-2xl">
                Finding Products
              </Heading>
              <Text className="text-gray-600 text-lg mb-6">
                We're curating the best products for {symptom.title.toLowerCase()}. Check back soon or browse all products.
              </Text>
              <Link
                to="/collections/all"
                className="inline-block bg-besilos-navy text-white px-6 py-3 font-bold uppercase tracking-wider rounded-lg hover:bg-besilos-navy/90 transition-all shadow-lg"
              >
                Browse All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Educational Content */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <Heading as="h2" size="display" className="text-besilos-navy mb-6 text-2xl md:text-3xl text-center">
            About {symptom.title}
          </Heading>
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-gray-100">
            <div className="prose prose-lg max-w-none">
              <Text as="p" className="text-gray-700 text-lg mb-4 leading-relaxed">
                {symptom.description}
              </Text>
              <Text as="p" className="text-gray-700 text-base leading-relaxed">
                Finding the right treatment depends on understanding the underlying cause
                of your symptoms. Our doctor-recommended products target the most common
                causes of {symptom.title.toLowerCase()} with clinically proven formulations.
              </Text>
            </div>
            {/* Related Keywords for SEO */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Text as="p" className="text-sm text-gray-500">
                Related: {symptom.keywords.join(', ')}
              </Text>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-besilos-navy">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <Heading as="h3" size="display" className="text-white mb-3 text-xl md:text-2xl">
            Need Help Finding the Right Product?
          </Heading>
          <Text className="text-white/80 text-base mb-6 max-w-2xl mx-auto">
            Our dry eye specialists can provide personalized recommendations based on your symptoms.
          </Text>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/pages/contact"
              className="inline-block bg-white text-besilos-navy px-6 py-3 font-bold uppercase tracking-wider rounded-lg hover:bg-gray-100 transition-all shadow-lg text-sm"
            >
              Contact Us
            </Link>
            <Link
              to="/collections/all"
              className="inline-block bg-transparent text-white border-2 border-white/50 px-6 py-3 font-bold uppercase tracking-wider rounded-lg hover:bg-white/10 transition-all text-sm"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

