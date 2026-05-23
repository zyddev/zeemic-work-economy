<script setup lang="ts">
const props = defineProps<{
  icon: string
  size?: number
  variant?: 'ghost' | 'surface' | 'onDark'
  badge?: number
}>()
defineEmits<{ click: [] }>()
const hovered = ref(false)
const size = computed(() => props.size ?? 36)
const v = computed(() => ({
  ghost:   { bg: 'transparent', fg: 'var(--zm-ink-900)', hover: 'var(--zm-ink-100)', bd: 'transparent' },
  surface: { bg: 'var(--zm-white)', fg: 'var(--zm-ink-900)', hover: 'var(--zm-ink-100)', bd: 'var(--zm-border)' },
  onDark:  { bg: 'rgba(245,241,232,0.06)', fg: 'var(--zm-paper)', hover: 'rgba(245,241,232,0.16)', bd: 'rgba(245,241,232,0.14)' },
}[props.variant ?? 'ghost']))
const btnStyle = computed(() => ({
  appearance: 'none' as const,
  border: `1px solid ${v.value.bd}`,
  background: hovered.value ? v.value.hover : v.value.bg,
  color: v.value.fg,
  width: `${size.value}px`, height: `${size.value}px`,
  borderRadius: 'var(--zm-r-md)',
  position: 'relative' as const,
  cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  transition: 'background var(--zm-d-fast) var(--zm-ease)',
  flexShrink: '0',
}))
</script>
<template>
  <button :style="btnStyle" @mouseenter="hovered = true" @mouseleave="hovered = false" @click="$emit('click')">
    <ZmIcon :name="icon" :size="Math.round(size * 0.5)" />
    <span v-if="badge != null && badge !== 0" :style="{
      position: 'absolute', top: '-4px', right: '-4px', minWidth: '18px', height: '18px',
      padding: '0 5px', borderRadius: '9px', background: 'var(--zm-coral-500)', color: 'white',
      fontSize: '10px', fontWeight: '700', lineHeight: '1', display: 'flex', alignItems: 'center',
      justifyContent: 'center', border: '2px solid var(--zm-paper)',
    }">{{ badge > 99 ? '99+' : badge }}</span>
  </button>
</template>
