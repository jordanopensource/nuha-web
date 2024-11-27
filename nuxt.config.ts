export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      title: 'Nuha',
      link: [
        {
          rel: 'stylesheet',
          href: 'https://webfonts.fontstand.com/WF-084743-1b13b14034fdcff6da11465383ec5465.css',
          type: 'text/css',
        },
      ],
    },
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@josango/nuxt3-build-banner',
    '@element-plus/nuxt',
    '@sidebase/nuxt-auth',
    '@nuxt/content',
    '@nuxtjs/robots',
  ],

  auth: { globalAppMiddleware: true },

  routeRules: {
    '/**': { prerender: false },
  },

  typescript: {
    shim: false,
    tsConfig: {
      include: ['~/types/*.ts'],
    },
  },

  plugins: [
    { src: '~/plugins/use-scroll.ts', ssr: false, mode: 'client' },
    {
      src: '~/plugins/matomo-plugin.client.js',
      ssr: false,
    },
  ],

  css: [
    '@/assets/css/tailwind.css',
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
      matomoSiteId: 19,
      matomoHost: 'https://analytics.josa.ngo/',
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
    listMonk: {
      apiUrl: '',
      user: '',
      token: '',
      enTemplateId: '',
      arTemplateId: '',
      listId: '',
    },
  },

  compatibilityDate: '2024-11-26',
})
