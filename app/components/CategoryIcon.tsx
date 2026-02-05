import { clsx } from 'clsx';

type CategoryIconProps = {
  type: 'eye-drops' | 'eyelid' | 'eye-mask' | 'supplements' | 'contact-lens' | 'all-products';
  className?: string;
};

export function CategoryIcon({ type, className }: CategoryIconProps) {
  const baseClasses = 'w-12 h-12';
  
  switch (type) {
    case 'eye-drops':
      return (
        <svg className={clsx(baseClasses, className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L8 6H16L12 2Z" fill="currentColor" className="text-besilos-blue"/>
          <path d="M8 6V18C8 19.1 8.9 20 10 20H14C15.1 20 16 19.1 16 18V6H8Z" fill="currentColor" className="text-besilos-blue/80"/>
          <path d="M10 10H14V12H10V10Z" fill="currentColor" className="text-white"/>
        </svg>
      );
    case 'eyelid':
      return (
        <svg className={clsx(baseClasses, className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="12" cy="12" rx="10" ry="6" fill="currentColor" className="text-besilos-blue"/>
          <path d="M2 12C2 10.5 5.5 8 12 8C18.5 8 22 10.5 22 12" stroke="currentColor" strokeWidth="2" className="text-besilos-navy"/>
          <circle cx="9" cy="11" r="1.5" fill="currentColor" className="text-besilos-navy"/>
          <circle cx="15" cy="11" r="1.5" fill="currentColor" className="text-besilos-navy"/>
        </svg>
      );
    case 'eye-mask':
      return (
        <svg className={clsx(baseClasses, className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4C7 4 3 7 3 11C3 15 7 18 12 18C17 18 21 15 21 11C21 7 17 4 12 4Z" fill="currentColor" className="text-besilos-blue"/>
          <path d="M12 6C8.5 6 6 8 6 11C6 14 8.5 16 12 16C15.5 16 18 14 18 11C18 8 15.5 6 12 6Z" fill="currentColor" className="text-besilos-blue/60"/>
          <circle cx="9" cy="11" r="1" fill="currentColor" className="text-white"/>
          <circle cx="15" cy="11" r="1" fill="currentColor" className="text-white"/>
        </svg>
      );
    case 'supplements':
      return (
        <svg className={clsx(baseClasses, className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="4" width="8" height="16" rx="2" fill="currentColor" className="text-besilos-blue"/>
          <rect x="10" y="6" width="4" height="12" fill="currentColor" className="text-besilos-blue/60"/>
          <circle cx="12" cy="10" r="1" fill="currentColor" className="text-white"/>
          <circle cx="12" cy="14" r="1" fill="currentColor" className="text-white"/>
        </svg>
      );
    case 'contact-lens':
      return (
        <svg className={clsx(baseClasses, className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="8" fill="currentColor" className="text-besilos-blue"/>
          <circle cx="12" cy="12" r="5" fill="currentColor" className="text-besilos-blue/40"/>
          <circle cx="12" cy="12" r="2" fill="currentColor" className="text-besilos-navy"/>
        </svg>
      );
    case 'all-products':
      return (
        <svg className={clsx(baseClasses, className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" className="text-besilos-blue"/>
          <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor" className="text-besilos-blue"/>
          <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor" className="text-besilos-blue"/>
          <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" className="text-besilos-blue"/>
        </svg>
      );
    default:
      return null;
  }
}
