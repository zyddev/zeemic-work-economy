import { proxyTo } from '../utils/proxy'
import { encryptParam } from '../utils/crypto'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = { ...getQuery(event) } as Record<string, string>

  for (const [k, v] of Object.entries(query)) {
    if (v) query[k] = await encryptParam(v, config.cryptoSecret)
  }

  return proxyTo(event, `${config.public.appUrl}/post`, { query })
})
