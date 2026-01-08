import {
  json,
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import invariant from 'tiny-invariant';
import {getSeoMeta} from '@shopify/hydrogen';

import {Link} from '~/components/Link';
import {routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';
import {
  HeroSection,
  TrustBadgesSection,
  CTASection,
} from '~/components/sections';

export const headers = routeHeaders;

export async function loader({request, params, context}: LoaderFunctionArgs) {
  invariant(params.pageHandle, 'Missing page handle');

  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: params.pageHandle,
      language: context.storefront.i18n.language,
    },
  });

  if (!page) {
    throw new Response(null, {status: 404});
  }

  const seo = seoPayload.page({page, url: request.url});

  return json({page, seo});
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Page() {
  const {page} = useLoaderData<typeof loader>();

  // Get page-specific CTA content
  const ctaContent = getPageCTA(page.title);

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        title={page.title}
        breadcrumbs={[
          {label: 'Home', to: '/'},
          {label: page.title},
        ]}
        size="small"
        background="cream"
      />

      {/* Page Content */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12">
          <div
            dangerouslySetInnerHTML={{__html: page.body}}
            className="prose prose-lg max-w-none prose-headings:text-besilos-navy prose-headings:font-bold prose-p:text-besilos-navy/80 prose-a:text-besilos-sage prose-a:no-underline hover:prose-a:underline prose-strong:text-besilos-navy prose-ul:text-besilos-navy/80 prose-ol:text-besilos-navy/80"
          />
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadgesSection variant="expanded" />

      {/* CTA Section */}
      <CTASection
        title={ctaContent.title}
        description={ctaContent.description}
        primaryCTA={ctaContent.primaryCTA}
        secondaryCTA={ctaContent.secondaryCTA}
        variant="centered"
        background="navy"
      />
    </>
  );
}

// Helper function to get page-specific CTA content
function getPageCTA(pageTitle: string) {
  const lowercaseTitle = pageTitle.toLowerCase();

  if (lowercaseTitle.includes('contact')) {
    return {
      title: 'Ready to Shop?',
      description: 'Browse our full collection of doctor-recommended dry eye products.',
      primaryCTA: {label: 'Shop Products', to: '/collections/all'},
      secondaryCTA: {label: 'View Brands', to: '/collections'},
    };
  }

  if (lowercaseTitle.includes('about')) {
    return {
      title: 'Start Your Dry Eye Journey',
      description: 'Find the right products for your specific dry eye needs.',
      primaryCTA: {label: 'Shop by Symptom', to: '/symptoms'},
      secondaryCTA: {label: 'Contact Us', to: '/pages/contact'},
    };
  }

  if (lowercaseTitle.includes('faq') || lowercaseTitle.includes('questions')) {
    return {
      title: 'Still Have Questions?',
      description: 'Our dry eye specialists are here to help you find the perfect solution.',
      primaryCTA: {label: 'Contact Us', to: '/pages/contact'},
      secondaryCTA: {label: 'Shop Products', to: '/collections/all'},
    };
  }

  if (lowercaseTitle.includes('shipping') || lowercaseTitle.includes('delivery')) {
    return {
      title: 'Ready to Order?',
      description: 'Shop our collection and enjoy free shipping on orders over $89.',
      primaryCTA: {label: 'Shop Now', to: '/collections/all'},
      secondaryCTA: {label: 'Contact Support', to: '/pages/contact'},
    };
  }

  // Default CTA
  return {
    title: 'Need Help Finding Products?',
    description: 'Our team is here to help you find the right dry eye solutions.',
    primaryCTA: {label: 'Contact Us', to: '/pages/contact'},
    secondaryCTA: {label: 'Shop Products', to: '/collections/all'},
  };
}

const PAGE_QUERY = `#graphql
  query PageDetails($language: LanguageCode, $handle: String!)
  @inContext(language: $language) {
    page(handle: $handle) {
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
`;
