import {
  type H3Event,
  getRequestIP,
  getRequestHeaders,
  getQuery,
  readBody,
  appendHeader,
  setHeader,
  getMethod,
} from 'h3'

// ── Header allow-lists ───────────────────────────────────────────────────────

const FORWARDED_REQUEST_HEADERS = new Set([
  'authorization',
  'content-type',
  'accept',
  'user-agent',
  'x-requested-with',
  'cookie',
])

const FORWARDED_RESPONSE_HEADERS = new Set([
  'content-type',
  'cache-control',
])

// ── Header utilities ─────────────────────────────────────────────────────────

/**
 * Returns a sanitized header map to forward upstream.
 * Only allows the FORWARDED_REQUEST_HEADERS list.
 * Injects x-api-gateway and x-forwarded-for.
 */
export function buildProxyHeaders(event: H3Event): Record<string, string> {
  const incoming = getRequestHeaders(event)
  const out: Record<string, string> = {}

  for (const [key, val] of Object.entries(incoming)) {
    if (val && FORWARDED_REQUEST_HEADERS.has(key.toLowerCase())) {
      out[key.toLowerCase()] = val
    }
  }

  out['x-api-gateway'] = 'nuxt-proxy'
  out['x-forwarded-for'] = getRequestIP(event, { xForwardedFor: true }) ?? '127.0.0.1'

  return out
}

/**
 * Strips the Domain= attribute from a single Set-Cookie header value
 * so the browser pins the cookie to the Nuxt origin, not the upstream.
 */
export function stripCookieDomain(value: string): string {
  return value.replace(/;\s*Domain=[^;]*/gi, '')
}

// ── Core proxy function ──────────────────────────────────────────────────────

export interface ProxyOptions {
  /** Override HTTP method */
  method?: string
  /** Extra headers merged after sanitization */
  headers?: Record<string, string>
  /** Override/extend query params forwarded upstream */
  query?: Record<string, string>
}

/**
 * Proxy the current request to targetUrl.
 *
 * - Sanitizes request headers (allow-list + injected headers)
 * - Forwards query params and body
 * - Mirrors the upstream status code
 * - Forwards Set-Cookie headers with Domain= stripped
 * - On network failure: throws 502 Bad Gateway (never exposes upstream error body)
 */
export async function proxyTo(
  event: H3Event,
  targetUrl: string,
  opts: ProxyOptions = {},
): Promise<unknown> {
  const method = (opts.method ?? getMethod(event)).toUpperCase()
  const headers = { ...buildProxyHeaders(event), ...(opts.headers ?? {}) }

  // Build final URL with merged query params
  const url = new URL(targetUrl)
  const incomingQuery = getQuery(event) as Record<string, string>
  const mergedQuery = { ...incomingQuery, ...(opts.query ?? {}) }
  for (const [k, v] of Object.entries(mergedQuery)) {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v))
  }

  // Read body for mutating methods
  let body: string | undefined
  if (!['GET', 'HEAD'].includes(method)) {
    try {
      const raw = await readBody(event)
      if (raw !== undefined && raw !== null) {
        body = typeof raw === 'string' ? raw : JSON.stringify(raw)
        headers['content-type'] ??= 'application/json'
      }
    } catch {
      // Empty or already-consumed body — proceed without it
    }
  }

  let response: Response
  try {
    response = await $fetch.raw(url.toString(), {
      method,
      headers,
      body,
      ignoreResponseError: true, // Don't throw on 4xx/5xx; mirror status faithfully
    } as Parameters<typeof $fetch.raw>[1])
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'Bad Gateway' })
  }

  // Mirror upstream status code
  event.node.res.statusCode = response.status

  // Pipe Set-Cookie headers (domain stripped) — use appendHeader because there
  // can be multiple Set-Cookie values and setHeader would overwrite them
  const cookies = response.headers.getSetCookie?.() ?? []
  for (const cookie of cookies) {
    appendHeader(event, 'set-cookie', stripCookieDomain(cookie))
  }

  // Pipe safe response headers
  for (const [key, val] of response.headers.entries()) {
    if (FORWARDED_RESPONSE_HEADERS.has(key.toLowerCase())) {
      setHeader(event, key, val)
    }
  }

  // Throw a clean h3 error for non-2xx — never forward the raw upstream body
  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: response.statusText || 'Upstream Error',
    })
  }

  return response._data
}
