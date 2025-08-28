/** @type {import('tailwindcss').Config} */
export default {
  content: [],
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

