<script setup lang="ts">
const route = useRoute()
const { startOAuth } = useAuth()

const provider = route.params.provider as 'google' | 'linkedin' | 'apple'

type Stage = 'loading' | 'success' | 'error'
const stage = ref<Stage>('loading')
const stepText = ref('Validating security token…')
const errorMsg = ref('')
const retrying = ref(false)

const pageTitle = ref('Signing in — Zeemic')
useHead({ title: pageTitle })

onMounted(async () => {
  const code = route.query.code as string | undefined
  const state = route.query.state as string | undefined
  const oauthError = route.query.error as string | undefined

  // Provider returned an explicit error (e.g. user denied consent)
  if (oauthError) {
    return setError(decodeURIComponent(String(oauthError)).replace(/_/g, ' '))
  }

  // Read pending OAuth session from sessionStorage
  let pending: { state: string; codeVerifier: string; returnTo: string; provider: string } | null = null
  try {
    const raw = sessionStorage.getItem('oauth_pending')
    if (raw) pending = JSON.parse(raw)
  } catch {
    // storage unavailable or corrupted
  }

  if (!code || !state || !pending) {
    return setError('Missing sign-in parameters. Please try again.')
  }

  // Delete immediately — single-use, prevents replay attacks
  sessionStorage.removeItem('oauth_pending')

  if (state !== pending.state) {
    return setError('Security validation failed. Please sign in again.')
  }

  // Strip code and state from the URL before doing anything else
  window.history.replaceState({}, '', route.path)

  stepText.value = 'Establishing session…'

  try {
    const res = await $fetch<any>(`/api/auth/oauth/${provider}/exchange`, {
      method: 'POST',
      body: { code, codeVerifier: pending.codeVerifier },
      credentials: 'include',
    })

    if (res?.data) {
      useAuthStore().setUser({
        id: res.data.userId,
        firstName: '',
        lastName: '',
        email: res.data.email,
        role: res.data.role,
      })
    }

    stage.value = 'success'
    await new Promise((r) => setTimeout(r, 700))
    await navigateTo(pending.returnTo || '/dashboard', { replace: true })
  } catch (err: any) {
    const msg =
      err?.data?.statusMessage ?? err?.message ?? 'Sign-in failed. Please try again.'
    setError(msg)
  }
})

function setError(msg: string) {
  errorMsg.value = msg
  stage.value = 'error'
  pageTitle.value = 'Sign-in failed — Zeemic'
}

async function retry() {
  retrying.value = true
  await startOAuth(provider)
}
</script>

<template>
  <div :style="{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--zm-paper)', padding: '32px 20px' }">
    <div :style="{ width: '100%', maxWidth: '400px', textAlign: 'center' }">
      <NuxtLink to="/" :style="{ display: 'inline-block', marginBottom: '40px', textDecoration: 'none' }">
        <ZmWordmark :height="24" />
      </NuxtLink>

      <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-xl)', padding: '48px 36px', boxShadow: 'var(--zm-shadow-md)' }">

        <!-- Loading -->
        <template v-if="stage === 'loading'">
          <div :style="{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--zm-ink-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }">
            <svg
              width="24" height="24" viewBox="0 0 24 24"
              fill="none" stroke="var(--zm-ink-700)" stroke-width="2.2"
              stroke-linecap="round" stroke-linejoin="round"
              :style="{ animation: 'zm-spin 0.8s linear infinite' }"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </div>
          <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '26px', lineHeight: '1.15', letterSpacing: '-0.02em', margin: '0 0 10px' }">
            Completing sign-in…
          </h1>
          <p :style="{ font: '400 13.5px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0' }">
            {{ stepText }}
          </p>
        </template>

        <!-- Success -->
        <template v-else-if="stage === 'success'">
          <div :style="{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--zm-green-50, #f0fdf4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }">
            <ZmIcon name="check_circle" :size="26" color="var(--zm-green-600, #16a34a)" />
          </div>
          <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '26px', lineHeight: '1.15', letterSpacing: '-0.02em', margin: '0 0 10px' }">
            Signed in successfully
          </h1>
          <p :style="{ font: '400 13.5px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0' }">
            Taking you in…
          </p>
        </template>

        <!-- Error -->
        <template v-else>
          <div :style="{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--zm-coral-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }">
            <ZmIcon name="alert_circle" :size="26" color="var(--zm-coral-500)" />
          </div>
          <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '26px', lineHeight: '1.15', letterSpacing: '-0.02em', margin: '0 0 10px' }">
            Sign-in failed
          </h1>
          <p :style="{ font: '400 13.5px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0 0 28px' }">
            {{ errorMsg }}
          </p>
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '10px' }">
            <ZmButton
              variant="primary" size="md" :full="true"
              :loading="retrying" :disabled="retrying"
              @click="retry"
            >
              Retry sign-in
            </ZmButton>
            <NuxtLink
              to="/login"
              :style="{ font: '500 13.5px var(--zm-font-body)', color: 'var(--zm-ink-700)', textDecoration: 'none' }"
            >
              Back to sign in
            </NuxtLink>
          </div>
        </template>

      </div>
    </div>
  </div>
</template>

<style>
@keyframes zm-spin {
  to { transform: rotate(360deg); }
}
</style>
