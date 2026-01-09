const fs = require('fs');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');

const INPUT_CSV = 'processed_catalog.csv';
const OUTPUT_CSV = 'final_import_catalog.csv';
const GITHUB_BASE_URL = 'https://raw.githubusercontent.com/Mobo4/dryeyela-hydrogen/main/public/products_processed/';

const results = [];

fs.createReadStream(INPUT_CSV)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
        if (results.length === 0) return;

        const csvWriter = createObjectCsvWriter({
            path: OUTPUT_CSV,
            header: Object.keys(results[0]).map(id => ({ id, title: id }))
        });

        const updatedRecords = results.map(row => {
            if (row['Image Src']) {
                // Extract filename
                const filename = row['Image Src'].split('/').pop().split('?')[0];
                // Update URL to GitHub Raw
                row['Image Src'] = `${GITHUB_BASE_URL}${filename}`;
            }
            return row;
        });

        await csvWriter.writeRecords(updatedRecords);
        console.log(`Rewrote ${updatedRecords.length} records to ${OUTPUT_CSV}`);
    });
