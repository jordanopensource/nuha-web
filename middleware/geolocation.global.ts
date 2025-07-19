export default defineNuxtRouteMiddleware(async (to) => {
  
  const region = to.params.region as string;
  // TODO: define available regions in a separate composable
  const supportedRegions = ['jo', 'eg', 'tn', 'iq'];
  // const DEFAULT_REGION = supportedRegions[0]

  if (region.trim().length != 0 && supportedRegions.includes(region)) {
    console.info("Region supported")
    // TODO: store region in cookie or pinia / store or both?
    useCookie('nuha_region').value = region;
  } else {
    console.info("Region not supported")
    // TODO: show region selector pop-up if auto-detection fails

    const { $geolocation } = useNuxtApp()
    // Check if geo-location data already exists
    if ($geolocation.value) return

    // detect geolocation on client side
    if (import.meta.client) {
      try {
        const data = await $fetch('/api/geolocation')
        $geolocation.value = data
        console.info("GEOLOCATION: ", $geolocation.value)
      } catch (error) {
        console.error('Failed to fetch geo-location data:', error)
      }
    }
  }
});
