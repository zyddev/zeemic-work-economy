<script setup lang="ts">
const props = defineProps<{
  name?: string
  size?: number
  src?: string
  square?: boolean
  ring?: boolean
}>()

const PALETTE = [
  ['#1A4D3A', '#ECF3EF'],
  ['#C9A634', '#FDF6DF'],
  ['#C73E1D', '#FBE0D5'],
  ['#1E4B68', '#D9E8F3'],
  ['#5F5F58', '#ECECE3'],
  ['#7A4E2D', '#F1E4D4'],
  ['#3D5A3D', '#E0EAE0'],
  ['#6B3A6B', '#EFE0EE'],
]

function hashName(name = '') {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0
  return PALETTE[Math.abs(h) % PALETTE.length]
}

function getInitials(name = '') {
  const p = name.trim().split(/\s+/)
  return ((p[0]?.[0] || '') + (p[p.length - 1]?.[0] || '')).toUpperCase()
}

const size = computed(() => props.size ?? 36)
const colors = computed(() => hashName(props.name))
const fg = computed(() => colors.value[0])
const bg = computed(() => colors.value[1])
const initials = computed(() => getInitials(props.name))
const radius = computed(() => props.square ? Math.max(4, size.value * 0.18) + 'px' : '50%')

const style = computed(() => ({
  width: `${size.value}px`,
  height: `${size.value}px`,
  flexShrink: '0',
  borderRadius: radius.value,
  background: props.src ? `center/cover url(${props.src})` : bg.value,
  color: fg.value,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'var(--zm-font-body)',
  fontWeight: '600',
  fontSize: `${Math.round(size.value * 0.4)}px`,
  letterSpacing: '-0.01em',
  boxShadow: props.ring ? '0 0 0 2px var(--zm-paper), 0 0 0 4px var(--zm-ink-700)' : 'none',
}))
</script>

<template>
  <div :style="style">{{ !src ? initials : '' }}</div>
</template>
