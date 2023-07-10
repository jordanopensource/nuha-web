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
  ],
  buildModules: ['@nuxt/typescript-build'],
  plugins: [{ src: '~/plugins/use-scroll.ts', ssr: false, mode: 'client' }],

  css: [
    '@/assets/css/tailwind.css',
    '@/assets/css/fonts/ibm-plex.css',
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
  },
}

export default config
