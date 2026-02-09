import {json, type LoaderFunctionArgs, type MetaArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';
import {BRANDS, SEO_CONFIG} from '~/data/navigation';
import {Heading, Text} from '~/components/Text';
import {PageHero} from '~/components/sections/PageHero';
import {TrustBadges} from '~/components/sections/TrustBadges';

/**
 * Brands Index Page
 *
 * Displays all available brands with links to their respective pages.
 * PRN, Avenova, and EyePromise link to custom pages (/pages/{handle}).
 * All other brands link to the dynamic brand route (/brands/{handle}).
 */

// Brands that have custom pages instead of dynamic brand routes
const CUSTOM_PAGE_BRANDS = ['prn', 'avenova', 'eyepromise'];

function getBrandUrl(handle: string): string {
  if (CUSTOM_PAGE_BRANDS.includes(handle)) {
    return `/pages/${handle}`;
  }
  return `/brands/${handle}`;
}

export async function loader({request}: LoaderFunctionArgs) {
  return json({
    brands: BRANDS,
    seo: {
      title: 'Shop by Brand',
      description:
        'Browse our complete collection of doctor-recommended dry eye brands including PRN, Optase, Oasis Tears, MacuHealth, Bruder, and more.',
      url: new URL(request.url).href,
    },
  });
}

export const meta = ({data}: MetaArgs<typeof loader>) => {
  if (!data) return [];

  return getSeoMeta({
    title: data.seo.title,
    description: data.seo.description,
    titleTemplate: SEO_CONFIG.titleTemplate,
  });
};

export default function BrandsIndexPage() {
  const {brands} = useLoaderData<typeof loader>();

  return (
    <>
      {/* Hero Section */}
      <PageHero
        title="Shop by Brand"
        description="Discover doctor-recommended dry eye products from the industry's most trusted brands. Each brand is carefully selected for quality and effectiveness."
        badge={`${brands.length} Trusted Brands`}
        breadcrumbs={[{label: 'Home', to: '/'}, {label: 'Brands', to: '/brands'}]}
        background="gradient"
      />

      {/* Trust Badges */}
      <TrustBadges
        badges={[
          {number: '100%', label: 'Doctor Approved', linkTo: '/pages/about'},
          {number: '20+', label: 'Years Experience', linkTo: '/pages/about'},
          {number: '4,500+', label: 'Customer Reviews', linkTo: '/pages/about'},
          {
            number: '100K+',
            label: 'Monthly Subscriptions',
            linkTo: '/collections/all',
          },
        ]}
      />

      {/* Brands Grid Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <Heading
              as="h2"
              size="display"
              className="text-besilos-navy mb-4 text-3xl md:text-4xl"
            >
              Our Trusted Brands
            </Heading>
            <Text className="text-gray-600 text-lg max-w-2xl mx-auto">
              We partner with leading eye care manufacturers to bring you the
              most effective dry eye treatments available.
            </Text>
          </div>

          {/* Brand Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {brands.map((brand) => (
              <Link
                key={brand.handle}
                to={getBrandUrl(brand.handle)}
                className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:border-besilos-blue/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex flex-col h-full">
                  {/* Brand Name */}
                  <Heading
                    as="h3"
                    size="heading"
                    className="text-besilos-navy mb-3 text-xl md:text-2xl group-hover:text-besilos-blue transition-colors"
                  >
                    {brand.name}
                  </Heading>

                  {/* Brand Description */}
                  <Text className="text-gray-600 text-base leading-relaxed flex-grow mb-6">
                    {brand.description}
                  </Text>

                  {/* Shop Now Link */}
                  <div className="flex items-center gap-2 text-besilos-blue font-semibold uppercase tracking-wider text-sm group-hover:gap-3 transition-all">
                    <span>Shop Now</span>
                    <svg
                      className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Brands Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <Heading
              as="h2"
              size="display"
              className="text-besilos-navy mb-4 text-3xl md:text-4xl"
            >
              Why Shop With Us?
            </Heading>
          </div>
          <div className="bg-white rounded-2xl p-10 md:p-12 shadow-lg border border-gray-100">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl mb-4">&#128100;</div>
                <Heading as="h4" className="text-besilos-navy mb-2 text-lg">
                  Doctor Recommended
                </Heading>
                <Text className="text-gray-600 text-sm">
                  Every brand is vetted and recommended by dry eye specialists.
                </Text>
              </div>
              <div>
                <div className="text-4xl mb-4">&#128722;</div>
                <Heading as="h4" className="text-besilos-navy mb-2 text-lg">
                  Authentic Products
                </Heading>
                <Text className="text-gray-600 text-sm">
                  We only sell genuine products directly from manufacturers.
                </Text>
              </div>
              <div>
                <div className="text-4xl mb-4">&#128666;</div>
                <Heading as="h4" className="text-besilos-navy mb-2 text-lg">
                  Free Shipping
                </Heading>
                <Text className="text-gray-600 text-sm">
                  Free shipping on all orders over $50 within the USA.
                </Text>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-besilos-navy via-besilos-navy/95 to-besilos-blue/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,154,222,0.2),transparent_60%)]"></div>
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-10 md:p-16 shadow-2xl border border-white/20">
            <Heading
              as="h3"
              size="display"
              className="text-besilos-navy mb-4 text-2xl md:text-3xl"
            >
              Not Sure Where to Start?
            </Heading>
            <Text className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Our dry eye specialists can help you find the perfect products for
              your specific needs. Get personalized recommendations based on
              your symptoms.
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
