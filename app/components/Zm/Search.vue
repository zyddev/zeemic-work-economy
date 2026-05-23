<script setup lang="ts">
const props = defineProps<{ placeholder?: string; modelValue?: string; size?: 'sm' | 'md' | 'lg'; icon?: string; actionLabel?: string }>()
defineEmits<{ 'update:modelValue': [string] }>()
const sz = computed(() => ({ sm: { h: 36, font: 13, pad: 10 }, md: { h: 44, font: 14, pad: 14 }, lg: { h: 56, font: 16, pad: 18 } }[props.size ?? 'md']))
</script>
<template>
  <div :style="{
    display: 'flex', alignItems: 'center', gap: '10px',
    height: `${sz.h}px`, padding: `0 ${sz.pad}px`,
    background: 'var(--zm-white)', border: '1px solid var(--zm-border)',
    borderRadius: 'var(--zm-r-md)', boxShadow: 'var(--zm-shadow-xs)',
  }">
    <ZmIcon :name="icon ?? 'search'" :size="sz.font + 4" color="var(--zm-fg-muted)" />
    <input :value="modelValue" :placeholder="placeholder ?? 'Search...'" :style="{ flex: '1', border: 'none', outline: 'none', background: 'transparent', font: `400 ${sz.font}px var(--zm-font-body)`, color: 'var(--zm-fg)' }" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" />
    <button v-if="actionLabel" :style="{ border: 'none', background: 'var(--zm-ink-900)', color: 'var(--zm-paper)', height: `${sz.h - 12}px`, padding: '0 14px', borderRadius: 'var(--zm-r-sm)', font: `600 ${sz.font - 1}px var(--zm-font-body)`, cursor: 'pointer' }">{{ actionLabel }}</button>
  </div>
</template>
