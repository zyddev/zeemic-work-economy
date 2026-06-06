// ── PKCE helpers ─────────────────────────────────────────────────────────────

function generateCodeVerifier(): string {
  const bytes = new Uint8Array(64)
  crypto.getRandomValues(bytes)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  let binary = ''
  for (const byte of new Uint8Array(digest)) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function generateState(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

// ─────────────────────────────────────────────────────────────────────────────

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

  // Start OAuth with PKCE — generates state + code_verifier, stores them in
  // sessionStorage, then redirects the browser to the backend initiation URL.
  // The matching callback page at /auth/oauth/{provider}/callback validates
  // state and completes the code exchange.
  async function startOAuth(
    provider: 'google' | 'linkedin' | 'apple',
    returnTo = '/dashboard',
  ): Promise<void> {
    if (typeof window === 'undefined') return

    const state = generateState()
    const codeVerifier = generateCodeVerifier()
    const codeChallenge = await generateCodeChallenge(codeVerifier)

    sessionStorage.setItem(
      'oauth_pending',
      JSON.stringify({ state, codeVerifier, returnTo, provider }),
    )

    const params = new URLSearchParams({
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    })
    window.location.assign(`/api/auth/oauth/${provider}?${params}`)
  }

  return {
    login,
    requestOTC,
    resendOTC,
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
