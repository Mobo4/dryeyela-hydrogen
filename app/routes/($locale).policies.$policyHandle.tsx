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
  invariant(params.policyHandle, 'Missing policy handle');

  const policyName = params.policyHandle.replace(
    /-([a-z])/g,
    (_: unknown, m1: string) => m1.toUpperCase(),
  ) as 'privacyPolicy' | 'shippingPolicy' | 'termsOfService' | 'refundPolicy';

  const data = await context.storefront.query(POLICY_CONTENT_QUERY, {
    variables: {
      privacyPolicy: false,
      shippingPolicy: false,
      termsOfService: false,
      refundPolicy: false,
      [policyName]: true,
      language: context.storefront.i18n.language,
    },
  });

  invariant(data, 'No data returned from Shopify API');
  const policy = data.shop?.[policyName];

  if (!policy) {
    throw new Response(null, {status: 404});
  }

  const seo = seoPayload.policy({policy, url: request.url});

  return json({policy, seo});
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function PolicyPage() {
  const {policy} = useLoaderData<typeof loader>();

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        title={policy.title}
        breadcrumbs={[
          {label: 'Home', to: '/'},
          {label: 'Policies', to: '/policies'},
          {label: policy.title},
        ]}
        size="small"
        background="cream"
      />

      {/* Policy Content */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12">
          {/* Back Link */}
          <Link
            to="/policies"
            className="inline-flex items-center gap-2 text-besilos-sage hover:text-besilos-sage/80 mb-8 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Policies
          </Link>

          {/* Policy Body */}
          <div
            dangerouslySetInnerHTML={{__html: policy.body}}
            className="prose prose-lg max-w-none prose-headings:text-besilos-navy prose-headings:font-bold prose-p:text-besilos-navy/80 prose-a:text-besilos-sage prose-a:no-underline hover:prose-a:underline prose-strong:text-besilos-navy prose-ul:text-besilos-navy/80 prose-ol:text-besilos-navy/80 prose-li:marker:text-besilos-sage"
          />

          {/* Last Updated */}
          <div className="mt-12 pt-6 border-t border-besilos-sage/10">
            <p className="text-sm text-besilos-navy/60">
              This policy was last updated and is effective immediately.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadgesSection variant="compact" />

      {/* CTA Section */}
      <CTASection
        title="Questions About This Policy?"
        description="Our team is here to help clarify any questions you may have."
        primaryCTA={{label: 'Contact Us', to: '/pages/contact'}}
        secondaryCTA={{label: 'Shop Products', to: '/collections/all'}}
        variant="centered"
        background="navy"
      />
    </>
  );
}

const POLICY_CONTENT_QUERY = `#graphql
  fragment PolicyHandle on ShopPolicy {
    body
    handle
    id
    title
    url
  }

  query PoliciesHandle(
    $language: LanguageCode
    $privacyPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
    $refundPolicy: Boolean!
  ) @inContext(language: $language) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        ...PolicyHandle
      }
      shippingPolicy @include(if: $shippingPolicy) {
        ...PolicyHandle
      }
      termsOfService @include(if: $termsOfService) {
        ...PolicyHandle
      }
      refundPolicy @include(if: $refundPolicy) {
        ...PolicyHandle
      }
    }
  }
`;
