<script setup lang="ts">
const props = defineProps<{
  modelValue?: string
  options?: string[]
  placeholder?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const focused = ref(false)

const h = computed(() => ({ sm: '36px', md: '40px', lg: '44px' }[props.size ?? 'md']))
</script>

<template>
  <div
    :style="{
      position: 'relative',
      display: 'flex', alignItems: 'center',
      height: h, paddingLeft: '12px',
      background: disabled ? 'var(--zm-ink-50)' : 'var(--zm-white)',
      border: `1px solid ${focused ? 'var(--zm-ink-700)' : 'var(--zm-border)'}`,
      borderRadius: 'var(--zm-r-md)',
      transition: 'border-color var(--zm-d-fast) var(--zm-ease)',
    }"
  >
    <select
      :value="modelValue"
      :disabled="disabled"
      :style="{
        flex: '1', border: 'none', outline: 'none', background: 'transparent',
        font: '400 14px var(--zm-font-body)', color: modelValue ? 'var(--zm-ink-900)' : 'var(--zm-fg-muted)',
        cursor: disabled ? 'not-allowed' : 'pointer', paddingRight: '28px',
        appearance: 'none', WebkitAppearance: 'none',
      }"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      @focus="focused = true"
      @blur="focused = false"
    >
      <option v-if="placeholder" value="" disabled :selected="!modelValue">{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt" :value="opt">{{ opt }}</option>
      <option v-if="!options && modelValue" :value="modelValue" selected>{{ modelValue }}</option>
    </select>
    <ZmIcon name="chevron_down" :size="14" color="var(--zm-fg-muted)" :style="{ position: 'absolute', right: '10px', pointerEvents: 'none' }" />
  </div>
</template>
