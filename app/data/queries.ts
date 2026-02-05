/**
 * Shared GraphQL Queries for Shopify Storefront API
 * 
 * Centralized location for all GraphQL queries to avoid duplication
 * and ensure consistency across the application.
 */

import { PRODUCT_CARD_FRAGMENT } from './fragments';

/**
 * Search products by query string (vendor, title, tags, etc.)
 * Used for brand pages, ingredient pages, symptom pages, and brand-specific searches
 */
export const PRODUCTS_SEARCH_QUERY = `#graphql
  query ProductsSearch(
    $query: String!
    $count: Int!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: $count, query: $query) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

/**
 * Generic product search query for filtering by vendor, tags, or keywords
 * Used by brand, ingredient, and symptom pages
 */
export const PRODUCTS_BY_FILTER_QUERY = `#graphql
  query ProductsByFilter(
    $first: Int!
    $query: String
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: $first, query: $query) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;
