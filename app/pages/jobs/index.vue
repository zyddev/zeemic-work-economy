<script setup lang="ts">
import type { Job } from '~/types'

const { applyIndexSEO, injectIndexStructuredData } = useJobSEO()
applyIndexSEO()

const { isMobile, isTablet } = useBreakpoint()
const { gtag } = useGtag()

// Load jobs
const { projects: allJobs, pending, refresh, loadMore, hasMore, loadingMore } = useMarketplaceProjects()

// Filters
const filters = reactive({
  country: '',
  city: '',
  jobType: '',
  industry: '',
  minSalary: '',
  maxSalary: '',
  deadline: '',
  search: '',
})

const sortOption = ref('datePosted')
const SORT_OPTIONS = [
  { value: 'datePosted', label: 'Newest First' },
  { value: 'deadlineSoonest', label: 'Deadline Soonest' },
  { value: 'salaryHigh', label: 'Salary: High to Low' },
  { value: 'salaryLow', label: 'Salary: Low to High' },
]

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Executive', 'Internship']
const INDUSTRIES = ['Technology', 'Finance', 'Design', 'Marketing', 'Engineering', 'Healthcare', 'Legal', 'Education', 'Operations', 'HR']

function selectFilter(field: string, value: string) {
  ;(filters as any)[field] = value
  gtag('event', 'job_filter_applied', { filter_field: field, filter_value: value })
}

function setSortOption(val: string) {
  sortOption.value = val
  gtag('event', 'job_sort_changed', { sort_option: val })
}

function clearFilter(field: string) {
  ;(filters as any)[field] = ''
}

const activeFilterCount = computed(() =>
  Object.values(filters).filter(Boolean).length,
)

// Filter + sort pipeline
const filteredJobs = computed<Job[]>(() => {
  let list = allJobs.value ?? []

  if (filters.search) {
    const q = filters.search.toLowerCase()
    list = list.filter(j => j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q))
  }
  if (filters.country) list = list.filter(j => j.location?.toLowerCase().includes(filters.country.toLowerCase()))
  if (filters.jobType) list = list.filter(j => j.type === filters.jobType)
  if (filters.deadline) list = list.filter(j => !j.deadline || j.deadline <= filters.deadline)

  // Sort
  if (sortOption.value === 'deadlineSoonest') {
    list = [...list].sort((a, b) => (a.deadline ?? '').localeCompare(b.deadline ?? ''))
  } else if (sortOption.value === 'datePosted') {
    list = [...list].sort((a, b) => (b.posted ?? '').localeCompare(a.posted ?? ''))
  }

  return list
})

// Infinite scroll — filters/sort apply over jobs loaded so far; scrolling near
// the bottom fetches the next server page via cursor pagination
const visibleItems = filteredJobs
const anchor = ref<HTMLElement | null>(null)
useInfiniteObserver(anchor, () => {
  if (hasMore.value) loadMore()
})

// Inject structured data after jobs load
watch(filteredJobs, (jobs) => {
  if (typeof document !== 'undefined') injectIndexStructuredData(jobs)
}, { immediate: false })

// Filter panel toggle (mobile)
const filterOpen = ref(false)

// Sort dropdown
const sortDropdownOpen = ref(false)
const sortLabel = computed(() => SORT_OPTIONS.find(o => o.value === sortOption.value)?.label ?? 'Sort')
</script>

<template>
  <div class="zm-root" :style="{ background: 'var(--zm-paper)', minHeight: '100vh' }">
    <!-- Mobile -->
    <template v-if="isMobile">
      <div :style="{ background: 'var(--zm-paper)', minHeight: '100vh', paddingBottom: '80px' }">
        <ZmMNavBar title="Jobs" leftLabel="Exchange" @back="$router.push('/exchange')">
          <template #right>
            <ZmIconButton icon="filter" :size="36" @click="filterOpen = !filterOpen" />
          </template>
        </ZmMNavBar>

        <div :style="{ padding: '12px 20px 8px' }">
          <div class="zm-eyebrow">{{ filteredJobs.length }} active jobs</div>
          <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '32px', lineHeight: '0.98', letterSpacing: '-0.025em', margin: '4px 0 0' }">Latest <em style="font-style:italic">roles.</em></h1>
        </div>

        <div :style="{ display: 'flex', gap: '8px', padding: '8px 16px', overflowX: 'auto', scrollbarWidth: 'none' }">
          <ZmChip
            v-for="type in JOB_TYPES.slice(0,4)"
            :key="type"
            :tone="filters.jobType === type ? 'accent' : undefined"
            @click="filters.jobType === type ? clearFilter('jobType') : selectFilter('jobType', type)"
          >{{ type }}</ZmChip>
        </div>

        <div :style="{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }">
          <template v-if="pending">
            <div v-for="i in 5" :key="i" :style="{ height: '110px', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', animation: 'zm-pulse 1.5s ease-in-out infinite' }" />
          </template>
          <template v-else>
            <NuxtLink
              v-for="j in visibleItems"
              :key="j.id"
              :to="`/jobs/${j.id}`"
              style="text-decoration:none;color:inherit"
            >
              <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', padding: '14px' }">
                <div :style="{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '6px' }">
                  <ZmAvatar :name="j.company" :size="32" :square="true" />
                  <div :style="{ flex: 1, minWidth: 0 }">
                    <div :style="{ font: '500 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginBottom: '2px' }">{{ j.company }}</div>
                    <div :style="{ font: '600 15px var(--zm-font-body)', color: 'var(--zm-ink-950)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">{{ j.title }}</div>
                  </div>
                  <ZmIcon name="bookmark" :size="18" color="var(--zm-fg-muted)" />
                </div>
                <div :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginBottom: '8px', marginLeft: '42px' }">{{ j.location }}</div>
                <div :style="{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginLeft: '42px' }">
                  <ZmBadge tone="emerald" size="sm">{{ j.salary }}</ZmBadge>
                  <ZmBadge size="sm">{{ j.type }}</ZmBadge>
                  <ZmBadge v-if="j.recruiter" tone="gold" size="sm">via recruiter</ZmBadge>
                </div>
              </div>
            </NuxtLink>
            <!-- Infinite scroll anchor -->
            <div ref="anchor" style="height:1px" />
            <div style="padding:16px 0">
              <ZmLoadMore :loading="loadingMore" :has-more="hasMore" :shown="filteredJobs.length" @load-more="loadMore" />
            </div>
          </template>
        </div>

        <ZmMTabBar active="exchange" />
      </div>
    </template>

    <!-- Desktop -->
    <template v-else>
      <ZmHeader active="exchange" />

      <!-- Hero header -->
      <div :style="{ padding: '40px 80px 24px', borderBottom: '1px solid var(--zm-border)' }">
        <div :style="{ display: 'flex', gap: '8px', font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginBottom: '16px' }">
          <NuxtLink to="/exchange" style="text-decoration:none;color:inherit">Exchange</NuxtLink>
          <ZmIcon name="chevron_right" :size="14" color="var(--zm-fg-muted)" />
          <span :style="{ color: 'var(--zm-ink-950)' }">Jobs</span>
        </div>
        <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }">
          <div>
            <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '64px', lineHeight: '0.98', letterSpacing: '-0.03em', margin: 0 }">
              Latest <em style="font-style:italic">roles.</em>
            </h1>
            <p :style="{ font: '400 17px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '12px', maxWidth: '600px' }">
              Each role is linked to a real, reviewable recruiter. Apply once — track every status from your dashboard.
            </p>
          </div>
          <span :style="{ font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">
            <span class="zm-num-tab" :style="{ color: 'var(--zm-ink-950)', fontWeight: '600' }">{{ filteredJobs.length }}</span> active jobs
          </span>
        </div>
      </div>

      <!-- Sticky filter bar -->
      <div :style="{
        position: 'sticky', top: '64px', zIndex: 20,
        background: 'rgba(245,241,232,0.92)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--zm-border)',
        padding: '14px 80px',
        display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap',
      }">
        <!-- Search -->
        <div style="position:relative">
          <ZmInput v-model="filters.search" placeholder="Search jobs…" icon="search" size="sm" :style="{ width: '200px' }" />
        </div>

        <!-- Type filter -->
        <div style="position:relative">
          <ZmChip
            :tone="filters.jobType ? 'accent' : undefined"
            icon-right="chevron_down"
          >{{ filters.jobType || 'Type' }}</ZmChip>
        </div>

        <!-- Active filter chips -->
        <ZmChip
          v-for="type in JOB_TYPES"
          :key="type"
          :tone="filters.jobType === type ? 'accent' : undefined"
          @click="filters.jobType === type ? clearFilter('jobType') : selectFilter('jobType', type)"
        >{{ type }}</ZmChip>

        <span style="flex:1" />

        <!-- Sort -->
        <div style="position:relative">
          <ZmChip tone="subtle" icon="sort" icon-right="chevron_down" @click="sortDropdownOpen = !sortDropdownOpen">
            Sort: {{ sortLabel }}
          </ZmChip>
          <div
            v-if="sortDropdownOpen"
            :style="{
              position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 30,
              background: 'var(--zm-white)', border: '1px solid var(--zm-border)',
              borderRadius: 'var(--zm-r-md)', boxShadow: 'var(--zm-shadow-md)',
              minWidth: '200px', overflow: 'hidden',
            }"
          >
            <button
              v-for="opt in SORT_OPTIONS"
              :key="opt.value"
              type="button"
              :style="{
                display: 'block', width: '100%', padding: '10px 14px', textAlign: 'left',
                font: `${sortOption === opt.value ? 600 : 400} 13px var(--zm-font-body)`,
                color: 'var(--zm-ink-900)', background: sortOption === opt.value ? 'var(--zm-ink-50)' : 'none',
                border: 'none', borderBottom: '1px solid var(--zm-border)', cursor: 'pointer',
              }"
              @click="setSortOption(opt.value); sortDropdownOpen = false"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <!-- Clear filters -->
        <ZmButton v-if="activeFilterCount" variant="ghost" size="sm" icon="close" @click="Object.keys(filters).forEach(k => (filters as any)[k] = '')">
          Clear ({{ activeFilterCount }})
        </ZmButton>
      </div>

      <!-- Job grid -->
      <div :style="{ padding: '32px 80px 80px' }">
        <div :style="{ display: 'grid', gridTemplateColumns: isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: '20px' }">
          <template v-if="pending">
            <CardsJobCard v-for="i in 6" :key="i" :loading="true" />
          </template>
          <template v-else>
            <CardsJobCard v-for="j in visibleItems" :key="j.id" :job="j" />
          </template>
        </div>

        <!-- Empty state -->
        <div v-if="!pending && !filteredJobs.length" style="padding:80px 0; text-align:center">
          <div :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '40px', marginBottom: '12px' }">No jobs found</div>
          <p :style="{ font: '400 16px var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0 0 20px' }">Try adjusting your filters.</p>
          <ZmButton variant="secondary" @click="Object.keys(filters).forEach(k => (filters as any)[k] = '')">Clear filters</ZmButton>
        </div>

        <!-- Infinite scroll anchor -->
        <div ref="anchor" style="height:1px; margin-top:40px" />
        <div v-if="!pending" style="padding:24px 0">
          <ZmLoadMore :loading="loadingMore" :has-more="hasMore" :shown="filteredJobs.length" @load-more="loadMore" />
        </div>
      </div>

      <ExchangeAppFooter />
    </template>
  </div>
</template>
