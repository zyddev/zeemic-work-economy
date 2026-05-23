<script setup lang="ts">
import type { Skill } from '~/types'
defineProps<{ skill?: Skill; loading?: boolean }>()
</script>
<template>
  <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: 'var(--zm-shadow-xs)', transition: 'box-shadow var(--zm-d-base) var(--zm-ease)' }">

    <!-- Skeleton -->
    <template v-if="loading">
      <ZmSkeleton :height="140" radius="0" />
      <div :style="{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: '1' }">
        <div :style="{ display: 'flex', alignItems: 'center', gap: '8px' }">
          <ZmSkeleton :width="24" :height="24" radius="var(--zm-r-sm)" :inline="true" style="flex-shrink:0" />
          <ZmSkeleton :height="13" width="55%" />
        </div>
        <ZmSkeleton :height="13" />
        <ZmSkeleton :height="13" width="80%" />
        <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }">
          <ZmSkeleton :height="26" width="70px" />
          <ZmSkeleton :height="14" width="80px" />
        </div>
        <div :style="{ display: 'flex', gap: '6px' }">
          <ZmSkeleton :height="32" radius="var(--zm-r-md)" style="flex:1" />
          <ZmSkeleton :height="32" radius="var(--zm-r-md)" style="flex:1" />
          <ZmSkeleton :width="32" :height="32" radius="var(--zm-r-sm)" :inline="true" style="flex-shrink:0" />
        </div>
      </div>
    </template>

    <!-- Content -->
    <template v-else-if="skill">
      <ZmSkillThumb :category="skill.category" :title="skill.title" :motif="skill.motif" :height="140" />
      <div :style="{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: '1' }">
        <div :style="{ display: 'flex', alignItems: 'center', gap: '8px' }">
          <ZmAvatar :name="skill.seller" :size="24" :square="skill.isBusiness" />
          <span :style="{ font: '500 13px var(--zm-font-body)', flex: '1', minWidth: '0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">{{ skill.seller }}</span>
          <ZmBadge v-if="skill.available === 'Now'" tone="success" dot size="sm">Available</ZmBadge>
        </div>
        <p :style="{ margin: '0', font: '400 13px/1.45 var(--zm-font-body)', color: 'var(--zm-fg-muted)', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }">{{ skill.blurb }}</p>
        <div :style="{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 'auto' }">
          <div :style="{ display: 'flex', alignItems: 'baseline', gap: '2px' }">
            <template v-if="skill.price == null">
              <span :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '22px' }">RFQ</span>
              <span :style="{ color: 'var(--zm-fg-muted)', fontSize: '12px', marginLeft: '4px' }">· custom</span>
            </template>
            <template v-else>
              <span class="zm-num-tab" :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '26px', letterSpacing: '-0.02em' }">${{ skill.price.toLocaleString() }}</span>
              <span :style="{ color: 'var(--zm-fg-muted)', fontSize: '12px' }">{{ skill.unit }}</span>
            </template>
          </div>
          <ZmRating :value="skill.rating" :count="skill.reviews" />
        </div>
        <div :style="{ display: 'flex', gap: '6px', marginTop: '4px' }">
          <ZmButton size="sm" :full="true">Book now</ZmButton>
          <ZmButton size="sm" variant="secondary" :full="true">Get quote</ZmButton>
          <ZmIconButton icon="heart" :size="32" variant="surface" />
        </div>
      </div>
    </template>

  </div>
</template>
