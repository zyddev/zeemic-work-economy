import type { JobIType, UserBusinessMembership } from '~/types'
import {
  getBusinessByIdApi,
  getUserBusinessListApi,
  updateBusinessJobApi,
  fetchJobsForBusinessApi,
  archiveBusinessJobApi,
  deleteBusinessJobApi,
  fetchApplicationsForBusinessApi,
  markApplicationReviewedApi,
} from '~/composables/utils/jobs.api'

export function useBusinessAccountComponents() {
  const components = new Map([
    ['jobs',  defineAsyncComponent(() => import('~/components/templates/jobs/jobs.vue'))],
    ['posts', defineAsyncComponent(() => import('~/components/templates/posts.vue'))],
    ['users', defineAsyncComponent(() => import('~/components/templates/users/users.vue'))],
    ['brand', defineAsyncComponent(() => import('~/components/templates/brand.vue'))],
  ])

  function getComponent(key: string) {
    return components.get(key) ?? null
  }

  return { getComponent }
}

export function useBusinessAccount() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const businesses = ref<UserBusinessMembership[]>([])

  const { isAuthenticated, user } = storeToRefs(useAuthStore())
  const route = useRoute()

  async function authBusiness() {
    if (!isAuthenticated.value) {
      return navigateTo('/login?next=' + encodeURIComponent(route.fullPath))
    }
    const bizId = user.value?.defaultBusinessId
    if (bizId) return navigateTo(`/b/${bizId}`)
    return navigateTo('/business/account')
  }

  async function getUserBusinessList() {
    if (!isAuthenticated.value) return []
    loading.value = true
    try {
      const res = await getUserBusinessListApi()
      businesses.value = res
      return res as UserBusinessMembership[]
    } catch (e: any) {
      error.value = e?.data?.message ?? e?.message ?? 'Failed to load businesses'
      return []
    } finally {
      loading.value = false
    }
  }

  async function getBusinessList() {
    loading.value = true
    try {
      const res = await $fetch<any>('/api/business', { credentials: 'include' })
      return res?.data ?? res ?? []
    } catch (e: any) {
      error.value = e?.data?.message ?? e?.message ?? 'Failed to load businesses'
      return []
    } finally {
      loading.value = false
    }
  }

  async function getBusinessById(id: string) {
    loading.value = true
    try {
      const res = await getBusinessByIdApi(id)
      return res?.data ?? res
    } catch (e: any) {
      error.value = e?.data?.message ?? e?.message ?? 'Failed to load business'
      return null
    } finally {
      loading.value = false
    }
  }

  async function getBusinessBySlug(slug: string) {
    loading.value = true
    try {
      const res = await $fetch<any>(`/api/business/${slug}`, { credentials: 'include' })
      return res?.data ?? res
    } catch (e: any) {
      error.value = e?.data?.message ?? e?.message ?? 'Failed to load business'
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateBusinessJobPost(payload: JobIType, email: string, businessId: string) {
    loading.value = true
    error.value = null
    try {
      return await updateBusinessJobApi(payload, email, businessId)
    } catch (e: any) {
      error.value = e?.data?.message ?? e?.message ?? 'Failed to update job'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchJobsForBusiness(businessId: string) {
    loading.value = true
    error.value = null
    try {
      return await fetchJobsForBusinessApi(businessId)
    } catch (e: any) {
      error.value = e?.data?.message ?? e?.message ?? 'Failed to load jobs'
      return []
    } finally {
      loading.value = false
    }
  }

  async function archiveJob(businessId: string, id: string, status: 'archive' | 'unarchive') {
    loading.value = true
    error.value = null
    try {
      return await archiveBusinessJobApi(businessId, id, status)
    } catch (e: any) {
      error.value = e?.data?.message ?? e?.message ?? 'Failed to update job status'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteJob(businessId: string, id: string) {
    loading.value = true
    error.value = null
    try {
      return await deleteBusinessJobApi(businessId, id)
    } catch (e: any) {
      error.value = e?.data?.message ?? e?.message ?? 'Failed to delete job'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchApplicationsForBusiness(businessId: string) {
    loading.value = true
    try {
      return await fetchApplicationsForBusinessApi(businessId)
    } catch (e: any) {
      error.value = e?.data?.message ?? e?.message ?? 'Failed to load applications'
      return []
    } finally {
      loading.value = false
    }
  }

  async function markApplicationReviewed(businessId: string, id: string) {
    try {
      return await markApplicationReviewedApi(businessId, id)
    } catch (e: any) {
      error.value = e?.data?.message ?? e?.message ?? 'Failed to mark reviewed'
      throw e
    }
  }

  return {
    loading,
    error,
    businesses,
    authBusiness,
    getUserBusinessList,
    getBusinessList,
    getBusinessById,
    getBusinessBySlug,
    updateBusinessJobPost,
    fetchJobsForBusiness,
    archiveJob,
    deleteJob,
    fetchApplicationsForBusiness,
    markApplicationReviewed,
  }
}
