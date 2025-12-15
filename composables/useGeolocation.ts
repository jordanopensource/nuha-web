// Based on this IP Lookup Service: https://ip-api.com/docs/api:json

import type { StrapiLocale } from "@nuxtjs/strapi"
import type { PublicationRegion } from "~/types/strapi"
import countries from "i18n-iso-countries";

export interface RegionData {
  /**
   * Object where each key is a language code (ISO 639-1), and its value is
   * the dialect name in that language
   */
  dialectName?: Record<StrapiLocale, string>
  /**
   * 3-letter country code (ISO 3166-1 alpha-3, e.g., EGY for Egypt).
   */
  countryCode: string
  regionName?: string
  city?: string
  timezone?: string,
  aiModel?: string,
  /**
   * Name of the flag icon from https://icones.js.org/.
   */
  flagIcon?: string,
  isAvailable?: boolean,
}

export const useGeolocation = () => {
  const supportedRegions = useState<RegionData[]>('supportedRegions', () => [])
  const detectedRegion = useState<RegionData | null>('autoDetectedRegion', () => null )

  const fetchSupportedRegions = async () => {
    if (supportedRegions.value.length > 0) return supportedRegions.value

    try {
      // FIXME: handle paginations if the # of regions is more than 25
      const { find } = useStrapi()
      const response = await find<PublicationRegion>('regions', {
        // @ts-expect-error this works!
        locale: '*',
      })
      
      // Group regions by documentId to collect all localized versions
      const regionMap = new Map<string, PublicationRegion[]>()
      response.data.forEach(region => {
        if (!regionMap.has(region.documentId)) {
          regionMap.set(region.documentId, [])
        }
        regionMap.get(region.documentId)!.push(region)
      })

      // Transform to RegionData format
      supportedRegions.value = Array.from(regionMap.values()).map(regionLocales => {
        const dialectName = {} as Record<StrapiLocale, string>
        let countryCode = ''
        let flagIcon = ''
        let isAvailable: boolean | null = false

        regionLocales.forEach(region => {
          dialectName[region.locale] = region.name
          countryCode = region.code.toLowerCase()
          if (region.flag_icon) flagIcon = region.flag_icon
          isAvailable = region.is_available
        })

        return {
          countryCode,
          dialectName,
          flagIcon,
          isAvailable
        }
      })

      return supportedRegions.value
    } catch (error) {
      console.error('Failed to fetch supported regions:', error)
      return []
    }
  }

  const isRegionSupported = async (code: string) => {
    if (supportedRegions.value.length === 0) {
      await fetchSupportedRegions()
    }
    return supportedRegions.value.some(r => r.countryCode === code?.toLowerCase())
  }

  const region = useState<RegionData | null>('userRegion', () => null)
  
  // Get default AI model from runtime config
  const defaultRegion = useRuntimeConfig().public.aiModel.defaultRegion

  // 30 days cookie for country code
  const regionCookie = useCookie<string | null>('nuha_region', { maxAge: 60 * 60 * 24 * 30 })

  const setRegion = async (newRegion: RegionData | null) => {
    if (
        newRegion?.countryCode &&
        await isRegionSupported(newRegion.countryCode) &&
        supportedRegions.value.filter(r => r.countryCode === newRegion.countryCode)[0].isAvailable
      ) {
      if (!newRegion.dialectName) {
        newRegion.dialectName = supportedRegions.value.find(r => r.countryCode === newRegion.countryCode)?.dialectName
      }
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

  // Set default region from config
  const setDefaultRegion = async () => {
    if (defaultRegion && await isRegionSupported(defaultRegion)) {
      const foundRegion = supportedRegions.value.find(r => r.countryCode === defaultRegion)
      if (foundRegion && foundRegion.isAvailable) {
        await setRegion(foundRegion)
        return true
      }
    }
    return false
  }

  const isRegionDetected = computed(async () => {
    // check whether a region is stored in a cookie or state and is valid
    const countryCode = (region.value?.countryCode || regionCookie?.value)?.toString()
    const regionExists = countryCode && await isRegionSupported(countryCode)

    // update the state if the region was found in a cookie after refresh
    if (regionExists) {
      const foundRegion = supportedRegions.value.find(r => r.countryCode === countryCode)
      if (foundRegion) {
        region.value = foundRegion
      }
    } else {
      regionCookie.value = null // make sure to reset the cookie
    }
    return regionExists || region.value !== null
  })
  
  // if not stored, fetch it
  const fetchRegion = async () => {
    if (await setDefaultRegion()) return // set default region first, if set

    // otherwise, check if detected
    if (await isRegionDetected.value) return region.value

    try {
      const res = await useFetch<RegionData>('/api/geolocation')
      const detectedCountryCode = res.data.value?.countryCode
      if (detectedCountryCode && countries.isValid(detectedCountryCode)) {
        // convert from alpha2 code to alpha3 code
        const countryCode = countries.alpha2ToAlpha3(detectedCountryCode) as string
        detectedRegion.value = (await setRegion({
          ...res.data.value,
          countryCode,
        })).value
        await setRegion(detectedRegion.value)
      }
    } catch (error) {
      console.error('Failed to fetch geo-location:', error)
      await setRegion(null)
      // detectedRegion.value = null
    }
    return region.value
  }

  return {
    isRegionSupported,
    fetchRegion,
    fetchSupportedRegions,
    setRegion,
    region: readonly(region),
    supportedRegions: readonly(supportedRegions),
    isRegionDetected,
    detectedRegion,
  }
}