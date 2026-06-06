<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const code = String(props.error.statusCode ?? 500)
const allowed = ['404', '500', '403', '503']
const param = allowed.includes(code) ? code : '500'

// Forward to the /error page so it renders with the full design treatment.
// useRouter is not available in error.vue, so we use a meta redirect.
onMounted(() => {
  window.location.replace(`/error?code=${param}`)
})
</script>

<template>
  <!-- Blank while the redirect fires -->
  <div />
</template>
