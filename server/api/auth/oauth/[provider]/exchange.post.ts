import { proxyTo } from '~/server/utils/proxy'

export default defineEventHandler(async (event) => {
  const provider = getRouterParam(event, 'provider')
  const config = useRuntimeConfig()
  return proxyTo(event, `${config.public.appUrl}/auth/oauth/${provider}/exchange`)
})
