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
import { CategoryIcon } from '~/components/CategoryIcon';
import { Image } from '@shopify/hydrogen';

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
      {/* 1. Hero Section - Eyepromise Style */}
      <section className="relative w-full bg-gradient-to-br from-besilos-navy via-besilos-navy/95 to-besilos-blue/20 py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,154,222,0.15),transparent_60%)]"></div>
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-besilos-blue/10 rounded-full blur-3xl"></div>
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-white/20 animate-fade-in">
              Science-Backed Eye Care
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white leading-[1.1] mb-6 animate-fade-in">
              Your <span className="italic">Eyes</span>. Our <span className="italic">Promise</span>.
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-10 font-medium max-w-2xl mx-auto animate-fade-in">
              Clinically backed, doctor-recommended eye care solutions. So you can see the moments that matter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Link
                to={hero.ctaLink}
                className="inline-block bg-white text-besilos-navy px-10 py-4 font-bold uppercase tracking-wider hover:bg-gray-100 text-center transition-all transform hover:scale-105 active:scale-95 shadow-xl rounded-lg"
              >
                {hero.ctaText}
              </Link>
              <Link
                to="/pages/about"
                className="inline-block bg-transparent text-white border-2 border-white/50 px-10 py-4 font-bold uppercase tracking-wider hover:bg-white/10 text-center transition-all rounded-lg backdrop-blur-sm"
              >
                About DryEyeLA
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust Badges - Eyepromise Style with Numbers */}
      <section className="bg-white py-16 md:py-24 border-y border-gray-100">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            <TrustBadge
              number="4,500+"
              label="Customer Reviews"
              linkTo="/pages/about"
            />
            <TrustBadge
              number="20+"
              label="Years Experience"
              linkTo="/pages/about"
            />
            <TrustBadge
              number="100K+"
              label="Monthly Subscriptions"
              linkTo="/collections/all"
            />
            <TrustBadge
              number="100%"
              label="Doctor Approved"
              linkTo="/pages/about"
            />
          </div>
        </div>
      </section>

      {/* 3. Shop by Concern - Eyepromise Style */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <Heading as="h2" size="display" className="text-besilos-navy mb-4 text-4xl md:text-5xl">
              Clinically Backed Eye Care, Made Simple
            </Heading>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {['Eye Hydration', 'Eyelid & Lash Health', 'Aging Eyes', 'Macular Health', 'Visual Performance'].map((concern) => (
                <Link
                  key={concern}
                  to={`/symptoms/${concern.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-6 py-2 bg-gray-100 hover:bg-besilos-blue hover:text-white rounded-full text-sm font-semibold transition-all"
                >
                  {concern}
                </Link>
              ))}
            </div>
          </div>

          {/* Featured Products */}
          <Suspense fallback={
            <div className="swimlane-container">
              <div className="swimlane hiddenScroll">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="snap-start w-80 flex-shrink-0 h-[500px] bg-gray-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            </div>
          }>
            <Await resolve={featuredProducts}>
              {(response) => {
                if (!response?.products?.nodes || response.products.nodes.length === 0) {
                  return (
                    <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50">
                      <p className="text-gray-500 text-lg mb-4">Loading your perfect regimen...</p>
                      <Link to="/collections/all" className="text-besilos-blue hover:text-besilos-navy font-semibold">
                        Browse All Products →
                      </Link>
                    </div>
                  );
                }
                return (
                  <ProductSwimlane
                    products={response.products}
                    title=""
                    count={8}
                  />
                );
              }}
            </Await>
          </Suspense>
          
          <div className="text-center mt-12">
            <Link 
              to="/collections/all" 
              className="inline-flex items-center gap-2 text-besilos-blue font-semibold hover:text-besilos-navy transition-colors group text-sm uppercase tracking-wider"
            >
              View All Products
              <span className="group-hover:translate-x-1 transition-transform text-lg">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Shop by Category - New Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-besilos-gold/10 text-besilos-navy rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              Shop by Category
            </span>
            <Heading as="h2" size="display" className="text-besilos-navy mb-4 text-4xl md:text-5xl">
              Find Your Perfect Solution
            </Heading>
            <Text className="text-gray-600 text-lg max-w-2xl mx-auto">
              Browse our curated collections organized by product type to find exactly what you need.
            </Text>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { title: 'Eye Drops & Lubricants', handle: 'eye-drops-lubricants', icon: 'eye-drops', description: 'Preservative-free relief' },
              { title: 'Eyelid Care', handle: 'eyelid-cleansers', icon: 'eyelid', description: 'Cleansers & sprays' },
              { title: 'Eye Masks', handle: 'eye-masks', icon: 'eye-mask', description: 'Heat & cold therapy' },
              { title: 'Supplements', handle: 'vitamins-supplements', icon: 'supplements', description: 'Omega-3 & vitamins' },
              { title: 'Contact Lens Care', handle: 'contact-lens-supplies', icon: 'contact-lens', description: 'Solutions & supplies' },
              { title: 'All Products', handle: 'all', icon: 'all-products', description: 'Complete catalog' },
            ].map((category) => (
              <Link
                key={category.handle}
                to={`/collections/${category.handle}`}
                className="group relative bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-besilos-blue hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-gradient-to-br from-besilos-blue/10 to-besilos-blue/5 rounded-xl group-hover:from-besilos-blue/20 group-hover:to-besilos-blue/10 transition-all">
                    <CategoryIcon type={category.icon as any} className="text-besilos-blue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-besilos-navy mb-2 group-hover:text-besilos-blue transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{category.description}</p>
                  </div>
                  <span className="text-besilos-blue opacity-0 group-hover:opacity-100 transition-opacity text-xl flex-shrink-0">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Doctor Testimonials - Eyepromise Style */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <Heading as="h2" size="display" className="text-besilos-navy mb-4 text-4xl md:text-5xl">
              Trusted by Doctors
            </Heading>
            <Text className="text-gray-600 text-lg max-w-2xl mx-auto">
              Eye care professionals trust DryEyeLA for their patients' eye health needs.
            </Text>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Dr. Sarah Chen, OD',
                location: 'Los Angeles, CA',
                quote: 'DryEyeLA products have been essential in my practice. The quality and effectiveness are unmatched, and my patients consistently see improvement.',
              },
              {
                name: 'Dr. Michael Rodriguez, OD, FAAO',
                location: 'San Francisco, CA',
                quote: 'I recommend DryEyeLA to all my dry eye patients. The curated selection and clinical backing give me confidence in every product.',
              },
              {
                name: 'Dr. Jennifer Park, OD',
                location: 'San Diego, CA',
                quote: 'The comprehensive product range and expert curation make DryEyeLA my go-to resource for patient care. Outstanding results every time.',
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 text-lg mb-6 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="pt-4 border-t border-gray-100">
                  <div className="font-bold text-besilos-navy">{testimonial.name}</div>
                  <div className="text-gray-500 text-sm">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Customer Reviews - Eyepromise Style */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <Heading as="h2" size="display" className="text-besilos-navy mb-4 text-4xl md:text-5xl">
              Loved by Customers
            </Heading>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                product: 'DE3 Omega Benefits',
                rating: 4.7,
                review: 'This product has helped to hydrate my eyes from the inside out! I highly recommend it.',
                customer: 'Female, 65+',
              },
              {
                product: 'Avenova Lid & Lash Spray',
                rating: 4.71,
                review: 'My eye doctor recommended this and it has made such a difference. Very convenient online ordering.',
                customer: 'Carol B.',
              },
              {
                product: 'Cliradex Foam',
                rating: 4.58,
                review: 'I am eager to continue to use it to keep my eyes as healthy as possible.',
                customer: 'Anonymous',
              },
              {
                product: 'Restore Supplement',
                rating: 5.0,
                review: 'Eye doctor reports dramatic improvement in my eyes since I started taking Restore. Never miss a dose!',
                customer: 'Anonymous',
              },
            ].map((review, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                  <div className="text-sm font-semibold text-gray-700">{review.rating}</div>
                </div>
                <div className="font-semibold text-besilos-navy mb-2 text-sm">{review.product}</div>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">"{review.review}"</p>
                <div className="text-gray-500 text-xs">{review.customer}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Education Block - Redesigned */}
      <section className="py-20 md:py-32 bg-white border-y border-gray-100">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute inset-0 bg-gradient-to-br from-besilos-blue/10 to-besilos-gold/5 rounded-3xl transform rotate-3 scale-105 -z-10"></div>
              <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-3xl p-12 shadow-2xl border border-gray-100">
                <div className="aspect-[4/3] bg-gradient-to-br from-besilos-blue/5 to-besilos-gold/5 rounded-2xl overflow-hidden relative">
                  {/* Professional Eye Care Illustration */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-full h-full opacity-20" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="200" cy="150" r="80" stroke="currentColor" strokeWidth="3" className="text-besilos-blue"/>
                      <circle cx="200" cy="150" r="50" fill="currentColor" className="text-besilos-blue/30"/>
                      <path d="M150 150 L200 120 L250 150 L200 180 Z" fill="currentColor" className="text-besilos-blue/40"/>
                      <circle cx="180" cy="140" r="8" fill="currentColor" className="text-besilos-navy"/>
                      <circle cx="220" cy="140" r="8" fill="currentColor" className="text-besilos-navy"/>
                    </svg>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
                    <div className="w-24 h-24 bg-gradient-to-br from-besilos-blue to-besilos-blue/60 rounded-full flex items-center justify-center mb-6 shadow-lg">
                      <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="text-besilos-navy font-bold text-lg">Professional Eye Care</p>
                    <p className="text-gray-500 text-sm mt-2">Doctor-Recommended Solutions</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-block px-4 py-1.5 bg-besilos-blue/10 text-besilos-blue rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                {education.badge}
              </div>
              <Heading as="h2" size="display" className="text-besilos-navy mb-6 text-4xl md:text-5xl lg:text-6xl">
                {education.title}
              </Heading>
              <div className="relative mb-8">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-besilos-gold to-besilos-blue rounded-full"></div>
                <Text className="text-xl md:text-2xl text-besilos-navy/90 font-medium italic pl-8 leading-relaxed">
                  "{education.quote}"
                </Text>
              </div>
              <ul className="space-y-4 mb-10">
                {education.points.map((point, idx) => (
                  <CheckItem key={idx} text={point} />
                ))}
              </ul>
              <Link
                to={education.ctaLink}
                className="inline-flex items-center gap-3 bg-besilos-navy text-white px-8 py-4 font-bold uppercase tracking-wider hover:bg-besilos-navy/90 transition-all rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {education.ctaText}
                <span className="text-xl">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Newsletter CTA - New Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-besilos-navy via-besilos-navy/95 to-besilos-blue/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,154,222,0.2),transparent_60%)]"></div>
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-10 md:p-16 shadow-2xl border border-white/20">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-besilos-blue to-besilos-blue/80 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <Heading as="h2" size="display" className="text-besilos-navy mb-4 text-3xl md:text-4xl">
              Stay Updated on Eye Care
            </Heading>
            <Text className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Get expert tips, product updates, and exclusive offers delivered to your inbox.
            </Text>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-besilos-blue transition-colors"
              />
              <button
                type="submit"
                className="bg-besilos-navy text-white px-8 py-4 font-bold uppercase tracking-wider rounded-xl hover:bg-besilos-navy/90 transition-all shadow-lg hover:shadow-xl"
              >
                Subscribe
              </button>
            </form>
            <p className="text-gray-500 text-sm mt-4">We respect your privacy. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function TrustBadge({ number, label, linkTo }: { number: string; label: string; linkTo: string }) {
  const content = (
    <>
      <div className="text-4xl md:text-5xl font-bold text-besilos-navy mb-2">{number}</div>
      <div className="text-sm md:text-base text-gray-600 font-medium uppercase tracking-wider">{label}</div>
    </>
  );

  if (linkTo === '#') {
    return <div className="cursor-default">{content}</div>;
  }

  return (
    <Link
      to={linkTo}
      className="group block cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-besilos-blue/50 rounded-lg p-2 -m-2"
      aria-label={`${label} - ${number}`}
    >
      {content}
    </Link>
  );
}

function FeatureItem({ icon, label, linkTo }: { icon: React.ReactNode; label: string; linkTo: string }) {
  const content = (
    <>
      <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl shadow-lg group-hover:bg-white/20 group-hover:border-white/40 transition-all duration-300 group-hover:scale-110 mb-4">
        {icon}
      </div>
      <span className="font-heading font-bold uppercase tracking-wider text-white text-sm md:text-base leading-tight">
        {label}
      </span>
      <span className="text-white/60 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
        Learn more →
      </span>
    </>
  );

  // If linkTo is '#', render as non-clickable (fallback)
  if (linkTo === '#') {
    return (
      <li className="flex flex-col items-center text-center group cursor-default">
        {content}
      </li>
    );
  }

  // Otherwise, render as clickable link
  return (
    <li className="flex flex-col items-center text-center">
      <Link
        to={linkTo}
        className="group flex flex-col items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-besilos-navy rounded-xl p-2 -m-2 transition-all"
        aria-label={`${label} - Learn more`}
      >
        {content}
      </Link>
    </li>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-4 text-besilos-navy group">
      <div className="mt-0.5 w-7 h-7 flex-shrink-0 bg-gradient-to-br from-besilos-blue to-besilos-blue/80 text-white rounded-lg flex items-center justify-center text-sm font-bold shadow-md transform group-hover:scale-110 transition-transform">
        ✓
      </div>
      <span className="text-lg font-medium text-besilos-navy/90 leading-relaxed pt-0.5">{text}</span>
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
