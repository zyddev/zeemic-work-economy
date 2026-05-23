import { proxyTo } from '../utils/proxy'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const raw = getRouterParam(event, 'path') as string
  const path = decodeURIComponent(raw ?? '')

  if (!path || /\.\.|^\/|:\/\//.test(path)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid path' })
  }

  return proxyTo(event, `${config.public.appUrl}/${path}`)
})
