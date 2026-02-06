import { useState, useRef, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import type { ProductCardFragment } from 'storefrontapi.generated';

const mockProducts = {
  nodes: new Array(12).fill(''),
};

type ProductsData = {
  products: {
    nodes: ProductCardFragment[];
  };
};

type ProductCarouselProps = ProductsData & {
  title?: string;
  count?: number;
  className?: string;
};

export function ProductCarousel({
  title = 'Featured Products',
  products = mockProducts,
  count = 12,
  className = '',
}: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(320); // Default mobile width
  const [visibleCards, setVisibleCards] = useState(1);

  const productNodes = products.nodes.slice(0, count);

  // Calculate responsive card width and visible cards
  useEffect(() => {
    const updateDimensions = () => {
      const container = scrollContainerRef.current?.parentElement;
      if (!container) return;

      const containerWidth = container.clientWidth;
      const padding = 64; // Total horizontal padding (32px each side)
      const gap = 24; // Gap between cards
      const availableWidth = containerWidth - padding;

      // Responsive breakpoints
      let cardsToShow = 1;
      let cardW = 280;

      if (availableWidth >= 1536) {
        // 2xl: 4 cards
        cardsToShow = 4;
        cardW = (availableWidth - gap * 3) / 4;
      } else if (availableWidth >= 1280) {
        // xl: 3-4 cards
        cardsToShow = 4;
        cardW = (availableWidth - gap * 3) / 4;
      } else if (availableWidth >= 1024) {
        // lg: 3 cards
        cardsToShow = 3;
        cardW = (availableWidth - gap * 2) / 3;
      } else if (availableWidth >= 768) {
        // md: 2 cards
        cardsToShow = 2;
        cardW = (availableWidth - gap) / 2;
      } else {
        // sm: 1 card with some margin
        cardsToShow = 1;
        cardW = Math.min(availableWidth - 32, 320);
      }

      // Ensure minimum card width
      cardW = Math.max(cardW, 260);
      setCardWidth(cardW);
      setVisibleCards(cardsToShow);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Initial scroll position check
  useEffect(() => {
    const checkScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    };

    // Initial check after a brief delay to ensure DOM is ready
    const timer = setTimeout(checkScroll, 100);
    return () => clearTimeout(timer);
  }, [productNodes.length, cardWidth]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = cardWidth + 24; // card width + gap
    const newScrollLeft =
      direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });
  };

  const scrollToIndex = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = (cardWidth + 24) * index;
    container.scrollTo({
      left: scrollAmount,
      behavior: 'smooth',
    });
    setCurrentIndex(index);
  };

  if (!productNodes || productNodes.length === 0) {
    return null;
  }

  return (
    <section className={`py-12 md:py-16 lg:py-20 bg-white ${className}`}>
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Title Section with proper spacing */}
        {title && (
          <div className="mb-8 md:mb-12 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-besilos-navy mb-2">
              {title}
            </h2>
          </div>
        )}

        {/* Carousel Container */}
        <div className="relative">
          {/* Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg rounded-full p-3 md:p-4 hover:bg-gray-50 transition-all border border-gray-200 hidden md:flex items-center justify-center"
              aria-label="Scroll left"
            >
              <svg
                className="w-6 h-6 text-besilos-navy"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
            onScroll={(e) => {
              const container = e.currentTarget;
              const { scrollLeft, scrollWidth, clientWidth } = container;
              setCanScrollLeft(scrollLeft > 10);
              setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
              // Update current index based on scroll position
              const newIndex = Math.round(scrollLeft / (cardWidth + 24));
              setCurrentIndex(newIndex);
            }}
          >
            <div
              className="flex gap-6"
              style={{
                paddingLeft: '0',
                paddingRight: '0',
                minWidth: 'max-content',
              }}
            >
              {productNodes.map((product, index) => (
                <div
                  key={product.id || index}
                  className="flex-shrink-0 snap-start"
                  style={{ width: `${cardWidth}px` }}
                >
                  <ProductCard
                    product={product}
                    quickAdd={true}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg rounded-full p-3 md:p-4 hover:bg-gray-50 transition-all border border-gray-200 hidden md:flex items-center justify-center"
              aria-label="Scroll right"
            >
              <svg
                className="w-6 h-6 text-besilos-navy"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}

          {/* Pagination Dots (for mobile) */}
          {productNodes.length > visibleCards && (
            <div className="flex justify-center gap-2 mt-8 md:hidden">
              {Array.from({
                length: Math.ceil(productNodes.length / visibleCards),
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    Math.floor(currentIndex / visibleCards) === index
                      ? 'bg-besilos-navy w-8'
                      : 'bg-gray-300'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

    </section>
  );
}
