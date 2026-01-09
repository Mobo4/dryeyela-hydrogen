const https = require('https');
const fs = require('fs');
const path = require('path');

// Load env validation
// You must run this with: SHOPIFY_SHOP=your-site.myshopify.com SHOPIFY_ACCESS_TOKEN=shpat_... node scripts/setup_store_collections.cjs
// OR ensure .env has them.

// CONFIGURATION
const COLLECTIONS = [
    { title: "Dry Eye Drops", tag: "Eye Drops" },
    { title: "Eyelid Wipes", tag: "Eyelid Wipes" },
    { title: "Eye Masks & Compresses", tag: "Eye Masks" },
    { title: "Nutritional Supplements", tag: "Supplements" },
    { title: "Preservative Free", tag: "Preservative Free" },
    { title: "Contact Lens Care", tag: "Contact Lens Care" },
    { title: "Sprays", tag: "Sprays" },
    { title: "Cleansers & Foams", tag: "Cleansers" },
    { title: "Starter Kits", tag: "Kit" }
];

const SHOP = process.env.SHOPIFY_SHOP || 'dryeyela.myshopify.com'; // Replace with actual if known
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

if (!TOKEN) {
    console.error("ERROR: SHOPIFY_ACCESS_TOKEN is missing.");
    console.log("Usage: SHOPIFY_ACCESS_TOKEN=shpat_xxxxx node scripts/setup_store_collections.cjs");
    process.exit(1);
}

function createCollection(collection) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            smart_collection: {
                title: collection.title,
                rules: [
                    {
                        column: "tag",
                        relation: "equals",
                        condition: collection.tag
                    }
                ]
            }
        });

        const options = {
            hostname: SHOP,
            path: '/admin/api/2023-10/smart_collections.json',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': TOKEN,
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log(`✅ Created Collection: ${collection.title}`);
                    resolve(JSON.parse(body));
                } else {
                    console.error(`❌ Failed to create ${collection.title}: ${res.statusCode} ${body}`);
                    resolve(null); // Resolve to keep going
                }
            });
        });

        req.on('error', (e) => {
            console.error(`Request Error for ${collection.title}: ${e.message}`);
            resolve(null);
        });

        req.write(data);
        req.end();
    });
}

(async () => {
    console.log(`Creating ${COLLECTIONS.length} Smart Collections on ${SHOP}...`);
    for (const col of COLLECTIONS) {
        await createCollection(col);
        // tiny delay to be nice to rate limits
        await new Promise(r => setTimeout(r, 500));
    }
    console.log("Done.");
})();
