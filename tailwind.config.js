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
          300: '#e53076',
          200: '#f4deeb',
          100: '#fcf0f7',
        },
        'nuha-grey': {
          DEFAULT: '#2d2d2d',
        },
      },
      fontFamily: {
        IBMPlexSansArabic: 'IBM Plex Sans Arabic',
        IBMPlexMono: 'IBM Plex Mono',
      },
      lineHeight: {
        15: '68px',
      },
    },
  },
  plugins: [],
}
