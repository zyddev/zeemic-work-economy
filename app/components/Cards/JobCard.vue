<script setup lang="ts">
import type { Job } from '~/types'
const props = defineProps<{ job?: Job; loading?: boolean }>()

function handleApply() {
  if (props.job?.externalLink && props.job.applicationUrl) {
    window.open(props.job.applicationUrl, '_blank', 'noopener,noreferrer')
  } else {
    navigateTo(`/jobs/${props.job?.id}`)
  }
}
</script>
<template>
  <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: 'var(--zm-shadow-xs)' }">

    <!-- Skeleton -->
    <template v-if="loading">
      <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }">
        <div :style="{ display: 'flex', gap: '12px', alignItems: 'center' }">
          <ZmSkeleton :width="36" :height="36" radius="var(--zm-r-sm)" :inline="true" style="flex-shrink:0" />
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '6px' }">
            <ZmSkeleton :height="13" width="100px" />
            <ZmSkeleton :height="11" width="80px" />
          </div>
        </div>
        <ZmSkeleton :width="32" :height="32" radius="var(--zm-r-sm)" :inline="true" style="flex-shrink:0" />
      </div>
      <ZmSkeleton :height="48" radius="var(--zm-r-sm)" />
      <div :style="{ display: 'flex', gap: '8px' }">
        <ZmSkeleton :height="22" width="80px" radius="var(--zm-r-full)" />
        <ZmSkeleton :height="22" width="120px" radius="var(--zm-r-full)" />
      </div>
      <ZmSkeleton :height="32" width="160px" radius="var(--zm-r-sm)" />
      <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto' }">
        <ZmSkeleton :height="12" width="100px" />
        <span style="flex:1" />
        <ZmSkeleton :height="32" width="72px" radius="var(--zm-r-md)" :inline="true" />
      </div>
    </template>

    <!-- Content -->
    <template v-else-if="job">
      <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }">
        <div :style="{ display: 'flex', gap: '12px', alignItems: 'center' }">
          <ZmAvatar :name="job.company" :size="36" :square="true" />
          <div>
            <div :style="{ font: '500 13px var(--zm-font-body)' }">{{ job.company }}</div>
            <div :style="{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ job.type }} · {{ job.location }}</div>
          </div>
        </div>
        <ZmIconButton icon="heart" :size="32" />
      </div>
      <div :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '24px', lineHeight: '1.05', letterSpacing: '-0.02em' }">{{ job.title }}</div>
      <div :style="{ display: 'flex', gap: '8px', flexWrap: 'wrap' }">
        <ZmBadge tone="emerald">{{ job.salary }}</ZmBadge>
        <ZmBadge>Deadline · {{ job.deadline }}</ZmBadge>
      </div>
      <div v-if="job.recruiter" :style="{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 10px', background: 'var(--zm-paper)', borderRadius: 'var(--zm-r-sm)', alignSelf: 'flex-start' }">
        <ZmAvatar :name="job.recruiter" :size="20" />
        <span :style="{ font: '500 12px var(--zm-font-body)' }">via {{ job.recruiter }}</span>
        <ZmIcon name="arrow_up_right" :size="12" color="var(--zm-fg-muted)" />
      </div>
      <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto' }">
        <span :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">Posted {{ timeAgo(job.posted) }}</span>
        <span style="flex:1" />
        <ZmButton size="sm" variant="dark" :icon-right="job.externalLink ? 'external' : 'arrow_right'" @click="handleApply">Apply</ZmButton>
      </div>
    </template>

  </div>
</template>
