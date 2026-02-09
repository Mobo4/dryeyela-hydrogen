import {Link} from '@remix-run/react';

export function GenericError({
  error,
}: {
  error?: {message: string; stack?: string};
}) {
  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  return (
    <div className="bg-white min-h-[60vh]">
      {/* Compact header bar */}
      <div className="bg-gradient-to-r from-besilos-navy to-besilos-navy/90 py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <nav className="text-sm text-white/70 mb-2">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white/50">Error</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            This page couldn't be loaded
          </h1>
        </div>
      </div>

      {/* Friendly error content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="text-center mb-10">
          <p className="text-gray-600 text-lg mb-6 max-w-xl mx-auto">
            We're sorry about that. Please try browsing our collections or head back to the homepage.
          </p>
          <Link
            to="/"
            className="inline-block bg-besilos-navy text-white px-8 py-3 font-semibold rounded-lg hover:bg-besilos-navy/90 transition-all shadow-md"
          >
            Go back to homepage
          </Link>
        </div>

        {/* Helpful collection links */}
        <div className="border-t border-gray-200 pt-10">
          <h2 className="text-lg font-bold text-besilos-navy mb-6 text-center">
            Browse Our Collections
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              {label: 'Eye Drops & Lubricants', to: '/collections/eye-drops-lubricants'},
              {label: 'Vitamins & Supplements', to: '/collections/vitamins-supplements'},
              {label: 'Eye Masks & Compresses', to: '/collections/eye-masks'},
              {label: 'Eyelid Cleansers', to: '/collections/eyelid-cleansers'},
              {label: 'Eyelid Sprays', to: '/collections/eyelid-sprays'},
              {label: 'All Products', to: '/collections/all'},
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block p-4 bg-gray-50 hover:bg-besilos-navy/5 border border-gray-200 rounded-lg text-center text-sm font-medium text-besilos-navy hover:border-besilos-navy/30 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Inline trust note */}
        <div className="mt-10 text-center text-sm text-gray-500">
          <p>Doctor-recommended dry eye products -- 20+ years of experience -- Free shipping over $50</p>
        </div>
      </div>
    </div>
  );
}
