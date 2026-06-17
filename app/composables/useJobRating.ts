import type { RatingRollup, MyRating } from '~/types'
import { getJobRatingsApi, submitJobRatingApi } from '~/composables/utils/jobs.api'

export function useJobRating(jobId: Ref<string> | string) {
  const rollup = ref<RatingRollup | null>(null)
  const mine = ref<MyRating | null>(null)
  const loading = ref(false)
  const submitting = ref(false)
  const rateLimited = ref(false)
  const submitError = ref(false)

  const id = computed(() => (typeof jobId === 'string' ? jobId : jobId.value))

  async function load() {
    if (!id.value) return
    loading.value = true
    try {
      const res = await getJobRatingsApi(id.value)
      rollup.value = res?.data?.rollup ?? res?.rollup ?? null
      mine.value = res?.data?.mine ?? res?.mine ?? null
    } catch {
      // ratings are non-critical — fail silently
    } finally {
      loading.value = false
    }
  }

  async function submit(stars: number, businessId?: string) {
    if (submitting.value || !id.value) return
    submitting.value = true
    rateLimited.value = false
    submitError.value = false
    try {
      await submitJobRatingApi(id.value, stars, businessId)
      mine.value = { stars }
      await load()
    } catch (e: any) {
      if (e?.status === 429) rateLimited.value = true
      else submitError.value = true
    } finally {
      submitting.value = false
    }
  }

  return { rollup, mine, loading, submitting, rateLimited, submitError, load, submit }
}
