import { Link } from '@remix-run/react';
import { Heading, Text } from '~/components/Text';

/**
 * Reusable Page Hero Component - Eyepromise Style
 * Used across all pages for consistent hero sections
 */
export function PageHero({
  title,
  subtitle,
  description,
  badge,
  primaryCTA,
  secondaryCTA,
  breadcrumbs,
  background = 'gradient',
}: {
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  primaryCTA?: { label: string; to: string };
  secondaryCTA?: { label: string; to: string };
  breadcrumbs?: Array<{ label: string; to: string }>;
  background?: 'gradient' | 'white' | 'navy';
}) {
  const backgroundClasses = {
    gradient: 'bg-gradient-to-br from-besilos-navy via-besilos-navy/95 to-besilos-blue/20',
    white: 'bg-white',
    navy: 'bg-besilos-navy',
  };

  const textColor = background === 'navy' ? 'text-white' : 'text-besilos-navy';
  const textColorMuted = background === 'navy' ? 'text-white/90' : 'text-gray-600';

  return (
    <section className={`relative w-full py-16 md:py-24 overflow-hidden ${backgroundClasses[background]}`}>
      {background === 'gradient' && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,154,222,0.15),transparent_60%)]"></div>
      )}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 relative z-10">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm">
              {breadcrumbs.map((crumb, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  {idx > 0 && <span className={textColorMuted}>/</span>}
                  <Link
                    to={crumb.to}
                    className={`${textColorMuted} hover:${textColor} transition-colors`}
                  >
                    {crumb.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="max-w-4xl mx-auto text-center">
          {badge && (
            <div className={`inline-block px-4 py-1.5 ${background === 'navy' ? 'bg-white/10 backdrop-blur-sm border border-white/20 text-white' : 'bg-besilos-blue/10 text-besilos-blue'} rounded-full text-xs font-bold uppercase tracking-widest mb-6`}>
              {badge}
            </div>
          )}
          
          {subtitle && (
            <Text className={`${textColorMuted} text-sm md:text-base uppercase tracking-widest mb-4 font-semibold`}>
              {subtitle}
            </Text>
          )}
          
          <Heading 
            as="h1" 
            size="display" 
            className={`${textColor} mb-6 text-4xl md:text-5xl lg:text-6xl leading-tight`}
          >
            {title}
          </Heading>
          
          {description && (
            <Text className={`${textColorMuted} text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto`}>
              {description}
            </Text>
          )}

          {(primaryCTA || secondaryCTA) && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {primaryCTA && (
                <Link
                  to={primaryCTA.to}
                  className={`inline-block ${background === 'navy' ? 'bg-white text-besilos-navy hover:bg-gray-100' : 'bg-besilos-navy text-white hover:bg-besilos-navy/90'} px-10 py-4 font-bold uppercase tracking-wider text-center transition-all transform hover:scale-105 active:scale-95 shadow-xl rounded-lg`}
                >
                  {primaryCTA.label}
                </Link>
              )}
              {secondaryCTA && (
                <Link
                  to={secondaryCTA.to}
                  className={`inline-block ${background === 'navy' ? 'bg-transparent text-white border-2 border-white/50 hover:bg-white/10' : 'bg-transparent text-besilos-navy border-2 border-besilos-navy hover:bg-gray-50'} px-10 py-4 font-bold uppercase tracking-wider text-center transition-all rounded-lg backdrop-blur-sm`}
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
