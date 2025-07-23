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
      { code: 'en', file: 'en.json', name: 'English' },
      { code: 'ar', file: 'ar.json', name: 'العربية', dir: 'rtl' },
      { code: 'fr', file: 'fr.json', name: 'Français' },
      { code: 'ku', file: 'ku.json', name: 'Kurdî' }
    ],
    defaultLocale: 'en',
    // langDir: 'i18n/locales/',
    // lazy: true,
    // vueI18n: './i18n.config.ts'
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
  ],
  css: ['~/assets/css/main.css'],
})