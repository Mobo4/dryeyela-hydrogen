# Shopify API Code Cleanup Summary

**Date:** February 2026

## Overview

Comprehensive cleanup and refactoring of all Shopify API-related code to improve maintainability, security, type safety, and consistency.

## Changes Made

### 1. ✅ Extracted Duplicate GraphQL Queries

**Problem:** `PRODUCTS_SEARCH_QUERY` was duplicated in both `prn.tsx` and `avenova.tsx` files.

**Solution:** Created centralized query file `app/data/queries.ts` with shared queries:
- `PRODUCTS_SEARCH_QUERY` - For brand-specific product searches
- `PRODUCTS_BY_FILTER_QUERY` - Generic product filtering query

**Files Modified:**
- ✅ Created `app/data/queries.ts`
- ✅ Updated `app/routes/($locale).pages.prn.tsx` - Now imports from shared file
- ✅ Updated `app/routes/($locale).pages.avenova.tsx` - Now imports from shared file
- ✅ Updated `app/routes/($locale).brands.$brandHandle.tsx` - Uses `PRODUCTS_BY_FILTER_QUERY`
- ✅ Updated `app/routes/($locale).ingredients.$ingredientHandle.tsx` - Uses `PRODUCTS_BY_FILTER_QUERY`
- ✅ Updated `app/routes/($locale).symptoms.$symptomHandle.tsx` - Uses `PRODUCTS_BY_FILTER_QUERY`

**Benefits:**
- Single source of truth for queries
- Easier maintenance and updates
- Consistent query structure across the app

---

### 2. ✅ Removed Hardcoded API Credentials (Security Fix)

**Problem:** HTML reference files contained hardcoded Shopify Storefront API tokens.

**Solution:** Sanitized HTML files by removing hardcoded tokens and adding security comments.

**Files Modified:**
- ✅ `prn_reference.html` - Removed hardcoded token `314d12ac67dc94414f1a58cf9a7b1d93`
- ✅ `PRNVISION/de3-omega.html` - Removed hardcoded token

**Security Notes:**
- These files appear to be reference/design files, not used in the application
- Tokens have been removed and replaced with environment variable placeholders
- Consider adding these files to `.gitignore` if they're not needed in version control

---

### 3. ✅ Improved Type Safety

**Problem:** Several places used `any` types, reducing type safety.

**Solution:** Replaced `any` types with proper TypeScript types.

**Files Modified:**
- ✅ `app/routes/($locale).api.search.tsx` - Fixed type safety in search results mapping
  - Added proper type guards for Product nodes
  - Used TypeScript `Extract` utility for type narrowing

**Before:**
```typescript
const products = search.edges.map((edge: any) => {
  const product = edge.node;
  // ...
});
```

**After:**
```typescript
const products = search.edges
  .filter((edge) => edge.node.__typename === 'Product')
  .map((edge) => {
    const product = edge.node as Extract<typeof edge.node, { __typename: 'Product' }>;
    // ...
  });
```

---

### 4. ✅ Standardized GraphQL Query Patterns

**Problem:** Inconsistent query patterns - some queries missing i18n context, some not using fragments.

**Solution:** Standardized all queries to:
- Include `@inContext(country: $country, language: $language)` directive
- Use shared fragments from `app/data/fragments.ts`
- Pass i18n variables from `storefront.i18n`

**Files Updated:**
- ✅ `app/routes/($locale).pages.prn.tsx` - Added i18n context
- ✅ `app/routes/($locale).pages.avenova.tsx` - Added i18n context
- ✅ `app/routes/($locale).brands.$brandHandle.tsx` - Added i18n context and error handling
- ✅ `app/routes/($locale).ingredients.$ingredientHandle.tsx` - Added i18n context and error handling
- ✅ `app/routes/($locale).symptoms.$symptomHandle.tsx` - Added i18n context and error handling

**Benefits:**
- Consistent internationalization support
- Better error handling across all routes
- Easier to maintain and debug

---

### 5. ✅ Improved Error Handling

**Problem:** Some API routes lacked proper error handling.

**Solution:** Added comprehensive error handling with try-catch blocks and graceful fallbacks.

**Files Updated:**
- ✅ `app/routes/($locale).pages.prn.tsx` - Improved error handling
- ✅ `app/routes/($locale).pages.avenova.tsx` - Improved error handling
- ✅ `app/routes/($locale).brands.$brandHandle.tsx` - Added try-catch with fallback
- ✅ `app/routes/($locale).ingredients.$ingredientHandle.tsx` - Added try-catch with fallback
- ✅ `app/routes/($locale).symptoms.$symptomHandle.tsx` - Added try-catch with fallback

**Pattern Applied:**
```typescript
try {
  const { products } = await storefront.query(QUERY, {
    variables: { /* ... */ },
  });
  return json({ products, error: null });
} catch (error) {
  console.error('Error loading products:', error);
  return json({
    products: { nodes: [] },
    error: error instanceof Error ? error.message : 'Unknown error',
  });
}
```

---

### 6. ✅ Consolidated Similar Queries

**Problem:** Three very similar queries (`BRAND_PRODUCTS_QUERY`, `INGREDIENT_PRODUCTS_QUERY`, `SYMPTOM_PRODUCTS_QUERY`) were essentially duplicates.

**Solution:** Replaced all three with the shared `PRODUCTS_BY_FILTER_QUERY` from `app/data/queries.ts`.

**Files Updated:**
- ✅ Removed `BRAND_PRODUCTS_QUERY` from `brands.$brandHandle.tsx`
- ✅ Removed `INGREDIENT_PRODUCTS_QUERY` from `ingredients.$ingredientHandle.tsx`
- ✅ Removed `SYMPTOM_PRODUCTS_QUERY` from `symptoms.$symptomHandle.tsx`

**Benefits:**
- Reduced code duplication
- Easier to maintain
- Consistent behavior across all filter-based queries

---

## Files Created

1. **`app/data/queries.ts`** - Centralized GraphQL queries
   - `PRODUCTS_SEARCH_QUERY` - Brand/product search
   - `PRODUCTS_BY_FILTER_QUERY` - Generic product filtering

## Files Modified

1. `app/routes/($locale).pages.prn.tsx`
2. `app/routes/($locale).pages.avenova.tsx`
3. `app/routes/($locale).brands.$brandHandle.tsx`
4. `app/routes/($locale).ingredients.$ingredientHandle.tsx`
5. `app/routes/($locale).symptoms.$symptomHandle.tsx`
6. `app/routes/($locale).api.search.tsx`
7. `prn_reference.html` (security sanitization)
8. `PRNVISION/de3-omega.html` (security sanitization)

## Files That Are Already Clean

These files already follow best practices and didn't need changes:

- ✅ `app/routes/($locale).api.products.tsx` - Already has proper i18n, error handling, and fragments
- ✅ `app/routes/($locale).api.countries.tsx` - Simple static data route, no changes needed
- ✅ `server.ts` - Proper Storefront client setup
- ✅ `app/data/fragments.ts` - Well-structured fragments
- ✅ `app/graphql/customer-account/*` - Customer account queries are properly structured

## Recommendations

### 1. Consider Removing Reference HTML Files

The files `prn_reference.html` and `PRNVISION/de3-omega.html` appear to be design reference files and are not used in the application. Consider:

- Moving them to a `docs/reference/` folder
- Adding them to `.gitignore` if they're not needed in version control
- Or keeping them but ensuring they're clearly marked as reference-only

### 2. Add Query Validation

Consider adding runtime validation for GraphQL query variables to catch errors early.

### 3. Consider Query Caching Strategy

Some queries might benefit from caching strategies. The `api.products.tsx` route already uses `storefront.CacheLong()`, which is good.

### 4. Monitor API Usage

Keep an eye on Shopify API rate limits, especially for frequently-called routes like search.

## Testing Checklist

After these changes, verify:

- [ ] Brand pages load correctly (`/brands/[brand]`)
- [ ] Ingredient pages load correctly (`/ingredients/[ingredient]`)
- [ ] Symptom pages load correctly (`/symptoms/[symptom]`)
- [ ] PRN brand page loads (`/pages/prn`)
- [ ] Avenova brand page loads (`/pages/avenova`)
- [ ] Search autocomplete works (`/api/search`)
- [ ] Products API route works (`/api/products`)
- [ ] All pages handle errors gracefully (test with invalid handles)

## Summary

✅ **7 major improvements completed:**
1. Extracted duplicate queries to shared file
2. Removed hardcoded credentials (security)
3. Fixed type safety issues
4. Standardized GraphQL query patterns
5. Improved error handling
6. Consolidated similar queries
7. Added i18n context to all queries

The codebase is now more maintainable, secure, type-safe, and consistent. All Shopify API interactions follow best practices.
