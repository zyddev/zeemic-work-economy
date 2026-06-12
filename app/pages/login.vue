<script setup lang="ts">
useHead({ title: 'Sign in — Zeemic' })

const method = ref<'password' | 'otc'>('password')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const submitting = ref(false)
const formError = ref('')
const successMessage = ref('')

const { login, requestOTC, startOAuth } = useAuth()
const route = useRoute()
const { isMobile } = useBreakpoint()
const next = computed(() => (route.query.next as string) || '/dashboard')

onMounted(() => {
  if (route.query.message === 'password_updated') {
    successMessage.value = 'Your password has been updated. Sign in below.'
  }
})

watch(method, () => { formError.value = '' })

async function signIn() {
  formError.value = ''
  if (!email.value.includes('@')) { formError.value = 'Please enter a valid email address.'; return }
  submitting.value = true
  try {
    const result = await login(email.value, password.value)
    await navigateTo(result?.redirect ?? next.value)
  } catch (err: any) {
    const status = err?.data?.statusCode ?? err?.statusCode ?? err?.response?.status
    if (status === 401) formError.value = 'Invalid email or password.'
    else if (status === 429) formError.value = 'Too many attempts. Please try again later.'
    else if (status === 503) formError.value = 'Service temporarily unavailable. Please try again later.'
    else formError.value = err?.data?.message ?? err?.message ?? 'Sign in failed. Please try again.'
  } finally {
    submitting.value = false
  }
}

async function sendOTC() {
  formError.value = ''
  if (!email.value.includes('@')) { formError.value = 'Please enter your email first.'; return }
  submitting.value = true
  try {
    await requestOTC(email.value)
  } catch {
    // always proceeds — user enumeration prevention
  } finally {
    submitting.value = false
  }
  await navigateTo(`/auth/verify?email=${encodeURIComponent(email.value)}&next=${encodeURIComponent(next.value)}`)
}
</script>

<template>
  <!-- Mobile -->
  <template v-if="isMobile">
    <div :style="{ display: 'flex', flexDirection: 'column', minHeight: '100svh', background: 'var(--zm-paper)' }">

      <ZmMNavBar :back="false" title="Sign in">
        <template #right>
          <button type="button" :style="{ font: '500 15px var(--zm-font-body)', color: 'var(--zm-ink-700)', border: 'none', background: 'transparent', padding: '8px 10px', cursor: 'pointer' }">Help</button>
        </template>
      </ZmMNavBar>

      <!-- Scrollable area -->
      <div :style="{ flex: '1', overflowY: 'auto', padding: '8px 0' }">

        <!-- Wordmark -->
        <div :style="{ padding: '16px 20px 8px', display: 'flex', justifyContent: 'center' }">
          <ZmWordmark :height="28" />
        </div>

        <!-- Auth header -->
        <div :style="{ padding: '8px 20px 16px' }">
          <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '32px', lineHeight: '1.04', letterSpacing: '-0.025em', margin: '0 0 6px' }">Welcome <em style="font-style:italic">back.</em></h1>
          <p :style="{ font: '400 13.5px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0' }">Choose how you'd like to sign in.</p>
        </div>

        <!-- Main form area -->
        <div :style="{ padding: '0 20px' }">

          <!-- Method switcher -->
          <div :style="{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            padding: '4px', background: 'var(--zm-ink-50)',
            borderRadius: 'var(--zm-r-md)', marginBottom: '18px',
            border: '1px solid var(--zm-ink-100)',
          }">
            <button
              v-for="opt in [{ id: 'password', label: 'Password', icon: 'bolt' }, { id: 'otc', label: 'One-time code', icon: 'message' }]"
              :key="opt.id"
              type="button"
              :style="{
                height: '42px', border: 'none', cursor: 'pointer',
                background: method === opt.id ? 'var(--zm-white)' : 'transparent',
                color: method === opt.id ? 'var(--zm-ink-950)' : 'var(--zm-fg-muted)',
                borderRadius: 'var(--zm-r-sm)',
                font: (method === opt.id ? '600' : '500') + ' 13px var(--zm-font-body)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                boxShadow: method === opt.id ? 'var(--zm-shadow-xs)' : 'none',
                transition: 'all 120ms var(--zm-ease)',
              }"
              @click="method = opt.id as 'password' | 'otc'"
            >
              <ZmIcon :name="opt.icon" :size="14" :color="method === opt.id ? 'var(--zm-ink-700)' : 'var(--zm-fg-muted)'" />
              {{ opt.label }}
            </button>
          </div>

          <!-- Email field -->
          <ZmField label="Email" :required="true">
            <ZmInput v-model="email" type="email" :full="true" placeholder="you@example.com" leading-icon="message" size="lg" />
          </ZmField>

          <!-- Password fields -->
          <template v-if="method === 'password'">
            <div :style="{ marginTop: '12px' }">
              <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }">
                <label :style="{ font: '500 13px var(--zm-font-body)' }">Password</label>
                <NuxtLink to="/auth/forgot-password" :style="{ font: '500 12px var(--zm-font-body)', color: 'var(--zm-ink-700)', textDecoration: 'none' }">Forgot?</NuxtLink>
              </div>
              <ZmInput v-model="password" type="password" :full="true" placeholder="Enter your password" trailing-icon="eye" size="lg" />
            </div>
          </template>

          <!-- OTC note -->
          <p v-if="method === 'otc'" :style="{ marginTop: '8px', font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '8px 0 0' }">
            No password needed. We'll send a 6-digit code.
          </p>

          <!-- Success / error banner -->
          <ZmAlert v-if="successMessage" tone="success" :style="{ marginTop: '8px' }">{{ successMessage }}</ZmAlert>
          <ZmAlert v-if="formError" tone="error" :style="{ marginTop: '8px' }">{{ formError }}</ZmAlert>

          <!-- Submit button -->
          <ZmButton
            variant="primary" size="lg" :full="true" icon-right="arrow_right"
            :loading="submitting" :disabled="submitting"
            :style="{ marginTop: '22px' }"
            @click="method === 'password' ? signIn() : sendOTC()"
          >
            {{ method === 'password' ? 'Sign in' : 'Email me a code' }}
          </ZmButton>

          <!-- OAuth -->
          <div :style="{ marginTop: '16px' }">
            <div :style="{ position: 'relative', textAlign: 'center', marginBottom: '16px' }">
              <div :style="{ position: 'absolute', left: '0', right: '0', top: '50%', height: '1px', background: 'var(--zm-border)' }" />
              <span :style="{ position: 'relative', background: 'var(--zm-paper)', padding: '0 10px', font: '500 11px var(--zm-font-mono)', textTransform: 'uppercase', color: 'var(--zm-fg-muted)', letterSpacing: '0.06em' }">or sign in with</span>
            </div>
            <div :style="{ display: 'flex', flexDirection: 'column', gap: '10px' }">
              <button :style="{ height: '52px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--zm-white)', color: 'var(--zm-ink-950)', border: '1px solid var(--zm-border-strong)', borderRadius: 'var(--zm-r-md)', cursor: 'pointer', font: '600 14.5px var(--zm-font-body)' }" @click="startOAuth('google')">
                <svg width="20" height="20" viewBox="0 0 24 24" style="flex-shrink:0">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.97 10.97 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </button>
              <button :style="{ height: '52px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--zm-white)', color: 'var(--zm-ink-950)', border: '1px solid var(--zm-border-strong)', borderRadius: 'var(--zm-r-md)', cursor: 'pointer', font: '600 14.5px var(--zm-font-body)' }" @click="startOAuth('apple')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Sign in with Apple
              </button>
              <button :style="{ height: '52px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--zm-white)', color: 'var(--zm-ink-950)', border: '1px solid var(--zm-border-strong)', borderRadius: 'var(--zm-r-md)', cursor: 'pointer', font: '600 14.5px var(--zm-font-body)' }" @click="startOAuth('linkedin')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2" style="flex-shrink:0">
                  <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.27c-.96 0-1.74-.78-1.74-1.74s.78-1.74 1.74-1.74 1.74.78 1.74 1.74-.78 1.74-1.74 1.74zm13.5 12.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-11h2.88v1.5h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6v6.46z"/>
                </svg>
                Sign in with LinkedIn
              </button>
            </div>
          </div>

          <!-- New here? -->
          <p :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textAlign: 'center', marginTop: '22px', marginBottom: '32px' }">
            New here? <NuxtLink to="/signup" :style="{ color: 'var(--zm-ink-700)', fontWeight: '600', textDecoration: 'none' }">Create an account</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </template>

  <!-- Desktop -->
  <template v-else>
    <div class="zm-root" :style="{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }">

      <!-- Left: brand panel -->
      <div :style="{ background: 'var(--zm-ink-950)', color: 'var(--zm-paper)', padding: '64px 60px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }">
        <div aria-hidden :style="{ position: 'absolute', right: '-40px', top: '-40px', fontFamily: 'var(--zm-font-display)', fontSize: '320px', color: 'rgba(245,241,232,0.04)', letterSpacing: '-0.04em', fontStyle: 'italic', lineHeight: '1', pointerEvents: 'none', userSelect: 'none' }">z.</div>
        <NuxtLink to="/exchange" :style="{ textDecoration: 'none' }">
          <ZmWordmark :height="26" color="var(--zm-paper)" />
        </NuxtLink>
        <div :style="{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', maxWidth: '460px' }">
          <div class="zm-eyebrow" :style="{ color: 'var(--zm-gold-500)' }">Work, transacted</div>
          <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '56px', lineHeight: '1.02', letterSpacing: '-0.03em', margin: '14px 0 24px' }">The marketplace for <em style="font-style:italic">everyone</em> who works.</h2>
          <p :style="{ font: '400 17px/1.55 var(--zm-font-body)', color: 'var(--zm-fg-on-dark-muted)', margin: '0' }">Book skills, send quote requests, hire recruiters — all in one place. Pick the way you sign in. We support passwordless out of the box.</p>
          <div :style="{ marginTop: '36px', padding: '20px 0 0', borderTop: '1px solid var(--zm-border-on-dark)' }">
            <p :style="{ fontFamily: 'var(--zm-font-display)', fontStyle: 'italic', fontSize: '20px', lineHeight: '1.35', letterSpacing: '-0.015em', color: 'var(--zm-paper)', margin: '0' }">"Took me twelve seconds to send my first quote request. The product is calm in a way I forgot software could be."</p>
            <div :style="{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px' }">
              <ZmAvatar name="Adaeze Okoye" :size="28" />
              <div>
                <div :style="{ font: '600 13px var(--zm-font-body)' }">Adaeze Okoye</div>
                <div :style="{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-on-dark-muted)' }">CFO · Helio Capital</div>
              </div>
            </div>
          </div>
        </div>
        <div :style="{ font: '400 11px var(--zm-font-mono)', color: 'var(--zm-fg-on-dark-muted)', letterSpacing: '0.05em' }">© 2026 ZEEMIC · /login</div>
      </div>

      <!-- Right: form panel -->
      <div :style="{ padding: '56px 32px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: 'var(--zm-paper)' }">
        <div :style="{ width: '100%', maxWidth: '440px' }">

          <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-xl)', padding: '36px', boxShadow: 'var(--zm-shadow-md)' }">
            <div class="zm-eyebrow">Sign in</div>
            <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '36px', lineHeight: '1.04', letterSpacing: '-0.025em', margin: '8px 0 10px' }">Welcome <em style="font-style:italic">back.</em></h1>
            <p :style="{ font: '400 14px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0 0 20px' }">Pick how you'd like to sign in — password or a one-time code.</p>

            <!-- Success banner -->
            <ZmAlert v-if="successMessage" tone="success" :style="{ marginBottom: '16px' }">{{ successMessage }}</ZmAlert>

            <!-- Method switcher -->
            <div :style="{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              padding: '4px', background: 'var(--zm-ink-50)',
              borderRadius: 'var(--zm-r-md)', marginBottom: '22px',
              border: '1px solid var(--zm-ink-100)',
            }">
              <button
                v-for="opt in [{ id: 'password', label: 'Password', icon: 'bolt' }, { id: 'otc', label: 'One-time code', icon: 'message' }]"
                :key="opt.id"
                type="button"
                :style="{
                  height: '40px', border: 'none', cursor: 'pointer',
                  background: method === opt.id ? 'var(--zm-white)' : 'transparent',
                  color: method === opt.id ? 'var(--zm-ink-950)' : 'var(--zm-fg-muted)',
                  borderRadius: 'var(--zm-r-sm)',
                  font: (method === opt.id ? '600' : '500') + ' 13px var(--zm-font-body)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  boxShadow: method === opt.id ? 'var(--zm-shadow-xs)' : 'none',
                  transition: 'all 120ms var(--zm-ease)',
                }"
                @click="method = opt.id as 'password' | 'otc'"
              >
                <ZmIcon :name="opt.icon" :size="14" :color="method === opt.id ? 'var(--zm-ink-700)' : 'var(--zm-fg-muted)'" />
                {{ opt.label }}
              </button>
            </div>

            <!-- Password method -->
            <template v-if="method === 'password'">
              <div :style="{ marginBottom: '14px' }">
                <label :style="{ display: 'block', font: '500 13px var(--zm-font-body)', marginBottom: '6px' }">Email</label>
                <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', height: '40px', padding: '0 12px', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)' }">
                  <ZmIcon name="mail" :size="16" color="var(--zm-fg-muted)" />
                  <input
                    v-model="email"
                    type="email"
                    placeholder="you@example.com"
                    autofocus
                    :style="{ flex: '1', border: 'none', outline: 'none', background: 'transparent', font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg)' }"
                    @keydown.enter="signIn"
                  />
                </div>
              </div>
              <div :style="{ marginBottom: '20px' }">
                <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }">
                  <label :style="{ font: '500 13px var(--zm-font-body)' }">Password</label>
                  <NuxtLink to="/auth/forgot-password" :style="{ font: '500 12px var(--zm-font-body)', color: 'var(--zm-ink-700)', textDecoration: 'none' }">Forgot?</NuxtLink>
                </div>
                <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', height: '40px', padding: '0 12px', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)' }">
                  <ZmIcon name="lock" :size="16" color="var(--zm-fg-muted)" />
                  <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Enter your password"
                    :style="{ flex: '1', border: 'none', outline: 'none', background: 'transparent', font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg)' }"
                    @keydown.enter="signIn"
                  />
                  <button type="button" :style="{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center' }" @click="showPassword = !showPassword">
                    <ZmIcon :name="showPassword ? 'eye_off' : 'eye'" :size="16" color="var(--zm-fg-muted)" />
                  </button>
                </div>
              </div>
              <ZmAlert v-if="formError" tone="error" :style="{ margin: '-8px 0 12px' }">{{ formError }}</ZmAlert>
              <ZmButton variant="primary" size="lg" :full="true" icon-right="arrow_right" :loading="submitting" :disabled="submitting" @click="signIn">
                {{ submitting ? 'Signing in…' : 'Sign in' }}
              </ZmButton>
            </template>

            <!-- One-time code method -->
            <template v-else>
              <div :style="{ marginBottom: '20px' }">
                <label :style="{ display: 'block', font: '500 13px var(--zm-font-body)', marginBottom: '6px' }">Email</label>
                <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', height: '40px', padding: '0 12px', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)' }">
                  <ZmIcon name="mail" :size="16" color="var(--zm-fg-muted)" />
                  <input
                    v-model="email"
                    type="email"
                    placeholder="you@example.com"
                    autofocus
                    :style="{ flex: '1', border: 'none', outline: 'none', background: 'transparent', font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg)' }"
                    @keydown.enter="sendOTC"
                  />
                </div>
                <p :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '5px 0 0' }">We'll send a 6-digit code to this address.</p>
              </div>
              <ZmAlert v-if="formError" tone="error" :style="{ margin: '-8px 0 12px' }">{{ formError }}</ZmAlert>
              <ZmButton variant="primary" size="lg" :full="true" icon="message" icon-right="arrow_right" :loading="submitting" :disabled="submitting" @click="sendOTC">
                {{ submitting ? 'Sending code…' : 'Email me a 6-digit code' }}
              </ZmButton>
              <p :style="{ font: '400 11.5px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textAlign: 'center', marginTop: '12px' }">
                No password needed. You can set one later from <strong :style="{ color: 'var(--zm-ink-950)' }">Account settings</strong>.
              </p>
            </template>

            <ZmDivider label="or sign in with" style="margin:20px 0 16px" />

            <!-- SSO buttons -->
            <div :style="{ display: 'flex', flexDirection: 'column', gap: '8px' }">
              <button :style="{ width: '100%', height: '46px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--zm-white)', color: 'var(--zm-ink-950)', border: '1px solid var(--zm-border-strong)', borderRadius: 'var(--zm-r-md)', cursor: 'pointer', font: '600 14px var(--zm-font-body)', letterSpacing: '-0.005em' }" @click="startOAuth('google')">
                <svg width="20" height="20" viewBox="0 0 24 24" style="flex-shrink:0">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.97 10.97 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span :style="{ flex: '1', textAlign: 'center' }">Sign in with Google</span>
                <span :style="{ width: '20px' }" />
              </button>
              <button :style="{ width: '100%', height: '46px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--zm-white)', color: 'var(--zm-ink-950)', border: '1px solid var(--zm-border-strong)', borderRadius: 'var(--zm-r-md)', cursor: 'pointer', font: '600 14px var(--zm-font-body)', letterSpacing: '-0.005em' }" @click="startOAuth('apple')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span :style="{ flex: '1', textAlign: 'center' }">Sign in with Apple</span>
                <span :style="{ width: '20px' }" />
              </button>
              <button :style="{ width: '100%', height: '46px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--zm-white)', color: 'var(--zm-ink-950)', border: '1px solid var(--zm-border-strong)', borderRadius: 'var(--zm-r-md)', cursor: 'pointer', font: '600 14px var(--zm-font-body)', letterSpacing: '-0.005em' }" @click="startOAuth('linkedin')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2" style="flex-shrink:0">
                  <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.27c-.96 0-1.74-.78-1.74-1.74s.78-1.74 1.74-1.74 1.74.78 1.74 1.74-.78 1.74-1.74 1.74zm13.5 12.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-11h2.88v1.5h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6v6.46z"/>
                </svg>
                <span :style="{ flex: '1', textAlign: 'center' }">Sign in with LinkedIn</span>
                <span :style="{ width: '20px' }" />
              </button>
            </div>
          </div>

          <p :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textAlign: 'center', marginTop: '20px' }">
            New here? <NuxtLink to="/signup" :style="{ color: 'var(--zm-ink-700)', fontWeight: '600', textDecoration: 'none' }">Create an account</NuxtLink>
          </p>
        </div>
      </div>

    </div>
  </template>
</template>
