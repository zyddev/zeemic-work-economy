<script setup lang="ts">
useHead({ title: 'Create account — Zeemic' })

const fullName = ref('')
const email = ref('')
const agreedToTerms = ref(false)
const submitting = ref(false)
const formError = ref('')

const { register } = useAuth()
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

        </div>
      </div>

      <!-- Sticky CTA -->
      <ZmMStickyCTA>
        <ZmButton variant="primary" size="lg" :full="true" icon-right="arrow_right" :loading="submitting" :disabled="submitting || !agreedToTerms" @click="sendCode">
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

            <ZmButton variant="primary" size="lg" :full="true" icon-right="arrow_right" :loading="submitting" :disabled="submitting || !agreedToTerms" @click="sendCode">
              {{ submitting ? 'Sending code…' : 'Send verification code' }}
            </ZmButton>
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
