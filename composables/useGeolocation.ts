// Based on this IP Lookup Service: https://ip-api.com/docs/api:json

// TODO: only keep the important properties
interface RegionData {
  status?: "success" | "fail"
  country?: string
  countryCode?: string
  region?: string
  regionName?: string
  city?: string
  timezone?: string
}

export const useGeolocation = () => {
  const supportedRegions = [
    { code: 'jo', name: 'Jordan', language: 'ar', aiModel: 'nuha-jo' },
    { code: 'eg', name: 'Egypt', language: 'ar', aiModel: 'nuha-eg' },
    { code: 'tn', name: 'Tunisia', language: 'ar', aiModel: 'nuha-tn' },
    { code: 'iq', name: 'Iraq', language: 'ar', aiModel: 'nuha-iq' },
  ];
  const isRegionSupported = (code: string) => supportedRegions.some(r => r.code === code?.toLowerCase())

  const region = useState<RegionData | null>('userRegion', () => null)

  // 30 days cookie for country code
  const regionCookie = useCookie<string | null>('nuha_region', { maxAge: 60 * 60 * 24 * 30 })

  const setRegion = (newRegion: RegionData | null) => {
    if (newRegion?.countryCode && isRegionSupported(newRegion.countryCode)) {
      regionCookie.value = newRegion.countryCode.toLowerCase()
      region.value = newRegion
    } else {
      region.value = null
      // NOTE: do not reset the cookie value because it might already have the user-preferred region
      //       from a previous session
      // regionCookie.value = null
    }
    return region
  }

  const isRegionDetected = computed(() => {
    // check whether a region is stored in a cookie or state and is valid
    const countryCode = (region.value?.countryCode || regionCookie?.value)?.toString()
    const regionExists = countryCode && isRegionSupported(countryCode)

    // update the state if the region was found in a cookie after refresh
    if (regionExists) {
        region.value = {
        countryCode,
        country: supportedRegions.find(r => r.code === countryCode)?.name
      }
    } else {
      regionCookie.value = null // make sure to reset the cookie
    }
    return regionExists
  })
  
  const fetchRegion = async () => {
    if (isRegionDetected.value) return region.value

    try {
      const res = await useFetch<RegionData>('/api/geolocation')
      setRegion(res.data.value)
    } catch (error) {
      console.error('Failed to fetch geo-location:', error)
      setRegion(null)
    }
    return region.value
  }

  return {
    isRegionSupported,
    fetchRegion,
    setRegion,
    region: readonly(region),
    supportedRegions: readonly(supportedRegions),
    isRegionDetected,
  }
}