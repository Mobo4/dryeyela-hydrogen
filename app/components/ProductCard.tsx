import clsx from 'clsx';
import { flattenConnection, Image, Money, useMoney } from '@shopify/hydrogen';
import type { MoneyV2, Product, Image as ShopifyImage } from '@shopify/hydrogen/storefront-api-types';

import type { ProductCardFragment } from 'storefrontapi.generated';
import { Text } from '~/components/Text';
import { Link } from '~/components/Link';
import { Button } from '~/components/Button';
import { AddToCartButton } from '~/components/AddToCartButton';
import { isDiscounted, isNewArrival } from '~/lib/utils';
import { getProductPlaceholder } from '~/lib/placeholders';

// Helper to check if an image URL is from Shopify CDN
function isShopifyImage(url: string | undefined): boolean {
  if (!url) return false;
  return url.includes('cdn.shopify.com') || url.includes('shopify.com');
}

// Helper component for rendering images (handles both Shopify and external URLs)
function ProductImage({
  image,
  alt,
  loading,
  className,
  sizes,
}: {
  image: Pick<ShopifyImage, 'url' | 'altText' | 'width' | 'height'> | null | undefined;
  alt: string;
  loading?: HTMLImageElement['loading'];
  className?: string;
  sizes?: string;
}) {
  if (!image?.url) return null;

  // Use Hydrogen Image component for Shopify CDN images (optimized)
  if (isShopifyImage(image.url)) {
    return (
      <Image
        className={className}
        sizes={sizes || "(min-width: 64em) 25vw, (min-width: 48em) 30vw, 45vw"}
        aspectRatio="4/5"
        data={image}
        alt={image.altText || alt}
        loading={loading}
      />
    );
  }

  // Use regular img tag for external URLs (placehold.co, etc.)
  return (
    <img
      src={image.url}
      alt={image.altText || alt}
      loading={loading || 'lazy'}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
}

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
  const secondaryImage = media[1] && 'image' in media[1] ? media[1].image : null;

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
          {/* Clean grey background - Professional studio photography standard */}
          <div className="card-image aspect-[4/5] rounded-xl overflow-hidden relative shadow-lg transition-all duration-500 group-hover:shadow-xl border border-gray-200/50" style={{ backgroundColor: '#F5F5F5' }}>
            
            {/* Primary Image - High resolution, sharp textures, professional studio lighting */}
            {image ? (
              <ProductImage
                image={image}
                alt={`Picture of ${product.title}`}
                loading={loading}
                className={clsx(
                  "object-contain w-full h-full transition-all duration-700 relative z-10 p-4 md:p-6",
                  "image-render-crisp-edges",
                  secondaryImage ? "group-hover:opacity-0" : "group-hover:scale-105"
                )}
                sizes="(min-width: 64em) 25vw, (min-width: 48em) 30vw, 45vw"
              />
            ) : (
              // Fallback placeholder for missing images
              <div className="w-full h-full flex flex-col items-center justify-center p-8 relative z-10">
                <svg className="w-24 h-24 text-gray-300 mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                  <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="text-gray-400 text-xs text-center font-medium">{product.title}</p>
              </div>
            )}

            {/* Secondary Image (Hover) - High resolution, sharp textures */}
            {secondaryImage && (
              <ProductImage
                image={secondaryImage as Pick<ShopifyImage, 'url' | 'altText' | 'width' | 'height'>}
                alt={`Picture of ${product.title}`}
                loading={loading}
                className="absolute inset-0 object-contain w-full h-full opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105 p-4 md:p-6 z-10 image-render-crisp-edges"
                sizes="(min-width: 64em) 25vw, (min-width: 48em) 30vw, 45vw"
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
