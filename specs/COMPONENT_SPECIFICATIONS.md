# DryEyeLA Component Specifications

## Component Implementation Details

This document provides detailed implementation specifications for each component in the template system.

---

## 1. PageTemplate Component

### File Location
`app/components/templates/PageTemplate.tsx`

### Purpose
Wraps all pages with consistent branding elements including the ShippingBanner at the top of every page.

### Implementation

```typescript
import {type ReactNode} from 'react';
import {ShippingBanner} from '~/components/DryEyeHero';

interface PageTemplateProps {
  children: ReactNode;
  showShippingBanner?: boolean;
  className?: string;
}

export function PageTemplate({
  children,
  showShippingBanner = true,
  className = '',
}: PageTemplateProps) {
  return (
    <>
      {showShippingBanner && <ShippingBanner />}
      <div className={className}>
        {children}
      </div>
    </>
  );
}
```

### Usage Example

```tsx
// In a route file
import {PageTemplate} from '~/components/templates';

export default function SomePage() {
  return (
    <PageTemplate>
      <HeroSection title="Page Title" />
      {/* Page content */}
    </PageTemplate>
  );
}
```

---

## 2. HeroSection Component

### File Location
`app/components/sections/HeroSection.tsx`

### Purpose
Configurable hero section for landing pages with support for various background styles, CTAs, and breadcrumbs.

### Implementation

```typescript
import {Link} from '~/components/Link';
import {Heading, Text} from '~/components/Text';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  breadcrumb?: {
    label: string;
    href: string;
  };
  backgroundVariant?: 'navy' | 'cream' | 'sage' | 'image';
  backgroundImage?: string;
  ctaPrimary?: {
    label: string;
    href: string;
  };
  ctaSecondary?: {
    label: string;
    href: string;
  };
  badge?: string;
  size?: 'small' | 'medium' | 'large';
  align?: 'left' | 'center';
}

const sizeClasses = {
  small: 'py-8 md:py-12',
  medium: 'py-12 md:py-16 lg:py-20',
  large: 'py-16 md:py-24 lg:py-32',
};

const backgroundClasses = {
  navy: 'bg-besilos-navy text-besilos-cream',
  cream: 'bg-besilos-cream text-besilos-navy',
  sage: 'bg-besilos-sage text-white',
  image: 'bg-besilos-navy text-besilos-cream',
};

const buttonVariants = {
  navy: {
    primary: 'bg-besilos-sage text-white hover:bg-besilos-sage/90',
    secondary: 'border-2 border-besilos-cream/30 text-besilos-cream hover:bg-besilos-cream/10',
  },
  cream: {
    primary: 'bg-besilos-sage text-white hover:bg-besilos-sage/90',
    secondary: 'border-2 border-besilos-navy/30 text-besilos-navy hover:bg-besilos-navy/10',
  },
  sage: {
    primary: 'bg-besilos-navy text-white hover:bg-besilos-navy/90',
    secondary: 'border-2 border-white/30 text-white hover:bg-white/10',
  },
  image: {
    primary: 'bg-besilos-sage text-white hover:bg-besilos-sage/90',
    secondary: 'border-2 border-besilos-cream/30 text-besilos-cream hover:bg-besilos-cream/10',
  },
};

export function HeroSection({
  title,
  subtitle,
  breadcrumb,
  backgroundVariant = 'navy',
  backgroundImage,
  ctaPrimary,
  ctaSecondary,
  badge,
  size = 'medium',
  align = 'center',
}: HeroSectionProps) {
  const bgClass = backgroundClasses[backgroundVariant];
  const sizeClass = sizeClasses[size];
  const buttons = buttonVariants[backgroundVariant];
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <section
      className={`relative ${bgClass} ${sizeClass} px-6 md:px-8 lg:px-12 overflow-hidden`}
      style={backgroundImage ? {backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center'} : undefined}
    >
      {/* Background overlay for image variant */}
      {backgroundVariant === 'image' && backgroundImage && (
        <div className="absolute inset-0 bg-besilos-navy/70" />
      )}

      {/* Background pattern for non-image variants */}
      {backgroundVariant === 'navy' && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(168, 188, 161, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(168, 188, 161, 0.2) 0%, transparent 50%)`
          }} />
        </div>
      )}

      <div className={`relative max-w-4xl mx-auto flex flex-col ${alignClass}`}>
        {/* Breadcrumb */}
        {breadcrumb && (
          <Link
            to={breadcrumb.href}
            className="text-besilos-sage hover:underline mb-4 inline-block text-sm"
          >
            ← {breadcrumb.label}
          </Link>
        )}

        {/* Badge */}
        {badge && (
          <div className="inline-block bg-besilos-sage/20 text-besilos-sage px-4 py-2 rounded-full text-sm font-medium mb-6">
            {badge}
          </div>
        )}

        {/* Title */}
        <Heading
          as="h1"
          size="display"
          className={`mb-6 leading-tight ${align === 'center' ? 'mx-auto' : ''}`}
        >
          {title}
        </Heading>

        {/* Subtitle */}
        {subtitle && (
          <Text
            as="p"
            size="lead"
            className={`opacity-80 mb-8 max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}
          >
            {subtitle}
          </Text>
        )}

        {/* CTAs */}
        {(ctaPrimary || ctaSecondary) && (
          <div className={`flex flex-col sm:flex-row gap-4 ${align === 'center' ? 'justify-center' : ''}`}>
            {ctaPrimary && (
              <Link
                to={ctaPrimary.href}
                className={`inline-flex items-center justify-center px-8 py-4 font-semibold rounded-full transition-colors ${buttons.primary}`}
              >
                {ctaPrimary.label}
              </Link>
            )}
            {ctaSecondary && (
              <Link
                to={ctaSecondary.href}
                className={`inline-flex items-center justify-center px-8 py-4 font-semibold rounded-full transition-colors ${buttons.secondary}`}
              >
                {ctaSecondary.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
```

### Usage Examples

```tsx
// Brand page hero
<HeroSection
  title="PRN Products"
  subtitle="PRN Omega-3 supplements and dry eye products trusted by eye care professionals."
  breadcrumb={{ label: "All Brands", href: "/brands" }}
  backgroundVariant="navy"
  size="medium"
  align="center"
/>

// Collection page hero
<HeroSection
  title="Eye Drops & Lubricants"
  subtitle="Preservative-free and lubricating eye drops for dry eye relief"
  backgroundVariant="cream"
  size="small"
  align="left"
/>

// Symptom page hero with CTAs
<HeroSection
  title="Dry & Gritty Eyes"
  subtitle="Stop the constant discomfort of dry, gritty eyes with doctor-recommended treatments."
  breadcrumb={{ label: "All Symptoms", href: "/symptoms" }}
  ctaPrimary={{ label: "Shop Products", href: "#products" }}
  ctaSecondary={{ label: "Learn More", href: "#about" }}
/>
```

---

## 3. ProductGrid Component

### File Location
`app/components/sections/ProductGrid.tsx`

### Purpose
Displays products in a responsive grid with loading states, empty states, and optional quick-add functionality.

### Implementation

```typescript
import type {ProductCardFragment} from 'storefrontapi.generated';
import {ProductCard} from '~/components/ProductCard';
import {Grid} from '~/components/Grid';
import {Skeleton} from '~/components/Skeleton';
import {EmptyState} from '~/components/sections/EmptyState';
import {getImageLoadingPriority} from '~/lib/const';

interface ProductGridProps {
  products: ProductCardFragment[];
  columns?: 2 | 3 | 4;
  loading?: boolean;
  emptyMessage?: string;
  emptyTitle?: string;
  quickAdd?: boolean;
  className?: string;
}

export function ProductGrid({
  products,
  columns = 4,
  loading = false,
  emptyTitle = 'No Products Found',
  emptyMessage = 'We couldn\'t find any products matching your criteria.',
  quickAdd = false,
  className = '',
}: ProductGridProps) {
  // Loading state
  if (loading) {
    return (
      <div className={`grid gap-4 ${getColumnClass(columns)} ${className}`}>
        {Array.from({length: 8}).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyMessage}
        variant="collection"
        action={{
          label: 'Browse All Products',
          href: '/collections/all',
        }}
      />
    );
  }

  return (
    <Grid layout="products" className={className} data-test="product-grid">
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          loading={getImageLoadingPriority(i)}
          quickAdd={quickAdd}
        />
      ))}
    </Grid>
  );
}

function getColumnClass(columns: 2 | 3 | 4): string {
  switch (columns) {
    case 2:
      return 'grid-cols-1 sm:grid-cols-2';
    case 3:
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    case 4:
    default:
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  }
}

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 animate-pulse">
      <div className="aspect-[4/5] bg-besilos-navy/5 rounded-lg" />
      <div className="h-4 bg-besilos-navy/5 rounded w-3/4" />
      <div className="h-4 bg-besilos-navy/5 rounded w-1/4" />
    </div>
  );
}
```

### Usage Examples

```tsx
// Standard product grid
<ProductGrid
  products={collection.products.nodes}
  quickAdd={true}
/>

// Loading state
<ProductGrid products={[]} loading={true} />

// Custom empty message
<ProductGrid
  products={[]}
  emptyTitle="Coming Soon"
  emptyMessage="Products from this brand will be available soon."
/>
```

---

## 4. TrustBadgesSection Component

### File Location
`app/components/sections/TrustBadgesSection.tsx`

### Purpose
Displays trust indicators in either compact or expanded format.

### Implementation

```typescript
import {Text} from '~/components/Text';

type BadgeType = 'doctor' | 'shipping' | 'returns' | 'secure';

interface TrustBadgesSectionProps {
  variant?: 'compact' | 'expanded';
  background?: 'cream' | 'white' | 'transparent';
  badges?: BadgeType[];
}

const badgeData: Record<BadgeType, {icon: JSX.Element; title: string; description: string}> = {
  doctor: {
    icon: (
      <svg className="w-8 h-8 text-besilos-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Doctor Recommended',
    description: 'Trusted by eye care professionals',
  },
  shipping: {
    icon: (
      <svg className="w-8 h-8 text-besilos-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
    title: 'Free Shipping',
    description: 'On all orders over $89',
  },
  returns: {
    icon: (
      <svg className="w-8 h-8 text-besilos-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: 'Easy Returns',
    description: '30-day return policy',
  },
  secure: {
    icon: (
      <svg className="w-8 h-8 text-besilos-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Secure Checkout',
    description: 'SSL encrypted transactions',
  },
};

const backgroundClasses = {
  cream: 'bg-besilos-cream',
  white: 'bg-white',
  transparent: 'bg-transparent',
};

export function TrustBadgesSection({
  variant = 'expanded',
  background = 'cream',
  badges = ['doctor', 'shipping', 'returns', 'secure'],
}: TrustBadgesSectionProps) {
  const bgClass = backgroundClasses[background];

  if (variant === 'compact') {
    return (
      <section className={`${bgClass} py-4 border-y border-besilos-sage/10`}>
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {badges.map((badgeKey) => {
              const badge = badgeData[badgeKey];
              return (
                <div key={badgeKey} className="flex items-center gap-2">
                  <div className="w-5 h-5 text-besilos-sage">
                    {badge.icon}
                  </div>
                  <span className="text-sm text-besilos-navy font-medium">{badge.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${bgClass} py-12 border-y border-besilos-sage/10`}>
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {badges.map((badgeKey) => {
            const badge = badgeData[badgeKey];
            return (
              <div key={badgeKey} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-besilos-sage/10 flex items-center justify-center">
                  {badge.icon}
                </div>
                <h3 className="font-semibold text-besilos-navy mb-1">{badge.title}</h3>
                <Text as="p" size="fine" className="text-besilos-navy/60">
                  {badge.description}
                </Text>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

### Usage Examples

```tsx
// Expanded (default) on homepage
<TrustBadgesSection />

// Compact on collection pages
<TrustBadgesSection variant="compact" background="white" />

// Only show specific badges
<TrustBadgesSection badges={['doctor', 'shipping']} />
```

---

## 5. CTASection Component

### File Location
`app/components/sections/CTASection.tsx`

### Purpose
Reusable call-to-action section with configurable content and styling.

### Implementation

```typescript
import {Link} from '~/components/Link';
import {Heading, Text} from '~/components/Text';

interface CTASectionProps {
  heading: string;
  description?: string;
  ctaPrimary?: {
    label: string;
    href: string;
  };
  ctaSecondary?: {
    label: string;
    href: string;
  };
  variant?: 'centered' | 'split';
  background?: 'navy' | 'cream' | 'white';
}

const backgroundClasses = {
  navy: 'bg-besilos-navy text-besilos-cream',
  cream: 'bg-besilos-cream text-besilos-navy',
  white: 'bg-white text-besilos-navy',
};

const buttonClasses = {
  navy: {
    primary: 'bg-besilos-sage text-white hover:bg-besilos-sage/90',
    secondary: 'border-2 border-besilos-cream/30 text-besilos-cream hover:bg-besilos-cream/10',
  },
  cream: {
    primary: 'bg-besilos-sage text-white hover:bg-besilos-sage/90',
    secondary: 'border-2 border-besilos-navy/30 text-besilos-navy hover:bg-besilos-navy/10',
  },
  white: {
    primary: 'bg-besilos-sage text-white hover:bg-besilos-sage/90',
    secondary: 'border-2 border-besilos-navy/30 text-besilos-navy hover:bg-besilos-navy/10',
  },
};

export function CTASection({
  heading,
  description,
  ctaPrimary,
  ctaSecondary,
  variant = 'centered',
  background = 'white',
}: CTASectionProps) {
  const bgClass = backgroundClasses[background];
  const buttons = buttonClasses[background];
  const descriptionOpacity = background === 'navy' ? 'opacity-80' : 'text-besilos-navy/70';

  if (variant === 'split') {
    return (
      <section className={`${bgClass} py-12 md:py-16 px-6 md:px-8 lg:px-12`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl">
              <Heading as="h2" size="heading" className="mb-2">
                {heading}
              </Heading>
              {description && (
                <Text as="p" className={descriptionOpacity}>
                  {description}
                </Text>
              )}
            </div>
            {(ctaPrimary || ctaSecondary) && (
              <div className="flex flex-col sm:flex-row gap-4">
                {ctaPrimary && (
                  <Link
                    to={ctaPrimary.href}
                    className={`inline-flex items-center justify-center px-8 py-3 font-semibold rounded-full transition-colors ${buttons.primary}`}
                  >
                    {ctaPrimary.label}
                  </Link>
                )}
                {ctaSecondary && (
                  <Link
                    to={ctaSecondary.href}
                    className={`inline-flex items-center justify-center px-8 py-3 font-semibold rounded-full transition-colors ${buttons.secondary}`}
                  >
                    {ctaSecondary.label}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${bgClass} py-12 md:py-16 px-6 md:px-8 lg:px-12`}>
      <div className="max-w-3xl mx-auto text-center">
        <Heading as="h2" size="heading" className="mb-4">
          {heading}
        </Heading>
        {description && (
          <Text as="p" className={`mb-6 ${descriptionOpacity}`}>
            {description}
          </Text>
        )}
        {(ctaPrimary || ctaSecondary) && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {ctaPrimary && (
              <Link
                to={ctaPrimary.href}
                className={`inline-flex items-center justify-center px-8 py-3 font-semibold rounded-full transition-colors ${buttons.primary}`}
              >
                {ctaPrimary.label}
              </Link>
            )}
            {ctaSecondary && (
              <Link
                to={ctaSecondary.href}
                className={`inline-flex items-center justify-center px-8 py-3 font-semibold rounded-full transition-colors ${buttons.secondary}`}
              >
                {ctaSecondary.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
```

### Usage Examples

```tsx
// Centered CTA
<CTASection
  heading="Need Help Finding the Right Product?"
  description="Our dry eye specialists are here to help you find relief."
  ctaPrimary={{ label: "Contact Us", href: "/pages/contact" }}
/>

// Split layout for subscriptions
<CTASection
  heading="Stay Updated"
  description="Get dry eye tips and exclusive offers."
  ctaPrimary={{ label: "Subscribe", href: "/subscribe" }}
  variant="split"
  background="navy"
/>
```

---

## 6. CategoryCards Component

### File Location
`app/components/sections/CategoryCards.tsx`

### Purpose
Visual navigation cards for categories, symptoms, brands, or ingredients.

### Implementation

```typescript
import {Link} from '~/components/Link';
import {Heading, Text} from '~/components/Text';

interface CategoryItem {
  title: string;
  description?: string;
  href: string;
  image?: string;
  count?: number;
  keywords?: string[];
}

interface CategoryCardsProps {
  items: CategoryItem[];
  title?: string;
  layout?: 'grid' | 'carousel';
  columns?: 2 | 3 | 4;
  cardStyle?: 'elevated' | 'outlined' | 'filled';
}

const cardStyleClasses = {
  elevated: 'bg-white shadow-md hover:shadow-lg',
  outlined: 'bg-transparent border border-besilos-sage/20 hover:border-besilos-sage/40',
  filled: 'bg-besilos-cream/50 hover:bg-besilos-cream',
};

const columnClasses = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

export function CategoryCards({
  items,
  title,
  layout = 'grid',
  columns = 3,
  cardStyle = 'outlined',
}: CategoryCardsProps) {
  const cardClass = cardStyleClasses[cardStyle];
  const columnClass = columnClasses[columns];

  if (layout === 'carousel') {
    return (
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          {title && (
            <Heading as="h2" size="heading" className="text-besilos-navy mb-8 text-center">
              {title}
            </Heading>
          )}
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {items.map((item) => (
              <CategoryCard
                key={item.href}
                item={item}
                cardClass={cardClass}
                className="min-w-[280px] snap-start"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {title && (
          <Heading as="h2" size="heading" className="text-besilos-navy mb-8 text-center">
            {title}
          </Heading>
        )}
        <div className={`grid gap-6 ${columnClass}`}>
          {items.map((item) => (
            <CategoryCard
              key={item.href}
              item={item}
              cardClass={cardClass}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({
  item,
  cardClass,
  className = '',
}: {
  item: CategoryItem;
  cardClass: string;
  className?: string;
}) {
  return (
    <Link
      to={item.href}
      className={`group block p-6 rounded-2xl transition-all duration-300 ${cardClass} ${className}`}
      prefetch="intent"
    >
      {/* Image background if provided */}
      {item.image && (
        <div
          className="aspect-video rounded-lg mb-4 bg-cover bg-center"
          style={{backgroundImage: `url(${item.image})`}}
        />
      )}

      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-besilos-navy text-lg group-hover:text-besilos-sage transition-colors">
          {item.title}
        </h3>
        {item.count !== undefined && (
          <span className="text-xs bg-besilos-sage/10 text-besilos-sage px-2 py-1 rounded-full">
            {item.count} products
          </span>
        )}
        <svg
          className="w-5 h-5 text-besilos-sage opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>

      {item.description && (
        <Text as="p" size="fine" className="text-besilos-navy/60 line-clamp-2 mb-3">
          {item.description}
        </Text>
      )}

      {item.keywords && item.keywords.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {item.keywords.slice(0, 3).map((keyword) => (
            <span
              key={keyword}
              className="text-xs bg-besilos-sage/10 text-besilos-sage px-2 py-1 rounded-full"
            >
              {keyword}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
```

### Usage Examples

```tsx
// Symptom cards on homepage
import {SYMPTOMS} from '~/data/navigation';

<CategoryCards
  title="Find Relief by Symptom"
  items={SYMPTOMS.map(s => ({
    title: s.title,
    description: s.description,
    href: `/symptoms/${s.handle}`,
    keywords: s.keywords,
  }))}
  columns={3}
  cardStyle="outlined"
/>

// Brand cards as carousel
import {BRANDS} from '~/data/navigation';

<CategoryCards
  title="Shop by Brand"
  items={BRANDS.map(b => ({
    title: b.name,
    description: b.description,
    href: `/brands/${b.handle}`,
  }))}
  layout="carousel"
  cardStyle="elevated"
/>
```

---

## 7. EmptyState Component

### File Location
`app/components/sections/EmptyState.tsx`

### Purpose
Handles empty states, 404s, and error conditions gracefully with helpful messaging.

### Implementation

```typescript
import {Link} from '~/components/Link';
import {Heading, Text} from '~/components/Text';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
  suggestions?: Array<{
    title: string;
    href: string;
  }>;
  variant?: 'collection' | 'search' | 'error' | 'coming-soon';
  icon?: 'search' | 'collection' | 'error' | 'clock';
}

const icons = {
  search: (
    <svg className="w-16 h-16 text-besilos-sage/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  collection: (
    <svg className="w-16 h-16 text-besilos-sage/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  error: (
    <svg className="w-16 h-16 text-besilos-sage/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  clock: (
    <svg className="w-16 h-16 text-besilos-sage/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const variantDefaults: Record<string, {icon: keyof typeof icons; buttonStyle: string}> = {
  collection: {icon: 'collection', buttonStyle: 'bg-besilos-sage text-white hover:bg-besilos-sage/90'},
  search: {icon: 'search', buttonStyle: 'bg-besilos-sage text-white hover:bg-besilos-sage/90'},
  error: {icon: 'error', buttonStyle: 'bg-besilos-sage text-white hover:bg-besilos-sage/90'},
  'coming-soon': {icon: 'clock', buttonStyle: 'bg-besilos-sage text-white hover:bg-besilos-sage/90'},
};

export function EmptyState({
  title,
  description,
  action,
  suggestions,
  variant = 'collection',
  icon,
}: EmptyStateProps) {
  const defaults = variantDefaults[variant];
  const iconKey = icon || defaults.icon;

  return (
    <div className="py-16 px-6 md:px-12">
      <div className="max-w-md mx-auto text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          {icons[iconKey]}
        </div>

        {/* Title */}
        <Heading as="h2" size="heading" className="text-besilos-navy mb-4">
          {title}
        </Heading>

        {/* Description */}
        <Text as="p" className="text-besilos-navy/70 mb-8">
          {description}
        </Text>

        {/* Primary Action */}
        {action && (
          <Link
            to={action.href}
            className={`inline-flex items-center justify-center px-8 py-3 font-semibold rounded-full transition-colors ${defaults.buttonStyle}`}
          >
            {action.label}
          </Link>
        )}

        {/* Suggestions */}
        {suggestions && suggestions.length > 0 && (
          <div className="mt-10 pt-10 border-t border-besilos-sage/20">
            <Text as="p" size="fine" className="text-besilos-navy/60 mb-4">
              You might also like:
            </Text>
            <div className="flex flex-wrap gap-3 justify-center">
              {suggestions.map((suggestion) => (
                <Link
                  key={suggestion.href}
                  to={suggestion.href}
                  className="text-sm px-4 py-2 bg-besilos-cream rounded-full text-besilos-navy hover:bg-besilos-sage/10 transition-colors"
                >
                  {suggestion.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

### Usage Examples

```tsx
// Collection not found (404 graceful handling)
<EmptyState
  title="Coming Soon"
  description="This collection is being curated. Check back soon for doctor-recommended products."
  variant="coming-soon"
  action={{ label: "Browse All Products", href: "/collections/all" }}
  suggestions={[
    { title: "Eye Drops", href: "/collections/eye-drops-lubricants" },
    { title: "Best Sellers", href: "/collections/best-sellers" },
  ]}
/>

// Search no results
<EmptyState
  title="No Results Found"
  description="We couldn't find any products matching your search."
  variant="search"
  action={{ label: "Clear Search", href: "/search" }}
/>

// Empty collection
<EmptyState
  title="No Products Yet"
  description="This brand doesn't have any products listed yet."
  variant="collection"
  action={{ label: "Browse Other Brands", href: "/brands" }}
/>
```

---

## 8. Collection Metadata File

### File Location
`app/data/collections.ts`

### Purpose
Provides fallback metadata for collections that may not exist in Shopify yet.

### Implementation

```typescript
/**
 * Collection metadata for fallback handling when Shopify collections don't exist yet.
 * Used to display "Coming Soon" pages instead of 404 errors.
 */

interface CollectionMetadata {
  handle: string;
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  relatedCollections: string[];
}

export const COLLECTION_METADATA: Record<string, CollectionMetadata> = {
  'eye-drops-lubricants': {
    handle: 'eye-drops-lubricants',
    title: 'Eye Drops & Lubricants',
    description: 'Preservative-free and lubricating eye drops for dry eye relief. Doctor-recommended artificial tears and moisturizing drops.',
    seoTitle: 'Eye Drops & Lubricants | DryEyeLA',
    seoDescription: 'Shop preservative-free eye drops and lubricants for dry eye relief. Doctor-recommended artificial tears with free shipping over $89.',
    relatedCollections: ['vitamins-supplements', 'eyelid-cleansers'],
  },
  'eyelid-cleansers': {
    handle: 'eyelid-cleansers',
    title: 'Eyelid Cleansers',
    description: 'Eyelid wipes, foams, and sprays for blepharitis and MGD treatment. Keep your eyelids clean and healthy.',
    seoTitle: 'Eyelid Cleansers | DryEyeLA',
    seoDescription: 'Shop eyelid cleansers, wipes, and foams for blepharitis treatment. Doctor-recommended eyelid hygiene products.',
    relatedCollections: ['eyelid-sprays', 'eye-masks'],
  },
  'eyelid-sprays': {
    handle: 'eyelid-sprays',
    title: 'Eyelid Sprays',
    description: 'Hypochlorous acid and antimicrobial eyelid sprays for daily eyelid hygiene.',
    seoTitle: 'Eyelid Sprays | DryEyeLA',
    seoDescription: 'Shop hypochlorous acid eyelid sprays for daily hygiene. Antimicrobial sprays for blepharitis and dry eye.',
    relatedCollections: ['eyelid-cleansers', 'eye-drops-lubricants'],
  },
  'eye-masks': {
    handle: 'eye-masks',
    title: 'Eye Masks & Compresses',
    description: 'Heated eye masks and warm compresses for meibomian gland therapy and dry eye relief.',
    seoTitle: 'Eye Masks & Warm Compresses | DryEyeLA',
    seoDescription: 'Shop heated eye masks and warm compresses for MGD treatment. Doctor-recommended heat therapy.',
    relatedCollections: ['eyelid-cleansers', 'vitamins-supplements'],
  },
  'vitamins-supplements': {
    handle: 'vitamins-supplements',
    title: 'Vitamins & Supplements',
    description: 'Omega-3 supplements and eye vitamins for dry eye nutrition support. EPA/DHA fish oil supplements.',
    seoTitle: 'Eye Vitamins & Omega-3 Supplements | DryEyeLA',
    seoDescription: 'Shop omega-3 supplements and eye vitamins for dry eye support. Doctor-recommended PRN omega supplements.',
    relatedCollections: ['eye-drops-lubricants', 'eye-masks'],
  },
  'contact-lens-supplies': {
    handle: 'contact-lens-supplies',
    title: 'Contact Lens Supplies',
    description: 'Scleral lens solutions and contact lens care products for dry eye patients.',
    seoTitle: 'Contact Lens & Scleral Lens Supplies | DryEyeLA',
    seoDescription: 'Shop scleral lens solutions and contact lens care products. Preservative-free saline and lens solutions.',
    relatedCollections: ['eye-drops-lubricants'],
  },
  'best-sellers': {
    handle: 'best-sellers',
    title: 'Best Sellers',
    description: 'Our most popular dry eye products recommended by eye care professionals.',
    seoTitle: 'Best Selling Dry Eye Products | DryEyeLA',
    seoDescription: 'Shop our best-selling dry eye products. Doctor-recommended eye drops, supplements, and treatments.',
    relatedCollections: ['eye-drops-lubricants', 'vitamins-supplements'],
  },
};

/**
 * Get collection metadata by handle, returns undefined if not found.
 */
export function getCollectionMetadata(handle: string): CollectionMetadata | undefined {
  return COLLECTION_METADATA[handle];
}

/**
 * Check if a collection handle has fallback metadata available.
 */
export function hasCollectionMetadata(handle: string): boolean {
  return handle in COLLECTION_METADATA;
}
```

---

## 9. Barrel Export Files

### Templates Index
**File Location**: `app/components/templates/index.ts`

```typescript
export {PageTemplate} from './PageTemplate';
export {CollectionTemplate} from './CollectionTemplate';
export {LandingTemplate} from './LandingTemplate';
```

### Sections Index
**File Location**: `app/components/sections/index.ts`

```typescript
export {HeroSection} from './HeroSection';
export {ProductGrid} from './ProductGrid';
export {TrustBadgesSection} from './TrustBadgesSection';
export {CTASection} from './CTASection';
export {CategoryCards} from './CategoryCards';
export {EmptyState} from './EmptyState';
```

---

## Usage in Routes

### Updated Collection Route Example

```typescript
// app/routes/($locale).collections.$collectionHandle.tsx

import {PageTemplate} from '~/components/templates';
import {HeroSection, ProductGrid, TrustBadgesSection, CTASection, EmptyState} from '~/components/sections';
import {getCollectionMetadata} from '~/data/collections';

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {collectionHandle} = params;

  try {
    // Existing query logic...
    const {collection} = await context.storefront.query(COLLECTION_QUERY, {/* ... */});

    if (!collection) {
      // Return placeholder data instead of throwing 404
      const metadata = getCollectionMetadata(collectionHandle);
      return json({
        collection: null,
        metadata,
        isPlaceholder: true,
      });
    }

    return json({
      collection,
      metadata: null,
      isPlaceholder: false,
    });
  } catch (error) {
    // Handle error gracefully
    const metadata = getCollectionMetadata(collectionHandle);
    return json({
      collection: null,
      metadata,
      isPlaceholder: true,
    });
  }
}

export default function Collection() {
  const {collection, metadata, isPlaceholder} = useLoaderData<typeof loader>();

  // Show placeholder for non-existent collections
  if (isPlaceholder && metadata) {
    return (
      <PageTemplate>
        <HeroSection
          title={metadata.title}
          subtitle={metadata.description}
          backgroundVariant="cream"
          size="small"
        />
        <EmptyState
          title="Coming Soon"
          description="This collection is being curated with doctor-recommended products. Check back soon!"
          variant="coming-soon"
          action={{ label: "Browse All Products", href: "/collections/all" }}
          suggestions={metadata.relatedCollections.map(handle => ({
            title: COLLECTION_METADATA[handle]?.title || handle,
            href: `/collections/${handle}`,
          }))}
        />
        <TrustBadgesSection variant="compact" />
      </PageTemplate>
    );
  }

  // Existing collection rendering...
  return (
    <PageTemplate>
      <HeroSection
        title={collection.title}
        subtitle={collection.description}
        backgroundVariant="cream"
        size="small"
      />
      <TrustBadgesSection variant="compact" />
      <section className="py-8 px-6 md:px-8 lg:px-12">
        <ProductGrid
          products={collection.products.nodes}
          quickAdd={true}
        />
      </section>
      <CTASection
        heading="Need Help?"
        description="Our dry eye specialists are here to help you find the right products."
        ctaPrimary={{ label: "Contact Us", href: "/pages/contact" }}
      />
    </PageTemplate>
  );
}
```

---

## Component Checklist for Implementation

- [ ] `app/components/templates/PageTemplate.tsx`
- [ ] `app/components/templates/CollectionTemplate.tsx`
- [ ] `app/components/templates/LandingTemplate.tsx`
- [ ] `app/components/templates/index.ts`
- [ ] `app/components/sections/HeroSection.tsx`
- [ ] `app/components/sections/ProductGrid.tsx`
- [ ] `app/components/sections/TrustBadgesSection.tsx`
- [ ] `app/components/sections/CTASection.tsx`
- [ ] `app/components/sections/CategoryCards.tsx`
- [ ] `app/components/sections/EmptyState.tsx`
- [ ] `app/components/sections/index.ts`
- [ ] `app/data/collections.ts`
- [ ] Update `app/routes/($locale).collections.$collectionHandle.tsx`
- [ ] Update `app/routes/($locale).brands.$brandHandle.tsx`
- [ ] Update `app/routes/($locale).symptoms.$symptomHandle.tsx`
- [ ] Update `app/routes/($locale).ingredients.$ingredientHandle.tsx`
- [ ] Update `app/routes/($locale)._index.tsx`

---

**Document Version**: 1.0
**Last Updated**: 2026-01-06
