import {json, type LoaderFunctionArgs, type MetaArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';
import {BRANDS, SEO_CONFIG} from '~/data/navigation';
import {Link} from '@remix-run/react';
import {Heading, Text} from '~/components/Text';
import {PageHero, TrustBadges} from '~/components/sections';

export async function loader({request}: LoaderFunctionArgs) {
  return json({
    brands: BRANDS,
    seo: {
      title: 'Shop by Brand',
      description: 'Shop doctor-recommended dry eye products from trusted brands including PRN, Optase, Bruder, Avenova, Systane, Refresh, and more. Find the best dry eye relief products.',
      url: new URL(request.url).href,
    },
  });
}

export const meta = ({data}: MetaArgs<typeof loader>) => {
  return getSeoMeta({
    title: data?.seo.title,
    description: data?.seo.description,
    titleTemplate: SEO_CONFIG.titleTemplate,
  });
};

export default function BrandsIndex() {
  const {brands} = useLoaderData<typeof loader>();

  return (
    <>
      {/* Hero Section - Eyepromise Style */}
      <PageHero
        title="Shop by Brand"
        description="We carry the most trusted and doctor-recommended dry eye brands. Each brand is carefully selected for quality, efficacy, and patient satisfaction."
        breadcrumbs={[
          {label: 'Home', to: '/'},
          {label: 'Brands'},
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

      {/* Brands Grid - Eyepromise Style */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <Heading as="h2" size="display" className="text-besilos-navy mb-4 text-3xl md:text-4xl">
              Trusted Dry Eye Brands
            </Heading>
            <Text className="text-gray-600 text-lg max-w-2xl mx-auto">
              Shop products from leading manufacturers recommended by eye care professionals.
            </Text>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {brands.map((brand) => (
              <Link
                key={brand.handle}
                to={`/brands/${brand.handle}`}
                className="group block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border-2 border-gray-100 hover:border-besilos-blue text-center transform hover:-translate-y-1"
              >
                <Heading as="h3" size="lead" className="text-besilos-navy mb-2 group-hover:text-besilos-blue transition-colors font-bold">
                  {brand.name}
                </Heading>
                <Text className="text-gray-600 text-sm leading-relaxed">
                  {brand.description}
                </Text>
                <span className="text-besilos-blue opacity-0 group-hover:opacity-100 transition-opacity text-sm font-semibold mt-2 inline-block">
                  View Products →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content - Eyepromise Style */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="bg-white rounded-2xl p-10 md:p-12 shadow-lg border border-gray-100">
            <div className="text-center mb-8">
              <Heading as="h2" size="display" className="text-besilos-navy mb-4 text-3xl md:text-4xl">
                Why We Choose These Brands
              </Heading>
            </div>
            <div className="prose prose-lg max-w-none">
              <Text as="p" className="text-gray-700 text-lg mb-6 leading-relaxed">
                At DryEyeLA, we partner with the leading manufacturers of dry eye treatment products.
                Our selection includes clinical-grade omega-3 supplements, preservative-free artificial tears,
                innovative heated eye masks, and advanced eyelid hygiene products.
              </Text>
              <Text as="p" className="text-gray-700 text-lg mb-6 leading-relaxed">
                Every brand we carry is recommended by ophthalmologists and optometrists for the treatment
                of dry eye disease, blepharitis, and meibomian gland dysfunction. We believe in offering
                only products that deliver real results for our customers.
              </Text>
              <Text as="p" className="text-gray-700 text-lg leading-relaxed">
                Can't find what you're looking for? Contact us and we'll help you find the right solution
                for your dry eye symptoms.
              </Text>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
