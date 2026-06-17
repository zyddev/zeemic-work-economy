function setUserFromResponse(data: { userId: string; email: string; role: string }) {
  useAuthStore().setUser({
    id: data.userId,
    firstName: '',
    lastName: '',
    email: data.email,
    role: data.role,
  })
}

export function useAuth() {
  // Password login — POST /auth/login/password
  async function login(email: string, password: string) {
    const response = await $fetch<any>('/api/auth/login/password', {
      method: 'POST',
      body: { email, password },
      credentials: 'include',
    })
    if (response?.data) {
      setUserFromResponse(response.data)
    }
    return { success: true }
  }

  // OTC trigger — POST /auth/login { email }
  async function requestOTC(email: string) {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email },
    }).catch(() => {})
  }

  // Resend OTC — tries dedicated resend endpoint, falls back to login (same OTC trigger)
  async function resendOTC(email: string) {
    try {
      await $fetch('/api/auth/resendOTC', { method: 'POST', body: { email } })
    } catch {
      await $fetch('/api/auth/login', { method: 'POST', body: { email } }).catch(() => {})
    }
  }

  // OTC verify — POST /auth/login/verify { email, otc }
  async function verifyOTC(email: string, code: string) {
    const response = await $fetch<any>('/api/auth/login/verify', {
      method: 'POST',
      body: { email, otc: code },
    })
    if (response?.data) {
      setUserFromResponse(response.data)
    }
    return response
  }

  // Register new account — backend sends OTC to email
  async function register(name: string, email: string) {
    return $fetch<any>('/api/auth/register', {
      method: 'POST',
      body: { name, email },
    })
  }

  async function fetchProfile() {
    const store = useAuthStore()
    if (!store.isAuthenticated) return
    try {
      const res = await $fetch<any>('/api/user/profile/me/info', { credentials: 'include' })
      const data = res?.data ?? res
      if (!data || !store.user) return
      store.setUser({
        ...store.user,
        firstName: data.firstName ?? data.user?.firstName ?? store.user.firstName,
        lastName: data.lastName ?? data.user?.lastName ?? store.user.lastName,
        username: data.username ?? data.profile?.username ?? data.user?.profile?.username ?? store.user.username,
        profilePicture: data.profilePicture ?? data.profile?.profilePicture ?? data.user?.profile?.profilePicture ?? store.user.profilePicture,
        defaultBusinessId: data.defaultBusinessId ?? store.user.defaultBusinessId,
      })
    } catch {
      // profile fetch is best-effort; don't surface to user
    }
  }

  async function logout() {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // ignore network errors
    }
    useAuthStore().clearUser()
  }

  // Initiate password reset — POST /auth/password/reset
  // Always returns 200 regardless of whether the email is registered.
  async function requestPasswordReset(email: string) {
    await $fetch('/api/auth/password/reset', {
      method: 'POST',
      body: { email },
    }).catch(() => {})
  }

  // Confirm reset via token from email link — POST /auth/password/reset/confirm
  // token: opaque token from {APP_URL}/password/reset?token=...
  async function confirmPasswordResetByToken(token: string, newPassword: string) {
    return $fetch('/api/auth/password/reset/confirm', {
      method: 'POST',
      body: { token, newPassword },
    })
  }

  // Legacy: confirm reset via OTC code (kept for backwards compat if backend still supports it)
  async function confirmPasswordReset(email: string, code: string, newPassword: string) {
    return $fetch('/api/auth/confirm-forgot-password', {
      method: 'POST',
      body: { email, code, newPassword },
    })
  }

  // Set password for an existing account — POST /auth/password/set
  async function setPassword(email: string, password: string) {
    return $fetch('/api/auth/password/set', {
      method: 'POST',
      body: { email, password },
    })
  }

  // Legacy alias used by account/password.vue before setPassword was available
  async function resetTemporaryPassword(password: string) {
    const response = await $fetch<any>('/api/auth/reset-password', {
      method: 'POST',
      body: { password },
    })
    if (response?.userData) {
      useAuthStore().setUser(response.userData, response.expiresAt)
    }
    return response
  }

  // BFF OAuth — backend owns state, code exchange, and cookie issuance.
  // /api/auth/oauth/[provider]/start proxies the initiation through Nitro:
  // it captures the backend's first-hop redirect (forwarding state cookies) and
  // sends the browser to the provider, or redirects to /error on misconfiguration.
  function startOAuth(provider: 'google' | 'linkedin' | 'facebook'): void {
    if (typeof window === 'undefined') return
    window.location.assign(`/api/auth/oauth/${provider}/start`)
  }

  return {
    login,
    requestOTC,
    resendOTC,
    verifyOTC,
    register,
    logout,
    fetchProfile,
    requestPasswordReset,
    confirmPasswordReset,
    confirmPasswordResetByToken,
    setPassword,
    resetTemporaryPassword,
    startOAuth,
  }
}
