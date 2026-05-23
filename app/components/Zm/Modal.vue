<script setup lang="ts">
const props = defineProps<{
  open?: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg'
  hideClose?: boolean
  noPadding?: boolean
}>()

const emit = defineEmits<{ close: [] }>()

const panelWidth = computed(() => ({
  sm: '400px',
  md: '560px',
  lg: '760px',
}[props.size ?? 'md'])
)

function onBackdropClick(e: MouseEvent) {
  if (e.target === e.currentTarget) emit('close')
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="zm-modal">
      <div
        v-if="open"
        style="position:fixed; inset:0; background:rgba(11,15,13,0.55); backdrop-filter:blur(8px); z-index:100; display:flex; align-items:center; justify-content:center; padding:24px"
        @click="onBackdropClick"
      >
        <div
          :style="{
            width: '100%',
            maxWidth: panelWidth,
            background: 'var(--zm-paper)',
            borderRadius: 'var(--zm-r-xl)',
            boxShadow: 'var(--zm-shadow-xl)',
            overflow: 'hidden',
            position: 'relative',
          }"
          @click.stop
        >
          <!-- Header with title -->
          <div
            v-if="title"
            style="display:flex; align-items:center; justify-content:space-between; padding:20px 24px; border-bottom:1px solid var(--zm-border)"
          >
            <span style="font:600 16px var(--zm-font-body); color:var(--zm-ink-900)">{{ title }}</span>
            <ZmIconButton
              v-if="!hideClose"
              icon="close"
              :size="28"
              @click="emit('close')"
            />
          </div>

          <!-- Close button when no title -->
          <ZmIconButton
            v-else-if="!hideClose"
            icon="close"
            :size="28"
            style="position:absolute; top:16px; right:16px; z-index:1"
            @click="emit('close')"
          />

          <!-- Body -->
          <div :style="noPadding ? {} : { padding: '24px' }">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.zm-modal-enter-active,
.zm-modal-leave-active {
  transition: opacity 150ms ease;
}
.zm-modal-enter-active .zm-panel,
.zm-modal-leave-active .zm-panel {
  transition: transform 150ms ease, opacity 150ms ease;
}
.zm-modal-enter-from,
.zm-modal-leave-to {
  opacity: 0;
}
</style>
