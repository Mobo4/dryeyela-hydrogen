import {Form} from '@remix-run/react';
import {Heading, Text, Section} from '~/components/Text';
import {Input} from '~/components/Input';
import {Button} from '~/components/Button';

export function DryEyeGuide() {
  return (
    <Section
      display="flex"
      className="bg-besilos-sage text-white py-16 md:py-24 relative overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-besilos-primary/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div className="w-full max-w-4xl mx-auto text-center relative z-10 space-y-8 px-4">
        <div className="space-y-4">
          <Text className="text-besilos-primary font-bold tracking-wider uppercase text-sm">
            Free Educational Resource
          </Text>
          <Heading as="h2" size="display" className="text-white">
            The Ultimate Shield Against Dry Eye
          </Heading>
          <Text size="lead" className="max-w-2xl mx-auto text-white/90">
            Get our comprehensive guide to understanding and managing dry eye
            syndrome. Learn about the latest treatments, daily habits, and
            products that actually work.
          </Text>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-2 rounded-2xl max-w-lg mx-auto border border-white/20">
          <Form
            method="post"
            action="/newsletter-subscribe"
            className="flex flex-col sm:flex-row gap-2"
          >
            <Input
              type="email"
              name="email"
              placeholder="Enter your email address"
              variant="minisearch"
              className="flex-grow bg-white/90 text-besilos-navy placeholder:text-besilos-navy/50 border-0 focus:ring-2 focus:ring-besilos-primary"
              required
            />
            <Button
              type="submit"
              className="bg-besilos-primary text-white hover:bg-besilos-primary/90 font-bold px-8 py-3 rounded-xl shadow-lg transition-transform hover:scale-105"
            >
              Get the Guide
            </Button>
          </Form>
          <Text size="fine" className="mt-3 text-white/60">
            We prefer to keep your email safe. No spam, ever. Unsubscribe
            anytime.
          </Text>
        </div>
      </div>
    </Section>
  );
}
