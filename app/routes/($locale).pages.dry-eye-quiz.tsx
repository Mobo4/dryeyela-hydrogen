import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link} from '@remix-run/react';
import {useState} from 'react';
import {HeroSection} from '~/components/sections';

export async function loader({request}: LoaderFunctionArgs) {
  return json({
    seo: {
      title: 'Dry Eye Quiz | DryEyeLA',
      description:
        'Take our free dry eye assessment quiz to discover the severity of your symptoms and get personalized product recommendations.',
    },
  });
}

export function meta() {
  return [
    {title: 'Dry Eye Quiz - Free Assessment | DryEyeLA'},
    {
      name: 'description',
      content:
        'Take our free dry eye assessment quiz to discover the severity of your symptoms and get personalized product recommendations.',
    },
  ];
}

interface Question {
  id: string;
  title: string;
  options: Array<{value: string; label: string; points: number}>;
}

const QUESTIONS: Question[] = [
  {
    id: 'frequency',
    title: 'How often do your eyes feel dry or irritated?',
    options: [
      {value: 'rarely', label: 'Rarely (less than once a week)', points: 1},
      {value: 'sometimes', label: 'Sometimes (1-3 times per week)', points: 2},
      {value: 'often', label: 'Often (4-6 times per week)', points: 3},
      {value: 'daily', label: 'Every day', points: 4},
      {value: 'constant', label: 'All day, every day', points: 5},
    ],
  },
  {
    id: 'severity',
    title: 'How would you rate your overall discomfort level?',
    options: [
      {value: 'mild', label: 'Mild -- slight awareness (1-2 out of 10)', points: 1},
      {value: 'moderate', label: 'Moderate -- noticeable discomfort (3-5 out of 10)', points: 2},
      {value: 'significant', label: 'Significant -- hard to ignore (6-7 out of 10)', points: 3},
      {value: 'severe', label: 'Severe -- affects daily activities (8-9 out of 10)', points: 4},
      {value: 'extreme', label: 'Extreme -- nearly unbearable (10 out of 10)', points: 5},
    ],
  },
  {
    id: 'symptoms',
    title: 'Which symptoms do you experience most? (Select the best match)',
    options: [
      {value: 'burning', label: 'Burning or stinging sensation', points: 2},
      {value: 'gritty', label: 'Gritty, sandy feeling', points: 2},
      {value: 'watery', label: 'Excessive tearing / watery eyes', points: 1},
      {value: 'blurry', label: 'Blurry vision that clears after blinking', points: 3},
      {value: 'light', label: 'Light sensitivity', points: 3},
      {value: 'fatigue', label: 'Eye fatigue and tiredness', points: 2},
    ],
  },
  {
    id: 'triggers',
    title: 'What triggers or worsens your symptoms?',
    options: [
      {value: 'screens', label: 'Screen time (computer, phone, TV)', points: 1},
      {value: 'climate', label: 'Air conditioning, heating, or dry climate', points: 2},
      {value: 'wind', label: 'Wind or outdoor environments', points: 2},
      {value: 'morning', label: 'Mornings -- I wake up with dry eyes', points: 3},
      {value: 'contacts', label: 'Contact lens wear', points: 3},
      {value: 'everything', label: 'Nearly everything aggravates them', points: 4},
    ],
  },
  {
    id: 'impact',
    title: 'How much does dry eye affect your daily life?',
    options: [
      {value: 'minimal', label: 'Minimal impact -- I barely notice it', points: 1},
      {value: 'some', label: 'Some difficulty with work or hobbies', points: 2},
      {value: 'moderate', label: 'Moderate -- I avoid certain activities', points: 3},
      {value: 'significant', label: 'Significant -- affects my job and quality of life', points: 4},
      {value: 'severe', label: 'Severe -- I feel limited every single day', points: 5},
    ],
  },
  {
    id: 'treatments',
    title: 'What have you tried so far?',
    options: [
      {value: 'nothing', label: 'Nothing yet', points: 1},
      {value: 'otc-drops', label: 'Over-the-counter eye drops', points: 2},
      {value: 'warm-compress', label: 'Warm compresses', points: 2},
      {value: 'supplements', label: 'Omega-3 supplements', points: 3},
      {value: 'prescription', label: 'Prescription eye drops (Restasis, Xiidra, etc.)', points: 4},
      {value: 'multiple', label: 'Multiple treatments with limited relief', points: 5},
    ],
  },
];

type Severity = 'mild' | 'moderate' | 'severe';

interface ResultData {
  severity: Severity;
  title: string;
  description: string;
  recommendations: string[];
  collections: Array<{label: string; to: string}>;
  bgClass: string;
  borderClass: string;
  textClass: string;
}

function getResults(score: number): ResultData {
  if (score <= 10) {
    return {
      severity: 'mild',
      title: 'Mild Dry Eye',
      description:
        'Your symptoms suggest mild dry eye. With the right daily routine and preventive care, you can keep symptoms at bay and protect your eyes long-term.',
      recommendations: [
        'Start with preservative-free artificial tears as needed throughout the day',
        'Use a warm compress for 10 minutes once daily to support healthy oil glands',
        'Consider an omega-3 supplement to improve tear quality from within',
        'Follow the 20-20-20 rule: every 20 minutes, look 20 feet away for 20 seconds',
      ],
      collections: [
        {label: 'Eye Drops', to: '/collections/eye-drops-lubricants'},
        {label: 'Eye Masks', to: '/collections/eye-masks'},
      ],
      bgClass: 'bg-green-50',
      borderClass: 'border-green-200',
      textClass: 'text-green-800',
    };
  } else if (score <= 18) {
    return {
      severity: 'moderate',
      title: 'Moderate Dry Eye',
      description:
        'Your symptoms suggest moderate dry eye disease. A consistent multi-step approach combining several treatments will provide the best relief.',
      recommendations: [
        'Use preservative-free artificial tears 3-4 times daily',
        'Add an eyelid cleanser to your morning and evening routine',
        'Apply warm compresses daily to improve meibomian gland function',
        'Start a high-quality omega-3 supplement (at least 2000mg EPA+DHA)',
        'Consider gel drops or ointment before bed for overnight protection',
      ],
      collections: [
        {label: 'Eye Drops', to: '/collections/eye-drops-lubricants'},
        {label: 'Eyelid Cleansers', to: '/collections/eyelid-cleansers'},
        {label: 'Supplements', to: '/collections/vitamins-supplements'},
        {label: 'Eye Masks', to: '/collections/eye-masks'},
      ],
      bgClass: 'bg-yellow-50',
      borderClass: 'border-yellow-200',
      textClass: 'text-yellow-800',
    };
  } else {
    return {
      severity: 'severe',
      title: 'Severe Dry Eye',
      description:
        'Your symptoms suggest severe dry eye disease that is significantly impacting your quality of life. A comprehensive, aggressive treatment approach is recommended.',
      recommendations: [
        'Use preservative-free drops frequently (every 1-2 hours if needed)',
        'Implement a full eyelid hygiene regimen: cleanser + warm compress twice daily',
        'Start a premium omega-3 supplement for anti-inflammatory benefits',
        'Apply gel drops or ointment at bedtime for overnight recovery',
        'Consider consulting with a dry eye specialist about prescription options',
        'Explore eyelid sprays with hypochlorous acid for additional antimicrobial support',
      ],
      collections: [
        {label: 'Eye Drops', to: '/collections/eye-drops-lubricants'},
        {label: 'Eyelid Cleansers', to: '/collections/eyelid-cleansers'},
        {label: 'Eyelid Sprays', to: '/collections/eyelid-sprays'},
        {label: 'Supplements', to: '/collections/vitamins-supplements'},
        {label: 'Eye Masks', to: '/collections/eye-masks'},
      ],
      bgClass: 'bg-red-50',
      borderClass: 'border-red-200',
      textClass: 'text-red-800',
    };
  }
}

export default function DryEyeQuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, {value: string; points: number}>>({});
  const [showResults, setShowResults] = useState(false);

  const totalScore = Object.values(answers).reduce((sum, a) => sum + a.points, 0);
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;
  const currentQuestion = QUESTIONS[currentStep];
  const isAnswered = currentQuestion && answers[currentQuestion.id] !== undefined;

  function handleSelect(questionId: string, value: string, points: number) {
    setAnswers((prev) => ({...prev, [questionId]: {value, points}}));
  }

  function goNext() {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  }

  function goPrev() {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }

  function restart() {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
  }

  if (showResults) {
    const result = getResults(totalScore);
    return (
      <div className="dry-eye-quiz bg-white">
        <HeroSection
          title="Your Results"
          breadcrumbs={[
            {label: 'Home', to: '/'},
            {label: 'Dry Eye Quiz'},
          ]}
          size="small"
          background="cream"
        />

        <section className="py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-6">
            {/* Score Summary */}
            <div
              className={`${result.bgClass} ${result.borderClass} border-2 rounded-2xl p-8 mb-10 text-center`}
            >
              <h2 className={`text-3xl font-bold ${result.textClass} mb-2`}>
                {result.title}
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Score: {totalScore} out of {QUESTIONS.length * 5}
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                {result.description}
              </p>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-10">
              <h3 className="text-2xl font-bold text-besilos-navy mb-6">
                Our Recommendations
              </h3>
              <ul className="space-y-4">
                {result.recommendations.map((rec) => (
                  <li key={rec} className="flex items-start gap-3">
                    <span className="text-besilos-sage font-bold mt-0.5 flex-shrink-0">
                      &#10003;
                    </span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Product Collections */}
            <div className="bg-besilos-cream/50 rounded-2xl p-8 mb-10">
              <h3 className="text-2xl font-bold text-besilos-navy mb-6">
                Recommended Products
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {result.collections.map((col) => (
                  <Link
                    key={col.to}
                    to={col.to}
                    className="bg-white rounded-xl p-4 text-center border border-gray-200 hover:border-besilos-sage hover:shadow-md transition-all group"
                  >
                    <span className="text-besilos-navy font-semibold group-hover:text-besilos-sage transition-colors">
                      {col.label}
                    </span>
                    <span className="block text-sm text-gray-400 mt-1">
                      Shop now &rarr;
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={restart}
                className="px-6 py-3 border-2 border-besilos-navy text-besilos-navy rounded-lg font-semibold hover:bg-besilos-navy hover:text-white transition-colors"
              >
                Retake Quiz
              </button>
              <Link
                to="/pages/treatment-guide"
                className="px-6 py-3 bg-besilos-navy text-white rounded-lg font-semibold hover:bg-besilos-navy/90 transition-colors text-center"
              >
                View Treatment Guide
              </Link>
              <Link
                to="/collections/all"
                className="px-6 py-3 bg-besilos-sage text-white rounded-lg font-semibold hover:bg-besilos-sage/90 transition-colors text-center"
              >
                Browse All Products
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="dry-eye-quiz bg-white">
      <HeroSection
        title="Dry Eye Assessment Quiz"
        description="Answer 6 quick questions to understand your dry eye severity and get personalized product recommendations."
        breadcrumbs={[
          {label: 'Home', to: '/'},
          {label: 'Dry Eye Quiz'},
        ]}
        size="small"
        background="cream"
      />

      <section className="py-12 md:py-16">
        <div className="max-w-2xl mx-auto px-6">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>
                Question {currentStep + 1} of {QUESTIONS.length}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-besilos-sage h-2.5 rounded-full transition-all duration-300"
                style={{width: `${progress}%`}}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-besilos-navy mb-6">
              {currentQuestion.title}
            </h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = answers[currentQuestion.id]?.value === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      handleSelect(currentQuestion.id, option.value, option.points)
                    }
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-besilos-sage bg-besilos-sage/5 text-besilos-navy'
                        : 'border-gray-200 hover:border-besilos-sage/50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? 'border-besilos-sage bg-besilos-sage'
                            : 'border-gray-300'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="font-medium">{option.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={goPrev}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                currentStep === 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-besilos-navy border-2 border-besilos-navy hover:bg-besilos-navy hover:text-white'
              }`}
            >
              Previous
            </button>
            <button
              onClick={goNext}
              disabled={!isAnswered}
              className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                isAnswered
                  ? 'bg-besilos-sage text-white hover:bg-besilos-sage/90'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {currentStep === QUESTIONS.length - 1
                ? 'See My Results'
                : 'Next'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
