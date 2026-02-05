export const PRN_PRODUCTS = {
    de3_omega: {
        id: 'de3-omega',
        title: 'De3 Omega Benefits®',
        subtitle: 'Omega-3 for Dry Eye Relief',
        price: 64.95,
        currency: 'USD',
        description:
            'De3 Omega Benefits® is a custom formulation for occasional eye dryness, to provide the body with the essential nutrients it needs to produce a soothing, healthy tear film*. De 3 contains 2240mg of EPA and DHA in an ultra-purified triglyceride (rTG) form.',
        variants: [
            {
                id: '1-month',
                title: '1 Month Supply',
                price: 64.95,
                savings: 0,
                sku: 'USDE3-90',
                image: 'https://prnvision.com/cdn/shop/files/De3_Omega_Benefits_1x1_web.jpg?crop=center&height=1200&v=1760032184&width=1200',
            },
            {
                id: '2-month',
                title: '2 Months Supply',
                price: 123.95,
                savings: 5.95,
                sku: 'USDE3-180',
                recommended: false,
                image: 'https://prnvision.com/cdn/shop/files/PRN_De3_Bottle_180ct.png?v=1743076179',
            },
            {
                id: '3-month',
                title: '3 Months Supply',
                price: 174.76,
                savings: 20.09,
                sku: 'USDE3-270',
                recommended: true,
                image: 'https://prnvision.com/cdn/shop/files/De3_Omega_Benfits_270ct_thumbnail.jpg?v=1760032184',
            },
        ],
        science: {
            title: 'The rTG Difference',
            description: 'Not all Omega-3s are created equal. PRN products are manufactured in the Re-Esterified Triglyceride (rTG) form, which mirrors the form of Omega-3s found in nature.',
            points: [
                'Superior Absorption: Absorbs 3x better than standard ethyl ester fish oils found in drugstores.',
                'Therapeutic Dosing: Delivers the high concentration of EPA & DHA needed for clinical results.',
                'Ultra-Purified: Distilled to remove contaminants like mercury and PCBs.'
            ]
        },
        doctorNote: {
            author: 'Dr. Alexander Bonakdar',
            role: 'Optometrist & Dry Eye Specialist',
            quote:
                "I recommend De3 Omega Benefits because it's one of the few supplements with the correct ratio of EPA to DHA in the re-esterified triglyceride form. This means better absorption and faster relief for my patients compared to standard over-the-counter fish oils.",
            image: '/images/Drbonakdar.png',
        },
        images: [
            {
                src: 'https://prnvision.com/cdn/shop/files/De3_Omega_Benefits_1x1_web.jpg?crop=center&height=1200&v=1760032184&width=1200',
                alt: 'De3 Omega Benefits Bottle',
            },
            {
                src: 'https://prnvision.com/cdn/shop/files/De3_Omega_Benefits_Compare_to_Others_1x1_web.jpg?crop=center&height=1200&v=1760460425&width=1200',
                alt: 'De3 Omega Benefits Comparison',
            },
            {
                src: 'https://prnvision.com/cdn/shop/files/De3_Omega_Benefits_Supplement_Facts_1x1_web.jpg?crop=center&height=1200&v=1760460425&width=1200',
                alt: 'De3 Omega Benefits Supplement Facts',
            },
        ],
        benefits: [
            {
                title: 'Relieves Dry Eyes',
                description:
                    'Provides the body with essential nutrients to produce a soothing, healthy tear film.',
            },
            {
                title: 'High Potency',
                description:
                    'Contains 2240mg of EPA and DHA in an ultra-purified triglyceride (rTG) form.',
            },
            {
                title: 'Doctor Recommended',
                description: 'Trust the formulation recommended by eye care professionals.',
            },
        ],
        ingredients: [
            'Highly Refined and Concentrated Omega-3 Fish Oil (Anchovy, Sardine, Mackerel)',
            'Capsule Shell (Gelatin, Glycerin, Purified Water)',
            'Natural Lemon Flavor',
            'Natural Mixed Tocopherols (Soy)',
        ],
        faqs: [
            {
                question: 'How many softgels should I take?',
                answer: 'Take 3 softgels daily with a meal, or as directed by your eye care professional.',
            },
            {
                question: 'Is this product gluten-free?',
                answer: 'Yes, De3 Omega Benefits is gluten-free and dairy-free.',
            },
        ],
        seodata: {
            title: 'DE3 Omega Benefits® – Omega-3 for Dry Eye Relief – PRN Vision Group',
            description:
                'De3 Omega Benefits® is a custom formulation for occasional eye dryness, to provide the body with the essential nutrients it needs to produce a soothing, healthy tear film*. De 3 contains 2240mg of EPA and DHA in an ultra-purified triglyceride (rTG) form.',
            url: 'https://prnvision.com/products/de3-omega-3-premium-dry-eye-supplements',
        },
    },
    kids_omega: {
        id: 'kids-omega',
        title: 'Eye Omega Benefits® for Kids',
        subtitle: 'Liquid Omega-3 | 30 Servings',
        price: 49.95,
        currency: 'USD',
        description:
            'A custom formulation for children providing essential nutrients for healthy eye development and production of soothing, healthy tear film. Great tasting liquid formula.',
        variants: [
            {
                id: '1-month',
                title: '1 Month Supply',
                price: 49.95,
                savings: 0,
                sku: 'USPED-1',
                recommended: false,
                image: '/products_processed/prn-kids-omega.jpg',
            },
            {
                id: '3-month',
                title: '3 Month Supply',
                price: 134.85,
                savings: 15.00,
                sku: 'USPED-3',
                recommended: true,
                image: '/products_processed/prn-kids-omega.jpg',
            }
        ],
        doctorNote: {
            author: 'Dr. Alexander Bonakdar',
            role: 'Optometrist',
            quote: "Children often can't swallow pills, and standard gummies are full of sugar. This liquid omega-3 is the perfect solution—high potency EPA/DHA in a form kids actually enjoy taking.",
            image: '/images/Drbonakdar.png',
        },
        images: [
            {
                src: '/products_processed/prn-kids-omega.jpg',
                alt: 'PRN Kids Omega 3 Bottle',
            },
        ],
        benefits: [
            {
                title: 'Great Taste',
                description: 'Natural Fruit Punch flavor that kids love. No fishy aftertaste or burps.',
            },
            {
                title: 'High Potency',
                description: 'Re-esterified Triglyceride (rTG) form allows for better absorption than standard fish oils.',
            },
            {
                title: 'Development Support',
                description: 'Supports healthy brain and eye development with essential EPA and DHA.',
            },
        ],
        ingredients: [
            'Highly Refined Omega-3 Fish Oil (Anchovy, Sardine, Mackerel)',
            'Natural Fruit Punch Flavor',
            'Monk Fruit Extract (Sweetener)',
            'Sunflower Oil',
            'Natural Mixed Tocopherols',
            'NO Gluten, NO Dairy, NO Artificial Colors'
        ],
        faqs: [
            {
                question: 'What is the dosage for my child?',
                answer: 'Ages 1-3: 1/2 teaspoon daily. Ages 4 and older: 1 teaspoon daily. Can be taken directly or mixed with food/yogurt.',
            },
            {
                question: 'Does it taste fishy?',
                answer: 'No! It has a natural fruit punch flavor sweetened with monk fruit. Most kids love the taste.',
            },
        ],
        reviews: [
            {
                id: 'r1',
                author: 'Sarah M.',
                rating: 5,
                title: 'Kids love it!',
                text: 'Finally an omega-3 my kids will actually take. The fruit punch flavor is a hit.',
                date: '2025-10-12',
            },
            {
                id: 'r2',
                author: 'Dr. P.',
                rating: 5,
                title: 'Great for development',
                text: 'I recommend this for all my pediatric patients. High quality rTG form.',
                date: '2025-09-28',
            }
        ],
        relatedProducts: ['de3-omega'],
        seodata: {
            title: 'Eye Omega Benefits for Kids | PRN Vision',
            description: 'Doctor recommended Omega-3 liquid for children. Great tasting fruit punch flavor with no fishy aftertaste. Supports eye and brain health.',
            url: 'https://prnvision.com/products/prn-kids-omega-3-liquid',
        },
    },
};

// Add reviews and related products to De3 Omega as well
PRN_PRODUCTS.de3_omega.reviews = [
    {
        id: '1',
        author: 'Jennifer K.',
        rating: 5,
        title: 'Life changing for dry eyes',
        text: 'I have suffered from severe dry eye for years. My optometrist recommended this and within 2 months I felt a huge difference. No more grit!',
        date: '2025-11-05',
    },
    {
        id: '2',
        author: 'Michael R.',
        rating: 5,
        title: 'Worth the price',
        text: 'It is more expensive than the drugstore brands, but it actually works. You get what you pay for.',
        date: '2025-10-20',
    },
    {
        id: '3',
        author: 'Karen T.',
        rating: 4,
        title: 'Good product',
        text: 'Easy to swallow softgels. No fishy burps which is a huge plus.',
        date: '2025-09-15',
    }
];
PRN_PRODUCTS.de3_omega.relatedProducts = ['kids-omega'];

export function getPrnProduct(handle: string) {
    // Normalize handle comparison
    const normalizedHandle = handle.toLowerCase();

    // Manual mapping or search
    if (normalizedHandle.includes('de3') || normalizedHandle.includes('omega')) {
        if (normalizedHandle.includes('kids') || normalizedHandle.includes('children')) {
            return PRN_PRODUCTS.kids_omega;
        }
        return PRN_PRODUCTS.de3_omega;
    }

    return null;
}

