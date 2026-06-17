<script setup lang="ts">
import type { Job } from '~/types'

const route = useRoute()
const jobId = computed(() => route.params.id as string)

const { project: job, pending } = useMarketplaceProject(jobId)
const { isMobile } = useBreakpoint()
const router = useRouter()

const { applyDetailSEO, injectDetailStructuredData } = useJobSEO()
const { trackEvent } = useAnalyticsEvent()
const { isAuthenticated } = storeToRefs(useAuthStore())

// Apply SEO when job loads
watch(job, (j) => {
  if (!j) return
  applyDetailSEO(j)
  injectDetailStructuredData(j)
  // Track view event
  if (typeof window !== 'undefined') {
    trackEvent({ event: 'job_view', jobId: j.id, userId: useAuthStore().user?.id ?? null })
  }
}, { immediate: true })

useHead(() => ({ title: `${job.value?.title ?? 'Job'} — Zeemic Jobs` }))

// Application modal
const applyOpen = ref(false)

function handleApply() {
  if (!isAuthenticated.value) {
    navigateTo('/login')
    return
  }
  if (job.value?.externalLink && job.value?.applicationUrl) {
    window.open(job.value.applicationUrl, '_blank', 'noopener,noreferrer')
    return
  }
  applyOpen.value = true
}

// Desktop: selected job from list (for 3-col layout)
const { projects: allJobs } = useMarketplaceProjects(undefined, { server: false })
const selectedJobId = ref(jobId.value)
const selectedJob = computed(() => allJobs.value?.find((j: Job) => j.id === selectedJobId.value) ?? job.value)

// Keep URL in sync when selecting from list on desktop
function selectJob(j: Job) {
  selectedJobId.value = j.id
  router.replace({ params: { id: j.id } }, { shallow: true } as any)
}
</script>

<template>
  <div style="background:var(--zm-paper);min-height:100vh">
    <!-- Mobile: full-screen overlay -->
    <template v-if="isMobile">
      <div v-if="job" :style="{ display: 'flex', flexDirection: 'column', height: '100vh' }">
        <ZmMNavBar title="Job" leftLabel="Jobs" @back="router.push('/jobs')">
          <template #right>
            <ZmIconButton icon="bookmark" :size="36" />
          </template>
        </ZmMNavBar>
        <div :style="{ flex: 1, overflowY: 'auto', padding: '20px 20px 100px' }">
          <div :style="{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '14px' }">
            <ZmAvatar :name="job.company" :size="56" :square="true" />
            <div>
              <div :style="{ font: '600 14px var(--zm-font-body)' }">{{ job.company }}</div>
              <div :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ job.location }}</div>
            </div>
          </div>
          <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '32px', lineHeight: 1.05, letterSpacing: '-0.025em', margin: 0 }">{{ job.title }}</h1>
          <div :style="{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }">
            <ZmBadge tone="emerald" size="md">{{ job.salary }}</ZmBadge>
            <ZmBadge size="md">{{ job.type }}</ZmBadge>
            <ZmBadge v-if="job.deadline" tone="gold" size="md">Deadline · {{ job.deadline }}</ZmBadge>
          </div>
          <div :style="{ marginTop: '22px' }">
            <div class="zm-eyebrow">Overview</div>
            <p :style="{ font: '400 14px/1.55 var(--zm-font-body)', marginTop: '8px' }">
              This role at {{ job.company }} is looking for a talented {{ job.title }} to join their team.
            </p>
          </div>
          <div v-if="job.recruiter" :style="{ marginTop: '24px', padding: '14px', background: 'var(--zm-paper)', borderRadius: 'var(--zm-r-md)', border: '1px solid var(--zm-border)' }">
            <div class="zm-eyebrow">Posted via</div>
            <div :style="{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }">
              <ZmAvatar :name="job.recruiter" :size="40" />
              <div :style="{ flex: 1 }">
                <div :style="{ font: '600 14px var(--zm-font-body)' }">{{ job.recruiter }}</div>
                <div :style="{ font: '400 11.5px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">Verified recruiter</div>
              </div>
              <ZmIcon name="chevron_right" :size="16" color="var(--zm-fg-muted)" />
            </div>
          </div>
        </div>
        <ZmMStickyCTA>
          <ZmIconButton icon="message" :size="48" />
          <ZmButton variant="dark" size="lg" :full="true" icon-right="arrow_right" @click="handleApply">Apply now</ZmButton>
        </ZmMStickyCTA>
      </div>
      <div v-else :style="{ padding: '40px 20px', textAlign: 'center', color: 'var(--zm-fg-muted)' }">Loading…</div>
    </template>

    <!-- Desktop: 3-column layout -->
    <template v-else>
      <ZmHeader active="exchange" />
      <div v-if="job" :style="{ display: 'grid', gridTemplateColumns: '340px 1fr 380px', height: 'calc(100vh - 64px)' }">

        <!-- Left: job list -->
        <aside :style="{
          borderRight: '1px solid var(--zm-border)', overflowY: 'auto',
          padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px',
        }">
          <div :style="{ padding: '4px 0 12px', fontFamily: 'var(--zm-font-display)', fontSize: '22px', letterSpacing: '-0.02em' }">
            All jobs
          </div>
          <template v-if="!allJobs">
            <div v-for="i in 5" :key="i" :style="{ height: '80px', background: 'var(--zm-paper)', borderRadius: 'var(--zm-r-md)', animation: 'zm-pulse 1.5s infinite' }" />
          </template>
          <template v-else>
            <button
              v-for="j in (allJobs ?? [])"
              :key="j.id"
              type="button"
              :style="{
                display: 'block', width: '100%', textAlign: 'left', padding: '12px',
                borderRadius: 'var(--zm-r-md)', border: '1px solid',
                borderColor: selectedJobId === j.id ? 'var(--zm-ink-700)' : 'var(--zm-border)',
                background: selectedJobId === j.id ? 'var(--zm-ink-50)' : 'var(--zm-white)',
                cursor: 'pointer', transition: 'all var(--zm-d-fast)',
              }"
              @click="selectJob(j)"
            >
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px">
                <ZmAvatar :name="j.company" :size="24" :square="true" />
                <span :style="{ font: '500 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ j.company }}</span>
              </div>
              <div :style="{ font: '600 13px var(--zm-font-body)', color: 'var(--zm-ink-900)', marginBottom: '4px' }">{{ j.title }}</div>
              <div style="display:flex; gap:4px; flex-wrap:wrap">
                <ZmBadge size="sm">{{ j.type }}</ZmBadge>
                <ZmBadge size="sm" tone="emerald">{{ j.salary }}</ZmBadge>
              </div>
            </button>
          </template>
        </aside>

        <!-- Centre: job description -->
        <main :style="{ overflowY: 'auto', padding: '40px 48px' }">
          <div :style="{ display: 'flex', gap: '8px', font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginBottom: '24px' }">
            <NuxtLink to="/exchange" style="text-decoration:none;color:inherit">Exchange</NuxtLink>
            <ZmIcon name="chevron_right" :size="14" color="var(--zm-fg-muted)" />
            <NuxtLink to="/jobs" style="text-decoration:none;color:inherit">Jobs</NuxtLink>
            <ZmIcon name="chevron_right" :size="14" color="var(--zm-fg-muted)" />
            <span :style="{ color: 'var(--zm-ink-950)' }">{{ selectedJob?.title }}</span>
          </div>

          <div :style="{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '20px' }">
            <ZmAvatar :name="selectedJob?.company ?? ''" :size="64" :square="true" />
            <div>
              <div :style="{ font: '600 16px var(--zm-font-body)' }">{{ selectedJob?.company }}</div>
              <div :style="{ font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ selectedJob?.location }}</div>
            </div>
          </div>

          <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '56px', lineHeight: 1, letterSpacing: '-0.03em', margin: '0 0 16px' }">
            {{ selectedJob?.title }}
          </h1>

          <div :style="{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }">
            <ZmBadge tone="emerald">{{ selectedJob?.salary }}</ZmBadge>
            <ZmBadge>{{ selectedJob?.type }}</ZmBadge>
            <ZmBadge v-if="selectedJob?.deadline" tone="gold">Deadline · {{ selectedJob?.deadline }}</ZmBadge>
            <ZmBadge v-if="selectedJob?.recruiter">via {{ selectedJob?.recruiter }}</ZmBadge>
          </div>

          <div class="zm-eyebrow">Overview</div>
          <p :style="{ font: '400 17px/1.55 var(--zm-font-body)', marginTop: '14px', maxWidth: '720px' }">
            This role at {{ selectedJob?.company }} is looking for a talented {{ selectedJob?.title }} to join their team in {{ selectedJob?.location }}.
          </p>

          <div v-if="selectedJob?.recruiter" :style="{ marginTop: '32px', padding: '20px', background: 'var(--zm-paper)', borderRadius: 'var(--zm-r-lg)', border: '1px solid var(--zm-border)', maxWidth: '480px' }">
            <div class="zm-eyebrow" style="margin-bottom:10px">Posted via</div>
            <div style="display:flex; align-items:center; gap:12px">
              <ZmAvatar :name="selectedJob.recruiter" :size="48" />
              <div>
                <div :style="{ font: '600 15px var(--zm-font-body)' }">{{ selectedJob.recruiter }}</div>
                <div :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">Verified recruiter · Zeemic</div>
              </div>
            </div>
          </div>
        </main>

        <!-- Right: detail panel -->
        <aside :style="{
          borderLeft: '1px solid var(--zm-border)', overflowY: 'auto',
          padding: '32px 28px',
        }">
          <div :style="{ position: 'sticky', top: '32px' }">
            <JobZmJobDetailPanel
              :job="selectedJob ?? job"
              :loading="pending && !selectedJob"
            />
          </div>
        </aside>
      </div>

      <div v-else-if="pending" :style="{ padding: '80px', textAlign: 'center', color: 'var(--zm-fg-muted)' }">Loading…</div>
      <ExchangeAppFooter v-else />
    </template>

    <!-- Application form (mobile + non-external jobs) -->
    <JobZmJobApplicationForm
      :open="applyOpen"
      :job-id="job?.id ?? ''"
      :job-title="job?.title ?? ''"
      :job-company="job?.company"
      @close="applyOpen = false"
      @submitted="applyOpen = false"
    />
  </div>
</template>
