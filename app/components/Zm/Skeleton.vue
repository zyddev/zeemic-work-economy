<script setup lang="ts">
const props = defineProps<{
  width?: string | number
  height?: string | number
  radius?: string
  inline?: boolean
}>()

function px(v: string | number | undefined, fallback: string) {
  if (v === undefined) return fallback
  if (typeof v === 'number') return `${v}px`
  return /^\d+(\.\d+)?$/.test(v) ? `${v}px` : v
}
</script>

<template>
  <span
    :style="{
      display: props.inline ? 'inline-block' : 'block',
      width: px(props.width, '100%'),
      height: px(props.height, '16px'),
      borderRadius: props.radius ?? 'var(--zm-r-sm)',
      background: 'var(--zm-ink-100)',
      animation: 'zm-pulse 1.8s ease-in-out infinite',
      flexShrink: '0',
    }"
  />
</template>
