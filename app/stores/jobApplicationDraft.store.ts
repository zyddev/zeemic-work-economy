import type { JobApplicationDraft } from '~/types'

const DRAFT_KEY = 'zm_job_application_draft'

export const useJobApplicationDraftStore = defineStore('jobApplicationDraft', () => {
  const draft = ref<JobApplicationDraft | null>(null)
  const hasDraft = computed(() => draft.value !== null)

  function saveDraft(d: Omit<JobApplicationDraft, 'lastSavedAt'>) {
    draft.value = { ...d, lastSavedAt: Date.now() }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft.value))
    }
  }

  function loadDraft() {
    if (typeof localStorage === 'undefined') return
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (raw) draft.value = JSON.parse(raw) as JobApplicationDraft
    } catch {
      // ignore
    }
  }

  function clearDraft() {
    draft.value = null
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(DRAFT_KEY)
    }
  }

  return { draft, hasDraft, saveDraft, loadDraft, clearDraft }
})
