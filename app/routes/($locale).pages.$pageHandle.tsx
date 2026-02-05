import {
  json,
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import invariant from 'tiny-invariant';
import {getSeoMeta} from '@shopify/hydrogen';

import {Link} from '@remix-run/react';
import {routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';
import {
  HeroSection,
  TrustBadgesSection,
  CTASection,
  PageHero,
  TrustBadges,
} from '~/components/sections';

export const headers = routeHeaders;

export async function loader({request, params, context}: LoaderFunctionArgs) {
  invariant(params.pageHandle, 'Missing page handle');

  // Step 1: Try to fetch from Shopify
  let shopifyPage = null;
  try {
    const result = await context.storefront.query(PAGE_QUERY, {
      variables: {
        handle: params.pageHandle,
        language: context.storefront.i18n.language,
      },
    });
    shopifyPage = result?.page;
  } catch (error) {
    console.warn(`[PageLoader] Shopify query failed for "${params.pageHandle}":`, error);
    // Continue to static fallback
  }

  // Step 2: Check for static fallback
  if (!shopifyPage) {
    const { STATIC_PAGES } = await import('~/data/static-pages');
    const staticPage = STATIC_PAGES[params.pageHandle];

    if (staticPage) {
      // Use static fallback
      const virtualPage = {
        id: `static-${params.pageHandle}`,
        title: staticPage.title,
        body: staticPage.body,
        seo: {
          title: staticPage.title,
          description: staticPage.description || '',
        },
      };

      const seo = seoPayload.page({page: virtualPage as any, url: request.url});
      return json({page: virtualPage, seo, isStatic: true});
    }

    // No Shopify page and no static fallback - 404
    throw new Response(null, {status: 404});
  }

  // Step 3: Use Shopify page
  const seo = seoPayload.page({page: shopifyPage, url: request.url});
  return json({page: shopifyPage, seo, isStatic: false});
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
      {/* Hero Section - Eyepromise Style */}
      <PageHero
        title={page.title}
        breadcrumbs={[
          {label: 'Home', to: '/'},
          {label: page.title},
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

      {/* Page Content - Eyepromise Style */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="bg-white rounded-2xl p-10 md:p-12 shadow-lg border border-gray-100">
            <div
              dangerouslySetInnerHTML={{__html: page.body}}
              className="prose prose-lg max-w-none prose-headings:text-besilos-navy prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-lg prose-a:text-besilos-blue prose-a:no-underline hover:prose-a:underline prose-strong:text-besilos-navy prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-lg"
            />
          </div>
        </div>
      </section>

      {/* CTA Section - Eyepromise Style */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-besilos-navy via-besilos-navy/95 to-besilos-blue/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,154,222,0.2),transparent_60%)]"></div>
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-10 md:p-16 shadow-2xl border border-white/20">
            <h2 className="text-besilos-navy mb-4 text-2xl md:text-3xl font-bold">
              {ctaContent.title}
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              {ctaContent.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {ctaContent.primaryCTA && (
                <Link
                  to={ctaContent.primaryCTA.to}
                  className="inline-block bg-besilos-navy text-white px-8 py-4 font-bold uppercase tracking-wider rounded-lg hover:bg-besilos-navy/90 transition-all shadow-lg"
                >
                  {ctaContent.primaryCTA.label}
                </Link>
              )}
              {ctaContent.secondaryCTA && (
                <Link
                  to={ctaContent.secondaryCTA.to}
                  className="inline-block bg-transparent text-besilos-navy border-2 border-besilos-navy px-8 py-4 font-bold uppercase tracking-wider rounded-lg hover:bg-gray-50 transition-all"
                >
                  {ctaContent.secondaryCTA.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
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
