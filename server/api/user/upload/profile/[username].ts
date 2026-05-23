import { proxyRequest } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const username = getRouterParam(event, 'username') as string
  return proxyRequest(event, `${config.public.appUrl}/user/upload/profile/${username}`, {
    headers: { 'x-api-gateway': 'nuxt-proxy' },
  })
})
