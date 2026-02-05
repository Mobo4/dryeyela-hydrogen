import {forwardRef} from 'react';
import {Link} from '@remix-run/react';
import clsx from 'clsx';

import {missingClass} from '~/lib/utils';

export const Button = forwardRef(
  (
    {
      as = 'button',
      className = '',
      variant = 'primary',
      width = 'auto',
      ...props
    }: {
      as?: React.ElementType;
      className?: string;
      variant?: 'primary' | 'secondary' | 'inline';
      width?: 'auto' | 'full';
      [key: string]: any;
    },
    ref,
  ) => {
    const Component = props?.to ? Link : as;

    const baseButtonClasses =
      'inline-block rounded-full font-medium text-center py-3 px-6 transition-all duration-300';

    const variants = {
      primary: `${baseButtonClasses} bg-besilos-sage text-white hover:bg-besilos-sage/90 shadow-sm`,
      secondary: `${baseButtonClasses} border border-besilos-navy/20 bg-transparent text-besilos-navy hover:bg-besilos-navy/5`,
      inline:
        'border-b border-besilos-sage text-besilos-sage hover:text-besilos-sage/80 pb-0.5 leading-none rounded-none px-0 py-0',
    };

    const widths = {
      auto: 'w-auto',
      full: 'w-full',
    };

    const styles = clsx(
      missingClass(className, 'bg-') && variants[variant],
      missingClass(className, 'w-') && widths[width],
      className,
    );

    return (
      <Component
        // @todo: not supported until react-router makes it into Remix.
        // preventScrollReset={true}
        className={styles}
        {...props}
        ref={ref}
      />
    );
  },
);
