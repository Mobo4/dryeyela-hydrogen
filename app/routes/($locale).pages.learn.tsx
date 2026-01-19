import { Link } from '@remix-run/react';
import { HeroSection } from '~/components/sections';

export function meta() {
    return [
        { title: 'Learn | DryEyeLA' },
        { name: 'description', content: 'Educational resources and guides for dry eye treatment.' },
    ];
}

export default function LearnPage() {
    return (
        <>
            <HeroSection
                title="Learn"
                breadcrumbs={[
                    { label: 'Home', to: '/' },
                    { label: 'Learn' },
                ]}
                size="small"
                background="cream"
            />

            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                        {/* Blog */}
                        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-blue-200 transition-all group">
                            <h3 className="text-2xl font-bold text-[#152c52] mb-4">Dry Eye Blog</h3>
                            <p className="text-slate-600 mb-6">Expert articles and updates on the latest dry eye treatments and research.</p>
                            <Link to="/blogs/news" className="text-blue-600 font-bold group-hover:underline">Read Field Notes &rarr;</Link>
                        </div>

                        {/* Treatment Guide */}
                        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-blue-200 transition-all group">
                            <h3 className="text-2xl font-bold text-[#152c52] mb-4">Treatment Guide</h3>
                            <p className="text-slate-600 mb-6">A comprehensive guide to understanding and treating different types of dry eye.</p>
                            <Link to="/pages/treatment-guide" className="text-blue-600 font-bold group-hover:underline">View Guide &rarr;</Link>
                        </div>

                        {/* FAQ */}
                        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-blue-200 transition-all group">
                            <h3 className="text-2xl font-bold text-[#152c52] mb-4">FAQ</h3>
                            <p className="text-slate-600 mb-6">Common questions about products, shipping, and dry eye care.</p>
                            <Link to="/pages/faq" className="text-blue-600 font-bold group-hover:underline">View FAQ &rarr;</Link>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}
