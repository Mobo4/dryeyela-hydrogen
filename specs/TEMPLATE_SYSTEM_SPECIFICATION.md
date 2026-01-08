# DryEyeLA Hydrogen Template System Specification

## Executive Summary

### Objective
Create a comprehensive template-driven component system for DryEyeLA Shopify Hydrogen storefront that ensures visual consistency, brand cohesion, and maintainability across all page types while resolving collection 404 issues through graceful fallback handling.

### Scope
- **Included**: PageTemplate wrapper, reusable section components, template-driven pages, navigation link fixes, collection fallback handling
- **Excluded**: Shopify Admin collection creation (documented as prerequisite), checkout customization, payment processing

### Success Criteria
1. All pages use consistent Besilos color scheme (Navy #2C3E50, Cream #F9F9F7, Sage #A8BCA1)
2. ShippingBanner displays on all pages
3. Collection pages gracefully handle 404s with placeholder content
4. Component reuse rate > 80% across all page templates
5. No broken navigation links (all point to valid routes)
6. Mobile-first responsive design with 95+ Lighthouse score

### Timeline Estimate
- **Phase 1 (Foundation)**: 2-3 days - Core components and PageTemplate
- **Phase 2 (Templates)**: 3-4 days - Page templates and route updates
- **Phase 3 (Polish)**: 1-2 days - Testing, optimization, documentation

---

## 1. Requirements Analysis

### 1.1 PageTemplate Wrapper Component
**As a** site visitor
**I want** consistent header, footer, and promotional banners on every page
**So that** I have a cohesive brand experience throughout my shopping journey

**Acceptance Criteria:**
- WHEN any page loads THEN ShippingBanner displays at the top (above header)
- WHEN navigating between pages THEN header/footer remain visually consistent
- WHEN viewing on mobile THEN layout adapts responsively
- WHEN ShippingBanner is conditionally hidden (e.g., checkout) THEN prop allows override

### 1.2 HeroSection Component
**As a** content manager
**I want** configurable hero sections for landing pages
**So that** I can create compelling entry points for different product categories

**Acceptance Criteria:**
- WHEN rendering hero THEN title, subtitle, background color/image are configurable
- WHEN background is dark THEN text automatically uses light colors
- WHEN CTA buttons are provided THEN they render with proper styling
- WHEN breadcrumb is provided THEN it displays above the title
- WHEN on mobile THEN hero height adjusts appropriately

### 1.3 ProductGrid Component
**As a** shopper
**I want** to browse products in a consistent grid layout
**So that** I can easily compare and find products

**Acceptance Criteria:**
- WHEN products are available THEN display in responsive grid (1-4 columns)
- WHEN no products are found THEN display empty state with helpful messaging
- WHEN loading THEN display skeleton placeholders
- WHEN filtering/sorting THEN grid updates without full page reload
- WHEN quick-add is enabled THEN show add-to-cart button on hover

### 1.4 TrustBadges Section
**As a** first-time visitor
**I want** to see trust indicators throughout the site
**So that** I feel confident making a purchase

**Acceptance Criteria:**
- WHEN displayed THEN show: Doctor Recommended, Free Shipping, Easy Returns, Secure Checkout
- WHEN variant is "compact" THEN show inline horizontal layout
- WHEN variant is "expanded" THEN show grid with icons and descriptions

### 1.5 CTASection Component
**As a** site owner
**I want** reusable call-to-action sections
**So that** I can drive conversions consistently across pages

**Acceptance Criteria:**
- WHEN rendering THEN support configurable heading, description, and button(s)
- WHEN variant is "centered" THEN content centers with max-width
- WHEN variant is "split" THEN content displays in two columns
- WHEN background is "navy" THEN use dark theme styling

### 1.6 CategoryCards Component
**As a** shopper
**I want** visual category navigation cards
**So that** I can quickly find products by category, symptom, or brand

**Acceptance Criteria:**
- WHEN items provided THEN display as clickable cards with title/description
- WHEN layout is "grid" THEN display in responsive grid
- WHEN layout is "carousel" THEN display horizontal scrollable
- WHEN image is provided THEN display as card background
- WHEN count is provided THEN display product count badge

### 1.7 Collection 404 Graceful Handling
**As a** visitor clicking a collection link
**I want** a helpful page even if the collection doesn't exist yet
**So that** I don't encounter a dead end

**Acceptance Criteria:**
- WHEN collection returns 404 THEN display "Coming Soon" template instead
- WHEN collection is empty THEN display helpful messaging with alternatives
- WHEN on placeholder page THEN show related/recommended collections
- WHEN error occurs THEN log for monitoring but don't break user experience

---

## 2. Technical Architecture

### 2.1 Component Hierarchy

```
app/
├── components/
│   ├── templates/                    # NEW: Template components
│   │   ├── PageTemplate.tsx          # Main wrapper with banner/header/footer
│   │   ├── CollectionTemplate.tsx    # Collection page template
│   │   ├── ProductTemplate.tsx       # Product detail template
│   │   ├── LandingTemplate.tsx       # Brand/Symptom/Ingredient template
│   │   └── index.ts                  # Barrel export
│   │
│   ├── sections/                     # NEW: Reusable section components
│   │   ├── HeroSection.tsx           # Configurable hero
│   │   ├── ProductGrid.tsx           # Products grid with loading states
│   │   ├── TrustBadgesSection.tsx    # Trust indicators (refactored)
│   │   ├── CTASection.tsx            # Call-to-action blocks
│   │   ├── CategoryCards.tsx         # Navigation cards
│   │   ├── FeaturedSection.tsx       # Featured content section
│   │   ├── EmptyState.tsx            # No content/404 handling
│   │   └── index.ts                  # Barrel export
│   │
│   ├── DryEyeHero.tsx               # EXISTING: Keep for homepage only
│   ├── PageLayout.tsx               # EXISTING: Contains header/footer logic
│   └── ... (other existing components)
│
├── data/
│   ├── navigation.ts                # EXISTING: Categories, brands, symptoms
│   └── collections.ts               # NEW: Collection metadata/fallbacks
│
├── routes/
│   ├── ($locale)._index.tsx         # Homepage - uses PageTemplate
│   ├── ($locale).collections.$collectionHandle.tsx  # Updated with template
│   ├── ($locale).brands.$brandHandle.tsx            # Updated with template
│   ├── ($locale).symptoms.$symptomHandle.tsx        # Updated with template
│   └── ($locale).ingredients.$ingredientHandle.tsx  # Updated with template
│
└── styles/
    └── templates.css                # NEW: Template-specific styles (if needed)
```

### 2.2 Color System (Besilos Palette)

```typescript
// Already defined in tailwind.config.js
const besilosColors = {
  cream: '#F9F9F7',    // Background, light sections
  navy: '#2C3E50',     // Headers, dark sections, text
  sage: '#A8BCA1',     // Accents, buttons, links
  clay: '#D4A373',     // Secondary accent (rarely used)
  white: '#FFFFFF',    // Pure white for contrast
};

// Usage patterns:
// - Page backgrounds: besilos-cream
// - Hero sections: besilos-navy with besilos-cream text
// - Primary buttons: besilos-sage with white text
// - Secondary buttons: transparent with besilos-sage border
// - Links: besilos-sage
// - Body text on light: besilos-navy
// - Body text on dark: besilos-cream
```

### 2.3 Component Props Interfaces

```typescript
// PageTemplate Props
interface PageTemplateProps {
  children: React.ReactNode;
  showShippingBanner?: boolean;  // default: true
  className?: string;
}

// HeroSection Props
interface HeroSectionProps {
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; href: string };
  backgroundVariant?: 'navy' | 'cream' | 'sage' | 'image';
  backgroundImage?: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  badge?: string;  // e.g., "Los Angeles Premier Dry Eye Store"
  size?: 'small' | 'medium' | 'large';
  align?: 'left' | 'center';
}

// ProductGrid Props
interface ProductGridProps {
  products: ProductCardFragment[];
  columns?: 2 | 3 | 4;
  loading?: boolean;
  emptyMessage?: string;
  quickAdd?: boolean;
  showFilters?: boolean;
  filters?: Filter[];
  appliedFilters?: AppliedFilter[];
}

// TrustBadgesSection Props
interface TrustBadgesSectionProps {
  variant?: 'compact' | 'expanded';
  background?: 'cream' | 'white' | 'transparent';
  badges?: ('doctor' | 'shipping' | 'returns' | 'secure')[];
}

// CTASection Props
interface CTASectionProps {
  heading: string;
  description?: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  variant?: 'centered' | 'split';
  background?: 'navy' | 'cream' | 'white';
}

// CategoryCards Props
interface CategoryCardsProps {
  items: Array<{
    title: string;
    description?: string;
    href: string;
    image?: string;
    count?: number;
    keywords?: string[];
  }>;
  layout?: 'grid' | 'carousel';
  columns?: 2 | 3 | 4;
  cardStyle?: 'elevated' | 'outlined' | 'filled';
}

// EmptyState Props
interface EmptyStateProps {
  title: string;
  description: string;
  action?: { label: string; href: string };
  suggestions?: Array<{ title: string; href: string }>;
  variant?: 'collection' | 'search' | 'error';
}
```

---

## 3. Implementation Plan

### Phase 1: Foundation Components [MEDIUM COMPLEXITY]

#### Task 1.1: Create PageTemplate Component
**Requirements**: 1.1
**Depends on**: none
**Complexity**: Medium

```
Location: app/components/templates/PageTemplate.tsx

Implementation:
1. Import ShippingBanner from DryEyeHero.tsx
2. Wrap children with shipping banner at top
3. Accept showShippingBanner prop (default true)
4. Keep header/footer in PageLayout.tsx (no duplication)
5. Export from templates/index.ts
```

**Rollback Procedure for 1.1:**
1. Delete app/components/templates/PageTemplate.tsx
2. Delete app/components/templates/index.ts
3. Revert any route changes that imported PageTemplate
4. Verify homepage and other pages still render

---

#### Task 1.2: Create HeroSection Component
**Requirements**: 1.2
**Depends on**: 1.1
**Complexity**: Medium

```
Location: app/components/sections/HeroSection.tsx

Implementation:
1. Build configurable hero with variant support
2. Support background color/image options
3. Include breadcrumb, badge, CTA slots
4. Responsive sizing (small/medium/large)
5. Auto text color based on background
```

**Rollback Procedure for 1.2:**
1. Delete app/components/sections/HeroSection.tsx
2. Revert any routes using HeroSection to previous hero implementation
3. Verify affected pages render correctly

---

#### Task 1.3: Create ProductGrid Component
**Requirements**: 1.3
**Depends on**: none
**Complexity**: Medium

```
Location: app/components/sections/ProductGrid.tsx

Implementation:
1. Extract grid logic from collection page
2. Add loading skeleton state
3. Add empty state handling
4. Support configurable columns
5. Support quickAdd toggle
6. Integrate with existing ProductCard component
```

**Rollback Procedure for 1.3:**
1. Delete app/components/sections/ProductGrid.tsx
2. Revert collection routes to inline grid implementation
3. Verify collection pages still display products

---

#### Task 1.4: Refactor TrustBadges as Section Component
**Requirements**: 1.4
**Depends on**: none
**Complexity**: Low

```
Location: app/components/sections/TrustBadgesSection.tsx

Implementation:
1. Copy existing TrustBadges from DryEyeHero.tsx
2. Add variant support (compact/expanded)
3. Add background configuration
4. Add badge selection array
5. Keep original in DryEyeHero for backward compatibility
```

**Rollback Procedure for 1.4:**
1. Delete app/components/sections/TrustBadgesSection.tsx
2. Continue using TrustBadges from DryEyeHero.tsx
3. No route changes needed

---

#### Task 1.5: Create CTASection Component
**Requirements**: 1.5
**Depends on**: none
**Complexity**: Low

```
Location: app/components/sections/CTASection.tsx

Implementation:
1. Build configurable CTA block
2. Support centered and split variants
3. Background color options
4. Primary/secondary button slots
5. Responsive text sizing
```

**Rollback Procedure for 1.5:**
1. Delete app/components/sections/CTASection.tsx
2. Revert any routes using CTASection to inline implementations
3. Verify affected pages render correctly

---

#### Task 1.6: Create CategoryCards Component
**Requirements**: 1.6
**Depends on**: none
**Complexity**: Medium

```
Location: app/components/sections/CategoryCards.tsx

Implementation:
1. Build card grid/carousel component
2. Support image backgrounds
3. Support product count badges
4. Multiple card style options
5. Responsive column configuration
```

**Rollback Procedure for 1.6:**
1. Delete app/components/sections/CategoryCards.tsx
2. Revert homepage and landing pages to existing implementations
3. Verify navigation cards still work

---

#### Task 1.7: Create EmptyState Component
**Requirements**: 1.7
**Depends on**: none
**Complexity**: Low

```
Location: app/components/sections/EmptyState.tsx

Implementation:
1. Build empty/404 state component
2. Support collection, search, error variants
3. Include action button
4. Include suggestion links
5. Besilos styling
```

**Rollback Procedure for 1.7:**
1. Delete app/components/sections/EmptyState.tsx
2. Revert to existing empty state handling in routes
3. Verify error states still display

---

### Phase 2: Page Templates [HIGH COMPLEXITY]

#### Task 2.1: Create CollectionTemplate Component
**Requirements**: 1.3, 1.7
**Depends on**: 1.2, 1.3, 1.4, 1.5, 1.7
**Complexity**: High

```
Location: app/components/templates/CollectionTemplate.tsx

Implementation:
1. Combine HeroSection with collection data
2. ProductGrid with filters
3. TrustBadges placement
4. CTASection at bottom
5. EmptyState for 404/empty collections
```

**Rollback Procedure for 2.1:**
1. Delete app/components/templates/CollectionTemplate.tsx
2. Restore original ($locale).collections.$collectionHandle.tsx
3. Verify collection pages work with original code

---

#### Task 2.2: Create LandingTemplate Component
**Requirements**: 1.2, 1.6
**Depends on**: 1.2, 1.5, 1.6
**Complexity**: Medium

```
Location: app/components/templates/LandingTemplate.tsx

Implementation:
1. Shared template for brands/symptoms/ingredients
2. HeroSection with breadcrumb
3. ProductGrid or CategoryCards based on page type
4. Educational content section
5. CTASection at bottom
```

**Rollback Procedure for 2.2:**
1. Delete app/components/templates/LandingTemplate.tsx
2. Routes continue using current implementations
3. No changes to existing functionality

---

#### Task 2.3: Update Collection Route with Template
**Requirements**: 1.7
**Depends on**: 2.1
**Complexity**: High

```
Location: app/routes/($locale).collections.$collectionHandle.tsx

Implementation:
1. Try/catch around collection query
2. If 404, serve placeholder template instead of throwing
3. Use CollectionTemplate for consistent styling
4. Add ShippingBanner via PageTemplate integration
```

**Rollback Procedure for 2.3:**
1. Restore original collection route from git
2. Test collection pages still work
3. Accept 404s until collections created in Shopify

---

#### Task 2.4: Update Brand Route with Template
**Requirements**: 1.2
**Depends on**: 2.2
**Complexity**: Medium

```
Location: app/routes/($locale).brands.$brandHandle.tsx

Implementation:
1. Replace inline sections with LandingTemplate
2. Configure for brand-specific data
3. Maintain existing query logic
4. Add PageTemplate wrapper
```

**Rollback Procedure for 2.4:**
1. Restore original brand route from git
2. Verify brand pages work correctly

---

#### Task 2.5: Update Symptom Route with Template
**Requirements**: 1.2
**Depends on**: 2.2
**Complexity**: Medium

```
Location: app/routes/($locale).symptoms.$symptomHandle.tsx

Implementation:
1. Replace inline sections with LandingTemplate
2. Configure for symptom-specific data
3. Maintain existing query logic
4. Add PageTemplate wrapper
```

**Rollback Procedure for 2.5:**
1. Restore original symptom route from git
2. Verify symptom pages work correctly

---

#### Task 2.6: Update Ingredient Route with Template
**Requirements**: 1.2
**Depends on**: 2.2
**Complexity**: Medium

```
Location: app/routes/($locale).ingredients.$ingredientHandle.tsx

Implementation:
1. Replace inline sections with LandingTemplate
2. Configure for ingredient-specific data
3. Maintain existing query logic
4. Add PageTemplate wrapper
```

**Rollback Procedure for 2.6:**
1. Restore original ingredient route from git
2. Verify ingredient pages work correctly

---

### Phase 3: Navigation and Polish [LOW COMPLEXITY]

#### Task 3.1: Create Collection Metadata File
**Requirements**: 1.7
**Depends on**: none
**Complexity**: Low

```
Location: app/data/collections.ts

Implementation:
1. Define fallback metadata for each expected collection
2. Include: title, description, placeholder image
3. Map collection handles to SEO-friendly content
4. Use when Shopify collection doesn't exist yet
```

**Rollback Procedure for 3.1:**
1. Delete app/data/collections.ts
2. Remove imports from collection route
3. Collection 404s will throw as before

---

#### Task 3.2: Audit and Fix Navigation Links
**Requirements**: All navigation links must resolve
**Depends on**: 3.1
**Complexity**: Low

```
Locations:
- app/data/navigation.ts
- app/components/PageLayout.tsx

Implementation:
1. Audit all links in SHOP_CATEGORIES, BRANDS, SYMPTOMS, INGREDIENTS
2. Ensure routes exist for each link
3. Document any links pointing to non-existent collections
4. Add fallback handling in navigation click
```

**Rollback Procedure for 3.2:**
1. Restore navigation.ts from git
2. Navigation links work as before (some may 404)

---

#### Task 3.3: Update Homepage with PageTemplate
**Requirements**: 1.1
**Depends on**: 1.1
**Complexity**: Low

```
Location: app/routes/($locale)._index.tsx

Implementation:
1. Wrap homepage content with PageTemplate
2. Keep existing DryEyeHero, TrustBadges, SymptomCTA
3. Ensure ShippingBanner doesn't duplicate
```

**Rollback Procedure for 3.3:**
1. Remove PageTemplate wrapper from homepage
2. ShippingBanner inline in homepage works as before

---

#### Task 3.4: Component Barrel Exports
**Requirements**: Code organization
**Depends on**: All component tasks
**Complexity**: Low

```
Locations:
- app/components/templates/index.ts
- app/components/sections/index.ts

Implementation:
1. Create barrel export files
2. Export all components from single entry point
3. Update imports across routes
```

**Rollback Procedure for 3.4:**
1. Delete index.ts files
2. Update imports to direct file paths
3. Functionality unchanged

---

## 4. Compliance and Quality Requirements

### 4.1 Performance Requirements
- **Page Load**: < 2 seconds Time to First Byte
- **Lighthouse Score**: > 95 for Performance, Accessibility
- **Bundle Size**: New components < 50KB total (gzipped)
- **Image Optimization**: Use Shopify CDN with responsive srcset

### 4.2 Accessibility Requirements
- **WCAG 2.1 AA**: All components must meet AA standards
- **Keyboard Navigation**: All interactive elements focusable
- **Screen Reader**: Proper ARIA labels and roles
- **Color Contrast**: Text meets 4.5:1 ratio minimum

### 4.3 Browser Support
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (last 2 versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile
- **No IE11**: Not supported

### 4.4 SEO Requirements
- **Semantic HTML**: Proper heading hierarchy
- **Meta Tags**: Title, description on all pages
- **Structured Data**: Product, Organization schema where applicable
- **URL Structure**: Clean, descriptive URLs

---

## 5. Risk Assessment

### 5.1 High Risk
| Risk | Impact | Mitigation |
|------|--------|------------|
| Collection 404s persist | Users see errors | Fallback template shows helpful content |
| Template breaks existing pages | Site functionality impaired | Incremental rollout, feature flags |
| Performance regression | Poor user experience | Lighthouse monitoring, lazy loading |

### 5.2 Medium Risk
| Risk | Impact | Mitigation |
|------|--------|------------|
| Style conflicts with existing | Visual inconsistencies | Scoped styles, thorough QA |
| Component API changes | Breaking changes downstream | Semantic versioning, deprecation warnings |
| Mobile responsiveness issues | Poor mobile UX | Mobile-first development, device testing |

### 5.3 Low Risk
| Risk | Impact | Mitigation |
|------|--------|------------|
| Additional bundle size | Slightly slower loads | Code splitting, tree shaking |
| Developer learning curve | Slower initial development | Documentation, code examples |

---

## 6. Testing Strategy

### 6.1 Unit Tests
- Component rendering with various props
- Empty state handling
- Loading state display
- Error boundary behavior

### 6.2 Integration Tests
- Route rendering with templates
- Navigation between pages
- Filter and sort functionality
- Add to cart from ProductGrid

### 6.3 Visual Regression Tests
- Screenshot comparison for key pages
- Responsive breakpoint verification
- Dark/light theme consistency

### 6.4 E2E Tests
- User journey: browse collection, add to cart
- User journey: find product by symptom
- User journey: browse brand products
- 404 handling user experience

### 6.5 Manual Testing Checklist
- [ ] Homepage displays ShippingBanner
- [ ] All collection links resolve (or show placeholder)
- [ ] Brand pages match design
- [ ] Symptom pages match design
- [ ] Mobile navigation works
- [ ] Cart drawer opens correctly
- [ ] Filters work on collection pages
- [ ] Empty states display helpfully

---

## 7. Shopify Admin Prerequisites

**IMPORTANT**: The following collections must be created in Shopify Admin for full functionality:

### Required Collections (Create in Shopify Admin)
1. `eye-drops-lubricants` - Eye Drops & Lubricants
2. `eyelid-cleansers` - Eyelid Cleansers
3. `eyelid-sprays` - Eyelid Sprays
4. `eye-masks` - Eye Masks & Compresses
5. `vitamins-supplements` - Vitamins & Supplements
6. `contact-lens-supplies` - Contact Lens Supplies
7. `best-sellers` - Best Sellers (automated or manual)

### Collection Setup Steps
1. Go to Shopify Admin > Products > Collections
2. Create new collection with exact handle matching above
3. Set collection title and description
4. Add collection image
5. Define product inclusion rules or manually add products
6. Save and publish

Until collections are created, the template system will display "Coming Soon" placeholder pages with helpful navigation to existing content.

---

## 8. File Deliverables

### New Files to Create
```
app/components/templates/PageTemplate.tsx
app/components/templates/CollectionTemplate.tsx
app/components/templates/LandingTemplate.tsx
app/components/templates/index.ts
app/components/sections/HeroSection.tsx
app/components/sections/ProductGrid.tsx
app/components/sections/TrustBadgesSection.tsx
app/components/sections/CTASection.tsx
app/components/sections/CategoryCards.tsx
app/components/sections/EmptyState.tsx
app/components/sections/index.ts
app/data/collections.ts
```

### Files to Modify
```
app/routes/($locale)._index.tsx
app/routes/($locale).collections.$collectionHandle.tsx
app/routes/($locale).brands.$brandHandle.tsx
app/routes/($locale).symptoms.$symptomHandle.tsx
app/routes/($locale).ingredients.$ingredientHandle.tsx
```

### Files Unchanged
```
app/components/DryEyeHero.tsx (preserved for backward compatibility)
app/components/PageLayout.tsx (header/footer logic remains)
app/data/navigation.ts (structure preserved, links validated)
tailwind.config.js (colors already defined)
```

---

## 9. Implementation Order Summary

```
Phase 1: Foundation (2-3 days)
  1.1 PageTemplate
  1.2 HeroSection
  1.3 ProductGrid
  1.4 TrustBadgesSection
  1.5 CTASection
  1.6 CategoryCards
  1.7 EmptyState

Phase 2: Templates (3-4 days)
  2.1 CollectionTemplate
  2.2 LandingTemplate
  2.3 Update Collection Route
  2.4 Update Brand Route
  2.5 Update Symptom Route
  2.6 Update Ingredient Route

Phase 3: Polish (1-2 days)
  3.1 Collection Metadata
  3.2 Navigation Audit
  3.3 Homepage Update
  3.4 Barrel Exports
```

---

## 10. Approval Checklist

- [ ] Requirements validated with stakeholders
- [ ] Technical approach reviewed
- [ ] Risk mitigation strategies approved
- [ ] Timeline accepted
- [ ] Testing strategy approved
- [ ] Rollback procedures documented
- [ ] Shopify Admin prerequisites understood

---

**Document Version**: 1.0
**Created**: 2026-01-06
**Last Updated**: 2026-01-06
**Author**: Spec-Architect Agent
**Project**: DryEyeLA Hydrogen Storefront
