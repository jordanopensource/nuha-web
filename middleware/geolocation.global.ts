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
      return
  }

  // if no param and no stored region, auto-detect it
  try {
    fetchRegion()
  } catch (error) {
    console.error('Failed to fetch geo-location data:', error)
  }
  // TODO: show region selector pop-up if auto-detection fails

});
