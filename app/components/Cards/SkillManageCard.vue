<script setup lang="ts">
import type { Skill } from '~/types'
defineProps<{ skill?: Skill; views?: number; inquiries?: number; status?: string; loading?: boolean }>()
</script>
<template>
  <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', overflow: 'hidden', display: 'grid', gridTemplateColumns: '120px 1fr', minHeight: '140px' }">

    <!-- Skeleton -->
    <template v-if="loading">
      <ZmSkeleton :height="140" radius="0" style="height:100%" />
      <div :style="{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }">
        <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }">
          <div :style="{ flex: '1', display: 'flex', flexDirection: 'column', gap: '6px' }">
            <ZmSkeleton :height="15" width="70%" />
            <ZmSkeleton :height="12" width="90%" />
          </div>
          <ZmSkeleton :height="22" width="56px" radius="var(--zm-r-full)" :inline="true" style="flex-shrink:0" />
        </div>
        <div :style="{ display: 'flex', gap: '14px', marginTop: 'auto', alignItems: 'center' }">
          <ZmSkeleton :height="12" width="55px" />
          <ZmSkeleton :height="12" width="70px" />
          <ZmSkeleton :height="12" width="60px" />
          <span style="flex:1" />
          <ZmSkeleton :height="32" width="48px" radius="var(--zm-r-md)" :inline="true" />
          <ZmSkeleton :height="32" width="80px" radius="var(--zm-r-md)" :inline="true" />
          <ZmSkeleton :width="32" :height="32" radius="var(--zm-r-sm)" :inline="true" />
        </div>
      </div>
    </template>

    <!-- Content -->
    <template v-else-if="skill">
      <ZmSkillThumb :category="skill.category" :motif="skill.motif" :height="140" style="height:100%" />
      <div :style="{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }">
        <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }">
          <div>
            <div :style="{ font: '600 15px var(--zm-font-body)', letterSpacing: '-0.005em' }">{{ skill.title }}</div>
            <div :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '4px' }">{{ skill.category }} · {{ skill.delivery }} · From ${{ skill.price ?? '—' }}{{ skill.unit }}</div>
          </div>
          <ZmBadge :tone="(status ?? 'Active') === 'Active' ? 'success' : (status ?? 'Active') === 'Paused' ? 'warning' : 'neutral'" dot>{{ status ?? 'Active' }}</ZmBadge>
        </div>
        <div :style="{ display: 'flex', gap: '14px', marginTop: 'auto', alignItems: 'center' }">
          <span :style="{ font: '500 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">
            <ZmIcon name="eye" :size="13" color="var(--zm-fg-muted)" style="vertical-align:-2px;margin-right:4px" /> {{ views ?? 0 }} views
          </span>
          <span :style="{ font: '500 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">
            <ZmIcon name="inbox" :size="13" color="var(--zm-fg-muted)" style="vertical-align:-2px;margin-right:4px" /> {{ inquiries ?? 0 }} inquiries
          </span>
          <ZmRating :value="skill.rating" :count="skill.reviews" :size="12" />
          <span style="flex:1" />
          <ZmButton size="sm" variant="secondary">Edit</ZmButton>
          <ZmButton size="sm" variant="ghost">View public</ZmButton>
          <ZmIconButton icon="more" :size="32" />
        </div>
      </div>
    </template>

  </div>
</template>
