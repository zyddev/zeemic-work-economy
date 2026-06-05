<script setup lang="ts">
useHead({ title: 'Error — Zeemic' })

const route = useRoute()
const msg = computed(() => (route.query.msg as string) || 'Something went wrong. Please try again.')
</script>

<template>
  <div :style="{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--zm-paper)', padding: '32px 20px' }">
    <div :style="{ width: '100%', maxWidth: '400px', textAlign: 'center' }">
      <ZmWordmark :height="24" :style="{ marginBottom: '40px' }" />

      <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-xl)', padding: '40px 36px', boxShadow: 'var(--zm-shadow-md)' }">
        <div :style="{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--zm-coral-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }">
          <ZmIcon name="alert_circle" :size="24" color="var(--zm-coral-500)" />
        </div>

        <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '28px', lineHeight: '1.1', letterSpacing: '-0.02em', margin: '0 0 12px' }">
          Sign-in failed
        </h1>

        <p :style="{ font: '400 14px/1.55 var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0 0 28px' }">
          {{ msg }}
        </p>

        <NuxtLink
          to="/login"
          :style="{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: '44px', padding: '0 24px', background: 'var(--zm-ink-950)', color: 'var(--zm-paper)', borderRadius: 'var(--zm-r-md)', font: '600 14px var(--zm-font-body)', textDecoration: 'none' }"
        >
          Try again
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
