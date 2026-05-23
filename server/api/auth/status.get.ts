export default defineEventHandler((event) => {
  try {
    const token = getCookie(event, 'AuthToken')
    if (!token) return { authenticated: false }

    let payload: Record<string, any>
    try {
      const segment = token.split('.')[1]
      payload = JSON.parse(Buffer.from(segment, 'base64url').toString())
    } catch {
      return { authenticated: false }
    }

    const exp = payload.exp as number | undefined
    if (exp && Date.now() / 1000 > exp) {
      return { authenticated: false, reason: 'expired' }
    }

    const groups: string[] = payload['cognito:groups'] ?? []
    const role: string = groups[0] ?? getCookie(event, 'UserRole') ?? ''

    if (role === 'new_hire') {
      return { authenticated: false, reason: 'unauthorized' }
    }

    return {
      authenticated: true,
      expiresAt: exp ? exp * 1000 : null,
      user: {
        id: payload.sub ?? '',
        firstName: payload.given_name ?? (payload.name ?? '').split(' ')[0] ?? '',
        lastName: payload.family_name ?? (payload.name ?? '').split(' ').slice(1).join(' ') ?? '',
        email: payload.email ?? '',
        role,
      },
    }
  } catch {
    return { authenticated: false }
  }
})
