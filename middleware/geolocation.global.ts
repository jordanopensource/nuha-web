import type { StrapiLocale } from "@nuxtjs/strapi";

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return
  
  const {
    fetchRegion,
    isRegionSupported,
    isRegionDetected,
    setRegion,
    supportedRegions,
    region,
  } = useGeolocation()

  // region code in URL param has the priority over auto-detection
  const countryCode = (to.params.region as string)?.toLowerCase();
  let isRegionSet = false
  const regionSupported = isRegionSupported(countryCode)

  if (countryCode) {
    // invalid url param
    if (!regionSupported) {
      return createError({
        statusCode: 404,
      })
    }

    // url param exists and is valid
    const dialectName = supportedRegions.value.find(
      r => r.countryCode === countryCode
    )?.dialectName as Record<StrapiLocale, string>

    isRegionSet = (await setRegion({
      countryCode,
      dialectName,
    })).value?.countryCode === countryCode

    // region is set using the url param
    if (isRegionSet) return
  }

    // region is set using cookie
    if (await isRegionDetected.value && region.value?.countryCode) {
      return
  }

  // if no param and no stored region, try to auto-detect it (client-side only, non-blocking)
  fetchRegion()
  // TODO: show region selector pop-up if auto-detection fails

});
