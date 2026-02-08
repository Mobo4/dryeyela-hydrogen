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

// Helper function to get brand page path
// PRN, Avenova, EyePromise have custom /pages/ routes
const CUSTOM_BRAND_PAGES = ['prn', 'avenova', 'eyepromise'];
function getBrandPath(brandHandle: string): string {
  return CUSTOM_BRAND_PAGES.includes(brandHandle)
    ? `/pages/${brandHandle}`
    : `/brands/${brandHandle}`;
}

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
        <Header title={layout?.shop?.name || 'DryEyeLA'} menu={headerMenu ?? undefined} />
        <main role="main" id="mainContent" className="flex-grow">
          {children}
        </main>
        {footerMenu && <Footer menu={footerMenu} />}
      </div>
    </div>
  );
}

import { UnifiedHeader } from '~/components/UnifiedHeader';

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
      <UnifiedHeader
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
      {/* Shop All Link */}
      <Link
        to="/collections/all"
        onClick={onClose}
        className="py-3 font-semibold text-besilos-navy border-b border-besilos-sage/20"
      >
        Shop All
      </Link>

      {/* By Product Type Section */}
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between items-center w-full py-3 text-left font-semibold text-besilos-navy border-b border-besilos-sage/20">
              By Product Type
              <IconCaret direction={open ? 'up' : 'down'} />
            </Disclosure.Button>
            <Disclosure.Panel className="pl-4 pb-4 bg-besilos-sage/5 rounded-b-lg">
              <div className="grid gap-2 mt-2">
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
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* By Brand Section */}
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between items-center w-full py-3 text-left font-semibold text-besilos-navy border-b border-besilos-sage/20">
              By Brand
              <IconCaret direction={open ? 'up' : 'down'} />
            </Disclosure.Button>
            <Disclosure.Panel className="pl-4 pb-4 bg-besilos-sage/5 rounded-b-lg">
              <div className="grid gap-2 mt-2">
                {BRANDS.map((brand) => (
                  <Link
                    key={brand.handle}
                    to={getBrandPath(brand.handle)}
                    onClick={onClose}
                    className="py-2 text-besilos-navy/70 hover:text-besilos-sage"
                  >
                    {brand.name}
                  </Link>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* For Doctors */}
      <a
        href="https://www.prnphysicianportal.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="py-3 font-semibold text-besilos-navy border-b border-besilos-sage/20"
      >
        For Doctors
      </a>

      {/* Contact Us */}
      <Link
        to="/pages/contact"
        onClick={onClose}
        className="py-3 font-semibold text-besilos-navy"
      >
        Contact Us
      </Link>
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
          {/* Shop All */}
          <Link
            to="/collections/all"
            prefetch="intent"
            className={`px-4 py-2 rounded-md transition-colors font-medium ${isHome
              ? 'hover:bg-besilos-cream/10 text-besilos-cream'
              : 'hover:bg-besilos-navy/10 text-besilos-navy'
              }`}
          >
            Shop All
          </Link>

          {/* By Product Type Megamenu */}
          <MegaMenuDropdown
            title="By Product Type"
            isHome={isHome}
          >
            <div className="p-6 w-[350px] bg-white rounded-2xl shadow-xl ring-1 ring-black/5">
              <ul className="space-y-2">
                {SHOP_CATEGORIES.map((category) => (
                  <li key={category.handle}>
                    <Link
                      to={`/collections/${category.handle}`}
                      className="block p-2 rounded-lg text-besilos-navy/80 hover:bg-besilos-sage/10 hover:text-besilos-sage transition-colors text-sm"
                      prefetch="intent"
                    >
                      {category.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </MegaMenuDropdown>

          {/* By Brand Megamenu */}
          <MegaMenuDropdown
            title="By Brand"
            isHome={isHome}
          >
            <div className="p-6 w-[250px] bg-white rounded-2xl shadow-xl ring-1 ring-black/5">
              <ul className="space-y-2">
                {BRANDS.map((brand) => (
                  <li key={brand.handle}>
                    <Link
                      to={getBrandPath(brand.handle)}
                      className="block p-2 rounded-lg text-besilos-navy/80 hover:bg-besilos-sage/10 hover:text-besilos-sage transition-colors text-sm"
                      prefetch="intent"
                    >
                      {brand.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </MegaMenuDropdown>

          {/* For Doctors */}
          <a
            href="https://www.prnphysicianportal.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={`px-4 py-2 rounded-md transition-colors font-medium ${isHome
              ? 'hover:bg-besilos-cream/10 text-besilos-cream'
              : 'hover:bg-besilos-navy/10 text-besilos-navy'
              }`}
          >
            For Doctors
          </a>

          {/* Contact */}
          <Link
            to="/pages/contact"
            prefetch="intent"
            className={`px-4 py-2 rounded-md transition-colors font-medium ${isHome
              ? 'hover:bg-besilos-cream/10 text-besilos-cream'
              : 'hover:bg-besilos-navy/10 text-besilos-navy'
              }`}
          >
            Contact Us
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
        <Link to="/account/login" className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5">
          <IconAccount />
        </Link>
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
              Shop
            </Heading>
            <ul className="space-y-2">
              {SHOP_CATEGORIES.slice(0, 8).map((category) => (
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
              <li>
                <Link to="/collections/all" className="text-besilos-sage hover:underline text-sm font-medium">
                  Shop All →
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Brands */}
          <div>
            <Heading as="h3" size="lead" className="text-besilos-cream mb-4">
              Brands
            </Heading>
            <ul className="space-y-2">
              {BRANDS.map((brand) => (
                <li key={brand.handle}>
                  <Link
                    to={getBrandPath(brand.handle)}
                    className="text-besilos-cream/70 hover:text-besilos-sage transition-colors text-sm"
                    prefetch="intent"
                  >
                    {brand.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <Heading as="h3" size="lead" className="text-besilos-cream mb-4">
              Company
            </Heading>
            <ul className="space-y-2">
              <li><Link to="/pages/about" className="text-besilos-cream/70 hover:text-besilos-sage text-sm">About Us</Link></li>
              <li><Link to="/pages/terms-conditions" className="text-besilos-cream/70 hover:text-besilos-sage text-sm">Warranty</Link></li>
              <li><Link to="/pages/careers" className="text-besilos-cream/70 hover:text-besilos-sage text-sm">Careers</Link></li>
              <li><Link to="/pages/contact" className="text-besilos-cream/70 hover:text-besilos-sage text-sm">Contact Us</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <Heading as="h3" size="lead" className="text-besilos-cream mb-4">
              Resources
            </Heading>
            <ul className="space-y-2">
              <li><Link to="/account" className="text-besilos-cream/70 hover:text-besilos-sage text-sm">My Account</Link></li>
              <li><Link to="/pages/shipping-returns" className="text-besilos-cream/70 hover:text-besilos-sage text-sm">Shipping & Returns</Link></li>
              <li><a href="https://www.prnphysicianportal.com/" className="text-besilos-cream/70 hover:text-besilos-sage text-sm">For Healthcare Professionals</a></li>
              <li><Link to="/journal" className="text-besilos-cream/70 hover:text-besilos-sage text-sm">Journal</Link></li>
              <li><Link to="/pages/faq" className="text-besilos-cream/70 hover:text-besilos-sage text-sm">FAQs</Link></li>
            </ul>

            <div className="mt-8">
              <Heading as="h4" size="copy" className="text-besilos-cream mb-2">Customer Service</Heading>
              <Text className="text-besilos-cream/60 text-sm">
                Questions? <Link to="/pages/contact" className="underline hover:text-besilos-sage">Contact us</Link>
              </Text>
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
              <Link to="/policies/refund-policy" className="text-besilos-cream/50 hover:text-besilos-sage text-xs">
                Refund Policy
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
