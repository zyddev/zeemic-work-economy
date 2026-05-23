export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const name = getRouterParam(event, 'resource') as string

  if (!name || !/^[a-z0-9_-]+$/i.test(name)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid resource name' })
  }

  const cache = useStorage('cache')
  const cacheKey = `resource:${name}`
  const cached = await cache.getItem(cacheKey)
  if (cached) return cached

  let data: unknown
  try {
    data = await $fetch(`${config.public.storageUrl}/api/${name}.json`)
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'Bad Gateway' })
  }

  await cache.setItem(cacheKey, data)
  return data
})
