import type { Job } from '~/types'
import { fetchJobsForBusinessApi } from '~/composables/utils/jobs.api'
import { normalizeJob } from '~/composables/useJobs'

export function useBusinessJobs(businessId: Ref<string> | string) {
  const jobs = ref<Job[]>([])
  const pending = ref(false)
  const error = ref<string | null>(null)

  async function load() {
    const id = unref(businessId)
    if (!id) {
      jobs.value = []
      return
    }
    pending.value = true
    error.value = null
    try {
      const raw = await fetchJobsForBusinessApi(id)
      jobs.value = Array.isArray(raw) ? raw.map(normalizeJob) : []
    } catch (e: any) {
      error.value = e?.data?.message ?? e?.message ?? 'Failed to load jobs'
      jobs.value = []
    } finally {
      pending.value = false
    }
  }

  if (isRef(businessId)) {
    watch(businessId, load, { immediate: true })
  } else {
    load()
  }

  return { jobs, pending, error, refresh: load }
}
