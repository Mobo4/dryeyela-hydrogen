import { Disclosure } from '@headlessui/react';
import { IconCaret } from '~/components/Icon';
import { Heading, Text } from '~/components/Text';
import clsx from 'clsx';

export function ProductAccordions({ details }: any) {
    const sections = [
        { title: "Effective Relief for Eye Dryness", content: details },
        { title: "Clinical Benefits & Pure HOCl", content: "Patented formula for advanced lid hygiene and bacterial control." },
        { title: "Shipping & Satisfaction Guarantee", content: "Free shipping on orders over $150. 100% satisfaction guaranteed." }
    ];

    return (
        <div className="flex flex-col w-full border-t border-gray-100">
            {sections.map((section, idx) => (
                <Disclosure key={idx} as="div" className="border-b border-gray-100">
                    {({ open }) => (
                        <>
                            <Disclosure.Button className="flex items-center justify-between w-full py-6 text-left outline-none">
                                <Heading as="h4" size="copy" className="font-bold text-besilos-navy uppercase tracking-wider text-xs">
                                    {section.title}
                                </Heading>
                                <IconCaret direction={open ? 'up' : 'down'} className="text-besilos-blue" />
                            </Disclosure.Button>
                            <Disclosure.Panel className="pb-8">
                                <div
                                    className="prose prose-sm max-w-none text-besilos-navy/70 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: section.content }}
                                />
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>
            ))}
        </div>
    );
}
