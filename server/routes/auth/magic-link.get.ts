import { detectLocale, getLocalizedPath } from '~/server/utils/locale'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { token } = query

  try {
    if (!token || typeof token !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid or expired magic link',
        cause: 'No invalid token exists'
      })
    }
    // verify the magic link token
    const result = await verifyMagicLinkToken(token)

    if (!result) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid or expired magic link'
      })
    }

    // create or update user session
    await setUserSession(event, {
      user: {
        id: generateUserId(result.email),
        email: result.email,
        provider: 'email',
        verified: true
      },
      loggedInAt: new Date()
    })

    // Detect user's locale and redirect to locale-aware analyze page
    const locale = detectLocale(event)
    const localizedPath = getLocalizedPath('analyze', locale)
    return sendRedirect(event, localizedPath)

  } catch (error) {
    console.error('Magic link verification error:', error)
    
    interface NuxtError {
      statusCode?: number
      statusMessage?: string
    }
    
    if (error && typeof error === 'object' && 'statusCode' in error) {
      const nuxtError = error as NuxtError
      // Detect user's locale and redirect to locale-aware login page with error
      const locale = detectLocale(event)
      const errorMessage = encodeURIComponent(nuxtError.statusMessage || 'authentication_failed')
      const localizedPath = getLocalizedPath(`login?error=${errorMessage}`, locale)
      return sendRedirect(event, localizedPath)
    }
    
    // Detect user's locale and redirect to locale-aware login page with generic error
    const locale = detectLocale(event)
    const localizedPath = getLocalizedPath('login?error=authentication_failed', locale)
    return sendRedirect(event, localizedPath)
  }
})

// FIXME
// generate a consistent user ID from email
function generateUserId(email: string): string {
  let hash = 0
  for (let i = 0; i < email.length; i++) {
    const char = email.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // convert to 32-bit integer
  }
  return Math.abs(hash).toString()
}
