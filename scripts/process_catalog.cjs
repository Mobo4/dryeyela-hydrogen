
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const sharp = require('sharp');
const { createObjectCsvWriter } = require('csv-writer');

const INPUT_CSV = '/Users/alex/Documents/Projects/dryeye_website/products_import_full.csv';
const INPUT_IMG_DIR = '/Users/alex/Documents/Projects/dryeyela-hydrogen/public/products';
const OUTPUT_IMG_DIR = '/Users/alex/Documents/Projects/dryeyela-hydrogen/public/products_processed';
const OUTPUT_CSV = '/Users/alex/Documents/Projects/dryeyela-hydrogen/processed_catalog.csv';

// Ensure output dir exists
if (!fs.existsSync(OUTPUT_IMG_DIR)) {
    fs.mkdirSync(OUTPUT_IMG_DIR, { recursive: true });
}

// Auto-Tagging Logic
function generateTags(item) {
    const text = (item.Title + ' ' + item['Body (HTML)']).toLowerCase();
    const tags = new Set(item.Tags ? item.Tags.split(',').map(t => t.trim()).filter(Boolean) : []);

    if (text.includes('drop')) tags.add('Eye Drops');
    if (text.includes('wipe')) tags.add('Eyelid Wipes');
    if (text.includes('mask') || text.includes('compress')) tags.add('Eye Masks');
    if (text.includes('omega') || text.includes('fish oil') || text.includes('supplement')) tags.add('Supplements');
    if (text.includes('preservative free') || text.includes('preservative-free')) tags.add('Preservative Free');
    if (text.includes('contact') || text.includes('lens')) tags.add('Contact Lens Care');
    if (text.includes('spray')) tags.add('Sprays');
    if (text.includes('foam')) tags.add('Cleansers');

    return Array.from(tags).join(', ');
}

async function processImage(filename) {
    const inputPath = path.join(INPUT_IMG_DIR, filename);
    const outputPath = path.join(OUTPUT_IMG_DIR, filename); // Keep same name for simplicity mapping

    if (!fs.existsSync(inputPath)) return null;

    try {
        // Resize to 1000x1000 square with white background
        await sharp(inputPath)
            .resize(1000, 1000, {
                fit: 'contain',
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            })
            .flatten({ background: { r: 255, g: 255, b: 255 } }) // Ensure no transparency
            .toFile(outputPath);
        // console.log(`Processed: ${filename}`);
        return filename;
    } catch (err) {
        console.error(`Error processing ${filename}:`, err.message);
        return null; // Fallback or fail
    }
}

const results = [];

fs.createReadStream(INPUT_CSV)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
        console.log(`Processing ${results.length} rows...`);

        const processedRecords = [];

        // Setup CSV Writer with dynamic headers based on first row
        if (results.length === 0) return;

        const csvWriter = createObjectCsvWriter({
            path: OUTPUT_CSV,
            header: Object.keys(results[0]).map(id => ({ id, title: id }))
        });

        const seenImages = new Set();
        let processedCount = 0;

        for (const row of results) {
            // 1. Tags Enrichment (Only for main products)
            if (row.Title && row.Title.trim() !== '') {
                // Note: Some CSVs have blank titles for variants. 
                // We will enrich tags on rows that have tags or body.
                row.Tags = generateTags(row);
            }

            // 2. Image Processing
            if (row['Image Src']) {
                const url = row['Image Src'];
                // Extract filename from URL (assuming standard format)
                const filename = url.split('/').pop().split('?')[0]; // simple parsing

                if (filename && !seenImages.has(filename)) {
                    await processImage(filename);
                    seenImages.add(filename);
                    processedCount++;
                    if (processedCount % 50 === 0) console.log(`Processed ${processedCount} images...`);
                }
            }

            processedRecords.push(row);
        }

        await csvWriter.writeRecords(processedRecords);
        console.log(`CSV Processing Complete. Processed ${processedCount} images.`);
    });
