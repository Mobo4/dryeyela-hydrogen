import clsx from 'clsx';
import { flattenConnection, Image, Money, useMoney } from '@shopify/hydrogen';
import type { MoneyV2, Product } from '@shopify/hydrogen/storefront-api-types';

import type { ProductCardFragment } from 'storefrontapi.generated';
import { Text } from '~/components/Text';
import { Link } from '~/components/Link';
import { Button } from '~/components/Button';
import { AddToCartButton } from '~/components/AddToCartButton';
import { isDiscounted, isNewArrival } from '~/lib/utils';
import { getProductPlaceholder } from '~/lib/placeholders';

export function ProductCard({
  product,
  label,
  className,
  loading,
  onClick,
  quickAdd,
}: {
  product: ProductCardFragment;
  label?: string;
  className?: string;
  loading?: HTMLImageElement['loading'];
  onClick?: () => void;
  quickAdd?: boolean;
}) {
  let cardLabel;

  const cardProduct: Product = product?.variants
    ? (product as Product)
    : getProductPlaceholder();
  if (!cardProduct?.variants?.nodes?.length) return null;

  const firstVariant = flattenConnection(cardProduct.variants)[0];

  if (!firstVariant) return null;
  const { image, price, compareAtPrice } = firstVariant;

  // Premium: Get secondary image for hover effect
  const media = flattenConnection(product.media || { nodes: [] });
  const secondaryImage = media[1]?.image;

  if (label) {
    cardLabel = label;
  } else if (isDiscounted(price as MoneyV2, compareAtPrice as MoneyV2)) {
    cardLabel = 'Sale';
  } else if (isNewArrival(product.publishedAt)) {
    cardLabel = 'New';
  }

  return (
    <div className="flex flex-col gap-2 group relative">
      <Link
        onClick={onClick}
        to={`/products/${product.handle}`}
        prefetch="intent"
      >
        <div className={clsx('grid gap-4', className)}>
          <div className="card-image aspect-[4/5] bg-besilos-cream/20 rounded-xl overflow-hidden relative shadow-sm transition-all duration-500 group-hover:shadow-md border border-besilos-sage/10">
            {/* Primary Image */}
            {image && (
              <Image
                className={clsx(
                  "object-cover w-full h-full transition-all duration-700",
                  secondaryImage ? "group-hover:opacity-0" : "group-hover:scale-105"
                )}
                sizes="(min-width: 64em) 25vw, (min-width: 48em) 30vw, 45vw"
                aspectRatio="4/5"
                data={image}
                alt={image.altText || `Picture of ${product.title}`}
                loading={loading}
              />
            )}

            {/* Secondary Image (Hover) */}
            {secondaryImage && (
              <Image
                className="absolute inset-0 object-cover w-full h-full opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
                sizes="(min-width: 64em) 25vw, (min-width: 48em) 30vw, 45vw"
                aspectRatio="4/5"
                data={secondaryImage}
                alt={secondaryImage.altText || `Picture of ${product.title}`}
                loading={loading}
              />
            )}

            {/* Badges - Glassmorphism */}
            <Text
              as="label"
              size="fine"
              className="absolute top-3 right-3 text-right text-xs font-medium tracking-wide uppercase"
            >
              {cardLabel && (
                <span className="backdrop-blur-md bg-white/70 text-besilos-navy px-3 py-1 rounded-full shadow-sm border border-besilos-blue/10">
                  {cardLabel}
                </span>
              )}
            </Text>

            {/* Quick Add - Appears on Hover */}
            {quickAdd && firstVariant.availableForSale && (
              <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <AddToCartButton
                  lines={[{
                    merchandiseId: firstVariant.id,
                    quantity: 1,
                  }]}
                  className="w-full bg-white/90 backdrop-blur text-besilos-navy hover:bg-besilos-navy hover:text-white font-medium py-3 rounded-lg shadow-lg border border-besilos-navy/10 transition-all"
                >
                  Quick Add
                </AddToCartButton>
              </div>
            )}
          </div>

          <div className="grid gap-1 px-1">
            <h3 className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-besilos-navy font-medium text-lg tracking-tight group-hover:text-besilos-sage transition-colors font-serif">
              {product.title}
            </h3>
            <div className="flex gap-2 items-baseline">
              <span className="text-besilos-navy/90 font-semibold">
                <Money withoutTrailingZeros data={price!} />
              </span>
              {isDiscounted(price as MoneyV2, compareAtPrice as MoneyV2) && (
                <CompareAtPrice
                  className={'text-besilos-navy/40 text-sm decoration-slate-400'}
                  data={compareAtPrice as MoneyV2}
                />
              )}
            </div>
            <span className="text-xs text-besilos-navy/50 font-medium tracking-wide uppercase">
              {product.vendor}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

function CompareAtPrice({
  data,
  className,
}: {
  data: MoneyV2;
  className?: string;
}) {
  const { currencyNarrowSymbol, withoutTrailingZerosAndCurrency } =
    useMoney(data);

  const styles = clsx('strike', className);

  return (
    <span className={styles}>
      {currencyNarrowSymbol}
      {withoutTrailingZerosAndCurrency}
    </span>
  );
}
