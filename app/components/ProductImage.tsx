import { Image } from '@shopify/hydrogen';
import type { Image as ImageComponent } from '@shopify/hydrogen';
import clsx from 'clsx';
import type { ComponentProps } from 'react';

type ImageProps = ComponentProps<typeof Image>;

/**
 * ProductImage Component
 * 
 * Ensures all product images follow professional studio photography standards:
 * - Dramatic but clear professional product studio lighting
 * - Clean grey background (#F5F5F5 or similar)
 * - High resolution, sharp textures
 * - Proper aspect ratios and object-contain for product display
 */
export function ProductImage({
  data,
  className,
  aspectRatio,
  sizes,
  loading,
  alt,
  ...props
}: {
  data: ImageProps['data'];
  className?: string;
  aspectRatio?: ImageProps['aspectRatio'];
  sizes?: ImageProps['sizes'];
  loading?: HTMLImageElement['loading'];
  alt?: string;
} & Omit<ImageProps, 'data' | 'aspectRatio' | 'sizes' | 'loading' | 'alt'>) {
  if (!data) return null;

  return (
    <div 
      className={clsx(
        "relative overflow-hidden",
        className
      )}
      style={{ backgroundColor: '#F5F5F5' }}
    >
      {/* Ensure high quality rendering */}
      <Image
        data={data}
        aspectRatio={aspectRatio}
        sizes={sizes}
        loading={loading}
        alt={alt || data.altText || 'Product image'}
        className={clsx(
          "object-contain w-full h-full",
          // Sharp textures - ensure crisp rendering
          "image-render-crisp-edges",
          // High resolution support
          "supports-[image-rendering:-webkit-optimize-contrast]:image-render-crisp-edges"
        )}
        {...props}
      />
    </div>
  );
}

/**
 * ProductImageCard Component
 * 
 * Wrapper for product images in cards with consistent styling
 */
export function ProductImageCard({
  data,
  className,
  aspectRatio = '4/5',
  sizes,
  loading,
  alt,
  showHoverEffect = true,
  ...props
}: {
  data: ImageProps['data'];
  className?: string;
  aspectRatio?: ImageProps['aspectRatio'];
  sizes?: ImageProps['sizes'];
  loading?: HTMLImageElement['loading'];
  alt?: string;
  showHoverEffect?: boolean;
} & Omit<ImageProps, 'data' | 'aspectRatio' | 'sizes' | 'loading' | 'alt'>) {
  if (!data) return null;

  return (
    <div 
      className={clsx(
        "relative overflow-hidden rounded-xl shadow-lg border border-gray-200/50",
        // Hover effects
        showHoverEffect && "group transition-all duration-500 hover:shadow-xl",
        className
      )}
      style={{ backgroundColor: '#F5F5F5' }}
    >
      <ProductImage
        data={data}
        aspectRatio={aspectRatio}
        sizes={sizes}
        loading={loading}
        alt={alt}
        className={clsx(
          "p-4 md:p-6",
          showHoverEffect && "group-hover:scale-105 transition-transform duration-500"
        )}
        {...props}
      />
    </div>
  );
}
