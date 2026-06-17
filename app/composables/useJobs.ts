import type { Job, JobIType } from '~/types'
import {
  fetchJobsApi,
  createJobApi,
  updateUserJobApi,
  archiveJobApi,
} from '~/composables/utils/jobs.api'
import { ZM_JOBS } from '~/data'

function normalizeJob(p: any): Job {
  const city = p.city ?? ''
  const country = p.country ?? ''
  const location = city && country ? `${city}, ${country}` : city || country || p.location || ''
  const user = p.user
  const recruiter = user
    ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
    : (p.business?.name ?? '')

  return {
    id:             p.id ?? '',
    title:          p.title ?? '',
    company:        p.business?.name ?? p.businessName ?? p.company ?? '',
    location,
    type:           p.jobType ?? p.type ?? p.postType ?? '',
    salary:         p.salary ?? (p.minSalary && p.maxSalary ? `${p.currency ?? ''} ${p.minSalary}–${p.maxSalary}`.trim() : ''),
    deadline:       p.deadline ?? '',
    recruiter,
    posted:         p.createdAt ?? p.posted ?? '',
    externalLink:   !!(p.applicationUrl && !p.applicationEmail),
    applicationUrl: p.applicationUrl ?? '',
    businessId:     p.businessId ?? p.business?.id ?? '',
  }
}

export function useJobs() {
  const jobs = ref<Job[]>(ZM_JOBS as Job[])
  const loading = ref(false)
  const processing = ref(false)
  const error = ref<string | null>(null)

  async function fetchJobs(params?: Record<string, unknown>) {
    loading.value = true
    error.value = null
    try {
      const raw = await fetchJobsApi(params)
      jobs.value = Array.isArray(raw) ? raw.map(normalizeJob) : ZM_JOBS as Job[]
    } catch (e: any) {
      error.value = e?.data?.message ?? e?.message ?? 'Failed to fetch jobs'
      jobs.value = ZM_JOBS as Job[]
    } finally {
      loading.value = false
    }
  }

  async function createJob(payload: JobIType, email: string) {
    processing.value = true
    error.value = null
    try {
      const res = await createJobApi(payload, email)
      await fetchJobs()
      return res
    } catch (e: any) {
      error.value = e?.data?.message ?? e?.message ?? 'Failed to create job'
      throw e
    } finally {
      processing.value = false
    }
  }

  async function updateJob(payload: JobIType, email: string) {
    processing.value = true
    error.value = null
    try {
      const res = await updateUserJobApi(payload, email)
      await fetchJobs()
      return res
    } catch (e: any) {
      error.value = e?.data?.message ?? e?.message ?? 'Failed to update job'
      throw e
    } finally {
      processing.value = false
    }
  }

  async function archiveJob(id: string) {
    processing.value = true
    try {
      const res = await archiveJobApi(id)
      await fetchJobs()
      return res
    } catch (e: any) {
      error.value = e?.data?.message ?? e?.message ?? 'Failed to archive job'
      throw e
    } finally {
      processing.value = false
    }
  }

  return { jobs, loading, processing, error, fetchJobs, createJob, updateJob, archiveJob }
}
