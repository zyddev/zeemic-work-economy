import type { Skill } from '~/types'
import { ZM_SKILLS } from '~/data'

export function useMarketplaceRecommended() {
  const { data, pending, error, refresh } = useFetch<Skill[]>(
    '/api/marketplace/recommended/personalized',
    {
      default: () => ZM_SKILLS.slice(0, 4) as Skill[],
      transform: (res: any) => {
        const arr = res?.data ?? res?.items ?? res
        if (!Array.isArray(arr)) return ZM_SKILLS.slice(0, 4)
        return arr.map((p: any) => ({
          id:        p.id ?? p._id ?? '',
          title:     p.title ?? p.name ?? '',
          seller:    p.seller ?? p.sellerName ?? p.seller_name ?? '',
          location:  p.location ?? '',
          category:  p.category ?? '',
          delivery:  p.delivery ?? 'Remote',
          price:     p.price ?? null,
          unit:      p.unit ?? '/hr',
          rating:    p.rating ?? 0,
          reviews:   p.reviews ?? 0,
          blurb:     p.blurb ?? p.description ?? '',
          available: p.available ?? 'Now',
          motif:     p.motif ?? 0,
          tags:      Array.isArray(p.tags) ? p.tags : [],
          isBusiness: p.isBusiness ?? false,
        }))
      },
    }
  )
  return { recommended: data, pending, error, refresh }
}
