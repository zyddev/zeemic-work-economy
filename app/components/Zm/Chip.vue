<script setup lang="ts">
const props = defineProps<{
  icon?: string
  iconRight?: string
  active?: boolean
  removable?: boolean
  size?: 'sm' | 'md' | 'lg'
  tone?: 'subtle' | 'gold'
}>()
defineEmits<{ click: [] }>()
const sz = computed(() => ({ sm: { h: 26, px: 10, font: 12, gap: 5 }, md: { h: 32, px: 12, font: 13, gap: 6 }, lg: { h: 38, px: 16, font: 14, gap: 7 } }[props.size ?? 'md']))
const chipStyle = computed(() => {
  let bg = 'var(--zm-white)', fg = 'var(--zm-ink-900)', bd = 'var(--zm-border)'
  if (props.active) { bg = 'var(--zm-ink-900)'; fg = 'var(--zm-paper)'; bd = 'var(--zm-ink-900)' }
  if (props.tone === 'subtle') { bg = 'var(--zm-ink-50)'; fg = 'var(--zm-ink-700)'; bd = 'transparent' }
  if (props.tone === 'gold') { bg = 'var(--zm-gold-200)'; fg = 'var(--zm-grey-900)'; bd = 'transparent' }
  return {
    display: 'inline-flex', alignItems: 'center', gap: `${sz.value.gap}px`,
    height: `${sz.value.h}px`, padding: `0 ${sz.value.px}px`,
    border: `1px solid ${bd}`, background: bg, color: fg,
    borderRadius: 'var(--zm-r-full)',
    font: `500 ${sz.value.font}px/1 var(--zm-font-body)`,
    cursor: 'pointer', whiteSpace: 'nowrap' as const,
    appearance: 'none' as const,
  }
})
</script>
<template>
  <button :style="chipStyle" @click="$emit('click')">
    <ZmIcon v-if="icon" :name="icon" :size="sz.font + 2" />
    <slot />
    <ZmIcon v-if="iconRight" :name="iconRight" :size="sz.font + 2" />
    <ZmIcon v-if="removable" name="close" :size="sz.font" style="margin-left:2px" />
  </button>
</template>
