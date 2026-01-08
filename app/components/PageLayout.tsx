import { useParams, Form, Await, useRouteLoaderData, useLocation } from '@remix-run/react';
import useWindowScroll from 'react-use/esm/useWindowScroll';
import { Disclosure, Popover, Transition } from '@headlessui/react';
import { Suspense, useEffect, useMemo, useState, Fragment } from 'react';
import { CartForm } from '@shopify/hydrogen';

import { type LayoutQuery } from 'storefrontapi.generated';
import { Text, Heading, Section } from '~/components/Text';
import { Link } from '~/components/Link';
import { Cart } from '~/components/Cart';
import { CartLoading } from '~/components/CartLoading';
import { Input } from '~/components/Input';
import { Drawer, useDrawer } from '~/components/Drawer';
import { CountrySelector } from '~/components/CountrySelector';
import {
  IconMenu,
  IconCaret,
  IconLogin,
  IconAccount,
  IconBag,
  IconSearch,
} from '~/components/Icon';
import {
  type EnhancedMenu,
  type ChildEnhancedMenuItem,
  useIsHomePath,
} from '~/lib/utils';
import { useIsHydrated } from '~/hooks/useIsHydrated';
import { useCartFetchers } from '~/hooks/useCartFetchers';
import type { RootLoader } from '~/root';
import { SHOP_CATEGORIES, BRANDS, SYMPTOMS, INGREDIENTS } from '~/data/navigation';

type LayoutProps = {
  children: React.ReactNode;
  layout?: LayoutQuery & {
    headerMenu?: EnhancedMenu | null;
    footerMenu?: EnhancedMenu | null;
  };
};

export function PageLayout({ children, layout }: LayoutProps) {
  const { headerMenu, footerMenu } = layout || {};
  return (
    <div className="bg-besilos-frame min-h-screen p-4 md:p-8 lg:p-12 font-sans transition-colors duration-500">
      <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden max-w-[1600px] mx-auto min-h-[calc(100vh-6rem)] relative border border-white/40 isolate flex flex-col">
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>
        {headerMenu && layout?.shop.name && (
          <Header title={layout.shop.name} menu={headerMenu} />
        )}
        <main role="main" id="mainContent" className="flex-grow">
          {children}
        </main>
        {footerMenu && <Footer menu={footerMenu} />}
      </div>
    </div>
  );
}

function Header({ title, menu }: { title: string; menu?: EnhancedMenu }) {
  const isHome = useIsHomePath();

  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();

  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();

  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);

  // toggle cart drawer when adding to cart
  useEffect(() => {
    if (isCartOpen || !addToCartFetchers.length) return;
    openCart();
  }, [addToCartFetchers, isCartOpen, openCart]);

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      {menu && (
        <MenuDrawer isOpen={isMenuOpen} onClose={closeMenu} menu={menu} />
      )}
      <DesktopHeader
        isHome={isHome}
        title={title}
        menu={menu}
        openCart={openCart}
      />
      <MobileHeader
        isHome={isHome}
        title={title}
        openCart={openCart}
        openMenu={openMenu}
      />
    </>
  );
}

function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  if (!rootData) return null;

  return (
    <Drawer open={isOpen} onClose={onClose} heading="Cart" openFrom="right">
      <div className="grid">
        <Suspense fallback={<CartLoading />}>
          <Await resolve={rootData?.cart}>
            {(cart) => <Cart layout="drawer" onClose={onClose} cart={cart} />}
          </Await>
        </Suspense>
      </div>
    </Drawer>
  );
}

export function MenuDrawer({
  isOpen,
  onClose,
  menu,
}: {
  isOpen: boolean;
  onClose: () => void;
  menu: EnhancedMenu;
}) {
  return (
    <Drawer open={isOpen} onClose={onClose} openFrom="left" heading="Menu">
      <div className="grid">
        <MenuMobileNav menu={menu} onClose={onClose} />
      </div>
    </Drawer>
  );
}

function MenuMobileNav({
  menu,
  onClose,
}: {
  menu: EnhancedMenu;
  onClose: () => void;
}) {
  return (
    <nav className="grid gap-2 p-6 sm:px-12 sm:py-8">
      {/* Shop Section */}
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between items-center w-full py-3 text-left font-semibold text-besilos-navy">
              Shop
              <IconCaret direction={open ? 'up' : 'down'} />
            </Disclosure.Button>
            <Disclosure.Panel className="pl-4 pb-4">
              <div className="grid gap-2">
                {SHOP_CATEGORIES.map((category) => (
                  <Link
                    key={category.handle}
                    to={`/collections/${category.handle}`}
                    onClick={onClose}
                    className="py-2 text-besilos-navy/70 hover:text-besilos-sage"
                  >
                    {category.title}
                  </Link>
                ))}
                <Link
                  to="/collections/all"
                  onClick={onClose}
                  className="py-2 text-besilos-sage font-medium"
                >
                  View All Products →
                </Link>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Brands Section */}
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between items-center w-full py-3 text-left font-semibold text-besilos-navy border-t border-besilos-sage/20">
              Brands
              <IconCaret direction={open ? 'up' : 'down'} />
            </Disclosure.Button>
            <Disclosure.Panel className="pl-4 pb-4">
              <div className="grid grid-cols-2 gap-2">
                {BRANDS.map((brand) => (
                  <Link
                    key={brand.handle}
                    to={`/brands/${brand.handle}`}
                    onClick={onClose}
                    className="py-2 text-besilos-navy/70 hover:text-besilos-sage text-sm"
                  >
                    {brand.name}
                  </Link>
                ))}
              </div>
              <Link
                to="/brands"
                onClick={onClose}
                className="block py-2 mt-2 text-besilos-sage font-medium"
              >
                View All Brands →
              </Link>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Symptoms Section */}
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between items-center w-full py-3 text-left font-semibold text-besilos-navy border-t border-besilos-sage/20">
              Symptoms
              <IconCaret direction={open ? 'up' : 'down'} />
            </Disclosure.Button>
            <Disclosure.Panel className="pl-4 pb-4">
              <div className="grid gap-2">
                {SYMPTOMS.map((symptom) => (
                  <Link
                    key={symptom.handle}
                    to={`/symptoms/${symptom.handle}`}
                    onClick={onClose}
                    className="py-2 text-besilos-navy/70 hover:text-besilos-sage"
                  >
                    {symptom.title}
                  </Link>
                ))}
                <Link
                  to="/symptoms"
                  onClick={onClose}
                  className="py-2 text-besilos-sage font-medium"
                >
                  View All Symptoms →
                </Link>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Ingredients Section */}
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between items-center w-full py-3 text-left font-semibold text-besilos-navy border-t border-besilos-sage/20">
              Ingredients
              <IconCaret direction={open ? 'up' : 'down'} />
            </Disclosure.Button>
            <Disclosure.Panel className="pl-4 pb-4">
              <div className="grid gap-2">
                {INGREDIENTS.map((ingredient) => (
                  <Link
                    key={ingredient.handle}
                    to={`/ingredients/${ingredient.handle}`}
                    onClick={onClose}
                    className="py-2 text-besilos-navy/70 hover:text-besilos-sage"
                  >
                    {ingredient.title}
                  </Link>
                ))}
                <Link
                  to="/ingredients"
                  onClick={onClose}
                  className="py-2 text-besilos-sage font-medium"
                >
                  View All Ingredients →
                </Link>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Learn Link */}
      <Link
        to="/pages/dry-eye-guide"
        onClick={onClose}
        className="py-3 font-semibold text-besilos-navy border-t border-besilos-sage/20"
      >
        Learn
      </Link>

      {/* Original menu items from Shopify */}
      {(menu?.items || []).length > 0 && (
        <div className="border-t border-besilos-sage/20 pt-4 mt-2">
          <Text as="span" size="fine" className="text-besilos-navy/50 uppercase tracking-wide">
            More
          </Text>
          <div className="grid gap-2 mt-2">
            {(menu?.items || []).map((item) => (
              <Link
                key={item.id}
                to={item.to}
                target={item.target}
                onClick={onClose}
                className="py-2 text-besilos-navy/70 hover:text-besilos-sage"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

function MobileHeader({
  title,
  isHome,
  openCart,
  openMenu,
}: {
  title: string;
  isHome: boolean;
  openCart: () => void;
  openMenu: () => void;
}) {
  const params = useParams();

  return (
    <header
      role="banner"
      className={`${isHome
        ? 'bg-besilos-navy text-besilos-cream shadow-darkHeader'
        : 'bg-besilos-cream text-besilos-navy'
        } flex lg:hidden items-center h-nav sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-4 px-4 md:px-8`}
    >
      <div className="flex items-center justify-start w-full gap-4">
        <button
          onClick={openMenu}
          className="relative flex items-center justify-center w-8 h-8"
        >
          <IconMenu />
        </button>
        <Form
          method="get"
          action={params.locale ? `/${params.locale}/search` : '/search'}
          className="items-center gap-2 sm:flex"
        >
          <button
            type="submit"
            className="relative flex items-center justify-center w-8 h-8"
          >
            <IconSearch />
          </button>
          <Input
            className={
              isHome
                ? 'focus:border-contrast/20 dark:focus:border-primary/20'
                : 'focus:border-primary/20'
            }
            type="search"
            variant="minisearch"
            placeholder="Search"
            name="q"
          />
        </Form>
      </div>

      <Link
        className="flex items-center self-stretch leading-[3rem] md:leading-[4rem] justify-center flex-grow w-full h-full"
        to="/"
      >
        <Heading
          className="font-bold text-center leading-none"
          as={isHome ? 'h1' : 'h2'}
        >
          {title}
        </Heading>
      </Link>

      <div className="flex items-center justify-end w-full gap-4">
        <AccountLink className="relative flex items-center justify-center w-8 h-8" />
        <CartCount isHome={isHome} openCart={openCart} />
      </div>
    </header>
  );
}

function DesktopHeader({
  isHome,
  menu,
  openCart,
  title,
}: {
  isHome: boolean;
  openCart: () => void;
  menu?: EnhancedMenu;
  title: string;
}) {
  const params = useParams();
  const { y } = useWindowScroll();

  return (
    <header
      role="banner"
      className={`${isHome
        ? 'bg-besilos-navy text-besilos-cream shadow-darkHeader'
        : 'bg-besilos-cream text-besilos-navy'
        } ${!isHome && y > 50 && ' shadow-lightHeader'
        } hidden h-nav lg:flex items-center sticky transition duration-300 backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-8 px-12 py-8`}
    >
      <div className="flex gap-8 items-center">
        <Link className="font-bold text-xl" to="/" prefetch="intent">
          {title}
        </Link>
        <nav className="flex gap-1 items-center">
          {/* Shop Megamenu */}
          <MegaMenuDropdown
            title="Shop"
            isHome={isHome}
          >
            <div className="grid grid-cols-2 gap-4 p-8 w-[600px] bg-white rounded-2xl shadow-xl ring-1 ring-black/5">
              <div className="col-span-1">
                <h3 className="font-semibold text-besilos-navy mb-3 text-sm uppercase tracking-wide">By Category</h3>
                <ul className="space-y-2">
                  {SHOP_CATEGORIES.map((category) => (
                    <li key={category.handle}>
                      <Link
                        to={`/collections/${category.handle}`}
                        className="text-besilos-navy/80 hover:text-besilos-sage transition-colors text-sm"
                        prefetch="intent"
                      >
                        {category.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-besilos-navy mb-3 text-sm uppercase tracking-wide">Featured</h3>
                <div className="space-y-3">
                  <Link to="/collections/all" className="block p-3 bg-besilos-sage/10 rounded-lg hover:bg-besilos-sage/20 transition-colors">
                    <span className="font-medium text-besilos-navy">All Products</span>
                    <p className="text-xs text-besilos-navy/60 mt-1">Browse our complete catalog</p>
                  </Link>
                  <Link to="/collections/best-sellers" className="block p-3 bg-besilos-sage/10 rounded-lg hover:bg-besilos-sage/20 transition-colors">
                    <span className="font-medium text-besilos-navy">Best Sellers</span>
                    <p className="text-xs text-besilos-navy/60 mt-1">Our most popular products</p>
                  </Link>
                </div>
              </div>
            </div>
          </MegaMenuDropdown>

          {/* Brands Megamenu */}
          <MegaMenuDropdown
            title="Brands"
            isHome={isHome}
          >
            <div className="p-8 w-[700px] bg-white rounded-2xl shadow-xl ring-1 ring-black/5">
              <h3 className="font-semibold text-besilos-navy mb-4 text-sm uppercase tracking-wide">Shop by Brand</h3>
              <div className="grid grid-cols-3 gap-3">
                {BRANDS.map((brand) => (
                  <Link
                    key={brand.handle}
                    to={`/brands/${brand.handle}`}
                    className="p-2 rounded-lg text-besilos-navy/80 hover:bg-besilos-sage/10 hover:text-besilos-sage transition-colors text-sm"
                    prefetch="intent"
                  >
                    {brand.name}
                  </Link>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-besilos-sage/20">
                <Link to="/brands" className="text-besilos-sage hover:underline text-sm font-medium">
                  View All Brands →
                </Link>
              </div>
            </div>
          </MegaMenuDropdown>

          {/* Symptoms Megamenu */}
          <MegaMenuDropdown
            title="Symptoms"
            isHome={isHome}
          >
            <div className="p-6 w-[500px]">
              <h3 className="font-semibold text-besilos-navy mb-4 text-sm uppercase tracking-wide">Shop by Symptom</h3>
              <div className="space-y-3">
                {SYMPTOMS.map((symptom) => (
                  <Link
                    key={symptom.handle}
                    to={`/symptoms/${symptom.handle}`}
                    className="block p-3 rounded-lg hover:bg-besilos-sage/10 transition-colors"
                    prefetch="intent"
                  >
                    <span className="font-medium text-besilos-navy">{symptom.title}</span>
                    <p className="text-xs text-besilos-navy/60 mt-1 line-clamp-1">{symptom.description}</p>
                  </Link>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-besilos-sage/20">
                <Link to="/symptoms" className="text-besilos-sage hover:underline text-sm font-medium">
                  View All Symptoms →
                </Link>
              </div>
            </div>
          </MegaMenuDropdown>

          {/* Ingredients Megamenu */}
          <MegaMenuDropdown
            title="Ingredients"
            isHome={isHome}
          >
            <div className="p-6 w-[400px]">
              <h3 className="font-semibold text-besilos-navy mb-4 text-sm uppercase tracking-wide">Shop by Ingredient</h3>
              <div className="space-y-3">
                {INGREDIENTS.map((ingredient) => (
                  <Link
                    key={ingredient.handle}
                    to={`/ingredients/${ingredient.handle}`}
                    className="block p-3 rounded-lg hover:bg-besilos-sage/10 transition-colors"
                    prefetch="intent"
                  >
                    <span className="font-medium text-besilos-navy">{ingredient.title}</span>
                    <p className="text-xs text-besilos-navy/60 mt-1 line-clamp-1">{ingredient.description}</p>
                  </Link>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-besilos-sage/20">
                <Link to="/ingredients" className="text-besilos-sage hover:underline text-sm font-medium">
                  View All Ingredients →
                </Link>
              </div>
            </div>
          </MegaMenuDropdown>

          {/* Learn Link */}
          <Link
            to="/pages/dry-eye-guide"
            prefetch="intent"
            className={`px-4 py-2 rounded-md transition-colors ${isHome
              ? 'hover:bg-besilos-cream/10 text-besilos-cream'
              : 'hover:bg-besilos-navy/10 text-besilos-navy'
              }`}
          >
            Learn
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-1">
        <Form
          method="get"
          action={params.locale ? `/${params.locale}/search` : '/search'}
          className="flex items-center gap-2"
        >
          <Input
            className={
              isHome
                ? 'focus:border-besilos-cream/20 border-besilos-cream/30 bg-besilos-cream/10 text-besilos-cream placeholder:text-besilos-cream/50'
                : 'focus:border-besilos-navy/20 border-besilos-navy/30'
            }
            type="search"
            variant="minisearch"
            placeholder="Search"
            name="q"
          />
          <button
            type="submit"
            className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
          >
            <IconSearch />
          </button>
        </Form>
        <AccountLink className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5" />
        <CartCount isHome={isHome} openCart={openCart} />
      </div>
    </header>
  );
}

// Megamenu Dropdown Component
function MegaMenuDropdown({
  title,
  isHome,
  children,
}: {
  title: string;
  isHome: boolean;
  children: React.ReactNode;
}) {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={`px-4 py-2 rounded-md transition-colors flex items-center gap-1 outline-none ${open
              ? isHome
                ? 'bg-besilos-cream/10 text-besilos-cream'
                : 'bg-besilos-navy/10 text-besilos-navy'
              : isHome
                ? 'hover:bg-besilos-cream/10 text-besilos-cream'
                : 'hover:bg-besilos-navy/10 text-besilos-navy'
              }`}
          >
            {title}
            <IconCaret direction={open ? 'up' : 'down'} />
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute left-0 z-50 mt-3 bg-white rounded-xl shadow-xl ring-1 ring-besilos-navy/5">
              {children}
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}

function AccountLink({ className }: { className?: string }) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  const isLoggedIn = rootData?.isLoggedIn;

  return (
    <Link to="/account" className={className}>
      <Suspense fallback={<IconLogin />}>
        <Await resolve={isLoggedIn} errorElement={<IconLogin />}>
          {(isLoggedIn) => (isLoggedIn ? <IconAccount /> : <IconLogin />)}
        </Await>
      </Suspense>
    </Link>
  );
}

function CartCount({
  isHome,
  openCart,
}: {
  isHome: boolean;
  openCart: () => void;
}) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  if (!rootData) return null;

  return (
    <Suspense fallback={<Badge count={0} dark={isHome} openCart={openCart} />}>
      <Await resolve={rootData?.cart}>
        {(cart) => (
          <Badge
            dark={isHome}
            openCart={openCart}
            count={cart?.totalQuantity || 0}
          />
        )}
      </Await>
    </Suspense>
  );
}

function Badge({
  openCart,
  dark,
  count,
}: {
  count: number;
  dark: boolean;
  openCart: () => void;
}) {
  const isHydrated = useIsHydrated();

  const BadgeCounter = useMemo(
    () => (
      <>
        <IconBag />
        <div
          className={`${dark
            ? 'text-primary bg-contrast dark:text-contrast dark:bg-primary'
            : 'text-contrast bg-primary'
            } absolute bottom-1 right-1 text-[0.625rem] font-medium subpixel-antialiased h-3 min-w-[0.75rem] flex items-center justify-center leading-none text-center rounded-full w-auto px-[0.125rem] pb-px`}
        >
          <span>{count || 0}</span>
        </div>
      </>
    ),
    [count, dark],
  );

  return isHydrated ? (
    <button
      onClick={openCart}
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </button>
  ) : (
    <Link
      to="/cart"
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </Link>
  );
}

function Footer({ menu }: { menu?: EnhancedMenu }) {
  const isHome = useIsHomePath();

  return (
    <footer
      role="contentinfo"
      className="bg-besilos-navy text-besilos-cream"
    >
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Shop Categories */}
          <div>
            <Heading as="h3" size="lead" className="text-besilos-cream mb-4">
              Shop Products
            </Heading>
            <ul className="space-y-2">
              {SHOP_CATEGORIES.slice(0, 6).map((category) => (
                <li key={category.handle}>
                  <Link
                    to={`/collections/${category.handle}`}
                    className="text-besilos-cream/70 hover:text-besilos-sage transition-colors text-sm"
                    prefetch="intent"
                  >
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Brands */}
          <div>
            <Heading as="h3" size="lead" className="text-besilos-cream mb-4">
              Popular Brands
            </Heading>
            <ul className="space-y-2">
              {BRANDS.slice(0, 7).map((brand) => (
                <li key={brand.handle}>
                  <Link
                    to={`/brands/${brand.handle}`}
                    className="text-besilos-cream/70 hover:text-besilos-sage transition-colors text-sm"
                    prefetch="intent"
                  >
                    {brand.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/brands"
                  className="text-besilos-sage hover:underline text-sm font-medium"
                  prefetch="intent"
                >
                  View All Brands →
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop by Symptom */}
          <div>
            <Heading as="h3" size="lead" className="text-besilos-cream mb-4">
              Shop by Symptom
            </Heading>
            <ul className="space-y-2">
              {SYMPTOMS.map((symptom) => (
                <li key={symptom.handle}>
                  <Link
                    to={`/symptoms/${symptom.handle}`}
                    className="text-besilos-cream/70 hover:text-besilos-sage transition-colors text-sm"
                    prefetch="intent"
                  >
                    {symptom.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            {/* Newsletter & Guide */}
            <div>
              <Heading as="h3" size="lead" className="text-besilos-cream mb-4">
                Free Guide
              </Heading>
              <Text as="p" size="fine" className="text-besilos-cream/60">
                Join our community for eye care tips.
              </Text>
            </div>
          </div>

          {/* SEO Keywords Footer Section */}
          <div className="mt-12 pt-8 border-t border-besilos-cream/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Text as="p" size="fine" className="text-besilos-cream/50 leading-relaxed">
                  <strong className="text-besilos-cream/70">Los Angeles Dry Eye Products:</strong>{' '}
                  Shop doctor-recommended dry eye treatments including preservative-free eye drops, omega-3 supplements,
                  eyelid cleansers, heated eye masks, and scleral lens solutions. We carry trusted brands like PRN,
                  Optase, Bruder, Avenova, Oasis Tears, and more. Free shipping on orders over $89.
                </Text>
              </div>
              <div>
                <Text as="p" size="fine" className="text-besilos-cream/50 leading-relaxed">
                  <strong className="text-besilos-cream/70">Expert Dry Eye Care:</strong>{' '}
                  Find relief for dry eyes, burning eyes, eye redness, blepharitis, and meibomian gland dysfunction.
                  Our products include hypochlorous acid sprays, tea tree oil cleansers, hyaluronic acid drops,
                  and EPA/DHA omega-3 supplements recommended by eye care professionals.
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-besilos-navy border-t border-besilos-cream/10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Text as="p" size="fine" className="text-besilos-cream/50">
              &copy; {new Date().getFullYear()} DryEyeLA. All rights reserved. | Los Angeles Premier Dry Eye Products Store
            </Text>
            <div className="flex gap-6">
              <Link to="/policies/privacy-policy" className="text-besilos-cream/50 hover:text-besilos-sage text-xs">
                Privacy Policy
              </Link>
              <Link to="/policies/terms-of-service" className="text-besilos-cream/50 hover:text-besilos-sage text-xs">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ item }: { item: ChildEnhancedMenuItem }) {
  if (item.to.startsWith('http')) {
    return (
      <a href={item.to} target={item.target} rel="noopener noreferrer">
        {item.title}
      </a>
    );
  }

  return (
    <Link to={item.to} target={item.target} prefetch="intent">
      {item.title}
    </Link>
  );
}

function FooterMenu({ menu }: { menu?: EnhancedMenu }) {
  const styles = {
    section: 'grid gap-4',
    nav: 'grid gap-2 pb-6',
  };

  return (
    <>
      {(menu?.items || []).map((item) => (
        <section key={item.id} className={styles.section}>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="text-left md:cursor-default">
                  <Heading className="flex justify-between" size="lead" as="h3">
                    {item.title}
                    {item?.items?.length > 0 && (
                      <span className="md:hidden">
                        <IconCaret direction={open ? 'up' : 'down'} />
                      </span>
                    )}
                  </Heading>
                </Disclosure.Button>
                {item?.items?.length > 0 ? (
                  <div
                    className={`${open ? `max-h-48 h-fit` : `max-h-0 md:max-h-fit`
                      } overflow-hidden transition-all duration-300`}
                  >
                    <Suspense data-comment="This suspense fixes a hydration bug in Disclosure.Panel with static prop">
                      <Disclosure.Panel static>
                        <nav className={styles.nav}>
                          {item.items.map((subItem: ChildEnhancedMenuItem) => (
                            <FooterLink key={subItem.id} item={subItem} />
                          ))}
                        </nav>
                      </Disclosure.Panel>
                    </Suspense>
                  </div>
                ) : null}
              </>
            )}
          </Disclosure>
        </section>
      ))}
    </>
  );
}
