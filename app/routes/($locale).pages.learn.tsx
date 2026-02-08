import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link} from '@remix-run/react';
import {HeroSection} from '~/components/sections';

export async function loader({request}: LoaderFunctionArgs) {
  return json({
    seo: {
      title: 'Learn | DryEyeLA',
      description:
        'Educational resources and guides for dry eye treatment.',
    },
  });
}

export function meta() {
  return [
    {title: 'Learn | DryEyeLA'},
    {
      name: 'description',
      content: 'Educational resources and guides for dry eye treatment.',
    },
  ];
}

export default function LearnPage() {
  return (
    <>
      <HeroSection
        title="Learn"
        breadcrumbs={[
          {label: 'Home', to: '/'},
          {label: 'Learn'},
        ]}
        size="small"
        background="cream"
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Dry Eye Quiz */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-blue-200 transition-all group">
              <h3 className="text-2xl font-bold text-[#152c52] mb-4">
                Dry Eye Quiz
              </h3>
              <p className="text-slate-600 mb-6">
                Take our free assessment to discover your dry eye severity and
                get personalized product recommendations.
              </p>
              <Link
                to="/pages/dry-eye-quiz"
                className="text-blue-600 font-bold group-hover:underline"
              >
                Take the Quiz &rarr;
              </Link>
            </div>

            {/* Treatment Guide */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-blue-200 transition-all group">
              <h3 className="text-2xl font-bold text-[#152c52] mb-4">
                Treatment Guide
              </h3>
              <p className="text-slate-600 mb-6">
                A comprehensive guide to understanding and treating different
                types of dry eye.
              </p>
              <Link
                to="/pages/treatment-guide"
                className="text-blue-600 font-bold group-hover:underline"
              >
                View Guide &rarr;
              </Link>
            </div>

            {/* FAQ */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-blue-200 transition-all group">
              <h3 className="text-2xl font-bold text-[#152c52] mb-4">FAQ</h3>
              <p className="text-slate-600 mb-6">
                Common questions about products, shipping, and dry eye care.
              </p>
              <Link
                to="/pages/faq"
                className="text-blue-600 font-bold group-hover:underline"
              >
                View FAQ &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
