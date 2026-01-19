/**
 * Catalog Cleanup Script
 * 1. Deactivates products without images (sets Status to 'draft')
 * 2. Deactivates products with broken/non-existent images
 * 3. Deactivates duplicate products, keeping the one with a cleaned-up image
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');

const SOURCE_CSV = '/Users/alex/Documents/dryeyela_final_import_ROBUST.csv';
const OUTPUT_CSV = '/Users/alex/Documents/dryeyela_FINAL_CLEAN.csv';
const IMAGES_DIR = '/Users/alex/Documents/Projects/dryeyela-hydrogen/public/products_processed';

console.log('='.repeat(70));
console.log('CATALOG CLEANUP SCRIPT');
console.log('='.repeat(70));

async function run() {
    // Load available images for verification
    const availableImages = new Set(
        fs.readdirSync(IMAGES_DIR)
            .filter(f => f.endsWith('.png') || f.endsWith('.jpg'))
            .map(f => f.toLowerCase())
    );
    console.log(`Found ${availableImages.size} images in products_processed for verification.`);

    const results = [];
    const stream = fs.createReadStream(SOURCE_CSV).pipe(csv());

    for await (const row of stream) {
        results.push(row);
    }

    console.log(`Loaded ${results.length} rows from source CSV.`);

    // Helper to check if an image is valid
    function isImageValid(imageSrc) {
        if (!imageSrc || imageSrc === '') return { valid: false, reason: 'no_image' };

        // Extract filename, removing query params
        const filename = decodeURIComponent(imageSrc.split('/').pop().split('?')[0]);

        // Check if it's a cleaned image (from products_processed)
        const isCleaned = imageSrc.includes('products_processed');

        // Check if file exists
        if (isCleaned && availableImages.has(filename.toLowerCase())) {
            return { valid: true, isCleaned: true };
        } else if (isCleaned) {
            return { valid: false, reason: 'broken_cleaned' };
        } else {
            // Old CDN image - not verified
            return { valid: false, reason: 'old_cdn' };
        }
    }

    // --- STEP 1: Identify products by Title and track duplicates ---
    const productsByTitle = new Map(); // Title (lowercase) -> array of row indices

    results.forEach((row, index) => {
        const title = (row['Title'] || '').trim().toLowerCase();
        if (title) {
            if (!productsByTitle.has(title)) {
                productsByTitle.set(title, []);
            }
            productsByTitle.get(title).push(index);
        }
    });

    // --- STEP 2: Process each title group ---
    let deactivatedNoImage = 0;
    let deactivatedBroken = 0;
    let deactivatedDuplicate = 0;
    let verifiedImages = 0;

    for (const [title, indices] of productsByTitle.entries()) {
        if (indices.length === 1) {
            // Single product - check its image
            const row = results[indices[0]];
            const check = isImageValid(row['Image Src']);

            if (check.valid) {
                verifiedImages++;
            } else {
                row['Status'] = 'draft';
                if (check.reason === 'no_image') {
                    deactivatedNoImage++;
                } else {
                    deactivatedBroken++;
                }
            }
        } else {
            // Multiple products with same title - find the best one
            let bestIndex = null;
            let bestScore = -1;

            for (const idx of indices) {
                const row = results[idx];
                const check = isImageValid(row['Image Src']);

                let score = 0;
                if (check.valid && check.isCleaned) score = 3;
                else if (check.valid) score = 2;
                else if (row['Image Src'] && row['Image Src'] !== '') score = 1;
                // score 0 = no image

                if (score > bestScore) {
                    bestScore = score;
                    bestIndex = idx;
                }
            }

            // Keep the best one active (if it has a valid image), deactivate the rest
            for (const idx of indices) {
                const row = results[idx];
                if (idx === bestIndex) {
                    const check = isImageValid(row['Image Src']);
                    if (check.valid) {
                        verifiedImages++;
                    } else {
                        row['Status'] = 'draft';
                        if (check.reason === 'no_image') {
                            deactivatedNoImage++;
                        } else {
                            deactivatedBroken++;
                        }
                    }
                } else {
                    row['Status'] = 'draft';
                    deactivatedDuplicate++;
                }
            }
        }
    }

    // --- STEP 3: Write output ---
    const headers = Object.keys(results[0]);
    const csvWriter = createObjectCsvWriter({
        path: OUTPUT_CSV,
        header: headers.map(h => ({ id: h, title: h }))
    });

    await csvWriter.writeRecords(results);

    console.log('\n' + '='.repeat(70));
    console.log('RESULTS');
    console.log('='.repeat(70));
    console.log(`✅ Products with verified images (ACTIVE): ${verifiedImages}`);
    console.log(`🚫 Deactivated (no image): ${deactivatedNoImage}`);
    console.log(`🚫 Deactivated (broken/old image): ${deactivatedBroken}`);
    console.log(`🚫 Deactivated (duplicate): ${deactivatedDuplicate}`);
    console.log(`📁 Saved to: ${OUTPUT_CSV}`);
}

run().catch(console.error);
