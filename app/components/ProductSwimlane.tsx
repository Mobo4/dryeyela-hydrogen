import type { HomepageFeaturedProductsQuery } from 'storefrontapi.generated';
import { Section } from '~/components/Text';
import { ProductCard } from '~/components/ProductCard';

const mockProducts = {
  nodes: new Array(12).fill(''),
};

type ProductSwimlaneProps = HomepageFeaturedProductsQuery & {
  title?: string;
  count?: number;
};

export function ProductSwimlane({
  title = 'Featured Products',
  products = mockProducts,
  count = 12,
  ...props
}: ProductSwimlaneProps) {
  return (
    <Section heading={title} padding="y" className="bg-besilos-frame/30" headingClassName="text-besilos-sage font-bold text-3xl mb-8" {...props}>
      <div className="swimlane-container">
        <div className="swimlane hiddenScroll md:pb-8 md:scroll-px-8 lg:scroll-px-12 md:px-8 lg:px-12">
          {products.nodes.slice(0, count).map((product) => (
            <ProductCard
              product={product}
              key={product.id}
              className="snap-start w-80 flex-shrink-0"
              quickAdd={true}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
