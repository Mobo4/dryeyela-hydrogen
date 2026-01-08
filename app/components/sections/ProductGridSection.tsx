import {Heading, Text} from '~/components/Text';
import {ProductCard} from '~/components/ProductCard';
import {Grid} from '~/components/Grid';
import type {ProductCardFragment} from 'storefrontapi.generated';

interface ProductGridSectionProps {
  title?: string;
  description?: string;
  products: ProductCardFragment[];
  columns?: 2 | 3 | 4;
  showCount?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function ProductGridSection({
  title,
  description,
  products,
  columns = 4,
  showCount = false,
  emptyMessage = 'No products found',
  className = '',
}: ProductGridSectionProps) {
  if (!products || products.length === 0) {
    return (
      <section className={`py-12 ${className}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-besilos-sage/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-besilos-sage"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <Heading as="h3" size="lead" className="text-besilos-navy mb-2">
              {emptyMessage}
            </Heading>
            <Text as="p" className="text-besilos-navy/60">
              Check back soon for new products.
            </Text>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-12 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {(title || description) && (
          <div className="text-center mb-10">
            {title && (
              <Heading as="h2" size="heading" className="text-besilos-navy mb-3">
                {title}
                {showCount && (
                  <span className="text-besilos-navy/50 text-lg ml-2">
                    ({products.length})
                  </span>
                )}
              </Heading>
            )}
            {description && (
              <Text as="p" className="text-besilos-navy/60 max-w-2xl mx-auto">
                {description}
              </Text>
            )}
          </div>
        )}

        <Grid items={columns} layout="products">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              loading={i < 8 ? 'eager' : undefined}
              quickAdd
            />
          ))}
        </Grid>
      </div>
    </section>
  );
}
