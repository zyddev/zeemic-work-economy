export default defineEventHandler((event) => {
  try {
    const token = getCookie(event, 'access_token') || getCookie(event, 'accessToken')
    if (!token) return { authenticated: false }

    let payload: Record<string, any>
    try {
      const segment = token.split('.')[1] ?? ''
      if (!segment) return { authenticated: false }
      payload = JSON.parse(Buffer.from(segment, 'base64url').toString())
    } catch {
      return { authenticated: false }
    }

    const exp = payload.exp as number | undefined
    if (exp && Date.now() / 1000 > exp) {
      return { authenticated: false, reason: 'expired' }
    }

    if (payload.type && payload.type !== 'access') {
      return { authenticated: false, reason: 'wrong_token_type' }
    }

    return {
      authenticated: true,
      expiresAt: exp ? exp * 1000 : null,
      user: {
        id: payload.userId ?? '',
        firstName: '',
        lastName: '',
        email: payload.email ?? '',
        role: payload.role ?? '',
      },
    }
  } catch {
    return { authenticated: false }
  }
})
