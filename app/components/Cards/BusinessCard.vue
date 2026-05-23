<script setup lang="ts">
import type { Business } from '~/types'
const props = defineProps<{ biz?: Business; loading?: boolean }>()
const PALETTE = ['#1A4D3A', '#11211A', '#7A4E2D', '#1E4B68', '#6B3A6B', '#2B7A4B']
const idx = computed(() => props.biz ? (props.biz.name.charCodeAt(0) + props.biz.name.length) % PALETTE.length : 0)
const bg = computed(() => PALETTE[idx.value])
</script>
<template>
  <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', overflow: 'hidden', boxShadow: 'var(--zm-shadow-xs)', display: 'flex', flexDirection: 'column' }">

    <!-- Skeleton -->
    <template v-if="loading">
      <ZmSkeleton :height="80" radius="0" />
      <div :style="{ padding: '0 18px', marginTop: '-22px', position: 'relative' }">
        <ZmSkeleton :width="56" :height="56" radius="var(--zm-r-md)" :inline="true" style="border:3px solid var(--zm-white)" />
      </div>
      <div :style="{ padding: '8px 18px 18px', display: 'flex', flexDirection: 'column', gap: '8px' }">
        <ZmSkeleton :height="15" width="60%" />
        <ZmSkeleton :height="13" width="75%" />
        <div :style="{ display: 'flex', gap: '12px', marginTop: '4px' }">
          <ZmSkeleton :height="12" width="40px" />
          <ZmSkeleton :height="12" width="40px" />
          <ZmSkeleton :height="12" width="60px" />
        </div>
        <div :style="{ display: 'flex', gap: '8px', marginTop: '4px' }">
          <ZmSkeleton :height="32" radius="var(--zm-r-md)" style="flex:1" />
          <ZmSkeleton :height="32" radius="var(--zm-r-md)" style="flex:1" />
        </div>
      </div>
    </template>

    <!-- Content -->
    <template v-else-if="biz">
      <div :style="{ height: '80px', background: bg, position: 'relative', overflow: 'hidden' }">
        <svg width="100%" height="100%" viewBox="0 0 200 80" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0">
          <circle cx="170" cy="20" r="40" fill="var(--zm-gold-500)" opacity="0.6" />
          <circle cx="170" cy="20" r="22" :fill="bg" />
        </svg>
      </div>
      <div :style="{ padding: '0 18px', marginTop: '-22px', position: 'relative' }">
        <div :style="{ width: '56px', height: '56px', borderRadius: 'var(--zm-r-md)', background: 'var(--zm-paper)', border: '3px solid var(--zm-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--zm-font-display)', fontSize: '28px', color: bg, letterSpacing: '-0.02em' }">{{ biz.name[0] }}</div>
      </div>
      <div :style="{ padding: '8px 18px 18px', display: 'flex', flexDirection: 'column', gap: '6px' }">
        <div :style="{ display: 'flex', alignItems: 'center', gap: '6px' }">
          <span :style="{ font: '600 15px var(--zm-font-body)', letterSpacing: '-0.005em' }">{{ biz.name }}</span>
          <ZmIcon name="badge_check" :size="13" color="var(--zm-ink-700)" />
        </div>
        <div :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ biz.tag }} · {{ biz.location }}</div>
        <div :style="{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', font: '500 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">
          <span><ZmIcon name="users" :size="13" color="var(--zm-fg-muted)" style="vertical-align:-2px" /> {{ biz.members }}</span>
          <span><ZmIcon name="grid" :size="13" color="var(--zm-fg-muted)" style="vertical-align:-2px" /> {{ biz.listings }}</span>
          <ZmRating :value="biz.rating" :size="12" />
        </div>
        <div :style="{ display: 'flex', gap: '8px', marginTop: '8px' }">
          <ZmButton size="sm" variant="secondary" :full="true">Message</ZmButton>
          <NuxtLink :to="`/businesses/${biz.slug || biz.name.toLowerCase().replace(/\s+/g,'-')}`" style="flex:1;text-decoration:none">
            <ZmButton size="sm" variant="ghost" :full="true">View Profile</ZmButton>
          </NuxtLink>
        </div>
      </div>
    </template>

  </div>
</template>
