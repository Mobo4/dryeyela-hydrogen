import { Link } from '@remix-run/react';
import { type PrnProduct } from '~/data/prn-products';

interface ProductRecommendationsProps {
    products: PrnProduct[];
}

export function ProductRecommendations({ products }: ProductRecommendationsProps) {
    if (!products || products.length === 0) return null;

    return (
        <section className="bg-slate-50 py-16 px-4 border-t border-slate-200">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-[#152c52] text-center mb-12">
                    You May Also Like
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-center max-w-full overflow-hidden px-1">
                    {products.map(product => (
                        <Link
                            key={product.id}
                            to={`/products/${product.id}`}
                            className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md hover:border-blue-200 transition-all group flex flex-col"
                        >
                            <div className="aspect-square bg-[#fcfbfc] rounded-lg mb-4 overflow-hidden p-4 flex items-center justify-center">
                                <img
                                    src={product.images[0].src}
                                    alt={product.images[0].alt}
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="mt-auto">
                                <h3 className="font-bold text-[#152c52] group-hover:text-[#356ecb] transition-colors">
                                    {product.title}
                                </h3>
                                <p className="text-sm text-slate-500 mb-3">{product.subtitle}</p>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-[#152c52]">${product.price}</span>
                                    <span className="text-xs text-[#356ecb] font-semibold uppercase tracking-wider">View Product</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
