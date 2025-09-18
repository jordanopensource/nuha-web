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

    return sendRedirect(event, '/analyze')

  } catch (error) {
    console.error('Magic link verification error:', error)
    
    interface NuxtError {
      statusCode?: number
      statusMessage?: string
    }
    
    if (error && typeof error === 'object' && 'statusCode' in error) {
      const nuxtError = error as NuxtError
      // redirect to login with error
      const errorMessage = encodeURIComponent(nuxtError.statusMessage || 'authentication_faile')
      return sendRedirect(event, `/login?error=${errorMessage}`)
    }
    
    // Redirect with generic error for server errors
    return sendRedirect(event, '/login?error=authentication_failed')
  }
})

// FIXME
// generate a consistent user ID from email
function generateUserId(email: string): string {
  // TODO: create user in db
  let hash = 0
  for (let i = 0; i < email.length; i++) {
    const char = email.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // convert to 32-bit integer
  }
  return Math.abs(hash).toString()
}
