import {
  json,
  type LoaderFunctionArgs,
  type MetaArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';
import {INGREDIENTS, SEO_CONFIG} from '~/data/navigation';
import {Link} from '@remix-run/react';
import {Heading, Text} from '~/components/Text';
import {ProductSwimlane} from '~/components/ProductSwimlane';
import {getProductsForIngredient} from '~/data/local-collections';
import {PageHero, TrustBadges} from '~/components/sections';

/**
 * Ingredient Page
 *
 * Displays products containing a specific ingredient from LOCAL_COLLECTIONS.
 * Uses INGREDIENT_PRODUCT_MAPPINGS to match ingredients to products:
 * - omega-3: PRN DE3, PRN Kids Omega, EyePromise products, MacuHealth
 * - hypochlorous-acid: Avenova, Heyedrate, Optase Protect, OCuSOFT HypoChlor
 * - tea-tree: Optase TTO products, Cliradex products
 * - hyaluronic-acid: Optase Intense, Oasis, Systane, Refresh products
 * - manuka-honey: (no products currently available)
 */
export async function loader({params}: LoaderFunctionArgs) {
  const {ingredientHandle} = params;

  if (!ingredientHandle) {
    throw new Response('Ingredient handle required', {status: 400});
  }

  const ingredient = INGREDIENTS.find((i) => i.handle === ingredientHandle);

  if (!ingredient) {
    throw new Response('Ingredient not found', {status: 404});
  }

  // Get products containing this ingredient from LOCAL_COLLECTIONS
  const localProducts = getProductsForIngredient(ingredientHandle);

  return json({
    ingredient,
    products: {nodes: localProducts},
    seo: {
      title: `${ingredient.title} Products for Dry Eye`,
      description: ingredient.description,
    },
  });
}

export const meta = ({data}: MetaArgs<typeof loader>) => {
  if (!data?.ingredient) return [];

  return getSeoMeta({
    title: data.seo.title,
    description: data.seo.description,
    titleTemplate: SEO_CONFIG.titleTemplate,
  });
};

export default function IngredientPage() {
  const {ingredient, products} = useLoaderData<typeof loader>();

  return (
    <>
      {/* Hero Section - Eyepromise Style */}
      <PageHero
        title={`${ingredient.title} Products`}
        description={ingredient.description}
        badge={products?.nodes?.length > 0 ? `${products.nodes.length}+ Products` : undefined}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Ingredients', to: '/ingredients' },
          { label: ingredient.title },
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
                Products with {ingredient.title}
              </Heading>
              <Text className="text-gray-600 text-lg max-w-2xl mx-auto">
                Discover our selection of products containing {ingredient.title.toLowerCase()} for targeted dry eye treatment.
              </Text>
            </div>
            <ProductSwimlane
              products={products}
              title=""
              count={16}
            />
          </div>
        </section>
      ) : (
        <section className="py-20 md:py-32 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
            <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100">
              <div className="text-6xl mb-6">🔬</div>
              <Heading as="h2" size="display" className="text-besilos-navy mb-4 text-3xl">
                Finding Products
              </Heading>
              <Text className="text-gray-600 text-lg mb-8">
                We're curating products with {ingredient.title.toLowerCase()}. Check back soon or browse all products.
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
              About {ingredient.title}
            </Heading>
          </div>
          <div className="bg-white rounded-2xl p-10 md:p-12 shadow-lg border border-gray-100">
            <div className="prose prose-lg max-w-none">
              <Text as="p" className="text-gray-700 text-lg mb-6 leading-relaxed">
                {ingredient.description}
              </Text>
              <Text as="p" className="text-gray-700 text-lg leading-relaxed">
                Products containing {ingredient.title.toLowerCase()} are recommended by eye care
                professionals for their proven effectiveness in treating dry eye symptoms.
                All products are backed by clinical research and doctor recommendations.
              </Text>
            </div>
            {/* Keywords for SEO */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <Text as="p" className="text-sm text-gray-500">
                Related searches: {ingredient.keywords.join(', ')}
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
              Not Sure Which Product to Choose?
            </Heading>
            <Text className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Our team can help you find the right {ingredient.title.toLowerCase()} product for your specific needs.
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/pages/contact"
                className="inline-block bg-besilos-navy text-white px-8 py-4 font-bold uppercase tracking-wider rounded-lg hover:bg-besilos-navy/90 transition-all shadow-lg"
              >
                Get Recommendations
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

