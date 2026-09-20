/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        script: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      colors: {
        bg: {
          primary: '#FDFBF7',
          secondary: '#F7F3EC',
          tertiary: '#EFE9DE',
          dark: '#2D2926',
        },
        text: {
          main: '#2D2926',
          muted: '#6E675F',
          accent: '#A36B5E',
          highlight: '#6B7A66',
        },
        accent: {
          blush: '#F0D9D5',
          gold: '#E5C388',
          sage: '#D8E0D5',
          rust: '#A36B5E',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'fade-up': 'fadeUp 0.8s ease forwards',
        'pulse-soft': 'pulseSoft 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(24px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
