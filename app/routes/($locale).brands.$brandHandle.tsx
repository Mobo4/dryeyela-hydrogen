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
import {PageHero} from '~/components/sections/PageHero';
import {TrustBadges} from '~/components/sections/TrustBadges';

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
      {/* Hero Section - Eyepromise Style */}
      <PageHero
        title={brand.name}
        description={brand.description}
        badge={products?.nodes?.length > 0 ? `${products.nodes.length}+ Products` : undefined}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Brands', to: '/brands' },
          { label: brand.name },
        ]}
        background="gradient"
      />

      {/* Trust Badges */}
      <TrustBadges
        badges={[
          { number: '100%', label: 'Doctor Approved', linkTo: '/pages/about' },
          { number: '20+', label: 'Years Experience', linkTo: '/pages/about' },
          { number: '4,500+', label: 'Customer Reviews', linkTo: '/pages/about' },
          { number: '100K+', label: 'Monthly Subscriptions', linkTo: '/collections/all' },
        ]}
      />

      {/* Products Section */}
      {products?.nodes?.length > 0 ? (
        <section className="py-20 md:py-32 bg-white">
          <div className="max-w-[1600px] mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <Heading as="h2" size="display" className="text-besilos-navy mb-4 text-3xl md:text-4xl">
                {brand.name} Products
              </Heading>
              <Text className="text-gray-600 text-lg max-w-2xl mx-auto">
                Discover our complete selection of {brand.name} eye care solutions.
              </Text>
            </div>
            <ProductSwimlane
              products={products}
              title=""
              count={24}
            />
          </div>
        </section>
      ) : (
        <section className="py-20 md:py-32 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
            <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100">
              <div className="text-6xl mb-6">📦</div>
              <Heading as="h2" size="display" className="text-besilos-navy mb-4 text-3xl">
                Coming Soon
              </Heading>
              <Text className="text-gray-600 text-lg mb-8">
                {brand.name} products will be available soon. Check back later or browse our other brands.
              </Text>
              <Link
                to="/brands"
                className="inline-block bg-besilos-navy text-white px-8 py-4 font-bold uppercase tracking-wider rounded-lg hover:bg-besilos-navy/90 transition-all shadow-lg"
              >
                Browse All Brands
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Brand Info Section - Eyepromise Style */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <Heading as="h2" size="display" className="text-besilos-navy mb-4 text-3xl md:text-4xl">
              About {brand.name}
            </Heading>
          </div>
          <div className="bg-white rounded-2xl p-10 md:p-12 shadow-lg border border-gray-100">
            <div className="prose prose-lg max-w-none">
              <Text as="p" className="text-gray-700 text-lg mb-6 leading-relaxed">
                {brand.description}
              </Text>
              <Text as="p" className="text-gray-700 text-lg leading-relaxed">
                {brand.name} is trusted by eye care professionals for their proven effectiveness
                in treating dry eye symptoms. All {brand.name} products are recommended by dry eye specialists
                and backed by clinical research.
              </Text>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Eyepromise Style */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-besilos-navy via-besilos-navy/95 to-besilos-blue/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,154,222,0.2),transparent_60%)]"></div>
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-10 md:p-16 shadow-2xl border border-white/20">
            <Heading as="h3" size="display" className="text-besilos-navy mb-4 text-2xl md:text-3xl">
              Need Help Choosing?
            </Heading>
            <Text className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Not sure which {brand.name} product is right for you? Our dry eye specialists can provide personalized recommendations.
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/pages/contact"
                className="inline-block bg-besilos-navy text-white px-8 py-4 font-bold uppercase tracking-wider rounded-lg hover:bg-besilos-navy/90 transition-all shadow-lg"
              >
                Get Recommendations
              </Link>
              <Link
                to="/collections/all"
                className="inline-block bg-transparent text-besilos-navy border-2 border-besilos-navy px-8 py-4 font-bold uppercase tracking-wider rounded-lg hover:bg-gray-50 transition-all"
              >
                Browse All Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

