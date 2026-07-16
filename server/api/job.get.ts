import { proxyTo } from '../utils/proxy'
import { encryptListQuery } from '../utils/crypto'

const DEFAULT_LIMIT = 20

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event) as Record<string, string>

  const cursor = query.cursor || undefined
  const rawLimit = query.limit ? Number(query.limit) : undefined
  const limit = Number.isFinite(rawLimit) ? rawLimit : undefined

  const proxyQuery: Record<string, string> = {}
  // Only the first page can skip encryption per the backend contract — everything
  // else (a cursor, or a non-default page size) needs the encrypted query param.
  if (cursor || (limit !== undefined && limit !== DEFAULT_LIMIT)) {
    try {
      proxyQuery.data = await encryptListQuery({ cursor, limit }, config.cryptoSecret)
    } catch (err) {
      // Never let a misconfigured/invalid-length CRYPTO_SECRET crash the function —
      // degrade to the unpaginated first page instead of a hard 500.
      console.error('[api/job] failed to encrypt pagination query, falling back to first page', err)
    }
  }

  return proxyTo(event, `${config.public.appUrl}/job`, { query: proxyQuery, replaceQuery: true })
})
