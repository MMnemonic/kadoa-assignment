/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        neutral: {
          50: '#f8f8f9',
          100: '#f3f4f6',
          150: '#ebecef',
          200: '#e3e5e8',
          300: '#c7c9cf',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
        },
      },
      borderRadius: {
        md: '8px',
        lg: '10px',
        xl: '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'elev-0': '0 0 #0000',
        'elev-1': '0 1px 0 rgba(0,0,0,.04), 0 1px 2px rgba(0,0,0,.06)',
        'elev-2': '0 2px 4px rgba(0,0,0,.06), 0 4px 10px rgba(0,0,0,.05)',
        'elev-3': '0 4px 8px rgba(0,0,0,.08), 0 12px 24px rgba(0,0,0,.06)',
      },
      fontSize: {
        'heading': ['1.125rem', { lineHeight: '1.4' }],
      },
    },
  },
  plugins: [],
}

