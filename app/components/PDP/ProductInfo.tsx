import { Heading, Text } from '~/components/Text';

export function ProductInfo({ title, vendor, description, reviews }: any) {
    return (
        <div className="flex flex-col gap-4">
            {/* Vendor/Category */}
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-besilos-blue border-b border-besilos-blue/20 pb-0.5">
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

            {/* Ratings Placeholder */}
            <div className="flex items-center gap-4">
                <div className="flex text-besilos-gold">
                    {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                    ))}
                </div>
                <Text size="fine" className="text-besilos-navy/60 font-medium">
                    4.8 (40 Reviews)
                </Text>
            </div>

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
