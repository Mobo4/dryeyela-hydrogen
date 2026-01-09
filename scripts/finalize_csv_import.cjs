const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');
const csv = require('csv-parser');

const INPUT_CSV = 'final_fixed_import.csv';
const OUTPUT_CSV = 'production_import_ready.csv';

const results = [];

// Helper to strip HTML
function stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '');
}

fs.createReadStream(INPUT_CSV)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
        if (results.length === 0) return;

        console.log(`Processing ${results.length} rows...`);

        // define new headers
        // We take existing headers AND add the new ones we want to enforce if they don't check out.
        // Actually, let's explicitly define the "Production" set of headers we care about.
        // We will extend the existing keys.

        let headers = Object.keys(results[0]);
        const newFields = [
            'Status',
            'Variant Inventory Policy',
            'Variant Inventory Qty', // Add Quantity
            'Variant Inventory Tracker',
            'Variant Fulfillment Service',
            'SEO Title',
            'SEO Description',
            'Metafield: custom.doctors_take [multi_line_text_field]'
        ];

        newFields.forEach(f => {
            if (!headers.includes(f)) headers.push(f);
        });

        const csvWriter = createObjectCsvWriter({
            path: OUTPUT_CSV,
            header: headers.map(id => ({ id, title: id }))
        });

        const finalRecords = results.map(row => {
            // 1. Enforce Active & Inventory
            row['Status'] = 'active'; // Ensure product is live
            row['Variant Inventory Policy'] = 'continue'; // Don't stop selling when 0
            row['Variant Inventory Qty'] = '10'; // Default stock as requested
            row['Variant Inventory Tracker'] = 'shopify';
            row['Variant Fulfillment Service'] = 'manual';

            // 2. SEO Fallbacks
            if (!row['SEO Title'] || row['SEO Title'] === '') {
                row['SEO Title'] = row['Title'];
            }
            if (!row['SEO Description'] || row['SEO Description'] === '') {
                // First 300 chars of plain text description
                const plain = stripHtml(row['Body (HTML)']);
                row['SEO Description'] = plain.substring(0, 300);
            }

            // 3. Metafield: Doctor's Take
            // We can populate this for our Custom Bundles using the description data we know is good.
            const handle = row['Handle'];

            if (handle === 'moderate-dry-eye-bundle-custom') {
                row['Metafield: custom.doctors_take [multi_line_text_field]'] =
                    "Dermatologist-tested and ophthalmologist-approved. This regimen targets the root causes of moderate dry eye: inflammation and tear evaporation. The Tea Tree Oil Gel addresses blepharitis, while the Preservative-Free drops ensure safe, long-term hydration without toxicity.";
                row['Image Src'] = "https://eyecarecenteroc.com/products/optase-daily-routine-dry-eye-bundle-drop-wipe-pm-ointment.png";
                row['Image Position'] = "1";
            } else if (handle === 'severe-dry-eye-strategy-kit-custom') {
                row['Metafield: custom.doctors_take [multi_line_text_field]'] =
                    "A maximum strength protocol for severe cases. Hypochlorous acid (Avenova) is critical for neutralizing bacterial load on the eyelids, while the night-time ointment provides a physical barrier against desiccation during sleep when tear production stops.";
                row['Image Src'] = "https://eyecarecenteroc.com/products/avenova--complete-kit-hypochlorous-spray-with-nova-wipes-and-2-bottles-of-lubricants.png";
                row['Image Position'] = "1";
            } else if (handle === 'mgd-defense-kit-custom') {
                row['Metafield: custom.doctors_take [multi_line_text_field]'] =
                    "Designed specifically for Meibomian Gland Dysfunction (MGD). The Moist Heat Mask liquefies inspissated meibum (hardened oil), and the Omega-3s improve the quality of future oil production. Essential maintenance for anyone with rapid tear evaporation.";
                row['Image Src'] = "https://eyecarecenteroc.com/products/bruder-hygienic-eyelid-care-kit.png";
                row['Image Position'] = "1";
            } else {
                // For others, leave blank (or maybe use a snippet if we had it)
                row['Metafield: custom.doctors_take [multi_line_text_field]'] = "";
            }

            return row;
        });

        await csvWriter.writeRecords(finalRecords);
        console.log(`Finalized ${finalRecords.length} records to ${OUTPUT_CSV}`);
    });
