// import { getRequestIP } from 'h3'
// TODO: rename this endpoint to region/dialect
interface GeoLocationData {
  query: string
  status: 'success' | 'fail'
  message?: string
  country?: string
  countryCode?: string
  region?: string
  regionName?: string
  city?: string
  zip?: string
  lat?: number
  lon?: number
  timezone?: string
  isp?: string
  org?: string
  as?: string
}

export default defineEventHandler(async (event) => {
  try {
    // Get client IP with proper Docker support
    const clientIP =
      getHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim() ||
      getHeader(event, 'x-real-ip') ||
      getHeader(event, 'cf-connecting-ip') ||
      getRequestIP(event)

    // Skip private/local IPs for development
    if (
      !clientIP ||
      clientIP === '127.0.0.1' ||
      clientIP === '::1' ||
      clientIP?.startsWith('192.168.') ||
      clientIP?.startsWith('10.') ||
      clientIP?.startsWith('172.') ||
      clientIP?.includes('::1')
    ) {
      return {
        query: clientIP,
        status: 'fail' as const,
        message: 'Local IP address - development mode',
      }
    }

    const API_URL = 'http://ip-api.com'
    const res = await $fetch<GeoLocationData>(`${API_URL}/json/${clientIP}`)
    if (res.status !== 'fail') return res

    console.error(`Failed to fetch geo-location data.`, res.message)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch geo-location data${res.message ? ': ' + res.message : '.'}`,
    })
  } catch (error) {
    console.error('Geo-location API error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch geo-location data',
    })
  }
})
