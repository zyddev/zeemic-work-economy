<script setup lang="ts">
defineProps<{
  message?: string
  visible?: boolean
}>()
</script>

<template>
  <Teleport to="body">
    <Transition name="zm-loader">
      <div
        v-if="visible !== false"
        :style="{
          position: 'fixed',
          inset: '0',
          zIndex: '9999',
          background: 'rgba(11, 15, 13, 0.55)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
        }"
      >
        <ZmSpinner :size="36" color="var(--zm-paper)" />
        <p
          v-if="message"
          :style="{
            font: '500 14px var(--zm-font-body)',
            color: 'var(--zm-paper)',
            margin: '0',
            opacity: '0.8',
          }"
        >{{ message }}</p>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.zm-loader-enter-active,
.zm-loader-leave-active { transition: opacity 200ms ease; }
.zm-loader-enter-from,
.zm-loader-leave-to { opacity: 0; }
</style>
