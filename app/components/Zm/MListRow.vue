<script setup lang="ts">
defineProps<{
  icon?: string
  title?: string
  subtitle?: string
  badge?: number | string
  danger?: boolean
  last?: boolean
  accessory?: boolean
}>()

defineEmits<{ click: [] }>()
</script>

<template>
  <div
    @click="$emit('click')"
    :style="{
      display: 'flex', alignItems: 'center', gap: '14px',
      padding: '14px 16px', background: 'var(--zm-white)',
      borderBottom: last ? 'none' : '0.5px solid var(--zm-border)',
      cursor: $attrs.onClick ? 'pointer' : 'default',
    }"
  >
    <slot name="leading">
      <div v-if="icon" :style="{
        width: '32px', height: '32px', borderRadius: '8px',
        background: danger ? 'var(--zm-coral-100)' : 'var(--zm-ink-50)',
        color: danger ? 'var(--zm-coral-600)' : 'var(--zm-ink-700)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }">
        <ZmIcon :name="icon" :size="16" />
      </div>
    </slot>

    <div :style="{ flex: 1, minWidth: 0 }">
      <div :style="{ font: '500 15px var(--zm-font-body)', color: danger ? 'var(--zm-coral-600)' : 'var(--zm-ink-950)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">{{ title }}</div>
      <div v-if="subtitle" :style="{ font: '400 12.5px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">{{ subtitle }}</div>
    </div>

    <slot name="accessory">
      <ZmBadge v-if="badge != null" tone="coral" size="sm">{{ badge }}</ZmBadge>
      <ZmIcon v-else-if="accessory !== false" name="chevron_right" :size="14" color="var(--zm-grey-400)" />
    </slot>
  </div>
</template>
