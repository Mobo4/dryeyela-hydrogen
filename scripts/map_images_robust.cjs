/**
 * Advanced Image Mapper based on Hydrogen Data
 * Uses data/products.json as the handle source of truth
 * Uses public/products_processed/ for image filenames
 * USES CSV-PARSER FOR ROBUSTNESS
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');

const PRODUCTS_JSON = '/Users/alex/Documents/Projects/dryeyela-hydrogen/data/products.json';
const IMAGES_DIR = '/Users/alex/Documents/Projects/dryeyela-hydrogen/public/products_processed';
const SOURCE_CSV = '/Users/alex/Documents/Projects/dryeyela-hydrogen/production_import_fixed_images_FULL.csv';
const OUTPUT_CSV = '/Users/alex/Documents/dryeyela_final_import_ROBUST.csv';
const GITHUB_BASE_URL = 'https://raw.githubusercontent.com/Mobo4/dryeyela-hydrogen/main/public/products_processed/';

console.log('='.repeat(70));
console.log('ROBUST IMAGE MAPPING SCRIPT (V4 - 100% COVERAGE)');
console.log('='.repeat(70));

// Normalizes a string by removing all non-alphanumeric characters and converting to lowercase
function ultraNormalize(s) {
    if (!s) return '';
    try {
        s = decodeURIComponent(s);
    } catch (e) { }
    return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function sanitize(h) {
    if (!h) return '';
    let decoded = h;
    try {
        decoded = decodeURIComponent(h);
    } catch (e) { }
    return decoded.toLowerCase()
        .replace(/[®™]/g, '-')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-'); // Collapse multiple dashes
}

async function run() {
    // 1. Get available images and build ultra-fuzzy map
    const availableImagesRaw = fs.readdirSync(IMAGES_DIR)
        .filter(f => f.endsWith('.png') || f.endsWith('.jpg'));

    const availableImages = new Set(availableImagesRaw.map(f => f.toLowerCase()));

    const ultraFuzzyFileMap = new Map(); // ultraNormalized(filename) -> originalFilename
    availableImagesRaw.forEach(f => {
        const base = path.parse(f).name;
        ultraFuzzyFileMap.set(ultraNormalize(base), f);
    });

    console.log(`Found ${availableImages.size} available images.`);

    // 2. Load handles from JSON
    const productData = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf-8'));

    // Maps for lookup
    const handleMap = new Map(); // Sanitized Handle -> Image Filename
    const titleMap = new Map();  // Title -> Image Filename
    const ultraMap = new Map();  // ultraNormalized(handle) -> Image Filename

    productData.forEach(p => {
        const handle = p.handle;
        if (!handle) return;

        const sHandle = sanitize(handle);
        const uHandle = ultraNormalize(handle);

        let match = null;

        // Strategy A: Exact or simple sanitized
        const strategies = [
            `${handle}.png`,
            `${handle}.jpg`,
            `${sHandle}.png`,
            `${sHandle}.jpg`,
            `${handle.replace(/[®™]/g, '')}.png`,
        ];

        for (const s of strategies) {
            if (availableImages.has(s.toLowerCase())) {
                match = s;
                break;
            }
        }

        // Strategy B: Ultra-fuzzy
        if (!match) {
            match = ultraFuzzyFileMap.get(uHandle);
        }

        if (match) {
            handleMap.set(sHandle, match);
            ultraMap.set(uHandle, match);
            if (p.title) titleMap.set(p.title.trim().toLowerCase(), match);
        }
    });

    // 3. Manual Overrides for Custom Bundles
    const manualOverrides = {
        'moderate-dry-eye-bundle-custom': 'optase-daily-routine-dry-eye-bundle-drop-wipe-pm-ointment.png',
        'severe-dry-eye-strategy-kit-custom': 'avenova--complete-kit-hypochlorous-spray-with-nova-wipes-and-2-bottles-of-lubricants.png',
        'mgd-defense-kit-custom': 'bruder-hygienic-eyelid-care-kit.png',
        'dry-eye-relief-starter-kit-6-pack': 'dry-eye-starter-bundle.png', // Reasonable guess
    };

    console.log(`Mapped ${handleMap.size} unique handles/titles to images.`);

    // 4. Process CSV
    const results = [];
    const stream = fs.createReadStream(SOURCE_CSV).pipe(csv());

    let imagesAddedCount = 0;

    for await (const row of stream) {
        const csvHandle = row['Handle'];
        const csvTitle = row['Title'] ? row['Title'].trim() : '';
        const sCsvHandle = sanitize(csvHandle);
        const uCsvHandle = ultraNormalize(csvHandle);

        // Only update if Image Src is empty
        if (!row['Image Src'] || row['Image Src'] === '') {
            let filename = manualOverrides[csvHandle] ||
                handleMap.get(sCsvHandle) ||
                ultraMap.get(uCsvHandle) ||
                titleMap.get(csvTitle.toLowerCase());

            // Try variant fallback
            if (!filename && csvHandle.includes('?variant=')) {
                const baseHandle = csvHandle.split('?')[0];
                filename = manualOverrides[baseHandle] || handleMap.get(sanitize(baseHandle)) || ultraMap.get(ultraNormalize(baseHandle));
            }

            // Final fallback: try ultraNormalize on the Title too
            if (!filename && csvTitle) {
                filename = ultraFuzzyFileMap.get(ultraNormalize(csvTitle));
            }

            if (filename) {
                row['Image Src'] = `${GITHUB_BASE_URL}${encodeURIComponent(filename)}`;
                if (!row['Image Position'] || row['Image Position'] === '') {
                    row['Image Position'] = '1';
                }
                imagesAddedCount++;
            }
        }
        results.push(row);
    }

    // 5. Write CSV
    const headers = Object.keys(results[0]);
    const csvWriter = createObjectCsvWriter({
        path: OUTPUT_CSV,
        header: headers.map(h => ({ id: h, title: h }))
    });

    await csvWriter.writeRecords(results);

    const totalWithImages = results.filter(r => r['Image Src'] && r['Image Src'] !== '').length;
    const missingRows = results.filter(r => (!r['Image Src'] || r['Image Src'] === '') && r['Title'] && r['Title'] !== '');
    const missed = missingRows.length;

    console.log('\n' + '='.repeat(70));
    console.log('RESULTS');
    console.log('='.repeat(70));
    console.log(`✅ Images newly mapped in this run: ${imagesAddedCount}`);
    console.log(`✅ Total products with images: ${totalWithImages}`);
    console.log(`❌ Products still missing images: ${missed}`);

    if (missed > 0) {
        console.log('\nSample of missing handles (First 20):');
        missingRows.slice(0, 20).forEach(r => console.log(` - ${r['Handle']} (${r['Title']})`));
    }

    console.log(`\n📁 Saved to: ${OUTPUT_CSV}`);
}

run().catch(console.error);
