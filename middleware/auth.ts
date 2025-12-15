export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()

  if (!loggedIn.value) {
    // Store the intended URL to redirect after login
    const returnTo = to.fullPath

    // Get locale-aware login path
    const localePath = useLocalePath()
    const loginPath = localePath('/login')

    // Redirect to login page with return URL
    return navigateTo(`${loginPath}?returnTo=${encodeURIComponent(returnTo)}`)
  }
})
