import {Heading, Text} from '~/components/Text';

type TrustBadgeVariant = 'expanded' | 'compact';

interface TrustBadgesSectionProps {
  variant?: TrustBadgeVariant;
  className?: string;
}

const badges = [
  {
    icon: (
      <svg className="w-8 h-8 text-besilos-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Doctor Recommended',
    description: 'Trusted by eye care professionals',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-besilos-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
    title: 'Free Shipping',
    description: 'On all orders over $100',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-besilos-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: 'Easy Returns',
    description: '30-day return policy',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-besilos-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Secure Checkout',
    description: 'SSL encrypted transactions',
  },
];

export function TrustBadgesSection({
  variant = 'expanded',
  className = '',
}: TrustBadgesSectionProps) {
  if (variant === 'compact') {
    return (
      <section className={`bg-besilos-cream py-6 border-y border-besilos-sage/10 ${className}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {badges.map((badge) => (
              <div key={badge.title} className="flex items-center gap-2">
                <div className="w-6 h-6 text-besilos-sage flex-shrink-0">
                  {badge.icon}
                </div>
                <span className="text-sm font-medium text-besilos-navy">
                  {badge.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`bg-besilos-cream py-12 border-y border-besilos-sage/10 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {badges.map((badge) => (
            <div key={badge.title} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-besilos-sage/10 flex items-center justify-center">
                {badge.icon}
              </div>
              <Heading as="h3" size="copy" className="font-semibold text-besilos-navy mb-1">
                {badge.title}
              </Heading>
              <Text as="p" size="fine" className="text-besilos-navy/60">
                {badge.description}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
