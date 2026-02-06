import { Link, useLocation, useParams } from '@remix-run/react';
import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { IconAccount, IconBag, IconMenu, IconCaret } from '~/components/Icon';
import { SearchAutocomplete } from '~/components/SearchAutocomplete';
import { SHOP_CATEGORIES, BRANDS, SYMPTOMS } from '~/data/navigation';

export function UnifiedHeader({ openCart, openMenu }: { openCart: () => void; openMenu: () => void }) {
    const location = useLocation();
    const params = useParams();
    const locale = params.locale || 'en';

    return (
        <header className="w-full flex flex-col z-50 sticky top-0 shadow-sm border-b border-gray-100 bg-white">
            {/* 1. Announcement Bar */}
            <div
                className="text-besilos-navy py-2 px-4 text-center text-sm font-medium"
                style={{ backgroundColor: '#face52' }}
            >
                <p>Free Shipping on Orders Over $100 | Doctor Verified Products</p>
            </div>

            {/* 2. Main Navigation Bar */}
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 flex items-center justify-between h-20 md:h-24 w-full">
                {/* Logo */}
                <Link to="/" className="flex-shrink-0">
                    <img 
                        src="/assets/logos/logo-dryeyela-new.svg" 
                        alt="DryEyeLA" 
                        className="h-10 md:h-14"
                        onError={(e) => {
                            // Fallback to text logo if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent && !parent.querySelector('.logo-fallback')) {
                                const fallback = document.createElement('div');
                                fallback.className = 'logo-fallback text-besilos-navy font-bold text-xl md:text-2xl uppercase tracking-wider';
                                fallback.textContent = 'DryEyeLA';
                                parent.appendChild(fallback);
                            }
                        }}
                    />
                </Link>

                {/* Primary Nav with Mega Menus */}
                <nav className="hidden lg:flex items-center gap-2 font-medium text-besilos-navy text-sm uppercase tracking-widest">
                    <Link to="/" className="px-4 py-2 hover:text-besilos-blue transition-colors">Home</Link>

                    {/* By Category */}
                    <NavDropdown title="Shop by Category">
                        <div className="p-8 w-[600px] grid grid-cols-2 gap-x-12 gap-y-4">
                            {SHOP_CATEGORIES.map((cat) => (
                                <Link key={cat.handle} to={`/collections/${cat.handle}`} className="group flex flex-col gap-1">
                                    <span className="font-bold text-besilos-navy group-hover:text-besilos-blue transition-colors">{cat.title}</span>
                                    <span className="text-[10px] text-gray-400 normal-case font-normal leading-tight">{cat.description}</span>
                                </Link>
                            ))}
                        </div>
                    </NavDropdown>

                    {/* By Brand */}
                    <NavDropdown title="Shop by Brand">
                        <div className="p-8 w-[300px] flex flex-col gap-4">
                            {BRANDS.map((brand) => {
                                // PRN, Avenova, EyePromise have custom /pages/ routes
                                const customBrandPages = ['prn', 'avenova', 'eyepromise'];
                                const brandPath = customBrandPages.includes(brand.handle)
                                    ? `/pages/${brand.handle}`
                                    : `/brands/${brand.handle}`;
                                return (
                                    <Link key={brand.handle} to={brandPath} className="font-bold text-besilos-navy hover:text-besilos-blue transition-colors">
                                        {brand.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </NavDropdown>

                    {/* By Symptom */}
                    <NavDropdown title="Shop by Symptom">
                        <div className="p-8 w-[300px] flex flex-col gap-4">
                            {SYMPTOMS.length > 0 ? SYMPTOMS.map((symptom: any) => (
                                <Link key={symptom.handle} to={`/symptoms/${symptom.handle}`} className="font-bold text-besilos-navy hover:text-besilos-blue transition-colors">
                                    {symptom.title}
                                </Link>
                            )) : (
                                <span className="text-gray-400 italic normal-case font-normal">Symptom filtering coming soon</span>
                            )}
                        </div>
                    </NavDropdown>

                    <Link to="/pages/learn" className="px-4 py-2 hover:text-besilos-blue transition-colors">Learn</Link>
                </nav>

                {/* Search Bar - Desktop */}
                <div className="hidden md:block flex-1 max-w-md mx-8">
                    <SearchAutocomplete 
                        locale={locale}
                        placeholder="Search products..."
                        className="w-full"
                    />
                </div>

                {/* Icons & Actions */}
                <div className="flex items-center gap-1 md:gap-3">
                    <div className="hidden md:flex items-center">
                        <Link to="/account" className="p-3 text-besilos-navy hover:text-besilos-blue transition-colors">
                            <IconAccount />
                        </Link>
                    </div>

                    <button onClick={openCart} className="p-3 relative text-besilos-navy hover:text-besilos-blue transition-colors group">
                        <IconBag />
                        <span className="absolute top-2 right-2 bg-besilos-blue text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                            0
                        </span>
                    </button>

                    <button onClick={openMenu} className="lg:hidden p-3 text-besilos-navy hover:text-besilos-blue transition-colors">
                        <IconMenu />
                    </button>

                    <div className="hidden xl:block ml-4">
                        <Link to="/collections/all" className="bg-besilos-navy text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-besilos-blue transition-all shadow-md">
                            Shop All
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}

function NavDropdown({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Popover className="relative">
            {({ open }) => (
                <>
                    <Popover.Button className={`flex items-center gap-1 px-4 py-2 outline-none transition-colors ${open ? 'text-besilos-blue' : 'hover:text-besilos-blue'}`}>
                        {title}
                        <IconCaret direction={open ? 'up' : 'down'} />
                    </Popover.Button>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-2"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-2"
                    >
                        <Popover.Panel className="absolute left-0 z-50 mt-4 bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden">
                            {children}
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
}
