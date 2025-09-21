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
      { code: 'en',  file: 'en.json',  name: 'English', language: 'en', nativeName: 'English' },
      { code: 'ar',  file: 'ar.json',  name: 'Arabic', language: 'ar', dir: 'rtl', nativeName: 'العربية' },
      { code: 'fr',  file: 'fr.json',  name: 'French', language: 'fr', nativeName: 'Français' },
      { code: 'ckb', file: 'ckb.json', name: 'Central Kurdish', language: 'ckb', dir: 'rtl', nativeName: 'کوردیی ناوەندی' }
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
    'nuxt-auth-utils',
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
      collections: ['mdi', 'circle-flags']
    }
  },
  
  runtimeConfig: {
    // Session configuration
    session: {
      name: 'nuxt-auth-session',
      cookie: {
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true
      },
      maxAge: 60 * 60 * 24 * 7, // 1 week
      // TODO
      password: '',
    },
    // Redis configs
    redis: {
      host: '',
      port: '',
      password: '',
      db: '',
      keyPrefix: '',
    },
    // OAuth configuration
    oauth: {
      github: {
        clientId: '',
        clientSecret: '',
      }
    },
    listmonk: {
      url: '',
      user: '',
      token: '',
      enTemplateId: '',
      arTemplateId: '',
      frTemplateId: '',
      ckbTemplateId: '',
    },
    public: {
      baseUrl: 'http://localhost:3000',
    },
  },
  nitro: {
    devProxy: {
      host: 'localhost',
    },
  },
})