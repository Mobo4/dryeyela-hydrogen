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
import type {NonNullableFields} from '~/lib/type';
import {
  HeroSection,
  TrustBadgesSection,
  CTASection,
} from '~/components/sections';

export const headers = routeHeaders;

export async function loader({
  request,
  context: {storefront},
}: LoaderFunctionArgs) {
  const data = await storefront.query(POLICIES_QUERY);

  invariant(data, 'No data returned from Shopify API');
  const policies = Object.values(
    data.shop as NonNullableFields<typeof data.shop>,
  ).filter(Boolean);

  if (policies.length === 0) {
    throw new Response('Not found', {status: 404});
  }

  const seo = seoPayload.policies({policies, url: request.url});

  return json({
    policies,
    seo,
  });
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

// Policy icon mapping
const policyIcons: Record<string, React.ReactNode> = {
  'privacy-policy': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  'shipping-policy': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
  ),
  'terms-of-service': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  'refund-policy': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
    </svg>
  ),
};

export default function Policies() {
  const {policies} = useLoaderData<typeof loader>();

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        title="Store Policies"
        subtitle="Transparency and trust are at the heart of everything we do"
        breadcrumbs={[
          {label: 'Home', to: '/'},
          {label: 'Policies'},
        ]}
        size="small"
        background="cream"
      />

      {/* Policies Grid */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="grid gap-6 md:grid-cols-2">
            {policies.map((policy) => {
              if (!policy) return null;
              const icon = policyIcons[policy.handle] || (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              );

              return (
                <Link
                  key={policy.id}
                  to={`/policies/${policy.handle}`}
                  className="group p-6 bg-besilos-cream/50 rounded-xl border border-besilos-sage/10 hover:border-besilos-sage/30 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-besilos-sage/10 text-besilos-sage flex items-center justify-center group-hover:bg-besilos-sage group-hover:text-white transition-colors">
                      {icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-besilos-navy group-hover:text-besilos-sage transition-colors">
                        {policy.title}
                      </h3>
                      <p className="text-sm text-besilos-navy/60 mt-1">
                        Click to read our full {policy.title.toLowerCase()}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadgesSection variant="expanded" />

      {/* CTA Section */}
      <CTASection
        title="Questions About Our Policies?"
        description="We're here to help clarify any questions you may have about shipping, returns, or privacy."
        primaryCTA={{label: 'Contact Us', to: '/pages/contact'}}
        secondaryCTA={{label: 'Shop Products', to: '/collections/all'}}
        variant="centered"
        background="navy"
      />
    </>
  );
}

const POLICIES_QUERY = `#graphql
  fragment PolicyIndex on ShopPolicy {
    id
    title
    handle
  }

  query PoliciesIndex {
    shop {
      privacyPolicy {
        ...PolicyIndex
      }
      shippingPolicy {
        ...PolicyIndex
      }
      termsOfService {
        ...PolicyIndex
      }
      refundPolicy {
        ...PolicyIndex
      }
      subscriptionPolicy {
        id
        title
        handle
      }
    }
  }
`;
