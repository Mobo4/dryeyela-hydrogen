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
import {PRODUCTS_BY_FILTER_QUERY} from '~/data/queries';
import {PageHero, TrustBadges} from '~/components/sections';

/**
 * Symptom Page
 * 
 * Displays products recommended for treating a specific symptom.
 * Searches products by keywords/tags related to the symptom.
 */
export async function loader({params, context}: LoaderFunctionArgs) {
  const {symptomHandle} = params;
  const {storefront} = context;

  const symptom = SYMPTOMS.find((s) => s.handle === symptomHandle);

  if (!symptom) {
    throw new Response('Symptom not found', {status: 404});
  }

  try {
    // Fetch products that might be relevant (using tags or keywords)
    const {products} = await storefront.query(PRODUCTS_BY_FILTER_QUERY, {
      variables: {
        first: 12,
        query: symptom.keywords.slice(0, 3).join(' OR '),
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
    });

    return json({
      symptom,
      products,
      seo: {
        title: `${symptom.title} Treatment Products`,
        description: symptom.description,
      },
    });
  } catch (error) {
    console.error(`Error loading products for symptom ${symptom.title}:`, error);
    return json({
      symptom,
      products: {nodes: []},
      seo: {
        title: `${symptom.title} Treatment Products`,
        description: symptom.description,
      },
    });
  }
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
      {/* Hero Section - Eyepromise Style */}
      <PageHero
        title={`Relief for ${symptom.title}`}
        description={symptom.heroText || symptom.description}
        badge={products?.nodes?.length > 0 ? `${products.nodes.length}+ Products` : undefined}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Symptoms', to: '/symptoms' },
          { label: symptom.title },
        ]}
        background="gradient"
      />

      {/* Trust Badges */}
      <TrustBadges
        badges={[
          { number: '100%', label: 'Doctor Approved', linkTo: '/pages/about' },
          { number: '20+', label: 'Years Experience', linkTo: '/pages/about' },
          { number: '4,500+', label: 'Customer Reviews', linkTo: '/pages/about' },
          { number: '100K+', label: 'Monthly Subscriptions', linkTo: '/collections/all' },
        ]}
      />

      {/* Products Section */}
      {products?.nodes?.length > 0 ? (
        <section className="py-20 md:py-32 bg-white">
          <div className="max-w-[1600px] mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <Heading as="h2" size="display" className="text-besilos-navy mb-4 text-3xl md:text-4xl">
                Recommended for {symptom.title}
              </Heading>
              <Text className="text-gray-600 text-lg max-w-2xl mx-auto">
                Doctor-recommended products specifically chosen to address {symptom.title.toLowerCase()}.
              </Text>
            </div>
            <ProductSwimlane
              products={products}
              title=""
              count={12}
            />
          </div>
        </section>
      ) : (
        <section className="py-20 md:py-32 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
            <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100">
              <div className="text-6xl mb-6">🔍</div>
              <Heading as="h2" size="display" className="text-besilos-navy mb-4 text-3xl">
                Finding Products
              </Heading>
              <Text className="text-gray-600 text-lg mb-8">
                We're curating the best products for {symptom.title.toLowerCase()}. Check back soon or browse all products.
              </Text>
              <Link
                to="/collections/all"
                className="inline-block bg-besilos-navy text-white px-8 py-4 font-bold uppercase tracking-wider rounded-lg hover:bg-besilos-navy/90 transition-all shadow-lg"
              >
                Browse All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Educational Content - Eyepromise Style */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <Heading as="h2" size="display" className="text-besilos-navy mb-4 text-3xl md:text-4xl">
              About {symptom.title}
            </Heading>
          </div>
          <div className="bg-white rounded-2xl p-10 md:p-12 shadow-lg border border-gray-100">
            <div className="prose prose-lg max-w-none">
              <Text as="p" className="text-gray-700 text-lg mb-6 leading-relaxed">
                {symptom.description}
              </Text>
              <Text as="p" className="text-gray-700 text-lg leading-relaxed">
                Finding the right treatment depends on understanding the underlying cause
                of your symptoms. Our doctor-recommended products target the most common
                causes of {symptom.title.toLowerCase()} with clinically proven formulations.
              </Text>
            </div>
            {/* Related Keywords for SEO */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <Text as="p" className="text-sm text-gray-500">
                Related: {symptom.keywords.join(', ')}
              </Text>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Eyepromise Style */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-besilos-navy via-besilos-navy/95 to-besilos-blue/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,154,222,0.2),transparent_60%)]"></div>
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-10 md:p-16 shadow-2xl border border-white/20">
            <Heading as="h3" size="display" className="text-besilos-navy mb-4 text-2xl md:text-3xl">
              Need Help Finding the Right Product?
            </Heading>
            <Text className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Our dry eye specialists are here to help you find relief. Get personalized recommendations based on your specific symptoms.
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/pages/contact"
                className="inline-block bg-besilos-navy text-white px-8 py-4 font-bold uppercase tracking-wider rounded-lg hover:bg-besilos-navy/90 transition-all shadow-lg"
              >
                Contact Us
              </Link>
              <Link
                to="/collections/all"
                className="inline-block bg-transparent text-besilos-navy border-2 border-besilos-navy px-8 py-4 font-bold uppercase tracking-wider rounded-lg hover:bg-gray-50 transition-all"
              >
                Browse All Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

