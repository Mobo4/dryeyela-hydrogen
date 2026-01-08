import {json, type LoaderFunctionArgs, type MetaArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';
import {INGREDIENTS, SEO_CONFIG} from '~/data/navigation';
import {Link} from '~/components/Link';
import {Heading, Text, Section} from '~/components/Text';

export async function loader({request}: LoaderFunctionArgs) {
  return json({
    ingredients: INGREDIENTS,
    seo: {
      title: 'Shop by Ingredient',
      description: 'Find dry eye products by active ingredient: Omega-3, Hypochlorous Acid, Tea Tree Oil, Hyaluronic Acid, and Manuka Honey. Science-backed ingredients for dry eye relief.',
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

export default function IngredientsIndex() {
  const {ingredients} = useLoaderData<typeof loader>();

  // Ingredient icons/benefits mapping
  const ingredientDetails: Record<string, { icon: string; benefits: string[] }> = {
    'omega-3': {
      icon: '🐟',
      benefits: ['Reduces inflammation', 'Improves tear quality', 'Supports meibomian glands'],
    },
    'hypochlorous-acid': {
      icon: '💧',
      benefits: ['Natural antimicrobial', 'Kills bacteria', 'Reduces biofilm'],
    },
    'tea-tree': {
      icon: '🌿',
      benefits: ['Treats demodex mites', 'Natural antibacterial', 'Reduces inflammation'],
    },
    'hyaluronic-acid': {
      icon: '✨',
      benefits: ['Superior hydration', 'Long-lasting moisture', 'Biocompatible'],
    },
    'manuka-honey': {
      icon: '🍯',
      benefits: ['Natural antibacterial', 'Promotes healing', 'Soothes irritation'],
    },
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-besilos-navy text-besilos-cream py-16 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <Heading as="h1" size="display" className="text-besilos-cream mb-6">
            Shop by Ingredient
          </Heading>
          <Text as="p" size="lead" className="text-besilos-cream/80 max-w-2xl mx-auto">
            Understanding what's in your dry eye products matters. Browse by active ingredient
            to find science-backed solutions for your specific needs.
          </Text>
        </div>
      </section>

      {/* Ingredients Grid */}
      <Section padding="all">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ingredients.map((ingredient) => {
            const details = ingredientDetails[ingredient.handle] || { icon: '💊', benefits: [] };
            return (
              <Link
                key={ingredient.handle}
                to={`/collections/${ingredient.handle}`}
                className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-8 border border-besilos-sage/20"
              >
                <div className="text-4xl mb-4">{details.icon}</div>
                <Heading as="h2" size="lead" className="mb-3 group-hover:text-besilos-sage transition-colors">
                  {ingredient.title}
                </Heading>
                <Text as="p" className="text-primary/70 mb-4">
                  {ingredient.description}
                </Text>
                {details.benefits.length > 0 && (
                  <ul className="text-sm text-primary/60 space-y-1">
                    {details.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-besilos-sage">✓</span> {benefit}
                      </li>
                    ))}
                  </ul>
                )}
              </Link>
            );
          })}
        </div>
      </Section>

      {/* Educational Content */}
      <Section padding="all" className="bg-besilos-cream">
        <div className="max-w-3xl mx-auto prose">
          <Heading as="h2" size="heading" className="text-center mb-8">
            Why Ingredients Matter
          </Heading>

          <Heading as="h3" size="lead" className="mt-8 mb-4">
            Omega-3 Fatty Acids (EPA & DHA)
          </Heading>
          <Text as="p" className="mb-4">
            Clinical studies show that omega-3 supplementation can significantly improve dry eye symptoms.
            EPA and DHA in the re-esterified triglyceride (rTG) form provide the best absorption and
            efficacy for dry eye relief.
          </Text>

          <Heading as="h3" size="lead" className="mt-8 mb-4">
            Hypochlorous Acid (HOCl)
          </Heading>
          <Text as="p" className="mb-4">
            Your body naturally produces hypochlorous acid as part of the immune response.
            HOCl sprays provide a safe, effective way to cleanse eyelids and reduce bacterial load
            without irritation.
          </Text>

          <Heading as="h3" size="lead" className="mt-8 mb-4">
            Hyaluronic Acid
          </Heading>
          <Text as="p" className="mb-4">
            Hyaluronic acid can hold 1000x its weight in water, making it the gold standard for
            eye drop formulations that provide long-lasting moisture and comfort.
          </Text>

          <Heading as="h3" size="lead" className="mt-8 mb-4">
            Tea Tree Oil
          </Heading>
          <Text as="p" className="mb-4">
            Tea tree oil (in controlled concentrations) is the most effective treatment for Demodex mites,
            a common cause of blepharitis and chronic eye irritation.
          </Text>

          <Heading as="h3" size="lead" className="mt-8 mb-4">
            Manuka Honey
          </Heading>
          <Text as="p">
            MGO-certified Manuka honey has natural antibacterial properties and promotes tissue healing,
            making it ideal for eyelid care products.
          </Text>
        </div>
      </Section>
    </>
  );
}
