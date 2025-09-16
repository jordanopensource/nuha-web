export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()
  
  if (!loggedIn.value) {
    // Store the intended URL to redirect after login
    const returnTo = to.fullPath
    
    // Redirect to login page with return URL
    return navigateTo(`/login?returnTo=${encodeURIComponent(returnTo)}`)
  }
})
