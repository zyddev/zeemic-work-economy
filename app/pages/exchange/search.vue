<script setup lang="ts">
useHead({ title: 'Search — Zeemic' })
const { isMobile } = useBreakpoint()
const router = useRouter()
const recentSearches = [
  { query: 'UX research', type: 'Skills' },
  { query: 'Senior designer Berlin', type: 'Jobs' },
  { query: 'Jane Smith', type: 'Recruiters' },
]
const trending = ['Brand sprints', 'Financial modelling', 'Series A roles', 'Remote design', 'SAP']
const browse = [
  { icon: 'wrench', title: 'Skills', subtitle: '12,840 listed', href: '/skills' },
  { icon: 'users', title: 'Recruiters', subtitle: '3,421', href: '/recruiters' },
  { icon: 'briefcase', title: 'Jobs', subtitle: '8,140 active', href: '/jobs' },
  { icon: 'building', title: 'Businesses', subtitle: '2,180 verified', href: '/businesses' },
]
</script>
<template>
  <div style="background:var(--zm-paper);min-height:100vh">
    <!-- Mobile native -->
    <template v-if="isMobile">
      <ZmMNavBar :back="true" leftLabel="Cancel" @back="router.back()" />
      <div :style="{ padding: '0 16px 12px' }">
        <ZmSearch placeholder="Skills, jobs, recruiters…" size="lg" />
      </div>
      <div :style="{ flex: 1, overflowY: 'auto' }">
        <ZmMSectionHead>Recent searches</ZmMSectionHead>
        <div :style="{ background: 'var(--zm-white)' }">
          <ZmMListRow v-for="(s, i) in recentSearches" :key="s.query" icon="search" :title="s.query" :subtitle="s.type" :last="i === recentSearches.length - 1" />
        </div>
        <ZmMSectionHead>Trending</ZmMSectionHead>
        <div :style="{ padding: '0 16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }">
          <ZmChip v-for="t in trending" :key="t" tone="subtle">{{ t }}</ZmChip>
        </div>
        <ZmMSectionHead>Browse all</ZmMSectionHead>
        <div :style="{ background: 'var(--zm-white)' }">
          <ZmMListRow v-for="(b, i) in browse" :key="b.title" :icon="b.icon" :title="b.title" :subtitle="b.subtitle" :last="i === browse.length - 1" @click="router.push(b.href)" />
        </div>
      </div>
    </template>
    <!-- Desktop: redirect to exchange with search focus -->
    <template v-else>
      <ZmHeader active="exchange" />
      <div :style="{ padding: '80px', textAlign: 'center' }">
        <ZmSearch placeholder="Search the marketplace…" size="lg" style="max-width:720px;margin:0 auto" />
      </div>
      <ExchangeAppFooter />
    </template>
  </div>
</template>
