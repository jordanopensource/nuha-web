import type { NuxtConfig } from '@nuxt/types'

const config: NuxtConfig = {
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

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@josango/nuxt3-build-banner',
    '@element-plus/nuxt',
    '@sidebase/nuxt-auth',
  ],

  auth: { globalAppMiddleware: true },

  buildModules: ['@nuxt/typescript-build'],
  typescript: {
    shim: false,
    tsConfig: {
      include: ['~/types/*.ts'],
    },
  },
  plugins: [{ src: '~/plugins/use-scroll.ts', ssr: false, mode: 'client' }],

  css: [
    '@/assets/css/tailwind.css',
    '@/assets/css/fonts/lt-zarid-serif.css',
    '@/assets/css/fonts/ibm-plex-sans-arabic.css',
    '@/assets/css/global.css',
  ],

  i18n: {
    locales: [
      {
        code: 'en',
        name: 'English',
        iso: 'en-US',
        dir: 'ltr',
        file: 'en.ts',
      },
      {
        code: 'ar',
        name: 'العربية',
        iso: 'ar-JO',
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
  runtimeConfig: {
    public: {
      targetEnv: '',
      buildCommitSha: '',
      buildCommitLink: '',
      buildNumber: '',
      buildLink: '',
      buildRepoLink: '',
      buildTimestamp: '',
      monkFormLink: '',
      monkFormId: '',
    },
    authSecret: '',
    github: {
      clientId: '',
      clientSecret: '',
    },
    josaOAuth: {
      clientId: '',
      clientSecret: '',
      wellKnown: '',
    },
    apiUrl: '',
    mongodbUri: '',
    smtp: {
      host: '',
      user: '',
      password: '',
    },
  },
}

export default config