<script setup lang="ts">
useHead({ title: 'Skills Marketplace — Zeemic' })

const { products, pending } = useMarketplaceProducts()
const { isMobile, isTablet } = useBreakpoint()
</script>
<template>
  <!-- Mobile native -->
  <div v-if="isMobile" :style="{ background: 'var(--zm-white)', minHeight: '100vh', paddingBottom: '80px' }">
    <ZmMNavBar title="Skills" leftLabel="Exchange" @back="$router.push('/exchange')">
      <template #right>
        <NuxtLink to="/exchange/search" style="text-decoration:none"><ZmIconButton icon="search" :size="36" /></NuxtLink>
      </template>
    </ZmMNavBar>

    <!-- Filter chips -->
    <div :style="{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '0 20px 14px', paddingTop: '4px' }">
      <ZmChip icon="design" icon-right="close" size="sm">Design</ZmChip>
      <ZmChip size="sm" icon-right="chevron_down">Delivery</ZmChip>
      <ZmChip size="sm" icon-right="chevron_down">Price</ZmChip>
      <ZmChip size="sm" icon-right="chevron_down">Country</ZmChip>
      <ZmChip size="sm" icon="filter">Filters</ZmChip>
    </div>

    <!-- Count line -->
    <div :style="{ font: '500 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', padding: '0 20px', marginBottom: '14px' }">
      {{ products?.length ?? 0 }} skills &nbsp;·&nbsp; Sorted by: Highest rated
    </div>

    <!-- Skill cards list -->
    <div :style="{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 20px 24px' }">
      <NuxtLink v-for="s in (products ?? [])" :key="s.id" :to="`/skills/${s.id}`" style="text-decoration:none;color:inherit">
        <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)', overflow: 'hidden' }">
          <ZmSkillThumb :category="s.category" :motif="s.motif" :height="100" />
          <div :style="{ padding: '14px' }">
            <div :style="{ font: '600 14px var(--zm-font-body)', marginBottom: '8px' }">{{ s.title }}</div>
            <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }">
              <ZmAvatar :name="s.seller" :size="20" />
              <span :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ s.seller }}</span>
              <span style="flex:1" />
              <ZmRating :value="s.rating" :count="s.reviews" :size="11" />
            </div>
            <div :style="{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '4px' }">
              <span :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '22px', letterSpacing: '-0.02em' }">${{ s.price }}<span :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ s.unit }}</span></span>
              <ZmButton variant="dark" size="sm">Book now</ZmButton>
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>

    <ZmMTabBar active="exchange" />
  </div>

  <!-- Desktop -->
  <div v-else class="zm-root" style="background:var(--zm-paper);min-height:100vh">
    <ZmHeader active="exchange" />

    <div :style="{ padding: isMobile ? '24px 16px 16px' : '40px 80px 24px', borderBottom: '1px solid var(--zm-border)' }">
      <div :style="{ display: 'flex', gap: '8px', font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginBottom: '16px' }">
        <NuxtLink to="/exchange" style="text-decoration:none;color:inherit;cursor:pointer">Exchange</NuxtLink>
        <ZmIcon name="chevron_right" :size="14" color="var(--zm-fg-muted)" />
        <span :style="{ color: 'var(--zm-ink-950)' }">Skills</span>
      </div>
      <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }">
        <div>
          <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: isMobile ? '36px' : '64px', lineHeight: '0.98', letterSpacing: '-0.03em', margin: '0' }">Skills <em style="font-style:italic">marketplace</em></h1>
          <p :style="{ font: '400 17px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '12px', maxWidth: '600px' }">Find experts ready to help. Book sessions, request quotes, or download brochures — no email back-and-forth.</p>
        </div>
        <div :style="{ display: 'flex', alignItems: 'center', gap: '12px' }">
          <span :style="{ font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">
            <span class="zm-num-tab" :style="{ color: 'var(--zm-ink-950)', fontWeight: '600' }">{{ products?.length ?? 0 }}</span> skills found
          </span>
          <NuxtLink to="/dashboard/skills" style="text-decoration:none"><ZmButton variant="dark" icon="plus">List a skill</ZmButton></NuxtLink>
        </div>
      </div>
    </div>

    <!-- Filter bar -->
    <div :style="{ position: 'sticky', top: '64px', zIndex: '20', background: 'rgba(245,241,232,0.92)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--zm-border)', padding: isMobile ? '12px 16px' : '14px 80px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: isMobile ? 'nowrap' : 'wrap', overflowX: 'auto' }">
      <ZmChip icon-right="chevron_down">Category</ZmChip>
      <ZmChip icon-right="chevron_down">Delivery</ZmChip>
      <ZmChip icon-right="chevron_down">Price range</ZmChip>
      <ZmChip icon-right="chevron_down">Country</ZmChip>
      <ZmChip icon-right="chevron_down">Availability</ZmChip>
      <ZmChip icon-right="chevron_down">Language</ZmChip>
      <span style="flex:1" />
      <ZmChip tone="subtle" icon="sort" icon-right="chevron_down">Sort: Highest rated</ZmChip>
    </div>

    <div :style="{ padding: isMobile ? '16px' : '0 80px 80px' }">
      <div :style="{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: '20px' }">
        <template v-if="pending">
          <CardsSkillCard v-for="i in 6" :key="i" :loading="true" />
        </template>
        <template v-else>
          <NuxtLink v-for="s in (products ?? [])" :key="s.id" :to="`/skills/${s.id}`" style="text-decoration:none;color:inherit">
            <CardsSkillCard :skill="s" />
          </NuxtLink>
        </template>
      </div>

      <div :style="{ marginTop: '40px', padding: '28px 32px', background: 'var(--zm-ink-900)', color: 'var(--zm-fg-on-dark)', borderRadius: 'var(--zm-r-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundImage: 'radial-gradient(circle at 90% 50%,rgba(242,201,76,0.15),transparent 50%)' }">
        <div>
          <div class="zm-eyebrow" :style="{ color: 'var(--zm-gold-500)' }">For sellers</div>
          <h3 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '32px', margin: '6px 0 0', letterSpacing: '-0.02em' }">Have a skill to offer? List it on Zeemic for free.</h3>
        </div>
        <NuxtLink to="/dashboard/skills" style="text-decoration:none"><ZmButton variant="accent" size="lg" icon-right="arrow_right">Create a skill</ZmButton></NuxtLink>
      </div>

      <div :style="{ display: 'flex', justifyContent: 'center', padding: '40px 0 60px' }">
        <ZmButton variant="secondary" size="lg">Load more skills</ZmButton>
      </div>
    </div>
    <ExchangeAppFooter />
  </div>
</template>
