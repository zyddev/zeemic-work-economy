<script setup lang="ts">
const props = defineProps<{
  modelValue?: string
  label?: string
  placeholder?: string
  type?: string
  icon?: string
  iconRight?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  size?: 'sm' | 'md' | 'lg'
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'iconRightClick': []
}>()

const focused = ref(false)

const sizeMap = computed(() => ({
  sm: { height: 36, fontSize: 13, padding: 14 },
  md: { height: 44, fontSize: 14, padding: 14 },
  lg: { height: 52, fontSize: 15, padding: 14 },
}[props.size ?? 'md']))

const fieldStyle = computed(() => ({
  display: 'flex',
  alignItems: 'center',
  height: `${sizeMap.value.height}px`,
  padding: `0 ${sizeMap.value.padding}px`,
  gap: '8px',
  background: props.disabled ? 'var(--zm-ink-50)' : 'var(--zm-white)',
  border: `1px solid ${props.error ? 'var(--zm-coral-500)' : focused.value ? 'var(--zm-ink-700)' : 'var(--zm-border)'}`,
  borderRadius: 'var(--zm-r-md)',
  outline: focused.value ? `2px solid var(--zm-ink-700)` : 'none',
  outlineOffset: '2px',
  transition: 'border-color var(--zm-d-fast) var(--zm-ease), outline var(--zm-d-fast) var(--zm-ease)',
  cursor: props.disabled ? 'not-allowed' : 'text',
}))

const inputStyle = computed(() => ({
  flex: '1',
  border: 'none',
  outline: 'none',
  background: 'transparent',
  font: `400 ${sizeMap.value.fontSize}px var(--zm-font-body)`,
  color: props.disabled ? 'var(--zm-fg-muted)' : 'var(--zm-ink-900)',
  cursor: props.disabled ? 'not-allowed' : 'text',
  minWidth: '0',
}))
</script>

<template>
  <div style="display:flex; flex-direction:column; gap:0">
    <label
      v-if="label"
      class="zm-eyebrow"
      style="display:block; margin-bottom:6px; cursor:default"
    >
      {{ label }}<span v-if="required" style="color:var(--zm-coral-500); margin-left:2px">*</span>
    </label>

    <div :style="fieldStyle" @click="($el as HTMLElement).querySelector('input')?.focus()">
      <ZmIcon v-if="icon" :name="icon" :size="16" style="color:var(--zm-fg-muted); flex-shrink:0" />
      <input
        :value="modelValue"
        :type="type ?? 'text'"
        :placeholder="placeholder"
        :disabled="disabled"
        :style="inputStyle"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @focus="focused = true"
        @blur="focused = false"
      />
      <button
        v-if="iconRight"
        type="button"
        style="background:none; border:none; padding:0; cursor:pointer; display:flex; align-items:center; color:var(--zm-fg-muted); flex-shrink:0"
        :disabled="disabled"
        @click.stop="emit('iconRightClick')"
      >
        <ZmIcon :name="iconRight" :size="16" />
      </button>
    </div>

    <p
      v-if="error"
      style="margin:4px 0 0; font:500 12px var(--zm-font-body); color:var(--zm-coral-500)"
    >{{ error }}</p>
    <p
      v-else-if="hint"
      style="margin:4px 0 0; font:400 12px var(--zm-font-body); color:var(--zm-fg-muted)"
    >{{ hint }}</p>
  </div>
</template>
