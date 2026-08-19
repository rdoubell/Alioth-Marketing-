/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#0E0D0B',
        ink: '#15140F',
        cream: '#F1E9DA',
        'cream-deep': '#E6DAC2',
        'cream-soft': '#F7F2E8',
        green: '#1B3B2F',
        'green-bright': '#27513F',
        'green-deep': '#0F2A20',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Archivo', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
