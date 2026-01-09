
const fs = require('fs');
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');
const sharp = require('sharp');
const https = require('https');

const MISSING_URLS = [
    "https://dryeyerescue.com/products/eyeeco-stye-kit-xl",
    "https://dryeyerescue.com/products/dry-eye-relief-starter-kit-6-pack",
    "https://dryeyerescue.com/products/styedefense%E2%84%A2-daily-eyelid-hygiene-stye-prevention-starter-kit-4-items",
    "https://dryeyerescue.com/products/eyegiene%C2%AE-starter-system-1-mask-10-pairs-of-warming-wafers-eis-a12"
];

const OUTPUT_IMG_DIR = '/Users/alex/Documents/Projects/dryeyela-hydrogen/public/products_processed';
const OUTPUT_CSV = '/Users/alex/Documents/Projects/dryeyela-hydrogen/processed_catalog.csv';

// Helper to fetch HTML
function fetchHtml(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

// Helper to download image
function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(path.join(OUTPUT_IMG_DIR, filename));
        https.get(url, (res) => {
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filename, () => { });
            reject(err);
        });
    });
}

async function processImage(filename) {
    const inputPath = path.join(OUTPUT_IMG_DIR, filename);
    const tempPath = path.join(OUTPUT_IMG_DIR, `temp_${filename}`);

    try {
        fs.renameSync(inputPath, tempPath); // Rename original to temp

        await sharp(tempPath)
            .resize(1000, 1000, {
                fit: 'contain',
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            })
            .flatten({ background: { r: 255, g: 255, b: 255 } })
            .toFile(inputPath); // Write back to original name

        fs.unlinkSync(tempPath); // Delete temp
        return filename;
    } catch (err) {
        console.error(`Error processing image ${filename}:`, err);
        return null; // Keep original if fail
    }
}

async function scrapeProduct(url) {
    console.log(`Scraping: ${url}`);
    const html = await fetchHtml(url);

    // Simple Regex Parsing (Robust enough for Shopify themes generally)
    const titleMatch = html.match(/<meta property="og:title" content="(.*?)"/);
    const descMatch = html.match(/<meta property="og:description" content="(.*?)"/);
    const imageMatch = html.match(/<meta property="og:image" content="(.*?)"/);
    const priceMatch = html.match(/<meta property="og:price:amount" content="(.*?)"/);
    const currencyMatch = html.match(/<meta property="og:price:currency" content="(.*?)"/);

    // JSON-LD fallback for Vendor/Type
    let vendor = "Dry Eye Rescue";
    let type = "Kit";

    try {
        // Try to find JSON-LD
        // This is a rough heuristic
    } catch (e) { }

    const title = titleMatch ? titleMatch[1] : "Product";
    const body = descMatch ? descMatch[1] : "";
    const imageSrc = imageMatch ? imageMatch[1] : "";
    const price = priceMatch ? priceMatch[1] : "0.00";

    // Generate Handle
    const handle = url.split('/').pop().split('?')[0];
    const filename = `${handle}.jpg`; // Assume JPG from Shopify usually

    // Download & Process Image
    if (imageSrc) {
        try {
            await downloadImage(imageSrc, filename);
            await processImage(filename);
        } catch (e) {
            console.error("Failed to download image", e);
        }
    }

    return {
        Handle: handle,
        Title: title.replace("&amp;", "&"),
        "Body (HTML)": body,
        Vendor: vendor,
        Type: "Kit",
        Tags: "Kit, Bundle, Starter Kit, Subscription Eligible",
        Published: "TRUE",
        "Option1 Name": "Title",
        "Option1 Value": "Default Title",
        "Variant SKU": "",
        "Variant Price": price,
        "Variant Requires Shipping": "TRUE",
        "Variant Taxable": "TRUE",
        "Image Src": imageSrc, // Keep remote URL for CSV, but we have local file too
        "Image Position": 1,
        "Image Alt Text": title,
        "Gift Card": "FALSE",
        "SEO Title": title,
        "SEO Description": body
    };
}

(async () => {
    const newRecords = [];
    for (const url of MISSING_URLS) {
        try {
            const product = await scrapeProduct(url);
            newRecords.push(product);
        } catch (e) {
            console.error(`Failed to scrape ${url}`, e);
        }
    }

    // Append to CSV
    // We read existing headers to match structure
    const headers = [
        { id: 'Handle', title: 'Handle' },
        { id: 'Title', title: 'Title' },
        { id: 'Body (HTML)', title: 'Body (HTML)' },
        { id: 'Vendor', title: 'Vendor' },
        { id: 'Type', title: 'Type' },
        { id: 'Tags', title: 'Tags' },
        { id: 'Published', title: 'Published' },
        { id: 'Option1 Name', title: 'Option1 Name' },
        { id: 'Option1 Value', title: 'Option1 Value' },
        { id: 'Variant SKU', title: 'Variant SKU' },
        { id: 'Variant Price', title: 'Variant Price' },
        { id: 'Variant Requires Shipping', title: 'Variant Requires Shipping' },
        { id: 'Variant Taxable', title: 'Variant Taxable' },
        { id: 'Image Src', title: 'Image Src' },
        { id: 'Image Position', title: 'Image Position' },
        { id: 'Image Alt Text', title: 'Image Alt Text' },
        { id: 'Gift Card', title: 'Gift Card' },
        { id: 'SEO Title', title: 'SEO Title' },
        { id: 'SEO Description', title: 'SEO Description' }
    ];

    const csvWriter = createObjectCsvWriter({
        path: OUTPUT_CSV,
        header: headers,
        append: true
    });

    await csvWriter.writeRecords(newRecords);
    console.log(`Appended ${newRecords.length} new kits to ${OUTPUT_CSV}`);
})();
