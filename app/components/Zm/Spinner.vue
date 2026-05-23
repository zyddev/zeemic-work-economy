<script setup lang="ts">
defineProps<{
  size?: number
  color?: string
}>()
</script>

<template>
  <span
    :style="{
      display: 'inline-block',
      width: `${size ?? 16}px`,
      height: `${size ?? 16}px`,
      border: '2px solid currentColor',
      borderTopColor: 'transparent',
      borderRadius: '50%',
      animation: 'zm-spin 0.75s linear infinite',
      flexShrink: '0',
      color: color || 'currentColor',
    }"
  />
</template>
