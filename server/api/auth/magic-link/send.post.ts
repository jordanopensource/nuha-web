export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    const { email, locale = 'en' } = await readBody(event)

    if (!email || typeof email !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email is required'
      })
    }

    // validate email and locale
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email format'
      })
    }
    const supportedLocales = ['en', 'ar', 'fr', 'ckb']
    const selectedLocale = typeof locale === 'string' && supportedLocales.includes(locale) ? locale : 'en'

    // generate token and magic link
    const { token } = generateMagicLinkToken(email)

    const config = useRuntimeConfig()
    const baseUrl = config.public.baseUrl
        const magicLink = `${baseUrl}/auth/magic-link?token=${token}`
        console.log("Magic link: ", magicLink)

    // send magic link email with locale
    await sendMagicLinkEmail(email, magicLink, selectedLocale)

    return {
      success: true,
      message: 'Magic link sent successfully'
    }

  } catch (error) {
    console.error('Magic link send error:', error)

    interface NuxtError {
      statusCode?: number
      statusMessage?: string
    }

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error as NuxtError
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send magic link'
    })
  }
})
