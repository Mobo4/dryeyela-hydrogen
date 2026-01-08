import {json, type LoaderFunctionArgs, type MetaArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';
import {SYMPTOMS, SEO_CONFIG} from '~/data/navigation';
import {Link} from '~/components/Link';
import {Heading, Text, Section} from '~/components/Text';

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
      {/* Hero Section */}
      <section className="bg-besilos-navy text-besilos-cream py-16 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <Heading as="h1" size="display" className="text-besilos-cream mb-6">
            Find Relief for Your Dry Eye Symptoms
          </Heading>
          <Text as="p" size="lead" className="text-besilos-cream/80 max-w-2xl mx-auto">
            Not all dry eye is the same. Select your primary symptom below to discover
            doctor-recommended products tailored to your specific condition.
          </Text>
        </div>
      </section>

      {/* Symptoms Grid */}
      <Section padding="all">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {symptoms.map((symptom) => (
            <Link
              key={symptom.handle}
              to={`/symptoms/${symptom.handle}`}
              className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border border-besilos-sage/20"
            >
              <Heading as="h2" size="lead" className="mb-3 group-hover:text-besilos-sage transition-colors">
                {symptom.title}
              </Heading>
              <Text as="p" className="text-primary/70 mb-4">
                {symptom.description}
              </Text>
              <span className="text-besilos-sage font-medium group-hover:underline">
                View Products →
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* SEO Content Section */}
      <Section padding="all" className="bg-besilos-cream">
        <div className="max-w-3xl mx-auto prose">
          <Heading as="h2" size="heading" className="text-center mb-8">
            Understanding Dry Eye Symptoms
          </Heading>
          <Text as="p" className="mb-4">
            Dry eye disease affects millions of people and can manifest in various ways.
            Common symptoms include a gritty or sandy sensation, burning, stinging, redness,
            and paradoxically, excessive watering. Understanding your specific symptoms is
            the first step to finding effective relief.
          </Text>
          <Text as="p" className="mb-4">
            Our collection of doctor-recommended dry eye products targets specific symptoms
            and underlying causes. From preservative-free artificial tears to omega-3
            supplements and heated eye masks, we carry the same products recommended by
            leading dry eye specialists.
          </Text>
          <Text as="p">
            Browse by symptom above to find products that address your specific needs,
            or explore our full catalog of dry eye treatments.
          </Text>
        </div>
      </Section>
    </>
  );
}
