// Dedicated OAuth initiation route.
// The generic auth proxy uses $fetch.raw which follows redirects server-side,
// meaning the browser never sees the 302 to Google/LinkedIn — it just receives
// the provider's HTML. This route captures the redirect with fetch redirect:'manual'
// and relays it directly to the browser so the full OAuth flow happens in the browser.
export default defineEventHandler(async (event) => {
  const provider = getRouterParam(event, 'provider')
  const config = useRuntimeConfig()
  const query = getQuery(event)

  const backendUrl = new URL(`${config.public.appUrl}/auth/oauth/${provider}`)
  for (const [k, v] of Object.entries(query)) {
    if (v != null) backendUrl.searchParams.set(k, String(v))
  }

  const userAgent = getRequestHeader(event, 'user-agent') ?? ''

  let response: Response
  try {
    response = await fetch(backendUrl.toString(), {
      method: 'GET',
      redirect: 'manual',
      headers: {
        'x-api-gateway': 'nuxt-proxy',
        ...(userAgent && { 'user-agent': userAgent }),
      },
    })
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'OAuth service unavailable' })
  }

  const location = response.headers.get('location')
  if ((response.status === 301 || response.status === 302) && location) {
    return sendRedirect(event, location, 302)
  }

  // Backend returns 400 for unknown providers or 503 when env vars are missing.
  if (response.status === 400 || response.status === 503) {
    return sendRedirect(event, '/login?error=oauth_failed', 302)
  }

  throw createError({ statusCode: 502, statusMessage: 'OAuth service did not redirect' })
})
