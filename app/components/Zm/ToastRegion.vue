<script setup lang="ts">
const { toasts, dismiss } = useToast()
</script>

<template>
  <Teleport to="body">
    <div :style="{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      width: 'min(360px, calc(100vw - 40px))',
      pointerEvents: 'none',
    }">
      <TransitionGroup name="zm-toast" tag="div" :style="{ display: 'flex', flexDirection: 'column', gap: '10px' }">
        <div v-for="toast in toasts" :key="toast.id" :style="{ pointerEvents: 'auto' }">
          <ZmToast :tone="toast.tone" :message="toast.message" @dismiss="dismiss(toast.id)" />
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style>
.zm-toast-enter-active { transition: all 260ms cubic-bezier(0.34, 1.4, 0.64, 1); }
.zm-toast-leave-active { transition: all 180ms ease-in; position: absolute; }
.zm-toast-enter-from   { opacity: 0; transform: translateX(48px) scale(0.96); }
.zm-toast-leave-to     { opacity: 0; transform: translateX(48px) scale(0.96); }
.zm-toast-move         { transition: transform 220ms ease; }
</style>
