import {
  json,
  type LoaderFunctionArgs,
  type MetaArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';
import {INGREDIENTS, SEO_CONFIG} from '~/data/navigation';
import {Link} from '~/components/Link';
import {Heading, Text, Section} from '~/components/Text';
import {ProductSwimlane} from '~/components/ProductSwimlane';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';

export async function loader({params, context}: LoaderFunctionArgs) {
  const {ingredientHandle} = params;

  const ingredient = INGREDIENTS.find((i) => i.handle === ingredientHandle);

  if (!ingredient) {
    throw new Response('Ingredient not found', {status: 404});
  }

  // Fetch products with this ingredient
  const {products} = await context.storefront.query(INGREDIENT_PRODUCTS_QUERY, {
    variables: {
      first: 16,
      query: ingredient.keywords.slice(0, 3).join(' OR '),
    },
  });

  return json({
    ingredient,
    products,
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
      {/* Hero Section */}
      <section className="bg-besilos-navy text-besilos-cream py-16 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <Link to="/ingredients" className="text-besilos-sage hover:underline mb-4 inline-block">
            ← All Ingredients
          </Link>
          <Heading as="h1" size="display" className="text-besilos-cream mb-6">
            {ingredient.title}
          </Heading>
          <Text as="p" size="lead" className="text-besilos-cream/80 max-w-2xl mx-auto">
            {ingredient.description}
          </Text>
        </div>
      </section>

      {/* Products Section */}
      {products?.nodes?.length > 0 && (
        <ProductSwimlane
          products={products}
          title={`Products with ${ingredient.title}`}
          count={8}
        />
      )}

      {/* Educational Content */}
      <Section padding="all" className="bg-besilos-cream">
        <div className="max-w-3xl mx-auto">
          <Heading as="h2" size="heading" className="text-center mb-8">
            About {ingredient.title}
          </Heading>
          <div className="prose prose-lg">
            <Text as="p" className="mb-4">
              {ingredient.description}
            </Text>
            <Text as="p" className="mb-4">
              Products containing {ingredient.title.toLowerCase()} are recommended by eye care
              professionals for their proven effectiveness in treating dry eye symptoms.
            </Text>
          </div>

          {/* Keywords for SEO */}
          <div className="mt-8 pt-8 border-t border-besilos-sage/20">
            <Text as="p" className="text-sm text-primary/60">
              Related searches: {ingredient.keywords.join(', ')}
            </Text>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section padding="all">
        <div className="text-center">
          <Heading as="h3" size="lead" className="mb-4">
            Not Sure Which Product to Choose?
          </Heading>
          <Text as="p" className="mb-6 text-primary/70">
            Our team can help you find the right {ingredient.title.toLowerCase()} product for your needs.
          </Text>
          <Link
            to="/pages/contact"
            className="inline-block bg-besilos-sage text-white px-8 py-3 rounded-full hover:bg-besilos-sage/90 transition-colors"
          >
            Get Recommendations
          </Link>
        </div>
      </Section>
    </>
  );
}

const INGREDIENT_PRODUCTS_QUERY = `#graphql
  query ingredientProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;
