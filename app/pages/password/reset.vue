<script setup lang="ts">
useHead({ title: 'Reset password — Zeemic' })

const newPassword = ref('')
const confirmPassword = ref('')
const submitting = ref(false)
const error = ref('')
const success = ref(false)

const { confirmPasswordResetByToken } = useAuth()
const { isMobile } = useBreakpoint()
const route = useRoute()

const token = computed(() => route.query.token as string | undefined)

const strength = computed(() => {
  const p = newPassword.value
  if (!p) return { bars: 0, label: '', color: '' }
  let score = 0
  if (p.length >= 12) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  const labels = ['Weak', 'Fair', 'Good', 'Strong']
  const colors = ['var(--zm-coral-500)', 'var(--zm-warning)', 'var(--zm-success)', 'var(--zm-success)']
  const idx = Math.max(0, score - 1)
  return { bars: score, label: labels[idx], color: colors[idx] }
})

async function submitReset() {
  error.value = ''
  if (!token.value) return
  if (newPassword.value.length < 8) { error.value = 'Password must be at least 8 characters.'; return }
  if (newPassword.value !== confirmPassword.value) { error.value = 'Passwords do not match.'; return }
  submitting.value = true
  try {
    await confirmPasswordResetByToken(token.value, newPassword.value)
    success.value = true
    setTimeout(() => navigateTo('/login?message=password_updated'), 1500)
  } catch (err: any) {
    const status = err?.data?.statusCode ?? err?.statusCode ?? err?.response?.status
    if (status === 401) error.value = 'This reset link has expired. Please request a new one.'
    else if (status === 400) error.value = 'Password must be at least 8 characters with uppercase, lowercase, a digit, and a special character.'
    else error.value = err?.data?.message ?? err?.message ?? 'Something went wrong. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <!-- Mobile -->
  <template v-if="isMobile">
    <div :style="{ display: 'flex', flexDirection: 'column', height: '100svh', background: 'var(--zm-paper)' }">

      <ZmMNavBar title="Reset password" leftLabel="Sign in" @back="navigateTo('/login')" />

      <div :style="{ flex: '1', overflowY: 'auto', padding: '8px 0' }">

        <!-- Invalid token state -->
        <template v-if="!token">
          <div :style="{ padding: '32px 20px', textAlign: 'center' }">
            <div :style="{ width: '52px', height: '52px', borderRadius: 'var(--zm-r-lg)', background: 'var(--zm-ink-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }">
              <ZmIcon name="alert_circle" :size="24" color="var(--zm-coral-500)" />
            </div>
            <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '28px', letterSpacing: '-0.025em', margin: '0 0 10px' }">Invalid reset link</h1>
            <p :style="{ font: '400 14px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0 0 24px' }">This link is missing a reset token. Please request a new one.</p>
            <ZmButton variant="primary" size="lg" :full="true" @click="navigateTo('/auth/forgot-password')">
              Request new link
            </ZmButton>
          </div>
        </template>

        <!-- Form -->
        <template v-else>
          <div :style="{ padding: '8px 20px 16px' }">
            <div class="zm-eyebrow">Account</div>
            <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '32px', lineHeight: '1.04', letterSpacing: '-0.025em', margin: '8px 0 6px' }">Choose a <em style="font-style:italic">new password.</em></h1>
            <p :style="{ font: '400 13.5px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0' }">
              Pick a strong password — at least 8 characters with uppercase, lowercase, a digit, and a special character.
            </p>
          </div>

          <div :style="{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '14px' }">

            <ZmField label="New password" :required="true">
              <ZmInput v-model="newPassword" type="password" :full="true" placeholder="At least 8 characters" trailing-icon="eye" size="lg" />
            </ZmField>

            <!-- Strength bar -->
            <div v-if="newPassword">
              <div :style="{ display: 'flex', gap: '4px' }">
                <div
                  v-for="i in 4"
                  :key="i"
                  :style="{ flex: '1', height: '4px', borderRadius: '2px', background: i <= strength.bars ? strength.color : 'var(--zm-ink-100)', transition: 'background 150ms' }"
                />
              </div>
              <div :style="{ display: 'flex', justifyContent: 'space-between', font: '500 11px var(--zm-font-body)', marginTop: '5px' }">
                <span :style="{ color: strength.color, fontWeight: '600' }">{{ strength.label }}</span>
                <span :style="{ color: 'var(--zm-fg-muted)' }">upper · number · symbol</span>
              </div>
            </div>

            <ZmField label="Confirm password" :required="true">
              <ZmInput v-model="confirmPassword" type="password" :full="true" placeholder="Re-enter password" trailing-icon="check" size="lg" />
            </ZmField>

            <ZmAlert v-if="error" tone="error">{{ error }}</ZmAlert>
            <ZmAlert v-if="success" tone="success">Password updated! Redirecting…</ZmAlert>
          </div>
        </template>
      </div>

      <ZmMStickyCTA v-if="token && !success">
        <ZmButton variant="primary" size="lg" :full="true" icon-right="arrow_right" :loading="submitting" :disabled="submitting" @click="submitReset">
          Save and sign in
        </ZmButton>
      </ZmMStickyCTA>
    </div>
  </template>

  <!-- Desktop -->
  <template v-else>
    <div class="zm-root" :style="{ minHeight: '100vh', padding: '56px 32px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: 'var(--zm-paper)' }">
      <div :style="{ width: '100%', maxWidth: '440px' }">

        <div :style="{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }">
          <ZmWordmark :height="26" />
        </div>

        <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-xl)', padding: '40px', boxShadow: 'var(--zm-shadow-md)' }">

          <!-- Invalid token -->
          <template v-if="!token">
            <div :style="{ width: '52px', height: '52px', borderRadius: 'var(--zm-r-lg)', background: 'var(--zm-ink-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }">
              <ZmIcon name="alert_circle" :size="24" color="var(--zm-coral-500)" />
            </div>
            <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '36px', lineHeight: '1.04', letterSpacing: '-0.025em', margin: '0 0 10px' }">Invalid reset link</h1>
            <p :style="{ font: '400 14px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0 0 24px' }">This link is missing a reset token. Please request a new one from the forgot password page.</p>
            <ZmButton variant="dark" size="lg" :full="true" icon-right="arrow_right" @click="navigateTo('/auth/forgot-password')">
              Request new link
            </ZmButton>
          </template>

          <!-- Form -->
          <template v-else>
            <div :style="{ width: '52px', height: '52px', borderRadius: 'var(--zm-r-lg)', background: 'var(--zm-ink-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }">
              <ZmIcon :name="success ? 'check' : 'lock'" :size="24" color="var(--zm-ink-700)" />
            </div>
            <div class="zm-eyebrow">Account · /password/reset</div>
            <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '36px', lineHeight: '1.04', letterSpacing: '-0.025em', margin: '8px 0 10px' }">Choose a <em style="font-style:italic">new password.</em></h1>
            <p :style="{ font: '400 14px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0 0 24px' }">
              Minimum 8 characters — include uppercase, lowercase, a digit, and a special character.
            </p>

            <div :style="{ marginBottom: '4px' }">
              <label :style="{ display: 'block', font: '500 13px var(--zm-font-body)', marginBottom: '6px' }">New password <span :style="{ color: 'var(--zm-coral-500)' }">*</span></label>
              <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', height: '40px', padding: '0 12px', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)' }">
                <ZmIcon name="lock" :size="16" color="var(--zm-fg-muted)" />
                <input
                  v-model="newPassword"
                  type="password"
                  placeholder="At least 8 characters"
                  :style="{ flex: '1', border: 'none', outline: 'none', background: 'transparent', font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg)' }"
                />
              </div>
            </div>

            <div v-if="newPassword" :style="{ marginTop: '8px', marginBottom: '16px' }">
              <div :style="{ display: 'flex', gap: '4px' }">
                <div v-for="i in 4" :key="i" :style="{ flex: '1', height: '4px', borderRadius: '2px', background: i <= strength.bars ? strength.color : 'var(--zm-ink-100)', transition: 'background 150ms' }" />
              </div>
              <div :style="{ display: 'flex', justifyContent: 'space-between', font: '500 11px var(--zm-font-body)', marginTop: '5px' }">
                <span :style="{ color: strength.color, fontWeight: '600' }">{{ strength.label }}</span>
                <span :style="{ color: 'var(--zm-fg-muted)' }">upper · number · symbol</span>
              </div>
            </div>
            <div v-else :style="{ marginBottom: '16px' }" />

            <div :style="{ marginBottom: '20px' }">
              <label :style="{ display: 'block', font: '500 13px var(--zm-font-body)', marginBottom: '6px' }">Confirm new password <span :style="{ color: 'var(--zm-coral-500)' }">*</span></label>
              <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', height: '40px', padding: '0 12px', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)' }">
                <ZmIcon name="lock" :size="16" color="var(--zm-fg-muted)" />
                <input
                  v-model="confirmPassword"
                  type="password"
                  placeholder="Re-enter password"
                  :style="{ flex: '1', border: 'none', outline: 'none', background: 'transparent', font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg)' }"
                  @keydown.enter="submitReset"
                />
                <ZmIcon v-if="confirmPassword && confirmPassword === newPassword" name="check" :size="16" color="var(--zm-success)" />
              </div>
              <p v-if="confirmPassword && confirmPassword !== newPassword" :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-coral-500)', margin: '5px 0 0' }">Passwords do not match.</p>
            </div>

            <p v-if="error" :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-coral-500)', margin: '-8px 0 12px' }">{{ error }}</p>
            <div v-if="success" :style="{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 14px', background: '#f0fdf4', border: '1px solid #16a34a22', borderRadius: 'var(--zm-r-md)', marginBottom: '12px' }">
              <ZmIcon name="check" :size="16" color="#16a34a" />
              <span :style="{ font: '500 13px var(--zm-font-body)', color: '#16a34a' }">Password updated! Redirecting…</span>
            </div>

            <ZmButton v-if="!success" variant="primary" size="lg" :full="true" icon-right="arrow_right" :loading="submitting" :disabled="submitting" @click="submitReset">
              {{ submitting ? 'Saving…' : 'Save and sign in' }}
            </ZmButton>
          </template>
        </div>

        <p :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textAlign: 'center', marginTop: '20px' }">
          <NuxtLink to="/login" :style="{ color: 'var(--zm-ink-700)', textDecoration: 'none', fontWeight: '500' }">Back to sign in</NuxtLink>
        </p>
      </div>
    </div>
  </template>
</template>
