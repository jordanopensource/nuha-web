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
    // FIXME: this always redirects to the english version
    // TODO: redirect to correct locale
    return sendRedirect(event, '/analyze')
  },
  onError(event, error) {
    console.error('Google OAuth error:', error)
    // redirect to login with error
    return sendRedirect(event, '/login?error=google_oauth_failed')
  }
})
