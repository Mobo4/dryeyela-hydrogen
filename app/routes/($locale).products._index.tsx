import {
  json,
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import invariant from 'tiny-invariant';
import {
  Pagination,
  getPaginationVariables,
  getSeoMeta,
} from '@shopify/hydrogen';

import {Section} from '~/components/Text';
import {ProductCard} from '~/components/ProductCard';
import {Grid} from '~/components/Grid';
import {Button} from '~/components/Button';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {getImageLoadingPriority} from '~/lib/const';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import {
  HeroSection,
  TrustBadgesSection,
  CTASection,
  CategoryCardsSection,
} from '~/components/sections';
import {SHOP_CATEGORIES} from '~/data/navigation';

const PAGE_BY = 12;

export const headers = routeHeaders;

export async function loader({
  request,
  context: {storefront},
}: LoaderFunctionArgs) {
  const variables = getPaginationVariables(request, {pageBy: PAGE_BY});

  const data = await storefront.query(ALL_PRODUCTS_QUERY, {
    variables: {
      ...variables,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  invariant(data, 'No data returned from Shopify API');

  const seo = seoPayload.collection({
    url: request.url,
    collection: {
      id: 'all-products',
      title: 'All Products',
      handle: 'products',
      descriptionHtml: 'Browse our complete selection of doctor-recommended dry eye products.',
      description: 'Browse our complete selection of doctor-recommended dry eye products.',
      seo: {
        title: 'All Dry Eye Products',
        description: 'Shop our complete collection of dry eye treatments, eye drops, supplements, and more.',
      },
      metafields: [],
      products: data.products,
      updatedAt: '',
    },
  });

  return json({
    products: data.products,
    seo,
  });
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function AllProducts() {
  const {products} = useLoaderData<typeof loader>();

  // Category cards for quick navigation
  const categoryCards = SHOP_CATEGORIES.slice(0, 6).map((cat) => ({
    title: cat.title,
    description: cat.description,
    handle: cat.handle,
    to: `/collections/${cat.handle}`,
    keywords: cat.keywords.slice(0, 2),
  }));

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        title="All Products"
        description="Browse our complete selection of doctor-recommended dry eye products. From eye drops to supplements, find everything you need for lasting relief."
        variant="secondary"
        breadcrumbs={[
          {label: 'Home', to: '/'},
          {label: 'Products'},
        ]}
        badge={`${products.nodes.length}+ Products`}
      />

      {/* Trust Badges - Compact */}
      <TrustBadgesSection variant="compact" />

      {/* Quick Category Navigation */}
      <CategoryCardsSection
        title="Shop by Category"
        description="Find exactly what you need"
        cards={categoryCards}
        columns={3}
      />

      {/* Products Grid */}
      <Section className="py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-besilos-navy mb-2">All Products</h2>
            <p className="text-besilos-navy/60">Doctor-recommended treatments for dry eye relief</p>
          </div>

          <Pagination connection={products}>
            {({nodes, isLoading, NextLink, PreviousLink}) => {
              const itemsMarkup = nodes.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  loading={getImageLoadingPriority(i)}
                />
              ));

              return (
                <>
                  <div className="flex items-center justify-center mb-6">
                    <Button as={PreviousLink} variant="secondary" width="full">
                      {isLoading ? 'Loading...' : 'Previous'}
                    </Button>
                  </div>
                  <Grid data-test="product-grid" layout="products">
                    {itemsMarkup}
                  </Grid>
                  <div className="flex items-center justify-center mt-6">
                    <Button as={NextLink} variant="secondary" width="full">
                      {isLoading ? 'Loading...' : 'Load More Products'}
                    </Button>
                  </div>
                </>
              );
            }}
          </Pagination>
        </div>
      </Section>

      {/* CTA Section */}
      <CTASection
        title="Need Help Finding the Right Product?"
        description="Our dry eye specialists can help you find the perfect treatment for your specific needs."
        primaryCTA={{label: 'Contact Us', to: '/pages/contact'}}
        secondaryCTA={{label: 'Take Our Quiz', to: '/pages/dry-eye-quiz'}}
        variant="split"
        background="navy"
      />
    </>
  );
}

const ALL_PRODUCTS_QUERY = `#graphql
  query AllProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;
