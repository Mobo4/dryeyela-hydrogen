import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useActionData, Form, useNavigation } from '@remix-run/react';
import { Heading, Text } from '~/components/Text';
import { Input } from '~/components/Input';
import { Button } from '~/components/Button';
import { HeroSection } from '~/components/sections';

export async function loader({ request }: LoaderFunctionArgs) {
    return json({});
}

export async function action({ request }: ActionFunctionArgs) {
    // This is where you would integrate with a 3rd party email service (SendGrid, Mailgun)
    // or a CRM (Gorgias, Zendesk).
    // For now, we simulate a successful submission.
    const formData = await request.formData();
    // const email = formData.get('email');
    // const message = formData.get('message');

    return json({ success: true, message: 'Thank you for contacting us. We will get back to you shortly.' });
}

export default function ContactPage() {
    const actionData = useActionData<typeof action>();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';

    return (
        <div className="contact-page bg-white">
            {/* 1. Hero Section */}
            <HeroSection
                title="Contact Us"
                breadcrumbs={[
                    { label: 'Home', to: '/' },
                    { label: 'Contact Us' },
                ]}
                size="small"
                background="navy"
            />

            <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-16 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Contact Information */}
                    <div>
                        <span className="text-besilos-blue font-bold uppercase tracking-widest text-xs mb-3 block">Get in Touch</span>
                        <Heading as="h2" size="display" className="text-besilos-navy mb-6">We're Here to Help</Heading>
                        <Text className="text-xl text-besilos-navy/80 mb-10 leading-relaxed max-w-md">
                            Have questions about dry eye relief? Our team of specialists is ready to assist you in finding the perfect regimen.
                        </Text>

                        <div className="space-y-8">
                            <ContactMethod
                                icon={<IconEmail />}
                                title="Email Us"
                                content="support@dryeyela.com"
                                link="mailto:support@dryeyela.com"
                            />
                            <ContactMethod
                                icon={<IconPhone />}
                                title="Call Us"
                                content="(800) 555-0199" // Placeholder
                                link="tel:+18005550199"
                                note="Mon-Fri, 9am - 5pm PST"
                            />
                            <ContactMethod
                                icon={<IconLocation />}
                                title="Visit Us"
                                content="Los Angeles, CA"
                                note="By Appointment Only"
                            />
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-gray-50 p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
                        {actionData?.success ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-10">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <Heading as="h3" size="lead" className="mb-2 text-besilos-navy">Message Sent!</Heading>
                                <Text>Thank you for reaching out. We'll be in touch shortly.</Text>
                                <Button to="/" variant="secondary" className="mt-8">Return Home</Button>
                            </div>
                        ) : (
                            <>
                                <Heading as="h3" size="lead" className="mb-6 text-besilos-navy">Send a Message</Heading>
                                <Form method="post" className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            type="text"
                                            name="firstName"
                                            placeholder="First Name"
                                            required
                                            className="bg-white"
                                        />
                                        <Input
                                            type="text"
                                            name="lastName"
                                            placeholder="Last Name"
                                            required
                                            className="bg-white"
                                        />
                                    </div>
                                    <Input
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        required
                                        className="bg-white"
                                    />
                                    <Input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone Number (Optional)"
                                        className="bg-white"
                                    />
                                    <div>
                                        <label htmlFor="message" className="sr-only">Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={4}
                                            placeholder="How can we help you?"
                                            required
                                            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:border-besilos-blue focus:ring-1 focus:ring-besilos-blue outline-none transition-all placeholder:text-gray-400 text-besilos-navy"
                                        ></textarea>
                                    </div>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        width="full"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                    </Button>
                                </Form>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

function ContactMethod({ icon, title, content, link, note }: { icon: React.ReactNode, title: string, content: string, link?: string, note?: string }) {
    return (
        <div className="flex gap-5 items-start">
            <div className="w-12 h-12 bg-besilos-navy/5 text-besilos-navy rounded-xl flex items-center justify-center flex-shrink-0">
                {icon}
            </div>
            <div>
                <h4 className="font-heading font-bold text-besilos-navy text-sm uppercase tracking-wider mb-1">{title}</h4>
                {link ? (
                    <a href={link} className="text-xl font-medium text-besilos-blue hover:text-besilos-navy transition-colors block">
                        {content}
                    </a>
                ) : (
                    <p className="text-xl font-medium text-besilos-navy/90 block">
                        {content}
                    </p>
                )}
                {note && <p className="text-sm text-gray-500 mt-1">{note}</p>}
            </div>
        </div>
    );
}

function IconEmail() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
    );
}

function IconPhone() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
    );
}

function IconLocation() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
        </svg>
    );
}
