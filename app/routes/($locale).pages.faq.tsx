import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData } from '@remix-run/react';
import { Disclosure, Transition } from '@headlessui/react';
import { PageLayout } from '~/components/PageLayout';
import { IconCaret } from '~/components/Icon';

export async function loader({ context }: LoaderFunctionArgs) {
    return json({
        seo: {
            title: 'Frequently Asked Questions | DryEyeLA',
            description: 'Find answers to common questions about shipping, returns, and our dry eye products.',
        },
    });
}

const FAQS = [
    {
        category: 'Ordering & Shipping',
        items: [
            {
                question: 'How much does shipping cost?',
                answer: 'We offer FREE standard shipping on all orders over $100 within the contiguous United States. For orders under $100, a flat shipping rate is calculated at checkout based on your location. We also offer expedited shipping options if you need your products sooner.',
            },
            {
                question: 'When will my order ship?',
                answer: 'Orders placed before 2 PM PST on business days typically ship the same day. Orders placed after 2 PM PST or on weekends/holidays will ship the following business day. You will receive a tracking number via email as soon as your package leaves our facility.',
            },
            {
                question: 'Do you ship internationally?',
                answer: 'Currently, we primarily ship within the United States. We are working on expanding our shipping capabilities to support international customers in the near future. Please check back with us or sign up for our newsletter for updates.',
            },
        ],
    },
    {
        category: 'Products & Safety',
        items: [
            {
                question: 'Are your products authentic?',
                answer: 'Yes, 100%. DryEyeLA is an authorized retailer for every brand we carry, including PRN, Optase, Avenova, and others. All products are sourced directly from the manufacturers to ensure safety, efficacy, and proper expiration dating.',
            },
            {
                question: 'Are your eye drops preservative-free?',
                answer: 'Most of our premium eye drops are preservative-free to prevent irritation for sensitive eyes. Please check the specific product description or packaging details to confirm. We prioritize products that are safe for long-term use.',
            },
            {
                question: 'Can I use FSA/HSA cards?',
                answer: 'Yes! Most dry eye products, including eye drops, eyelid cleansers, and warm compresses, are FSA/HSA eligible. You can use your FSA/HSA card at checkout just like a regular credit card.',
            },
        ],
    },
    {
        category: 'Returns & Refunds',
        items: [
            {
                question: 'What is your return policy?',
                answer: 'We stand by the quality of our products. If you are not satisfied with your purchase, you may return unopened and unused items within 30 days of delivery for a refund. Please visit our Shipping & Returns page for detailed instructions.',
            },
            {
                question: 'How do I start a return?',
                answer: 'To initiate a return, please contact our customer support team at support@dryeyela.com with your order number. We will provide you with a return authorization and instructions on where to send your package.',
            },
        ],
    },
];

export default function FaqPage() {
    const { seo } = useLoaderData<typeof loader>();

    return (
        <PageLayout>
            <div className="bg-besilos-cream/30 min-h-screen">
                {/* Hero Section */}
                <div className="relative isolate overflow-hidden bg-besilos-navy py-16 sm:py-24 lg:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center relative z-10">
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
                            Frequently Asked Questions
                        </h1>
                        <p className="mt-4 text-lg leading-8 text-besilos-cream/80 max-w-2xl mx-auto">
                            Find quick answers to common questions about our products, shipping specific policies, and how we can help you find relief.
                        </p>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 -translate-x-[20%] -translate-y-[20%] w-[500px] h-[500px] bg-besilos-sage/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 translate-x-[20%] translate-y-[20%] w-[500px] h-[500px] bg-besilos-sage/10 rounded-full blur-3xl" />
                </div>

                {/* FAQ Content */}
                <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24 lg:px-8">
                    <div className="space-y-16">
                        {FAQS.map((section) => (
                            <div key={section.category} className="bg-white rounded-3xl p-8 shadow-sm ring-1 ring-gray-900/5">
                                <h2 className="text-2xl font-bold tracking-tight text-besilos-navy mb-8 border-b border-gray-100 pb-4">
                                    {section.category}
                                </h2>
                                <dl className="space-y-4">
                                    {section.items.map((faq) => (
                                        <Disclosure key={faq.question} as="div" className="pt-2">
                                            {({ open }) => (
                                                <>
                                                    <dt>
                                                        <Disclosure.Button className="flex w-full items-start justify-between text-left text-besilos-navy">
                                                            <span className="text-base font-semibold leading-7">{faq.question}</span>
                                                            <span className="ml-6 flex h-7 items-center">
                                                                <div className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
                                                                    <IconCaret direction="down" />
                                                                </div>
                                                            </span>
                                                        </Disclosure.Button>
                                                    </dt>
                                                    <Transition
                                                        enter="transition duration-100 ease-out"
                                                        enterFrom="transform scale-95 opacity-0"
                                                        enterTo="transform scale-100 opacity-100"
                                                        leave="transition duration-75 ease-out"
                                                        leaveFrom="transform scale-100 opacity-100"
                                                        leaveTo="transform scale-95 opacity-0"
                                                    >
                                                        <Disclosure.Panel as="dd" className="mt-2 pr-12">
                                                            <p className="text-base leading-7 text-gray-600">{faq.answer}</p>
                                                        </Disclosure.Panel>
                                                    </Transition>
                                                </>
                                            )}
                                        </Disclosure>
                                    ))}
                                </dl>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <h3 className="text-xl font-semibold text-besilos-navy mb-4">Still have questions?</h3>
                        <p className="text-gray-600 mb-8">Can't find the answer you're looking for? Please chat to our friendly team.</p>
                        <a href="/pages/contact" className="inline-block rounded-md bg-besilos-sage px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-besilos-sage/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-besilos-sage">
                            Get in touch
                        </a>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
