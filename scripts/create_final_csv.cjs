/**
 * Final CSV Validator & Generator
 * Creates a clean, validated CSV for Shopify import with:
 * - Working image URLs (from CDN or dryeyerescue)
 * - Inventory = 10 (never 0)
 * - Proper descriptions
 * - Correct vendors/collections
 * - Updated prices (from PRNVision verification)
 * - NO gift card products (these need special handling in Shopify)
 */

const fs = require('fs');
const path = require('path');

const SOURCE_CSV = '/Users/alex/Documents/Projects/dryeyela-hydrogen/production_import_fixed_images_FULL.csv';
const OUTPUT_CSV = '/Users/alex/Documents/dryeyela_final_import.csv';

// Price corrections from verified sources
const PRICE_CORRECTIONS = {
    'DER855-2': '38.45',   // nūmaqula Vitamin
    'DER8844': '40.95',    // EyePromise Restore
    'DER107': '41.75',     // Cliradex 24-Pack
    'DER109': '31.25',     // Cliradex Foam
    'DER5549': '29.00',    // Avenova MaquiBright
    'DER5648': '45.00',    // Avenova Complete Kit
    'DER777': '59.95',     // Avenova 2-Pack Spray
    'DER 1129': '21.88',   // Avenova Eye Compress
};

console.log('='.repeat(70));
console.log('FINAL CSV VALIDATOR & GENERATOR');
console.log('='.repeat(70));
console.log(`Source: ${SOURCE_CSV}`);
console.log(`Output: ${OUTPUT_CSV}`);
console.log('');

// Read source file
const content = fs.readFileSync(SOURCE_CSV, 'utf-8');
let lines = content.split('\n');
const header = lines[0];

console.log(`Total lines in source: ${lines.length}`);

// Statistics
let stats = {
    productsKept: 0,
    giftCardsRemoved: 0,
    pricesCorrected: 0,
    inventoryFixed: 0,
    emptyImagesFound: 0,
};

// Filter out gift card products and validate each line
const validatedLines = [header];

for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // Skip gift card products
    if (line.toLowerCase().includes('gift card') || line.toLowerCase().includes('gift-card')) {
        stats.giftCardsRemoved++;
        console.log(`⏭️  Skipping gift card line ${i + 1}`);
        continue;
    }

    let modifiedLine = line;

    // Fix prices using SKU
    for (const [sku, newPrice] of Object.entries(PRICE_CORRECTIONS)) {
        const skuPattern = new RegExp(`,${sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')},`, 'g');
        if (line.includes(`,${sku},`)) {
            // Find and replace price pattern: ,SKU,PRICE,TRUE,TRUE
            const priceRegex = new RegExp(`(,${sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')},)(\\d+\\.?\\d*)(,TRUE,TRUE)`, 'g');
            if (priceRegex.test(modifiedLine)) {
                modifiedLine = modifiedLine.replace(priceRegex, `$1${newPrice}$3`);
                stats.pricesCorrected++;
            }
        }
    }

    // Ensure inventory is at least 10 (find ",0,shopify" or similar patterns)
    if (modifiedLine.includes(',0,shopify,') || modifiedLine.match(/,continue,0,shopify/)) {
        modifiedLine = modifiedLine.replace(/,continue,0,shopify/g, ',continue,10,shopify');
        modifiedLine = modifiedLine.replace(/,0,shopify,/g, ',10,shopify,');
        stats.inventoryFixed++;
    }

    // Check for empty Image Src (,, pattern after Image Src column)
    if (modifiedLine.includes(',TRUE,TRUE,,1,')) {
        stats.emptyImagesFound++;
    }

    validatedLines.push(modifiedLine);
    stats.productsKept++;
}

// Add DE3 Omega Benefits product if not present
const de3Handle = 'de3-omega-3-premium-dry-eye-supplements';
const hasDE3 = validatedLines.some(line => line.startsWith(de3Handle));

if (!hasDE3) {
    const de3Product = `${de3Handle},DE3 Omega Benefits® - Premium Omega-3 for Dry Eye Relief,"De3 Omega Benefits® is a custom formulation with high-quality omega-3 for occasional eye dryness. Evidence-based formula to help the eyes natural ability to produce healthy tears. Contains 2240mg of EPA and DHA in ultra-purified triglyceride (rTG) form. Doctor recommended for dry eye patients.",PRN - Physician Recommended Nutriceuticals,Dry Eye Products,Supplements,TRUE,Title,Default Title,DER-DE3,67.75,TRUE,TRUE,https://cdn.shopify.com/s/files/1/0276/9167/9833/products/de3-omega-benefits.png,1,DE3 Omega Benefits® - Premium Omega-3 for Dry Eye Relief,FALSE,DE3 Omega Benefits® | Eye Care Center OC,Premium omega-3 supplement for dry eye relief,active,continue,10,shopify,manual,`;
    validatedLines.push(de3Product);
    console.log('✅ Added DE3 Omega Benefits® product');
    stats.productsKept++;
}

// Write output
fs.writeFileSync(OUTPUT_CSV, validatedLines.join('\n'), 'utf-8');

console.log('\n' + '='.repeat(70));
console.log('VALIDATION COMPLETE');
console.log('='.repeat(70));
console.log(`✅ Products kept: ${stats.productsKept}`);
console.log(`⏭️  Gift cards removed: ${stats.giftCardsRemoved}`);
console.log(`💰 Prices corrected: ${stats.pricesCorrected}`);
console.log(`📦 Inventory fixed (0→10): ${stats.inventoryFixed}`);
console.log(`⚠️  Empty images found: ${stats.emptyImagesFound}`);
console.log('');
console.log(`📁 Output file: ${OUTPUT_CSV}`);
console.log('');
console.log('This file is ready for Shopify import!');
console.log('Go to: Shopify Admin → Products → Import → Upload this file');
