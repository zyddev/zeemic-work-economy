import type { Skill } from '~/types'
import { ZM_SKILLS } from '~/data'

function normalize(p: any): Skill {
  return {
    id:       p.id ?? p._id ?? '',
    title:    p.title ?? p.name ?? '',
    seller:   p.seller ?? p.sellerName ?? p.seller_name ?? '',
    location: p.location ?? '',
    category: p.category ?? '',
    delivery: p.delivery ?? p.deliveryType ?? p.delivery_type ?? 'Remote',
    price:    p.price ?? null,
    unit:     p.unit ?? p.priceUnit ?? p.price_unit ?? '/hr',
    rating:   p.rating ?? p.averageRating ?? p.average_rating ?? 0,
    reviews:  p.reviews ?? p.reviewCount ?? p.review_count ?? 0,
    blurb:    p.blurb ?? p.description ?? p.excerpt ?? '',
    available: p.available ?? p.availability ?? 'Now',
    motif:    p.motif ?? 0,
    tags:     Array.isArray(p.tags) ? p.tags : [],
    isBusiness: p.isBusiness ?? p.is_business ?? false,
  }
}

function extractList(res: any): Skill[] {
  const arr = res?.data ?? res?.products ?? res?.items ?? res
  return Array.isArray(arr) ? arr.map(normalize) : []
}

export function useMarketplaceProducts(params?: Ref<Record<string, any>>) {
  const { data, pending, error, refresh } = useFetch<Skill[]>(
    '/api/marketplace/products/search',
    {
      query: params,
      default: () => ZM_SKILLS as Skill[],
      transform: extractList,
    }
  )
  return { products: data, pending, error, refresh }
}

export function useMarketplaceProduct(id: Ref<string> | string) {
  const { data, pending, error } = useFetch<Skill | null>(
    () => `/api/marketplace/products/${unref(id)}`,
    {
      default: () => ZM_SKILLS.find(s => s.id === unref(id)) ?? null,
      transform: (res: any) => {
        const p = res?.data ?? res
        return p && typeof p === 'object' ? normalize(p) : null
      },
    }
  )
  return { product: data, pending, error }
}
