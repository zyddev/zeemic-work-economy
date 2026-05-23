// Module-level cache survives SPA navigation within a tab session
const _cache = new Map<string, unknown>()

export function useStaticData<T = unknown>(resource: string) {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const pending = ref(false)

  onMounted(async () => {
    if (_cache.has(resource)) {
      data.value = _cache.get(resource) as T
      return
    }
    pending.value = true
    try {
      const result = await $fetch<T>(`/api/resource/${resource}`)
      _cache.set(resource, result)
      data.value = result
    } catch (e) {
      error.value = e as Error
    } finally {
      pending.value = false
    }
  })

  return { data, error, pending }
}
