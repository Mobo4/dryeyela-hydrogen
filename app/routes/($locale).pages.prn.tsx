import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData } from '@remix-run/react';
import { Heading, Text, Section } from '~/components/Text';
import { ProductSwimlane } from '~/components/ProductSwimlane';
import { Button } from '~/components/Button';
import { getPrnProduct } from '~/data/prn-products'; // Reuse if needed, or fetch collection

// Using generic product search for PRN, similar to Avenova logic
export async function loader({ params, context }: LoaderFunctionArgs) {
    const { storefront } = context;

    try {
        // Broad search for 'De3' or 'Omega' to ensure we get results
        // In reality we should probably fetch a specific collection 'prn-vision'
        const { products } = await storefront.query(PRODUCTS_SEARCH_QUERY, {
            variables: { query: 'Omega', count: 4 },
        });

        return json({
            brand: 'PRN Vision',
            products,
            error: null
        });
    } catch (error: any) {
        console.error('Error loading PRN products:', error);
        return json({
            brand: 'PRN Vision',
            products: { nodes: [] },
            error: error.message
        });
    }
}

export default function PRNPage() {
    const { products, error } = useLoaderData<typeof loader>();

    return (
        <div className="prn-page bg-white font-sans text-slate-800">
            {/* 1. Hero Section */}
            <section className="relative w-full py-24 md:py-32 bg-[#152c52] text-white">
                <div className="absolute inset-0 overflow-hidden">
                    {/* Background pattern or subtle image */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-3xl transform translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-1/2 h-full bg-blue-400/5 blur-3xl transform -translate-x-1/2"></div>
                </div>

                <div className="max-w-[1600px] mx-auto px-4 md:px-8 relative z-10 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-widest mb-6">
                            Doctor Recommended
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                            Premium Eye Nutrition Backed by Science.
                        </h1>
                        <p className="text-xl text-blue-100/80 mb-8 max-w-lg leading-relaxed">
                            Trusted by over 5,000 eye care professionals. Our formulations provide essential nutrients for optimal vision health.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button to="#products" variant="primary" className="bg-white text-[#152c52] hover:bg-blue-50 border-transparent">
                                Shop Best Sellers
                            </Button>
                            <Button to="/pages/about" variant="secondary" className="border-white/30 text-white hover:bg-white/10">
                                Learn More
                            </Button>
                        </div>
                    </div>
                    <div className="relative hidden md:block">
                        {/* Placeholder for Hero Image - mimicking the bottles group */}
                        <img
                            src="https://prnvision.com/cdn/shop/files/PRN_De3_Bottle_180ct.png?v=1743076179"
                            alt="PRN Products"
                            className="w-full max-w-md mx-auto drop-shadow-2xl animate-fade-in-up"
                        />
                    </div>
                </div>
            </section>

            {/* 2. Stats / Features Line */}
            <section className="bg-white border-b border-gray-100 py-8 relative shadow-sm z-20 -mt-4 mx-4 md:mx-8 rounded-xl max-w-[1500px] lg:mx-auto">
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
                    <FeatureItem
                        icon={<IconShipping />}
                        label="Free Shipping"
                    />
                    <FeatureItem
                        icon={<IconCustomers />}
                        label="97,000+ Customers"
                    />
                    <FeatureItem
                        icon={<IconGuarantee />}
                        label="100% Satisfaction Guarantee"
                    />
                </ul>
            </section>

            {/* 3. Best Sellers */}
            <section id="products" className="py-24">
                <div className="max-w-[1600px] mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <Heading as="h2" size="display" className="text-[#152c52] mb-4">Doctor Recommended Products</Heading>
                        <Text className="text-slate-500">Formulations based on clinical evidence, not trends.</Text>
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
                                {error ? `Error: ${error}` : 'No products found.'}
                            </Text>
                        </div>
                    )}
                </div>
            </section>

            {/* 4. Education Grid */}
            <section className="bg-slate-50 py-24">
                <div className="max-w-[1600px] mx-auto px-4 md:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <InfoCard
                            title="Doctor Recommended"
                            desc="Over 5,000 optometrists and ophthalmologists recommend PRN products."
                        />
                        <InfoCard
                            title="Research Based"
                            desc="Formulated with research backed by ophthalmologists and optometrists."
                        />
                        <InfoCard
                            title="Home Delivery"
                            desc="Enjoy Free Shipping and fast home delivery – plus, get expert support."
                        />
                        <InfoCard
                            title="3rd Party Tested"
                            desc="Our products are 3rd party tested for purity and safety."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

function FeatureItem({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <li className="flex items-center gap-3 md:gap-4">
            <div className="text-blue-500">
                {icon}
            </div>
            <span className="font-bold text-[#152c52] text-sm md:text-base uppercase tracking-wider">
                {label}
            </span>
        </li>
    );
}

function InfoCard({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:border-blue-200 transition-colors">
            <h3 className="text-xl font-bold text-[#152c52] mb-3">{title}</h3>
            <p className="text-slate-600 leading-relaxed text-sm">{desc}</p>
            <a href="/pages/about" className="inline-block mt-4 text-blue-600 font-bold text-sm hover:underline">Learn more →</a>
        </div>
    );
}

// Icons
function IconShipping() {
    return (
        <svg fill="none" height="32" viewBox="0 0 24 24" width="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
    );
}
function IconCustomers() {
    return (
        <svg fill="none" height="32" viewBox="0 0 24 24" width="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
    );
}
function IconGuarantee() {
    return (
        <svg fill="none" height="32" viewBox="0 0 24 24" width="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
    );
}

const PRODUCTS_SEARCH_QUERY = `#graphql
  query ProductsSearch($query: String!, $count: Int!) {
    products(first: $count, query: $query) {
      nodes {
        id
        title
        handle
        vendor
        publishedAt
        featuredImage {
          url
          altText
          width
          height
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 1) {
          nodes {
            id
            availableForSale
            image {
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
          }
        }
      }
    }
  }
`;
