import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData } from '@remix-run/react';
import { Heading, Text } from '~/components/Text';
import { ProductSwimlane } from '~/components/ProductSwimlane';
import { PRODUCTS_SEARCH_QUERY } from '~/data/queries';

/**
 * Avenova Brand Page
 * 
 * Displays Avenova products and brand information.
 * Uses Shopify Storefront API to fetch products by brand name.
 */
export async function loader({ params, context }: LoaderFunctionArgs) {
  const { storefront } = context;

  try {
    // Search for Avenova products by vendor name
    const { products } = await storefront.query(PRODUCTS_SEARCH_QUERY, {
      variables: {
        query: 'vendor:"Avenova" OR title:Avenova',
        count: 4,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
    });

    return json({
      brand: 'Avenova',
      products,
      error: null,
    });
  } catch (error) {
    console.error('Error loading Avenova products:', error);
    return json({
      brand: 'Avenova',
      products: { nodes: [] },
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default function AvenovaPage() {
    const { brand, products, error } = useLoaderData<typeof loader>();

    return (
        <div className="avenova-page bg-white">
            {/* 1. Hero Section */}
            <section className="relative w-full h-[350px] md:h-[500px] overflow-hidden">
                {/* Hero Background Images */}
                <picture>
                    <source
                        media="(min-width: 768px)"
                        srcSet="/assets/hero-premium-v1.png"
                    />
                    <img
                        src="/assets/avenova/Avenova_Hero_Banner_Mobile.png"
                        alt="SEE the difference better lid & lash hygiene can make in your eye health."
                        className="w-full h-full object-cover"
                    />
                </picture>

                {/* Hero Content Overlay */}
                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-[1600px] mx-auto px-4 md:px-8 w-full">
                        <div className="max-w-[460px] md:bg-white/30 md:backdrop-blur-md p-6 md:p-10 rounded-2xl border border-white/20">
                            <h1 className="text-[40px] md:text-[56px] font-heading font-bold text-besilos-navy leading-[1] mb-4">
                                Upgrade Your Routine
                            </h1>
                            <p className="text-xl text-besilos-navy/90 leading-relaxed mb-8 font-medium">
                                SEE the difference better lid & lash hygiene can make in your eye health.
                            </p>
                            <a
                                href="/collections/all"
                                className="inline-block bg-besilos-navy text-white px-10 py-4 font-bold uppercase tracking-wider hover:bg-besilos-navy/90 transition-all transform hover:scale-105 active:scale-95 shadow-xl"
                            >
                                Shop All
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Features Line */}
            <section className="bg-besilos-navy py-12 relative overflow-hidden">
                <div className="max-w-[1600px] mx-auto px-4 md:px-8 relative z-10">
                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <FeatureItem
                            icon={<IconFreeShipping />}
                            label="Free Shipping"
                        />
                        <FeatureItem
                            icon={<IconCustomers />}
                            label="55,000+ Customers"
                        />
                        <FeatureItem
                            icon={<IconSatisfaction />}
                            label="100% Satisfaction Guarantee"
                        />
                    </ul>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-besilos-blue/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            </section>

            {/* 3. Best Sellers Section */}
            <section className="py-24">
                <div className="max-w-[1600px] mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
                        <div>
                            <Heading as="h2" size="heading" className="text-besilos-navy mb-2">Avenova Best Sellers</Heading>
                            <Text className="text-gray-500">Clinically proven solutions for premium eye care.</Text>
                        </div>
                        <a href="/collections/all" className="text-besilos-blue font-bold hover:text-besilos-navy transition-colors flex items-center gap-2 group">
                            View All Products
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </a>
                    </div>
                    {products && products.nodes && products.nodes.length > 0 ? (
                        <ProductSwimlane
                            products={products}
                            count={4}
                            title=""
                        />
                    ) : (
                        <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                            <Text className="text-gray-400">
                                {error ? `Error: ${error}` : 'No Avenova products found in the catalog.'}
                            </Text>
                        </div>
                    )}
                </div>
            </section>

            {/* 4. Education Block */}
            <section className="bg-besilos-cream py-24 border-y border-gray-100">
                <div className="max-w-[1600px] mx-auto px-4 md:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-besilos-blue/5 rounded-3xl transform translate-x-4 translate-y-4 -z-10"></div>
                            <img
                                src="https://cdn.shopify.com/s/files/1/0815/3415/7037/files/AV-Doctor-Section_800x.jpg"
                                alt="Doctor recommending Avenova"
                                className="rounded-3xl shadow-2xl w-full object-cover aspect-[4/3]"
                            />
                        </div>
                        <div className="lg:pl-10">
                            <div className="inline-block px-4 py-1 bg-besilos-blue/10 text-besilos-blue rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                                The Gold Standard
                            </div>
                            <Heading as="h2" size="heading" className="text-besilos-navy mb-8 text-4xl md:text-5xl">Why Avenova?</Heading>
                            <Text className="text-lg md:text-xl text-besilos-navy/80 mb-10 leading-relaxed font-medium italic">
                                "Avenova is the #1 doctor-recommended lid and lash cleanser. Our patented formula is the purest Hypochlorous Acid (HOCl) available."
                            </Text>
                            <ul className="space-y-6">
                                <CheckItem text="Scientifically proven & patented pure HOCl" />
                                <CheckItem text="Safe for daily & long-term lid hygiene" />
                                <CheckItem text="Zero harsh chemicals or preservatives" />
                                <CheckItem text="Effective against 99.9% of bacteria" />
                            </ul>
                            <div className="mt-12">
                                <a
                                    href="/collections/all"
                                    className="text-besilos-navy font-bold border-b-2 border-besilos-gold pb-1 hover:text-besilos-gold transition-colors"
                                >
                                    Shop Avenova Science →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function FeatureItem({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <li className="flex items-center gap-6 group">
            <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center bg-white/5 border border-white/20 rounded-2xl shadow-inner backdrop-blur-sm group-hover:bg-white/10 transition-colors">
                {icon}
            </div>
            <span className="font-heading font-bold uppercase tracking-widest text-white text-sm md:text-base leading-tight max-w-[180px]">
                {label}
            </span>
        </li>
    );
}

function CheckItem({ text }: { text: string }) {
    return (
        <li className="flex items-start gap-4 text-besilos-navy group">
            <div className="mt-1 w-6 h-6 flex-shrink-0 bg-besilos-blue text-white rounded-full flex items-center justify-center text-[10px] transform group-hover:scale-110 transition-transform">
                ✓
            </div>
            <span className="text-lg font-medium opacity-90">{text}</span>
        </li>
    );
}

function IconFreeShipping() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
    );
}

function IconCustomers() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
    );
}

function IconSatisfaction() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
        </svg>
    );
}

