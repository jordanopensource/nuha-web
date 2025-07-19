import { getRequestIP } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const clientIP = getRequestIP(event);
    // const clientIP = getHeader(event, 'x-forwarded-for')
    console.info("CLIENT IP ADDRESS: ", clientIP)
    
    // Skip private/local IPs for development
    if (!clientIP || clientIP === '127.0.0.1' || clientIP === '::1' || clientIP?.startsWith('192.168.')) {
      return {
        query: clientIP,
        status: 'fail',
        message: 'Private IP address'
      }
    }

    const res: string = await $fetch(`https://ipapi.co/${clientIP}/country/`);
    if (res !== "Undefined") return { country: res.toLowerCase() };
    else {
      console.error('Undefined IP API Response')
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch geo-location data'
      })
    }

  } catch (error) {
    console.error('Geo-location API error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch geo-location data'
    })
  }
})