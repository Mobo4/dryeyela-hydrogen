import { Link } from '@remix-run/react';

/**
 * Reusable Trust Badges Component - Eyepromise Style
 * Displays trust metrics with numbers
 */
export function TrustBadges({
  badges,
  className = '',
}: {
  badges: Array<{
    number: string;
    label: string;
    linkTo?: string;
  }>;
  className?: string;
}) {
  return (
    <section className={`py-12 md:py-16 bg-white border-y border-gray-100 ${className}`}>
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {badges.map((badge, idx) => {
            const content = (
              <>
                <div className="text-4xl md:text-5xl font-bold text-besilos-navy mb-2">{badge.number}</div>
                <div className="text-sm md:text-base text-gray-600 font-medium uppercase tracking-wider">{badge.label}</div>
              </>
            );

            if (!badge.linkTo || badge.linkTo === '#') {
              return <div key={idx} className="cursor-default">{content}</div>;
            }

            return (
              <Link
                key={idx}
                to={badge.linkTo}
                className="group block cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-besilos-blue/50 rounded-lg p-2 -m-2"
                aria-label={`${badge.label} - ${badge.number}`}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
