import type { Job } from '~/types'

const SITE_NAME = 'Zeemic'
const SITE_URL = 'https://zeemic.com'

export function useJobSEO() {
  function applyIndexSEO() {
    useSeoMeta({
      title: 'Jobs — Zeemic',
      description: 'Browse verified job listings on Zeemic. Each role is linked to a real, reviewable recruiter.',
      ogTitle: 'Latest roles — Zeemic Jobs',
      ogDescription: 'Find your next role. Verified recruiters, transparent applications.',
      ogType: 'website',
      twitterCard: 'summary_large_image',
    })
  }

  function applyDetailSEO(job: Job) {
    useSeoMeta({
      title: `${job.title} at ${job.company} — Zeemic`,
      description: `${job.type} · ${job.location} · Deadline ${job.deadline}`,
      ogTitle: `${job.title} — ${job.company}`,
      ogDescription: `${job.type} role at ${job.company} based in ${job.location}.`,
      ogType: 'website',
      twitterCard: 'summary_large_image',
    })
  }

  function injectIndexStructuredData(jobs: Job[]) {
    if (typeof document === 'undefined') return
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Job listings on Zeemic',
      itemListElement: jobs.map((j, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_URL}/jobs/${j.id}`,
        name: j.title,
      })),
    }
    injectJsonLd('zm-jobs-list', ld)
  }

  function injectDetailStructuredData(job: Job) {
    if (typeof document === 'undefined') return
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: job.title,
      hiringOrganization: { '@type': 'Organization', name: job.company },
      jobLocation: { '@type': 'Place', name: job.location },
      employmentType: job.type?.toUpperCase() ?? 'FULL_TIME',
      validThrough: job.deadline,
      url: `${SITE_URL}/jobs/${job.id}`,
    }
    injectJsonLd('zm-job-posting', ld)
  }

  return { applyIndexSEO, applyDetailSEO, injectIndexStructuredData, injectDetailStructuredData }
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
