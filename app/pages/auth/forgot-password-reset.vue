<script setup lang="ts">
useHead({ title: 'Reset Password — Zeemic' })

const route = useRoute()
const email = computed(() => (route.query.email as string) || '')

const code = ref(['', '', '', '', '', ''])
const newPassword = ref('')
const showPassword = ref(false)
const error = ref('')
const success = ref(false)
const submitting = ref(false)
const resending = ref(false)
const resent = ref(false)
const otpRefs = ref<HTMLInputElement[]>([])

const { confirmPasswordReset, requestPasswordReset } = useAuth()
const { isMobile } = useBreakpoint()
const router = useRouter()

function onOtpInput(index: number, e: Event) {
  const input = e.target as HTMLInputElement
  const raw = input.value.replace(/\D/g, '')
  if (raw.length > 1) {
    const digits = raw.slice(0, 6).split('')
    digits.forEach((d, i) => { code.value[i] = d })
    const lastFilled = Math.min(digits.length - 1, 5)
    nextTick(() => otpRefs.value[lastFilled]?.focus())
    return
  }
  code.value[index] = raw ? raw[raw.length - 1] : ''
  input.value = code.value[index]
  if (code.value[index] && index < 5) {
    nextTick(() => otpRefs.value[index + 1]?.focus())
  }
}

function onOtpKeydown(index: number, e: KeyboardEvent) {
  if (e.key === 'Backspace' && !code.value[index] && index > 0) {
    code.value[index - 1] = ''
    otpRefs.value[index - 1]?.focus()
  }
}

async function confirm() {
  error.value = ''
  if (code.value.some(d => d === '')) {
    error.value = 'Please enter all 6 digits of the reset code.'
    return
  }
  if (newPassword.value.length < 8) {
    error.value = 'New password must be at least 8 characters.'
    return
  }
  submitting.value = true
  try {
    await confirmPasswordReset(email.value, code.value.join(''), newPassword.value)
    success.value = true
    setTimeout(() => navigateTo('/login'), 2000)
  } catch (err: any) {
    error.value = err?.data?.statusMessage ?? err?.message ?? 'Invalid or expired code.'
  } finally {
    submitting.value = false
  }
}

async function resend() {
  resending.value = true
  resent.value = false
  try {
    await requestPasswordReset(email.value)
    resent.value = true
    setTimeout(() => { resent.value = false }, 4000)
  } catch {
    // silent
  } finally {
    resending.value = false
  }
}
</script>

<template>
  <!-- Mobile -->
  <template v-if="isMobile">
    <div :style="{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--zm-paper)' }">

      <ZmMNavBar title="Reset password" leftLabel="Cancel" @back="router.back()" />

      <!-- Scrollable area -->
      <div :style="{ flex: '1', overflowY: 'auto', padding: '8px 0' }">

        <!-- Auth header -->
        <div :style="{ padding: '8px 20px 16px' }">
          <div class="zm-eyebrow">Reset</div>
          <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '32px', lineHeight: '1.04', letterSpacing: '-0.025em', margin: '8px 0 6px' }">Choose a <em style="font-style:italic">new</em> password.</h1>
          <p :style="{ font: '400 13.5px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0' }">
            Reset link verified for <strong :style="{ color: 'var(--zm-ink-950)' }">{{ email || 'your email' }}</strong>.
          </p>
        </div>

        <!-- Form area -->
        <div :style="{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '14px' }">

          <ZmAlert tone="info" title="Security note">
            All other devices will be signed out when you save.
          </ZmAlert>

          <ZmField label="New password" :required="true">
            <ZmInput v-model="newPassword" type="password" :full="true" placeholder="At least 12 characters" trailing-icon="eye" size="lg" />
          </ZmField>

          <!-- Error -->
          <p v-if="error" :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-coral-500, #E84A1F)', margin: '0' }">{{ error }}</p>

          <!-- Success -->
          <div v-if="success" :style="{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 14px', background: '#f0fdf4', border: '1px solid #16a34a22', borderRadius: 'var(--zm-r-md)' }">
            <ZmIcon name="check" :size="16" color="#16a34a" />
            <span :style="{ font: '500 13px var(--zm-font-body)', color: '#16a34a' }">Password reset! Redirecting to sign in…</span>
          </div>

        </div>
      </div>

      <!-- Sticky CTA -->
      <ZmMStickyCTA>
        <ZmButton variant="primary" size="lg" :full="true" icon-right="arrow_right" :loading="submitting" :disabled="submitting || success" @click="confirm">
          Save and sign in
        </ZmButton>
      </ZmMStickyCTA>
    </div>
  </template>

  <!-- Desktop -->
  <template v-else>
    <div class="zm-root" :style="{ minHeight: '100vh', background: 'var(--zm-paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '56px 32px' }">
      <div :style="{ width: '100%', maxWidth: '400px', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-xl)', padding: '36px', boxShadow: 'var(--zm-shadow-lg)' }">

        <div :style="{ marginBottom: '28px', textAlign: 'center' }">
          <ZmWordmark :height="32" style="justify-content:center;margin-bottom:24px" />
          <!-- Lock icon -->
          <div :style="{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }">
            <div :style="{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--zm-gold-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }">
              <ZmIcon name="lock" :size="26" color="var(--zm-gold-700, #C9A634)" />
            </div>
          </div>
          <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '32px', letterSpacing: '-0.02em', margin: '0 0 8px' }">Reset your password</h1>
          <p :style="{ font: '400 15px var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0' }">
            Enter the code sent to<br />
            <strong :style="{ color: 'var(--zm-fg)', fontWeight: '600' }">{{ email || 'your email' }}</strong>
          </p>
        </div>

        <!-- OTP inputs -->
        <div :style="{ marginBottom: '20px' }">
          <div class="zm-eyebrow" :style="{ marginBottom: '12px', textAlign: 'center' }">6-digit reset code</div>
          <div :style="{ display: 'flex', gap: '8px', justifyContent: 'center' }">
            <input
              v-for="(_, i) in code"
              :key="i"
              :ref="(el) => { if (el) otpRefs[i] = el as HTMLInputElement }"
              :value="code[i]"
              type="text"
              inputmode="numeric"
              maxlength="1"
              :style="{
                width: '52px', height: '64px',
                border: error ? '1px solid var(--zm-coral-500, #E84A1F)' : '1px solid var(--zm-border)',
                borderRadius: 'var(--zm-r-md)',
                textAlign: 'center',
                font: '600 28px var(--zm-font-mono, monospace)',
                color: 'var(--zm-fg)',
                background: 'var(--zm-white)',
                outline: 'none',
                boxShadow: 'var(--zm-shadow-xs)',
              }"
              @input="onOtpInput(i, $event)"
              @keydown="onOtpKeydown(i, $event)"
              @focus="($event.target as HTMLInputElement).select()"
            />
          </div>

          <!-- Resend -->
          <p v-if="resent" :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-success, #16a34a)', textAlign: 'center', margin: '10px 0 0' }">Code resent — check your inbox.</p>
          <p v-else :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textAlign: 'center', margin: '10px 0 0' }">
            Didn't receive it?
            <button
              :style="{ border: 'none', background: 'transparent', cursor: resending ? 'default' : 'pointer', font: '500 12px var(--zm-font-body)', color: 'var(--zm-ink-700)', padding: '0', opacity: resending ? '0.6' : '1' }"
              :disabled="resending"
              @click="resend"
            >{{ resending ? 'Resending…' : 'Resend code' }}</button>
          </p>
        </div>

        <!-- New password -->
        <div :style="{ marginBottom: '20px' }">
          <div class="zm-eyebrow" :style="{ marginBottom: '6px' }">New password</div>
          <div :style="{
            display: 'flex', alignItems: 'center', gap: '10px',
            height: '44px', padding: '0 14px',
            background: 'var(--zm-white)',
            border: '1px solid var(--zm-border)',
            borderRadius: 'var(--zm-r-md)', boxShadow: 'var(--zm-shadow-xs)',
          }">
            <ZmIcon name="lock" :size="16" color="var(--zm-fg-muted)" />
            <input
              v-model="newPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="At least 8 characters"
              :style="{ flex: '1', border: 'none', outline: 'none', background: 'transparent', font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg)' }"
            />
            <button type="button" :style="{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center' }" @click="showPassword = !showPassword">
              <ZmIcon :name="showPassword ? 'eye_off' : 'eye'" :size="16" color="var(--zm-fg-muted)" />
            </button>
          </div>
        </div>

        <!-- Error -->
        <p v-if="error" :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-coral-500, #E84A1F)', marginBottom: '12px', marginTop: '-4px' }">{{ error }}</p>

        <!-- Success -->
        <div v-if="success" :style="{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 14px', background: '#f0fdf4', border: '1px solid #16a34a22', borderRadius: 'var(--zm-r-md)', marginBottom: '12px' }">
          <ZmIcon name="check" :size="16" color="#16a34a" />
          <span :style="{ font: '500 13px var(--zm-font-body)', color: '#16a34a' }">Password reset! Redirecting to sign in…</span>
        </div>

        <!-- Submit -->
        <ZmButton variant="dark" size="lg" :full="true" :loading="submitting" :disabled="submitting || success" @click="confirm">
          {{ submitting ? 'Resetting…' : 'Reset password' }}
        </ZmButton>

        <!-- Back link -->
        <p :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textAlign: 'center', marginTop: '16px', marginBottom: '0' }">
          <NuxtLink to="/auth/forgot-password" :style="{ color: 'var(--zm-fg-muted)', fontWeight: '500' }">Back to forgot password</NuxtLink>
        </p>

      </div>
    </div>
  </template>
</template>
