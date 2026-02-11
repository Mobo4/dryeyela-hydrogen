import {json, type LoaderFunctionArgs, type MetaArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';
import {SYMPTOMS, SEO_CONFIG} from '~/data/navigation';
import {Link} from '@remix-run/react';
import {Heading, Text} from '~/components/Text';
import {PageHero, TrustBadges} from '~/components/sections';

export async function loader({request}: LoaderFunctionArgs) {
  return json({
    symptoms: SYMPTOMS,
    seo: {
      title: 'Dry Eye Symptoms Guide',
      description: 'Find the right dry eye treatment for your specific symptoms. Whether you have dry, gritty, burning, or watery eyes, we have doctor-recommended solutions.',
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

export default function SymptomsIndex() {
  const {symptoms} = useLoaderData<typeof loader>();

  return (
    <>
      {/* Hero Section - Eyepromise Style */}
      <PageHero
        title="Find Relief for Your Dry Eye Symptoms"
        description="Not all dry eye is the same. Select your primary symptom below to discover doctor-recommended products tailored to your specific condition."
        breadcrumbs={[
          {label: 'Home', to: '/'},
          {label: 'Symptoms'},
        ]}
        background="gradient"
      />

      {/* Trust Badges */}
      <TrustBadges
        badges={[
          { number: 'Rx', label: 'Doctor Selected', linkTo: '/pages/about' },
          { number: 'PF', label: 'Preservative-Free Options', linkTo: '/collections/eye-drops-lubricants' },
          { number: '$100+', label: 'Free Shipping', linkTo: '/pages/shipping-returns' },
          { number: '30-Day', label: 'Easy Returns', linkTo: '/pages/shipping-returns' },
        ]}
      />

      {/* Symptoms Grid - Eyepromise Style */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {symptoms.map((symptom) => (
              <Link
                key={symptom.handle}
                to={`/symptoms/${symptom.handle}`}
                className="group block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 border-2 border-gray-100 hover:border-besilos-blue transform hover:-translate-y-1"
              >
                <Heading as="h3" size="lead" className="text-besilos-navy mb-3 group-hover:text-besilos-blue transition-colors font-bold">
                  {symptom.title}
                </Heading>
                <Text className="text-gray-600 mb-4 leading-relaxed">
                  {symptom.description}
                </Text>
                <span className="text-besilos-blue opacity-0 group-hover:opacity-100 transition-opacity font-semibold inline-flex items-center gap-2">
                  View Products <span>→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content Section - Eyepromise Style */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="bg-white rounded-2xl p-10 md:p-12 shadow-lg border border-gray-100">
            <div className="text-center mb-8">
              <Heading as="h2" size="display" className="text-besilos-navy mb-4 text-3xl md:text-4xl">
                Understanding Dry Eye Symptoms
              </Heading>
            </div>
            <div className="prose prose-lg max-w-none">
              <Text as="p" className="text-gray-700 text-lg mb-6 leading-relaxed">
                Dry eye disease affects millions of people and can manifest in various ways.
                Common symptoms include a gritty or sandy sensation, burning, stinging, redness,
                and paradoxically, excessive watering. Understanding your specific symptoms is
                the first step to finding effective relief.
              </Text>
              <Text as="p" className="text-gray-700 text-lg mb-6 leading-relaxed">
                Our collection of doctor-recommended dry eye products targets specific symptoms
                and underlying causes. From preservative-free artificial tears to omega-3
                supplements and heated eye masks, we carry the same products recommended by
                leading dry eye specialists.
              </Text>
              <Text as="p" className="text-gray-700 text-lg leading-relaxed">
                Browse by symptom above to find products that address your specific needs,
                or explore our full catalog of dry eye treatments.
              </Text>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
