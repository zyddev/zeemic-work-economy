<script setup lang="ts">
defineProps<{ column?: boolean }>()
</script>

<template>
  <div :style="{
    flexShrink: 0,
    padding: '12px 16px env(safe-area-inset-bottom, 32px)',
    background: 'rgba(245,241,232,0.96)',
    backdropFilter: 'saturate(180%) blur(12px)',
    borderTop: '0.5px solid var(--zm-border)',
    display: 'flex',
    flexDirection: column ? 'column' : 'row',
    gap: '10px',
  }">
    <slot />
  </div>
</template>
