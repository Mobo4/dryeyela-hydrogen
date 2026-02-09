# Fix All Pages PRD - DryEyeLA Hydrogen Store

## Problem Statement
Multiple pages have broken links, missing routes, incorrect images, and missing data loaders. The store needs all pages functional with proper images before deployment.

## Acceptance Criteria
- [ ] All navigation links resolve to working pages
- [ ] All collection pages show products with real images
- [ ] All brand pages load products from Shopify or local fallback
- [ ] All symptom pages show relevant products
- [ ] All ingredient pages show relevant products
- [ ] Ingredient index links go to `/ingredients/` not `/collections/`
- [ ] Missing routes created: treatment-guide, dry-eye-quiz
- [ ] Dead links removed or fixed (blogs/news)
- [ ] Product images load from eyecarecenteroc.com CDN
- [ ] Logo displays on all pages
- [ ] Navigation dropdown closes on click
- [ ] Build passes with 0 TypeScript errors

## Task Breakdown

### Team Alpha: Fix Broken Routes & Links
1. Fix ingredient index links (`/collections/` → `/ingredients/`)
2. Create treatment-guide page route
3. Create dry-eye-quiz page route
4. Fix/remove blogs/news dead link in learn page
5. Add loader to EyePromise page
6. Add loader to Learn page

### Team Beta: Fix Images & Logo
7. Verify all eyecarecenteroc.com image URLs return HTTP 200
8. Replace any broken image URLs with working alternatives
9. Fix logo display on inner pages (check UnifiedHeader)
10. Ensure PRN products have working images from prn-products.ts

### Team Gamma: Verify All Pages Work
11. Verify all 6 collection category pages render products
12. Verify all 17 brand pages render (3 custom + 14 dynamic)
13. Verify all 6 symptom pages render products
14. Verify all 5 ingredient pages render products
15. Run full build and fix any remaining TypeScript errors

## Dependencies
- Old website at /Users/alex/Documents/Projects/dryeye_website for reference
- Product images from eyecarecenteroc.com CDN
- Shopify Storefront API (eyecarecenter.myshopify.com)
