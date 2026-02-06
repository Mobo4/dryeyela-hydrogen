import { useEffect } from 'react';
import {
  json,
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { useInView } from 'react-intersection-observer';
import type {
  Filter,
  ProductCollectionSortKeys,
  ProductFilter,
} from '@shopify/hydrogen/storefront-api-types';
import {
  Pagination,
  flattenConnection,
  getPaginationVariables,
  Analytics,
  getSeoMeta,
} from '@shopify/hydrogen';

import { Section, Text } from '~/components/Text';
import { Grid } from '~/components/Grid';
import { Button } from '~/components/Button';
import { ProductCard } from '~/components/ProductCard';
import { SortFilter, type SortParam, type AppliedFilter } from '~/components/SortFilter';
import { PRODUCT_CARD_FRAGMENT } from '~/data/fragments';
import { routeHeaders } from '~/data/cache';
import { seoPayload } from '~/lib/seo.server';
import { FILTER_URL_PREFIX } from '~/components/SortFilter';
import { getImageLoadingPriority } from '~/lib/const';
import { parseAsCurrency } from '~/lib/utils';
import {
  HeroSection,
  TrustBadgesSection,
  CTASection,
  EmptyState,
  CategoryCardsSection,
  PageHero,
  TrustBadges,
} from '~/components/sections';
import { VisualFilterBar } from '~/components/VisualFilterBar';
import { getFallbackCollection, getRelatedCollections } from '~/data/collections';

export const headers = routeHeaders;

export async function loader({ params, request, context }: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });
  const { collectionHandle } = params;
  const locale = context.storefront.i18n;

  if (!collectionHandle) {
    throw new Response('Missing collectionHandle param', { status: 400 });
  }

  // Get fallback metadata FIRST (before any queries)
  const fallbackMeta = getFallbackCollection(collectionHandle);
  const relatedCollections = getRelatedCollections(collectionHandle, 3);

  const searchParams = new URL(request.url).searchParams;

  const { sortKey, reverse } = getSortValuesFromParam(
    searchParams.get('sort') as SortParam,
  );
  const filters = [...searchParams.entries()].reduce(
    (filters, [key, value]) => {
      if (key.startsWith(FILTER_URL_PREFIX)) {
        const filterKey = key.substring(FILTER_URL_PREFIX.length);
        filters.push({
          [filterKey]: JSON.parse(value),
        });
      }
      return filters;
    },
    [] as ProductFilter[],
  );

  // Try to fetch from Shopify with error handling
  let collection = null;
  let collections: { edges: Array<{ node: { title: string; handle: string } }> } = { edges: [] };

  try {
    const result = await context.storefront.query(
      COLLECTION_QUERY,
      {
        variables: {
          ...paginationVariables,
          handle: collectionHandle,
          filters,
          sortKey,
          reverse,
          country: context.storefront.i18n.country,
          language: context.storefront.i18n.language,
        },
      },
    );
    collection = result?.collection;
    collections = result?.collections ?? { edges: [] };
  } catch (error) {
    console.warn(`[CollectionLoader] Shopify query failed for "${collectionHandle}":`, error);
    // Continue to local fallback
  }

  // Check for local fallback products FIRST (before checking Shopify collection)
  const { LOCAL_COLLECTIONS } = await import('~/data/local-collections');
  const localProducts = LOCAL_COLLECTIONS[collectionHandle];

  // If collection doesn't exist in Shopify OR has no products, use LOCAL fallback
  const hasShopifyProducts = (collection?.products?.nodes?.length ?? 0) > 0;
  
  if (!hasShopifyProducts && localProducts && localProducts.length > 0) {
    // Construct a virtual collection object with local products
    const virtualCollection = {
      id: `gid://shopify/Collection/local-${collectionHandle}`,
      handle: collectionHandle,
      title: fallbackMeta.title,
      description: fallbackMeta.description,
      seo: {
        title: fallbackMeta.title,
        description: fallbackMeta.description,
      },
      products: {
        filters: [] as Filter[],
        nodes: localProducts,
        pageInfo: { hasNextPage: false, hasPreviousPage: false }
      }
    };

    const seo = seoPayload.collection({ collection: virtualCollection, url: request.url });

    return json({
      collection: virtualCollection,
      collectionHandle,
      fallbackMeta,
      relatedCollections,
      appliedFilters: [],
      collections: flattenConnection(collections),
      seo,
    });
  }

  // If no Shopify collection AND no local products, show "Coming Soon"
  if (!collection || !hasShopifyProducts) {
    const seo = {
      title: fallbackMeta.title,
      description: fallbackMeta.description,
      titleTemplate: '%s | Collection',
      url: request.url,
      media: undefined,
      jsonLd: [],
    };

    return json({
      collection: null,
      collectionHandle,
      fallbackMeta,
      relatedCollections,
      appliedFilters: [],
      collections: flattenConnection(collections),
      seo,
    });
  }

  const seo = seoPayload.collection({ collection, url: request.url });

  const allFilterValues = collection.products.filters.flatMap(
    (filter) => filter.values,
  );

  const appliedFilters = filters
    .map((filter) => {
      const foundValue = allFilterValues.find((value) => {
        const valueInput = JSON.parse(value.input as string) as ProductFilter;
        if (valueInput.price && filter.price) {
          return true;
        }
        return (
          JSON.stringify(valueInput) === JSON.stringify(filter)
        );
      });
      if (!foundValue) {
        console.error('Could not find filter value for filter', filter);
        return null;
      }

      if (foundValue.id === 'filter.v.price') {
        const input = JSON.parse(foundValue.input as string) as ProductFilter;
        const min = parseAsCurrency(input.price?.min ?? 0, locale);
        const max = input.price?.max
          ? parseAsCurrency(input.price.max, locale)
          : '';
        const label = min && max ? `${min} - ${max}` : 'Price';

        return {
          filter,
          label,
        };
      }
      return {
        filter,
        label: foundValue.label,
      };
    })
    .filter((filter): filter is NonNullable<typeof filter> => filter !== null);

  return json({
    collection,
    collectionHandle,
    fallbackMeta,
    relatedCollections,
    appliedFilters,
    collections: flattenConnection(collections),
    seo,
  });
}

export const meta = ({ matches }: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Collection() {
  const { collection, collectionHandle, fallbackMeta, relatedCollections, collections, appliedFilters } =
    useLoaderData<typeof loader>();

  const { ref, inView } = useInView();

  // Collection doesn't exist in Shopify - show coming soon state
  if (!collection) {
    return (
      <>
        {/* Hero Section */}
        <HeroSection
          title={fallbackMeta.heroTitle}
          description={fallbackMeta.heroDescription}
          variant="secondary"
          breadcrumbs={[
            { label: 'Home', to: '/' },
            { label: 'Collections', to: '/collections' },
            { label: fallbackMeta.title },
          ]}
        />

        {/* Coming Soon Empty State */}
        <EmptyState
          title="Coming Soon"
          description={`We're preparing our ${fallbackMeta.title.toLowerCase()} collection. Check back soon or explore our other products below.`}
          icon="coming-soon"
          primaryCTA={{ label: 'Shop All Products', to: '/collections/all' }}
          secondaryCTA={{ label: 'Contact Us', to: '/pages/contact' }}
        />

        {/* Related Collections */}
        {relatedCollections.length > 0 && (
          <CategoryCardsSection
            title="Explore Related Collections"
            description="Browse these related product categories"
            cards={relatedCollections.map((col) => ({
              title: col.title,
              description: col.description,
              handle: col.handle,
              to: `/collections/${col.handle}`,
              keywords: col.keywords.slice(0, 3),
            }))}
            columns={3}
          />
        )}

        {/* Trust Badges */}
        <TrustBadgesSection variant="compact" />

        {/* CTA Section */}
        <CTASection
          title="Need Help Finding Products?"
          description="Our dry eye specialists can help you find the right products for your needs."
          primaryCTA={{ label: 'Contact Support', to: '/pages/contact' }}
          secondaryCTA={{ label: 'Learn About Dry Eye', to: '/pages/about' }}
          background="cream"
        />
      </>
    );
  }

  const productCount = collection.products.nodes.length;

  return (
    <>
      {/* Hero Section - Eyepromise Style */}
      <PageHero
        title={collection.title}
        description={collection.description || fallbackMeta.heroDescription}
        badge={productCount > 0 ? `${productCount}+ Products` : undefined}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Collections', to: '/collections' },
          { label: collection.title },
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
      <Section className="py-12">
        <SortFilter
          filters={collection.products.filters as Filter[]}
          appliedFilters={appliedFilters as AppliedFilter[]}
          collections={collections.map((c) => ({ handle: c.handle, title: c.title }))}
        >
          <Pagination connection={collection.products}>
            {({
              nodes,
              isLoading,
              PreviousLink,
              NextLink,
              nextPageUrl,
              hasNextPage,
              state,
            }) => (
              <>
                {nodes.length > 0 ? (
                  <>
                    <div className="flex items-center justify-center mb-6">
                      <Button as={PreviousLink} variant="secondary" width="full">
                        {isLoading ? 'Loading...' : 'Load previous'}
                      </Button>
                    </div>
                    <ProductsLoadedOnScroll
                      nodes={nodes}
                      inView={inView}
                      nextPageUrl={nextPageUrl}
                      hasNextPage={hasNextPage}
                      state={state}
                    />
                    <div className="flex items-center justify-center mt-6">
                      <Button
                        ref={ref}
                        as={NextLink}
                        variant="secondary"
                        width="full"
                      >
                        {isLoading ? 'Loading...' : 'Load more products'}
                      </Button>
                    </div>
                  </>
                ) : (
                  <EmptyState
                    title="No Products Found"
                    description="This collection doesn't have any products yet. Try removing some filters or check back later."
                    icon="products"
                    primaryCTA={{ label: 'Shop All Products', to: '/collections/all' }}
                  />
                )}
              </>
            )}
          </Pagination>
        </SortFilter>
      </Section>

      {/* Related Collections */}
      {relatedCollections.length > 0 && (
        <CategoryCardsSection
          title="Related Collections"
          description="Explore more dry eye products"
          cards={relatedCollections.map((col) => ({
            title: col.title,
            description: col.description,
            handle: col.handle,
            to: `/collections/${col.handle}`,
            keywords: col.keywords.slice(0, 3),
          }))}
          columns={3}
        />
      )}

      {/* CTA Section */}
      <CTASection
        title="Questions About Our Products?"
        description="Our dry eye specialists are here to help you find the right treatment."
        primaryCTA={{ label: 'Contact Us', to: '/pages/contact' }}
        secondaryCTA={{ label: 'View All Products', to: '/collections/all' }}
        variant="split"
        background="navy"
      />

      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </>
  );
}

function ProductsLoadedOnScroll({
  nodes,
  inView,
  nextPageUrl,
  hasNextPage,
  state,
}: {
  nodes: any;
  inView: boolean;
  nextPageUrl: string;
  hasNextPage: boolean;
  state: any;
}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (inView && hasNextPage) {
      navigate(nextPageUrl, {
        replace: true,
        preventScrollReset: true,
        state,
      });
    }
  }, [inView, navigate, state, nextPageUrl, hasNextPage]);

  return (
    <Grid layout="products" data-test="product-grid">
      {nodes.map((product: any, i: number) => (
        <ProductCard
          key={product.id}
          product={product}
          loading={getImageLoadingPriority(i)}
        />
      ))}
    </Grid>
  );
}

const COLLECTION_QUERY = `#graphql
          query CollectionDetails(
          $handle: String!
          $country: CountryCode
          $language: LanguageCode
          $filters: [ProductFilter!]
          $sortKey: ProductCollectionSortKeys!
          $reverse: Boolean
          $first: Int
          $last: Int
          $startCursor: String
          $endCursor: String
          ) @inContext(country: $country, language: $language) {
            collection(handle: $handle) {
            id
      handle
          title
          description
          seo {
            description
        title
      }
          image {
            id
        url
          width
          height
          altText
      }
          products(
          first: $first,
          last: $last,
          before: $startCursor,
          after: $endCursor,
          filters: $filters,
          sortKey: $sortKey,
          reverse: $reverse
          ) {
            filters {
            id
          label
          type
          values {
            id
            label
          count
          input
          }
        }
          nodes {
            ...ProductCard
          }
          pageInfo {
            hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
          collections(first: 100) {
            edges {
            node {
            title
          handle
        }
      }
    }
  }
          ${PRODUCT_CARD_FRAGMENT}
          ` as const;

function getSortValuesFromParam(sortParam: SortParam | null): {
  sortKey: ProductCollectionSortKeys;
  reverse: boolean;
} {
  switch (sortParam) {
    case 'price-high-low':
      return {
        sortKey: 'PRICE',
        reverse: true,
      };
    case 'price-low-high':
      return {
        sortKey: 'PRICE',
        reverse: false,
      };
    case 'best-selling':
      return {
        sortKey: 'BEST_SELLING',
        reverse: false,
      };
    case 'newest':
      return {
        sortKey: 'CREATED',
        reverse: true,
      };
    case 'featured':
      return {
        sortKey: 'MANUAL',
        reverse: false,
      };
    default:
      return {
        sortKey: 'RELEVANCE',
        reverse: false,
      };
  }
}
