<script setup lang="ts">
const props = defineProps<{
  variant?: 'primary' | 'accent' | 'secondary' | 'ghost' | 'dark' | 'danger' | 'onDark'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  iconRight?: string
  full?: boolean
  disabled?: boolean
  loading?: boolean
}>()

defineEmits<{ click: [] }>()

const hovered = ref(false)

const sz = computed(() => ({
  sm: { padX: 12, padY: 6, font: 13, h: 32, gap: 6, icon: 14 },
  md: { padX: 16, padY: 9, font: 14, h: 40, gap: 8, icon: 16 },
  lg: { padX: 20, padY: 12, font: 15, h: 48, gap: 10, icon: 18 },
}[props.size ?? 'md']))

const v = computed(() => ({
  primary:   { bg: 'var(--zm-ink-700)', fg: 'var(--zm-paper)', bd: 'var(--zm-ink-700)', hover: 'var(--zm-ink-800)' },
  accent:    { bg: 'var(--zm-gold-500)', fg: 'var(--zm-ink-950)', bd: 'var(--zm-gold-500)', hover: 'var(--zm-gold-700)' },
  secondary: { bg: 'transparent', fg: 'var(--zm-ink-900)', bd: 'var(--zm-border-strong)', hover: 'var(--zm-ink-100)' },
  ghost:     { bg: 'transparent', fg: 'var(--zm-ink-900)', bd: 'transparent', hover: 'var(--zm-ink-100)' },
  dark:      { bg: 'var(--zm-ink-950)', fg: 'var(--zm-paper)', bd: 'var(--zm-ink-950)', hover: 'var(--zm-ink-800)' },
  danger:    { bg: 'var(--zm-coral-500)', fg: 'var(--zm-paper)', bd: 'var(--zm-coral-500)', hover: 'var(--zm-coral-600)' },
  onDark:    { bg: 'rgba(245,241,232,0.12)', fg: 'var(--zm-paper)', bd: 'rgba(245,241,232,0.22)', hover: 'rgba(245,241,232,0.22)' },
}[props.variant ?? 'primary']))

const isBold = computed(() => ['primary', 'accent', 'dark', 'danger'].includes(props.variant ?? 'primary'))
const isBlocked = computed(() => props.disabled || props.loading)

const buttonStyle = computed(() => ({
  appearance: 'none' as const,
  border: `1px solid ${v.value.bd}`,
  background: hovered.value && !isBlocked.value ? v.value.hover : v.value.bg,
  color: v.value.fg,
  font: `${isBold.value ? 600 : 500} ${sz.value.font}px/1 var(--zm-font-body)`,
  letterSpacing: '-0.005em',
  padding: `${sz.value.padY}px ${sz.value.padX}px`,
  height: `${sz.value.h}px`,
  borderRadius: 'var(--zm-r-md)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: `${sz.value.gap}px`,
  cursor: isBlocked.value ? 'not-allowed' : 'pointer',
  opacity: isBlocked.value ? '0.65' : '1',
  width: props.full ? '100%' : 'auto',
  transition: 'background var(--zm-d-fast) var(--zm-ease)',
  whiteSpace: 'nowrap' as const,
}))
</script>

<template>
  <button :style="buttonStyle" :disabled="isBlocked" @mouseenter="hovered = true" @mouseleave="hovered = false" @click="$emit('click')">
    <ZmIcon v-if="icon && !loading" :name="icon" :size="sz.icon" />
    <slot />
    <ZmSpinner v-if="loading" :size="sz.icon" />
    <ZmIcon v-else-if="iconRight" :name="iconRight" :size="sz.icon" />
  </button>
</template>
