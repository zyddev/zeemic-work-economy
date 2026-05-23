<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Set password — Zeemic' })

const newPassword = ref('')
const confirmPassword = ref('')
const showPasswords = ref(false)
const submitting = ref(false)
const error = ref('')
const success = ref(false)

const { setPassword } = useAuth()
const { isMobile } = useBreakpoint()
const { user } = useUserInfo()
const router = useRouter()

const strength = computed(() => {
  const p = newPassword.value
  if (!p) return { bars: 0, tone: 'weak', label: '', color: '' }
  let score = 0
  if (p.length >= 12) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  const tones = ['weak', 'fair', 'good', 'strong'] as const
  const labels = ['Weak', 'Fair', 'Good', 'Strong']
  const colors = ['var(--zm-coral-500)', 'var(--zm-warning)', 'var(--zm-success)', 'var(--zm-success)']
  const idx = Math.max(0, score - 1)
  return { bars: score, tone: tones[idx], label: labels[idx], color: colors[idx] }
})

async function save() {
  error.value = ''
  if (newPassword.value.length < 8) { error.value = 'Password must be at least 8 characters.'; return }
  if (newPassword.value !== confirmPassword.value) { error.value = 'Passwords do not match.'; return }
  submitting.value = true
  try {
    await setPassword(user.value?.email ?? '', newPassword.value)
    success.value = true
    setTimeout(() => navigateTo('/dashboard'), 1500)
  } catch (err: any) {
    const status = err?.data?.statusCode ?? err?.statusCode ?? err?.response?.status
    if (status === 409) error.value = "You already have a password. Use 'Forgot password' to reset it."
    else if (status === 404) error.value = 'Account not found.'
    else if (status === 400) error.value = 'Password must be at least 8 characters with uppercase, lowercase, a digit, and a special character.'
    else error.value = err?.data?.message ?? err?.message ?? 'Failed to save password. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <!-- Mobile -->
  <template v-if="isMobile">
    <div :style="{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--zm-paper)' }">

      <ZmMNavBar title="Set password" leftLabel="Cancel" @back="router.back()" />

      <!-- Scrollable area -->
      <div :style="{ flex: '1', overflowY: 'auto', padding: '8px 0' }">

        <!-- Auth header -->
        <div :style="{ padding: '8px 20px 16px' }">
          <div class="zm-eyebrow">Account</div>
          <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '32px', lineHeight: '1.04', letterSpacing: '-0.025em', margin: '8px 0 6px' }">Set a <em style="font-style:italic">password.</em></h1>
          <p :style="{ font: '400 13.5px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0' }">
            Signed in as <strong :style="{ color: 'var(--zm-ink-950)' }">{{ user?.email }}</strong>. After saving, you can sign in with email + password.
          </p>
        </div>

        <!-- Form area -->
        <div :style="{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '14px' }">

          <!-- New password -->
          <ZmField label="New password" :required="true">
            <ZmInput v-model="newPassword" type="password" :full="true" placeholder="At least 8 characters" trailing-icon="eye" size="lg" />
          </ZmField>

          <!-- Password strength bar -->
          <div>
            <div :style="{ display: 'flex', gap: '4px' }">
              <div
                v-for="i in 4"
                :key="i"
                :style="{
                  flex: '1', height: '4px', borderRadius: '2px',
                  background: i <= 3 ? 'var(--zm-success)' : 'var(--zm-grey-200, #e5e7eb)',
                }"
              />
            </div>
            <div :style="{ display: 'flex', justifyContent: 'space-between', font: '500 11px var(--zm-font-body)', marginTop: '5px' }">
              <span :style="{ color: 'var(--zm-success)', fontWeight: '600' }">Strong</span>
              <span :style="{ color: 'var(--zm-fg-muted)' }">12+ chars · upper · number · symbol</span>
            </div>
          </div>

          <!-- Confirm password -->
          <ZmField label="Confirm new password" :required="true" help="Both passwords must match.">
            <ZmInput v-model="confirmPassword" type="password" :full="true" placeholder="Re-enter password" trailing-icon="check" size="lg" />
          </ZmField>

          <!-- Error / success -->
          <ZmAlert v-if="error" tone="error">{{ error }}</ZmAlert>
          <ZmAlert v-if="success" tone="success">Password saved! Redirecting…</ZmAlert>

        </div>
      </div>

      <!-- Sticky CTA -->
      <ZmMStickyCTA :column="true">
        <ZmButton variant="primary" size="lg" :full="true" icon-right="arrow_right" :loading="submitting" :disabled="submitting || success" @click="save">
          Save password
        </ZmButton>
        <ZmButton variant="ghost" size="md" :full="true" :disabled="submitting" @click="navigateTo('/dashboard')">
          Skip — keep one-time codes
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

        <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-xl)', padding: '36px', boxShadow: 'var(--zm-shadow-md)' }">
          <div class="zm-eyebrow">Account · /account/password</div>
          <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '36px', lineHeight: '1.04', letterSpacing: '-0.025em', margin: '8px 0 10px' }">Set a <em style="font-style:italic">password.</em></h1>
          <p :style="{ font: '400 14px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0 0 24px' }">
            After saving, you can sign in with email + password instead of waiting for a code.
          </p>

          <!-- New password -->
          <div :style="{ marginBottom: '4px' }">
            <label :style="{ display: 'block', font: '500 13px var(--zm-font-body)', marginBottom: '6px' }">New password <span :style="{ color: 'var(--zm-coral-500)' }">*</span></label>
            <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', height: '40px', padding: '0 12px', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)' }">
              <ZmIcon name="lock" :size="16" color="var(--zm-fg-muted)" />
              <input
                v-model="newPassword"
                :type="showPasswords ? 'text' : 'password'"
                placeholder="At least 8 characters"
                :style="{ flex: '1', border: 'none', outline: 'none', background: 'transparent', font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg)' }"
              />
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
          <div :style="{ marginBottom: '16px' }">
            <label :style="{ display: 'block', font: '500 13px var(--zm-font-body)', marginBottom: '6px' }">Confirm new password <span :style="{ color: 'var(--zm-coral-500)' }">*</span></label>
            <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', height: '40px', padding: '0 12px', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)' }">
              <ZmIcon name="lock" :size="16" color="var(--zm-fg-muted)" />
              <input
                v-model="confirmPassword"
                :type="showPasswords ? 'text' : 'password'"
                placeholder="Re-enter password"
                :style="{ flex: '1', border: 'none', outline: 'none', background: 'transparent', font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg)' }"
                @keydown.enter="save"
              />
              <ZmIcon v-if="confirmPassword && confirmPassword === newPassword" name="check" :size="16" color="var(--zm-success)" />
            </div>
            <p v-if="confirmPassword && confirmPassword !== newPassword" :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-coral-500)', margin: '5px 0 0' }">Passwords do not match.</p>
            <p v-else :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '5px 0 0' }">Both passwords must match.</p>
          </div>

          <!-- Show passwords checkbox -->
          <div :style="{ marginBottom: '24px' }">
            <label :style="{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }">
              <div
                :style="{
                  width: '18px', height: '18px', borderRadius: '4px', flexShrink: '0',
                  background: showPasswords ? 'var(--zm-ink-700)' : 'var(--zm-white)',
                  border: `1.5px solid ${showPasswords ? 'var(--zm-ink-700)' : 'var(--zm-border-strong)'}`,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }"
                @click="showPasswords = !showPasswords"
              >
                <ZmIcon v-if="showPasswords" name="check" :size="13" color="var(--zm-paper)" :stroke="2.6" />
              </div>
              <span :style="{ font: '400 13px var(--zm-font-body)' }">Show passwords</span>
            </label>
          </div>

          <!-- Error / success -->
          <ZmAlert v-if="error" tone="error" :style="{ margin: '-12px 0 12px' }">{{ error }}</ZmAlert>
          <ZmAlert v-if="success" tone="success" :style="{ marginBottom: '12px' }">Password saved! Redirecting…</ZmAlert>

          <!-- Actions -->
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '10px' }">
            <ZmButton variant="primary" size="lg" :full="true" icon-right="arrow_right" :loading="submitting" :disabled="submitting || success" @click="save">
              {{ submitting ? 'Saving…' : 'Login' }}
            </ZmButton>
            <ZmButton variant="ghost" size="md" :full="true" :disabled="submitting" @click="navigateTo('/dashboard')">
              Skip — keep using one-time codes
            </ZmButton>
          </div>

          <p :style="{ font: '400 11.5px/1.45 var(--zm-font-body)', color: 'var(--zm-fg-muted)', textAlign: 'center', marginTop: '16px' }">
            Tapping <strong :style="{ color: 'var(--zm-ink-950)' }">Login</strong> saves your password and signs you in with your new credentials.
          </p>
        </div>

        <p :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textAlign: 'center', marginTop: '20px' }">
          You can change or remove this later from Account settings.
        </p>
      </div>
    </div>
  </template>
</template>
