import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link} from '@remix-run/react';
import {HeroSection} from '~/components/sections';

export async function loader({request}: LoaderFunctionArgs) {
  return json({
    seo: {
      title: 'Dry Eye Treatment Guide | DryEyeLA',
      description:
        'A comprehensive guide to treating dry eye disease. Learn about warm compresses, lid hygiene, artificial tears, omega-3 supplements, and prescription options.',
    },
  });
}

export function meta() {
  return [
    {title: 'Dry Eye Treatment Guide | DryEyeLA'},
    {
      name: 'description',
      content:
        'A comprehensive guide to treating dry eye disease. Learn about warm compresses, lid hygiene, artificial tears, omega-3 supplements, and prescription options.',
    },
  ];
}

export default function TreatmentGuidePage() {
  const treatments = [
    {
      title: 'Warm Compresses',
      icon: WarmCompressIcon,
      description:
        'Warm compresses are the foundation of dry eye treatment. Applying gentle heat to the eyelids for 10-15 minutes helps soften hardened meibum in the meibomian glands, allowing natural oils to flow and stabilize the tear film.',
      tips: [
        'Use a microwave-heated eye mask or warm washcloth',
        'Apply for 10-15 minutes, 1-2 times daily',
        'Follow with gentle lid massage to express oils',
        'Consistency is key -- make it part of your daily routine',
      ],
      productLink: '/collections/eye-masks',
      productLabel: 'Shop Eye Masks & Compresses',
    },
    {
      title: 'Lid Hygiene',
      icon: LidHygieneIcon,
      description:
        'Keeping your eyelids clean is essential for managing blepharitis and meibomian gland dysfunction (MGD). Bacteria and debris along the lash line can inflame the eyelids and block oil glands, worsening dry eye symptoms.',
      tips: [
        'Use a gentle, preservative-free eyelid cleanser daily',
        'Hypochlorous acid sprays are highly effective and non-irritating',
        'Clean along the lash line with lid wipes or foam',
        'Avoid rubbing your eyes, which can worsen inflammation',
      ],
      productLink: '/collections/eyelid-cleansers',
      productLabel: 'Shop Eyelid Cleansers',
    },
    {
      title: 'Artificial Tears',
      icon: ArtificialTearsIcon,
      description:
        'Artificial tears supplement your natural tear film by adding moisture and lubrication to the eye surface. For dry eye patients, preservative-free formulations are strongly recommended to avoid further irritation from preservative chemicals like BAK.',
      tips: [
        'Choose preservative-free drops for frequent use',
        'Apply 2-4 times daily or as needed throughout the day',
        'Hyaluronic acid drops provide longer-lasting hydration',
        'Gel drops or ointments at bedtime provide overnight protection',
      ],
      productLink: '/collections/eye-drops-lubricants',
      productLabel: 'Shop Eye Drops',
    },
    {
      title: 'Omega-3 Supplements',
      icon: OmegaIcon,
      description:
        'Omega-3 fatty acids (EPA and DHA) have powerful anti-inflammatory properties that can significantly improve dry eye symptoms from the inside out. Clinical studies show that omega-3 supplementation improves tear quality and reduces ocular surface inflammation.',
      tips: [
        'Look for re-esterified triglyceride (rTG) form for best absorption',
        'Aim for at least 2000mg combined EPA+DHA daily',
        'Results typically appear after 6-8 weeks of consistent use',
        'PRN and EyePromise brands are doctor-recommended',
      ],
      productLink: '/collections/vitamins-supplements',
      productLabel: 'Shop Omega-3 Supplements',
    },
    {
      title: 'Prescription Options',
      icon: PrescriptionIcon,
      description:
        'When over-the-counter treatments are not enough, prescription medications can provide additional relief. Consult with your eye care provider about options like Restasis, Xiidra, or Cequa, which target the underlying inflammation that causes chronic dry eye.',
      tips: [
        'Restasis (cyclosporine) helps increase natural tear production',
        'Xiidra (lifitegrast) blocks inflammation on the eye surface',
        'Prescription eye drops may take several weeks to show full effect',
        'Combine prescription options with OTC products for best results',
      ],
      productLink: '/pages/dry-eye-quiz',
      productLabel: 'Take the Dry Eye Quiz',
    },
  ];

  return (
    <div className="treatment-guide bg-white">
      <HeroSection
        title="Dry Eye Treatment Guide"
        description="Understanding the building blocks of dry eye treatment can help you take control of your symptoms. Below is a comprehensive guide to the most effective approaches."
        breadcrumbs={[
          {label: 'Home', to: '/'},
          {label: 'Learn', to: '/pages/learn'},
          {label: 'Treatment Guide'},
        ]}
        size="large"
        background="cream"
      />

      {/* Introduction */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-besilos-navy mb-6">
            A Step-by-Step Approach
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Dry eye disease is a chronic condition, but with the right combination
            of treatments it can be effectively managed. Most eye care
            professionals recommend a layered approach, starting with the
            fundamentals and building up as needed.
          </p>
        </div>
      </section>

      {/* Treatment Sections */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="space-y-16 md:space-y-24">
            {treatments.map((treatment, index) => (
              <div
                key={treatment.title}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-besilos-sage/10 rounded-2xl flex items-center justify-center text-besilos-sage flex-shrink-0">
                      <treatment.icon />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-besilos-sage tracking-wider">
                        Step {index + 1}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-bold text-besilos-navy">
                        {treatment.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                    {treatment.description}
                  </p>
                  <Link
                    to={treatment.productLink}
                    className="inline-flex items-center gap-2 bg-besilos-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-besilos-navy/90 transition-colors"
                  >
                    {treatment.productLabel}
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
                <div
                  className={`bg-besilos-cream/50 rounded-2xl p-8 ${
                    index % 2 === 1 ? 'lg:order-1' : ''
                  }`}
                >
                  <h4 className="font-bold text-besilos-navy mb-4 text-lg">
                    Tips for Success
                  </h4>
                  <ul className="space-y-3">
                    {treatment.tips.map((tip) => (
                      <li key={tip} className="flex items-start gap-3">
                        <span className="text-besilos-sage mt-1 flex-shrink-0">
                          &#10003;
                        </span>
                        <span className="text-gray-600">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-besilos-navy py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Not Sure Where to Start?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Take our quick dry eye quiz to get personalized product
            recommendations based on your symptoms and severity level.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/pages/dry-eye-quiz"
              className="inline-block bg-white text-besilos-navy px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Take the Dry Eye Quiz
            </Link>
            <Link
              to="/collections/all"
              className="inline-block border-2 border-white/50 text-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Icons for each treatment section
function WarmCompressIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v4" />
      <path d="m6.8 15-3.5 2" />
      <path d="m20.7 17-3.5-2" />
      <path d="M6.8 9 3.3 7" />
      <path d="m20.7 7-3.5 2" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

function LidHygieneIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 22v-2a4 4 0 0 1 .8-2.4" />
      <path d="M12 2a8 8 0 0 1 8 8c0 3.5-2 5.5-4 7l-4 3-4-3c-2-1.5-4-3.5-4-7a8 8 0 0 1 8-8Z" />
    </svg>
  );
}

function ArtificialTearsIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
    </svg>
  );
}

function OmegaIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.5 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v2" />
      <circle cx="18" cy="16" r="4" />
      <path d="m18 14 0 4" />
      <path d="m16 16 4 0" />
    </svg>
  );
}

function PrescriptionIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 12h6" />
      <path d="M12 9v6" />
      <path d="M3 12a9 9 0 1 0 18 0 9 9 0 1 0-18 0" />
    </svg>
  );
}
