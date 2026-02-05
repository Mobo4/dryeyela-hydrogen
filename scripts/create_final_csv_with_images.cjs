/**
 * Final CSV Generator with GitHub Image URLs
 * Uses GitHub raw URLs for images (same method as before)
 * 
 * Image URL Pattern:
 * https://raw.githubusercontent.com/Mobo4/dryeyela-hydrogen/main/public/products_processed/[handle].png
 */

const fs = require('fs');
const path = require('path');

const SOURCE_CSV = '/Users/alex/Documents/Projects/dryeyela-hydrogen/production_import_fixed_images_FULL.csv';
const OUTPUT_CSV = '/Users/alex/Documents/dryeyela_final_import_with_images.csv';
const IMAGES_DIR = '/Users/alex/Documents/Projects/dryeyela-hydrogen/public/products_processed';
const GITHUB_BASE_URL = 'https://raw.githubusercontent.com/Mobo4/dryeyela-hydrogen/main/public/products_processed/';

// Price corrections
const PRICE_CORRECTIONS = {
    'DER855-2': '38.45', 'DER8844': '40.95', 'DER107': '41.75', 'DER109': '31.25',
    'DER5549': '29.00', 'DER5648': '45.00', 'DER777': '59.95', 'DER 1129': '21.88',
};

console.log('='.repeat(70));
console.log('FINAL CSV GENERATOR WITH GITHUB IMAGES');
console.log('='.repeat(70));

// Get list of available images
const availableImages = new Set(
    fs.readdirSync(IMAGES_DIR)
        .filter(f => f.endsWith('.png') || f.endsWith('.jpg'))
        .map(f => f.toLowerCase())
);
console.log(`Found ${availableImages.size} images in products_processed/`);

// Read source CSV
let content = fs.readFileSync(SOURCE_CSV, 'utf-8');

// Apply price corrections
for (const [sku, newPrice] of Object.entries(PRICE_CORRECTIONS)) {
    const regex = new RegExp(`(,${sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')},)(\\d+\\.?\\d*)(,TRUE,TRUE)`, 'g');
    content = content.replace(regex, `$1${newPrice}$3`);
}
console.log('✅ Prices corrected');

// Track stats
let imagesAdded = 0;
let imagesNotFound = 0;
let giftCardsRemoved = 0;

// Process lines
const lines = content.split('\n');
const header = lines[0];
const result = [header];

for (let i = 1; i < lines.length; i++) {
    let line = lines[i];
    if (!line.trim()) continue;

    // Skip gift cards
    if (line.toLowerCase().includes('gift card') || line.toLowerCase().includes('gift-card')) {
        giftCardsRemoved++;
        continue;
    }

    // Get handle (first column)
    const handle = line.split(',')[0];
    if (!handle) {
        result.push(line);
        continue;
    }

    // Check if this line has an empty image (pattern: ,TRUE,TRUE,,1,)
    if (line.includes(',TRUE,TRUE,,1,')) {
        // Try to find matching image
        const possibleNames = [
            `${handle}.png`,
            `${handle}.jpg`,
            `${handle}-1.png`,
        ];

        let imageFound = false;
        for (const imgName of possibleNames) {
            if (availableImages.has(imgName.toLowerCase())) {
                const imageUrl = `${GITHUB_BASE_URL}${encodeURIComponent(imgName)}`;
                line = line.replace(',TRUE,TRUE,,1,', `,TRUE,TRUE,${imageUrl},1,`);
                imagesAdded++;
                imageFound = true;
                break;
            }
        }

        if (!imageFound) {
            imagesNotFound++;
        }
    }

    result.push(line);
}

// Add DE3 Omega Benefits if not present
const hasDE3 = result.some(l => l.startsWith('de3-omega-3-premium-dry-eye-supplements'));
if (!hasDE3) {
    const de3Product = `de3-omega-3-premium-dry-eye-supplements,DE3 Omega Benefits® - Premium Omega-3 for Dry Eye Relief,"De3 Omega Benefits® is a custom formulation with high-quality omega-3 for occasional eye dryness. Evidence-based formula to help the eyes natural ability to produce healthy tears. Contains 2240mg of EPA and DHA in ultra-purified triglyceride (rTG) form. Doctor recommended.",PRN - Physician Recommended Nutriceuticals,Dry Eye Products,Supplements,TRUE,Title,Default Title,DER-DE3,67.75,TRUE,TRUE,${GITHUB_BASE_URL}de3-dry-eye-omega-benefits--90ct-1-month-supply.png,1,DE3 Omega Benefits® - Premium Omega-3 for Dry Eye Relief,FALSE,DE3 Omega Benefits® | Eye Care Center OC,Premium omega-3 supplement for dry eye relief,active,continue,10,shopify,manual,`;
    result.push(de3Product);
    console.log('✅ Added DE3 Omega Benefits® product');
}

// Write output
fs.writeFileSync(OUTPUT_CSV, result.join('\n'), 'utf-8');

console.log('\n' + '='.repeat(70));
console.log('SUMMARY');
console.log('='.repeat(70));
console.log(`✅ Images added: ${imagesAdded}`);
console.log(`⚠️  Images not found: ${imagesNotFound}`);
console.log(`⏭️  Gift cards removed: ${giftCardsRemoved}`);
console.log(`📦 Total product lines: ${result.length - 1}`);
console.log('');
console.log(`📁 Output: ${OUTPUT_CSV}`);
console.log('');
console.log('IMPORTANT: Make sure to push images to GitHub first:');
console.log('  cd /Users/alex/Documents/Projects/dryeyela-hydrogen');
console.log('  git add public/products_processed/');
console.log('  git commit -m "Add product images"');
console.log('  git push origin main');
