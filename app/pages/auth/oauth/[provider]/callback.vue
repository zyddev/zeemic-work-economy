<script setup lang="ts">
definePageMeta({ layout: false })

const route = useRoute()
const { startOAuth } = useAuth()

const provider = route.params.provider as 'google' | 'linkedin' | 'apple'

// ── Provider metadata ─────────────────────────────────────────────────────────
const PROVIDER_META: Record<string, { label: string; color: string; logoPath: string }> = {
  google: {
    label: 'Google',
    color: '#4285F4',
    logoPath: 'M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.97 10.97 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93l3.66-2.84z M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z',
  },
  linkedin: {
    label: 'LinkedIn',
    color: '#0A66C2',
    logoPath: 'M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.27c-.96 0-1.74-.78-1.74-1.74s.78-1.74 1.74-1.74 1.74.78 1.74 1.74-.78 1.74-1.74 1.74zm13.5 12.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-11h2.88v1.5h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6v6.46z',
  },
  apple: {
    label: 'Apple',
    color: '#000000',
    logoPath: 'M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z',
  },
}

const meta = computed(() => PROVIDER_META[provider] ?? PROVIDER_META.google!)

// ── Error catalogue ───────────────────────────────────────────────────────────
type OAuthError = {
  title: string
  titleEmphasis: string
  alert: string
  code: string
  failAt: number
}

const OAUTH_ERRORS: Record<string, OAuthError> = {
  state_mismatch: {
    title: 'Security check',
    titleEmphasis: 'failed.',
    alert: "The state token from the provider didn't match what we issued. To protect your account we stopped the sign-in.",
    code: 'ERR_OAUTH_STATE_MISMATCH',
    failAt: 0,
  },
  access_denied: {
    title: 'Permission',
    titleEmphasis: 'declined.',
    alert: "You cancelled the request, or the provider declined to share your account details. No data was exchanged.",
    code: 'ERR_OAUTH_ACCESS_DENIED',
    failAt: 0,
  },
  missing_code: {
    title: 'Something went',
    titleEmphasis: 'missing.',
    alert: "The provider redirected back without an authorization code, so we have nothing to exchange. This is usually temporary.",
    code: 'ERR_OAUTH_NO_CODE',
    failAt: 1,
  },
  server_error: {
    title: 'We hit a',
    titleEmphasis: 'snag.',
    alert: "We couldn't complete the token exchange with the provider. Our team has been notified automatically.",
    code: 'ERR_OAUTH_EXCHANGE_500',
    failAt: 1,
  },
  network: {
    title: 'Connection',
    titleEmphasis: 'dropped.',
    alert: "We lost the connection while finishing your sign-in. Check your network and try again — nothing was charged or changed.",
    code: 'ERR_OAUTH_NETWORK',
    failAt: 2,
  },
}

// ── State machine ─────────────────────────────────────────────────────────────
type Stage = 'loading' | 'success' | 'error'
const stage = ref<Stage>('loading')
const currentStep = ref(0)
const errorKey = ref<keyof typeof OAUTH_ERRORS>('server_error')
const countdown = ref(3)
const retrying = ref(false)
const userFirstName = ref('')

const pageTitle = ref('Signing in — Zeemic')
useHead({ title: pageTitle })

const STEPS = [
  'Validating security token',
  'Exchanging authorization code',
  'Establishing your session',
]

const errorDetail = computed(() => OAUTH_ERRORS[errorKey.value] ?? OAUTH_ERRORS.server_error!)

// ── Countdown redirect on success ─────────────────────────────────────────────
let pendingReturnTo = '/dashboard'
let countdownTimer: ReturnType<typeof setInterval> | null = null

function startCountdown(returnTo: string) {
  pendingReturnTo = returnTo
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer!)
      navigateTo(pendingReturnTo, { replace: true })
    }
  }, 1000)
}

// ── OAuth exchange logic ──────────────────────────────────────────────────────
onMounted(async () => {
  const code = route.query.code as string | undefined
  const state = route.query.state as string | undefined
  const oauthError = route.query.error as string | undefined

  if (oauthError) {
    const key = oauthError === 'access_denied' ? 'access_denied' : 'server_error'
    return setError(key)
  }

  let pending: { state: string; codeVerifier: string; returnTo: string; provider: string } | null = null
  try {
    const raw = sessionStorage.getItem('oauth_pending')
    if (raw) pending = JSON.parse(raw)
  } catch { /* storage unavailable */ }

  if (!code || !state || !pending) {
    return setError('missing_code')
  }

  sessionStorage.removeItem('oauth_pending')

  if (state !== pending.state) {
    return setError('state_mismatch')
  }

  window.history.replaceState({}, '', route.path)

  // Step 1 complete — advance to step 2
  currentStep.value = 1

  try {
    await new Promise(r => setTimeout(r, 600))
    currentStep.value = 2

    const res = await $fetch<any>(`/api/auth/oauth/${provider}/exchange`, {
      method: 'POST',
      body: { code, codeVerifier: pending.codeVerifier },
      credentials: 'include',
    })

    if (res?.data) {
      const user = res.data
      userFirstName.value = user.firstName || user.email?.split('@')[0] || ''
      useAuthStore().setUser({
        id: user.userId ?? user.id,
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        email: user.email,
        role: user.role,
      })
    }

    currentStep.value = 3
    await new Promise(r => setTimeout(r, 400))
    stage.value = 'success'
    startCountdown(pending.returnTo || '/dashboard')
  } catch (err: any) {
    const status = err?.data?.statusCode ?? err?.statusCode ?? err?.response?.status
    const key = !navigator.onLine ? 'network' : status >= 500 ? 'server_error' : 'server_error'
    setError(key)
  }
})

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
})

function setError(key: keyof typeof OAUTH_ERRORS) {
  errorKey.value = key
  stage.value = 'error'
  pageTitle.value = 'Sign-in failed — Zeemic'
}

async function retry() {
  retrying.value = true
  await startOAuth(provider)
}
</script>

<template>
  <div class="zm-root" :style="{ minHeight: '100vh', background: 'var(--zm-paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }">
    <div :style="{ width: '100%', maxWidth: '420px' }">

      <!-- Wordmark -->
      <div :style="{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }">
        <NuxtLink to="/" :style="{ textDecoration: 'none' }">
          <ZmWordmark :height="24" />
        </NuxtLink>
      </div>

      <!-- Card -->
      <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-xl)', padding: '44px 36px', boxShadow: 'var(--zm-shadow-md)' }">

        <!-- ── Loading ──────────────────────────────────────────── -->
        <template v-if="stage === 'loading'">
          <!-- Exchange visual -->
          <div :style="{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }">
            <ExchangeVisual :provider="provider" :color="meta.color" :logo-path="meta.logoPath" state="loading" />
          </div>

          <div class="zm-eyebrow" :style="{ textAlign: 'center' }">Signing you in</div>
          <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '34px', lineHeight: '1.05', letterSpacing: '-0.025em', margin: '8px 0', textAlign: 'center' }">
            Completing sign-in<span :style="{ animation: 'zm-pulse 1.2s ease-in-out infinite', display: 'inline-block' }">…</span>
          </h1>
          <p :style="{ font: '400 14px/1.55 var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0 auto 22px', textAlign: 'center', maxWidth: '320px' }">
            Finishing your <strong :style="{ color: 'var(--zm-ink-950)' }">{{ meta.label }}</strong> sign-in. This usually takes a couple of seconds — please keep this tab open.
          </p>

          <!-- Step list -->
          <div :style="{ borderTop: '1px solid var(--zm-border)', paddingTop: '8px' }">
            <div
              v-for="(step, i) in STEPS"
              :key="i"
              :style="{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 0',
                borderBottom: i < STEPS.length - 1 ? '1px solid var(--zm-border)' : 'none',
                opacity: i > currentStep ? '0.35' : '1',
                transition: 'opacity 300ms var(--zm-ease)',
              }"
            >
              <!-- Done -->
              <span v-if="i < currentStep" :style="{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--zm-ink-950)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <!-- Active -->
              <span v-else-if="i === currentStep" :style="{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid var(--zm-ink-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }">
                <span :style="{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--zm-ink-700)', animation: 'zm-pulse 1.2s ease-in-out infinite' }" />
              </span>
              <!-- Pending -->
              <span v-else :style="{ width: '20px', height: '20px', borderRadius: '50%', border: '1.5px solid var(--zm-border-strong)', flexShrink: '0' }" />

              <span :style="{ font: `${i <= currentStep ? '500' : '400'} 13.5px var(--zm-font-body)`, color: i <= currentStep ? 'var(--zm-ink-950)' : 'var(--zm-fg-muted)' }">
                {{ step }}
              </span>
            </div>
          </div>
        </template>

        <!-- ── Success ─────────────────────────────────────────── -->
        <template v-else-if="stage === 'success'">
          <div :style="{ display: 'flex', justifyContent: 'center', marginBottom: '22px' }" class="zm-pop">
            <ExchangeVisual :provider="provider" :color="meta.color" :logo-path="meta.logoPath" state="success" />
          </div>

          <div :style="{ textAlign: 'center' }">
            <div class="zm-eyebrow" :style="{ color: 'var(--zm-success, #15803d)' }">Session established</div>
            <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '36px', lineHeight: '1.04', letterSpacing: '-0.025em', margin: '8px 0' }">
              Signed in <em style="font-style:italic">successfully.</em>
            </h1>
            <p :style="{ font: '400 14px/1.55 var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0 auto 24px', maxWidth: '330px' }">
              <template v-if="userFirstName">Welcome back, <strong :style="{ color: 'var(--zm-ink-950)' }">{{ userFirstName }}</strong>. We've</template>
              <template v-else>We've</template>
              set up your session — taking you to your dashboard now.
            </p>

            <ZmButton variant="primary" size="lg" :full="true" icon-right="arrow_right" @click="navigateTo(pendingReturnTo, { replace: true })">
              Continue to dashboard
            </ZmButton>

            <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px', font: '500 12.5px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--zm-ink-400)" stroke-width="2.2" stroke-linecap="round" :style="{ animation: 'zm-spin 1s linear infinite' }">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Redirecting in <strong :style="{ color: 'var(--zm-ink-950)', fontVariantNumeric: 'tabular-nums' }">{{ Math.max(0, countdown) }}s</strong>
            </div>
          </div>
        </template>

        <!-- ── Error ───────────────────────────────────────────── -->
        <template v-else>
          <div :style="{ display: 'flex', justifyContent: 'center', marginBottom: '22px' }" class="zm-fade-up">
            <ExchangeVisual :provider="provider" :color="meta.color" :logo-path="meta.logoPath" state="error" />
          </div>

          <div :style="{ textAlign: 'center' }" class="zm-fade-up">
            <div class="zm-eyebrow" :style="{ color: 'var(--zm-coral-600, #dc2626)' }">Sign-in stopped</div>
            <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '36px', lineHeight: '1.04', letterSpacing: '-0.025em', margin: '8px 0 14px' }">
              {{ errorDetail.title }} <em style="font-style:italic">{{ errorDetail.titleEmphasis }}</em>
            </h1>

            <ZmAlert tone="danger" :style="{ textAlign: 'left', marginBottom: '22px' }">
              {{ errorDetail.alert }}
            </ZmAlert>

            <div :style="{ display: 'flex', flexDirection: 'column', gap: '10px' }">
              <ZmButton variant="primary" size="lg" :full="true" icon="arrow_right" :loading="retrying" @click="retry">
                Try signing in again
              </ZmButton>
              <NuxtLink to="/login" :style="{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', height: '44px', font: '500 14px var(--zm-font-body)', color: 'var(--zm-ink-700)', textDecoration: 'none' }">
                <ZmIcon name="chevron_left" :size="14" color="var(--zm-ink-700)" />
                Back to sign-in
              </NuxtLink>
            </div>

            <!-- Error code + contact support -->
            <div :style="{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--zm-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }">
              <span :style="{ font: '500 11px var(--zm-font-mono)', color: 'var(--zm-fg-muted)', letterSpacing: '0.04em' }">
                {{ errorDetail.code }}
              </span>
              <a href="mailto:support@zeemic.com" :style="{ font: '500 12px var(--zm-font-body)', color: 'var(--zm-ink-700)', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }">
                Contact support <ZmIcon name="arrow_up_right" :size="13" color="var(--zm-ink-700)" />
              </a>
            </div>
          </div>
        </template>

      </div>

      <!-- Footer -->
      <p :style="{ font: '400 11px var(--zm-font-mono)', color: 'var(--zm-fg-muted)', textAlign: 'center', marginTop: '20px', letterSpacing: '0.04em' }">
        {{ meta.label }} · zeemic.com{{ route.path }}
      </p>
    </div>
  </div>
</template>

<!-- ── ExchangeVisual component ────────────────────────────────────────────── -->
<script lang="ts">
import { defineComponent, computed } from 'vue'

const ExchangeVisual = defineComponent({
  name: 'ExchangeVisual',
  props: {
    provider: { type: String, required: true },
    color: { type: String, required: true },
    logoPath: { type: String, required: true },
    state: { type: String as () => 'loading' | 'success' | 'error', required: true },
  },
  setup(props) {
    const arcColor = computed(() => {
      if (props.state === 'success') return 'var(--zm-success, #15803d)'
      if (props.state === 'error') return 'var(--zm-coral-500, #ef4444)'
      return props.color
    })
    return { arcColor }
  },
  template: `
    <div style="position:relative;width:88px;height:88px;display:flex;align-items:center;justify-content:center">
      <!-- Ring -->
      <svg width="88" height="88" viewBox="0 0 88 88" fill="none" style="position:absolute;inset:0">
        <circle cx="44" cy="44" r="40" :stroke="arcColor" stroke-width="1.5" stroke-opacity="0.2"/>
        <circle
          v-if="state === 'loading'"
          cx="44" cy="44" r="40"
          :stroke="arcColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-dasharray="60 192"
          style="transform-origin:center;animation:zm-spin 1.4s linear infinite"
        />
        <circle v-else cx="44" cy="44" r="40" :stroke="arcColor" stroke-width="2.5"/>
      </svg>

      <!-- Provider logo or state icon -->
      <div style="width:44px;height:44px;border-radius:12px;background:var(--zm-white);border:1px solid var(--zm-border);display:flex;align-items:center;justify-content:center;box-shadow:var(--zm-shadow-sm)">
        <template v-if="state === 'success'">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="arcColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
        </template>
        <template v-else-if="state === 'error'">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="arcColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/>
          </svg>
        </template>
        <template v-else>
          <svg width="22" height="22" viewBox="0 0 24 24" :fill="provider === 'google' ? 'none' : color">
            <template v-if="provider === 'google'">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.97 10.97 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </template>
            <template v-else>
              <path :d="logoPath" />
            </template>
          </svg>
        </template>
      </div>
    </div>
  `,
})

export { ExchangeVisual }
</script>

<style>
@keyframes zm-spin  { to { transform: rotate(360deg); } }
@keyframes zm-pulse { 0%, 100% { opacity: 0.35; transform: scale(0.7); } 50% { opacity: 1; transform: scale(1); } }
@keyframes zm-pop   { 0% { transform: scale(0.4); opacity: 0; } 60% { transform: scale(1.08); } 100% { transform: scale(1); opacity: 1; } }
@keyframes zm-fade-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.zm-pop     { animation: zm-pop 420ms var(--zm-ease, ease) both; }
.zm-fade-up { animation: zm-fade-up 360ms var(--zm-ease, ease) both; }
</style>
