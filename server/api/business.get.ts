import { proxyTo } from '../utils/proxy'
import { encryptListQuery } from '../utils/crypto'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event) as Record<string, string>

  const cursor = query.cursor || undefined
  const rawLimit = query.limit ? Number(query.limit) : undefined
  const limit = Number.isFinite(rawLimit) ? rawLimit : undefined

  const proxyQuery: Record<string, string> = {}
  if (cursor || limit !== undefined) {
    proxyQuery.data = await encryptListQuery({ cursor, limit }, config.cryptoSecret)
  }

  return proxyTo(event, `${config.public.appUrl}/business`, { query: proxyQuery, replaceQuery: true })
})
