import {useLoaderData} from '@remix-run/react';
import invariant from 'tiny-invariant';
import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  json,
} from '@shopify/remix-oxygen';
import {CartForm, type CartQueryDataReturn, Analytics} from '@shopify/hydrogen';

import {isLocalPath} from '~/lib/utils';
import {Cart} from '~/components/Cart';
import {Link} from '~/components/Link';
import {
  TrustBadgesSection,
  CTASection,
} from '~/components/sections';

export async function action({request, context}: ActionFunctionArgs) {
  const {cart} = context;

  const formData = await request.formData();

  const {action, inputs} = CartForm.getFormInput(formData);
  invariant(action, 'No cartAction defined');

  let status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate:
      const formDiscountCode = inputs.discountCode;

      // User inputted discount code
      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];

      // Combine discount codes already applied on cart
      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    case CartForm.ACTIONS.BuyerIdentityUpdate:
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    default:
      invariant(false, `${action} cart action is not defined`);
  }

  /**
   * The Cart ID may change after each mutation. We need to update it each time in the session.
   */
  const cartId = result.cart.id;
  const headers = cart.setCartId(result.cart.id);

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string' && isLocalPath(redirectTo)) {
    status = 303;
    headers.set('Location', redirectTo);
  }

  const {cart: cartResult, errors, userErrors} = result;

  return json(
    {
      cart: cartResult,
      userErrors,
      errors,
    },
    {status, headers},
  );
}

export async function loader({context}: LoaderFunctionArgs) {
  const {cart} = context;
  return json(await cart.get());
}

export default function CartRoute() {
  const cart = useLoaderData<typeof loader>();
  const hasItems = cart?.totalQuantity && cart.totalQuantity > 0;

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-besilos-cream/50 border-b border-besilos-sage/10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-4">
          <nav className="flex items-center gap-2 text-sm text-besilos-navy/60">
            <Link to="/" className="hover:text-besilos-sage transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-besilos-navy font-medium">Cart</span>
          </nav>
        </div>
      </div>

      {/* Cart Header */}
      <section className="bg-besilos-cream py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-besilos-navy mb-2">
              Your Cart
            </h1>
            {hasItems ? (
              <p className="text-besilos-navy/70">
                {cart.totalQuantity} {cart.totalQuantity === 1 ? 'item' : 'items'} in your cart
              </p>
            ) : (
              <p className="text-besilos-navy/70">Your cart is empty</p>
            )}
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          {hasItems ? (
            <>
              {/* Free shipping notice */}
              <div className="mb-8 p-4 bg-besilos-sage/10 rounded-xl text-center">
                <p className="text-besilos-navy">
                  {cart.cost?.subtotalAmount?.amount && parseFloat(cart.cost.subtotalAmount.amount) >= 89 ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 text-besilos-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      You qualify for FREE shipping!
                    </span>
                  ) : (
                    <span>
                      Add <strong>${(89 - parseFloat(cart.cost?.subtotalAmount?.amount || '0')).toFixed(2)}</strong> more for FREE shipping
                    </span>
                  )}
                </p>
              </div>
              <Cart layout="page" cart={cart} />
            </>
          ) : (
            <div className="text-center py-16">
              <svg
                className="w-20 h-20 mx-auto text-besilos-sage/30 mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-besilos-navy mb-4">
                Your cart is empty
              </h2>
              <p className="text-besilos-navy/60 mb-8 max-w-md mx-auto">
                Looks like you haven't added anything to your cart yet. Browse our collection of dry eye products to find relief.
              </p>
              <Link
                to="/collections/all"
                className="inline-flex items-center justify-center px-8 py-4 bg-besilos-sage text-white font-semibold rounded-full hover:bg-besilos-sage/90 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadgesSection variant="expanded" />

      {/* CTA Section */}
      <CTASection
        title="Need Help Choosing?"
        description="Our dry eye specialists can recommend the right products for your needs."
        primaryCTA={{label: 'Contact Us', to: '/pages/contact'}}
        secondaryCTA={{label: 'Browse Products', to: '/collections/all'}}
        variant="centered"
        background="cream"
      />

      <Analytics.CartView />
    </>
  );
}
