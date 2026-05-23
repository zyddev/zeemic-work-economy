<script setup lang="ts">
defineProps<{ padding?: number; hoverable?: boolean }>()
</script>
<template>
  <div :style="{
    background: 'var(--zm-white)', border: '1px solid var(--zm-border)',
    borderRadius: 'var(--zm-r-lg)', padding: `${padding ?? 20}px`,
    boxShadow: hoverable ? 'var(--zm-shadow-xs)' : 'none',
    transition: 'box-shadow var(--zm-d-base) var(--zm-ease)',
  }"><slot /></div>
</template>
