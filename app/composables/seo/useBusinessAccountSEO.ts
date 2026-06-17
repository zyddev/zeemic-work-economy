const SITE_URL = 'https://zeemic.com'

export function useBusinessAccountSEO() {
  function applySEO() {
    useSeoMeta({
      title: 'Business Account — Zeemic',
      description: 'Manage or create your Zeemic business workspace to post jobs, manage your team, and grow your brand.',
      ogTitle: 'Business Account — Zeemic',
      ogDescription: 'Access your Zeemic business workspace.',
      ogType: 'website',
    })

    if (typeof document !== 'undefined') {
      injectJsonLd('zm-biz-account-breadcrumb', {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Business', item: `${SITE_URL}/business` },
          { '@type': 'ListItem', position: 3, name: 'Account', item: `${SITE_URL}/business/account` },
        ],
      })
    }
  }

  return { applySEO }
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
