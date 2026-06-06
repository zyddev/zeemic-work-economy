<script setup lang="ts">
useHead({ title: 'Sign in — Zeemic' })

const method = ref<'password' | 'otc'>('password')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const submitting = ref(false)
const formError = ref('')
const successMessage = ref('')

const { login, requestOTC } = useAuth()
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

          </div>

          <p :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textAlign: 'center', marginTop: '20px' }">
            New here? <NuxtLink to="/signup" :style="{ color: 'var(--zm-ink-700)', fontWeight: '600', textDecoration: 'none' }">Create an account</NuxtLink>
          </p>
        </div>
      </div>

    </div>
  </template>
</template>
