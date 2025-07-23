// import { getRequestIP } from 'h3'
interface GeoLocationData {
  query: string
  status: "success" | "fail"
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
    // const clientIP = getRequestIP(event);
    // TODO: remove the dev environment-specific logic
    const isDev = process.env.NODE_ENV === "development"
    const clientIP = isDev ? '149.200.184.187' : getHeader(event, 'x-forwarded-for')
    console.info("CLIENT IP ADDRESS: ", clientIP)
    
    // Skip private/local IPs for development
    if (!clientIP || clientIP === '127.0.0.1' || clientIP === '::1' || clientIP?.startsWith('192.168.')) {
      return {
        query: clientIP,
        status: 'fail',
        message: 'Local IP address'
      }
    }

    const API_URL = "http://ip-api.com"
    const res = await $fetch<GeoLocationData>(`${API_URL}/json/${clientIP}`)
    if (res.status !== "fail")
      return res;

    console.error(`Failed to fetch geo-location data.`, res.message)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch geo-location data${res.message ? ": " + res.message : "."}`
    })
  } catch (error) {
    console.error('Geo-location API error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch geo-location data'
    })
  }
})