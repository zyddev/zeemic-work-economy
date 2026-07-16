import type { Job } from '~/types'
import { ZM_JOBS } from '~/data'

function normalize(p: any): Job {
  const city    = p.city    ?? ''
  const country = p.country ?? ''
  const location = city && country ? `${city}, ${country}` : city || country

  const user = p.user
  const recruiter = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : (p.business?.name ?? '')

  return {
    id:             p.id ?? '',
    title:          p.title ?? '',
    company:        p.business?.name ?? p.businessName ?? '',
    location,
    type:           p.jobType ?? p.type ?? p.postType ?? '',
    salary:         p.salary ?? p.salaryRange ?? '',
    deadline:       p.deadline ?? '',
    recruiter,
    posted:         p.createdAt ?? p.posted ?? '',
    externalLink:   p.externalLink ?? false,
    applicationUrl: p.applicationUrl ?? p.application_url ?? '',
    businessId:     p.businessId ?? p.business?.id ?? '',
  }
}

interface JobsPage { jobs: Job[]; cursor?: string; hasMore: boolean }

function extractPage(res: any): JobsPage {
  const body = res?.data ?? res
  const raw = body?.jobs ?? (Array.isArray(body) ? body : [])
  return {
    jobs: Array.isArray(raw) ? raw.map(normalize) : [],
    cursor: body?.cursor,
    hasMore: !!body?.hasMore,
  }
}

export function useMarketplaceProjects(
  params?: Ref<Record<string, any>> | undefined,
  opts?: { server?: boolean; limit?: number },
) {
  const server = opts?.server ?? true
  const limit = opts?.limit ?? 20
  const loadingMore = ref(false)

  const query = computed(() => ({ ...(params?.value ?? {}), limit }))

  const { data, pending, error, refresh } = useFetch<JobsPage>(
    '/api/job',
    {
      query,
      server,
      default: () => ({ jobs: (server ? ZM_JOBS as Job[] : []), cursor: undefined, hasMore: false }),
      transform: extractPage,
    }
  )

  const projects = computed(() => data.value?.jobs ?? [])
  const hasMore = computed(() => !!data.value?.hasMore)

  async function loadMore() {
    if (loadingMore.value || !hasMore.value || !data.value?.cursor) return
    loadingMore.value = true
    try {
      const res = await $fetch<any>('/api/job', {
        query: { ...(params?.value ?? {}), limit, cursor: data.value.cursor },
      })
      const page = extractPage(res)
      data.value = { jobs: [...(data.value?.jobs ?? []), ...page.jobs], cursor: page.cursor, hasMore: page.hasMore }
    } finally {
      loadingMore.value = false
    }
  }

  return { projects, pending, error, refresh, loadMore, hasMore, loadingMore }
}

export function useMarketplaceProject(id: Ref<string> | string) {
  const { data, pending, error } = useFetch<Job | null>(
    () => `/api/job/${unref(id)}`,
    {
      default: () => ZM_JOBS.find(j => j.id === unref(id)) ?? null,
      transform: (res: any) => {
        const p = res?.data ?? res
        return p && typeof p === 'object' ? normalize(p) : null
      },
    }
  )
  return { project: data, pending, error }
}
