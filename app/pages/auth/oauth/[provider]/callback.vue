<script setup lang="ts">
// OAuth relay page — Google/LinkedIn redirect here with ?code=&state=.
// We immediately forward the full query string to the backend callback endpoint,
// which validates state (via the oauth.sid session cookie the browser carries
// automatically), exchanges the code, sets httpOnly auth cookies, and redirects
// the user to /dashboard.
definePageMeta({ layout: false })

const route = useRoute()
const { public: { appUrl } } = useRuntimeConfig()

onMounted(() => {
  const provider = route.params.provider as string
  window.location.replace(`${appUrl}/auth/oauth/${provider}/callback${window.location.search}`)
})
</script>

<template>
  <div
    class="zm-root"
    :style="{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      background: 'var(--zm-paper)',
    }"
  >
    <ZmWordmark :height="22" />
    <p :style="{ font: '400 15px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: 0 }">
      Completing sign-in…
    </p>
  </div>
</template>
