import { PRN_PRODUCTS } from './prn-products';

// Helper to transform PRN product to Shopify-like product node
function mapPrnToCollectionProduct(key: keyof typeof PRN_PRODUCTS) {
    const p = PRN_PRODUCTS[key];
    const firstVariant = p.variants[0];
    return {
        id: p.id,
        title: p.title,
        handle: p.id, // Using ID as handle for local routing logic
        vendor: 'PRN Vision',
        description: p.subtitle,
        publishedAt: new Date().toISOString(),
        items: {
            nodes: []
        },
        variants: {
            nodes: p.variants.map(v => ({
                id: v.sku,
                title: v.title,
                availableForSale: true,
                price: { amount: v.price.toString(), currencyCode: p.currency },
                compareAtPrice: v.savings ? { 
                    amount: (v.price + (typeof v.savings === 'string' ? parseFloat(v.savings.replace('$', '')) : v.savings)).toString(), 
                    currencyCode: p.currency 
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
                    image: { url: firstVariant.image, altText: p.title, width: 1000, height: 1000 }
                }
            ]
        }
    };
}

// Mock Product Generator
function createMockProduct(id: string, title: string, price: string, image: string, type: string, vendor?: string) {
    // Extract vendor from title if not provided
    const productVendor = vendor || title.split(' ')[0];
    
    return {
        id: `gid://shopify/Product/${id}`,
        title: title,
        handle: id,
        vendor: productVendor,
        description: `Premium ${type.toLowerCase()} for effective dry eye relief. Doctor recommended and clinically proven.`,
        publishedAt: new Date().toISOString(),
        variants: {
            nodes: [{
                id: `gid://shopify/ProductVariant/${id}`,
                title: 'Default Title',
                availableForSale: true,
                price: { amount: price, currencyCode: 'USD' },
                compareAtPrice: null,
                image: { url: image, altText: title, width: 800, height: 800 },
                selectedOptions: [{ name: 'Title', value: 'Default Title' }],
                product: { handle: id, title: title }
            }]
        },
        images: {
            nodes: [{ url: image, altText: title, width: 800, height: 800 }]
        },
        media: {
            nodes: [
                {
                    __typename: 'MediaImage',
                    image: { url: image, altText: title, width: 800, height: 800 }
                }
            ]
        }
    };
}

// Placeholder Images (Using generous placeholders that look like products)
const IMAGES = {
    drops: 'https://cdn.shopify.com/s/files/1/0000/0001/products/placeholder_drops.jpg?v=1', // Fallback will use local eventually
    cleanser: 'https://placehold.co/600x600/e2e8f0/1e293b?text=Cleanser',
    mask: 'https://placehold.co/600x600/e2e8f0/1e293b?text=Warm+Mask',
    spray: 'https://placehold.co/600x600/e2e8f0/1e293b?text=Eyelid+Spray',
    omega: PRN_PRODUCTS.de3_omega.variants[0].image
};

export const LOCAL_COLLECTIONS: Record<string, any[]> = {
    // 1. Vitamins (Real Data)
    'vitamins-supplements': [
        mapPrnToCollectionProduct('de3_omega'),
        mapPrnToCollectionProduct('kids_omega')
    ],

    // 2. Eye Drops (Mock)
    'eye-drops-lubricants': [
        createMockProduct('oasis-tears', 'Oasis TEARS Plus', '29.95', 'https://placehold.co/600x600/eff6ff/1e40af?text=Oasis+Tears', 'Lubricant Eye Drops', 'Oasis'),
        createMockProduct('optase-dry-eye', 'Optase Dry Eye Intense', '24.95', 'https://placehold.co/600x600/eff6ff/1e40af?text=Optase+Drops', 'Lubricant Eye Drops', 'Optase'),
        createMockProduct('retaine-mgd', 'Retaine MGD', '26.50', 'https://placehold.co/600x600/eff6ff/1e40af?text=Retaine+MGD', 'Lipid Replenishment', 'Retaine'),
        createMockProduct('systane-complete', 'Systane Complete', '18.99', 'https://placehold.co/600x600/eff6ff/1e40af?text=Systane', 'Lubricant Eye Drops', 'Systane')
    ],

    // 3. Eyelid Cleansers (Mock)
    'eyelid-cleansers': [
        createMockProduct('optase-tto', 'Optase TTO Lid Wipes', '21.95', 'https://placehold.co/600x600/f0fdf4/166534?text=Optase+Wipes', 'Eyelid Wipes', 'Optase'),
        createMockProduct('ocusoft-plus', 'Ocusoft Lid Scrub Plus', '24.50', 'https://placehold.co/600x600/f0fdf4/166534?text=Ocusoft', 'Foaming Cleanser', 'Ocusoft'),
        createMockProduct('cliradex-wipes', 'Cliradex Towelettes', '44.00', 'https://placehold.co/600x600/f0fdf4/166534?text=Cliradex', 'Natural Cleanser', 'Cliradex')
    ],

    // 4. Eyelid Sprays (Mock)
    'eyelid-sprays': [
        createMockProduct('avenova-spray', 'Avenova Spray', '29.99', 'https://placehold.co/600x600/fdf4ff/86198f?text=Avenova', 'Hypochlorous Acid', 'Avenova'),
        createMockProduct('heyedrate-spray', 'Heyedrate Lid & Lash', '24.95', 'https://placehold.co/600x600/fdf4ff/86198f?text=Heyedrate', 'Eyelid Cleaner', 'Heyedrate')
    ],

    // 5. Masks (Mock)
    'eye-masks': [
        createMockProduct('bruder-mask', 'Bruder Moist Heat Mask', '26.95', 'https://placehold.co/600x600/fff7ed/9a3412?text=Bruder+Mask', 'Compress', 'Bruder'),
        createMockProduct('optase-mask', 'Optase Moist Heat Mask', '24.95', 'https://placehold.co/600x600/fff7ed/9a3412?text=Optase+Mask', 'Compress', 'Optase'),
        createMockProduct('eye-eco-mask', 'Eye Eco Tranquileyes', '45.00', 'https://placehold.co/600x600/fff7ed/9a3412?text=Eye+Eco', 'Sleep Mask', 'Eye Eco')
    ],

    // 6. Contact Lens (Mock)
    'contact-lens-supplies': [
        createMockProduct('lacripure', 'Menicon LacriPure', '22.00', 'https://placehold.co/600x600/e0f2fe/0369a1?text=LacriPure', 'Saline Solution', 'Menicon'),
        createMockProduct('tangible-clean', 'Tangible Clean', '25.00', 'https://placehold.co/600x600/e0f2fe/0369a1?text=Tangible', 'Multi-Purpose Solution', 'Tangible')
    ]
};
