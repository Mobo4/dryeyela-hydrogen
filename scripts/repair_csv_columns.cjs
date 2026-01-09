const fs = require('fs');
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');
const csv = require('csv-parser');

const INPUT_CSV = 'processed_catalog.csv';
const OUTPUT_CSV = 'final_fixed_import.csv';

const results = [];

fs.createReadStream(INPUT_CSV)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
        if (results.length === 0) return;

        // Headers are likely correct in the first row, but we need to verify if csv-parser
        // correctly parsed the BROKEN rows?
        // Actually, csv-parser might have misaligned the data into the headers.

        // Strategy: We will map the bad data back to correct keys for the specific known broken handles.

        const knownBrokenHandles = [
            'moderate-dry-eye-bundle-custom',
            'severe-dry-eye-strategy-kit-custom',
            'mgd-defense-kit-custom'
        ];

        const fixedRecords = results.map(row => {
            if (knownBrokenHandles.includes(row.Handle)) {
                // Determine if this row is actually broken.
                // The symptom: 'Variant Price' contains the SKU (e.g., ECOC-...)
                const priceValue = row['Variant Price'];
                if (priceValue && priceValue.startsWith('ECOC-')) {
                    console.log(`Fixing broken row: ${row.Handle}`);

                    // The data is shifted 1 column to the right starting from Tags/Published
                    // "Tags" actually grabbed just the first part "Bundle"
                    // "Published" grabbed "Kit"
                    // "Option1 Name" grabbed "TRUE"
                    // "Option1 Value" grabbed "Title"
                    // "Variant SKU" grabbed "Default Title"
                    // "Variant Price" grabbed the SKU "ECOC-..."
                    // "Variant Requires Shipping" grabbed the Price

                    // Let's manually reconstruct the correct object
                    return {
                        ...row,
                        'Type': 'Bundle', // It was 'Bundle'
                        'Tags': 'Bundle, Kit', // Fix the tags
                        'Published': 'TRUE', // Fix Published
                        'Option1 Name': 'Title',
                        'Option1 Value': 'Default Title',
                        'Variant SKU': row['Variant Price'], // The SKU was here
                        'Variant Price': row['Variant Requires Shipping'], // The Price was here
                        'Variant Requires Shipping': 'TRUE',
                        'Variant Taxable': 'TRUE',
                        // Image Src usually is further down, likely shifted too?
                        // Let's check where the Image URL ended up.
                        // "Variant Taxable" -> "TRUE" (in broken row: "Variant Taxable" had "TRUE"?)
                        // "Image Src" -> Had URL? 

                        // Wait, let's look at the bad row again from grep:
                        // ..., ECOC-BUNDLE-MOD, 149.95, TRUE, https://...
                        // ECOC... -> Variant Price
                        // 149.95 -> Variant Requires Shipping
                        // TRUE -> Variant Taxable
                        // URL -> Image Src

                        // So actually, ONLY the columns BEFORE Image Src (up to Taxable) were shifted?
                        // No, the shift propagates.

                        'Image Src': row['Image Src'], // This might be correct if csv-parser realigned? 
                        // Actually, if the line length increased by 1 field, the last field might have dropped or overflowed?
                        // csv-parser usually puts extras in a generic field or drops them.
                        // But let's trust that Image Src is likely the URL if it looks like one.
                    };
                }
            }
            return row;
        });

        const csvWriter = createObjectCsvWriter({
            path: OUTPUT_CSV,
            header: Object.keys(results[0]).map(id => ({ id, title: id }))
        });

        await csvWriter.writeRecords(fixedRecords);
        console.log(`Fixed ${fixedRecords.length} records to ${OUTPUT_CSV}`);
    });
