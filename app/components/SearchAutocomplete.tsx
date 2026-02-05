import { useState, useEffect, useRef } from 'react';
import { useFetcher, useNavigate } from '@remix-run/react';
import { Link } from '~/components/Link';
import { IconSearch } from '~/components/Icon';

interface SearchResult {
  id: string;
  title: string;
  handle: string;
  image?: {
    url: string;
    altText?: string;
  } | null;
  priceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
}

interface SearchAutocompleteProps {
  className?: string;
  placeholder?: string;
  locale?: string;
}

/**
 * Semantic Search Bar with Visual Autocomplete
 * 
 * Provides real-time search suggestions with product images and prices.
 * Uses Shopify Storefront API for semantic search.
 */
export function SearchAutocomplete({ 
  className = '',
  placeholder = 'Search for eye drops, supplements, brands...',
  locale = 'en'
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchFetcher = useFetcher();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search queries
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      setIsLoading(true);
      searchFetcher.load(`/${locale}/api/search?q=${encodeURIComponent(query)}&limit=5`);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, locale]);

  // Update results when fetcher completes
  useEffect(() => {
    if (searchFetcher.data && typeof searchFetcher.data === 'object' && 'products' in searchFetcher.data) {
      const data = searchFetcher.data as { products?: SearchResult[] };
      if (Array.isArray(data.products)) {
        setResults(data.products);
        setIsOpen(true);
        setIsLoading(false);
      }
    }
  }, [searchFetcher.data]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/${locale}/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  const handleResultClick = (handle: string) => {
    navigate(`/${locale}/products/${handle}`);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              if (results.length > 0) setIsOpen(true);
            }}
            placeholder={placeholder}
            className="w-full px-6 py-4 pr-24 rounded-full border-2 border-slate-200 focus:border-[#356ecb] bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none transition-colors"
            aria-label="Search products"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-[#356ecb] text-white font-medium rounded-full hover:bg-[#2a58a3] transition-colors flex items-center gap-2"
            aria-label="Search"
          >
            <IconSearch className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && (query.length >= 2 || results.length > 0) && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-slate-200 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-6 text-center text-slate-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#356ecb] mx-auto"></div>
              <p className="mt-2 text-sm">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="p-2">
                {results.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleResultClick(product.handle)}
                    className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left group"
                    role="option"
                  >
                    {product.image?.url && (
                      <div className="w-16 h-16 rounded-md flex-shrink-0 overflow-hidden bg-[#F5F5F5] border border-gray-200/50 p-1.5 shadow-sm">
                        <img
                          src={product.image.url}
                          alt={product.image.altText || product.title}
                          className="w-full h-full object-contain image-render-crisp-edges"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-900 group-hover:text-[#356ecb] transition-colors truncate">
                        {product.title}
                      </h3>
                      {product.priceRange && (
                        <p className="text-sm text-slate-600 mt-1">
                          ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)} {product.priceRange.minVariantPrice.currencyCode}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              {query.trim() && (
                <div className="border-t border-slate-200 p-2">
                  <Link
                    to={`/${locale}/search?q=${encodeURIComponent(query.trim())}`}
                    className="block w-full text-center py-2 text-[#356ecb] font-medium hover:bg-slate-50 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    View all results for "{query}"
                  </Link>
                </div>
              )}
            </>
          ) : query.length >= 2 ? (
            <div className="p-6 text-center text-slate-500">
              <p className="text-sm">No products found for "{query}"</p>
              <Link
                to={`/${locale}/search?q=${encodeURIComponent(query.trim())}`}
                className="mt-2 inline-block text-[#356ecb] font-medium hover:underline"
                onClick={() => setIsOpen(false)}
              >
                Search anyway
              </Link>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
