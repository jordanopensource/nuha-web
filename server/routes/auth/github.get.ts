export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true
  },
  async onSuccess(event, { user }) {
    // Set user session with GitHub data
    await setUserSession(event, {
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.name || user.login,
        username: user.login,
        avatar: user.avatar_url,
        provider: 'github',
        githubId: user.id.toString(),
        verified: true
      },
      loggedInAt: new Date()
    })
    // FIXME: this always redirects to the english version
    // TODO: redirect to correct locale
    return sendRedirect(event, '/analyze')
  },
  onError(event, error) {
    console.error('GitHub OAuth error:', error)
    // redirect to login with error
    return sendRedirect(event, '/login?error=github_oauth_failed')
  }
})
