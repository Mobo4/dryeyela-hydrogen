import { PRN_PRODUCTS } from './prn-products';
import type { CurrencyCode } from '@shopify/hydrogen/storefront-api-types';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ProductVariantNode {
    id: string;
    title: string;
    availableForSale: boolean;
    price: { amount: string; currencyCode: CurrencyCode };
    compareAtPrice: { amount: string; currencyCode: CurrencyCode } | null;
    image: { url: string; altText: string; width: number; height: number };
    selectedOptions: { name: string; value: string }[];
    product: { handle: string; title: string };
}

interface ProductImageNode {
    url: string;
    altText: string;
    width: number;
    height: number;
}

interface ProductMediaNode {
    __typename: 'MediaImage';
    id: string;
    alt: string;
    mediaContentType: 'IMAGE';
    image: { id: string; url: string; width: number; height: number };
    previewImage?: { url: string };
}

interface CollectionProduct {
    id: string;
    title: string;
    handle: string;
    vendor: string;
    description: string;
    publishedAt: string;
    variants: { nodes: ProductVariantNode[] };
    images: { nodes: ProductImageNode[] };
    media: { nodes: ProductMediaNode[] };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Transform PRN product data to Shopify-like collection product format
 */
function mapPrnToCollectionProduct(key: keyof typeof PRN_PRODUCTS): CollectionProduct {
    const p = PRN_PRODUCTS[key];
    const firstVariant = p.variants[0];
    const currencyCode = p.currency as CurrencyCode;
    return {
        id: p.id,
        title: p.title,
        handle: p.id,
        vendor: 'PRN Vision',
        description: p.subtitle,
        publishedAt: new Date().toISOString(),
        variants: {
            nodes: p.variants.map(v => ({
                id: v.sku,
                title: v.title,
                availableForSale: true,
                price: { amount: v.price.toString(), currencyCode },
                compareAtPrice: v.savings ? {
                    amount: (v.price + v.savings).toString(),
                    currencyCode
                } : null,
                image: { url: v.image, altText: p.title, width: 800, height: 800 },
                selectedOptions: [{ name: 'Size', value: v.title }],
                product: { handle: p.id, title: p.title }
            }))
        },
        images: {
            nodes: [{ url: firstVariant.image, altText: p.title, width: 1000, height: 1000 }]
        },
        media: {
            nodes: [
                {
                    __typename: 'MediaImage',
                    id: `gid://shopify/MediaImage/${p.id}`,
                    alt: p.title,
                    mediaContentType: 'IMAGE',
                    image: { id: `gid://shopify/Image/${p.id}`, url: firstVariant.image, width: 1000, height: 1000 },
                    previewImage: { url: firstVariant.image }
                }
            ]
        }
    };
}

// Category color schemes for placeholder images
const CATEGORY_COLORS = {
    eyeDrops: { bg: 'eff6ff', fg: '1e40af' },      // Blue tones
    cleansers: { bg: 'f0fdf4', fg: '166534' },     // Green tones
    sprays: { bg: 'fdf4ff', fg: '86198f' },        // Purple tones
    masks: { bg: 'fff7ed', fg: '9a3412' },         // Orange tones
    vitamins: { bg: 'fefce8', fg: '854d0e' },      // Yellow tones
    contactLens: { bg: 'e0f2fe', fg: '0369a1' }    // Cyan tones
} as const;

/**
 * Generate a styled placeholder image URL (fallback only)
 */
function generatePlaceholderImage(productName: string, category: keyof typeof CATEGORY_COLORS): string {
    const colors = CATEGORY_COLORS[category];
    const urlSafeName = productName.replace(/\s+/g, '+');
    return `https://placehold.co/600x600/${colors.bg}/${colors.fg}?text=${urlSafeName}`;
}

/**
 * Create a production-ready product object for local collections
 * @param imageUrl - Real product image URL from CDN (optional, uses placeholder if not provided)
 */
function createProduct(
    handle: string,
    title: string,
    vendor: string,
    price: string,
    description: string,
    category: keyof typeof CATEGORY_COLORS,
    compareAtPrice?: string,
    imageUrl?: string
): CollectionProduct {
    const finalImageUrl = imageUrl || generatePlaceholderImage(title, category);
    const publishedAt = new Date().toISOString();
    const currencyCode: CurrencyCode = 'USD';

    return {
        id: `gid://shopify/Product/${handle}`,
        title,
        handle,
        vendor,
        description,
        publishedAt,
        variants: {
            nodes: [{
                id: `gid://shopify/ProductVariant/${handle}`,
                title: 'Default Title',
                availableForSale: true,
                price: { amount: price, currencyCode },
                compareAtPrice: compareAtPrice
                    ? { amount: compareAtPrice, currencyCode }
                    : null,
                image: { url: finalImageUrl, altText: title, width: 800, height: 800 },
                selectedOptions: [{ name: 'Title', value: 'Default Title' }],
                product: { handle, title }
            }]
        },
        images: {
            nodes: [{ url: finalImageUrl, altText: title, width: 800, height: 800 }]
        },
        media: {
            nodes: [
                {
                    __typename: 'MediaImage',
                    id: `gid://shopify/MediaImage/${handle}`,
                    alt: title,
                    mediaContentType: 'IMAGE',
                    image: { id: `gid://shopify/Image/${handle}`, url: finalImageUrl, width: 800, height: 800 },
                    previewImage: { url: finalImageUrl }
                }
            ]
        }
    };
}

// ============================================================================
// PRODUCT DATA BY CATEGORY
// ============================================================================

/**
 * Eye Drops & Lubricants - 8 products
 * Preservative-free and lubricating drops for dry eye relief
 */
const EYE_DROPS_PRODUCTS: CollectionProduct[] = [
    createProduct(
        'oasis-tears-plus',
        'Oasis Tears Plus',
        'Oasis',
        '29.95',
        'Preservative-free glycerin drops with hyaluronic acid for long-lasting moisture and comfort.',
        'eyeDrops',
        undefined,
        '/products/oasis-tears-plus-pf-eye-drops.png'
    ),
    createProduct(
        'oasis-tears-pf-30ct',
        'Oasis Tears PF 30ct',
        'Oasis',
        '24.95',
        'Single-use preservative-free vials perfect for sensitive eyes and contact lens wearers.',
        'eyeDrops',
        undefined,
        '/products/oasis-tears-pf-eye-drops-vials.png'
    ),
    createProduct(
        'optase-intense-drops',
        'Optase Intense Drops',
        'Optase',
        '24.95',
        '0.2% Hyaluronic acid formula providing intense hydration for moderate to severe dry eye.',
        'eyeDrops',
        undefined,
        '/products/optase-dry-eye-intense-preservative-free-multidose-bottle.png'
    ),
    createProduct(
        'retaine-mgd',
        'Retaine MGD',
        'Retaine',
        '26.50',
        'Lipid-enhanced formula that replenishes all 3 layers of the tear film for MGD relief.',
        'eyeDrops',
        undefined,
        '/products/retaine-mgd-eye-drops.png'
    ),
    createProduct(
        'systane-complete-pf',
        'Systane Complete PF',
        'Systane',
        '22.99',
        'Nano-droplet technology provides fast-acting relief for all types of dry eye.',
        'eyeDrops',
        undefined,
        '/products/systane-complete-preservative-free-eye-drops-multi-dose-bottle-10ml.png'
    ),
    createProduct(
        'systane-ultra-pf',
        'Systane Ultra PF',
        'Systane',
        '18.99',
        'Preservative-free extended protection formula ideal for sensitive eyes.',
        'eyeDrops',
        undefined,
        '/products/alcon-systane-hydration-preservative-free-lubricant-eye-drops-30ct-vials-30-count-1.png'
    ),
    createProduct(
        'refresh-optive-pf',
        'Refresh Optive PF',
        'Refresh',
        '19.99',
        'Preservative-free single-use vials with dual-action formula for lasting comfort.',
        'eyeDrops',
        undefined,
        '/products/refresh-optive-advanced-lubricant-eye-drops-30-vials.png'
    ),
    createProduct(
        'refresh-tears',
        'Refresh Tears',
        'Refresh',
        '12.99',
        'Original lubricant eye drop formula providing immediate relief for mild dry eye.',
        'eyeDrops',
        undefined,
        '/products/refresh-relieva-pf-10-ml.png'
    )
];

/**
 * Eyelid Cleansers - 6 products
 * Lid scrubs, wipes, and foaming cleansers for blepharitis and MGD
 */
const EYELID_CLEANSERS_PRODUCTS: CollectionProduct[] = [
    createProduct(
        'optase-tto-lid-wipes',
        'Optase TTO Lid Wipes',
        'Optase',
        '21.95',
        'Tea tree oil-infused preservative-free wipes for daily eyelid hygiene and Demodex control.',
        'cleansers',
        undefined,
        '/products/optase-lid-wipes.png'
    ),
    createProduct(
        'ocusoft-lid-scrub-plus-foam',
        'OCuSOFT Lid Scrub Plus Foam',
        'OCuSOFT',
        '24.50',
        'Extra strength foaming cleanser with added moisturizers for moderate to severe conditions.',
        'cleansers',
        undefined,
        '/products/ocusoft-lid-scrub-plus-foam-50ml.png'
    ),
    createProduct(
        'ocusoft-lid-scrub-plus-pads',
        'OCuSOFT Lid Scrub Plus Pads',
        'OCuSOFT',
        '19.95',
        'Pre-moistened pads (30ct) for convenient on-the-go eyelid cleansing.',
        'cleansers',
        undefined,
        '/products/ocusoft-lid-scrub-plus-pre-moistened-pads-30-ctn.png'
    ),
    createProduct(
        'ocusoft-lid-scrub-original',
        'OCuSOFT Lid Scrub Original',
        'OCuSOFT',
        '16.95',
        'Mild foaming cleanser for daily maintenance of eyelid hygiene.',
        'cleansers',
        undefined,
        '/products/ocusoft-lid-scrub-original-foaming-eyelid-cleanser-7-2-fl-oz.png'
    ),
    createProduct(
        'cliradex-towelettes',
        'Cliradex Towelettes',
        'Cliradex',
        '44.00',
        '4-Terpineol natural cleanser derived from tea tree oil for effective Demodex treatment.',
        'cleansers',
        undefined,
        '/products/cliradex-24-pack.png'
    ),
    createProduct(
        'cliradex-light-foam',
        'Cliradex Light Foam',
        'Cliradex',
        '32.00',
        'Gentle daily foaming cleanser with natural 4-Terpineol for sensitive eyelids.',
        'cleansers',
        undefined,
        '/products/cliradex-foam.png'
    )
];

/**
 * Eyelid Sprays - 5 products
 * Hypochlorous acid and antimicrobial sprays for lid and lash care
 */
const EYELID_SPRAYS_PRODUCTS: CollectionProduct[] = [
    createProduct(
        'avenova-spray-20ml',
        'Avenova Spray 20ml',
        'Avenova',
        '29.99',
        'Pure 0.01% hypochlorous acid spray for daily eyelid and lash hygiene.',
        'sprays',
        undefined,
        '/products/avenova--hypochlorous-spray-solution-with-nova-wipes.png'
    ),
    createProduct(
        'avenova-spray-40ml',
        'Avenova Spray 40ml',
        'Avenova',
        '49.99',
        'Pure hypochlorous acid spray in a larger size for extended daily use.',
        'sprays',
        undefined,
        '/products/avenova--hypochlorous-spray-solution-20ml-or-40ml-bottles-2-pack-with-novawipes-professional-strength.png'
    ),
    createProduct(
        'heyedrate-lid-lash',
        'Heyedrate Lid & Lash',
        'Heyedrate',
        '24.95',
        'Organic hypochlorous acid spray for natural lid and lash cleansing.',
        'sprays',
        undefined,
        '/products/heyedrate--lid-lash-cleanser-1-month-supply.png'
    ),
    createProduct(
        'optase-protect-spray',
        'Optase Protect Spray',
        'Optase',
        '22.95',
        'Antibacterial HOCl spray for maintaining healthy eyelid margins.',
        'sprays',
        undefined,
        '/products/optase-protect-eyelid-hypochlorous-cleansing-spray.png'
    ),
    createProduct(
        'ocusoft-hypochlor-spray',
        'OCuSOFT HypoChlor Spray',
        'OCuSOFT',
        '19.95',
        '0.02% HOCl formula for antimicrobial eyelid care and hygiene.',
        'sprays',
        undefined,
        '/products/ocusoft-hypochlor-spray.png'
    )
];

/**
 * Eye Masks - 5 products
 * Warm compresses and heat masks for meibomian gland expression
 */
const EYE_MASKS_PRODUCTS: CollectionProduct[] = [
    createProduct(
        'bruder-moist-heat-mask',
        'Bruder Moist Heat Mask',
        'Bruder',
        '26.95',
        'MediBeads microwave-activated mask providing consistent moist heat for MGD treatment.',
        'masks',
        undefined,
        '/products/bruder-mask.png'
    ),
    createProduct(
        'bruder-single-eye-mask',
        'Bruder Single Eye Mask',
        'Bruder',
        '19.95',
        'Single eye targeted treatment mask for localized chalazion and stye relief.',
        'masks',
        undefined,
        '/products/bruder-moist-heat-eye-compress-single.png'
    ),
    createProduct(
        'optase-moist-heat-mask',
        'Optase Moist Heat Mask',
        'Optase',
        '24.95',
        'Dual-sided microwave mask with removable cover for customizable heat therapy.',
        'masks',
        undefined,
        '/products/optase-moist-heat-mask.png'
    ),
    createProduct(
        'eye-eco-tranquileyes',
        'Eye Eco Tranquileyes',
        'Eye Eco',
        '45.00',
        'Sleep mask with moisture retention technology for overnight dry eye protection.',
        'masks',
        undefined,
        '/products/tranquileyes-xl-advanced--510-treatments-for-severe-dry-eye-relief.png'
    ),
    createProduct(
        'therapearl-eye-mask',
        'TheraPearl Eye Mask',
        'TheraPearl',
        '14.95',
        'Hot or cold dual-temperature therapy mask for versatile eye comfort.',
        'masks',
        undefined,
        '/products/i-relief--hot-cold-therapy-eye-mask-with-thermabeads-.png'
    )
];

/**
 * Vitamins & Supplements - 6 products
 * Omega-3s and nutritional supplements for ocular health
 */
const VITAMINS_PRODUCTS: CollectionProduct[] = [
    // PRN Products (mapped from prn-products.ts)
    mapPrnToCollectionProduct('de3_omega'),
    mapPrnToCollectionProduct('kids_omega'),
    // Additional vitamin/supplement products
    createProduct(
        'macuhealth-plus',
        'MacuHealth Plus+',
        'MacuHealth',
        '74.95',
        'Triple carotenoid formula with Lutein, Meso-Zeaxanthin, and Zeaxanthin for macular support.',
        'vitamins',
        undefined,
        '/products/macuhealth-plus-eye-vitamins-supplement-for-adults-easy-swallow-softgel-formula-with-meso-zeaxanthin-lutein-zeaxanthin-90-days-supply.png'
    ),
    createProduct(
        'macuhealth-lmz3',
        'MacuHealth LMZ3',
        'MacuHealth',
        '59.95',
        'Lutein, Meso-Zeaxanthin, and Zeaxanthin in clinically proven ratios for eye health.',
        'vitamins',
        undefined,
        '/products/macuhealth-triple-carotenoid-formula-for-adults-eye-vitamins-lutein-and-zeaxanthin-meso-zeaxanthin-for-amd-and-dry-eyes-90-softgels-3-month-supply.png'
    ),
    createProduct(
        'eyepromise-ez-tears',
        'EyePromise EZ Tears',
        'EyePromise',
        '29.95',
        '8 key nutrients specifically formulated to support healthy tear production.',
        'vitamins',
        undefined,
        '/products/eyepromise-ez-tears-eye-vitamin-occasional-dry-eye-relief-supplement-omega-3s-and-8-other-soothing-ingredients-30-day-supply-60ct-bottle.png'
    ),
    createProduct(
        'eyepromise-restore',
        'EyePromise Restore',
        'EyePromise',
        '49.95',
        'Complete macular support formula with omega-3s and zeaxanthin for comprehensive eye nutrition.',
        'vitamins',
        undefined,
        '/products/eyepromise-restore-supplement-60-softgel-capsules-containing-lutein-vitamin-c-vitamin-d-vitamin-e-omega-3-fish-oil-and-zeaxanthin-patented-macular-health-formula.png'
    )
];

/**
 * Contact Lens Supplies - 5 products
 * Specialty solutions for scleral and GP lenses
 */
const CONTACT_LENS_PRODUCTS: CollectionProduct[] = [
    createProduct(
        'menicon-lacripure-saline',
        'Menicon LacriPure Saline',
        'Menicon',
        '22.00',
        'Preservative-free saline solution specifically designed for scleral lens filling and rinsing.',
        'contactLens',
        undefined,
        '/products/2-pack-of-menicon-lacripure-serile-saline-solution-98-vials-x-2-scleral-lenses.png'
    ),
    createProduct(
        'tangible-clean',
        'Tangible Clean',
        'Tangible',
        '25.00',
        'Daily cleaner formulated for GP and scleral contact lenses to remove deposits.',
        'contactLens',
        undefined,
        '/products/tangible-clean-scleral-and-contact-lens-multi-purpose-solution.png'
    ),
    createProduct(
        'tangible-boost',
        'Tangible Boost',
        'Tangible',
        '32.00',
        'Hydra-PEG wetting agent that improves lens surface wettability and comfort.',
        'contactLens',
        undefined,
        '/products/tangible-boost.png'
    ),
    createProduct(
        'nutrilens-plus',
        'NutriLens Plus',
        'Contamac',
        '28.00',
        'Scleral lens conditioning solution that enhances lens surface hydration.',
        'contactLens',
        undefined,
        '/products/nutrifill-preservative-free-scleral-hybrid-and-gas-permeable-gp-lens-insertion-solution.png'
    ),
    createProduct(
        'clear-care-plus',
        'Clear Care Plus',
        'Alcon',
        '16.95',
        'Hydrogen peroxide deep cleaning system with HydraGlyde moisture matrix.',
        'contactLens',
        undefined,
        '/products/clear-care-plus-cleaning-solution-with-lens-case-twin-pack-multi-12-oz-pack-of-2.png'
    )
];

// ============================================================================
// EXPORTED COLLECTIONS
// ============================================================================

/**
 * Complete local product collections organized by category handle
 * Each category contains production-ready product data
 */
export const LOCAL_COLLECTIONS: Record<string, CollectionProduct[]> = {
    // Category 1: Eye Drops & Lubricants (8 products)
    'eye-drops-lubricants': EYE_DROPS_PRODUCTS,

    // Category 2: Eyelid Cleansers (6 products)
    'eyelid-cleansers': EYELID_CLEANSERS_PRODUCTS,

    // Category 3: Eyelid Sprays (5 products)
    'eyelid-sprays': EYELID_SPRAYS_PRODUCTS,

    // Category 4: Eye Masks (5 products)
    'eye-masks': EYE_MASKS_PRODUCTS,

    // Category 5: Vitamins & Supplements (6 products)
    'vitamins-supplements': VITAMINS_PRODUCTS,

    // Category 6: Contact Lens Supplies (5 products)
    'contact-lens-supplies': CONTACT_LENS_PRODUCTS
};

/**
 * Get all products across all categories
 */
export function getAllLocalProducts(): CollectionProduct[] {
    return Object.values(LOCAL_COLLECTIONS).flat();
}

/**
 * Get products by category handle
 */
export function getLocalCollectionProducts(handle: string): CollectionProduct[] | undefined {
    return LOCAL_COLLECTIONS[handle];
}

/**
 * Find a specific product by handle across all categories
 */
export function findLocalProductByHandle(handle: string): CollectionProduct | undefined {
    for (const products of Object.values(LOCAL_COLLECTIONS)) {
        const found = products.find(p => p.handle === handle);
        if (found) return found;
    }
    return undefined;
}

/**
 * Get product count by category
 */
export function getLocalCollectionCounts(): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const [category, products] of Object.entries(LOCAL_COLLECTIONS)) {
        counts[category] = products.length;
    }
    return counts;
}

// ============================================================================
// INGREDIENT-TO-PRODUCT MAPPINGS
// ============================================================================

/**
 * Maps ingredient handles to arrays of product handles that contain those ingredients.
 * Used by the ingredient pages to display relevant products.
 *
 * Ingredient Mappings:
 * - omega-3: PRN DE3, PRN Kids Omega, EyePromise products, MacuHealth
 * - hypochlorous-acid: Avenova, Heyedrate, Optase Protect, OCuSOFT HypoChlor
 * - tea-tree: Optase TTO products, Cliradex products
 * - hyaluronic-acid: Optase Intense, I-Drop, most eye drops
 * - manuka-honey: Currently no products in catalog
 */
export const INGREDIENT_PRODUCT_MAPPINGS: Record<string, string[]> = {
    // Omega-3: PRN DE3, PRN Kids Omega, EyePromise products, MacuHealth
    'omega-3': [
        'de3-omega',           // PRN De3 Omega Benefits
        'kids-omega',          // PRN Kids Omega
        'eyepromise-ez-tears', // EyePromise EZ Tears
        'eyepromise-restore',  // EyePromise Restore
        'macuhealth-plus',     // MacuHealth Plus+
        'macuhealth-lmz3'      // MacuHealth LMZ3
    ],

    // Hypochlorous Acid: Avenova, Heyedrate, Optase Protect, OCuSOFT HypoChlor
    'hypochlorous-acid': [
        'avenova-spray-20ml',    // Avenova Spray 20ml
        'avenova-spray-40ml',    // Avenova Spray 40ml
        'heyedrate-lid-lash',    // Heyedrate Lid & Lash
        'optase-protect-spray',  // Optase Protect Spray
        'ocusoft-hypochlor-spray' // OCuSOFT HypoChlor Spray
    ],

    // Tea Tree Oil: Optase TTO products, Cliradex products
    'tea-tree': [
        'optase-tto-lid-wipes',  // Optase TTO Lid Wipes
        'cliradex-towelettes',   // Cliradex Towelettes
        'cliradex-light-foam'    // Cliradex Light Foam
    ],

    // Hyaluronic Acid: Optase Intense, most eye drops
    'hyaluronic-acid': [
        'optase-intense-drops',  // Optase Intense Drops (0.2% HA)
        'oasis-tears-plus',      // Oasis Tears Plus
        'oasis-tears-pf-30ct',   // Oasis Tears PF
        'systane-complete-pf',   // Systane Complete PF
        'systane-ultra-pf',      // Systane Ultra PF
        'refresh-optive-pf'      // Refresh Optive PF
    ],

    // Manuka Honey: Currently no products with manuka honey in catalog
    'manuka-honey': []
};

/**
 * Get products for a specific ingredient
 * Returns products from LOCAL_COLLECTIONS that match the ingredient mapping
 */
export function getProductsForIngredient(ingredientHandle: string): CollectionProduct[] {
    const productHandles = INGREDIENT_PRODUCT_MAPPINGS[ingredientHandle] || [];
    const products: CollectionProduct[] = [];

    // Search through all collections to find matching product handles
    for (const collectionProducts of Object.values(LOCAL_COLLECTIONS)) {
        for (const product of collectionProducts) {
            if (productHandles.includes(product.handle)) {
                products.push(product);
            }
        }
    }

    return products;
}
