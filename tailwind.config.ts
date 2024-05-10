import type { Config } from 'tailwindcss';

const config = {
  // darkMode: ['selector'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      gridTemplateColumns: {
        597: '5fr 9fr 5fr;',
        doc: '1fr 3fr 1fr',
      },
      colors: {
        'yap-red': {
          '50': '#ffe9e7',
          '100': '#ffd2ce',
          '200': '#ffa59d',
          '300': '#ff796c',
          '400': '#ff4c3b',
          '500': '#ff1f0a',
          '600': '#cc1908',
          '700': '#991306',
          '800': '#660c04',
          '900': '#330602',
        },
        'yap-new-green': {
          '50': '#e6fce6',
          '100': '#cef9cc',
          '200': '#9cf399',
          '300': '#6bee66',
          '400': '#39e833',
          '500': '#08e200',
          '600': '#06b500',
          '700': '#058800',
          '800': '#035a00',
          '900': '#022d00',
        },
        'yap-green': {
          '50': '#e9fbf2',
          '100': '#d3f6e5',
          '200': '#a7edcb',
          '300': '#7ae5b1',
          '400': '#4edc97',
          '500': '#22d37d',
          '600': '#1ba964',
          '700': '#147f4b',
          '800': '#0e5432',
          '900': '#072a19',
        },
        'yap-blue': {
          '50': '#e8f2fd',
          '100': '#d1e6fc',
          '200': '#a3cdf9',
          '300': '#76b3f5',
          '400': '#489af2',
          '500': '#1a81ef',
          '600': '#1567bf',
          '700': '#104d8f',
          '800': '#0a3460',
          '900': '#051a30',
        },
        'yap-yellow': {
          '50': '#fffae7',
          '100': '#fef5cf',
          '200': '#fdea9f',
          '300': '#fce06f',
          '400': '#fbd53f',
          '500': '#facb0f',
          '600': '#c8a20c',
          '700': '#967a09',
          '800': '#645106',
          '900': '#322903',
        },
        'yap-peri': {
          '50': '#eff0fe',
          '100': '#e0e0fc',
          '200': '#c1c2f9',
          '300': '#a1a3f7',
          '400': '#8285f4',
          '500': '#6366f1',
          '600': '#4f52c1',
          '700': '#3b3d91',
          '800': '#282960',
          '900': '#141430',
        },
      },
      dropShadow: {
        heart: '0 0 3px #ff1f0a',
        green: '0 0 3px #41f500',
        echo: '0 0 3px #6366f1',
        reply: '0 0 3px #1a81ef',
      },
      borderWidth: {
        1: '1px',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('tailwindcss-animated')],
} satisfies Config;

export default config;
