<script setup lang="ts">
useHead({ title: 'Signing out — Zeemic' })

const { logout } = useAuth()

onMounted(async () => {
  await logout()
  await new Promise(resolve => setTimeout(resolve, 600))
  await navigateTo('/login', { replace: true })
})
</script>

<template>
  <div
    :style="{
      minHeight: '100vh',
      background: 'var(--zm-paper)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
    }"
  >
    <ZmWordmark :height="32" style="justify-content: center" />

    <div :style="{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }">
      <ZmSpinner :size="24" color="var(--zm-ink-700)" />
      <p :style="{ font: '400 15px var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0' }">
        Signing out...
      </p>
    </div>
  </div>
</template>
