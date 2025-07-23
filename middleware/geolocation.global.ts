export default defineNuxtRouteMiddleware(async (to) => {
  // if (import.meta.client) return
  
  const {
    fetchRegion,
    isRegionSupported,
    isRegionDetected,
    setRegion,
    supportedRegions,
    region,
  } = useGeolocation()
  const nuxtApp = useNuxtApp()
  const localePath = useLocalePath(nuxtApp)

  const countryCode = (to.params.region as string)?.toLowerCase();
  let isRegionSet = false
  const regionSupported = isRegionSupported(countryCode)

  if (countryCode) {
    // invalid url param
    if (!regionSupported) {
      return createError({
        statusCode: 404,
        message: "Region not found",
      })
    }

    // url param exists and is valid
    isRegionSet = setRegion({
      countryCode,
      country: supportedRegions.find(r => r.code === countryCode)?.name
    }).value?.countryCode === countryCode

    // region is set using the url param
    if (isRegionSet) return
  }

    // region is set using cookie
    if (isRegionDetected.value && region.value?.countryCode) {
      if (!to.path.includes(region.value.countryCode)) {
        const pathArray = to.path.split("/").filter(i => i.trim().length != 0)
        const locale = localePath("/").replaceAll("/", "")
        let path
        if (pathArray.includes(locale)) {
          pathArray.splice(1, 0, region.value?.countryCode)
          path = pathArray.join("/")
        }
        else {
          pathArray.splice(0, 0, region.value?.countryCode)
          path = localePath(pathArray.join("/"))
        }
        console.info("LOCALE PATH: ", `/${path}`, "LOCALE: ", locale, "PATH ARR: ", pathArray)
        return navigateTo(`/${path}`, { replace: true, external: true });
      }
  }

  // if no param and no stored region, auto-detect it
  try {
    fetchRegion()
  } catch (error) {
    console.error('Failed to fetch geo-location data:', error)
  }
  // TODO: show region selector pop-up if auto-detection fails

});
