const fs = require('fs');
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');
const csv = require('csv-parser');

// FILES
const SOURCE_EXPORT = '/Users/alex/Downloads/products_export_1.csv'; // The original source with valid CDN links
const CURRENT_CSV = 'production_import_ready.csv'; // The one with good data but bad images
const OUTPUT_CSV = 'production_import_fixed_images.csv';

const imageMap = new Map(); // Handle -> Image Src
const products = [];

// 1. Load Original Images
console.log(`Loading original images from ${SOURCE_EXPORT}...`);
fs.createReadStream(SOURCE_EXPORT)
    .pipe(csv())
    .on('data', (row) => {
        if (row.Handle && row['Image Src']) {
            // Keep the first image found for a handle (or overwrite if subsequent rows have better ones? usually first is main)
            if (!imageMap.has(row.Handle)) {
                imageMap.set(row.Handle, row['Image Src']);
            }
        }
    })
    .on('end', () => {
        console.log(`Loaded ${imageMap.size} image mappings.`);
        processTarget();
    });

function processTarget() {
    console.log(`Processing ${CURRENT_CSV}...`);
    fs.createReadStream(CURRENT_CSV)
        .pipe(csv())
        .on('data', (row) => products.push(row))
        .on('end', async () => {
            if (products.length === 0) return;

            // Preserve all headers
            const headers = Object.keys(products[0]).map(id => ({ id, title: id }));

            const csvWriter = createObjectCsvWriter({
                path: OUTPUT_CSV,
                header: headers
            });

            const fixedRecords = products.map(row => {
                const handle = row.Handle;

                // If we have an original CDN link, usage it!
                if (imageMap.has(handle)) {
                    row['Image Src'] = imageMap.get(handle);
                    // Also ensure Image Position is 1 if we have an image
                    if (!row['Image Position']) row['Image Position'] = '1';
                } else {
                    // It's a new product (Bundle) or Scraped product.
                    // If it's one of our Custom Bundles, we don't have a public URL.
                    // Let's blank it out to avoid 404 errors during import, 
                    // so the user can just upload 3 images manually.
                    if (row['Image Src'] && row['Image Src'].includes('eyecarecenteroc.com')) {
                        row['Image Src'] = ''; // Clear broken link
                    }
                }

                // Re-enforce the Stock = 10 (Just in case)
                row['Variant Inventory Qty'] = '10';

                return row;
            });

            await csvWriter.writeRecords(fixedRecords);
            console.log(`Restored images for ${fixedRecords.length} records to ${OUTPUT_CSV}`);
        });
}
