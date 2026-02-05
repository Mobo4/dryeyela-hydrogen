#!/usr/bin/env node
/**
 * Product Image Mapper for DryEyeLA
 * Maps local images to Shopify product handles
 */

const fs = require('fs');
const path = require('path');

const PRODUCTS_DIR = path.join(__dirname, '../public/products');
const OUTPUT_CSV = path.join(__dirname, '../complete_image_mapping.csv');
const GITHUB_BASE = 'https://raw.githubusercontent.com/Mobo4/dryeyela-hydrogen/main/public/products';

// Get all image files
const imageFiles = fs.readdirSync(PRODUCTS_DIR).filter(f =>
  f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.webp')
);

console.log(`Found ${imageFiles.length} images in public/products/`);

// Create handle from filename (remove extension)
function fileToHandle(filename) {
  return filename
    .replace(/\.(png|jpg|webp)$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Generate CSV
const csvLines = ['Handle,Image Src'];

imageFiles.forEach(file => {
  const handle = fileToHandle(file);
  const imageUrl = `${GITHUB_BASE}/${encodeURIComponent(file)}`;
  csvLines.push(`${handle},${imageUrl}`);
});

fs.writeFileSync(OUTPUT_CSV, csvLines.join('\n'));
console.log(`\nGenerated: ${OUTPUT_CSV}`);
console.log(`Total mappings: ${imageFiles.length}`);

// Also create a summary report
const report = {
  totalImages: imageFiles.length,
  extensions: {
    png: imageFiles.filter(f => f.endsWith('.png')).length,
    jpg: imageFiles.filter(f => f.endsWith('.jpg')).length,
    webp: imageFiles.filter(f => f.endsWith('.webp')).length,
  },
  sampleMappings: csvLines.slice(1, 11),
};

console.log('\n=== Image Report ===');
console.log(`PNG: ${report.extensions.png}`);
console.log(`JPG: ${report.extensions.jpg}`);
console.log(`WEBP: ${report.extensions.webp}`);
console.log('\nSample mappings:');
report.sampleMappings.forEach(m => console.log(`  ${m}`));

// Write report JSON
fs.writeFileSync(
  path.join(__dirname, '../image_mapping_report.json'),
  JSON.stringify(report, null, 2)
);
console.log('\nReport saved to: image_mapping_report.json');
