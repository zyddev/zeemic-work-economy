const AUTH_PAGES = ['/login', '/signup']

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()

  // Always pass through auth flow pages and error pages
  if (to.path.startsWith('/auth/') || to.path === '/error' || to.path.startsWith('/error/')) return

  // Redirect authenticated users away from login/signup
  if (AUTH_PAGES.includes(to.path) && auth.isAuthenticated && !auth.isSessionExpired) {
    return navigateTo('/dashboard')
  }

  // Expired session: clear and send to login
  if (auth.isAuthenticated && auth.isSessionExpired) {
    auth.clearUser()
    return navigateTo('/login')
  }
})
