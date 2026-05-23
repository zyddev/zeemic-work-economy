import type { Recruiter } from '~/types'
import { ZM_RECRUITERS } from '~/data'

function normalize(p: any): Recruiter {
  return {
    id:          p.id ?? p._id ?? '',
    name:        p.name ?? p.fullName ?? p.full_name ?? '',
    title:       p.title ?? p.jobTitle ?? p.job_title ?? '',
    business:    p.business ?? p.company ?? p.businessName ?? p.business_name ?? '',
    location:    p.location ?? '',
    specialties: Array.isArray(p.specialties) ? p.specialties : [],
    placements:  p.placements ?? p.placementCount ?? p.placement_count ?? 0,
    rating:      p.rating ?? p.averageRating ?? p.average_rating ?? 0,
    reviews:     p.reviews ?? p.reviewCount ?? p.review_count ?? 0,
    response:    p.response ?? p.responseTime ?? p.response_time ?? '< 24hr',
    languages:   Array.isArray(p.languages) ? p.languages : ['EN'],
    quote:       p.quote ?? p.bio ?? p.summary ?? '',
  }
}

function extractList(res: any): Recruiter[] {
  const arr = res?.data ?? res?.portfolios ?? res?.items ?? res
  return Array.isArray(arr) ? arr.map(normalize) : []
}

export function useMarketplacePortfolios(params?: Ref<Record<string, any>>) {
  const { data, pending, error, refresh } = useFetch<Recruiter[]>(
    '/api/marketplace/portfolios/search',
    {
      query: params,
      default: () => ZM_RECRUITERS as Recruiter[],
      transform: extractList,
    }
  )
  return { portfolios: data, pending, error, refresh }
}

export function useMarketplacePortfolio(id: Ref<string> | string) {
  const { data, pending, error } = useFetch<Recruiter | null>(
    () => `/api/marketplace/portfolios/${unref(id)}`,
    {
      default: () => ZM_RECRUITERS.find(r => r.id === unref(id)) ?? null,
      transform: (res: any) => {
        const p = res?.data ?? res
        return p && typeof p === 'object' ? normalize(p) : null
      },
    }
  )
  return { portfolio: data, pending, error }
}
