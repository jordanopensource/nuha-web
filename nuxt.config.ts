// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      title: 'Nuha',
    },
  },

  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n'],

  css: ['@/assets/css/tailwind.css', '@/assets/css/fonts/ibm-plex.css'],

  i18n: {
    locales: [
      {
        code: 'en',
        name: 'English',
        iso: 'en',
        dir: 'ltr',
        file: 'en.ts',
      },
      {
        code: 'ar',
        name: 'العربية',
        iso: 'ar',
        dir: 'rtl',
        file: 'ar.ts',
      },
    ],
    lazy: true,
    langDir: 'lang',
    defaultLocale: 'en',
    baseUrl: 'http://localhost:3000/',
    debug: false,
  },
})
