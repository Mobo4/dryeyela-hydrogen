import {
  defer,
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import { Suspense } from 'react';
import { Await, useLoaderData } from '@remix-run/react';
import { getSeoMeta } from '@shopify/hydrogen';

import { Link } from '@remix-run/react';
import { Heading, Text } from '~/components/Text';
import { ProductSwimlane } from '~/components/ProductSwimlane';
import { PRODUCT_CARD_FRAGMENT } from '~/data/fragments';
import { seoPayload } from '~/lib/seo.server';
import { routeHeaders } from '~/data/cache';
import homepageConfig from '~/data/homepage.json';

export const headers = routeHeaders;

export async function loader(args: LoaderFunctionArgs) {
  const { params, context } = args;
  const { language, country } = context.storefront.i18n;

  if (
    params.locale &&
    params.locale.toLowerCase() !== `${language}-${country}`.toLowerCase()
  ) {
    throw new Response(null, { status: 404 });
  }

  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return defer({ ...deferredData, ...criticalData });
}

async function loadCriticalData({ context, request }: LoaderFunctionArgs) {
  const { shop } = await context.storefront.query(SHOP_QUERY);

  return {
    shop,
    seo: seoPayload.home({ url: request.url }),
  };
}

function loadDeferredData({ context }: LoaderFunctionArgs) {
  const { language, country } = context.storefront.i18n;

  const featuredProducts = context.storefront
    .query(HOMEPAGE_FEATURED_PRODUCTS_QUERY, {
      variables: {
        country,
        language,
      },
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    featuredProducts,
  };
}

export const meta = ({ matches }: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Homepage() {
  const { featuredProducts } = useLoaderData<typeof loader>();
  const { hero, features, education } = homepageConfig;

  return (
    <div className="homepage bg-white">
      {/* 1. Hero Section */}
      <section className="relative w-full h-[450px] md:h-[600px] overflow-hidden">
        <picture>
          <source
            media="(min-width: 768px)"
            srcSet={hero.image}
          />
          <img
            src={hero.mobileImage}
            alt={hero.title}
            className="w-full h-full object-cover"
          />
        </picture>

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[1600px] mx-auto px-4 md:px-8 w-full">
            <div className="max-w-[600px] md:bg-white/40 md:backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/30 shadow-2xl">
              <span className="inline-block px-4 py-1 bg-besilos-blue text-white rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                Premium Eye Care
              </span>
              <h1 className="text-[40px] md:text-[64px] font-heading font-bold text-besilos-navy leading-[1.1] mb-6">
                {hero.title}
              </h1>
              <p className="text-xl text-besilos-navy/90 leading-relaxed mb-10 font-medium max-w-[500px]">
                {hero.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to={hero.ctaLink}
                  className="inline-block bg-besilos-navy text-white px-10 py-4 font-bold uppercase tracking-wider hover:bg-besilos-navy/90 text-center transition-all transform hover:scale-105 active:scale-95 shadow-xl"
                >
                  {hero.ctaText}
                </Link>
                <Link
                  to="/pages/about"
                  className="inline-block bg-white text-besilos-navy border-2 border-besilos-navy px-10 py-4 font-bold uppercase tracking-wider hover:bg-gray-50 text-center transition-all shadow-md"
                >
                  Our Philosophy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Features Line */}
      <section className="bg-besilos-navy py-14 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 relative z-10">
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, idx) => (
              <FeatureItem
                key={idx}
                icon={getIcon(feature.icon)}
                label={feature.label}
              />
            ))}
          </ul>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-besilos-blue/10 rounded-full -mr-48 -mt-48 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-besilos-gold/5 rounded-full -ml-32 -mb-32 blur-[80px]"></div>
      </section>

      {/* 3. Featured Products Section */}
      <section className="py-28">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6 text-left">
            <div>
              <span className="text-besilos-blue font-bold uppercase tracking-widest text-xs mb-3 block">Expert Selections</span>
              <Heading as="h2" size="display" className="text-besilos-navy mb-4">DryEyeLA Best Sellers</Heading>
              <Text className="text-gray-500 text-lg max-w-2xl">Discover our most trusted solutions for optimal ocular health and visual clarity.</Text>
            </div>
            <Link to="/collections/all" className="text-besilos-blue font-bold hover:text-besilos-navy transition-colors flex items-center gap-2 group text-sm uppercase tracking-widest">
              Explore All Products
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <Suspense fallback={<div className="h-96 bg-gray-50 rounded-3xl animate-pulse" />}>
            <Await resolve={featuredProducts}>
              {(response) => {
                if (!response?.products?.nodes) return <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl text-gray-400">Loading your perfect regimen...</div>;
                return (
                  <ProductSwimlane
                    products={response.products}
                    title=""
                    count={4}
                  />
                );
              }}
            </Await>
          </Suspense>
        </div>
      </section>

      {/* 4. Global Education Block */}
      <section className="bg-besilos-cream py-28 border-y border-gray-100 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 text-left">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-besilos-blue/10 rounded-[2rem] transform translate-x-6 translate-y-6 -z-10 transition-transform group-hover:translate-x-4 group-hover:translate-y-4"></div>
              <img
                src={education.image}
                alt="Professional Care"
                className="rounded-[2rem] shadow-2xl w-full object-cover aspect-[4/3] relative z-10"
              />
            </div>
            <div className="lg:pl-10">
              <div className="inline-block px-5 py-1.5 bg-besilos-blue/10 text-besilos-blue rounded-full text-[11px] font-bold uppercase tracking-widest mb-8">
                {education.badge}
              </div>
              <Heading as="h2" size="display" className="text-besilos-navy mb-10 text-4xl md:text-6xl">{education.title}</Heading>
              <Text className="text-xl md:text-2xl text-besilos-navy/80 mb-12 stroke-besilos-navy font-medium italic border-l-4 border-besilos-gold pl-6 py-2 leading-relaxed">
                "{education.quote}"
              </Text>
              <ul className="space-y- gap-4 grid grid-cols-1 md:grid-cols-2">
                {education.points.map((point, idx) => (
                  <CheckItem key={idx} text={point} />
                ))}
              </ul>
              <div className="mt-16">
                <Link
                  to={education.ctaLink}
                  className="inline-flex items-center gap-4 bg-besilos-navy text-white px-10 py-4 font-bold uppercase tracking-wider hover:bg-besilos-navy/90 transition-all rounded-lg shadow-xl"
                >
                  {education.ctaText}
                  <span className="text-xl">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <li className="flex items-center gap-6 group">
      <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-white/5 border border-white/20 rounded-2xl shadow-inner backdrop-blur-sm group-hover:bg-white/10 transition-all group-hover:scale-110">
        {icon}
      </div>
      <span className="font-heading font-bold uppercase tracking-widest text-white text-sm md:text-base leading-tight">
        {label}
      </span>
    </li>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-4 text-besilos-navy group">
      <div className="mt-1 w-6 h-6 flex-shrink-0 bg-besilos-blue text-white rounded-full flex items-center justify-center text-[10px] transform group-hover:scale-110 transition-transform">
        ✓
      </div>
      <span className="text-lg font-medium opacity-90 leading-tight">{text}</span>
    </li>
  );
}

function getIcon(type: string) {
  switch (type) {
    case 'shipping':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
          <rect x="1" y="3" width="15" height="13"></rect>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
          <circle cx="5.5" cy="18.5" r="2.5"></circle>
          <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
      );
    case 'doctor':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      );
    case 'shield':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
        </svg>
      );
    default:
      return null;
  }
}

const SHOP_QUERY = `#graphql
  query ShopInfo {
    shop {
      name
      description
    }
  }
`;

export const HOMEPAGE_FEATURED_PRODUCTS_QUERY = `#graphql
  query homepageFeaturedProducts($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 8) {
      nodes {
        id
        title
        handle
        vendor
        publishedAt
        featuredImage {
          url
          altText
          width
          height
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 1) {
          nodes {
            id
            availableForSale
            image {
              url
              altText
              width
              height
            }
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;
