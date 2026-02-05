import {
  json,
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';
import {
  Image,
  Pagination,
  getPaginationVariables,
  getSeoMeta,
} from '@shopify/hydrogen';

import {Grid} from '~/components/Grid';
import {Heading, Section} from '~/components/Text';
import {Link} from '~/components/Link';
import {Button} from '~/components/Button';
import {getImageLoadingPriority} from '~/lib/const';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import {
  HeroSection,
  TrustBadgesSection,
  CTASection,
  CategoryCardsSection,
  PageHero,
  TrustBadges,
} from '~/components/sections';
import {SHOP_CATEGORIES, SYMPTOMS} from '~/data/navigation';

const PAGINATION_SIZE = 12;

export const headers = routeHeaders;

export const loader = async ({
  request,
  context: {storefront},
}: LoaderFunctionArgs) => {
  const variables = getPaginationVariables(request, {pageBy: PAGINATION_SIZE});
  const {collections} = await storefront.query(COLLECTIONS_QUERY, {
    variables: {
      ...variables,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  const seo = seoPayload.listCollections({
    collections,
    url: request.url,
  });

  return json({collections, seo});
};

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();

  // Category cards for quick navigation
  const categoryCards = SHOP_CATEGORIES.map((cat) => ({
    title: cat.title,
    description: cat.description,
    handle: cat.handle,
    to: `/collections/${cat.handle}`,
    keywords: cat.keywords.slice(0, 3),
  }));

  // Symptom cards for symptom-based shopping
  const symptomCards = SYMPTOMS.slice(0, 3).map((symptom) => ({
    title: symptom.title,
    description: symptom.description,
    handle: symptom.handle,
    to: `/collections/${symptom.handle}`,
    keywords: symptom.keywords.slice(0, 2),
  }));

  return (
    <>
      {/* Hero Section - Eyepromise Style */}
      <PageHero
        title="Shop All Collections"
        description="Browse our complete selection of doctor-recommended dry eye products. From eye drops to supplements, we have everything you need for lasting relief."
        breadcrumbs={[
          {label: 'Home', to: '/'},
          {label: 'Collections'},
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

      {/* Shop by Category */}
      <CategoryCardsSection
        title="Shop by Category"
        description="Find exactly what you need for your dry eye treatment"
        cards={categoryCards}
        columns={3}
      />

      {/* Shop by Symptom */}
      <CategoryCardsSection
        title="Shop by Symptom"
        description="Not sure what you need? Start with your symptoms"
        cards={symptomCards}
        columns={3}
        className="bg-besilos-cream/50"
      />

      {/* All Collections from Shopify */}
      <Section className="py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="text-center mb-12">
            <Heading as="h2" size="heading" className="text-besilos-navy mb-4">
              All Product Collections
            </Heading>
          </div>

          <Pagination connection={collections}>
            {({nodes, isLoading, PreviousLink, NextLink}) => (
              <>
                {nodes.length > 0 && (
                  <div className="flex items-center justify-center mb-6">
                    <Button as={PreviousLink} variant="secondary" width="full">
                      {isLoading ? 'Loading...' : 'Previous collections'}
                    </Button>
                  </div>
                )}
                <Grid
                  items={nodes.length === 3 ? 3 : 2}
                  data-test="collection-grid"
                >
                  {nodes.map((collection, i) => (
                    <CollectionCard
                      collection={collection as Collection}
                      key={collection.id}
                      loading={getImageLoadingPriority(i, 2)}
                    />
                  ))}
                </Grid>
                {nodes.length > 0 && (
                  <div className="flex items-center justify-center mt-6">
                    <Button as={NextLink} variant="secondary" width="full">
                      {isLoading ? 'Loading...' : 'Next collections'}
                    </Button>
                  </div>
                )}
              </>
            )}
          </Pagination>
        </div>
      </Section>

      {/* CTA Section */}
      <CTASection
        title="Need Help Finding Products?"
        description="Our dry eye specialists can help you find the right treatment for your specific symptoms."
        primaryCTA={{label: 'Contact Us', to: '/pages/contact'}}
        secondaryCTA={{label: 'Learn About Dry Eye', to: '/pages/about'}}
        variant="centered"
        background="navy"
      />
    </>
  );
}

function CollectionCard({
  collection,
  loading,
}: {
  collection: Collection;
  loading?: HTMLImageElement['loading'];
}) {
  return (
    <Link
      prefetch="viewport"
      to={`/collections/${collection.handle}`}
      className="group block bg-white rounded-2xl border border-besilos-sage/10 hover:border-besilos-sage/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Clean grey background - Professional studio photography standard */}
      <div className="aspect-[3/2] overflow-hidden relative" style={{ backgroundColor: '#F5F5F5' }}>
        {collection?.image ? (
          <Image
            data={collection.image}
            aspectRatio="6/4"
            sizes="(max-width: 32em) 100vw, 45vw"
            loading={loading}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-4 md:p-6 relative z-10 image-render-crisp-edges"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-besilos-sage/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <Heading as="h3" size="lead" className="text-besilos-navy group-hover:text-besilos-sage transition-colors">
            {collection.title}
          </Heading>
          <svg
            className="w-5 h-5 text-besilos-sage opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </div>
        {collection.description && (
          <p className="mt-2 text-sm text-besilos-navy/60 line-clamp-2">
            {collection.description}
          </p>
        )}
      </div>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  query Collections(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        id
        title
        description
        handle
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
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`;
