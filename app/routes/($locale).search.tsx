import {
  defer,
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {Await, Form, useLoaderData} from '@remix-run/react';
import {Suspense} from 'react';
import {
  Pagination,
  getPaginationVariables,
  Analytics,
  getSeoMeta,
} from '@shopify/hydrogen';

import {Section, Text} from '~/components/Text';
import {Input} from '~/components/Input';
import {Grid} from '~/components/Grid';
import {Button} from '~/components/Button';
import {ProductCard} from '~/components/ProductCard';
import {ProductSwimlane} from '~/components/ProductSwimlane';
import {FeaturedCollections} from '~/components/FeaturedCollections';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {getImageLoadingPriority, PAGINATION_SIZE} from '~/lib/const';
import {seoPayload} from '~/lib/seo.server';
import {
  HeroSection,
  TrustBadgesSection,
  CTASection,
  EmptyState,
  PageHero,
  TrustBadges,
} from '~/components/sections';

import {
  getFeaturedData,
  type FeaturedData,
} from './($locale).featured-products';

export async function loader({
  request,
  context: {storefront},
}: LoaderFunctionArgs) {
  const searchParams = new URL(request.url).searchParams;
  const searchTerm = searchParams.get('q')!;
  const variables = getPaginationVariables(request, {pageBy: 12});

  const {products} = await storefront.query(SEARCH_QUERY, {
    variables: {
      searchTerm,
      ...variables,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  const shouldGetRecommendations = !searchTerm || products?.nodes?.length === 0;

  const seo = seoPayload.collection({
    url: request.url,
    collection: {
      id: 'search',
      title: 'Search',
      handle: 'search',
      descriptionHtml: 'Search results',
      description: 'Search results',
      seo: {
        title: 'Search',
        description: `Showing ${products.nodes.length} search results for "${searchTerm}"`,
      },
      metafields: [],
      products,
      updatedAt: new Date().toISOString(),
    },
  });

  return defer({
    seo,
    searchTerm,
    products,
    noResultRecommendations: shouldGetRecommendations
      ? getNoResultRecommendations(storefront)
      : Promise.resolve(null),
  });
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Search() {
  const {searchTerm, products, noResultRecommendations} =
    useLoaderData<typeof loader>();
  const noResults = products?.nodes?.length === 0;
  const hasResults = products?.nodes?.length > 0;

  return (
    <>
      {/* Hero Section with Search - Eyepromise Style */}
      <PageHero
        title={searchTerm ? `Results for "${searchTerm}"` : 'Search Products'}
        description="Find the right dry eye products for your needs"
        breadcrumbs={[
          {label: 'Home', to: '/'},
          {label: 'Search'},
        ]}
        background="gradient"
      />

      {/* Search Form */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <Form method="get" className="relative max-w-2xl mx-auto">
            <Input
              defaultValue={searchTerm}
              name="q"
              placeholder="Search for eye drops, supplements, brands..."
              type="search"
              className="w-full px-6 py-4 pr-24 rounded-full border-2 border-gray-200 focus:border-besilos-blue bg-white text-besilos-navy placeholder:text-gray-400 shadow-lg"
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-besilos-navy text-white font-bold tracking-wider rounded-full hover:bg-besilos-navy/90 transition-colors shadow-lg"
              type="submit"
            >
              Search
            </button>
          </Form>

          {hasResults && (
            <p className="text-center mt-4 text-gray-600 font-medium">
              Found {products.nodes.length} products
            </p>
          )}
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges
        badges={[
          { number: 'Rx', label: 'Doctor Selected', linkTo: '/pages/about' },
          { number: 'PF', label: 'Preservative-Free Options', linkTo: '/collections/eye-drops-lubricants' },
          { number: '$100+', label: 'Free Shipping', linkTo: '/pages/shipping-returns' },
          { number: '30-Day', label: 'Easy Returns', linkTo: '/pages/shipping-returns' },
        ]}
      />

      {/* Results or No Results */}
      {!searchTerm || noResults ? (
        <NoResults
          noResults={noResults}
          searchTerm={searchTerm}
          recommendations={noResultRecommendations}
        />
      ) : (
        <Section className="py-12">
          <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
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
                        {isLoading ? 'Loading...' : 'Load More'}
                      </Button>
                    </div>
                  </>
                );
              }}
            </Pagination>
          </div>
        </Section>
      )}

      {/* CTA Section */}
      <CTASection
        title="Can't Find What You're Looking For?"
        description="Our dry eye specialists can help you find the right products."
        primaryCTA={{label: 'Contact Us', to: '/pages/contact'}}
        secondaryCTA={{label: 'Browse All Products', to: '/collections/all'}}
        variant="centered"
        background="navy"
      />

      <Analytics.SearchView data={{searchTerm, searchResults: products}} />
    </>
  );
}

function NoResults({
  noResults,
  searchTerm,
  recommendations,
}: {
  noResults: boolean;
  searchTerm: string;
  recommendations: Promise<null | FeaturedData>;
}) {
  return (
    <>
      {noResults && searchTerm && (
        <EmptyState
          title="No Results Found"
          description={`We couldn't find any products matching "${searchTerm}". Try a different search or browse our collections.`}
          icon="search"
          primaryCTA={{label: 'Shop All Products', to: '/collections/all'}}
          secondaryCTA={{label: 'Contact Support', to: '/pages/contact'}}
        />
      )}
      {!searchTerm && (
        <Section className="py-8">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <Text className="text-besilos-navy/60">
              Start typing to search for dry eye products, brands, or treatments.
            </Text>
          </div>
        </Section>
      )}
      <Suspense>
        <Await
          errorElement="There was a problem loading related products"
          resolve={recommendations}
        >
          {(result) => {
            if (!result) return null;
            const {featuredCollections, featuredProducts} = result;

            return (
              <>
                <FeaturedCollections
                  title="Popular Collections"
                  collections={featuredCollections}
                />
                <ProductSwimlane
                  title="Trending Products"
                  products={featuredProducts}
                />
              </>
            );
          }}
        </Await>
      </Suspense>
    </>
  );
}

export function getNoResultRecommendations(
  storefront: LoaderFunctionArgs['context']['storefront'],
) {
  return getFeaturedData(storefront, {pageBy: PAGINATION_SIZE});
}

const SEARCH_QUERY = `#graphql
  query PaginatedProductsSearch(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $searchTerm: String
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor,
      sortKey: RELEVANCE,
      query: $searchTerm
    ) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }

  ${PRODUCT_CARD_FRAGMENT}
` as const;
