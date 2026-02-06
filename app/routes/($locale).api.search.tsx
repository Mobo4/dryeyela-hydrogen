import { type LoaderFunctionArgs, json } from '@shopify/remix-oxygen';

/**
 * Search API Route
 * 
 * Provides autocomplete search results for the SearchAutocomplete component.
 * Uses Shopify Storefront API for semantic product search.
 */
export async function loader({ request, context }: LoaderFunctionArgs) {
  const { storefront } = context;
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || '';
  const limit = parseInt(url.searchParams.get('limit') || '5', 10);

  if (!query || query.length < 2) {
    return json({ products: [] });
  }

  try {
    const { search } = await storefront.query(SEARCH_QUERY, {
      variables: {
        query,
        first: limit,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
    });

    const products = search.edges.map((edge) => {
        const product = edge.node;
        return {
          id: product.id,
          title: product.title,
          handle: product.handle,
          image: product.images?.nodes?.[0] || null,
          priceRange: product.priceRange,
        };
      });

    return json({ products });
  } catch (error) {
    console.error('Search API error:', error);
    return json({ products: [], error: 'Search failed' }, { status: 500 });
  }
}

const SEARCH_QUERY = `#graphql
  query SearchProducts(
    $query: String!
    $first: Int!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    search(query: $query, types: PRODUCT, first: $first) {
      edges {
        node {
          ... on Product {
            id
            title
            handle
            images(first: 1) {
              nodes {
                url
                altText
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
` as const;
