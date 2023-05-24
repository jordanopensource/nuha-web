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
      colors: {
        'nuha-fushia': {
          DEFAULT: '#e53076',
        },
        'nuha-grey': {
          DEFAULT: '#2d2d2d',
        },
      },
      fontFamily: {
        IBMPlexSansArabic: 'IBM Plex Sans Arabic',
        IBMPlexMono: 'IBM Plex Mono',
      },
    },
  },
  plugins: [],
}
