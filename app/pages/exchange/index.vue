<script setup lang="ts">
useHead({ title: 'Exchange — Zeemic Marketplace' })

const { products, pending: skillsPending } = useMarketplaceProducts()
const { portfolios, pending: recruitersPending } = useMarketplacePortfolios()
const { projects, pending: jobsPending } = useMarketplaceProjects()
const { stores, pending: bizPending } = useMarketplaceStores()
const { isMobile, isTablet } = useBreakpoint()
</script>
<template>
  <!-- Mobile native -->
  <div v-if="isMobile" :style="{ background: 'var(--zm-paper)', minHeight: '100vh', paddingBottom: '80px' }">
    <!-- Mobile header -->
    <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px 16px' }">
      <ZmWordmark :height="22" />
      <div :style="{ display: 'flex', gap: '4px' }">
        <NuxtLink to="/exchange/search" style="text-decoration:none"><ZmIconButton icon="search" :size="36" /></NuxtLink>
        <ZmIconButton icon="bell" :size="36" />
      </div>
    </div>

    <!-- Hero section -->
    <div :style="{ padding: '8px 20px 24px' }">
      <div class="zm-eyebrow">The Exchange</div>
      <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '44px', lineHeight: '0.98', letterSpacing: '-0.03em', margin: '6px 0 0' }">Hire skills, find <em>work.</em></h1>
      <div :style="{ marginTop: '16px' }">
        <NuxtLink to="/exchange/search" style="text-decoration:none">
          <ZmSearch placeholder="Search the marketplace…" size="md" />
        </NuxtLink>
      </div>
      <!-- Filter chips -->
      <div :style="{ display: 'flex', gap: '8px', marginTop: '12px', overflowX: 'auto', paddingBottom: '4px' }">
        <NuxtLink to="/skills" style="text-decoration:none"><ZmChip icon="wrench" size="sm">Skills</ZmChip></NuxtLink>
        <NuxtLink to="/recruiters" style="text-decoration:none"><ZmChip icon="users" size="sm">Recruiters</ZmChip></NuxtLink>
        <NuxtLink to="/jobs" style="text-decoration:none"><ZmChip icon="briefcase" size="sm">Jobs</ZmChip></NuxtLink>
        <NuxtLink to="/businesses" style="text-decoration:none"><ZmChip icon="building" size="sm">Businesses</ZmChip></NuxtLink>
      </div>
    </div>

    <!-- Featured Skills -->
    <div :style="{ padding: '8px 0 24px' }">
      <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', marginBottom: '12px' }">
        <span :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '22px', letterSpacing: '-0.02em' }">Featured skills</span>
        <NuxtLink to="/skills" :style="{ font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textDecoration: 'none' }">View all →</NuxtLink>
      </div>
      <div :style="{ display: 'flex', gap: '12px', padding: '0 20px', overflowX: 'auto', scrollSnapType: 'x mandatory', paddingBottom: '4px' }">
        <ZmMobileSkillCard v-for="s in (products ?? []).slice(0, 4)" :key="s.id" :skill="s" :style="{ scrollSnapAlign: 'start', flexShrink: '0' }" />
      </div>
    </div>

    <!-- Top Recruiters -->
    <div :style="{ background: 'var(--zm-ink-900)', color: 'var(--zm-fg-on-dark)', padding: '24px 20px', margin: '0 0 24px' }">
      <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }">
        <span :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '22px', letterSpacing: '-0.02em' }">Top recruiters</span>
        <NuxtLink to="/recruiters" :style="{ font: '500 13px var(--zm-font-body)', color: 'var(--zm-gold-500)', textDecoration: 'none' }">View all →</NuxtLink>
      </div>
      <div :style="{ display: 'flex', flexDirection: 'column', gap: '10px' }">
        <div v-for="r in (portfolios ?? []).slice(0, 2)" :key="r.id" :style="{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(245,241,232,0.06)', borderRadius: 'var(--zm-r-md)' }">
          <ZmAvatar :name="r.name" :size="42" />
          <div :style="{ flex: 1, minWidth: 0 }">
            <div :style="{ font: '600 13px var(--zm-font-body)' }">{{ r.name }}</div>
            <div :style="{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-on-dark-muted)', marginTop: '2px' }">{{ r.title }}</div>
          </div>
          <div :style="{ textAlign: 'right', flexShrink: 0 }">
            <div :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '18px', letterSpacing: '-0.02em', lineHeight: '1' }">{{ r.placements }}</div>
            <div :style="{ font: '500 9px var(--zm-font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px', color: 'var(--zm-fg-on-dark-muted)' }">Placed</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Latest Jobs -->
    <div :style="{ padding: '0 0 24px' }">
      <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', marginBottom: '12px' }">
        <span :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '22px', letterSpacing: '-0.02em' }">Latest jobs</span>
        <NuxtLink to="/jobs" :style="{ font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textDecoration: 'none' }">View all →</NuxtLink>
      </div>
      <div :style="{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '0 20px' }">
        <div v-for="j in (projects ?? []).slice(0, 2)" :key="j.id" :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)', padding: '14px', display: 'flex', gap: '12px', alignItems: 'flex-start' }">
          <ZmAvatar :name="j.company" :size="36" square />
          <div :style="{ flex: 1, minWidth: 0 }">
            <div :style="{ font: '600 14px var(--zm-font-body)', marginBottom: '2px' }">{{ j.title }}</div>
            <div :style="{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ j.company }} · {{ j.location }}</div>
            <div :style="{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }">
              <ZmBadge tone="emerald" size="sm">{{ j.salary }}</ZmBadge>
              <ZmBadge size="sm">{{ j.type }}</ZmBadge>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ZmMTabBar active="exchange" />
  </div>

  <!-- Desktop -->
  <div v-else class="zm-root" style="background:var(--zm-paper);min-height:100vh">
    <ZmHeader active="exchange" />

    <!-- Hero -->
    <section :style="{ padding: isMobile ? '32px 16px 24px' : '72px 80px 64px', background: 'linear-gradient(180deg,var(--zm-paper) 0%,var(--zm-paper-2) 100%)', borderBottom: '1px solid var(--zm-border)', position: 'relative', overflow: 'hidden' }">
      <div aria-hidden :style="{ position: 'absolute', right: '-60px', top: '40px', fontFamily: 'var(--zm-font-display)', fontSize: '280px', color: 'var(--zm-paper-3)', letterSpacing: '-0.04em', lineHeight: '1', fontStyle: 'italic', pointerEvents: 'none', userSelect: 'none' }">z.</div>
      <div :style="{ maxWidth: '1280px', position: 'relative' }">
        <div class="zm-eyebrow" :style="{ marginBottom: '16px' }">The Exchange · Work-economy marketplace</div>
        <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: isMobile ? '48px' : '88px', lineHeight: '0.97', letterSpacing: '-0.035em', margin: '0', maxWidth: '920px' }">
          Hire skills, find jobs,<br/>connect with <em style="font-style:italic">recruiters.</em>
        </h1>
        <p :style="{ font: '400 18px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-muted)', maxWidth: '560px', marginTop: '24px' }">
          Browse, book, and transact across the entire work economy — from a five-day design sprint to a Series A finance hire.
        </p>
        <div :style="{ marginTop: '36px', maxWidth: '720px' }">
          <ZmSearch placeholder="Search skills, jobs, recruiters, businesses…" size="lg" action-label="Search" />
        </div>
        <div :style="{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '20px', flexWrap: 'wrap' }">
          <span class="zm-eyebrow">Browse</span>
          <NuxtLink to="/skills" style="text-decoration:none"><ZmChip icon="wrench" icon-right="arrow_right">Skills</ZmChip></NuxtLink>
          <NuxtLink to="/recruiters" style="text-decoration:none"><ZmChip icon="users" icon-right="arrow_right">Recruiters</ZmChip></NuxtLink>
          <NuxtLink to="/jobs" style="text-decoration:none"><ZmChip icon="briefcase" icon-right="arrow_right">Jobs</ZmChip></NuxtLink>
          <NuxtLink to="/businesses" style="text-decoration:none"><ZmChip icon="building" icon-right="arrow_right">Businesses</ZmChip></NuxtLink>
        </div>
        <div :style="{ display: 'flex', gap: '48px', marginTop: '64px', paddingTop: '28px', borderTop: '1px solid var(--zm-border)' }">
          <div v-for="s in [{ v: '12,840', l: 'Skills listed' },{ v: '3,421', l: 'Recruiters' },{ v: '8,140', l: 'Active jobs' },{ v: '$4.2M', l: 'Transacted YTD' }]" :key="s.l">
            <div :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '40px', lineHeight: '1', letterSpacing: '-0.02em' }" class="zm-num-tab">{{ s.v }}</div>
            <div :style="{ font: '500 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '8px' }">{{ s.l }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Skills -->
    <ExchangeSectionRow icon="wrench" title="Featured skills" subtitle="Find experts ready to help — book, quote, or download brochures." href="/skills">
      <div :style="{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: '20px' }">
        <template v-if="skillsPending">
          <CardsSkillCard v-for="i in 4" :key="i" :loading="true" />
        </template>
        <template v-else>
          <CardsSkillCard v-for="s in (products ?? []).slice(0,4)" :key="s.id" :skill="s" />
        </template>
      </div>
    </ExchangeSectionRow>

    <!-- Top Recruiters -->
    <ExchangeSectionRow icon="users" title="Top recruiters" subtitle="Talent specialists, ranked by placements + buyer reviews." href="/recruiters" theme="dark">
      <div :style="{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: '20px' }">
        <template v-if="recruitersPending">
          <CardsRecruiterCard v-for="i in 3" :key="i" :loading="true" />
        </template>
        <template v-else>
          <CardsRecruiterCard v-for="r in (portfolios ?? []).slice(0,3)" :key="r.id" :recruiter="r" />
        </template>
      </div>
    </ExchangeSectionRow>

    <!-- Latest Jobs -->
    <ExchangeSectionRow icon="briefcase" title="Latest jobs" subtitle="Roles posted in the last 7 days, with linked recruiters." href="/jobs">
      <div :style="{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: '20px' }">
        <template v-if="jobsPending">
          <CardsJobCard v-for="i in 4" :key="i" :loading="true" />
        </template>
        <template v-else>
          <CardsJobCard v-for="j in (projects ?? []).slice(0,4)" :key="j.id" :job="j" />
        </template>
      </div>
    </ExchangeSectionRow>

    <!-- Businesses -->
    <ExchangeSectionRow icon="building" title="Featured businesses" subtitle="Verified organizations hiring and selling on Zeemic." href="/businesses">
      <div :style="{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: '20px' }">
        <template v-if="bizPending">
          <CardsBusinessCard v-for="i in 4" :key="i" :loading="true" />
        </template>
        <template v-else>
          <CardsBusinessCard v-for="b in (stores ?? []).slice(0,4)" :key="b.name" :biz="b" />
        </template>
      </div>
    </ExchangeSectionRow>

    <ExchangeAppFooter />
  </div>
</template>
