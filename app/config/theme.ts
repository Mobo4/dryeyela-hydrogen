/**
 * DryEyeLA Theme Configuration
 *
 * TEMPLATE SYSTEM: Change colors here to swap the entire theme.
 * All components use these values, so changing them updates the whole site.
 *
 * To create a new theme:
 * 1. Copy this file
 * 2. Update the colors in THEME_COLORS
 * 3. Update BRAND_CONFIG for your brand
 * 4. All pages will automatically use the new theme
 */

// =============================================================================
// THEME COLORS - Change these to swap the entire site's color scheme
// =============================================================================
export const THEME_COLORS = {
  // Primary brand colors
  primary: {
    navy: '#2C3E50',      // Main dark color (text, headers, buttons)
    cream: '#F9F9F7',     // Main light color (backgrounds)
    sage: '#A8BCA1',      // Accent color (CTAs, highlights, links)
  },

  // Secondary/supporting colors
  secondary: {
    clay: '#D4A373',      // Warm accent (badges, icons)
    white: '#FFFFFF',     // Pure white
    black: '#1A1A1A',     // Near black
  },

  // Semantic colors (these map to primary colors)
  semantic: {
    background: '#F9F9F7',
    foreground: '#2C3E50',
    accent: '#A8BCA1',
    muted: '#6B7280',
    border: 'rgba(44, 62, 80, 0.1)',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },

  // Tailwind class mappings for easy use
  classes: {
    // Backgrounds
    bgPrimary: 'bg-besilos-navy',
    bgSecondary: 'bg-besilos-cream',
    bgAccent: 'bg-besilos-sage',

    // Text
    textPrimary: 'text-besilos-navy',
    textSecondary: 'text-besilos-cream',
    textAccent: 'text-besilos-sage',
    textMuted: 'text-besilos-navy/60',

    // Borders
    borderPrimary: 'border-besilos-navy',
    borderSecondary: 'border-besilos-sage/20',
    borderAccent: 'border-besilos-sage',

    // Hover states
    hoverBgAccent: 'hover:bg-besilos-sage/10',
    hoverTextAccent: 'hover:text-besilos-sage',
    hoverBorderAccent: 'hover:border-besilos-sage',
  },
} as const;

// =============================================================================
// BRAND CONFIGURATION - Store/site identity
// =============================================================================
export const BRAND_CONFIG = {
  name: 'DryEyeLA',
  tagline: 'Los Angeles Premier Dry Eye Products',
  description: 'Doctor-recommended dry eye treatments for lasting relief.',

  // Contact info
  contact: {
    email: 'info@dryeyela.com',
    phone: '(949) 333-2020',
    address: '17322 Murphy Ave, Irvine, CA 92614',
  },

  // Social media
  social: {
    instagram: 'https://instagram.com/dryeyela',
    facebook: 'https://facebook.com/dryeyela',
    youtube: '',
  },

  // SEO defaults
  seo: {
    titleTemplate: '%s | DryEyeLA - Los Angeles Dry Eye Specialists',
    defaultTitle: 'DryEyeLA - Los Angeles Premier Dry Eye Products Store',
    defaultDescription: 'Doctor-recommended dry eye products including eye drops, supplements, and treatments. Free shipping on orders over $50.',
    keywords: [
      'dry eye products',
      'dry eye treatment Los Angeles',
      'eye drops',
      'omega-3 supplements',
      'preservative free eye drops',
    ],
  },

  // E-commerce settings
  ecommerce: {
    freeShippingThreshold: 89,
    currency: 'USD',
    currencySymbol: '$',
  },
} as const;

// =============================================================================
// TRUST BADGES - Customize for your store
// =============================================================================
export const TRUST_BADGES = [
  {
    icon: 'shield-check',
    title: 'Doctor Recommended',
    description: 'Trusted by eye care professionals',
  },
  {
    icon: 'truck',
    title: 'Free Shipping',
    description: `On orders over $${BRAND_CONFIG.ecommerce.freeShippingThreshold}`,
  },
  {
    icon: 'refresh',
    title: 'Easy Returns',
    description: '30-day hassle-free returns',
  },
  {
    icon: 'lock',
    title: 'Secure Checkout',
    description: '100% encrypted transactions',
  },
] as const;

// =============================================================================
// NAVIGATION STRUCTURE - Main menu items
// =============================================================================
export const NAVIGATION = {
  main: [
    {
      title: 'Shop',
      type: 'megamenu',
      items: [
        { title: 'Eye Drops & Lubricants', handle: 'eye-drops-lubricants' },
        { title: 'Eyelid Cleansers', handle: 'eyelid-cleansers' },
        { title: 'Eye Masks & Compresses', handle: 'eye-masks' },
        { title: 'Vitamins & Supplements', handle: 'vitamins-supplements' },
        { title: 'Contact Lens Supplies', handle: 'contact-lens-supplies' },
      ],
    },
    {
      title: 'Brands',
      type: 'megamenu',
      items: [
        { title: 'PRN', handle: 'prn' },
        { title: 'Optase', handle: 'optase' },
        { title: 'Bruder', handle: 'bruder' },
        { title: 'Oasis Tears', handle: 'oasis-tears' },
        { title: 'Avenova', handle: 'avenova' },
      ],
    },
    {
      title: 'By Symptom',
      type: 'megamenu',
      items: [
        { title: 'Dry & Gritty Eyes', handle: 'dry-gritty-eyes' },
        { title: 'Burning & Stinging', handle: 'burning-stinging-eyes' },
        { title: 'Eye Redness', handle: 'eye-redness' },
        { title: 'Blepharitis & MGD', handle: 'blepharitis-mgd' },
      ],
    },
    { title: 'About', handle: 'about', type: 'link' },
    { title: 'Contact', handle: 'contact', type: 'link' },
  ],
  footer: {
    columns: [
      {
        title: 'Shop',
        links: [
          { label: 'All Products', to: '/collections/all' },
          { label: 'Best Sellers', to: '/collections/best-sellers' },
          { label: 'New Arrivals', to: '/collections/new-arrivals' },
          { label: 'Bundles', to: '/collections/bundles' },
        ],
      },
      {
        title: 'Support',
        links: [
          { label: 'Contact Us', to: '/pages/contact' },
          { label: 'FAQ', to: '/pages/faq' },
          { label: 'Shipping Info', to: '/policies/shipping-policy' },
          { label: 'Returns', to: '/policies/refund-policy' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About Us', to: '/pages/about' },
          { label: 'Dry Eye Guide', to: '/pages/dry-eye-guide' },
          { label: 'Privacy Policy', to: '/policies/privacy-policy' },
          { label: 'Terms of Service', to: '/policies/terms-of-service' },
        ],
      },
    ],
  },
} as const;

// =============================================================================
// COMPONENT STYLES - Reusable style presets
// =============================================================================
export const COMPONENT_STYLES = {
  // Button variants
  buttons: {
    primary: 'bg-besilos-sage text-white font-semibold rounded-full hover:bg-besilos-sage/90 transition-colors',
    secondary: 'border-2 border-besilos-navy/30 text-besilos-navy font-semibold rounded-full hover:bg-besilos-navy/10 transition-colors',
    outline: 'border border-besilos-sage text-besilos-sage font-medium rounded-lg hover:bg-besilos-sage/10 transition-colors',
  },

  // Card styles
  cards: {
    default: 'bg-white rounded-2xl border border-besilos-sage/10 hover:border-besilos-sage/30 hover:shadow-lg transition-all duration-300',
    elevated: 'bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300',
    flat: 'bg-besilos-cream/50 rounded-xl',
  },

  // Section backgrounds
  sections: {
    light: 'bg-white',
    cream: 'bg-besilos-cream',
    navy: 'bg-besilos-navy text-besilos-cream',
    gradient: 'bg-gradient-to-b from-besilos-cream to-white',
  },

  // Input styles
  inputs: {
    default: 'border border-besilos-sage/30 rounded-lg bg-white text-besilos-navy placeholder:text-besilos-navy/50 focus:border-besilos-sage focus:ring-1 focus:ring-besilos-sage',
  },
} as const;

// =============================================================================
// HOMEPAGE SECTIONS - Configure what appears on homepage
// =============================================================================
export const HOMEPAGE_CONFIG = {
  hero: {
    enabled: true,
    title: 'Relief Starts Here',
    subtitle: 'Doctor-Recommended Dry Eye Solutions',
    description: 'Discover clinically-proven treatments trusted by eye care professionals.',
    primaryCTA: { label: 'Shop Now', to: '/collections/all' },
    secondaryCTA: { label: 'Take Our Quiz', to: '/pages/dry-eye-quiz' },
  },

  trustBadges: { enabled: true },

  featuredProducts: {
    enabled: true,
    title: 'Best Sellers',
    collection: 'best-sellers',
    limit: 8,
  },

  categories: {
    enabled: true,
    title: 'Shop by Category',
    description: 'Find the right products for your dry eye needs',
  },

  symptoms: {
    enabled: true,
    title: 'Shop by Symptom',
    description: 'Not sure what you need? Start with your symptoms',
  },

  testimonials: { enabled: false },

  newsletter: {
    enabled: true,
    title: 'Stay Updated',
    description: 'Get dry eye tips and exclusive offers',
  },

  cta: {
    enabled: true,
    title: 'Questions About Your Dry Eye?',
    description: 'Our specialists are here to help you find the right treatment.',
    primaryCTA: { label: 'Contact Us', to: '/pages/contact' },
    secondaryCTA: { label: 'Learn More', to: '/pages/about' },
  },
} as const;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get CSS variable value for a theme color
 */
export function getThemeColor(colorPath: string): string {
  const parts = colorPath.split('.');
  let value: any = THEME_COLORS;
  for (const part of parts) {
    value = value?.[part];
  }
  return value || '';
}

/**
 * Get Tailwind class for a theme color
 */
export function getThemeClass(classType: keyof typeof THEME_COLORS.classes): string {
  return THEME_COLORS.classes[classType];
}

/**
 * Generate CSS custom properties for theme colors
 */
export function generateThemeCSSVariables(): string {
  return `
    :root {
      --theme-navy: ${THEME_COLORS.primary.navy};
      --theme-cream: ${THEME_COLORS.primary.cream};
      --theme-sage: ${THEME_COLORS.primary.sage};
      --theme-clay: ${THEME_COLORS.secondary.clay};
    }
  `;
}

// Type exports for TypeScript users
export type ThemeColors = typeof THEME_COLORS;
export type BrandConfig = typeof BRAND_CONFIG;
export type NavigationConfig = typeof NAVIGATION;
