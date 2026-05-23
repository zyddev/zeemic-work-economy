<script setup lang="ts">
useHead({ title: 'Recruiters — Zeemic' })

const { portfolios, pending } = useMarketplacePortfolios()
const { isMobile, isTablet } = useBreakpoint()
</script>
<template>
  <div class="zm-root" style="background:var(--zm-paper);min-height:100vh">
    <!-- Mobile -->
    <template v-if="isMobile">
      <div style="background:var(--zm-paper);min-height:100vh;padding-bottom:80px">
        <ZmMNavBar title="Recruiters" leftLabel="Exchange" @back="$router.push('/exchange')">
          <template #right>
            <ZmIconButton icon="filter" :size="36" />
          </template>
        </ZmMNavBar>

        <!-- Header -->
        <div :style="{ padding: '12px 20px 8px' }">
          <div class="zm-eyebrow">{{ portfolios?.length ?? 0 }} results</div>
          <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '32px', lineHeight: '0.98', letterSpacing: '-0.025em', margin: '4px 0 0' }">Recruiters, <em style="font-style:italic">vetted.</em></h1>
        </div>

        <!-- Filter chips -->
        <div :style="{ display: 'flex', gap: '8px', padding: '8px 16px 8px', overflowX: 'auto', scrollbarWidth: 'none' }">
          <ZmChip tone="accent">Engineering</ZmChip>
          <ZmChip icon-right="chevron_down">Country</ZmChip>
          <ZmChip icon-right="chevron_down">Response</ZmChip>
        </div>

        <!-- Recruiter list -->
        <div :style="{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }">
          <template v-if="pending">
            <div v-for="i in 4" :key="i" :style="{ height: '140px', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', animation: 'zm-pulse 1.5s ease-in-out infinite' }" />
          </template>
          <template v-else>
            <NuxtLink
              v-for="r in (portfolios ?? [])"
              :key="r.id"
              :to="`/recruiter/${r.id}`"
              style="text-decoration:none;color:inherit"
            >
              <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', padding: '16px' }">
                <!-- Top row -->
                <div :style="{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }">
                  <ZmAvatar :name="r.name" :size="48" />
                  <div :style="{ flex: 1, minWidth: 0 }">
                    <div :style="{ display: 'flex', alignItems: 'center', gap: '4px' }">
                      <span :style="{ font: '600 14px var(--zm-font-body)', color: 'var(--zm-ink-950)' }">{{ r.name }}</span>
                      <ZmIcon name="badge_check" :size="13" color="var(--zm-gold-500)" />
                    </div>
                    <div :style="{ font: '400 11.5px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '1px' }">{{ r.title }}</div>
                  </div>
                  <ZmRating :value="r.rating" :size="11" />
                </div>
                <!-- Quote -->
                <p :style="{ fontFamily: 'var(--zm-font-display)', fontStyle: 'italic', font: '400 13px/1.4 var(--zm-font-display)', fontSize: '13px', color: 'var(--zm-ink-950)', margin: '0 0 10px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }">"{{ r.quote }}"</p>
                <!-- Bottom row -->
                <div :style="{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }">
                  <ZmChip v-for="s in (r.specialties ?? []).slice(0,2)" :key="s" tone="subtle" style="font-size:11px">{{ s }}</ZmChip>
                  <span style="flex:1" />
                  <div :style="{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }">
                    <span :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '16px', lineHeight: '1', color: 'var(--zm-ink-950)' }">{{ r.placements }}</span>
                    <span :style="{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }">placements</span>
                  </div>
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
          <span :style="{ color: 'var(--zm-ink-950)' }">Recruiters</span>
        </div>
        <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }">
          <div>
            <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '64px', lineHeight: '0.98', letterSpacing: '-0.03em', margin: '0' }">Recruiters, <em style="font-style:italic">vetted.</em></h1>
            <p :style="{ font: '400 17px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '12px', maxWidth: '600px' }">Specialised talent partners ranked by placements and verified buyer reviews.</p>
          </div>
          <span :style="{ font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">
            <span class="zm-num-tab" :style="{ color: 'var(--zm-ink-950)', fontWeight: '600' }">{{ portfolios?.length ?? 0 }}</span> recruiters
          </span>
        </div>
      </div>
      <div :style="{ position: 'sticky', top: '64px', zIndex: '20', background: 'rgba(245,241,232,0.92)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--zm-border)', padding: '14px 80px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', overflowX: 'auto' }">
        <ZmChip icon-right="chevron_down">Specialty</ZmChip>
        <ZmChip icon-right="chevron_down">Country</ZmChip>
        <ZmChip icon-right="chevron_down">Response time</ZmChip>
        <ZmChip icon-right="chevron_down">Languages</ZmChip>
        <span style="flex:1" />
        <ZmChip tone="subtle" icon="sort" icon-right="chevron_down">Sort: Most placements</ZmChip>
      </div>
      <div :style="{ padding: '0 80px 80px' }">
        <div :style="{ display: 'grid', gridTemplateColumns: isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: '20px' }">
          <template v-if="pending">
            <CardsRecruiterCard v-for="i in 6" :key="i" :loading="true" />
          </template>
          <template v-else>
            <CardsRecruiterCard v-for="r in (portfolios ?? [])" :key="r.id" :recruiter="r" />
          </template>
        </div>
      </div>
      <ExchangeAppFooter />
    </template>
  </div>
</template>
