import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData, Link } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';
import { Button } from '~/components/Button';
import { ProductSwimlane } from '~/components/ProductSwimlane';
import { routeHeaders } from '~/data/cache';
import { seoPayload } from '~/lib/seo.server';
import { PRODUCTS_SEARCH_QUERY } from '~/data/queries';
import type { ProductCardFragment } from 'storefrontapi.generated';

export const headers = routeHeaders;

export async function loader({ request, context }: LoaderFunctionArgs) {
    const { storefront } = context;
    const seo = seoPayload.page({
        url: request.url,
        page: {
            title: 'EyePromise - DryEyeLA',
            seo: {
                title: 'EyePromise - DryEyeLA',
                description: 'Upgrade Your Eyes. Protect and enhance your sight with science based nutritional support.',
            },
        },
    });

    try {
        // Search for EyePromise products by vendor name
        const { products } = await storefront.query(PRODUCTS_SEARCH_QUERY, {
            variables: {
                query: 'vendor:"EyePromise" OR vendor:"Eye Promise"',
                count: 8,
                country: storefront.i18n.country,
                language: storefront.i18n.language,
            },
        });

        return json({
            seo,
            shopifyProducts: products,
            error: null,
        });
    } catch (error) {
        console.error('Error loading EyePromise products:', error);
        return json({
            seo,
            shopifyProducts: { nodes: [] },
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}

export default function EyePromisePage() {
    const { shopifyProducts, error } = useLoaderData<typeof loader>();

    // Fallback local product data when Shopify query returns no results
    const localProducts = [
        {
            title: "Dry Eye Starter Basket",
            label: "Best Seller",
            image: "https://raw.githubusercontent.com/Mobo4/dryeyela-hydrogen/main/public/products_processed/dry-eye-starter-basket.png",
            price: "$69.00",
            url: "/products/dry-eye-starter-basket-omega-3-cleanser"
        },
        {
            title: "EyePromise Restore",
            image: "https://prnvision.com/cdn/shop/files/ep_restore_60.jpg?v=1750779680&width=300",
            price: "$39.95",
            url: "/collections/supplements"
        },
        {
            title: "EyePromise EZ Tears™",
            image: "https://prnvision.com/cdn/shop/files/ep_ez_tears.jpg?v=1750779582&width=300",
            price: "$34.95",
            url: "/collections/supplements"
        },
        {
            title: "EyePromise Macular Health",
            image: "https://prnvision.com/cdn/shop/files/ep_macular_health_complete.jpg?v=1750779634&width=300",
            price: "$44.95",
            url: "/collections/supplements"
        },
        {
            title: "EyePromise Zeaxanthin + Lutein",
            image: "https://prnvision.com/cdn/shop/files/ep_zeaxanthin_lutein_180.jpg?v=1750779612&width=300",
            price: "$29.95",
            url: "/collections/supplements"
        },
        {
            title: "EyePromise Screen Shield™ Pro",
            image: "https://prnvision.com/cdn/shop/files/ep_screenshield.jpg?v=1750779541&width=300",
            price: "$32.95",
            url: "/collections/supplements"
        },
        {
            title: "EyePromise Vizual Edge™ Pro",
            image: "https://prnvision.com/cdn/shop/files/Vizual_Edge_Pro__66661.webp?v=1747749729&width=300",
            price: "$36.95",
            url: "/collections/supplements"
        }
    ];

    return (
        <div className="font-sans antialiased bg-white text-prn-blue w-full overflow-x-hidden">

            {/* HERO SECTION */}
            <section
                className="relative h-[600px] flex items-center bg-cover bg-center"
                style={{ backgroundImage: `url('https://prnvision.com/cdn/shop/files/EP_Hero_Banner_1920x600_w_certs.svg?v=1750441059')` }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-transparent via-white/40"></div>
                <div className="relative container mx-auto px-6 md:px-12 max-w-7xl">
                    <div className="max-w-2xl animate-fade-in-up">
                        <h1 className="text-5xl md:text-7xl font-bold text-prn-blue mb-4 tracking-tight leading-tight">
                            Upgrade Your Eyes
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed max-w-lg">
                            Protect and enhance your sight with science based nutritional support for healthy vision.
                        </p>
                        <div className="flex gap-4">
                            <Link
                                to="#products"
                                className="bg-prn-blue text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-prn-blue/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                            >
                                Shop Now
                            </Link>
                            <Link
                                to="/pages/dry-eye-quiz"
                                className="bg-white text-prn-blue border-2 border-prn-blue px-8 py-4 rounded-full font-bold text-lg hover:bg-prn-gray transition-all"
                            >
                                Take the Quiz
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* TRUST BAR */}
            <div className="bg-prn-gray py-6 border-b border-gray-200">
                <div className="container mx-auto px-6 flex justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Placeholders for logos (NSF, etc) - using text for now or simple icons */}
                    <span className="font-bold text-lg">GUARANTEED</span>
                    <span className="font-bold text-lg">DOCTOR RECOMMENDED</span>
                    <span className="font-bold text-lg">SCIENCE BASED</span>
                    <span className="font-bold text-lg">NSF CERTIFIED SPORT</span>
                </div>
            </div>

            {/* PRODUCTS SECTION */}
            <section id="products" className="py-20 bg-white">
                <div className="container mx-auto px-6 md:px-12 max-w-7xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-prn-blue mb-4">
                            Shop Our Best Selling Products
                        </h2>
                        <div className="w-24 h-1 bg-prn-gold mx-auto rounded-full"></div>
                    </div>

                    {/* Shopify products when available */}
                    {shopifyProducts && shopifyProducts.nodes && shopifyProducts.nodes.length > 0 ? (
                        <ProductSwimlane
                            products={{ nodes: shopifyProducts.nodes as ProductCardFragment[] }}
                            count={8}
                            title=""
                        />
                    ) : (
                        /* Fallback to local product data */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {localProducts.map((product, idx) => (
                                <Link
                                    key={idx}
                                    to={product.url}
                                    className="group flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-prn-blue/30 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                                >
                                    <div className="relative aspect-square bg-[#F4F4F4] flex items-center justify-center p-8 overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                                        />
                                        {product.label && (
                                            <span className="absolute top-4 right-4 bg-prn-gold text-prn-blue text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                                {product.label}
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-lg font-bold text-prn-blue mb-2 group-hover:text-besilos-primary transition-colors">
                                            {product.title}
                                        </h3>
                                        <div className="flex text-prn-gold mb-3 text-sm">
                                            {'★'.repeat(5)}
                                            <span className="text-gray-400 ml-2 text-xs">(120+ Reviews)</span>
                                        </div>
                                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                            <span className="font-bold text-lg text-gray-900">{product.price}</span>
                                            <span className="text-prn-blue font-semibold text-sm group-hover:underline">View Product &rarr;</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <Link to="/collections/all" className="inline-block border-b-2 border-prn-blue text-prn-blue font-bold hover:text-besilos-primary hover:border-besilos-primary transition-colors pb-1">
                            View All Solutions
                        </Link>
                    </div>
                </div>
            </section>

            {/* SOLUTIONS FOR PEOPLE */}
            <section className="py-20 bg-prn-gray">
                <div className="container mx-auto px-6 md:px-12 max-w-7xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-prn-blue mb-6">
                                Solutions For People
                            </h2>
                            <p className="text-gray-600 mb-6 text-lg">
                                Whether you are an athlete, a student, or simply aging gracefully, our targeted solutions support your unique eye health needs.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {['Age-Related', 'Screen Time', 'Athletes', 'Dry Eye', 'General Health'].map(tag => (
                                    <span key={tag} className="bg-white px-4 py-2 rounded-lg text-prn-blue font-semibold shadow-sm border border-gray-200">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-prn-blue h-48 rounded-2xl flex items-center justify-center text-white font-bold p-4 text-center">
                                Age-Related Eye Health
                            </div>
                            <div className="bg-white h-48 rounded-2xl flex items-center justify-center text-prn-blue font-bold p-4 text-center shadow-lg">
                                Screen Time Relief
                            </div>
                            <div className="bg-white h-48 rounded-2xl flex items-center justify-center text-prn-blue font-bold p-4 text-center shadow-lg">
                                Performance Vision
                            </div>
                            <div className="bg-prn-gold h-48 rounded-2xl flex items-center justify-center text-prn-blue font-bold p-4 text-center">
                                Dry Eye Relief
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <div className="mb-8">
                        <span className="text-prn-gold text-5xl font-serif">"</span>
                    </div>
                    <blockquote className="text-2xl md:text-3xl font-light text-prn-blue leading-relaxed mb-8">
                        Since I have been using EyePromise Restore my vision has improved over the past 3 or 4 years. I feel EyePromise supplements are great for people with macular problems such as myself.
                    </blockquote>
                    <cite className="not-italic font-bold text-gray-900 block">
                        — Wally B. <span className="text-gray-500 font-normal">| Verified Customer</span>
                    </cite>
                </div>
            </section>

        </div>
    );
}
