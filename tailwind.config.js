import twColors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1rem',
        md: '2rem',
        lg: '3rem',
        xl: '4rem',
      },
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
            hover: '#8B0A39', // hover state
            active: '#72082F', // active / pressed
            light: '#fdeaed', // light pink for secondary. OLD COLOR: #FCF0F7
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
        LTZarid: 'var(--font-display)',
        IBMPlexSansArabic: 'var(--font-body)',
        IBMPlexMono: '"IBM Plex Mono"',
        AbdGovar: '"Abd Govar"',
      },
      fontSize: {
        h1: [
          'calc(var(--fs-h1) * var(--fs-scale))',
          { lineHeight: 'var(--leading-tight)', fontWeight: '600' },
        ],
        'h1-m': [
          'calc(var(--fs-h1-m) * var(--fs-scale))',
          { lineHeight: 'var(--leading-tight)', fontWeight: '600' },
        ], // mobile
        h2: [
          'calc(var(--fs-h2) * var(--fs-scale))',
          { lineHeight: 'var(--leading-tight)', fontWeight: '600' },
        ],
        'h2-m': [
          'calc(var(--fs-h2-m) * var(--fs-scale))',
          { lineHeight: 'var(--leading-tight)', fontWeight: '600' },
        ],
        h3: [
          'calc(var(--fs-h3) * var(--fs-scale))',
          { lineHeight: 'var(--leading-tight)', fontWeight: '600' },
        ], // card titles, sidebar headers (also covers what was h4)
        lead: [
          'calc(var(--fs-lead) * var(--fs-scale))',
          { lineHeight: 'var(--leading-lead)' },
        ], // intro / subtitle paragraphs
        'lead-m': [
          'calc(var(--fs-lead-m) * var(--fs-scale))',
          { lineHeight: 'var(--leading-lead)' },
        ], // mobile
        base: [
          'calc(var(--fs-base) * var(--fs-scale))',
          { lineHeight: 'var(--leading-body)' },
        ],
        subtext: [
          'calc(var(--fs-subtext) * var(--fs-scale))',
          { lineHeight: 'var(--leading-caption)' },
        ], // small / supportive text
      },
      maxWidth: {
        measure: 'var(--measure)',
      },
    },
  },
  plugins: [],
}
