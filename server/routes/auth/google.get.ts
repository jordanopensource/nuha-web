import { detectLocale, getLocalizedPath } from '~/server/utils/locale'

export default defineOAuthGoogleEventHandler({
  async onSuccess(event, { user }) {
    // Create proxied avatar URL if user has a pfp
    let avatarUrl = undefined
    if (user.picture) {
      // Encode google avatar url in base64 and create proxy url
      const encodedUrl = Buffer.from(user.picture).toString('base64')
      const baseUrl = getRequestURL(event).origin
      avatarUrl = `${baseUrl}/api/avatar/${encodedUrl}`
    }

    // Set user session with Google data
    await setUserSession(event, {
      user: {
        id: user.id?.toString() || undefined,
        email: user.email,
        name: user.name,
        avatar: avatarUrl,
        provider: 'google',
        googleId: user.id?.toString() || undefined,
        verified: user.email_verified
      },
      loggedInAt: new Date()
    })
    
    // Detect user's locale and redirect to locale-aware analyze page
    const locale = detectLocale(event)
    const localizedPath = getLocalizedPath('analyze', locale)
    return sendRedirect(event, localizedPath)
  },
  onError(event, error) {
    console.error('Google OAuth error:', error)
    // Detect user's locale and redirect to locale-aware login page with error
    const locale = detectLocale(event)
    const localizedPath = getLocalizedPath('login?error=google_oauth_failed', locale)
    return sendRedirect(event, localizedPath)
  }
})
