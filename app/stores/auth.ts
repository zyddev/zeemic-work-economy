export interface AuthUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const expiresAt = ref<number | null>(null)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admins')
  const isEditor = computed(() => user.value?.role === 'editors')
  const isManager = computed(() => user.value?.role === 'managers')
  const fullName = computed(() => user.value ? `${user.value.firstName} ${user.value.lastName}`.trim() : '')
  const isSessionExpired = computed(() => !!expiresAt.value && Date.now() >= expiresAt.value)

  function setUser(u: AuthUser, exp?: number | null) {
    user.value = u
    expiresAt.value = exp ?? null
  }

  function clearUser() {
    user.value = null
    expiresAt.value = null
  }

  return { user, expiresAt, isAuthenticated, isAdmin, isEditor, isManager, fullName, isSessionExpired, setUser, clearUser }
})
