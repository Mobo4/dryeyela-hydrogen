import type { ProductCardFragment } from 'storefrontapi.generated';
import { ProductCarousel } from './ProductCarousel';

const mockProducts = {
  nodes: new Array(12).fill(''),
};

type ProductsData = {
  products: {
    nodes: ProductCardFragment[];
  };
};

type ProductSwimlaneProps = ProductsData & {
  title?: string;
  count?: number;
  className?: string;
};

/**
 * ProductSwimlane - Carousel component for displaying products
 * 
 * Features:
 * - Responsive card sizing based on viewport
 * - Navigation arrows (desktop)
 * - Touch/swipe support (mobile)
 * - Pagination dots (mobile)
 * - No cut-off products
 * - Proper spacing and padding
 */
export function ProductSwimlane({
  title = 'Featured Products',
  products = mockProducts,
  count = 12,
  className = '',
  ...props
}: ProductSwimlaneProps) {
  return (
    <ProductCarousel
      title={title}
      products={products}
      count={count}
      className={className}
      {...props}
    />
  );
}
