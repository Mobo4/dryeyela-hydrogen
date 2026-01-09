const fs = require('fs');
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');
const csv = require('csv-parser');

// FILES
const SOURCE_EXPORT = '/Users/alex/Downloads/products_export_1.csv';
const CURRENT_CSV = 'production_import_ready.csv';
const OUTPUT_CSV = 'production_import_fixed_images_FULL.csv';

const imageMap = new Map(); // Handle -> Array of { src, pos, alt }

// 1. Load Original Images (ALL of them)
console.log(`Loading original images from ${SOURCE_EXPORT}...`);
fs.createReadStream(SOURCE_EXPORT)
    .pipe(csv())
    .on('data', (row) => {
        if (row.Handle && row['Image Src']) {
            if (!imageMap.has(row.Handle)) {
                imageMap.set(row.Handle, []);
            }
            imageMap.get(row.Handle).push({
                src: row['Image Src'],
                pos: row['Image Position'],
                alt: row['Image Alt Text']
            });
        }
    })
    .on('end', () => {
        console.log(`Loaded images for ${imageMap.size} unique handles.`);
        processTarget();
    });

function processTarget() {
    console.log(`Processing ${CURRENT_CSV}...`);
    const allRecords = [];

    fs.createReadStream(CURRENT_CSV)
        .pipe(csv())
        .on('data', (row) => {
            const handle = row.Handle;
            const originalImages = imageMap.get(handle);

            if (originalImages && originalImages.length > 0) {
                // PRIMARY ROW
                // Update the main row with the FIRST image
                const mainImg = originalImages[0];
                row['Image Src'] = mainImg.src;
                row['Image Position'] = mainImg.pos || '1';
                row['Image Alt Text'] = mainImg.alt;
                row['Variant Inventory Qty'] = '10'; // Enforce stock

                allRecords.push(row);

                // SECONDARY ROWS (Additional Images)
                // These rows should only have Handle and Image columns (and blank others? or partial?)
                // Shopify expects Handle + Image columns for extra images.
                for (let i = 1; i < originalImages.length; i++) {
                    const img = originalImages[i];
                    allRecords.push({
                        'Handle': handle,
                        'Image Src': img.src,
                        'Image Position': img.pos,
                        'Image Alt Text': img.alt,
                        // Leave other fields undefined (empty)
                    });
                }
            } else {
                // NO Original Images (Custom Bundle or New)
                // Do the bundle logic
                if (row['Image Src'] && row['Image Src'].includes('eyecarecenteroc.com')) {
                    row['Image Src'] = ''; // Clear broken private link so user can upload manually
                }
                row['Variant Inventory Qty'] = '10';
                allRecords.push(row);
            }
        })
        .on('end', async () => {
            if (allRecords.length === 0) return;

            // Headers: Use the headers from the input, but make sure they cover enough?
            // csv-writer needs explicitly defined headers.
            // We can read the headers from the first row of CURRENT_CSV
            // But verify we don't drop columns if the first row is full.

            // To be safe, let's get headers from the read stream or just assume CURRENT_CSV headers are sufficient.
            // Actually, we just read CURRENT_CSV.
            // We need to pass the same headers to the writer.

            // Re-read file just to get headers? Or hardcode?
            // Better: use the headers we saw in the first 'data' event?
            // We pushed parsed objects.

            // Let's assume the keys of the first record in `allRecords` that is a FULL product are the headers.
            // Find a full record
            const fullRecord = allRecords.find(r => r.Title);
            const headerKeys = Object.keys(fullRecord);

            const csvWriter = createObjectCsvWriter({
                path: OUTPUT_CSV,
                header: headerKeys.map(id => ({ id, title: id }))
            });

            await csvWriter.writeRecords(allRecords);
            console.log(`Restored ALL images. Wrote ${allRecords.length} records to ${OUTPUT_CSV}`);
        });
}
