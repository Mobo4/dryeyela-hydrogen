import { Heading, Text } from '~/components/Text';

export function ProductInfo({ title, vendor, description, reviews }: any) {
    return (
        <div className="flex flex-col gap-4">
            {/* Doctor Recommendation Badge */}
            <div className="inline-flex items-center gap-2 bg-besilos-navy/5 border border-besilos-navy/10 rounded-full px-3 py-1.5">
                <svg className="w-4 h-4 text-besilos-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-xs font-semibold text-besilos-navy tracking-wide">Recommended by Dr. Bonakdar, OD</span>
            </div>

            {/* Vendor/Category */}
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-widest text-besilos-blue border-b border-besilos-blue/20 pb-0.5">
                    {vendor}
                </span >
                <span className="text-gray-300">|</span>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Premium Eye Care
                </span>
            </div>

            {/* Title */}
            <Heading as="h1" className="text-4xl md:text-5xl font-heading font-bold text-besilos-navy leading-tight">
                {title}
            </Heading>

            {/* Judge.me handles real reviews below the product section */}

            {/* Short Description - Scrollable for long text */}
            {description && (
                <div className="relative group mt-2">
                    <div
                        className="max-h-[300px] overflow-y-auto pr-4 text-lg text-besilos-navy/80 leading-relaxed font-body border-l-2 border-besilos-sage/20 pl-6 py-2 italic scrollbar-thin scrollbar-thumb-besilos-blue/20 hover:scrollbar-thumb-besilos-blue/40"
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                    {/* Bottom Fade for Scroll Indicator */}
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none opacity-60 group-hover:opacity-20 transition-opacity" />
                </div>
            )}
        </div>
    );
}
