const SITE_URL = 'https://zeemic.com'

interface BusinessSEOParams {
  id: string
  name: string
  slug: string
  category?: string
  industry?: string
  location?: string
  shortDescription?: string
  profilePicture?: string
}

export function useBusinessSEO() {
  function applyBusinessSlugSEO(b: BusinessSEOParams) {
    const description = b.shortDescription
      ? b.shortDescription.slice(0, 155)
      : `${b.category ?? 'Business'} · ${b.location ?? 'Zeemic'}`

    useSeoMeta({
      title: `${b.name} — Zeemic`,
      description,
      ogTitle: b.name,
      ogDescription: description,
      ogImage: b.profilePicture ?? undefined,
      ogUrl: `${SITE_URL}/business/${b.slug}`,
      ogType: 'website',
      twitterCard: 'summary_large_image',
    })

    if (typeof document !== 'undefined') {
      injectJsonLd(`zm-business-${b.id}`, {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: b.name,
        description: b.shortDescription ?? '',
        image: b.profilePicture ?? '',
        address: { '@type': 'PostalAddress', addressLocality: b.location ?? '' },
        url: `${SITE_URL}/business/${b.slug}`,
      })

      injectJsonLd(`zm-biz-breadcrumb-${b.id}`, {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Businesses', item: `${SITE_URL}/businesses` },
          { '@type': 'ListItem', position: 3, name: b.name, item: `${SITE_URL}/business/${b.slug}` },
        ],
      })
    }
  }

  return { applyBusinessSlugSEO }
}

function injectJsonLd(id: string, data: object) {
  let el = document.getElementById(id) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.id = id
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}
