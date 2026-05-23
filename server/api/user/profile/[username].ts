import { proxyTo } from '../../../utils/proxy'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const username = getRouterParam(event, 'username') as string
  return proxyTo(event, `${config.public.appUrl}/user/profile/${username}`)
})
