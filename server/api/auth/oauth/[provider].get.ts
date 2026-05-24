// Dedicated OAuth initiation route.
// The generic auth proxy uses $fetch.raw which follows redirects server-side,
// so the browser never sees the 302 → Google/Apple/LinkedIn.
// This route uses native fetch with redirect:'manual' to capture the first
// redirect from the BFF and relay it directly to the browser.
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

  throw createError({ statusCode: 502, statusMessage: 'OAuth service did not redirect' })
})
