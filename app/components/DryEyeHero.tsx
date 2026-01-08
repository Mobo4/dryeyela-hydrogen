import { Link } from '~/components/Link';
import { Heading, Text } from '~/components/Text';
import { SHOP_CATEGORIES, SYMPTOMS } from '~/data/navigation';

import heroImage from '~/assets/hero-rescue.png';

export function DryEyeHero() {
  return (
    <section className="relative bg-besilos-frame text-besilos-navy overflow-hidden">
      {/* Background Pattern - Subtle Organic Shapes */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 15% 15%, rgba(107, 131, 109, 0.08) 0%, transparent 40%),
                           radial-gradient(circle at 85% 85%, rgba(168, 188, 161, 0.1) 0%, transparent 40%)`
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
            {/* Subheading */}
            <Text className="text-besilos-navy/80 font-semibold tracking-wider uppercase text-sm mb-2">
              Clinically Proven Solutions
            </Text>

            {/* Main Title "Nature" */}
            <Heading as="h1" size="display" className="text-besilos-sage leading-[1.1] font-sans font-bold text-[3.5rem] lg:text-[5rem] tracking-tight">
              Advanced Relief
            </Heading>

            {/* Description */}
            <Text as="p" size="lead" className="text-besilos-navy/70 max-w-sm font-sans leading-relaxed text-base">
              Discover our scientifically formulated dry eye solutions, derived from the purest natural ingredients.
            </Text>

            {/* Buttons */}
            <div className="flex flex-row gap-4 justify-center lg:justify-start pt-2">
              <Link
                to="/products/nature-drops"
                className="inline-flex items-center justify-center px-8 py-3 bg-besilos-primary text-white font-semibold rounded-lg hover:bg-besilos-primary/90 transition-all shadow-md"
              >
                Buy Now
              </Link>
              <Link
                to="/collections/all"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-besilos-navy font-medium rounded-2xl shadow-md hover:shadow-lg transition-all border border-besilos-navy/5"
              >
                Discover
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="w-full pt-8 border-t border-besilos-navy/5">
              <div className="flex flex-wrap gap-8 justify-center lg:justify-start items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-besilos-sage/10 flex items-center justify-center text-besilos-sage">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <span className="text-sm font-medium text-besilos-navy/80">Doctor Approved</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-besilos-sage/10 flex items-center justify-center text-besilos-sage">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                  </div>
                  <span className="text-sm font-medium text-besilos-navy/80">Free Shipping $89+</span>
                </div>
              </div>
            </div>
          </div>


          {/* Right Content - Hero Image */}
          <div className="hidden lg:block relative flex justify-center">
            <div className="absolute inset-0 bg-besilos-primary/10 rounded-full filter blur-3xl scale-90"></div>
            <img
              src={heroImage}
              alt="Advanced Dry Eye Relief Products"
              className="relative z-10 w-full max-w-md object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function ShippingBanner() {
  return (
    <div className="bg-besilos-navy text-besilos-cream py-2.5 px-4 tracking-wide border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <span className="font-medium">FREE Shipping on Orders $89+</span>
        </div>
        <span className="hidden md:inline text-white/60">|</span>
        <div className="hidden md:flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Doctor Recommended Products</span>
        </div>
        <span className="hidden lg:inline text-white/60">|</span>
        <div className="hidden lg:flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>Expert Support Available</span>
        </div>
      </div>
    </div>
  );
}

export function TrustBadges() {
  return (
    <section className="bg-besilos-cream py-12 border-y border-besilos-sage/10">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Doctor Recommended */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-besilos-sage/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-besilos-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-semibold text-besilos-navy mb-1">Doctor Recommended</h3>
            <p className="text-sm text-besilos-navy/60">Trusted by eye care professionals</p>
          </div>

          {/* Free Shipping */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-besilos-sage/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-besilos-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h3 className="font-semibold text-besilos-navy mb-1">Free Shipping</h3>
            <p className="text-sm text-besilos-navy/60">On all orders over $89</p>
          </div>

          {/* Easy Returns */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-besilos-sage/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-besilos-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="font-semibold text-besilos-navy mb-1">Easy Returns</h3>
            <p className="text-sm text-besilos-navy/60">30-day return policy</p>
          </div>

          {/* Secure Checkout */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-besilos-sage/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-besilos-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-besilos-navy mb-1">Secure Checkout</h3>
            <p className="text-sm text-besilos-navy/60">SSL encrypted transactions</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SymptomCTA() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="text-center mb-12">
          <Heading as="h2" size="heading" className="text-besilos-navy mb-4">
            Find Relief by Symptom
          </Heading>
          <Text as="p" className="text-besilos-navy/60 max-w-2xl mx-auto">
            Not sure what you need? Browse our curated product recommendations based on your specific dry eye symptoms.
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SYMPTOMS.map((symptom) => (
            <Link
              key={symptom.handle}
              to={`/symptoms/${symptom.handle}`}
              className="group p-6 bg-besilos-cream/50 rounded-2xl border border-besilos-sage/10 hover:border-besilos-sage/30 hover:shadow-lg transition-all duration-300"
              prefetch="intent"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-besilos-navy text-lg group-hover:text-besilos-sage transition-colors">
                  {symptom.title}
                </h3>
                <svg className="w-5 h-5 text-besilos-sage opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <p className="text-sm text-besilos-navy/60 line-clamp-2">{symptom.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {symptom.keywords.slice(0, 3).map((keyword) => (
                  <span key={keyword} className="text-xs bg-besilos-sage/10 text-besilos-sage px-2 py-1 rounded-full">
                    {keyword}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/symptoms"
            className="inline-flex items-center gap-2 text-besilos-sage font-semibold hover:underline"
          >
            View All Symptoms
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
