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

function extractList(res: any): Job[] {
  const arr = res?.data?.jobs ?? res?.data ?? res?.jobs ?? res?.items ?? res
  return Array.isArray(arr) ? arr.map(normalize) : []
}

export function useMarketplaceProjects(params?: Ref<Record<string, any>> | undefined, opts?: { server?: boolean }) {
  const server = opts?.server ?? true
  const { data, pending, error, refresh } = useFetch<Job[]>(
    '/api/job',
    {
      query: params,
      server,
      default: () => (server ? ZM_JOBS as Job[] : []),
      transform: extractList,
    }
  )
  return { projects: data, pending, error, refresh }
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
