<script setup lang="ts">
useHead({ title: 'Create account — Zeemic' })

const fullName = ref('')
const email = ref('')
const agreedToTerms = ref(false)
const submitting = ref(false)
const formError = ref('')

const { register, startOAuth } = useAuth()
const { isMobile } = useBreakpoint()
const router = useRouter()

async function sendCode() {
  formError.value = ''
  if (!fullName.value.trim()) { formError.value = 'Please enter your name.'; return }
  if (!email.value.includes('@')) { formError.value = 'Please enter a valid email.'; return }
  if (!agreedToTerms.value) { formError.value = 'Please agree to the Terms and Privacy policy.'; return }

  submitting.value = true
  try {
    await register(fullName.value, email.value)
    await navigateTo(`/auth/verify?email=${encodeURIComponent(email.value)}&next=/dashboard`)
  } catch (err: any) {
    formError.value = err?.data?.statusMessage ?? err?.message ?? 'Registration failed. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <!-- Mobile -->
  <template v-if="isMobile">
    <div :style="{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--zm-paper)' }">

      <ZmMNavBar title="Create account" leftLabel="Back" @back="router.back()" />

      <!-- Scrollable area -->
      <div :style="{ flex: '1', overflowY: 'auto', padding: '8px 0' }">

        <!-- Auth header -->
        <div :style="{ padding: '8px 20px 16px' }">
          <div class="zm-eyebrow">Sign up</div>
          <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '32px', lineHeight: '1.04', letterSpacing: '-0.025em', margin: '8px 0 6px' }">Join the <em style="font-style:italic">marketplace.</em></h1>
          <p :style="{ font: '400 13.5px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0' }">Email-only to start. You can add a password later.</p>
        </div>

        <!-- Form area -->
        <div :style="{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '14px' }">

          <!-- Full name -->
          <ZmField label="Full name" :required="true">
            <ZmInput v-model="fullName" :full="true" placeholder="First Last" leading-icon="user" size="lg" />
          </ZmField>

          <!-- Email -->
          <ZmField label="Email" :required="true" help="We'll send a 6-digit code.">
            <ZmInput v-model="email" type="email" :full="true" placeholder="you@example.com" leading-icon="message" size="lg" />
          </ZmField>

          <!-- Terms checkbox -->
          <label :style="{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }">
            <div
              :style="{
                width: '18px', height: '18px', borderRadius: '4px', flexShrink: '0', marginTop: '1px',
                background: agreedToTerms ? 'var(--zm-ink-700)' : 'var(--zm-white)',
                border: `1.5px solid ${agreedToTerms ? 'var(--zm-ink-700)' : 'var(--zm-border-strong)'}`,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--zm-paper)',
              }"
              @click="agreedToTerms = !agreedToTerms"
            >
              <ZmIcon v-if="agreedToTerms" name="check" :size="13" color="var(--zm-paper)" :stroke="2.6" />
            </div>
            <span :style="{ font: '400 12.5px/1.45 var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">
              I agree to the <strong>Terms</strong> and <strong>Privacy</strong>.
            </span>
          </label>

          <!-- Error -->
          <ZmAlert v-if="formError" tone="error">{{ formError }}</ZmAlert>

          <!-- Divider -->
          <div :style="{ position: 'relative', textAlign: 'center', margin: '0' }">
            <div :style="{ position: 'absolute', left: '0', right: '0', top: '50%', height: '1px', background: 'var(--zm-border)' }" />
            <span :style="{ position: 'relative', background: 'var(--zm-paper)', padding: '0 10px', font: '500 11px var(--zm-font-mono)', textTransform: 'uppercase', color: 'var(--zm-fg-muted)', letterSpacing: '0.06em' }">or sign up with</span>
          </div>

          <!-- SSO buttons -->
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '10px' }">
            <button :style="{ height: '52px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--zm-white)', color: 'var(--zm-ink-950)', border: '1px solid var(--zm-border-strong)', borderRadius: 'var(--zm-r-md)', cursor: 'pointer', font: '600 14.5px var(--zm-font-body)' }" @click="startOAuth('google')">
              <svg width="20" height="20" viewBox="0 0 24 24" style="flex-shrink:0">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.97 10.97 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </button>
            <button :style="{ height: '52px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--zm-white)', color: 'var(--zm-ink-950)', border: '1px solid var(--zm-border-strong)', borderRadius: 'var(--zm-r-md)', cursor: 'pointer', font: '600 14.5px var(--zm-font-body)' }" @click="startOAuth('apple')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Sign up with Apple
            </button>
            <button :style="{ height: '52px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--zm-white)', color: 'var(--zm-ink-950)', border: '1px solid var(--zm-border-strong)', borderRadius: 'var(--zm-r-md)', cursor: 'pointer', font: '600 14.5px var(--zm-font-body)' }" @click="startOAuth('linkedin')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2" style="flex-shrink:0">
                <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.27c-.96 0-1.74-.78-1.74-1.74s.78-1.74 1.74-1.74 1.74.78 1.74 1.74-.78 1.74-1.74 1.74zm13.5 12.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-11h2.88v1.5h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6v6.46z"/>
              </svg>
              Sign up with LinkedIn
            </button>
          </div>

        </div>
      </div>

      <!-- Sticky CTA -->
      <ZmMStickyCTA>
        <ZmButton variant="primary" size="lg" :full="true" icon-right="arrow_right" :loading="submitting" :disabled="submitting" @click="sendCode">
          Send verification code
        </ZmButton>
      </ZmMStickyCTA>
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
          <div class="zm-eyebrow" :style="{ color: 'var(--zm-gold-500)' }">Why Zeemic</div>
          <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '56px', lineHeight: '1.02', letterSpacing: '-0.03em', margin: '14px 0 24px' }">Skills, jobs, and recruiters on one <em style="font-style:italic">transactional</em> rail.</h2>
          <p :style="{ font: '400 17px/1.55 var(--zm-font-body)', color: 'var(--zm-fg-on-dark-muted)', margin: '0' }">List a skill in five minutes. Book sessions, accept quote requests, and get paid through escrow. Free to publish — we only earn when you do.</p>
          <div :style="{ marginTop: '36px', padding: '20px 0 0', borderTop: '1px solid rgba(245,241,232,0.14)' }">
            <p :style="{ fontFamily: 'var(--zm-font-display)', fontStyle: 'italic', fontSize: '20px', lineHeight: '1.35', letterSpacing: '-0.015em', color: 'var(--zm-paper)', margin: '0' }">"Three bookings in my first week. I built it during a sprint at a co-working space in Accra."</p>
            <div :style="{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px' }">
              <ZmAvatar name="Enoch Boison" :size="28" />
              <div>
                <div :style="{ font: '600 13px var(--zm-font-body)' }">Enoch Boison</div>
                <div :style="{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-on-dark-muted)' }">Product Designer · Accra</div>
              </div>
            </div>
          </div>
        </div>
        <div :style="{ font: '400 11px var(--zm-font-mono)', color: 'var(--zm-fg-on-dark-muted)', letterSpacing: '0.05em' }">© 2026 ZEEMIC · /signup</div>
      </div>

      <!-- Right: form panel -->
      <div :style="{ padding: '56px 32px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: 'var(--zm-paper)' }">
        <div :style="{ width: '100%', maxWidth: '440px' }">

          <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-xl)', padding: '36px', boxShadow: 'var(--zm-shadow-md)' }">
            <div class="zm-eyebrow">Create account</div>
            <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '36px', lineHeight: '1.04', letterSpacing: '-0.025em', margin: '8px 0 10px' }">Join the <em style="font-style:italic">marketplace.</em></h1>
            <p :style="{ font: '400 14px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0 0 24px' }">Email-only to start. You can add a password from Account settings whenever you'd like.</p>

            <!-- Full name -->
            <div :style="{ marginBottom: '12px' }">
              <label :style="{ display: 'block', font: '500 13px var(--zm-font-body)', marginBottom: '6px' }">Full name <span :style="{ color: 'var(--zm-coral-500)' }">*</span></label>
              <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', height: '40px', padding: '0 12px', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)' }">
                <ZmIcon name="user" :size="16" color="var(--zm-fg-muted)" />
                <input
                  v-model="fullName"
                  type="text"
                  placeholder="First Last"
                  autofocus
                  :style="{ flex: '1', border: 'none', outline: 'none', background: 'transparent', font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg)' }"
                />
              </div>
            </div>

            <!-- Email -->
            <div :style="{ marginBottom: '16px' }">
              <label :style="{ display: 'block', font: '500 13px var(--zm-font-body)', marginBottom: '6px' }">Email <span :style="{ color: 'var(--zm-coral-500)' }">*</span></label>
              <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', height: '40px', padding: '0 12px', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)' }">
                <ZmIcon name="mail" :size="16" color="var(--zm-fg-muted)" />
                <input
                  v-model="email"
                  type="email"
                  placeholder="you@example.com"
                  :style="{ flex: '1', border: 'none', outline: 'none', background: 'transparent', font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg)' }"
                  @keydown.enter="sendCode"
                />
              </div>
              <p :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '5px 0 0' }">We'll send a 6-digit verification code.</p>
            </div>

            <!-- Terms -->
            <div :style="{ marginBottom: '20px' }">
              <label :style="{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }">
                <div
                  :style="{
                    width: '18px', height: '18px', borderRadius: '4px', flexShrink: '0', marginTop: '1px',
                    background: agreedToTerms ? 'var(--zm-ink-700)' : 'var(--zm-white)',
                    border: `1.5px solid ${agreedToTerms ? 'var(--zm-ink-700)' : 'var(--zm-border-strong)'}`,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--zm-paper)',
                  }"
                  @click="agreedToTerms = !agreedToTerms"
                >
                  <ZmIcon v-if="agreedToTerms" name="check" :size="13" color="var(--zm-paper)" :stroke="2.6" />
                </div>
                <span :style="{ font: '400 12.5px/1.45 var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">
                  I agree to the <NuxtLink to="/terms" :style="{ color: 'var(--zm-ink-950)', fontWeight: '600', textDecoration: 'none' }">Terms</NuxtLink> and <NuxtLink to="/policies/privacy" :style="{ color: 'var(--zm-ink-950)', fontWeight: '600', textDecoration: 'none' }">Privacy</NuxtLink> policy.
                </span>
              </label>
            </div>

            <!-- Error -->
            <ZmAlert v-if="formError" tone="error" :style="{ margin: '-8px 0 12px' }">{{ formError }}</ZmAlert>

            <ZmButton variant="primary" size="lg" :full="true" icon-right="arrow_right" :loading="submitting" :disabled="submitting" @click="sendCode">
              {{ submitting ? 'Sending code…' : 'Send verification code' }}
            </ZmButton>

            <ZmDivider label="or sign up with" style="margin:16px 0" />

            <!-- SSO buttons — stacked full-width -->
            <div :style="{ display: 'flex', flexDirection: 'column', gap: '8px' }">
              <button :style="{ width: '100%', height: '46px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--zm-white)', color: 'var(--zm-ink-950)', border: '1px solid var(--zm-border-strong)', borderRadius: 'var(--zm-r-md)', cursor: 'pointer', font: '600 14px var(--zm-font-body)', letterSpacing: '-0.005em' }" @click="startOAuth('google')">
                <svg width="20" height="20" viewBox="0 0 24 24" style="flex-shrink:0">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.97 10.97 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span :style="{ flex: '1', textAlign: 'center' }">Sign up with Google</span>
                <span :style="{ width: '20px' }" />
              </button>
              <button :style="{ width: '100%', height: '46px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--zm-white)', color: 'var(--zm-ink-950)', border: '1px solid var(--zm-border-strong)', borderRadius: 'var(--zm-r-md)', cursor: 'pointer', font: '600 14px var(--zm-font-body)', letterSpacing: '-0.005em' }" @click="startOAuth('apple')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span :style="{ flex: '1', textAlign: 'center' }">Sign up with Apple</span>
                <span :style="{ width: '20px' }" />
              </button>
              <button :style="{ width: '100%', height: '46px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--zm-white)', color: 'var(--zm-ink-950)', border: '1px solid var(--zm-border-strong)', borderRadius: 'var(--zm-r-md)', cursor: 'pointer', font: '600 14px var(--zm-font-body)', letterSpacing: '-0.005em' }" @click="startOAuth('linkedin')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2" style="flex-shrink:0">
                  <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.27c-.96 0-1.74-.78-1.74-1.74s.78-1.74 1.74-1.74 1.74.78 1.74 1.74-.78 1.74-1.74 1.74zm13.5 12.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-11h2.88v1.5h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6v6.46z"/>
                </svg>
                <span :style="{ flex: '1', textAlign: 'center' }">Sign up with LinkedIn</span>
                <span :style="{ width: '20px' }" />
              </button>
            </div>
          </div>

          <!-- Footer -->
          <p :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textAlign: 'center', marginTop: '20px' }">
            Already have an account?
            <NuxtLink to="/login" :style="{ color: 'var(--zm-ink-700)', fontWeight: '600', textDecoration: 'none' }">Sign in</NuxtLink>
          </p>
        </div>
      </div>

    </div>
  </template>
</template>
