const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}', './.storybook/**'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: colors.blue,
        gray: colors.neutral,
      },
      width: {
        inherit: 'inherit',
      },
      boxShadow: {
        'sm-up': '0 -1px 2px 0 rgb(0 0 0 / 0.05)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        wave: {
          '0%, 100%': { transform: 'scaleY(0.7)', 'transform-origin': '50% 50%' },
          '50%': { transform: 'scaleY(0.3)', 'transform-origin': '50% 50%' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        wave: 'wave 1s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
