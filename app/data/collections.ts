/**
 * DryEyeLA Collection Metadata
 * Provides fallback data for collections that may not exist in Shopify yet
 * Also provides enhanced SEO metadata for existing collections
 */

import {SHOP_CATEGORIES, BRANDS, SYMPTOMS, INGREDIENTS} from './navigation';

export interface CollectionMeta {
  handle: string;
  title: string;
  description: string;
  heroTitle?: string;
  heroDescription?: string;
  keywords: string[];
  image?: string;
  relatedCollections?: string[];
}

// Build collection metadata from navigation data
const categoryCollections: CollectionMeta[] = SHOP_CATEGORIES.map((cat) => ({
  handle: cat.handle,
  title: cat.title,
  description: cat.description,
  heroTitle: `Shop ${cat.title}`,
  heroDescription: `Doctor-recommended ${cat.title.toLowerCase()} for dry eye relief. Free shipping on orders over $89.`,
  keywords: cat.keywords,
  relatedCollections: SHOP_CATEGORIES.filter((c) => c.handle !== cat.handle)
    .slice(0, 3)
    .map((c) => c.handle),
}));

const brandCollections: CollectionMeta[] = BRANDS.map((brand) => ({
  handle: brand.handle,
  title: brand.name,
  description: brand.description,
  heroTitle: `${brand.name} Products`,
  heroDescription: `Shop ${brand.name} dry eye products. Doctor recommended, clinically proven treatments.`,
  keywords: [brand.name.toLowerCase(), 'dry eye', 'eye care', 'doctor recommended'],
  relatedCollections: BRANDS.filter((b) => b.handle !== brand.handle)
    .slice(0, 3)
    .map((b) => b.handle),
}));

const symptomCollections: CollectionMeta[] = SYMPTOMS.map((symptom) => ({
  handle: symptom.handle,
  title: symptom.title,
  description: symptom.description,
  heroTitle: `Relief for ${symptom.title}`,
  heroDescription: symptom.heroText || symptom.description,
  keywords: symptom.keywords,
  relatedCollections: symptom.recommendedCategories,
}));

const ingredientCollections: CollectionMeta[] = INGREDIENTS.map((ingredient) => ({
  handle: ingredient.handle,
  title: ingredient.title,
  description: ingredient.description,
  heroTitle: `${ingredient.title} Products`,
  heroDescription: `Shop products containing ${ingredient.title.toLowerCase()} for targeted dry eye treatment.`,
  keywords: ingredient.keywords,
}));

// Special collections
const specialCollections: CollectionMeta[] = [
  {
    handle: 'best-sellers',
    title: 'Best Sellers',
    description: 'Our most popular dry eye products, trusted by thousands of patients.',
    heroTitle: 'Best-Selling Dry Eye Products',
    heroDescription: 'Discover our top-rated dry eye treatments, chosen by patients and recommended by doctors.',
    keywords: ['best sellers', 'popular', 'top rated', 'dry eye', 'most purchased'],
    relatedCollections: ['new-arrivals', 'eye-drops-lubricants', 'vitamins-supplements'],
  },
  {
    handle: 'new-arrivals',
    title: 'New Arrivals',
    description: 'Latest dry eye products and treatments, just added to our store.',
    heroTitle: 'New Dry Eye Products',
    heroDescription: 'Be the first to try the latest innovations in dry eye treatment.',
    keywords: ['new arrivals', 'new products', 'latest', 'dry eye', 'just added'],
    relatedCollections: ['best-sellers', 'eye-drops-lubricants'],
  },
  {
    handle: 'sale',
    title: 'Sale',
    description: 'Save on dry eye products with our special offers and discounts.',
    heroTitle: 'Dry Eye Products on Sale',
    heroDescription: 'Get the relief you need at prices you\'ll love. Limited time offers on top products.',
    keywords: ['sale', 'discount', 'savings', 'dry eye', 'special offers'],
    relatedCollections: ['best-sellers', 'eye-drops-lubricants'],
  },
  {
    handle: 'bundles',
    title: 'Value Bundles',
    description: 'Save more with our curated dry eye treatment bundles.',
    heroTitle: 'Dry Eye Treatment Bundles',
    heroDescription: 'Complete your dry eye care routine with our value-packed bundles. Save up to 20%.',
    keywords: ['bundles', 'kits', 'value', 'savings', 'dry eye treatment'],
    relatedCollections: ['best-sellers', 'vitamins-supplements', 'eye-masks'],
  },
  {
    handle: 'all',
    title: 'All Products',
    description: 'Browse our complete selection of dry eye products and treatments.',
    heroTitle: 'All Dry Eye Products',
    heroDescription: 'Explore our full range of doctor-recommended dry eye treatments.',
    keywords: ['all products', 'dry eye', 'eye care', 'complete selection'],
  },
];

// Combine all collections
export const COLLECTION_METADATA: CollectionMeta[] = [
  ...categoryCollections,
  ...brandCollections,
  ...symptomCollections,
  ...ingredientCollections,
  ...specialCollections,
];

// Helper function to get collection metadata by handle
export function getCollectionMeta(handle: string): CollectionMeta | undefined {
  return COLLECTION_METADATA.find((c) => c.handle === handle);
}

// Helper function to get fallback collection data for missing collections
export function getFallbackCollection(handle: string): {
  title: string;
  description: string;
  heroTitle: string;
  heroDescription: string;
  keywords: string[];
  exists: boolean;
} {
  const meta = getCollectionMeta(handle);

  if (meta) {
    return {
      title: meta.title,
      description: meta.description,
      heroTitle: meta.heroTitle || meta.title,
      heroDescription: meta.heroDescription || meta.description,
      keywords: meta.keywords,
      exists: false, // Collection doesn't exist in Shopify yet
    };
  }

  // Generate fallback for unknown collections
  const formattedTitle = handle
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: formattedTitle,
    description: `Shop ${formattedTitle} dry eye products. Doctor recommended treatments for dry eye relief.`,
    heroTitle: `Shop ${formattedTitle}`,
    heroDescription: `Browse our selection of ${formattedTitle.toLowerCase()} products for dry eye treatment.`,
    keywords: [formattedTitle.toLowerCase(), 'dry eye', 'eye care'],
    exists: false,
  };
}

// Get related collections for cross-selling
export function getRelatedCollections(handle: string, limit: number = 3): CollectionMeta[] {
  const meta = getCollectionMeta(handle);

  if (meta?.relatedCollections) {
    return meta.relatedCollections
      .map((h) => getCollectionMeta(h))
      .filter((c): c is CollectionMeta => c !== undefined)
      .slice(0, limit);
  }

  // Return popular collections as fallback
  return COLLECTION_METADATA
    .filter((c) => c.handle !== handle && ['best-sellers', 'eye-drops-lubricants', 'vitamins-supplements'].includes(c.handle))
    .slice(0, limit);
}
