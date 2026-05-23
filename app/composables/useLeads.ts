import type { Lead } from '~/types'
import { ZM_LEADS } from '~/data'

function normalize(l: any): Lead {
  return {
    id:       l.id ?? l._id ?? '',
    type:     l.type ?? 'lead',
    status:   l.status ?? 'new',
    skill:    l.skill ?? l.skillTitle ?? l.skill_title ?? l.productTitle ?? l.product_title ?? '',
    fromName: l.fromName ?? l.from_name ?? l.senderName ?? l.sender_name ?? l.clientName ?? l.client_name ?? '',
    contact:  l.contact ?? undefined,
    email:    l.email ?? undefined,
    phone:    l.phone ?? undefined,
    when:     l.when ?? l.createdAt ?? l.created_at ?? '',
    dates:    l.dates ?? undefined,
    budget:   l.budget ?? undefined,
    timeline: l.timeline ?? undefined,
    message:  l.message ?? l.body ?? l.description ?? undefined,
  }
}

export function useLeads(params?: Ref<Record<string, any>>) {
  const { data, pending, error, refresh } = useFetch<Lead[]>(
    '/api/marketplace/leads',
    {
      query: params,
      default: () => ZM_LEADS as Lead[],
      transform: (res: any) => {
        const arr = res?.data ?? res?.leads ?? res?.items ?? res
        return Array.isArray(arr) ? arr.map(normalize) : []
      },
    }
  )
  return { leads: data, pending, error, refresh }
}
