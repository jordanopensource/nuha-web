// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  i18n: {
    strategy: 'prefix_and_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'ui_lang',
      fallbackLocale: 'en',
      alwaysRedirect: true,
    },
    locales: [
      { code: 'en', file: 'en.json', name: 'English', language: 'en' },
      { code: 'ar', file: 'ar.json', name: 'العربية', dir: 'rtl', language: 'ar' },
      { code: 'fr', file: 'fr.json', name: 'Français', language: 'fr' },
      { code: 'ckb', file: 'ckb.json', name: 'کوردیی ناوەندی', language: 'ckb', dir: 'rtl' }
    ],
    defaultLocale: 'en',
    defaultDirection: "ltr",
    baseUrl: 'http://localhost:3000/'
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxtjs/strapi',
  ],
  css: [
    '@/assets/css/main.css',
    '@/assets/css/fonts/ibm-plex.css',
    '@/assets/css/fonts/29lt-zarid-text.css',
  ],

  strapi: {
    url: process.env.STRAPI_URL || 'http://localhost:1337',
    token: process.env.STRAPI_TOKEN,
    prefix: '/api',
    version: 'v5',
  },
  icon: {
    serverBundle: {
      collections: ['mdi', 'flag']
    }
  }
})