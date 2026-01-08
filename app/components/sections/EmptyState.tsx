import {Link} from '~/components/Link';
import {Heading, Text} from '~/components/Text';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: 'products' | 'search' | 'error' | 'coming-soon';
  primaryCTA?: {label: string; to: string};
  secondaryCTA?: {label: string; to: string};
  className?: string;
}

const icons = {
  products: (
    <svg className="w-12 h-12 text-besilos-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  search: (
    <svg className="w-12 h-12 text-besilos-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  error: (
    <svg className="w-12 h-12 text-besilos-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  'coming-soon': (
    <svg className="w-12 h-12 text-besilos-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export function EmptyState({
  title,
  description,
  icon = 'products',
  primaryCTA,
  secondaryCTA,
  className = '',
}: EmptyStateProps) {
  return (
    <section className={`py-20 bg-besilos-cream ${className}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="text-center max-w-lg mx-auto">
          {/* Icon */}
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-besilos-sage/10 flex items-center justify-center">
            {icons[icon]}
          </div>

          {/* Title */}
          <Heading as="h2" size="heading" className="text-besilos-navy mb-4">
            {title}
          </Heading>

          {/* Description */}
          {description && (
            <Text as="p" className="text-besilos-navy/60 mb-8">
              {description}
            </Text>
          )}

          {/* CTAs */}
          {(primaryCTA || secondaryCTA) && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {primaryCTA && (
                <Link
                  to={primaryCTA.to}
                  className="inline-flex items-center justify-center px-8 py-4 bg-besilos-sage text-white font-semibold rounded-full hover:bg-besilos-sage/90 transition-colors"
                >
                  {primaryCTA.label}
                </Link>
              )}
              {secondaryCTA && (
                <Link
                  to={secondaryCTA.to}
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-besilos-navy/30 text-besilos-navy font-semibold rounded-full hover:bg-besilos-navy/10 transition-colors"
                >
                  {secondaryCTA.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
