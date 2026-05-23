export function useAuth() {
  // Password login — POST /auth/login/password
  async function login(email: string, password: string) {
    const response = await $fetch<any>('/api/auth/login/password', {
      method: 'POST',
      body: { email, password },
      credentials: 'include',
    })
    if (response?.userData) {
      useAuthStore().setUser(response.userData, response.expiresAt)
    }
    return { success: true }
  }

  // OTC trigger — always resolves (user enumeration prevention)
  async function requestOTC(email: string, role: string = 'User') {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, role },
    }).catch(() => {})
  }

  // OTC verify — POST /api/auth/login/verify { email, token, role }
  async function verifyOTC(email: string, code: string, role: string = 'User') {
    const response = await $fetch<any>('/api/auth/login/verify', {
      method: 'POST',
      body: { email, token: code, role },
    })
    if (response?.userData) {
      useAuthStore().setUser(response.userData, response.expiresAt)
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

  // Set password for an existing account (OTC or OAuth user adding a password)
  // POST /auth/password/set
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

  // Start OAuth — browser redirect (NOT fetch) so the browser follows the OAuth redirect chain
  // provider: 'google' | 'apple' | 'linkedin'
  function startOAuth(provider: 'google' | 'apple' | 'linkedin') {
    if (typeof window !== 'undefined') {
      window.location.href = `/api/auth/oauth/${provider}`
    }
  }

  return {
    login,
    requestOTC,
    verifyOTC,
    register,
    logout,
    requestPasswordReset,
    confirmPasswordReset,
    confirmPasswordResetByToken,
    setPassword,
    resetTemporaryPassword,
    startOAuth,
  }
}
