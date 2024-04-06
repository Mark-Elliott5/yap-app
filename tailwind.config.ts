import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
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
          '50': '#e7edf5',
          '100': '#cedceb',
          '200': '#9db9d6',
          '300': '#6d95c2',
          '400': '#3c72ad',
          '500': '#0b4f99',
          '600': '#093f7a',
          '700': '#072f5c',
          '800': '#04203d',
          '900': '#02101f',
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
      },
      borderWidth: {
        1: '1px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
