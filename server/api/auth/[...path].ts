export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const appUrl = config.public.appUrl as string
  const segments = getRouterParam(event, 'path') ?? ''
  console.log('[auth proxy] appUrl:', appUrl, '| target:', `${appUrl}/auth/${segments}`)
  const query = getQuery(event)

  const queryString = new URLSearchParams(
    Object.entries(query).flatMap(([k, v]) =>
      Array.isArray(v) ? v.map((val) => [k, String(val)]) : [[k, String(v ?? '')]]
    )
  ).toString()

  const base = `${appUrl}/auth/${segments}`

  const url = queryString ? `${base}?${queryString}` : base

  const method = getMethod(event)
  const hasBody = !['GET', 'HEAD'].includes(method.toUpperCase())
  const body = hasBody ? await readBody(event) : undefined

  let response: Awaited<ReturnType<typeof $fetch.raw>>
  try {
    response = await $fetch.raw(url, {
      method: method as any,
      headers: buildProxyHeaders(event),
      body,
      ignoreResponseError: true,
    })
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'Bad Gateway' })
  }

  event.node.res.statusCode = response.status

  const setCookieHeaders = response.headers.getSetCookie?.() ?? []
  for (const cookie of setCookieHeaders) {
    appendHeader(event, 'set-cookie', stripCookieDomain(cookie))
  }

  const contentType = response.headers.get('content-type')
  if (contentType) {
    setHeader(event, 'content-type', contentType)
  }

  if (!response.ok) {
    let message = response.statusText
    try {
      const data = response._data as Record<string, any>
      message = data?.message ?? data?.statusMessage ?? data?.error ?? response.statusText
    } catch {
      // keep statusText fallback
    }
    throw createError({ statusCode: response.status, statusMessage: message })
  }

  return response._data
})
