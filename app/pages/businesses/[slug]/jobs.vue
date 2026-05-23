<script setup lang="ts">
import type { Job } from '~/types'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { store: business, pending: bizPending } = useMarketplaceStore(slug)
useHead(() => ({ title: `Jobs at ${business.value?.name ?? 'Business'} — Zeemic` }))

const businessId = computed(() => (business.value as any)?.id ?? '')
const { projects: allJobsRaw, pending: jobsPending } = useMarketplaceProjects(undefined, { server: false })
const jobs = computed(() =>
  businessId.value
    ? (allJobsRaw.value ?? []).filter((j: Job) => j.businessId === businessId.value)
    : []
)

const PALETTE = ['#1A4D3A', '#11211A', '#7A4E2D', '#1E4B68', '#6B3A6B', '#2B7A4B']
const bannerColor = computed(() => {
  const name = business.value?.name ?? ''
  return PALETTE[(name.charCodeAt(0) + name.length) % PALETTE.length]
})

const pending = computed(() => bizPending.value || jobsPending.value)
const { isMobile, isTablet } = useBreakpoint()
</script>

<template>
  <div class="zm-root" style="background:var(--zm-paper);min-height:100vh">
    <ZmHeader active="exchange" />

    <!-- Header -->
    <div :style="{ padding: isMobile ? '24px 16px 16px' : '40px 80px 24px', borderBottom: '1px solid var(--zm-border)' }">

      <!-- Breadcrumb -->
      <div :style="{ display: 'flex', gap: '6px', font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', alignItems: 'center', marginBottom: '24px' }">
        <NuxtLink to="/exchange" style="text-decoration:none;color:inherit">Exchange</NuxtLink>
        <ZmIcon name="chevron_right" :size="13" color="var(--zm-fg-muted)" />
        <NuxtLink to="/businesses" style="text-decoration:none;color:inherit">Businesses</NuxtLink>
        <ZmIcon name="chevron_right" :size="13" color="var(--zm-fg-muted)" />
        <NuxtLink :to="`/businesses/${slug}`" style="text-decoration:none;color:inherit">{{ business?.name ?? slug }}</NuxtLink>
        <ZmIcon name="chevron_right" :size="13" color="var(--zm-fg-muted)" />
        <span :style="{ color: 'var(--zm-ink-950)' }">Open roles</span>
      </div>

      <!-- Title row -->
      <ZmSkeleton v-if="bizPending" :height="80" radius="var(--zm-r-lg)" :width="400" />
      <template v-else-if="business">
        <div :style="{ display: 'flex', alignItems: 'center', gap: '20px' }">
          <div :style="{
            width: '64px', height: '64px', borderRadius: 'var(--zm-r-lg)',
            background: bannerColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--zm-font-display)', fontSize: '36px', color: 'var(--zm-paper)',
            letterSpacing: '-0.04em', flexShrink: '0',
          }">{{ business.name[0] }}</div>
          <div>
            <div class="zm-eyebrow">
              <NuxtLink :to="`/businesses/${slug}`" style="text-decoration:none;color:inherit">{{ business.name }}</NuxtLink>
            </div>
            <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '52px', lineHeight: '1', letterSpacing: '-0.03em', margin: '6px 0 0' }">
              Open roles
            </h1>
          </div>
          <div style="flex:1" />
          <NuxtLink :to="`/businesses/${slug}`" style="text-decoration:none">
            <ZmButton variant="secondary" icon="building">Back to profile</ZmButton>
          </NuxtLink>
        </div>
        <p :style="{ font: '400 16px var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '16px 0 0' }">
          {{ jobs.length }} open {{ jobs.length === 1 ? 'role' : 'roles' }} at {{ business.name }}
        </p>
      </template>
    </div>

    <!-- Filter bar (mirrors /jobs page) -->
    <div :style="{ position: 'sticky', top: '64px', zIndex: '20', background: 'rgba(245,241,232,0.92)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--zm-border)', padding: isMobile ? '12px 16px' : '14px 80px', display: 'flex', alignItems: 'center', gap: '8px' }">
      <ZmChip icon-right="chevron_down">Type</ZmChip>
      <ZmChip icon-right="chevron_down">Location</ZmChip>
      <ZmChip icon-right="chevron_down">Salary</ZmChip>
      <ZmChip icon-right="chevron_down">Deadline</ZmChip>
      <span style="flex:1" />
      <ZmChip tone="subtle" icon="sort" icon-right="chevron_down">Sort: Newest</ZmChip>
    </div>

    <!-- Jobs grid -->
    <div :style="{ padding: isMobile ? '16px' : '0 80px 80px' }">
      <!-- Jobs / Loading -->
      <div v-if="pending || jobs.length" :style="{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: '20px' }">
        <template v-if="pending">
          <CardsJobCard v-for="i in 6" :key="i" :loading="true" />
        </template>
        <template v-else>
          <CardsJobCard v-for="j in jobs" :key="j.id" :job="j" />
        </template>
      </div>

      <!-- Empty -->
      <div v-else :style="{ padding: '80px 0', textAlign: 'center' }">
        <div :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '40px', lineHeight: '1', marginBottom: '12px' }">No open roles</div>
        <p :style="{ font: '400 16px var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0 0 24px' }">
          {{ business?.name ?? 'This business' }} has no active job listings right now.
        </p>
        <div :style="{ display: 'flex', gap: '12px', justifyContent: 'center' }">
          <NuxtLink :to="`/businesses/${slug}`" style="text-decoration:none">
            <ZmButton variant="secondary" icon="building">Back to profile</ZmButton>
          </NuxtLink>
          <NuxtLink to="/jobs" style="text-decoration:none">
            <ZmButton variant="dark" icon-right="arrow_right">Browse all jobs</ZmButton>
          </NuxtLink>
        </div>
      </div>
    </div>

    <ExchangeAppFooter />
  </div>
</template>
