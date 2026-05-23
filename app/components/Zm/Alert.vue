<script setup lang="ts">
const props = defineProps<{
  tone?: 'error' | 'success' | 'warning' | 'info'
  title?: string
  dismissible?: boolean
}>()

defineEmits<{ dismiss: [] }>()

const config = computed(() => ({
  error:   { bg: 'var(--zm-danger-bg, #fef2f2)',  border: 'var(--zm-coral-500, #E84A1F)', fg: 'var(--zm-coral-600, #c53514)', icon: 'alert_circle' },
  success: { bg: 'var(--zm-success-bg, #f0fdf4)', border: 'var(--zm-success, #16a34a)',   fg: 'var(--zm-success, #16a34a)',   icon: 'check' },
  warning: { bg: 'var(--zm-warning-bg, #fffbeb)', border: 'var(--zm-warning, #d97706)',   fg: 'var(--zm-warning, #d97706)',   icon: 'alert_triangle' },
  info:    { bg: 'var(--zm-ink-50)',               border: 'var(--zm-ink-300, #9ca3af)',   fg: 'var(--zm-ink-700)',            icon: 'info' },
}[props.tone ?? 'info']))
</script>

<template>
  <div :style="{
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '11px 14px',
    background: config.bg,
    borderRadius: 'var(--zm-r-md)',
    borderLeft: `3px solid ${config.border}`,
  }">
    <ZmIcon :name="config.icon" :size="15" :color="config.fg" :style="{ flexShrink: 0, marginTop: '1px' }" />
    <div :style="{ flex: 1, minWidth: 0 }">
      <div v-if="title" :style="{ font: '600 13px var(--zm-font-body)', color: config.fg, marginBottom: '3px' }">{{ title }}</div>
      <div :style="{ font: '400 13px/1.45 var(--zm-font-body)', color: config.fg }"><slot /></div>
    </div>
    <button
      v-if="dismissible"
      :style="{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0', color: config.fg, opacity: '0.55', display: 'flex', alignItems: 'center', flexShrink: 0 }"
      @click="$emit('dismiss')"
    >
      <ZmIcon name="close" :size="14" />
    </button>
  </div>
</template>
