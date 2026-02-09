/**
 * DryEyeLA Navigation Configuration
 * Los Angeles Premier Dry Eye Products Store
 */

export const SHOP_CATEGORIES = [
  {
    title: 'Eye Drops & Lubricants',
    handle: 'eye-drops-lubricants',
    description: 'Preservative-free and lubricating eye drops for dry eye relief',
    keywords: ['eye drops', 'lubricant', 'artificial tears', 'preservative free'],
  },
  {
    title: 'Eyelid Cleansers',
    handle: 'eyelid-cleansers',
    description: 'Eyelid wipes, foams, and sprays for blepharitis and MGD treatment',
    keywords: ['eyelid cleanser', 'eyelid wipes', 'blepharitis', 'MGD'],
  },
  {
    title: 'Eyelid Sprays',
    handle: 'eyelid-sprays',
    description: 'Hypochlorous acid and antimicrobial eyelid sprays',
    keywords: ['eyelid spray', 'hypochlorous acid', 'antimicrobial'],
  },
  {
    title: 'Eye Masks & Compresses',
    handle: 'eye-masks',
    description: 'Heated eye masks and warm compresses for meibomian gland therapy',
    keywords: ['eye mask', 'warm compress', 'heat therapy', 'meibomian gland'],
  },
  {
    title: 'Vitamins & Supplements',
    handle: 'vitamins-supplements',
    description: 'Omega-3 supplements and eye vitamins for dry eye support',
    keywords: ['omega-3', 'eye vitamins', 'supplements', 'EPA', 'DHA'],
  },
  {
    title: 'Contact Lens Supplies',
    handle: 'contact-lens-supplies',
    description: 'Scleral lens solutions and contact lens care products',
    keywords: ['contact lens', 'scleral lens', 'saline solution', 'lens care'],
  },
];

export const BRANDS = [
  { name: 'PRN', handle: 'prn', description: 'PRN Omega-3 supplements and dry eye products' },
  { name: 'Optase', handle: 'optase', description: 'Optase eye drops and eyelid care' },
  { name: 'Oasis Tears', handle: 'oasis-tears', description: 'Oasis artificial tears and lubricants' },
  { name: 'MacuHealth', handle: 'macuhealth', description: 'MacuHealth macular supplements' },
  { name: 'Bruder', handle: 'bruder', description: 'Bruder heated eye masks and compresses' },
  { name: 'Avenova', handle: 'avenova', description: 'Avenova hypochlorous acid spray' },
  { name: 'Bausch + Lomb', handle: 'bausch-lomb', description: 'Bausch + Lomb eye care products' },
  { name: 'Systane', handle: 'systane', description: 'Systane lubricant eye drops' },
  { name: 'Refresh', handle: 'refresh', description: 'Refresh artificial tears' },
  { name: 'Ocusoft', handle: 'ocusoft', description: 'Ocusoft eyelid cleansers' },
  { name: 'Retaine', handle: 'retaine', description: 'Retaine MGD eye drops' },
  { name: 'Menicon', handle: 'menicon', description: 'Menicon Lacripure saline solution' },
  { name: 'Tangible', handle: 'tangible', description: 'Tangible scleral lens care' },
  { name: 'Heyedrate', handle: 'heyedrate', description: 'Heyedrate eyelid cleanser and supplements' },
  { name: 'EyePromise', handle: 'eyepromise', description: 'EyePromise eye vitamins' },
  { name: 'Cliradex', handle: 'cliradex', description: 'Cliradex eyelid cleansers' },
  { name: 'Eye Eco', handle: 'eyeeco', description: 'Eye Eco moisture products' },
];

export const SYMPTOMS = [
  {
    title: 'Dry & Gritty Eyes',
    handle: 'dry-gritty-eyes',
    description: 'Find relief for dry, sandy, or gritty eye sensations with our recommended products.',
    keywords: ['dry eyes', 'gritty eyes', 'sandy eyes', 'eye dryness'],
    heroText: 'Stop the constant discomfort of dry, gritty eyes with doctor-recommended treatments.',
    recommendedCategories: ['eye-drops-lubricants', 'vitamins-supplements'],
  },
  {
    title: 'Burning & Stinging',
    handle: 'burning-stinging-eyes',
    description: 'Soothe burning and stinging eye symptoms with targeted dry eye treatments.',
    keywords: ['burning eyes', 'stinging eyes', 'eye irritation', 'eye discomfort'],
    heroText: 'Get instant relief from burning and stinging with our soothing eye care products.',
    recommendedCategories: ['eye-drops-lubricants', 'eyelid-sprays'],
  },
  {
    title: 'Eye Redness',
    handle: 'eye-redness',
    description: 'Reduce red, irritated eyes with our selection of redness-relief products.',
    keywords: ['red eyes', 'eye redness', 'bloodshot eyes', 'irritated eyes'],
    heroText: 'Clear up red, irritated eyes with our targeted treatment solutions.',
    recommendedCategories: ['eye-drops-lubricants', 'eyelid-cleansers'],
  },
  {
    title: 'Watery Eyes',
    handle: 'watery-eyes',
    description: 'Control excessive tearing and watery eyes with the right dry eye products.',
    keywords: ['watery eyes', 'excessive tearing', 'epiphora', 'tear overflow'],
    heroText: 'Paradoxically, watery eyes often signal dry eye. Find balance with our products.',
    recommendedCategories: ['eye-drops-lubricants', 'vitamins-supplements'],
  },
  {
    title: 'Severe & Chronic Dry Eye',
    handle: 'severe-chronic-dry-eye',
    description: 'Advanced treatment options for severe and chronic dry eye syndrome.',
    keywords: ['severe dry eye', 'chronic dry eye', 'DED', 'dry eye disease'],
    heroText: 'Comprehensive treatment protocols for persistent dry eye conditions.',
    recommendedCategories: ['eye-drops-lubricants', 'eye-masks', 'vitamins-supplements'],
  },
  {
    title: 'Blepharitis & MGD',
    handle: 'blepharitis-mgd',
    description: 'Manage blepharitis and meibomian gland dysfunction with targeted care.',
    keywords: ['blepharitis', 'MGD', 'meibomian gland', 'eyelid inflammation'],
    heroText: 'Specialized products for blepharitis and meibomian gland dysfunction.',
    recommendedCategories: ['eyelid-cleansers', 'eyelid-sprays', 'eye-masks'],
  },
];

export const INGREDIENTS = [
  {
    title: 'Omega-3 Fatty Acids',
    handle: 'omega-3',
    description: 'EPA and DHA omega-3 supplements for dry eye nutrition support.',
    keywords: ['omega-3', 'EPA', 'DHA', 'fish oil', 'fatty acids'],
  },
  {
    title: 'Hypochlorous Acid',
    handle: 'hypochlorous-acid',
    description: 'Natural antimicrobial hypochlorous acid for eyelid hygiene.',
    keywords: ['hypochlorous acid', 'HOCl', 'antimicrobial', 'eyelid hygiene'],
  },
  {
    title: 'Tea Tree Oil',
    handle: 'tea-tree',
    description: 'Tea tree oil products for demodex mite treatment.',
    keywords: ['tea tree', 'demodex', 'mites', 'natural treatment'],
  },
  {
    title: 'Hyaluronic Acid',
    handle: 'hyaluronic-acid',
    description: 'Hyaluronic acid eye drops for superior moisture retention.',
    keywords: ['hyaluronic acid', 'HA', 'moisture', 'hydration'],
  },
  {
    title: 'Manuka Honey',
    handle: 'manuka-honey',
    description: 'Manuka honey products for natural eyelid care.',
    keywords: ['manuka honey', 'natural', 'antibacterial'],
  },
];

export const MAIN_NAVIGATION = {
  shop: {
    title: 'Shop',
    items: SHOP_CATEGORIES,
  },
  brands: {
    title: 'Brands',
    items: BRANDS,
  },
  symptoms: {
    title: 'Shop by Symptom',
    items: SYMPTOMS,
  },
  ingredients: {
    title: 'Ingredients',
    items: INGREDIENTS,
  },
  learn: {
    title: 'Learn',
    items: [
      { title: 'Dry Eye Blog', handle: 'blog', description: 'Educational articles about dry eye' },
      { title: 'Treatment Guide', handle: 'treatment-guide', description: 'Comprehensive dry eye treatment information' },
      { title: 'FAQ', handle: 'faq', description: 'Frequently asked questions' },
    ],
  },
};

export const SEO_CONFIG = {
  siteName: 'DryEyeLA',
  siteDescription: 'Los Angeles Premier Dry Eye Products Store - Doctor recommended eye drops, supplements, and treatments for dry eye relief. Free shipping on orders over $50.',
  titleTemplate: '%s | DryEyeLA - Los Angeles Dry Eye Specialists',
  defaultTitle: 'DryEyeLA - Los Angeles Premier Dry Eye Products Store',
  keywords: [
    'dry eye products',
    'dry eye treatment Los Angeles',
    'eye drops',
    'omega-3 supplements',
    'eyelid cleanser',
    'preservative free eye drops',
    'PRN omega',
    'Optase',
    'scleral lens solution',
    'meibomian gland dysfunction',
    'blepharitis treatment',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'DryEyeLA',
  },
  twitter: {
    cardType: 'summary_large_image',
  },
};
