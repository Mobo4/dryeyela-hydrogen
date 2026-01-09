import formsPlugin from '@tailwindcss/forms';
import typographyPlugin from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Hydrogen defaults (using CSS variables)
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        contrast: 'rgb(var(--color-contrast) / <alpha-value>)',
        notice: 'rgb(var(--color-accent) / <alpha-value>)',
        shopPay: 'rgb(var(--color-shop-pay) / <alpha-value>)',
        'besilos-primary': '#56BACD', // RESCUE: Teal Class
        'besilos-cream': '#F9F8F6',
        'prn-blue': '#152C52',
        'prn-gold': '#FACE52',
        'prn-gray': '#F4F4F4',

        // Besilos-inspired "Premium Soft" palette
        besilos: {
          cream: '#FFFFFF',   // Canvas
          navy: '#2A2B2A',    // RESCUE: Charcoal Background
          sage: '#574171',    // RESCUE: Purple Headings
          clay: '#56BACD',    // RESCUE: Teal Accents/Buttons
          frame: '#EEECE1',   // RESCUE: Warm Gray Backgrounds
          white: '#FFFFFF'
        },

        // Semantic colors (using Besilos palette)
        background: '#FFFFFF',      // White Canvas
        foreground: '#2A2B2A',      // Charcoal Text
        accent: '#56BACD',          // Teal Accent

        // Legacy colors - backward compatibility
        'eyecare-blue': '#1E3A5F',
        'eyecare-dark-blue': '#152A45',
        'eyecare-light-blue': '#4A90A4',
        'eyecare-lighter-blue': '#E8F4F8',
        'eyecare-gold': '#C4A35A',
      },
      screens: {
        sm: '32em',
        md: '48em',
        lg: '64em',
        xl: '80em',
        '2xl': '96em',
        'sm-max': { max: '48em' },
        'sm-only': { min: '32em', max: '48em' },
        'md-only': { min: '48em', max: '64em' },
        'lg-only': { min: '64em', max: '80em' },
        'xl-only': { min: '80em', max: '96em' },
        '2xl-only': { min: '96em' },
      },
      spacing: {
        nav: 'var(--height-nav)',
        screen: 'var(--screen-height, 100vh)',
      },
      height: {
        screen: 'var(--screen-height, 100vh)',
        'screen-no-nav': 'calc(var(--screen-height, 100vh) - var(--height-nav))',
        'screen-dynamic': 'var(--screen-height-dynamic, 100vh)',
      },
      width: {
        mobileGallery: 'calc(100vw - 3rem)',
      },
      fontFamily: {
        // Besilos audit: 'Nature' heading is Geometric Sans
        sans: ['Poppins', 'Rubik', 'Helvetica Neue', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'IBMPlexSerif', 'Palatino', 'ui-serif'],
      },
      fontSize: {
        display: ['var(--font-size-display)', '1.1'],
        heading: ['var(--font-size-heading)', '1.25'],
        lead: ['var(--font-size-lead)', '1.333'],
        copy: ['var(--font-size-copy)', '1.5'],
        fine: ['var(--font-size-fine)', '1.333'],
      },
      maxWidth: {
        'prose-narrow': '45ch',
        'prose-wide': '80ch',
      },
      borderRadius: {
        lg: '0.75rem',
        md: 'calc(0.75rem - 2px)',
        sm: 'calc(0.75rem - 4px)',
      },
      boxShadow: {
        border: 'inset 0px 0px 0px 1px rgb(var(--color-primary) / 0.08)',
        darkHeader: 'inset 0px -1px 0px 0px rgba(21, 21, 21, 0.4)',
        lightHeader: 'inset 0px -1px 0px 0px rgba(21, 21, 21, 0.05)',
      },
    },
  },
  plugins: [formsPlugin, typographyPlugin],
};

