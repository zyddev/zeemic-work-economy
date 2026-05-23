<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title?: string
  modelValue?: boolean
}>()

defineEmits<{ 'update:modelValue': [v: boolean] }>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      @click.self="$emit('update:modelValue', false)"
      :style="{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(11,15,13,0.55)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'flex-end',
      }"
    >
      <div :style="{
        width: '100%', background: 'var(--zm-paper)',
        borderTopLeftRadius: '28px', borderTopRightRadius: '28px',
        maxHeight: '92vh', display: 'flex', flexDirection: 'column',
        paddingTop: '8px',
      }">
        <div :style="{ width: '40px', height: '4px', background: 'var(--zm-border-strong)', borderRadius: '2px', margin: '4px auto 8px' }" />
        <div :style="{ padding: '12px 20px 12px' }">
          <div v-if="eyebrow" class="zm-eyebrow">{{ eyebrow }}</div>
          <h2 v-if="title" :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '28px', letterSpacing: '-0.025em', margin: '6px 0 0', lineHeight: 1.05 }">{{ title }}</h2>
        </div>
        <div :style="{ flex: 1, overflowY: 'auto', padding: '4px 20px 16px' }">
          <slot />
        </div>
        <div v-if="$slots.footer" :style="{ padding: '12px 20px env(safe-area-inset-bottom, 32px)', borderTop: '1px solid var(--zm-border)', display: 'flex', flexDirection: 'column', gap: '8px' }">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
