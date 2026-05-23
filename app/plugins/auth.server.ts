export default defineNuxtPlugin(async () => {
  const headers = useRequestHeaders(['cookie'])
  const auth = useAuthStore()
  try {
    const status = await $fetch<{
      authenticated: boolean
      expiresAt?: number | null
      user?: { id: string; firstName: string; lastName: string; email: string; role: string }
    }>('/api/auth/status', { headers })
    if (status.authenticated && status.user) {
      auth.setUser(status.user, status.expiresAt)
    } else {
      auth.clearUser()
    }
  } catch {
    auth.clearUser()
  }
})
