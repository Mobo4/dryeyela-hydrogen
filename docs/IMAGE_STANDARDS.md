# Image Standards & Guidelines

**Date:** February 2026

## Professional Product Photography Standards

All product images used on the DryEyeLA storefront must adhere to these professional studio photography standards:

### 1. Lighting Requirements
- **Dramatic but clear professional product studio lighting**
- Use soft, diffused lighting that highlights product details
- Avoid harsh shadows or overexposed areas
- Ensure even illumination across the product
- Use professional studio lighting equipment (softboxes, reflectors)

### 2. Background Requirements
- **Clean grey background** - Standard color: `#F5F5F5` (Light Grey)
- Consistent background color across all product images
- No patterns, textures, or distractions in background
- Seamless, professional appearance
- Background should be neutral and not compete with product

### 3. Image Quality Requirements
- **High resolution**: Minimum 2000px width for product images
- **Sharp textures**: Images must be crisp and clear
- **Proper focus**: Product should be in sharp focus throughout
- **Color accuracy**: Accurate color representation of products
- **File format**: Use high-quality JPEG or WebP (optimized but not overly compressed)

### 4. Composition Requirements
- Product centered in frame
- Adequate padding/whitespace around product
- Consistent aspect ratios (4:5 for product cards, square for galleries)
- Product should fill 60-70% of image frame
- No text overlays on product images (text added via CSS/HTML)

### 5. Technical Specifications

#### Shopify Image Uploads
- **Minimum dimensions**: 2000 x 2000 pixels
- **Recommended dimensions**: 3000 x 3000 pixels (for zoom functionality)
- **Aspect ratio**: 1:1 (square) or 4:5 (portrait)
- **File size**: Optimized but maintain quality (under 2MB per image)
- **Color space**: sRGB
- **DPI**: 72 DPI (web standard)

#### Image Naming Convention
```
{product-handle}-{variant-sku}-{image-number}.jpg
Example: de3-omega-60ct-1.jpg
```

### 6. Image Processing Guidelines

#### Before Upload to Shopify
1. **Background Removal/Replacement**
   - Remove existing backgrounds
   - Replace with clean grey (#F5F5F5)
   - Ensure seamless edges

2. **Color Correction**
   - Adjust white balance
   - Ensure accurate color representation
   - Match product colors to real-life appearance

3. **Sharpening**
   - Apply subtle sharpening to enhance texture detail
   - Avoid over-sharpening (no halos or artifacts)
   - Focus on product details, not background

4. **Optimization**
   - Compress for web while maintaining quality
   - Use progressive JPEG or WebP format
   - Test image quality at various sizes

### 7. Implementation in Code

All product images are automatically styled with:
- **Grey background**: `bg-[#F5F5F5]` applied via CSS
- **Object-contain**: Ensures product fits within frame without cropping
- **High-quality rendering**: CSS properties for crisp image display
- **Responsive sizing**: Images scale appropriately on all devices

### 8. Components Using Image Standards

- `ProductCard` - Product grid/list views
- `ProductGallery` - Product detail page galleries
- `ProductImage` - Reusable product image component
- `ProductImageCard` - Product image with card styling
- `Cart` - Cart item images
- `OrderCard` - Order history images
- `SearchAutocomplete` - Search result images

### 9. Shopify Admin Image Upload Checklist

When uploading images to Shopify:

- [ ] Image is high resolution (2000px+ width)
- [ ] Background is clean grey (#F5F5F5)
- [ ] Product is well-lit with professional studio lighting
- [ ] Product is sharp and in focus
- [ ] Colors are accurate
- [ ] Image is properly optimized (under 2MB)
- [ ] Alt text is descriptive and includes product name
- [ ] Image follows naming convention

### 10. Image Audit Process

#### Regular Audits
- Review all product images quarterly
- Check for consistency in background color
- Verify image quality and sharpness
- Ensure all images meet minimum resolution requirements
- Test images on various devices and screen sizes

#### Tools for Image Processing
- **Adobe Photoshop**: Professional image editing
- **GIMP**: Free alternative for image editing
- **Remove.bg**: Background removal service
- **TinyPNG**: Image optimization
- **Squoosh**: Google's image optimization tool

### 11. Common Issues & Solutions

#### Issue: Inconsistent Background Colors
**Solution**: Use image processing software to replace backgrounds with #F5F5F5

#### Issue: Low Resolution Images
**Solution**: Request high-resolution originals from vendors or re-shoot products

#### Issue: Poor Lighting
**Solution**: Use professional studio lighting setup or hire professional photographer

#### Issue: Blurry Images
**Solution**: Ensure proper focus during photography, apply subtle sharpening in post-processing

#### Issue: Large File Sizes
**Solution**: Optimize images using compression tools while maintaining quality

### 12. Vendor/Supplier Guidelines

When requesting product images from vendors:

1. **Specify Requirements**
   - Clean grey background (#F5F5F5)
   - High resolution (2000px+ width)
   - Professional studio lighting
   - Sharp, in-focus images

2. **Provide Examples**
   - Share examples of preferred image style
   - Show background color specification
   - Demonstrate desired lighting quality

3. **Quality Control**
   - Review all vendor-provided images
   - Process images to meet standards if needed
   - Request replacements for substandard images

### 13. CSS Implementation

The following CSS ensures consistent image display:

```css
/* Product images use clean grey background */
.product-image-container {
  background-color: #F5F5F5;
}

/* Ensure sharp rendering */
.product-image {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  object-fit: contain;
}
```

### 14. Future Enhancements

- [ ] Automated image quality checking
- [ ] Background color validation script
- [ ] Image optimization pipeline
- [ ] CDN integration for faster loading
- [ ] Lazy loading for improved performance
- [ ] Image zoom functionality on product pages

## Summary

All product images must:
- ✅ Use dramatic but clear professional studio lighting
- ✅ Have clean grey background (#F5F5F5)
- ✅ Be high resolution (2000px+ width)
- ✅ Display sharp textures and details
- ✅ Maintain original quality (no over-compression)
- ✅ Follow consistent composition standards

These standards ensure a professional, cohesive appearance across the entire storefront and build trust with customers.
