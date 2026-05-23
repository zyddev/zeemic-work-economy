<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
  label?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function toggle() {
  if (!props.disabled) emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <div
    style="display:inline-flex; align-items:center; gap:10px; cursor:pointer; user-select:none"
    :style="{ opacity: disabled ? '0.5' : '1', cursor: disabled ? 'not-allowed' : 'pointer' }"
    @click="toggle"
  >
    <div
      :style="{
        position: 'relative',
        width: '44px',
        height: '26px',
        borderRadius: '13px',
        background: modelValue ? 'var(--zm-ink-700)' : 'var(--zm-ink-200)',
        transition: 'background 120ms ease',
        flexShrink: '0',
      }"
    >
      <div
        :style="{
          position: 'absolute',
          top: '3px',
          left: modelValue ? 'calc(100% - 23px)' : '3px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
          transition: 'left 120ms ease',
        }"
      />
    </div>
    <span
      v-if="label"
      style="font:400 14px var(--zm-font-body); color:var(--zm-ink-900)"
    >{{ label }}</span>
  </div>
</template>
