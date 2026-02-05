import { json, type MetaArgs, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData } from '@remix-run/react';
import { getSeoMeta, Image } from '@shopify/hydrogen';
import { Link } from '~/components/Link';
import { HeroSection, TrustBadgesSection, CTASection } from '~/components/sections';

export const handle = {
    seo: {
        title: 'FDA Clears First Daily Disposable Soft EDOF Contact Lens for Presbyopia | DryEyeLA Journal',
        description: 'The FDA has cleared Deseyne, the first daily disposable soft EDOF contact lens for presbyopia, offering a new non-surgical option for presbyopes.',
    },
};

export async function loader({ request, context }: LoaderFunctionArgs) {
    const { language, country } = context.storefront.i18n;
    const formattedDate = new Intl.DateTimeFormat(`${language}-${country}`, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date('2025-12-24T12:00:00Z'));

    return json({ formattedDate });
}

export const meta = ({ matches }: MetaArgs<typeof loader>) => {
    return getSeoMeta(...matches.map((match) => (match.data as any)?.seo));
};

export default function DeseyneArticle() {
    const { formattedDate } = useLoaderData<typeof loader>();

    return (
        <>
            <HeroSection
                title="FDA Clears First Daily Disposable Soft EDOF Contact Lens"
                subtitle={`${formattedDate} • By Dr. Alex Bonakdar`}
                breadcrumbs={[
                    { label: 'Home', to: '/' },
                    { label: 'Journal', to: '/journal' },
                    { label: 'FDA Clears Deseyne Lens' },
                ]}
                size="small"
                background="cream"
            />

            <article className="py-12 md:py-16 bg-white">
                <div className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12">
                    {/* Back Link */}
                    <Link
                        to="/journal"
                        className="inline-flex items-center gap-2 text-besilos-sage hover:text-besilos-sage/80 mb-8 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Journal
                    </Link>

                    {/* Featured Image */}
                    <div className="mb-10 rounded-2xl overflow-hidden bg-black">
                        <img
                            src="/assets/deseyne-edof-lens.png"
                            alt="Futuristic EDOF Contact Lens"
                            className="w-full h-auto object-cover"
                        />
                    </div>

                    {/* Article Body */}
                    <div className="prose prose-lg max-w-none prose-headings:text-besilos-navy prose-headings:font-bold prose-p:text-besilos-navy/80 prose-a:text-besilos-sage prose-a:no-underline hover:prose-a:underline prose-strong:text-besilos-navy prose-ul:text-besilos-navy/80 prose-ol:text-besilos-navy/80">
                        <p className="lead text-xl text-besilos-navy font-medium mb-8">
                            In a groundbreaking development for vision care, the U.S. FDA has granted 510(k) clearance to the <strong>Deseyne</strong> contact lens—the first daily disposable soft lens to feature Extended Depth of Focus (EDOF) technology for presbyopia management.
                        </p>

                        <h3>Why This Matters for Presbyopes</h3>
                        <p>
                            Presbyopia, the gradual loss of the eye's ability to focus on nearby objects, affects nearly everyone as they age. Until now, contact lens options were largely limited to standard multifocals, which split light into distinct zones (near and distance). While effective for many, these designs can sometimes compromise contrast sensitivity or cause visual artifacts like glare and halos.
                        </p>
                        <p>
                            The newly cleared <strong>Deseyne (vifilcon C)</strong> lens by Cataltheia Group introduces true <strong>EDOF optical design</strong> to the daily disposable market.
                        </p>

                        <h3>Bringing Surgical Tech to Contact Lenses</h3>
                        <p>
                            EDOF technology has been a premium standard in intraocular lenses (IOLs) used during cataract surgery. It works by creating a single, elongated focal point rather than multiple distinct focal points. This allows for:
                        </p>
                        <ul>
                            <li><strong>Continuous Vision:</strong> A seamless transition from distance to intermediate to near vision.</li>
                            <li><strong>Reduced Visual Disturbances:</strong> Less ghosting and fewer halos tailored compared to traditional multifocals.</li>
                            <li><strong>Easier Adaptation:</strong> The brain adapts more naturally to the elongated focus.</li>
                        </ul>

                        <blockquote className="border-l-4 border-besilos-blue pl-6 italic my-8 text-besilos-navy text-xl">
                            "This clearance marks the first time patients can access patented EDOF optical design technology in a convenient, daily disposable modality—without the need for surgery."
                        </blockquote>

                        <h3>The Vifilcon C Material</h3>
                        <p>
                            Beyond the optics, the lens is built on the <strong>vifilcon C</strong> platform, a hydrogel material enhanced with hyaluronic acid and tamarind seed polysaccharide. These natural polymers mimic the eye's mucous layer to promote tear film stability and all-day comfort, addressing the dryness often associated with contact lens wear in presbyopic populations.
                        </p>

                        <h3>Availability</h3>
                        <p>
                            With this December 2025 clearance, the Deseyne lens is expected to roll out to eye care practitioners in early 2026. At <strong>DryEyeLA</strong>, we are closely monitoring its availability to bring this cutting-edge option to our patients.
                        </p>
                    </div>

                    {/* Share Section */}
                    <div className="mt-12 pt-8 border-t border-besilos-sage/10">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h4 className="text-lg font-semibold text-besilos-navy mb-2">Share This Article</h4>
                                <p className="text-sm text-besilos-navy/60">Help others learn about this breakthrough</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => {
                                        if (typeof window !== 'undefined') {
                                            navigator.clipboard.writeText(window.location.href);
                                            alert('Link copied!');
                                        }
                                    }}
                                    className="px-4 py-2 rounded-full bg-besilos-cream flex items-center gap-2 text-besilos-navy hover:bg-besilos-sage hover:text-white transition-colors text-sm font-medium"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Copy Link
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </article>

            <CTASection
                title="Interested in Deseyne Lenses?"
                description="Contact us to be notified when these lenses become available or to schedule a fitting."
                primaryCTA={{ label: 'Contact Us', to: '/pages/contact' }}
                secondaryCTA={{ label: 'Shop Eye Care', to: '/collections/all' }}
                variant="centered"
                background="navy"
            />
        </>
    );
}
