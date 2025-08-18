/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      borderRadius: {
        md: '8px',
        lg: '10px',
        xl: '12px',
      },
      boxShadow: {
        'elev-0': '0 0 0 1px rgba(0,0,0,0.04)',
        'elev-1': '0 1px 2px 0 rgba(0,0,0,0.05)',
        'elev-2': '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'elev-3': '0 10px 15px -3px rgba(0,0,0,0.07), 0 4px 6px -2px rgba(0,0,0,0.05)',
        focus: '0 0 0 3px rgba(249, 115, 22, 0.35)'
      },
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
          950: '#431407'
        }
      }
    },
  },
  plugins: [],
}

