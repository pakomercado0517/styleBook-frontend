import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'serif'],
      },
      colors: {
        // LUXE NOIR Palette - Elegancia y Sofisticación
        primary: {
          50: '#F5F5F5',
          100: '#E5E5E5',
          200: '#CCCCCC',
          300: '#B3B3B3',
          400: '#999999',
          500: '#808080',
          600: '#666666',
          700: '#4D4D4D',
          800: '#2C2C2C', // Charcoal principal
          900: '#1A1A1A',
        },
        accent: {
          50: '#FAF7F0',
          100: '#F5EFE1',
          200: '#EBDFC3',
          300: '#E1CFA5',
          400: '#D7BF87',
          500: '#D4AF37', // Champagne/Gold
          600: '#B8952D',
          700: '#8C7122',
          800: '#604D17',
          900: '#34290C',
        },
        neutral: {
          50: '#F5F5F0', // Cream
          100: '#E8E8E3',
          200: '#D1D1C7',
          300: '#BABAAB',
          400: '#A3A38F',
          500: '#8C8C73',
          600: '#64748B', // Slate
          700: '#52525C',
          800: '#3A3A3A',
          900: '#222222',
        },
      },
      borderRadius: {
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in',
        'slide-up': 'slideUp 0.6s ease-out',
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
