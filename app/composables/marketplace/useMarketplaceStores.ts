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

interface BusinessesPage { businesses: Business[]; cursor?: string; hasMore: boolean }

function extractPage(res: any): BusinessesPage {
  const body = res?.data ?? res
  const raw = body?.businesses ?? (Array.isArray(body) ? body : [])
  return {
    businesses: Array.isArray(raw) ? raw.map(normalize) : [],
    cursor: body?.cursor,
    hasMore: !!body?.hasMore,
  }
}

export function useMarketplaceStores(params?: Ref<Record<string, any>>, opts?: { limit?: number }) {
  const limit = opts?.limit ?? 20
  const loadingMore = ref(false)

  const query = computed(() => ({ ...(params?.value ?? {}), limit }))

  const { data, pending, error, refresh } = useFetch<BusinessesPage>(
    '/api/business',
    {
      query,
      default: () => ({ businesses: (ZM_BUSINESSES as any[]).map(normalize), cursor: undefined, hasMore: false }),
      transform: extractPage,
    }
  )

  const stores = computed(() => data.value?.businesses ?? [])
  const hasMore = computed(() => !!data.value?.hasMore)

  async function loadMore() {
    if (loadingMore.value || !hasMore.value || !data.value?.cursor) return
    loadingMore.value = true
    try {
      const res = await $fetch<any>('/api/business', {
        query: { ...(params?.value ?? {}), limit, cursor: data.value.cursor },
      })
      const page = extractPage(res)
      data.value = { businesses: [...(data.value?.businesses ?? []), ...page.businesses], cursor: page.cursor, hasMore: page.hasMore }
    } finally {
      loadingMore.value = false
    }
  }

  return { stores, pending, error, refresh, loadMore, hasMore, loadingMore }
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
