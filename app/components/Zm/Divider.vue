<script setup lang="ts">
defineProps<{ label?: string }>()
</script>
<template>
  <div :style="{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--zm-border-strong)' }">
    <div :style="{ flex: '1', height: '1px', background: 'currentColor' }" />
    <span v-if="label" class="zm-eyebrow" :style="{ color: 'var(--zm-fg-muted)' }">{{ label }}</span>
    <div v-if="label" :style="{ flex: '1', height: '1px', background: 'currentColor' }" />
  </div>
</template>
