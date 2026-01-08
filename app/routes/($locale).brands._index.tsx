import {json, type LoaderFunctionArgs, type MetaArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';
import {BRANDS, SEO_CONFIG} from '~/data/navigation';
import {Link} from '~/components/Link';
import {Heading, Text, Section} from '~/components/Text';

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
      {/* Hero Section */}
      <section className="bg-besilos-navy text-besilos-cream py-16 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <Heading as="h1" size="display" className="text-besilos-cream mb-6">
            Shop by Brand
          </Heading>
          <Text as="p" size="lead" className="text-besilos-cream/80 max-w-2xl mx-auto">
            We carry the most trusted and doctor-recommended dry eye brands.
            Each brand is carefully selected for quality, efficacy, and patient satisfaction.
          </Text>
        </div>
      </section>

      {/* Brands Grid */}
      <Section padding="all">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <Link
              key={brand.handle}
              to={`/collections/${brand.handle}`}
              className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 border border-besilos-sage/20 text-center"
            >
              <Heading as="h2" size="lead" className="mb-2 group-hover:text-besilos-sage transition-colors">
                {brand.name}
              </Heading>
              <Text as="p" className="text-primary/60 text-sm">
                {brand.description}
              </Text>
            </Link>
          ))}
        </div>
      </Section>

      {/* SEO Content */}
      <Section padding="all" className="bg-besilos-cream">
        <div className="max-w-3xl mx-auto prose">
          <Heading as="h2" size="heading" className="text-center mb-8">
            Trusted Dry Eye Brands
          </Heading>
          <Text as="p" className="mb-4">
            At DryEyeLA, we partner with the leading manufacturers of dry eye treatment products.
            Our selection includes clinical-grade omega-3 supplements, preservative-free artificial tears,
            innovative heated eye masks, and advanced eyelid hygiene products.
          </Text>
          <Text as="p" className="mb-4">
            Every brand we carry is recommended by ophthalmologists and optometrists for the treatment
            of dry eye disease, blepharitis, and meibomian gland dysfunction. We believe in offering
            only products that deliver real results for our customers.
          </Text>
          <Text as="p">
            Can't find what you're looking for? Contact us and we'll help you find the right solution
            for your dry eye symptoms.
          </Text>
        </div>
      </Section>
    </>
  );
}
