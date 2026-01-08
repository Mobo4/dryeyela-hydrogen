#!/usr/bin/env node
/**
 * Product Extraction Script for DryEyeLA
 * Extracts product data from dryeyerescue.com backup HTML files
 * Generates Shopify-compatible CSV for import
 */

const fs = require('fs');
const path = require('path');

const BACKUP_PATH = '/Volumes/SharedDrive/website inspiration info/dryeyerescue.com';
const PRODUCTS_PATH = path.join(BACKUP_PATH, 'products');
const OUTPUT_PATH = path.join(__dirname, '..', 'data');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_PATH)) {
  fs.mkdirSync(OUTPUT_PATH, { recursive: true });
}

/**
 * Extract data from HTML content using regex patterns
 */
function extractFromHTML(html, filename) {
  const product = {
    handle: filename.replace('.oembed', ''),
    title: '',
    description: '',
    price: '',
    compareAtPrice: '',
    vendor: '',
    productType: '',
    tags: [],
    images: [],
    seoTitle: '',
    seoDescription: '',
  };

  // Extract title from <title> tag or og:title
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  if (titleMatch) {
    product.title = titleMatch[1].replace(/\s*[-|].*$/, '').trim();
  }

  // Extract from og:title (often cleaner)
  const ogTitleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i);
  if (ogTitleMatch) {
    product.title = ogTitleMatch[1].trim();
  }

  // Extract price from product:price:amount
  const priceMatch = html.match(/<meta\s+property="product:price:amount"\s+content="([^"]+)"/i);
  if (priceMatch) {
    product.price = priceMatch[1];
  }

  // Extract description from meta description
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
  if (descMatch) {
    product.seoDescription = descMatch[1].trim();
    product.description = descMatch[1].trim();
  }

  // Extract og:description (often more detailed)
  const ogDescMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i);
  if (ogDescMatch) {
    product.description = ogDescMatch[1].trim();
  }

  // Extract images from og:image
  const imageMatches = html.matchAll(/<meta\s+property="og:image(?::secure_url)?"\s+content="([^"]+)"/gi);
  for (const match of imageMatches) {
    const imageUrl = match[1].trim();
    if (imageUrl && !product.images.includes(imageUrl)) {
      product.images.push(imageUrl);
    }
  }

  // Extract vendor/brand from common patterns
  const vendorPatterns = [
    /PRN|Optase|Oasis|MacuHealth|Bruder|Avenova|Bausch|Systane|Refresh|Retaine|Blephadex|Biotrue|Alaway|Acuvue|Menicon|Tangible|Heyedrate|Ocusoft|TheraTears|Lumify/gi
  ];

  for (const pattern of vendorPatterns) {
    const vendorMatch = product.title.match(pattern);
    if (vendorMatch) {
      product.vendor = vendorMatch[0];
      break;
    }
  }

  // Determine product type from title/description
  const typePatterns = {
    'Eye Drops': /eye\s*drops?|lubricant|artificial\s*tears/i,
    'Supplements': /omega|vitamin|supplement|softgel|capsule/i,
    'Eyelid Cleanser': /eyelid\s*(cleanser|wipes?|foam|spray)|blephadex|ocusoft/i,
    'Eye Mask': /eye\s*mask|compress|warm|heat/i,
    'Contact Lens Solution': /contact\s*lens|saline|solution|scleral/i,
    'Allergy Relief': /allergy|antihistamine|alaway/i,
  };

  for (const [type, pattern] of Object.entries(typePatterns)) {
    if (pattern.test(product.title) || pattern.test(product.description)) {
      product.productType = type;
      break;
    }
  }

  // Generate tags from content
  const tagPatterns = [
    'preservative free', 'dry eye', 'omega-3', 'omega 3',
    'scleral lens', 'meibomian', 'blepharitis', 'MGD',
    'lubricant', 'artificial tears', 'tea tree', 'manuka honey',
    'hypochlorous', 'hyaluronic acid'
  ];

  const fullText = (product.title + ' ' + product.description).toLowerCase();
  for (const tag of tagPatterns) {
    if (fullText.includes(tag.toLowerCase())) {
      product.tags.push(tag);
    }
  }

  product.seoTitle = product.title;

  return product;
}

/**
 * Generate Shopify CSV format
 */
function generateShopifyCSV(products) {
  const headers = [
    'Handle', 'Title', 'Body (HTML)', 'Vendor', 'Product Category', 'Type', 'Tags',
    'Published', 'Option1 Name', 'Option1 Value', 'Variant SKU', 'Variant Grams',
    'Variant Inventory Tracker', 'Variant Inventory Qty', 'Variant Inventory Policy',
    'Variant Fulfillment Service', 'Variant Price', 'Variant Compare At Price',
    'Variant Requires Shipping', 'Variant Taxable', 'Variant Barcode',
    'Image Src', 'Image Position', 'Image Alt Text', 'SEO Title', 'SEO Description',
    'Status'
  ];

  const rows = [headers.join(',')];

  for (const product of products) {
    const row = [
      escapeCSV(product.handle),
      escapeCSV(product.title),
      escapeCSV(`<p>${product.description}</p>`),
      escapeCSV(product.vendor),
      '', // Product Category
      escapeCSV(product.productType),
      escapeCSV(product.tags.join(', ')),
      'true', // Published
      'Title', // Option1 Name
      'Default Title', // Option1 Value
      '', // SKU
      '0', // Grams
      'shopify', // Inventory Tracker
      '100', // Inventory Qty
      'deny', // Inventory Policy
      'manual', // Fulfillment Service
      product.price || '0.00', // Price
      product.compareAtPrice || '', // Compare At Price
      'true', // Requires Shipping
      'true', // Taxable
      '', // Barcode
      escapeCSV(product.images[0] || ''), // Image Src
      '1', // Image Position
      escapeCSV(product.title), // Image Alt Text
      escapeCSV(product.seoTitle), // SEO Title
      escapeCSV(product.seoDescription), // SEO Description
      'active' // Status
    ];

    rows.push(row.join(','));

    // Add additional images as separate rows
    for (let i = 1; i < product.images.length; i++) {
      const imageRow = [
        escapeCSV(product.handle),
        '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
        escapeCSV(product.images[i]),
        String(i + 1),
        escapeCSV(product.title),
        '', '', ''
      ];
      rows.push(imageRow.join(','));
    }
  }

  return rows.join('\n');
}

/**
 * Escape CSV field
 */
function escapeCSV(field) {
  if (!field) return '';
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Generate JSON export for additional processing
 */
function generateJSON(products) {
  return JSON.stringify(products, null, 2);
}

/**
 * Main extraction function
 */
async function extractProducts() {
  console.log('🔍 Starting product extraction from dryeyerescue.com backup...\n');

  if (!fs.existsSync(PRODUCTS_PATH)) {
    console.error('❌ Products directory not found:', PRODUCTS_PATH);
    console.log('   Make sure the SharedDrive is mounted.');
    process.exit(1);
  }

  const files = fs.readdirSync(PRODUCTS_PATH);
  const htmlFiles = files.filter(f => !f.endsWith('.oembed') && !f.startsWith('.'));

  console.log(`📦 Found ${htmlFiles.length} product files to process\n`);

  const products = [];
  let processed = 0;
  let errors = 0;

  for (const file of htmlFiles) {
    try {
      const filePath = path.join(PRODUCTS_PATH, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) continue;

      const html = fs.readFileSync(filePath, 'utf-8');
      const product = extractFromHTML(html, file);

      if (product.title && product.title.length > 0) {
        products.push(product);
        processed++;

        if (processed % 50 === 0) {
          console.log(`   Processed ${processed}/${htmlFiles.length} products...`);
        }
      }
    } catch (err) {
      errors++;
      // Silent fail for individual files
    }
  }

  console.log(`\n✅ Successfully extracted ${products.length} products`);
  if (errors > 0) {
    console.log(`⚠️  ${errors} files had errors (skipped)`);
  }

  // Generate CSV
  const csvContent = generateShopifyCSV(products);
  const csvPath = path.join(OUTPUT_PATH, 'shopify-products-import.csv');
  fs.writeFileSync(csvPath, csvContent);
  console.log(`\n📄 CSV saved to: ${csvPath}`);

  // Generate JSON
  const jsonContent = generateJSON(products);
  const jsonPath = path.join(OUTPUT_PATH, 'products.json');
  fs.writeFileSync(jsonPath, jsonContent);
  console.log(`📄 JSON saved to: ${jsonPath}`);

  // Generate summary
  const summary = {
    totalProducts: products.length,
    byVendor: {},
    byType: {},
    withImages: products.filter(p => p.images.length > 0).length,
    withPrices: products.filter(p => p.price).length,
  };

  for (const product of products) {
    const vendor = product.vendor || 'Unknown';
    const type = product.productType || 'Uncategorized';
    summary.byVendor[vendor] = (summary.byVendor[vendor] || 0) + 1;
    summary.byType[type] = (summary.byType[type] || 0) + 1;
  }

  console.log('\n📊 Product Summary:');
  console.log(`   Total: ${summary.totalProducts}`);
  console.log(`   With Images: ${summary.withImages}`);
  console.log(`   With Prices: ${summary.withPrices}`);
  console.log('\n   By Vendor:');
  Object.entries(summary.byVendor)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([vendor, count]) => {
      console.log(`     ${vendor}: ${count}`);
    });

  console.log('\n   By Type:');
  Object.entries(summary.byType)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      console.log(`     ${type}: ${count}`);
    });

  const summaryPath = path.join(OUTPUT_PATH, 'extraction-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`\n📄 Summary saved to: ${summaryPath}`);

  console.log('\n🎉 Extraction complete!');
  console.log('\nNext steps:');
  console.log('1. Review the CSV at: data/shopify-products-import.csv');
  console.log('2. Import to Shopify Admin → Products → Import');
  console.log('3. Or use Shopify CLI: shopify product import');
}

// Run extraction
extractProducts().catch(console.error);
