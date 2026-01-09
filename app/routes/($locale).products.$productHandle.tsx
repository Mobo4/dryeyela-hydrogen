import { useRef, Suspense } from 'react';
import { Disclosure, Listbox } from '@headlessui/react';
import {
  defer,
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import { useLoaderData, Await } from '@remix-run/react';
import {
  getSeoMeta,
  Money,
  ShopPayButton,
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
  getProductOptions,
  type MappedProductOptions,
} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';
import clsx from 'clsx';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';

import type { ProductFragment } from 'storefrontapi.generated';
import { Heading, Section, Text } from '~/components/Text';
import { Link } from '~/components/Link';
import { Button } from '~/components/Button';
import { AddToCartButton } from '~/components/AddToCartButton';
import { Skeleton } from '~/components/Skeleton';
import { ProductSwimlane } from '~/components/ProductSwimlane';
import { ProductGallery } from '~/components/ProductGallery';
import { IconCaret, IconCheck, IconClose } from '~/components/Icon';
import { getExcerpt } from '~/lib/utils';
import { seoPayload } from '~/lib/seo.server';
import type { Storefront } from '~/lib/type';
import { routeHeaders } from '~/data/cache';
import { MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT } from '~/data/fragments';
import { TrustBadgesSection, CTASection } from '~/components/sections';

export const headers = routeHeaders;

export async function loader(args: LoaderFunctionArgs) {
  const { productHandle } = args.params;
  invariant(productHandle, 'Missing productHandle param, check route filename');

  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({ ...deferredData, ...criticalData });
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  params,
  request,
  context,
}: LoaderFunctionArgs) {
  const { productHandle } = params;
  invariant(productHandle, 'Missing productHandle param, check route filename');

  const selectedOptions = getSelectedProductOptions(request);

  const [{ shop, product }] = await Promise.all([
    context.storefront.query(PRODUCT_QUERY, {
      variables: {
        handle: productHandle,
        selectedOptions,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response('product', { status: 404 });
  }

  const recommended = getRecommendedProducts(context.storefront, product.id);
  const selectedVariant = product.selectedOrFirstAvailableVariant ?? {};
  const variants = getAdjacentAndFirstAvailableVariants(product);

  const seo = seoPayload.product({
    product: { ...product, variants },
    selectedVariant,
    url: request.url,
  });

  return {
    product,
    variants,
    shop,
    storeDomain: shop.primaryDomain.url,
    recommended,
    seo,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData(args: LoaderFunctionArgs) {
  // Put any API calls that are not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}

export const meta = ({ matches }: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Product() {
  const { product, shop, recommended, variants, storeDomain } =
    useLoaderData<typeof loader>();
  const { media, title, vendor, descriptionHtml, metafield } = product;
  const { shippingPolicy, refundPolicy } = shop;

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    variants,
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="bg-besilos-cream/50 border-b border-besilos-sage/10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-4">
          <nav className="flex items-center gap-2 text-sm text-besilos-navy/60">
            <Link to="/" className="hover:text-besilos-sage transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/collections/all" className="hover:text-besilos-sage transition-colors">
              Products
            </Link>
            {vendor && (
              <>
                <span>/</span>
                <Link to={`/collections/${vendor.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-besilos-sage transition-colors">
                  {vendor}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-besilos-navy font-medium truncate max-w-[200px]">{title}</span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <Section className="px-0 md:px-8 lg:px-12 py-8 bg-white">
        <div className="grid items-start md:gap-6 lg:gap-12 md:grid-cols-2 lg:grid-cols-3">
          <ProductGallery
            media={media.nodes}
            className="w-full lg:col-span-2"
          />
          <div className="sticky md:-mb-nav md:top-nav md:-translate-y-nav md:h-screen md:pt-nav hiddenScroll md:overflow-y-scroll">
            <section className="flex flex-col w-full max-w-xl gap-6 p-6 md:mx-auto md:max-w-sm md:px-0">
              {/* Product Title & Vendor */}
              <div className="grid gap-2">
                {vendor && (
                  <Link
                    to={`/collections/${vendor.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm font-medium text-besilos-sage hover:text-besilos-sage/80 transition-colors uppercase tracking-wide"
                  >
                    {vendor}
                  </Link>
                )}
                <Heading as="h1" className="whitespace-normal text-besilos-navy text-2xl lg:text-3xl">
                  {title}
                </Heading>
              </div>

              {/* Product Form */}
              <ProductForm
                productOptions={productOptions}
                selectedVariant={selectedVariant}
                storeDomain={storeDomain}
              />

              {/* Clinical Insight (Doctor's Take) */}
              {metafield?.value && <ClinicalInsight content={metafield.value} />}

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-4 py-4 border-t border-besilos-sage/10">
                <div className="flex items-center gap-2 text-sm text-besilos-navy/70">
                  <svg className="w-5 h-5 text-besilos-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Doctor Recommended
                </div>
                <div className="flex items-center gap-2 text-sm text-besilos-navy/70">
                  <svg className="w-5 h-5 text-besilos-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  Free Shipping $89+
                </div>
              </div>

              {/* Product Details */}
              <div className="grid gap-4 py-4 border-t border-besilos-sage/10">
                {descriptionHtml && (
                  <ProductDetail
                    title="Product Details"
                    content={descriptionHtml}
                  />
                )}
                {shippingPolicy?.body && (
                  <ProductDetail
                    title="Shipping"
                    content={getExcerpt(shippingPolicy.body)}
                    learnMore={`/policies/${shippingPolicy.handle}`}
                  />
                )}
                {refundPolicy?.body && (
                  <ProductDetail
                    title="Returns"
                    content={getExcerpt(refundPolicy.body)}
                    learnMore={`/policies/${refundPolicy.handle}`}
                  />
                )}
              </div>
            </section>
          </div>
        </div>
      </Section>

      {/* Trust Badges */}
      <TrustBadgesSection variant="expanded" />

      {/* Related Products */}
      <Suspense fallback={<Skeleton className="h-32" />}>
        <Await
          errorElement="There was a problem loading related products"
          resolve={recommended}
        >
          {(products) => (
            <ProductSwimlane title="You May Also Like" products={products} />
          )}
        </Await>
      </Suspense>

      {/* CTA Section */}
      <CTASection
        title="Need Help Choosing?"
        description="Our dry eye specialists can help you find the perfect products for your specific needs."
        primaryCTA={{ label: 'Contact Us', to: '/pages/contact' }}
        secondaryCTA={{ label: 'Shop All Products', to: '/collections/all' }}
        variant="split"
        background="navy"
      />

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </>
  );
}

export function ProductForm({
  productOptions,
  selectedVariant,
  storeDomain,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
  storeDomain: string;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  const isOutOfStock = !selectedVariant?.availableForSale;

  const isOnSale =
    selectedVariant?.price?.amount &&
    selectedVariant?.compareAtPrice?.amount &&
    selectedVariant?.price?.amount < selectedVariant?.compareAtPrice?.amount;

  return (
    <div className="grid gap-6">
      {/* Price Display */}
      {selectedVariant && (
        <div className="flex items-baseline gap-3">
          <Money
            withoutTrailingZeros
            data={selectedVariant?.price!}
            as="span"
            className="text-2xl font-bold text-besilos-navy"
          />
          {isOnSale && (
            <Money
              withoutTrailingZeros
              data={selectedVariant?.compareAtPrice!}
              as="span"
              className="text-lg text-besilos-navy/50 line-through"
            />
          )}
          {isOnSale && (
            <span className="bg-red-100 text-red-700 text-sm font-medium px-2 py-0.5 rounded">
              Sale
            </span>
          )}
        </div>
      )}

      {/* Product Options */}
      <div className="grid gap-4">
        {productOptions.map((option, optionIndex) => (
          <div
            key={option.name}
            className="product-options flex flex-col flex-wrap gap-y-2"
          >
            <Heading as="legend" size="copy" className="font-semibold text-besilos-navy">
              {option.name}
            </Heading>
            <div className="flex flex-wrap items-baseline gap-3">
              {option.optionValues.length > 7 ? (
                <div className="relative w-full">
                  <Listbox>
                    {({ open }) => (
                      <>
                        <Listbox.Button
                          ref={closeRef}
                          className={clsx(
                            'flex items-center justify-between w-full py-3 px-4 border border-besilos-sage/30 bg-white',
                            open
                              ? 'rounded-t'
                              : 'rounded-lg',
                          )}
                        >
                          <span className="text-besilos-navy">
                            {
                              selectedVariant?.selectedOptions[optionIndex]
                                .value
                            }
                          </span>
                          <IconCaret direction={open ? 'up' : 'down'} />
                        </Listbox.Button>
                        <Listbox.Options
                          className={clsx(
                            'border-besilos-sage/30 bg-white absolute bottom-12 z-30 grid h-48 w-full overflow-y-scroll rounded-t border px-2 py-2 transition-[max-height] duration-150 sm:bottom-auto md:rounded-b md:rounded-t-none md:border-t-0 md:border-b',
                            open ? 'max-h-48' : 'max-h-0',
                          )}
                        >
                          {option.optionValues
                            .filter((value) => value.available)
                            .map(
                              ({
                                isDifferentProduct,
                                name,
                                variantUriQuery,
                                handle,
                                selected,
                              }) => (
                                <Listbox.Option
                                  key={`option-${option.name}-${name}`}
                                  value={name}
                                >
                                  <Link
                                    {...(!isDifferentProduct
                                      ? { rel: 'nofollow' }
                                      : {})}
                                    to={`/products/${handle}?${variantUriQuery}`}
                                    preventScrollReset
                                    className={clsx(
                                      'text-besilos-navy w-full p-2 transition rounded flex justify-start items-center text-left cursor-pointer hover:bg-besilos-sage/10',
                                      selected && 'bg-besilos-sage/10',
                                    )}
                                    onClick={() => {
                                      if (!closeRef?.current) return;
                                      closeRef.current.click();
                                    }}
                                  >
                                    {name}
                                    {selected && (
                                      <span className="ml-2 text-besilos-sage">
                                        <IconCheck />
                                      </span>
                                    )}
                                  </Link>
                                </Listbox.Option>
                              ),
                            )}
                        </Listbox.Options>
                      </>
                    )}
                  </Listbox>
                </div>
              ) : (
                option.optionValues.map(
                  ({
                    isDifferentProduct,
                    name,
                    variantUriQuery,
                    handle,
                    selected,
                    available,
                    swatch,
                  }) => (
                    <Link
                      key={option.name + name}
                      {...(!isDifferentProduct ? { rel: 'nofollow' } : {})}
                      to={`/products/${handle}?${variantUriQuery}`}
                      preventScrollReset
                      prefetch="intent"
                      replace
                      className={clsx(
                        'px-4 py-2 border rounded-lg transition-all duration-200',
                        selected
                          ? 'border-besilos-sage bg-besilos-sage/10 text-besilos-navy'
                          : 'border-besilos-sage/30 text-besilos-navy/70 hover:border-besilos-sage/50',
                        !available && 'opacity-50 cursor-not-allowed',
                      )}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  ),
                )
              )}
            </div>
          </div>
        ))}

        {/* Add to Cart */}
        {selectedVariant && (
          <div className="grid items-stretch gap-3 mt-2">
            {isOutOfStock ? (
              <Button variant="secondary" disabled className="w-full py-4 rounded-full">
                <Text>Sold Out</Text>
              </Button>
            ) : (
              <AddToCartButton
                lines={[
                  {
                    merchandiseId: selectedVariant.id!,
                    quantity: 1,
                  },
                ]}
                variant="primary"
                data-test="add-to-cart"
                className="w-full py-4 bg-besilos-sage text-white font-semibold rounded-full hover:bg-besilos-sage/90 transition-colors"
              >
                <Text
                  as="span"
                  className="flex items-center justify-center gap-2"
                >
                  <span>Add to Cart</span>
                </Text>
              </AddToCartButton>
            )}
            {!isOutOfStock && (
              <ShopPayButton
                width="100%"
                variantIds={[selectedVariant?.id!]}
                storeDomain={storeDomain}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <div
      aria-label={name}
      className="w-8 h-8 rounded"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} className="rounded" />}
    </div>
  );
}

function ProductDetail({
  title,
  content,
  learnMore,
}: {
  title: string;
  content: string;
  learnMore?: string;
}) {
  return (
    <Disclosure key={title} as="div" className="grid w-full gap-2">
      {({ open }) => (
        <>
          <Disclosure.Button className="text-left">
            <div className="flex justify-between items-center py-2">
              <Text size="lead" as="h4" className="font-semibold text-besilos-navy">
                {title}
              </Text>
              <IconClose
                className={clsx(
                  'transition-transform transform-gpu duration-200 text-besilos-sage',
                  !open && 'rotate-[45deg]',
                )}
              />
            </div>
          </Disclosure.Button>

          <Disclosure.Panel className={'pb-4 pt-2 grid gap-2'}>
            <div
              className="prose prose-sm max-w-none text-besilos-navy/70"
              dangerouslySetInnerHTML={{ __html: content }}
            />
            {learnMore && (
              <div className="mt-2">
                <Link
                  className="text-sm text-besilos-sage hover:text-besilos-sage/80 underline"
                  to={learnMore}
                >
                  Learn more
                </Link>
              </div>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    id
    availableForSale
    selectedOptions {
      name
      value
    }
    image {
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
    metafield(namespace: "custom", key: "doctors_take") {
      value
    }
    media(first: 7) {
      nodes {
        ...Media
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

function ClinicalInsight({ content }: { content: string }) {
  return (
    <div className="bg-besilos-sage/5 border border-besilos-sage/20 rounded-xl p-6 my-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-besilos-sage/10 p-2 rounded-full">
          <svg className="w-5 h-5 text-besilos-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <Heading as="h4" size="copy" className="font-semibold text-besilos-navy">
          Doctor&apos;s Take
        </Heading>
      </div>
      <div className="prose prose-sm max-w-none text-besilos-navy/80">
        <p>{content}</p>
      </div>
    </div>
  );
}

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
    shop {
      name
      primaryDomain {
        url
      }
      shippingPolicy {
        body
        handle
      }
      refundPolicy {
        body
        handle
      }
    }
  }
  ${MEDIA_FRAGMENT}
  ${PRODUCT_FRAGMENT}
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query productRecommendations(
    $productId: ID!
    $count: Int
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    recommended: productRecommendations(productId: $productId) {
      ...ProductCard
    }
    additional: products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

async function getRecommendedProducts(
  storefront: Storefront,
  productId: string,
) {
  const products = await storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
    variables: { productId, count: 12 },
  });

  invariant(products, 'No data returned from Shopify API');

  const mergedProducts = (products.recommended ?? [])
    .concat(products.additional.nodes)
    .filter(
      (value, index, array) =>
        array.findIndex((value2) => value2.id === value.id) === index,
    );

  const originalProduct = mergedProducts.findIndex(
    (item) => item.id === productId,
  );

  mergedProducts.splice(originalProduct, 1);

  return { nodes: mergedProducts };
}
