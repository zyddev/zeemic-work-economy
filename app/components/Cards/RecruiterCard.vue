<script setup lang="ts">
import type { Recruiter } from '~/types'
defineProps<{ recruiter?: Recruiter; loading?: boolean }>()
</script>
<template>
  <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: 'var(--zm-shadow-xs)' }">

    <!-- Skeleton -->
    <template v-if="loading">
      <div :style="{ display: 'flex', gap: '14px', alignItems: 'flex-start' }">
        <ZmSkeleton :width="56" :height="56" radius="50%" :inline="true" style="flex-shrink:0" />
        <div :style="{ flex: '1', display: 'flex', flexDirection: 'column', gap: '7px' }">
          <ZmSkeleton :height="15" width="65%" />
          <ZmSkeleton :height="13" width="80%" />
          <ZmSkeleton :height="12" width="50%" />
        </div>
      </div>
      <div :style="{ display: 'flex', flexDirection: 'column', gap: '6px' }">
        <ZmSkeleton :height="14" />
        <ZmSkeleton :height="14" width="85%" />
      </div>
      <div :style="{ display: 'flex', gap: '6px', flexWrap: 'wrap' }">
        <ZmSkeleton v-for="i in 3" :key="i" :height="26" :width="60 + i * 12" radius="var(--zm-r-full)" :inline="true" />
      </div>
      <div :style="{ display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '12px', borderTop: '1px solid var(--zm-border)' }">
        <ZmSkeleton :height="20" width="80px" />
        <ZmSkeleton :height="14" width="70px" />
        <span style="flex:1" />
        <ZmSkeleton :height="32" width="72px" radius="var(--zm-r-md)" :inline="true" />
      </div>
    </template>

    <!-- Content -->
    <template v-else-if="recruiter">
      <div :style="{ display: 'flex', gap: '14px', alignItems: 'flex-start' }">
        <ZmAvatar :name="recruiter.name" :size="56" />
        <div :style="{ flex: '1', minWidth: '0' }">
          <div :style="{ display: 'flex', alignItems: 'center', gap: '6px' }">
            <span :style="{ font: '600 15px var(--zm-font-body)', letterSpacing: '-0.005em' }">{{ recruiter.name }}</span>
            <ZmIcon name="badge_check" :size="14" color="var(--zm-ink-700)" />
          </div>
          <div :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ recruiter.title }}</div>
          <div :style="{ font: '500 12px var(--zm-font-body)', color: 'var(--zm-ink-700)', marginTop: '4px' }">{{ recruiter.business }}</div>
        </div>
      </div>
      <p :style="{ margin: '0', fontStyle: 'italic', fontFamily: 'var(--zm-font-display)', fontSize: '16px', lineHeight: '1.5', color: 'var(--zm-fg)' }">"{{ recruiter.quote }}"</p>
      <div :style="{ display: 'flex', flexWrap: 'wrap', gap: '6px' }">
        <ZmChip v-for="s in recruiter.specialties" :key="s" size="sm" tone="subtle">{{ s }}</ZmChip>
      </div>
      <div :style="{ display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '12px', borderTop: '1px solid var(--zm-border)' }">
        <span class="zm-eyebrow" style="font-size:10px">
          <span :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '20px', color: 'var(--zm-ink-950)', fontStyle: 'normal', textTransform: 'none', letterSpacing: '-0.02em' }" class="zm-num-tab">{{ recruiter.placements }}</span>
          <span style="margin-left:4px">placements</span>
        </span>
        <span :style="{ width: '1px', height: '16px', background: 'var(--zm-border)' }" />
        <ZmRating :value="recruiter.rating" :count="recruiter.reviews" :size="12" />
        <span style="flex:1" />
        <NuxtLink :to="`/recruiter/${recruiter.id}`" style="text-decoration:none">
          <ZmButton size="sm">Contact</ZmButton>
        </NuxtLink>
      </div>
    </template>

  </div>
</template>
