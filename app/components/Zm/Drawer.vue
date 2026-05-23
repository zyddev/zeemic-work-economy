<script setup lang="ts">
const props = defineProps<{
  open?: boolean
  title?: string
  subtitle?: string
  width?: number
}>()

const emit = defineEmits<{ close: [] }>()

const panelWidth = computed(() => `${props.width ?? 480}px`)

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
    <Transition name="zm-drawer-overlay">
      <div
        v-if="open"
        style="position:fixed; inset:0; z-index:100"
        @click="onBackdropClick"
      >
        <!-- Backdrop -->
        <div style="position:absolute; inset:0; background:rgba(11,15,13,0.55); backdrop-filter:blur(8px)" />

        <!-- Panel -->
        <Transition name="zm-drawer-panel" appear>
          <div
            v-if="open"
            :style="{
              position: 'absolute',
              top: '0',
              right: '0',
              bottom: '0',
              width: panelWidth,
              background: 'var(--zm-paper)',
              boxShadow: 'var(--zm-shadow-xl)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }"
            @click.stop
          >
            <!-- Header -->
            <div style="padding:20px 28px; border-bottom:1px solid var(--zm-border); display:flex; align-items:center; justify-content:space-between; flex-shrink:0">
              <div>
                <p v-if="subtitle" class="zm-eyebrow" style="margin:0 0 4px">{{ subtitle }}</p>
                <span v-if="title" style="font:600 15px var(--zm-font-body); color:var(--zm-ink-900)">{{ title }}</span>
              </div>
              <ZmIconButton icon="close" :size="32" @click="emit('close')" />
            </div>

            <!-- Body -->
            <div style="flex:1; overflow-y:auto; padding:28px">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" style="padding:20px 28px; border-top:1px solid var(--zm-border); flex-shrink:0">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.zm-drawer-overlay-enter-active,
.zm-drawer-overlay-leave-active {
  transition: opacity 280ms cubic-bezier(0.22, 1, 0.36, 1);
}
.zm-drawer-overlay-enter-from,
.zm-drawer-overlay-leave-to {
  opacity: 0;
}

.zm-drawer-panel-enter-active,
.zm-drawer-panel-leave-active {
  transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
}
.zm-drawer-panel-enter-from,
.zm-drawer-panel-leave-to {
  transform: translateX(100%);
}
.zm-drawer-panel-enter-to,
.zm-drawer-panel-leave-from {
  transform: translateX(0);
}
</style>
