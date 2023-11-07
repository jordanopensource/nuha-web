import { defineNuxtPlugin } from '#app'
import VueMatomo from 'vue-matomo'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  nuxtApp.vueApp.use(VueMatomo, {
    host: config.public.matomoHost,
    siteId: config.public.matomoSiteId,
    // Enables automatically registering pageviews on the router
    router: nuxtApp.$router,
    enableLinkTracking: true,
    requireConsent: false,
    trackInitialView: true,
    disableCookies: true,
    requireCookieConsent: false,
  })
})
