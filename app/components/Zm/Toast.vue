<script setup lang="ts">
import type { ToastTone } from '~/composables/useToast'

const props = defineProps<{
  tone: ToastTone
  message: string
}>()

defineEmits<{ dismiss: [] }>()

const config = computed(() => ({
  error:   { bg: 'var(--zm-ink-950)', accent: 'var(--zm-coral-500, #E84A1F)', fg: 'var(--zm-paper)', icon: 'alert_circle' },
  success: { bg: 'var(--zm-ink-950)', accent: 'var(--zm-success, #16a34a)',   fg: 'var(--zm-paper)', icon: 'check' },
  warning: { bg: 'var(--zm-ink-950)', accent: 'var(--zm-warning, #d97706)',   fg: 'var(--zm-paper)', icon: 'alert_triangle' },
  info:    { bg: 'var(--zm-ink-950)', accent: 'var(--zm-gold-500)',            fg: 'var(--zm-paper)', icon: 'info' },
}[props.tone]))
</script>

<template>
  <div :style="{
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '13px 16px',
    background: config.bg,
    borderRadius: 'var(--zm-r-lg)',
    boxShadow: 'var(--zm-shadow-lg, 0 8px 24px rgba(0,0,0,0.18))',
    borderLeft: `3px solid ${config.accent}`,
    minWidth: '260px',
  }">
    <ZmIcon :name="config.icon" :size="16" :color="config.accent" :style="{ flexShrink: 0, marginTop: '1px' }" />
    <span :style="{ flex: 1, font: '500 13px/1.4 var(--zm-font-body)', color: config.fg }">{{ message }}</span>
    <button
      :style="{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0', color: 'rgba(245,241,232,0.45)', display: 'flex', alignItems: 'center', flexShrink: 0 }"
      @click="$emit('dismiss')"
    >
      <ZmIcon name="close" :size="14" />
    </button>
  </div>
</template>
