const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csv = require('csv-parser');

// Config
const IMPORT_CSV = 'enhanced_full_import.csv';
const IMAGE_DIR = 'public/products_processed';
const OUTPUT_CSV = 'full_catalog_image_update.csv';
const REPO_BASE_URL = 'https://raw.githubusercontent.com/Mobo4/dryeyela-hydrogen/main/public/products_processed/';

// Read directories
const processedFiles = fs.readdirSync(IMAGE_DIR);
const processedMap = new Map(); // filename (no ext) -> full filename

processedFiles.forEach(file => {
    if (file.endsWith('.png') || file.endsWith('.jpg')) {
        const nameNoExt = path.parse(file).name;
        // We store both exact match and potentially simplified match if needed
        processedMap.set(nameNoExt.toLowerCase(), file);
        processedMap.set(file.toLowerCase(), file); // Map full filename too just in case
    }
});

const csvWriter = createCsvWriter({
    path: OUTPUT_CSV,
    header: [
        { id: 'handle', title: 'Handle' },
        { id: 'imageSrc', title: 'Image Src' }
    ]
});

const records = [];
const processedHandles = new Set();
let foundCount = 0;
let missingCount = 0;

fs.createReadStream(IMPORT_CSV)
    .pipe(csv())
    .on('data', (row) => {
        const handle = row['Handle'];
        if (!handle || processedHandles.has(handle)) return;

        // Logic to find image
        let imageFilename = processedMap.get(handle.toLowerCase());

        if (imageFilename) {
            records.push({
                handle: handle,
                imageSrc: `${REPO_BASE_URL}${imageFilename}`
            });
            foundCount++;
            processedHandles.add(handle);
        } else {
            missingCount++;
        }
    })
    .on('end', async () => {
        await csvWriter.writeRecords(records);
        console.log(`Generated ${OUTPUT_CSV}`);
        console.log(`Found images: ${foundCount}`);
        console.log(`Unique products updated: ${processedHandles.size}`);
    });
