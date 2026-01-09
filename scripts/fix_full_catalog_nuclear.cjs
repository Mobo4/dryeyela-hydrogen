const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');
const csv = require('csv-parser');

// FILES
const SOURCE_EXPORT = '/Users/alex/Downloads/products_export_1.csv';
const OUTPUT_CSV = 'nuclear_full_import.csv';

const records = [];

console.log(`Reading source: ${SOURCE_EXPORT}...`);

fs.createReadStream(SOURCE_EXPORT)
    .pipe(csv())
    .on('data', (row) => {
        // FORCE UPDATES ON EVERY ROW
        row['Status'] = 'active';
        row['Variant Inventory Qty'] = '10';
        row['Variant Inventory Policy'] = 'continue';
        row['Variant Inventory Tracker'] = 'shopify';
        row['Variant Fulfillment Service'] = 'manual';

        // Ensure SEO Fallback if missing
        if (!row['SEO Title']) row['SEO Title'] = row['Title'];
        if (!row['SEO Description']) row['SEO Description'] = (row['Body (HTML)'] || '').replace(/<[^>]*>?/gm, '').substring(0, 300);

        records.push(row);
    })
    .on('end', async () => {
        console.log(`Loaded ${records.length} original records.`);

        // APPEND CUSTOM BUNDLES
        const bundles = [
            {
                Handle: 'moderate-dry-eye-bundle-custom',
                Title: 'Moderate Dry Eye Essentials Bundle',
                'Body (HTML)': '<p>A dermatologist-tested and ophthalmologist-approved regimen for moderate dry eye relief.</p><ul><li><strong>Lid Hygiene:</strong> Optase Tea Tree Oil Gel</li><li><strong>Hydration:</strong> Optase Dry Eye Intense (PF) Drops</li><li><strong>Therapy:</strong> Bruder Moist Heat Eye Compress</li><li><strong>Nutrition:</strong> PRN De3 Omega-3 (90ct)</li></ul><p><strong>Save 15%</strong> when purchasing this comprehensive care kit.</p>',
                Vendor: 'Eye Care Center OC',
                Type: 'Bundle',
                Tags: 'Bundle, Kit',
                Published: 'TRUE',
                'Option1 Name': 'Title',
                'Option1 Value': 'Default Title',
                'Variant SKU': 'ECOC-BUNDLE-MOD',
                'Variant Price': '149.95',
                'Variant Requires Shipping': 'TRUE',
                'Variant Taxable': 'TRUE',
                'Image Src': '', // Empty to avoid 404, user uploads manually
                'Image Position': '1',
                'Gift Card': 'FALSE',
                'SEO Title': 'Moderate Dry Eye Essentials Bundle',
                'Status': 'active',
                'Variant Inventory Policy': 'continue',
                'Variant Inventory Qty': '10',
                'Variant Inventory Tracker': 'shopify',
                'Variant Fulfillment Service': 'manual',
                'Metafield: custom.doctors_take [multi_line_text_field]': "Dermatologist-tested and ophthalmologist-approved. This regimen targets the root causes of moderate dry eye: inflammation and tear evaporation. The Tea Tree Oil Gel addresses blepharitis, while the Preservative-Free drops ensure safe, long-term hydration without toxicity."
            },
            {
                Handle: 'severe-dry-eye-strategy-kit-custom',
                Title: 'Severe Dry Eye Strategy Kit',
                'Body (HTML)': '<p>Maximum strength relief for severe dry eye symptoms.</p>',
                Vendor: 'Eye Care Center OC',
                Type: 'Bundle',
                Tags: 'Bundle, Kit',
                Published: 'TRUE',
                'Option1 Name': 'Title',
                'Option1 Value': 'Default Title',
                'Variant SKU': 'ECOC-BUNDLE-Sev',
                'Variant Price': '199.95',
                'Variant Requires Shipping': 'TRUE',
                'Variant Taxable': 'TRUE',
                'Image Src': '',
                'Image Position': '1',
                'Gift Card': 'FALSE',
                'SEO Title': 'Severe Dry Eye Strategy Kit',
                'Status': 'active',
                'Variant Inventory Policy': 'continue',
                'Variant Inventory Qty': '10',
                'Variant Inventory Tracker': 'shopify',
                'Variant Fulfillment Service': 'manual',
                'Metafield: custom.doctors_take [multi_line_text_field]': "A maximum strength protocol for severe cases. Hypochlorous acid (Avenova) is critical for neutralizing bacterial load on the eyelids, while the night-time ointment provides a physical barrier against desiccation during sleep when tear production stops."
            },
            {
                Handle: 'mgd-defense-kit-custom',
                Title: 'MGD Defense Kit',
                'Body (HTML)': '<p>Targeted therapy for Meibomian Gland Dysfunction.</p>',
                Vendor: 'Eye Care Center OC',
                Type: 'Bundle',
                Tags: 'Bundle, Kit',
                Published: 'TRUE',
                'Option1 Name': 'Title',
                'Option1 Value': 'Default Title',
                'Variant SKU': 'ECOC-BUNDLE-MGD',
                'Variant Price': '129.95',
                'Variant Requires Shipping': 'TRUE',
                'Variant Taxable': 'TRUE',
                'Image Src': '',
                'Image Position': '1',
                'Gift Card': 'FALSE',
                'SEO Title': 'MGD Defense Kit',
                'Status': 'active',
                'Variant Inventory Policy': 'continue',
                'Variant Inventory Qty': '10',
                'Variant Inventory Tracker': 'shopify',
                'Variant Fulfillment Service': 'manual',
                'Metafield: custom.doctors_take [multi_line_text_field]': "Designed specifically for Meibomian Gland Dysfunction (MGD). The Moist Heat Mask liquefies inspissated meibum (hardened oil), and the Omega-3s improve the quality of future oil production. Essential maintenance for anyone with rapid tear evaporation."
            }
        ];

        records.push(...bundles);

        // HEADERS:
        // We need all headers from the source + the new ones.
        // Let's grab headers from the first record, plus ensure our new fields are there.
        let headerSet = new Set(Object.keys(records[0]));
        // Add keys from bundles (like Metafield) if not present
        Object.keys(bundles[0]).forEach(k => headerSet.add(k));

        const headers = Array.from(headerSet).map(id => ({ id, title: id }));

        const csvWriter = createObjectCsvWriter({
            path: OUTPUT_CSV,
            header: headers
        });

        await csvWriter.writeRecords(records);
        console.log(`NUCLEAR FIX COMPLETE. Wrote ${records.length} records to ${OUTPUT_CSV}`);
    });
