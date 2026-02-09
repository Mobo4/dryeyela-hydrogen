import {
  json,
  type LoaderFunctionArgs,
  type MetaArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';
import {BRANDS, SEO_CONFIG} from '~/data/navigation';
import {Link} from '@remix-run/react';
import {Heading, Text} from '~/components/Text';
import {ProductSwimlane} from '~/components/ProductSwimlane';
import {PRODUCTS_BY_FILTER_QUERY} from '~/data/queries';
// Compact inline header replaces PageHero and TrustBadges

/**
 * Brand Vendor Mapping
 *
 * Maps brand handles to an array of possible vendor name variations
 * as they may appear in Shopify. This allows for flexible product
 * matching when vendors use different naming conventions.
 */
const BRAND_VENDOR_MAP: Record<string, string[]> = {
  prn: ['PRN', 'PRN Vision', 'PRN Omega'],
  optase: ['Optase', 'OPTASE', 'optase', 'OPTASE Ltd', 'Optase Ltd'],
  'oasis-tears': ['Oasis Tears', 'Oasis', 'OASIS', 'Oasis Medical', 'OasisTears'],
  macuhealth: ['MacuHealth', 'Macuhealth', 'MACUHEALTH', 'Macu Health'],
  bruder: ['Bruder', 'BRUDER', 'Bruder Healthcare', 'Bruder Moist Heat'],
  avenova: ['Avenova', 'AVENOVA', 'NovaBay'],
  'bausch-lomb': [
    'Bausch + Lomb',
    'Bausch & Lomb',
    'Bausch and Lomb',
    'B+L',
    'B&L',
    'BAUSCH + LOMB',
    'BAUSCH & LOMB',
  ],
  systane: ['Systane', 'SYSTANE', 'Alcon', 'ALCON', 'Alcon Systane'],
  refresh: ['Refresh', 'REFRESH', 'Allergan', 'ALLERGAN', 'Allergan Refresh'],
  ocusoft: ['Ocusoft', 'OCuSOFT', 'OCUSOFT', 'OcuSoft', 'Ocu-Soft'],
  retaine: ['Retaine', 'RETAINE', 'OCuSOFT Retaine'],
  menicon: ['Menicon', 'MENICON', 'Menicon Co'],
  tangible: ['Tangible', 'TANGIBLE', 'Tangible Science', 'Tangible Hydra-PEG'],
  heyedrate: ['Heyedrate', 'HEYEDRATE', 'Eye Love', 'EyeLove', 'Eyelove'],
  eyepromise: ['EyePromise', 'Eyepromise', 'EYEPROMISE', 'Eye Promise', 'ZeaVision'],
  cliradex: ['Cliradex', 'CLIRADEX', 'Bio-Tissue', 'BioTissue'],
  'eye-eco': ['Eye Eco', 'EyeEco', 'Eyeeco', 'EYEECO', 'Eye-Eco'],
  eyeeco: ['Eye Eco', 'EyeEco', 'Eyeeco', 'EYEECO', 'Eye-Eco'],
};

/**
 * Builds a Shopify search query string for vendor matching.
 * Uses OR conditions to match any of the possible vendor variations.
 *
 * @param brandHandle - The brand handle from the URL
 * @param defaultName - The default brand name as fallback
 * @returns A formatted query string like: vendor:"Name1" OR vendor:"Name2"
 */
function buildVendorQuery(brandHandle: string, defaultName: string): string {
  const vendorVariations = BRAND_VENDOR_MAP[brandHandle];

  if (vendorVariations && vendorVariations.length > 0) {
    // Build OR query with all vendor variations
    return vendorVariations
      .map((vendor) => `vendor:"${vendor}"`)
      .join(' OR ');
  }

  // Fallback: use the brand name with common case variations
  const lowerName = defaultName.toLowerCase();
  const upperName = defaultName.toUpperCase();

  // Only add variations if they're different from the original
  const variations = [defaultName];
  if (lowerName !== defaultName) variations.push(lowerName);
  if (upperName !== defaultName) variations.push(upperName);

  return variations
    .map((vendor) => `vendor:"${vendor}"`)
    .join(' OR ');
}

/**
 * Brand Page
 *
 * Displays products for a specific brand by filtering via vendor name.
 * Uses flexible vendor matching to handle different naming conventions.
 */
export async function loader({params, context}: LoaderFunctionArgs) {
  const {brandHandle} = params;
  const {storefront} = context;

  const brand = BRANDS.find((b) => b.handle === brandHandle);

  if (!brand) {
    throw new Response('Brand not found', {status: 404});
  }

  // Build flexible vendor query with variations
  const vendorQuery = buildVendorQuery(brandHandle || '', brand.name);

  try {
    // Fetch products by vendor using flexible OR query
    const {products} = await storefront.query(PRODUCTS_BY_FILTER_QUERY, {
      variables: {
        first: 24,
        query: vendorQuery,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
    });

    return json({
      brand,
      products,
      seo: {
        title: `${brand.name} Products`,
        description: brand.description,
      },
    });
  } catch (error) {
    console.error(`Error loading products for brand ${brand.name}:`, error);
    return json({
      brand,
      products: {nodes: []},
      seo: {
        title: `${brand.name} Products`,
        description: brand.description,
      },
    });
  }
}

export const meta = ({data}: MetaArgs<typeof loader>) => {
  if (!data?.brand) return [];

  return getSeoMeta({
    title: data.seo.title,
    description: data.seo.description,
    titleTemplate: SEO_CONFIG.titleTemplate,
  });
};

export default function BrandPage() {
  const {brand, products} = useLoaderData<typeof loader>();

  return (
    <>
      {/* Compact Brand Header */}
      <div className="bg-gradient-to-r from-besilos-navy to-besilos-navy/90 py-4 md:py-5">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <nav className="text-xs text-white/60 mb-1.5 flex items-center gap-1.5">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/brands" className="hover:text-white transition-colors">Brands</Link>
            <span>/</span>
            <span className="text-white/40">{brand.name}</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">
                {brand.name}
              </h1>
              {brand.description && (
                <p className="text-white/70 text-sm mt-0.5 line-clamp-1 max-w-2xl">
                  {brand.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3 md:gap-4 text-xs text-white/70 shrink-0">
              {products?.nodes?.length > 0 && (
                <span className="bg-white/10 px-3 py-1 rounded-full font-semibold">{products.nodes.length} Products</span>
              )}
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="hidden md:inline">Selected by Dr. Bonakdar, OD</span>
                <span className="md:hidden">Doctor Approved</span>
              </span>
              <span className="hidden md:inline">Free Shipping $100+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      {products?.nodes?.length > 0 ? (
        <section className="py-8 md:py-10 bg-white">
          <div className="max-w-[1600px] mx-auto px-4 md:px-8">
            <ProductSwimlane
              products={products}
              title=""
              count={24}
            />
          </div>
        </section>
      ) : (
        <section className="py-12 md:py-16 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
            <div className="bg-white rounded-2xl p-10 shadow-lg border border-gray-100">
              <Heading as="h2" size="display" className="text-besilos-navy mb-4 text-2xl">
                Coming Soon
              </Heading>
              <Text className="text-gray-600 text-lg mb-6">
                {brand.name} products will be available soon. Check back later or browse our other brands.
              </Text>
              <Link
                to="/brands"
                className="inline-block bg-besilos-navy text-white px-6 py-3 font-bold uppercase tracking-wider rounded-lg hover:bg-besilos-navy/90 transition-all shadow-lg"
              >
                Browse All Brands
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Brand Info Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <Heading as="h2" size="display" className="text-besilos-navy mb-6 text-2xl md:text-3xl text-center">
            About {brand.name}
          </Heading>
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-gray-100">
            <div className="prose prose-lg max-w-none">
              <Text as="p" className="text-gray-700 text-lg mb-4 leading-relaxed">
                {brand.description}
              </Text>
              <Text as="p" className="text-gray-700 text-base leading-relaxed">
                {brand.name} is trusted by eye care professionals for their proven effectiveness
                in treating dry eye symptoms. All products are recommended by dry eye specialists
                and backed by clinical research.
              </Text>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-besilos-navy">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <Heading as="h3" size="display" className="text-white mb-3 text-xl md:text-2xl">
            Need Help Choosing?
          </Heading>
          <Text className="text-white/80 text-base mb-6 max-w-2xl mx-auto">
            Our dry eye specialists can provide personalized {brand.name} recommendations.
          </Text>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/pages/contact"
              className="inline-block bg-white text-besilos-navy px-6 py-3 font-bold uppercase tracking-wider rounded-lg hover:bg-gray-100 transition-all shadow-lg text-sm"
            >
              Get Recommendations
            </Link>
            <Link
              to="/collections/all"
              className="inline-block bg-transparent text-white border-2 border-white/50 px-6 py-3 font-bold uppercase tracking-wider rounded-lg hover:bg-white/10 transition-all text-sm"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

