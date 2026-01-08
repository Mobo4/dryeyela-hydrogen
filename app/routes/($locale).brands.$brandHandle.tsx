import {
  json,
  type LoaderFunctionArgs,
  type MetaArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';
import {BRANDS, SEO_CONFIG} from '~/data/navigation';
import {Link} from '~/components/Link';
import {Heading, Text, Section} from '~/components/Text';
import {ProductSwimlane} from '~/components/ProductSwimlane';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';

export async function loader({params, context}: LoaderFunctionArgs) {
  const {brandHandle} = params;

  const brand = BRANDS.find((b) => b.handle === brandHandle);

  if (!brand) {
    throw new Response('Brand not found', {status: 404});
  }

  // Fetch products by vendor (brand name)
  const {products} = await context.storefront.query(BRAND_PRODUCTS_QUERY, {
    variables: {
      first: 24,
      query: `vendor:"${brand.name}"`,
    },
  });

  return json({
    brand,
    products,
    seo: {
      title: `${brand.name} Products`,
      description: brand.description,
    },
  });
}

export const meta = ({data}: MetaArgs<typeof loader>) => {
  if (!data?.brand) return [];

  return getSeoMeta({
    title: data.seo.title,
    description: data.seo.description,
    titleTemplate: SEO_CONFIG.titleTemplate,
  });
};

export default function BrandPage() {
  const {brand, products} = useLoaderData<typeof loader>();

  return (
    <>
      {/* Hero Section */}
      <section className="bg-besilos-navy text-besilos-cream py-16 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <Link to="/brands" className="text-besilos-sage hover:underline mb-4 inline-block">
            ← All Brands
          </Link>
          <Heading as="h1" size="display" className="text-besilos-cream mb-6">
            {brand.name}
          </Heading>
          <Text as="p" size="lead" className="text-besilos-cream/80 max-w-2xl mx-auto">
            {brand.description}
          </Text>
        </div>
      </section>

      {/* Products Section */}
      {products?.nodes?.length > 0 ? (
        <ProductSwimlane
          products={products}
          title={`${brand.name} Products`}
          count={24}
        />
      ) : (
        <Section padding="all" className="bg-besilos-cream">
          <div className="max-w-3xl mx-auto text-center">
            <Heading as="h2" size="heading" className="mb-4">
              Coming Soon
            </Heading>
            <Text as="p" className="text-primary/70 mb-8">
              {brand.name} products will be available soon. Check back later or browse our other brands.
            </Text>
            <Link
              to="/brands"
              className="inline-block bg-besilos-sage text-white px-8 py-3 rounded-full hover:bg-besilos-sage/90 transition-colors"
            >
              Browse All Brands
            </Link>
          </div>
        </Section>
      )}

      {/* Brand Info Section */}
      <Section padding="all" className="bg-besilos-cream">
        <div className="max-w-3xl mx-auto">
          <Heading as="h2" size="heading" className="text-center mb-8">
            About {brand.name}
          </Heading>
          <div className="prose prose-lg mx-auto">
            <Text as="p" className="mb-4">
              {brand.description}
            </Text>
            <Text as="p" className="mb-4">
              {brand.name} is trusted by eye care professionals for their proven effectiveness
              in treating dry eye symptoms. All {brand.name} products are recommended by dry eye specialists.
            </Text>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section padding="all">
        <div className="text-center">
          <Heading as="h3" size="lead" className="mb-4">
            Need Help Choosing?
          </Heading>
          <Text as="p" className="mb-6 text-primary/70">
            Not sure which {brand.name} product is right for you? Contact us for personalized recommendations.
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

const BRAND_PRODUCTS_QUERY = `#graphql
  query brandProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;
