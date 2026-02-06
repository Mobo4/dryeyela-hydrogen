import {Link} from '~/components/Link';
import {Heading, Text} from '~/components/Text';

type HeroVariant = 'primary' | 'secondary' | 'minimal';
type HeroSize = 'small' | 'medium' | 'large';
type HeroBackground = 'navy' | 'cream' | 'white';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  variant?: HeroVariant;
  size?: HeroSize;
  background?: HeroBackground;
  backgroundImage?: string;
  breadcrumbs?: Array<{label: string; to?: string}>;
  primaryCTA?: {label: string; to: string};
  secondaryCTA?: {label: string; to: string};
  badge?: string;
  children?: React.ReactNode;
}

export function HeroSection({
  title,
  subtitle,
  description,
  variant = 'primary',
  size = 'medium',
  background,
  backgroundImage,
  breadcrumbs,
  primaryCTA,
  secondaryCTA,
  badge,
  children,
}: HeroSectionProps) {
  // Size-based padding classes
  const sizeClasses = {
    small: 'py-8 md:py-12 lg:py-14',
    medium: 'py-12 md:py-16 lg:py-20',
    large: 'py-16 md:py-20 lg:py-28',
  };

  // Background colors - background prop takes precedence over variant
  const backgroundColors = {
    navy: 'bg-besilos-navy',
    cream: 'bg-besilos-cream',
    white: 'bg-white',
  };

  const variantBackgrounds = {
    primary: 'bg-besilos-navy',
    secondary: 'bg-besilos-cream',
    minimal: 'bg-white',
  };

  // Determine which background to use
  const bgClass = background ? backgroundColors[background] : variantBackgrounds[variant];

  // Determine variant for text colors based on background or variant
  const effectiveVariant = background
    ? (background === 'navy' ? 'primary' : background === 'cream' ? 'secondary' : 'minimal')
    : variant;

  const textColors = {
    primary: {
      title: 'text-besilos-cream',
      subtitle: 'text-besilos-sage',
      description: 'text-besilos-cream/80',
      breadcrumb: 'text-besilos-sage hover:underline',
    },
    secondary: {
      title: 'text-besilos-navy',
      subtitle: 'text-besilos-sage',
      description: 'text-besilos-navy/70',
      breadcrumb: 'text-besilos-sage hover:underline',
    },
    minimal: {
      title: 'text-besilos-navy',
      subtitle: 'text-besilos-sage',
      description: 'text-besilos-navy/70',
      breadcrumb: 'text-besilos-sage hover:underline',
    },
  };

  const colors = textColors[effectiveVariant];

  return (
    <section
      className={`relative ${bgClass} overflow-hidden`}
      style={
        backgroundImage
          ? {
              backgroundImage: `linear-gradient(rgba(44, 62, 80, 0.85), rgba(44, 62, 80, 0.9)), url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      {/* Subtle gradient overlay for primary variant */}
      {effectiveVariant === 'primary' && !backgroundImage && (
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(168, 188, 161, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(168, 188, 161, 0.2) 0%, transparent 50%)`,
          }}
        />
      )}

      <div className={`relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12 ${sizeClasses[size]}`}>
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                  {index > 0 && (
                    <span className={colors.description}>/</span>
                  )}
                  {crumb.to ? (
                    <Link to={crumb.to} className={colors.breadcrumb}>
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={colors.description}>{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          {badge && (
            <div className="inline-block bg-besilos-sage/20 text-besilos-sage px-4 py-2 rounded-full text-sm font-medium mb-6">
              {badge}
            </div>
          )}

          {/* Subtitle */}
          {subtitle && (
            <Text
              as="p"
              size="fine"
              className={`${colors.subtitle} uppercase tracking-widest mb-3`}
            >
              {subtitle}
            </Text>
          )}

          {/* Title */}
          <Heading as="h1" size="display" className={`${colors.title} mb-6`}>
            {title}
          </Heading>

          {/* Description */}
          {description && (
            <Text
              as="p"
              size="lead"
              className={`${colors.description} max-w-2xl mx-auto mb-8`}
            >
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
                  className={`inline-flex items-center justify-center px-8 py-4 border-2 font-semibold rounded-full transition-colors ${
                    effectiveVariant === 'primary'
                      ? 'border-besilos-cream/30 text-besilos-cream hover:bg-besilos-cream/10'
                      : 'border-besilos-navy/30 text-besilos-navy hover:bg-besilos-navy/10'
                  }`}
                >
                  {secondaryCTA.label}
                </Link>
              )}
            </div>
          )}

          {/* Custom children content */}
          {children}
        </div>
      </div>
    </section>
  );
}
