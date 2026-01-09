const fs = require('fs');
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');
const csv = require('csv-parser');

const INPUT_CSV = 'nuclear_full_import.csv';
const OUTPUT_CSV = 'enhanced_full_import.csv';
const PROCESSED_IMAGES_DIR = './public/products_processed';

// Build image lookup map (filename without extension -> full filename)
const imageFiles = fs.readdirSync(PROCESSED_IMAGES_DIR);
const imageMap = new Map();
imageFiles.forEach(file => {
    const baseName = path.basename(file, path.extname(file)).toLowerCase();
    imageMap.set(baseName, file);
});
console.log(`Loaded ${imageMap.size} processed images.`);

// Weight estimation based on product type/tags
function estimateWeight(row) {
    const title = (row.Title || '').toLowerCase();
    const tags = (row.Tags || '').toLowerCase();
    const type = (row.Type || '').toLowerCase();

    // Bundle = heavier
    if (type.includes('bundle') || tags.includes('bundle') || tags.includes('kit')) {
        return '0.75'; // lbs
    }
    // Supplements (bottles of pills)
    if (tags.includes('supplement') || tags.includes('omega') || title.includes('omega')) {
        return '0.5';
    }
    // Masks/Compresses
    if (tags.includes('mask') || title.includes('compress') || title.includes('mask')) {
        return '0.4';
    }
    // Wipes (box)
    if (tags.includes('wipe') || title.includes('wipe')) {
        return '0.3';
    }
    // Foam/Cleanser
    if (title.includes('foam') || title.includes('cleanser') || title.includes('scrub')) {
        return '0.25';
    }
    // Eye drops (small bottles)
    if (tags.includes('drop') || title.includes('drop') || title.includes('lubricant')) {
        return '0.2';
    }
    // Spray
    if (title.includes('spray')) {
        return '0.15';
    }
    // Contact lens solution (bigger bottles)
    if (title.includes('solution') || tags.includes('contact lens')) {
        return '0.6';
    }
    // Default
    return '0.3';
}

// Find matching processed image
function findProcessedImage(handle) {
    if (!handle) return null;
    const normalizedHandle = handle.toLowerCase().replace(/[^a-z0-9-]/g, '');

    // Direct match
    if (imageMap.has(normalizedHandle)) {
        return imageMap.get(normalizedHandle);
    }

    // Partial match (handle is substring of filename or vice versa)
    for (const [baseName, file] of imageMap.entries()) {
        if (baseName.includes(normalizedHandle) || normalizedHandle.includes(baseName.substring(0, 30))) {
            return file;
        }
    }
    return null;
}

const records = [];
let matchedImages = 0;

console.log(`Reading ${INPUT_CSV}...`);
fs.createReadStream(INPUT_CSV)
    .pipe(csv())
    .on('data', (row) => {
        // 1. Add Product Category (Shopify standard taxonomy)
        row['Product Category'] = 'Health & Beauty > Health Care > Eye Care';

        // 2. Add Weight (in lbs)
        row['Variant Grams'] = Math.round(parseFloat(estimateWeight(row)) * 453.592); // Convert lbs to grams

        // 3. Try to match processed image ONLY if no image exists
        if (!row['Image Src'] || row['Image Src'].trim() === '') {
            const processedImg = findProcessedImage(row.Handle);
            if (processedImg) {
                // Use GitHub Raw URL (will work if repo is public)
                row['Image Src'] = `https://raw.githubusercontent.com/Mobo4/dryeyela-hydrogen/main/public/products_processed/${encodeURIComponent(processedImg)}`;
                row['Image Position'] = '1';
                matchedImages++;
            }
        }

        records.push(row);
    })
    .on('end', async () => {
        if (records.length === 0) return;

        // Get all headers
        const headerSet = new Set();
        records.forEach(r => Object.keys(r).forEach(k => headerSet.add(k)));
        const headers = Array.from(headerSet).map(id => ({ id, title: id }));

        const csvWriter = createObjectCsvWriter({
            path: OUTPUT_CSV,
            header: headers
        });

        await csvWriter.writeRecords(records);
        console.log(`Enhanced ${records.length} records.`);
        console.log(`Matched ${matchedImages} products with processed images.`);
        console.log(`Output: ${OUTPUT_CSV}`);
    });
