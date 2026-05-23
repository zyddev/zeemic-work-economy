<script setup lang="ts">
useHead({ title: 'Jobs — Zeemic' })

const { projects: jobs, pending } = useMarketplaceProjects()
const { isMobile, isTablet } = useBreakpoint()
</script>
<template>
  <div class="zm-root" style="background:var(--zm-paper);min-height:100vh">
    <!-- Mobile -->
    <template v-if="isMobile">
      <div style="background:var(--zm-paper);min-height:100vh;padding-bottom:80px">
        <ZmMNavBar title="Jobs" leftLabel="Exchange" @back="$router.push('/exchange')">
          <template #right>
            <ZmIconButton icon="filter" :size="36" />
          </template>
        </ZmMNavBar>

        <!-- Header -->
        <div :style="{ padding: '12px 20px 8px' }">
          <div class="zm-eyebrow">{{ jobs?.length ?? 0 }} active jobs</div>
          <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '32px', lineHeight: '0.98', letterSpacing: '-0.025em', margin: '4px 0 0' }">Latest <em style="font-style:italic">roles.</em></h1>
        </div>

        <!-- Filter chips -->
        <div :style="{ display: 'flex', gap: '8px', padding: '8px 16px 8px', overflowX: 'auto', scrollbarWidth: 'none' }">
          <ZmChip tone="accent">Full-time</ZmChip>
          <ZmChip icon-right="chevron_down">Country</ZmChip>
          <ZmChip icon-right="chevron_down">Salary</ZmChip>
          <ZmChip icon-right="chevron_down" icon="users">Recruiter</ZmChip>
        </div>

        <!-- Jobs list -->
        <div :style="{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }">
          <template v-if="pending">
            <div v-for="i in 5" :key="i" :style="{ height: '110px', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', animation: 'zm-pulse 1.5s ease-in-out infinite' }" />
          </template>
          <template v-else>
            <NuxtLink
              v-for="j in (jobs ?? [])"
              :key="j.id"
              :to="`/jobs/${j.id}`"
              style="text-decoration:none;color:inherit"
            >
              <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', padding: '14px' }">
                <!-- Top row -->
                <div :style="{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '6px' }">
                  <ZmAvatar :name="j.company" :size="32" :square="true" />
                  <div :style="{ flex: 1, minWidth: 0 }">
                    <div :style="{ font: '500 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginBottom: '2px' }">{{ j.company }}</div>
                    <div :style="{ font: '600 15px var(--zm-font-body)', color: 'var(--zm-ink-950)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">{{ j.title }}</div>
                  </div>
                  <ZmIcon name="bookmark" :size="18" color="var(--zm-fg-muted)" />
                </div>
                <!-- Location -->
                <div :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginBottom: '8px', marginLeft: '42px' }">{{ j.location }}</div>
                <!-- Badges -->
                <div :style="{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginLeft: '42px' }">
                  <ZmBadge tone="emerald" size="sm">{{ j.salary }}</ZmBadge>
                  <ZmBadge size="sm">{{ j.type }}</ZmBadge>
                  <ZmBadge v-if="j.recruiter" tone="gold" size="sm">via recruiter</ZmBadge>
                </div>
              </div>
            </NuxtLink>
          </template>
        </div>

        <ZmMTabBar active="exchange" />
      </div>
    </template>

    <!-- Desktop -->
    <template v-else>
      <ZmHeader active="exchange" />
      <div :style="{ padding: '40px 80px 24px', borderBottom: '1px solid var(--zm-border)' }">
        <div :style="{ display: 'flex', gap: '8px', font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginBottom: '16px' }">
          <NuxtLink to="/exchange" style="text-decoration:none;color:inherit">Exchange</NuxtLink>
          <ZmIcon name="chevron_right" :size="14" color="var(--zm-fg-muted)" />
          <span :style="{ color: 'var(--zm-ink-950)' }">Jobs</span>
        </div>
        <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }">
          <div>
            <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '64px', lineHeight: '0.98', letterSpacing: '-0.03em', margin: '0' }">Latest <em style="font-style:italic">roles.</em></h1>
            <p :style="{ font: '400 17px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '12px', maxWidth: '600px' }">Each role is linked to a real, reviewable recruiter. Apply once — track every status from your dashboard.</p>
          </div>
          <span :style="{ font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">
            <span class="zm-num-tab" :style="{ color: 'var(--zm-ink-950)', fontWeight: '600' }">{{ jobs?.length ?? 0 }}</span> active jobs
          </span>
        </div>
      </div>
      <div :style="{ position: 'sticky', top: '64px', zIndex: '20', background: 'rgba(245,241,232,0.92)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--zm-border)', padding: '14px 80px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', overflowX: 'auto' }">
        <ZmChip icon-right="chevron_down">Country</ZmChip>
        <ZmChip icon-right="chevron_down">Industry</ZmChip>
        <ZmChip icon-right="chevron_down">Type</ZmChip>
        <ZmChip icon-right="chevron_down">Salary</ZmChip>
        <ZmChip icon-right="chevron_down">Deadline</ZmChip>
        <ZmChip icon-right="chevron_down" icon="users">Recruiter</ZmChip>
        <span style="flex:1" />
        <ZmChip tone="subtle" icon="sort" icon-right="chevron_down">Sort: Newest</ZmChip>
      </div>
      <div :style="{ padding: '0 80px 80px' }">
        <div :style="{ display: 'grid', gridTemplateColumns: isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: '20px' }">
          <template v-if="pending">
            <CardsJobCard v-for="i in 6" :key="i" :loading="true" />
          </template>
          <template v-else>
            <CardsJobCard v-for="j in (jobs ?? [])" :key="j.id" :job="j" />
          </template>
        </div>
      </div>
      <ExchangeAppFooter />
    </template>
  </div>
</template>
