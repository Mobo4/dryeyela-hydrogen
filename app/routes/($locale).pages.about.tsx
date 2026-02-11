import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Heading, Text } from '~/components/Text';
import { HeroSection } from '~/components/sections';
import { Button } from '~/components/Button';

export async function loader({ request }: LoaderFunctionArgs) {
    return json({});
}

export default function AboutPage() {
    return (
        <div className="about-page bg-white">
            {/* 1. Hero Section */}
            <HeroSection
                title="Our Philosophy"
                breadcrumbs={[
                    { label: 'Home', to: '/' },
                    { label: 'About Us' },
                ]}
                size="large"
                background="cream"
            />

            {/* 2. Mission Statement */}
            <section className="py-20 md:py-28">
                <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
                    <span className="text-besilos-blue font-bold tracking-widest text-xs mb-6 block">The DryEyeLA Standard</span>
                    <Heading as="h2" size="display" className="text-besilos-navy mb-8 leading-tight">
                        Curated by Specialists. <br />
                        Proven by Science.
                    </Heading>
                    <Text className="text-xl md:text-2xl text-besilos-navy/80 leading-relaxed font-medium">
                        "We believe that dry eye relief shouldn't be a guessing game. Every product in our catalog is vetted by leading eye care professionals to ensure safety, purity, and clinical efficacy."
                    </Text>
                </div>
            </section>

            {/* 3. The Pillars */}
            <section className="bg-besilos-navy py-24 text-white">
                <div className="max-w-[1600px] mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
                        <Pillar
                            icon={<IconBeaker />}
                            title="Clinical Efficacy"
                            description="We only stock products with proven clinical data supporting their effectiveness in treating dry eye disease."
                        />
                        <Pillar
                            icon={<IconLeaf />}
                            title="Pure Ingredients"
                            description="Our selection prioritizes preservative-free formulations and high-quality, pharmaceutical-grade ingredients."
                        />
                        <Pillar
                            icon={<IconShield />}
                            title="Safety First"
                            description="Vetted by optometric specialists to ensure every product is safe for long-term daily use."
                        />
                    </div>
                </div>
            </section>

            {/* 4. Story / Context */}
            <section className="py-24 md:py-32 overflow-hidden">
                <div className="max-w-[1600px] mx-auto px-4 md:px-8">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="relative order-2 lg:order-1">
                            <div className="absolute inset-0 bg-besilos-blue/10 rounded-[3rem] transform -rotate-3 scale-105"></div>
                            <img
                                src="https://cdn.shopify.com/s/files/1/0815/3415/7037/files/AV-Doctor-Section_800x.jpg"
                                alt="Eye Care Professional"
                                className="relative rounded-[3rem] shadow-2xl w-full object-cover aspect-[4/5]"
                            />
                        </div>
                        <div className="order-1 lg:order-2">
                            <Heading as="h3" size="lead" className="text-besilos-navy mb-6">Expertise You Can Trust</Heading>
                            <div className="prose prose-lg text-besilos-navy/80 prose-headings:text-besilos-navy">
                                <p>
                                    Navigating the world of dry eye treatments can be overwhelming. The market is flooded with products, many of which contain preservatives that can actually worsen dry eye symptoms over time.
                                </p>
                                <p>
                                    DryEyeLA was founded to provide a curated haven for patients seeking relief. We strip away the noise and offer only the gold standard in ocular hygiene and hydration.
                                </p>
                                <p>
                                    Whether you are suffering from Meibomian Gland Dysfunction (MGD), Blepharitis, or general digital eye strain, our collection is designed to provide building blocks for a healthy tear film.
                                </p>
                            </div>
                            <div className="mt-12 flex gap-4">
                                <Button to="/collections/all" variant="primary">Shop Collection</Button>
                                <Button to="/pages/contact" variant="secondary">Contact Us</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}

function Pillar({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="text-center md:text-left">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0 backdrop-blur-sm border border-white/20">
                {icon}
            </div>
            <h3 className="font-heading font-bold text-2xl mb-4">{title}</h3>
            <p className="text-white/80 leading-relaxed text-lg">{description}</p>
        </div>
    );
}

function IconBeaker() {
    return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 3h15"></path>
            <path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3"></path>
            <path d="M6 14h12"></path>
        </svg>
    );
}

function IconLeaf() {
    return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 22s5-3 9-11c0 0 2-6 8-8s2 6-4 13c-3 3-9 6-13 6Z"></path>
        </svg>
    );
}

function IconShield() {
    return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
    );
}
