<script setup lang="ts">
defineProps<{ label: string; value: string | number; delta?: string; deltaTone?: 'success' | 'danger' | 'warning'; icon?: string }>()
</script>
<template>
  <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '0' }">
    <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }">
      <span :style="{ font: '500 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }">{{ label }}</span>
      <ZmIcon v-if="icon" :name="icon" :size="16" color="var(--zm-fg-subtle)" />
    </div>
    <div :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '36px', lineHeight: '1', letterSpacing: '-0.02em', marginTop: '4px' }" class="zm-num-tab">{{ value }}</div>
    <div v-if="delta" :style="{ font: '500 12px var(--zm-font-body)', color: deltaTone === 'success' ? 'var(--zm-success)' : deltaTone === 'danger' ? 'var(--zm-danger)' : 'var(--zm-fg-muted)' }">{{ delta }}</div>
  </div>
</template>
