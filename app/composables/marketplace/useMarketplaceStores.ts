import type { Business } from '~/types'
import { ZM_BUSINESSES } from '~/data'

function normalize(s: any): Business {
  return {
    id:               s.id               ?? '',
    slug:             s.slug             ?? '',
    name:             s.name             ?? s.businessName ?? '',
    tag:              s.category         ?? s.industry     ?? s.tagline ?? '',
    location:         s.location         ?? s.city         ?? '',
    members:          Array.isArray(s.members) ? s.members.length : (s.memberCount ?? s.teamSize ?? 0),
    listings:         s.listings         ?? s.listingCount ?? 0,
    rating:           s.rating           ?? s.averageRating ?? 0,
    website:          s.website          ?? '',
    description:      typeof s.description === 'string' ? s.description : '',
    shortDescription: s.shortDescription ?? s.short_description ?? '',
  }
}

function extractList(res: any): Business[] {
  const arr = res?.data?.businesses ?? res?.data ?? res?.businesses ?? res?.items ?? res
  return Array.isArray(arr) ? arr.map(normalize) : []
}

export function useMarketplaceStores(params?: Ref<Record<string, any>>) {
  const { data, pending, error, refresh } = useFetch<Business[]>(
    '/api/business',
    {
      query: params,
      default: () => (ZM_BUSINESSES as any[]).map(normalize),
      transform: extractList,
    }
  )
  return { stores: data, pending, error, refresh }
}

export function useMarketplaceStore(slug: Ref<string> | string) {
  const { data, pending, error } = useFetch<Business | null>(
    () => `/api/business/${unref(slug)}`,
    {
      default: () => null,
      transform: (res: any) => {
        const s = res?.data ?? res
        return s && typeof s === 'object' ? normalize(s) : null
      },
    }
  )
  return { store: data, pending, error }
}
