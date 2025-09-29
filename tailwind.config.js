import twColors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './app.vue'
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1rem',
        md: '2rem',
        lg: '3rem',
        xl: '4rem'
      }
    },
    extend: {
      colors: {
        colors: {
          neutral: {
            background: '#FAF9F6',
            foreground: '#2D2D2D',
            placeholder: '#8F8F8F',
          },
          primary: {
            DEFAULT: '#C40F55', // main pink
            hover: '#8B0A39',   // hover state
            active: '#72082F',  // active / pressed
            light: '#fdeaed',   // light pink for secondary. OLD COLOR: #FCF0F7
          },
          // Semantic analysis colors used across charts & UI
          analysis: {
            hate: {
              50: twColors.rose[50],
              100: twColors.rose[100],
              200: twColors.rose[200],
              500: twColors.rose[500],
              600: twColors.rose[600],
              800: twColors.rose[800],
            },
            nonhate: {
              50: twColors.indigo[50],
              100: twColors.indigo[100],
              200: twColors.indigo[200],
              500: twColors.indigo[500],
              600: twColors.indigo[600],
              800: twColors.indigo[800],
            },
            neutral: {
              50: twColors.slate[50],
              100: twColors.slate[100],
              200: twColors.slate[200],
              500: twColors.slate[500],
              600: twColors.slate[600],
              800: twColors.slate[800],
            },
          },
        },
      },
      fontFamily: {
        LTZarid: '"29LT Zarid Text Regular"',
        IBMPlexSansArabic: '"IBM Plex Sans Arabic"',
        IBMPlexMono: '"IBM Plex Mono"',
      },
      fontSize: {
        'h1': ['48px', { lineHeight: '1.2', fontWeight: '600' }],
        'h1-m': ['40px', { lineHeight: '1.2', fontWeight: '600' }], // mobile
        'h2': ['36px', { lineHeight: '1.2', fontWeight: '600' }],
        'h2-m': ['32px', { lineHeight: '1.2', fontWeight: '600' }],
        'h3': ['24px', { lineHeight: '1.16', fontWeight: '600' }],
        'h3-m': ['22px', { lineHeight: '1.16', fontWeight: '600' }],
        'h4': ['20px', { lineHeight: '1.16', fontWeight: '600' }],
        'h4-m': ['18px', { lineHeight: '1.16', fontWeight: '600' }],
        'base': ['18px', { lineHeight: '1.16' }],
        'subtext': ['14px', { lineHeight: '1.16' }], // small / supportive text
      },
    },
  },
  plugins: [],
}

