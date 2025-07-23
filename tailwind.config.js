/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
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
            light: '#FCF0F7',   // light pink for secondary
          },
        },
      },
      fontFamily: {
        LTZarid: '"29LT Zarid Text Regular"',
        IBMPlexSansArabic: '"IBM Plex Sans Arabic"',
        IBMPlexMono: '"IBM Plex Mono"',
      },
    },
  },
  plugins: [],
}

