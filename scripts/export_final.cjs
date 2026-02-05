/**
 * Create Final Import CSV from existing catalog with images
 * Uses final_import_catalog.csv which already has GitHub image URLs
 * Applies price corrections and saves to Documents folder
 */

const fs = require('fs');

const SOURCE = '/Users/alex/Documents/Projects/dryeyela-hydrogen/final_import_catalog.csv';
const OUTPUT = '/Users/alex/Documents/dryeyela_shopify_import.csv';

const PRICE_CORRECTIONS = {
    'DER855-2': '38.45', 'DER8844': '40.95', 'DER107': '41.75', 'DER109': '31.25',
    'DER5549': '29.00', 'DER5648': '45.00', 'DER777': '59.95', 'DER 1129': '21.88',
};

console.log('Creating final import CSV...');

let content = fs.readFileSync(SOURCE, 'utf-8');

// Apply price corrections
for (const [sku, newPrice] of Object.entries(PRICE_CORRECTIONS)) {
    const regex = new RegExp(`(,${sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')},)(\\d+\\.?\\d*)(,TRUE,TRUE)`, 'g');
    content = content.replace(regex, `$1${newPrice}$3`);
}

// Remove any gift card lines
const lines = content.split('\n').filter(line =>
    !line.toLowerCase().includes('gift card') && !line.toLowerCase().includes('gift-card')
);

// Add DE3 Omega Benefits 
const de3 = `de3-omega-3-premium-dry-eye-supplements,DE3 Omega Benefits® - Premium Omega-3 for Dry Eye Relief,"De3 Omega Benefits® is a custom formulation with high-quality omega-3 for occasional eye dryness. Evidence-based formula for healthy tear production. Contains 2240mg of EPA and DHA. Doctor recommended.",PRN - Physician Recommended Nutriceuticals,Dry Eye Products,Supplements,TRUE,Title,Default Title,DER-DE3,67.75,TRUE,TRUE,https://raw.githubusercontent.com/Mobo4/dryeyela-hydrogen/main/public/products_processed/de3-dry-eye-omega-benefits--90ct-1-month-supply.png,1,DE3 Omega Benefits® - Premium Omega-3,FALSE,DE3 Omega Benefits® | Eye Care Center OC,Premium omega-3 for dry eye`;

if (!content.includes('de3-omega-3-premium-dry-eye-supplements')) {
    lines.push(de3);
}

fs.writeFileSync(OUTPUT, lines.join('\n'), 'utf-8');

console.log(`✅ Created: ${OUTPUT}`);
console.log(`Total lines: ${lines.length}`);
console.log('Ready for Shopify import!');
