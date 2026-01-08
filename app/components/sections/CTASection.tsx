import {Link} from '~/components/Link';
import {Heading, Text} from '~/components/Text';

type CTAVariant = 'centered' | 'split';

interface CTASectionProps {
  title: string;
  description?: string;
  primaryCTA: {label: string; to: string};
  secondaryCTA?: {label: string; to: string};
  variant?: CTAVariant;
  background?: 'white' | 'cream' | 'navy';
  className?: string;
}

export function CTASection({
  title,
  description,
  primaryCTA,
  secondaryCTA,
  variant = 'centered',
  background = 'white',
  className = '',
}: CTASectionProps) {
  const backgrounds = {
    white: 'bg-white',
    cream: 'bg-besilos-cream',
    navy: 'bg-besilos-navy',
  };

  const textColors = {
    white: {
      title: 'text-besilos-navy',
      description: 'text-besilos-navy/70',
    },
    cream: {
      title: 'text-besilos-navy',
      description: 'text-besilos-navy/70',
    },
    navy: {
      title: 'text-besilos-cream',
      description: 'text-besilos-cream/70',
    },
  };

  const colors = textColors[background];

  if (variant === 'split') {
    return (
      <section className={`py-16 ${backgrounds[background]} ${className}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl">
              <Heading as="h2" size="heading" className={colors.title}>
                {title}
              </Heading>
              {description && (
                <Text as="p" className={`mt-2 ${colors.description}`}>
                  {description}
                </Text>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={primaryCTA.to}
                className="inline-flex items-center justify-center px-8 py-4 bg-besilos-sage text-white font-semibold rounded-full hover:bg-besilos-sage/90 transition-colors"
              >
                {primaryCTA.label}
              </Link>
              {secondaryCTA && (
                <Link
                  to={secondaryCTA.to}
                  className={`inline-flex items-center justify-center px-8 py-4 border-2 font-semibold rounded-full transition-colors ${
                    background === 'navy'
                      ? 'border-besilos-cream/30 text-besilos-cream hover:bg-besilos-cream/10'
                      : 'border-besilos-navy/30 text-besilos-navy hover:bg-besilos-navy/10'
                  }`}
                >
                  {secondaryCTA.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 ${backgrounds[background]} ${className}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="text-center max-w-2xl mx-auto">
          <Heading as="h2" size="heading" className={`${colors.title} mb-4`}>
            {title}
          </Heading>
          {description && (
            <Text as="p" className={`${colors.description} mb-8`}>
              {description}
            </Text>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={primaryCTA.to}
              className="inline-flex items-center justify-center px-8 py-4 bg-besilos-sage text-white font-semibold rounded-full hover:bg-besilos-sage/90 transition-colors"
            >
              {primaryCTA.label}
            </Link>
            {secondaryCTA && (
              <Link
                to={secondaryCTA.to}
                className={`inline-flex items-center justify-center px-8 py-4 border-2 font-semibold rounded-full transition-colors ${
                  background === 'navy'
                    ? 'border-besilos-cream/30 text-besilos-cream hover:bg-besilos-cream/10'
                    : 'border-besilos-navy/30 text-besilos-navy hover:bg-besilos-navy/10'
                }`}
              >
                {secondaryCTA.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
