/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'slide-down': {
          '0%': {
            opacity: '0',
            maxHeight: '0',
            transform: 'translateY(-20px)'
          },
          '100%': {
            opacity: '1',
            maxHeight: '2000px',
            transform: 'translateY(0)'
          }
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down': 'slide-down 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
      }
    },
  },
  safelist: [
    'text-indigo-50',
    'text-indigo-100',
    'text-indigo-200',
    'text-indigo-300',
    'text-indigo-400',
    'text-indigo-500',
    'text-indigo-600',
    'text-indigo-700',
    'text-indigo-800',
    'text-indigo-900',
    'text-indigo-950',
    'text-white',
    'text-black',
    'animate-fade-in-up',
    'animate-slide-down'
  ],
  plugins: [],
};
