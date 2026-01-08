import {Link} from '~/components/Link';
import {Heading, Text} from '~/components/Text';

interface CategoryCard {
  title: string;
  description?: string;
  handle: string;
  to: string;
  image?: string;
  keywords?: string[];
}

interface CategoryCardsSectionProps {
  title?: string;
  description?: string;
  cards: CategoryCard[];
  columns?: 2 | 3 | 4;
  variant?: 'default' | 'featured';
  className?: string;
}

export function CategoryCardsSection({
  title,
  description,
  cards,
  columns = 3,
  variant = 'default',
  className = '',
}: CategoryCardsSectionProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <section className={`py-16 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {(title || description) && (
          <div className="text-center mb-12">
            {title && (
              <Heading as="h2" size="heading" className="text-besilos-navy mb-4">
                {title}
              </Heading>
            )}
            {description && (
              <Text as="p" className="text-besilos-navy/60 max-w-2xl mx-auto">
                {description}
              </Text>
            )}
          </div>
        )}

        <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6`}>
          {cards.map((card) => (
            <Link
              key={card.handle}
              to={card.to}
              className="group block bg-besilos-cream/50 rounded-2xl border border-besilos-sage/10 hover:border-besilos-sage/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
              prefetch="intent"
            >
              {/* Image if provided */}
              {card.image && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <Heading
                    as="h3"
                    size="lead"
                    className="text-besilos-navy group-hover:text-besilos-sage transition-colors"
                  >
                    {card.title}
                  </Heading>
                  <svg
                    className="w-5 h-5 text-besilos-sage opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>

                {card.description && (
                  <Text as="p" size="fine" className="text-besilos-navy/60 line-clamp-2">
                    {card.description}
                  </Text>
                )}

                {/* Keyword tags */}
                {card.keywords && card.keywords.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {card.keywords.slice(0, 3).map((keyword) => (
                      <span
                        key={keyword}
                        className="text-xs bg-besilos-sage/10 text-besilos-sage px-2 py-1 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
