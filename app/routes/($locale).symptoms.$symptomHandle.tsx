import {
  json,
  type LoaderFunctionArgs,
  type MetaArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';
import {SYMPTOMS, SEO_CONFIG} from '~/data/navigation';
import {Link} from '~/components/Link';
import {Heading, Text, Section} from '~/components/Text';
import {ProductSwimlane} from '~/components/ProductSwimlane';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';

export async function loader({params, context}: LoaderFunctionArgs) {
  const {symptomHandle} = params;

  const symptom = SYMPTOMS.find((s) => s.handle === symptomHandle);

  if (!symptom) {
    throw new Response('Symptom not found', {status: 404});
  }

  // Fetch products that might be relevant (using tags or collection)
  const {products} = await context.storefront.query(SYMPTOM_PRODUCTS_QUERY, {
    variables: {
      first: 12,
      query: symptom.keywords.slice(0, 3).join(' OR '),
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
      {/* Hero Section */}
      <section className="bg-besilos-navy text-besilos-cream py-16 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <Link to="/symptoms" className="text-besilos-sage hover:underline mb-4 inline-block">
            ← All Symptoms
          </Link>
          <Heading as="h1" size="display" className="text-besilos-cream mb-6">
            {symptom.title}
          </Heading>
          <Text as="p" size="lead" className="text-besilos-cream/80 max-w-2xl mx-auto">
            {symptom.heroText}
          </Text>
        </div>
      </section>

      {/* Products Section */}
      {products?.nodes?.length > 0 && (
        <ProductSwimlane
          products={products}
          title={`Recommended for ${symptom.title}`}
          count={8}
        />
      )}

      {/* Educational Content */}
      <Section padding="all" className="bg-besilos-cream">
        <div className="max-w-3xl mx-auto">
          <Heading as="h2" size="heading" className="text-center mb-8">
            About {symptom.title}
          </Heading>
          <div className="prose prose-lg">
            <Text as="p" className="mb-4">
              {symptom.description}
            </Text>
            <Text as="p" className="mb-4">
              Finding the right treatment depends on understanding the underlying cause
              of your symptoms. Our doctor-recommended products target the most common
              causes of {symptom.title.toLowerCase()}.
            </Text>
          </div>

          {/* Related Keywords for SEO */}
          <div className="mt-8 pt-8 border-t border-besilos-sage/20">
            <Text as="p" className="text-sm text-primary/60">
              Related: {symptom.keywords.join(', ')}
            </Text>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section padding="all">
        <div className="text-center">
          <Heading as="h3" size="lead" className="mb-4">
            Need Help Finding the Right Product?
          </Heading>
          <Text as="p" className="mb-6 text-primary/70">
            Our dry eye specialists are here to help you find relief.
          </Text>
          <Link
            to="/pages/contact"
            className="inline-block bg-besilos-sage text-white px-8 py-3 rounded-full hover:bg-besilos-sage/90 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </Section>
    </>
  );
}

const SYMPTOM_PRODUCTS_QUERY = `#graphql
  query symptomProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;
