<script setup lang="ts">
defineProps<{
  title?: string
  back?: boolean
  leftLabel?: string
  transparent?: boolean
}>()

defineEmits<{ back: [] }>()
</script>

<template>
  <div :style="{
    flexShrink: 0,
    background: transparent ? 'transparent' : 'rgba(245,241,232,0.94)',
    backdropFilter: transparent ? 'none' : 'saturate(180%) blur(12px)',
    borderBottom: transparent ? 'none' : '0.5px solid var(--zm-border)',
    height: '48px', display: 'flex', alignItems: 'center',
    padding: '0 12px', position: 'relative', zIndex: 4,
  }">
    <button
      v-if="back !== false"
      @click="$emit('back')"
      :style="{
        border: 'none', background: 'transparent', padding: '8px 8px 8px 4px',
        display: 'inline-flex', alignItems: 'center', gap: '2px', cursor: 'pointer',
        color: 'var(--zm-ink-700)', font: '500 17px var(--zm-font-body)',
      }"
    >
      <ZmIcon name="chevron_left" :size="20" :stroke="2.2" />
      <span v-if="leftLabel">{{ leftLabel }}</span>
    </button>
    <span v-else :style="{ width: '60px' }" />

    <div :style="{
      position: 'absolute', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none',
      font: '600 16px var(--zm-font-body)', color: 'var(--zm-ink-950)',
      letterSpacing: '-0.005em',
    }">{{ title }}</div>

    <div :style="{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '4px' }">
      <slot name="right" />
    </div>
  </div>
</template>
