<script setup lang="ts">
useHead({ title: 'Business Directory — Zeemic' })

const { stores, pending } = useMarketplaceStores()
const { isMobile, isTablet } = useBreakpoint()
</script>
<template>
  <div class="zm-root" style="background:var(--zm-paper);min-height:100vh">
    <ZmHeader active="exchange" />
    <div :style="{ padding: isMobile ? '24px 16px 16px' : '40px 80px 24px', borderBottom: '1px solid var(--zm-border)' }">
      <div :style="{ display: 'flex', gap: '8px', font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginBottom: '16px' }">
        <NuxtLink to="/exchange" style="text-decoration:none;color:inherit">Exchange</NuxtLink>
        <ZmIcon name="chevron_right" :size="14" color="var(--zm-fg-muted)" />
        <span :style="{ color: 'var(--zm-ink-950)' }">Businesses</span>
      </div>
      <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: isMobile ? '36px' : '64px', lineHeight: '0.98', letterSpacing: '-0.03em', margin: '0' }">Business <em style="font-style:italic">directory.</em></h1>
      <p :style="{ font: '400 17px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '12px', maxWidth: '600px' }">Discover companies, agencies, and service providers on the Zeemic marketplace.</p>
    </div>
    <div :style="{ position: 'sticky', top: '64px', zIndex: '20', background: 'rgba(245,241,232,0.92)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--zm-border)', padding: isMobile ? '12px 16px' : '14px 80px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: isMobile ? 'nowrap' : 'wrap', overflowX: 'auto' }">
      <ZmChip icon-right="chevron_down">Industry</ZmChip>
      <ZmChip icon-right="chevron_down">Country</ZmChip>
      <ZmChip icon-right="chevron_down">Size</ZmChip>
      <ZmChip icon-right="chevron_down">Type</ZmChip>
      <span style="flex:1" />
      <ZmChip tone="subtle" icon="sort" icon-right="chevron_down">Sort: Most Active</ZmChip>
    </div>
    <div :style="{ padding: isMobile ? '16px' : '0 80px 80px' }">
      <div :style="{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: '20px' }">
        <template v-if="pending">
          <CardsBusinessCard v-for="i in 8" :key="i" :loading="true" />
        </template>
        <template v-else>
          <CardsBusinessCard v-for="b in (stores ?? [])" :key="b.name" :biz="b" />
        </template>
      </div>
    </div>
    <ExchangeAppFooter />
  </div>
</template>
