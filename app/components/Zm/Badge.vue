<script setup lang="ts">
const props = defineProps<{
  tone?: 'neutral' | 'emerald' | 'gold' | 'coral' | 'sky' | 'success' | 'warning' | 'danger' | 'onDark'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
}>()
const tones: Record<string, { bg: string; fg: string }> = {
  neutral: { bg: 'var(--zm-ink-50)', fg: 'var(--zm-ink-800)' },
  emerald: { bg: 'var(--zm-ink-100)', fg: 'var(--zm-ink-700)' },
  gold:    { bg: 'var(--zm-gold-200)', fg: 'var(--zm-grey-900)' },
  coral:   { bg: 'var(--zm-coral-100)', fg: 'var(--zm-coral-600)' },
  sky:     { bg: 'var(--zm-sky-100)', fg: 'var(--zm-sky-700)' },
  success: { bg: 'var(--zm-success-bg)', fg: 'var(--zm-success)' },
  warning: { bg: 'var(--zm-warning-bg)', fg: 'var(--zm-warning)' },
  danger:  { bg: 'var(--zm-danger-bg)', fg: 'var(--zm-danger)' },
  onDark:  { bg: 'rgba(245,241,232,0.12)', fg: 'var(--zm-paper)' },
}
const sizes: Record<string, { px: number; h: number; font: number }> = {
  sm: { px: 6, h: 18, font: 10.5 },
  md: { px: 8, h: 22, font: 11.5 },
  lg: { px: 10, h: 26, font: 12.5 },
}
const t = computed(() => tones[props.tone ?? 'neutral'])
const s = computed(() => sizes[props.size ?? 'md'])
const badgeStyle = computed(() => ({
  display: 'inline-flex', alignItems: 'center', gap: '5px',
  padding: `0 ${s.value.px}px`, height: `${s.value.h}px`,
  borderRadius: 'var(--zm-r-sm)',
  background: t.value.bg, color: t.value.fg,
  font: `600 ${s.value.font}px/1 var(--zm-font-body)`,
  letterSpacing: '0.01em',
}))
</script>
<template>
  <span :style="badgeStyle">
    <span v-if="dot" :style="{ width: '6px', height: '6px', borderRadius: '3px', background: t.fg, opacity: '0.8' }" />
    <slot />
  </span>
</template>
