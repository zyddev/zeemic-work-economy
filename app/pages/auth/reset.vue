<script setup lang="ts">
useHead({ title: 'Reset password — Zeemic' })

const route = useRoute()
const email = computed(() => (route.query.email as string) || '')

const newPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const submitting = ref(false)
const error = ref('')
const success = ref(false)

const { resetTemporaryPassword } = useAuth()
const { isMobile } = useBreakpoint()

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

async function save() {
  error.value = ''
  if (newPassword.value.length < 12) { error.value = 'Password must be at least 12 characters.'; return }
  if (newPassword.value !== confirmPassword.value) { error.value = 'Passwords do not match.'; return }
  submitting.value = true
  try {
    await resetTemporaryPassword(newPassword.value)
    success.value = true
    setTimeout(() => navigateTo('/login'), 2000)
  } catch (err: any) {
    error.value = err?.data?.statusMessage ?? err?.message ?? 'Failed to reset password. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="zm-root" :style="{ minHeight: '100vh', padding: isMobile ? '32px 16px' : '56px 32px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: 'var(--zm-paper)' }">
    <div :style="{ width: '100%', maxWidth: '440px' }">

      <div :style="{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }">
        <ZmWordmark :height="26" />
      </div>

      <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-xl)', padding: isMobile ? '24px 20px' : '36px', boxShadow: 'var(--zm-shadow-md)' }">
        <div class="zm-eyebrow">Reset password</div>
        <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '36px', lineHeight: '1.04', letterSpacing: '-0.025em', margin: '8px 0 10px' }">Choose a <em style="font-style:italic">new</em> password.</h1>
        <p :style="{ font: '400 14px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0 0 20px' }">
          Reset verified for <strong :style="{ color: 'var(--zm-ink-950)' }">{{ email || 'your account' }}</strong>. Your existing sessions will sign out.
        </p>

        <!-- Security alert -->
        <div :style="{ padding: '14px 16px', background: 'var(--zm-sky-100, #EAF2F9)', borderLeft: '3px solid var(--zm-sky-500, #3C8AC0)', borderRadius: 'var(--zm-r-md)', display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '20px' }">
          <ZmIcon name="sparkles" :size="18" color="var(--zm-sky-700, #1E4B68)" :style="{ marginTop: '2px', flexShrink: '0' }" />
          <div>
            <div :style="{ font: '600 14px var(--zm-font-body)', color: 'var(--zm-sky-700, #1E4B68)', marginBottom: '2px' }">Security note</div>
            <div :style="{ font: '400 13px/1.5 var(--zm-font-body)' }">All other devices will be signed out when you save a new password.</div>
          </div>
        </div>

        <!-- New password -->
        <div :style="{ marginBottom: '4px' }">
          <label :style="{ display: 'block', font: '500 13px var(--zm-font-body)', marginBottom: '6px' }">New password <span :style="{ color: 'var(--zm-coral-500)' }">*</span></label>
          <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', height: '40px', padding: '0 12px', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)' }">
            <ZmIcon name="lock" :size="16" color="var(--zm-fg-muted)" />
            <input
              v-model="newPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="At least 12 characters"
              :style="{ flex: '1', border: 'none', outline: 'none', background: 'transparent', font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg)' }"
            />
            <button type="button" :style="{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center' }" @click="showPassword = !showPassword">
              <ZmIcon :name="showPassword ? 'eye_off' : 'eye'" :size="16" color="var(--zm-fg-muted)" />
            </button>
          </div>
        </div>

        <!-- Strength meter -->
        <div v-if="newPassword" :style="{ marginTop: '8px', marginBottom: '16px' }">
          <div :style="{ display: 'flex', gap: '4px' }">
            <div v-for="i in 4" :key="i" :style="{ flex: '1', height: '4px', borderRadius: '2px', background: i <= strength.bars ? strength.color : 'var(--zm-ink-100)', transition: 'background 150ms' }" />
          </div>
          <div :style="{ display: 'flex', justifyContent: 'space-between', font: '500 11px var(--zm-font-body)', marginTop: '5px' }">
            <span :style="{ color: strength.color, fontWeight: '600' }">{{ strength.label }}</span>
            <span :style="{ color: 'var(--zm-fg-muted)' }">12+ chars · upper · number · symbol</span>
          </div>
        </div>
        <div v-else :style="{ marginBottom: '16px' }" />

        <!-- Confirm password -->
        <div :style="{ marginBottom: '24px' }">
          <label :style="{ display: 'block', font: '500 13px var(--zm-font-body)', marginBottom: '6px' }">Confirm new password <span :style="{ color: 'var(--zm-coral-500)' }">*</span></label>
          <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', height: '40px', padding: '0 12px', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)' }">
            <ZmIcon name="lock" :size="16" color="var(--zm-fg-muted)" />
            <input
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Re-enter password"
              :style="{ flex: '1', border: 'none', outline: 'none', background: 'transparent', font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg)' }"
              @keydown.enter="save"
            />
            <ZmIcon v-if="confirmPassword && confirmPassword === newPassword" name="check" :size="16" color="var(--zm-success)" />
          </div>
          <p :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '5px 0 0' }">Both passwords must match.</p>
        </div>

        <!-- Error / success -->
        <p v-if="error" :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-coral-500, #E84A1F)', margin: '-12px 0 12px' }">{{ error }}</p>
        <div v-if="success" :style="{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 14px', background: '#f0fdf4', border: '1px solid #16a34a22', borderRadius: 'var(--zm-r-md)', marginBottom: '12px' }">
          <ZmIcon name="check" :size="16" color="#16a34a" />
          <span :style="{ font: '500 13px var(--zm-font-body)', color: '#16a34a' }">Password reset! Redirecting to sign in…</span>
        </div>

        <!-- Actions -->
        <div :style="{ display: 'flex', flexDirection: 'column', gap: '10px' }">
          <ZmButton variant="primary" size="lg" :full="true" icon-right="arrow_right" :loading="submitting" :disabled="submitting || success" @click="save">
            {{ submitting ? 'Saving…' : 'Save and sign in' }}
          </ZmButton>
          <ZmButton variant="ghost" size="md" :full="true" :disabled="submitting" @click="navigateTo('/login')">
            Cancel
          </ZmButton>
        </div>
      </div>

      <!-- Footer -->
      <p :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textAlign: 'center', marginTop: '20px' }">
        Remembered your password?
        <NuxtLink to="/login" :style="{ color: 'var(--zm-ink-700)', fontWeight: '600', textDecoration: 'none' }">Sign in instead</NuxtLink>
      </p>
    </div>
  </div>
</template>
