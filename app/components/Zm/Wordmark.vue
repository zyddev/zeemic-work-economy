<script setup lang="ts">
const props = defineProps<{ height?: number; color?: string; accent?: string }>()
const h = computed(() => props.height ?? 36)
const color = computed(() => props.color ?? 'var(--zm-ink-950)')
const accent = computed(() => props.accent ?? 'var(--zm-gold-500)')
const markSize = computed(() => Math.round(h.value * 1.0))
const fontSize = computed(() => Math.round(h.value * 0.62))
const gap = computed(() => Math.round(h.value * 0.12))
</script>
<template>
  <div :style="{ display: 'inline-flex', alignItems: 'center', gap: `${gap}px` }">
    <svg :width="markSize" :height="markSize" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M10 12 H54 V22 L24 42 H54 V52 H10 V42 L40 22 H10 Z" :fill="color" />
      <path d="M44 12 H54 V22 H50 Z" :fill="accent" />
      <path d="M10 42 H20 L10 52 Z" :fill="accent" />
    </svg>
    <span :style="{ fontFamily: 'var(--zm-font-body)', fontWeight: '600', fontSize: `${fontSize}px`, letterSpacing: '-0.025em', color: color, lineHeight: '1', marginLeft: '-2px' }">eemic</span>
  </div>
</template>
