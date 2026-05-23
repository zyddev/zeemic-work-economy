import { proxyTo } from '../../../utils/proxy'
import { encryptParam } from '../../../utils/crypto'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const segments = getRouterParam(event, 'path') as string
  const query = { ...getQuery(event) } as Record<string, string>

  if (query.category) {
    query.category = await encryptParam(query.category, config.cryptoSecret)
  }

  return proxyTo(event, `${config.public.appUrl}/user/admin/${segments}`, { query })
})
