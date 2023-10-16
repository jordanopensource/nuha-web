/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '15px',
      },
      colors: {
        'nuha-fushia': {
          DEFAULT: '#c40f55',
          secondary: '#ee4d7a',
          300: '#e53076',
          200: '#f4deeb',
          100: '#fcf0f7',
        },
        'nuha-grey': {
          DEFAULT: '#2d2d2d',
          300: '#4e4e4e',
          200: '#8f8f8f',
          100: '#afafaf',
        },
        'prediction-neutral': {
          DEFAULT: '#6db981',
        },
        'prediction-hatespeach': {
          DEFAULT: '#d13561',
        },
      },
      fontFamily: {
        LTZarid: 'LT Zarid Text',
        IBMPlexSansArabic: 'IBM Plex Sans Arabic',
      },
      lineHeight: {
        15: '68px',
      },
    },
  },
  plugins: [],
}