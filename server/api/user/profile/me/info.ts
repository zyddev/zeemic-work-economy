import { proxyTo } from '../../../../utils/proxy'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  try {
    return await proxyTo(event, `${config.public.appUrl}/user/profile/me/info`)
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode ?? 502,
      statusMessage: err.statusMessage ?? 'Bad Gateway',
    })
  }
})
