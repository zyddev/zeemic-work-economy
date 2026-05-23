<script setup lang="ts">
defineProps<{ value?: number; count?: number; size?: number; color?: string }>()
</script>
<template>
  <span :style="{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: color ?? 'var(--zm-ink-950)', fontSize: `${size ?? 13}px`, fontWeight: '600' }">
    <ZmIcon name="star_fill" :size="(size ?? 13) + 1" color="var(--zm-gold-500)" />
    <span class="zm-num-tab">{{ (value ?? 4.5).toFixed(1) }}</span>
    <span v-if="count != null" style="color:var(--zm-fg-muted);font-weight:400">({{ count }})</span>
  </span>
</template>
