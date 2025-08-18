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
        xl: '14px',
        '2xl': '18px',
      },
      boxShadow: {
        'elev-0': '0 0 0 1px rgba(255,255,255,0.06) inset',
        'elev-1': '0 6px 20px -6px rgba(0,0,0,0.35)',
        'elev-2': '0 2px 4px rgba(0,0,0,.06), 0 4px 10px rgba(0,0,0,.05)',
        'elev-3': '0 4px 8px rgba(0,0,0,.08), 0 12px 24px rgba(0,0,0,.06)',
      },
      backgroundImage: {
        'kadoa-pattern': 'radial-gradient(transparent 0, transparent 18px, rgba(255,255,255,.04) 19px), radial-gradient(transparent 0, transparent 18px, rgba(0,0,0,.18) 19px)'
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(.96)', opacity: '.6' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        fadeup: {
          '0%': { transform: 'translateY(4px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      animation: {
        'pop-in': 'pop .18s ease-out both',
        'fade-up': 'fadeup .20s ease-out both',
      },
      fontSize: {
        'heading': ['1.125rem', { lineHeight: '1.4' }],
      },
    },
  },
  plugins: [],
}

