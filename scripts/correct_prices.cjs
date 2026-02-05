/**
 * Final Catalog Cleanup with Price Corrections
 * Based on PRN Vision pricing as of Jan 2026
 * 
 * PRN DE3 Omega Benefits® Pricing:
 * - 90ct (1 month): $67.75
 * - 180ct (2 months): DEACTIVATE (user request)
 * - 270ct (3 months): $181.95
 */

const fs = require('fs');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');

const SOURCE_CSV = '/Users/alex/Documents/dryeyela_FINAL_CLEAN.csv';
const OUTPUT_CSV = '/Users/alex/Documents/dryeyela_FINAL_PRICE_CORRECTED.csv';
const IMAGES_DIR = '/Users/alex/Documents/Projects/dryeyela-hydrogen/public/products_processed';

console.log('='.repeat(70));
console.log('PRICE CORRECTION & FINAL CLEANUP SCRIPT');
console.log('='.repeat(70));

// Price corrections based on PRN Vision site
const PRICE_CORRECTIONS = {
    // DE3 Omega Benefits
    'de3-dry-eye-omega-benefits--90ct-1-month-supply': { price: '67.75', compareAt: '' },
    'prn-de3-dry-eye-omega-benefits': { price: '67.75', compareAt: '' },

    // Products to DEACTIVATE (2-month variants)
    // We'll handle these by checking title patterns
};

// Patterns to deactivate (2-month supplies that user doesn't want to sell)
const DEACTIVATE_PATTERNS = [
    /180ct/i,
    /2[\s-]*month/i,
];

async function run() {
    const results = [];
    const stream = fs.createReadStream(SOURCE_CSV).pipe(csv());

    for await (const row of stream) {
        results.push(row);
    }

    console.log(`Loaded ${results.length} rows from source CSV.`);

    let pricesCorrected = 0;
    let deactivatedVariants = 0;

    for (const row of results) {
        const handle = row['Handle'] || '';
        const title = row['Title'] || '';

        // --- PRICE CORRECTIONS ---
        // Check if this is any DE3/Omega Benefits product
        if (handle.includes('de3') || handle.includes('omega-benefits') ||
            title.toLowerCase().includes('de3') || title.toLowerCase().includes('omega benefits')) {

            // Determine which variant based on title/handle
            if (title.includes('270') || title.includes('3 Month') || title.includes('3-Month') || handle.includes('270')) {
                row['Variant Price'] = '181.95';
                row['Variant Compare At Price'] = '';
                pricesCorrected++;
                console.log(`✅ Price corrected (270ct): ${title} -> $181.95`);
            } else if (title.includes('180') || title.includes('2 Month') || title.includes('2-Month') || handle.includes('180')) {
                // Deactivate 2-month variants
                row['Status'] = 'draft';
                deactivatedVariants++;
                console.log(`🚫 Deactivated (2-month): ${title}`);
            } else if (title.includes('90') || title.includes('1 Month') || title.includes('1-Month') || handle.includes('90ct')) {
                row['Variant Price'] = '67.75';
                row['Variant Compare At Price'] = '';
                pricesCorrected++;
                console.log(`✅ Price corrected (90ct): ${title} -> $67.75`);
            }
        }

        // --- GENERAL 2-MONTH DEACTIVATION ---
        for (const pattern of DEACTIVATE_PATTERNS) {
            if (pattern.test(title) && row['Status'] !== 'draft') {
                // Only deactivate if it's clearly a 2-month variant
                if (title.toLowerCase().includes('omega') || title.toLowerCase().includes('de3')) {
                    row['Status'] = 'draft';
                    deactivatedVariants++;
                    console.log(`🚫 Deactivated (pattern match): ${title}`);
                    break;
                }
            }
        }
    }

    // --- WRITE OUTPUT ---
    const headers = Object.keys(results[0]);
    const csvWriter = createObjectCsvWriter({
        path: OUTPUT_CSV,
        header: headers.map(h => ({ id: h, title: h }))
    });

    await csvWriter.writeRecords(results);

    // Count final stats
    const activeCount = results.filter(r => r['Status'] === 'active' && r['Title']).length;
    const draftCount = results.filter(r => r['Status'] === 'draft' && r['Title']).length;

    console.log('\n' + '='.repeat(70));
    console.log('RESULTS');
    console.log('='.repeat(70));
    console.log(`✅ Prices corrected: ${pricesCorrected}`);
    console.log(`🚫 Variants deactivated (2-month): ${deactivatedVariants}`);
    console.log(`📊 Active products: ${activeCount}`);
    console.log(`📊 Draft products: ${draftCount}`);
    console.log(`📁 Saved to: ${OUTPUT_CSV}`);
}

run().catch(console.error);
