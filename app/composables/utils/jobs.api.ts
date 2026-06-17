import type { JobIType, JobApplicationInfo } from '~/types'

// ---- User-side ----

export async function fetchJobsApi(params?: Record<string, unknown>) {
  const res = await $fetch<any>('/api/job', { query: params ?? { limit: 500 }, credentials: 'include' })
  const arr = res?.data?.jobs ?? res?.data ?? res?.jobs ?? res
  return Array.isArray(arr) ? arr : []
}

export async function submitJobApplicationApi(payload: JobApplicationInfo) {
  return $fetch<any>('/api/job/application', {
    method: 'POST',
    credentials: 'include',
    body: { data: payload },
  })
}

export async function updateApplicationInfoApi(username: string, payload: JobApplicationInfo) {
  return $fetch<any>(`/api/job/application/info/${username}`, {
    method: 'PUT',
    credentials: 'include',
    body: payload,
  })
}

export async function archiveJobApi(jobId: string) {
  return $fetch<any>(`/api/job/${jobId}/archive`, { method: 'POST', credentials: 'include' })
}

export async function fetchUserProfileApi(username: string) {
  return $fetch<any>(`/api/user/profile/${username}`, { credentials: 'include' })
}

export async function getJobRatingsApi(jobId: string) {
  return $fetch<any>(`/api/ratings/job/${jobId}`, { credentials: 'include' })
}

export async function submitJobRatingApi(jobId: string, stars: number, businessId?: string) {
  return $fetch<any>(`/api/ratings/job/${jobId}`, {
    method: 'POST',
    credentials: 'include',
    body: { stars, ...(businessId ? { businessId } : {}) },
  })
}

// ---- Business-side ----

export async function createJobApi(payload: JobIType, email: string) {
  return $fetch<any>('/api/job', {
    method: 'POST',
    body: { data: { ...payload, email } },
    credentials: 'include',
  })
}

export async function updateBusinessJobApi(payload: JobIType, email: string, businessId: string) {
  return $fetch<any>(`/api/business/jobs/${businessId}`, {
    method: 'PUT',
    body: { data: { ...payload, email } },
    credentials: 'include',
  })
}

export async function updateUserJobApi(job: JobIType, userEmail: string) {
  return $fetch<any>('/api/job/', {
    method: 'PUT',
    credentials: 'include',
    body: { data: job, updatedBy: userEmail },
  })
}

export async function fetchJobsForBusinessApi(businessId: string) {
  const res = await $fetch<any>(`/api/business/jobs/${businessId}`, { credentials: 'include' })
  return res?.data?.jobs ?? res?.jobs ?? []
}

export async function archiveBusinessJobApi(businessId: string, id: string, status: 'archive' | 'unarchive') {
  return $fetch<any>(`/api/business/jobs/${businessId}/${status}`, {
    method: 'PATCH',
    credentials: 'include',
    body: { data: { id } },
  })
}

export async function deleteBusinessJobApi(businessId: string, id: string) {
  return $fetch<any>(`/api/business/jobs/${businessId}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
}

export async function fetchApplicationsForBusinessApi(businessId: string) {
  const res = await $fetch<any>(`/api/business/jobs/${businessId}/applications`, { credentials: 'include' })
  return res?.data?.applications ?? res?.applications ?? []
}

export async function markApplicationReviewedApi(businessId: string, id: string) {
  return $fetch<any>(`/api/business/jobs/${businessId}/applications/mark-reviewed`, {
    method: 'POST',
    credentials: 'include',
    body: { data: { id } },
  })
}

export async function getBusinessByIdApi(businessId: string) {
  return $fetch<any>(`/api/business/account/${businessId}`, { credentials: 'include' })
}

export async function getUserBusinessListApi() {
  const res = await $fetch<any>('/api/user/businesses', { credentials: 'include' })
  return Array.isArray(res) ? res : (res?.data ?? [])
}
