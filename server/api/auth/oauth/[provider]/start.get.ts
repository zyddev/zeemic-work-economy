import { request as httpReq } from 'node:http'
import { request as httpsReq } from 'node:https'
import { URL as NodeURL } from 'node:url'
import { buildProxyHeaders, stripCookieDomain } from '~/server/utils/proxy'

interface BackendFirstHop {
  statusCode: number
  location?: string
  setCookies: string[]
  body: string
}

function fetchFirstHop(url: string, headers: Record<string, string>): Promise<BackendFirstHop> {
  return new Promise((resolve, reject) => {
    const parsed = new NodeURL(url)
    const fn = parsed.protocol === 'https:' ? httpsReq : httpReq
    const req = fn(
      {
        hostname: parsed.hostname,
        port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
        path: parsed.pathname + parsed.search,
        method: 'GET',
        headers,
      },
      (res) => {
        let body = ''
        res.on('data', (chunk: Buffer) => { body += chunk.toString() })
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode ?? 0,
            location: res.headers.location as string | undefined,
            setCookies: (res.headers['set-cookie'] ?? []) as string[],
            body,
          })
        })
      },
    )
    req.on('error', reject)
    req.end()
  })
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const appUrl = config.public.appUrl as string
  const provider = getRouterParam(event, 'provider')!

  let hop: BackendFirstHop
  try {
    hop = await fetchFirstHop(
      `${appUrl}/auth/oauth/${provider}`,
      buildProxyHeaders(event) as Record<string, string>,
    )
  } catch {
    return sendRedirect(event, `/error?msg=${encodeURIComponent('OAuth service unavailable')}`, 302)
  }

  // Backend returned a redirect → forward state cookies and send the browser to the provider
  if (hop.statusCode >= 300 && hop.statusCode < 400 && hop.location) {
    for (const cookie of hop.setCookies) {
      appendHeader(event, 'set-cookie', stripCookieDomain(cookie))
    }
    return sendRedirect(event, hop.location, hop.statusCode)
  }

  // Not a redirect → provider not configured or backend error
  let message = 'OAuth sign-in is not available'
  try {
    const body = JSON.parse(hop.body) as Record<string, unknown>
    message = (body?.error ?? body?.message ?? message) as string
  } catch {}

  return sendRedirect(event, `/error?msg=${encodeURIComponent(message)}`, 302)
})
