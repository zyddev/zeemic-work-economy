<script setup lang="ts">
useHead({ title: 'Set New Password — Zeemic' })

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)
const error = ref('')
const success = ref(false)
const submitting = ref(false)

const { resetTemporaryPassword } = useAuth()
const { isMobile } = useBreakpoint()
const router = useRouter()

const strengthLevel = computed(() => {
  const p = password.value
  if (!p) return 0
  let score = 0
  if (p.length >= 8) score++
  if (p.length >= 12) score++
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++
  if (/\d/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return Math.min(score, 4)
})

const strengthLabel = computed(() => ['', 'Weak', 'Fair', 'Good', 'Strong'][strengthLevel.value])
const strengthColor = computed(() => ['', '#ef4444', '#f59e0b', '#3b82f6', 'var(--zm-success, #16a34a)'][strengthLevel.value])

async function submit() {
  error.value = ''
  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters.'
    return
  }
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }
  submitting.value = true
  try {
    await resetTemporaryPassword(password.value)
    success.value = true
    setTimeout(() => navigateTo('/dashboard'), 1500)
  } catch (err: any) {
    error.value = err?.data?.statusMessage ?? err?.message ?? 'Failed to update password.'
  } finally {
    submitting.value = false
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
          <p :style="{ font: '400 13.5px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0' }">Your account requires a new password before you can continue.</p>
        </div>

        <!-- Form area -->
        <div :style="{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '14px' }">

          <ZmAlert tone="info" title="Security note">
            All other devices will be signed out when you save.
          </ZmAlert>

          <ZmField label="New password" :required="true">
            <ZmInput v-model="password" type="password" :full="true" placeholder="At least 12 characters" trailing-icon="eye" size="lg" />
          </ZmField>

          <ZmField label="Confirm new password" :required="true" help="Both passwords must match.">
            <ZmInput v-model="confirmPassword" type="password" :full="true" placeholder="Re-enter password" trailing-icon="check" size="lg" />
          </ZmField>

          <!-- Error -->
          <p v-if="error" :style="{ font: '400 13px var(--zm-font-body)', color: '#ef4444', margin: '0' }">{{ error }}</p>

          <!-- Success -->
          <div v-if="success" :style="{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 14px', background: 'var(--zm-success-bg, #f0fdf4)', border: '1px solid var(--zm-success, #16a34a)22', borderRadius: 'var(--zm-r-md)' }">
            <ZmIcon name="check" :size="16" color="var(--zm-success, #16a34a)" />
            <span :style="{ font: '500 13px var(--zm-font-body)', color: 'var(--zm-success, #16a34a)' }">Password updated! Redirecting you…</span>
          </div>

        </div>
      </div>

      <!-- Sticky CTA -->
      <ZmMStickyCTA>
        <ZmButton variant="primary" size="lg" :full="true" icon-right="arrow_right" :loading="submitting" :disabled="submitting || success" @click="submit">
          Save and sign in
        </ZmButton>
      </ZmMStickyCTA>
    </div>
  </template>

  <!-- Desktop -->
  <template v-else>
    <div class="zm-root" :style="{ minHeight: '100vh', background: 'var(--zm-paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }">
      <div :style="{ width: '100%', maxWidth: '420px' }">

        <!-- Card -->
        <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-xl)', padding: '40px', boxShadow: 'var(--zm-shadow-lg)' }">

          <!-- Icon -->
          <div :style="{ width: '52px', height: '52px', borderRadius: 'var(--zm-r-lg)', background: 'var(--zm-ink-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }">
            <ZmIcon name="lock" :size="24" color="var(--zm-ink-700)" />
          </div>

          <div :style="{ marginBottom: '28px' }">
            <ZmWordmark :height="28" :style="{ marginBottom: '20px' }" />
            <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '36px', lineHeight: '1', letterSpacing: '-0.025em', margin: '0 0 8px' }">Set your password</h1>
            <p :style="{ font: '400 15px var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0' }">Your account requires a new password before you can continue.</p>
          </div>

          <div :style="{ display: 'flex', flexDirection: 'column', gap: '16px' }">
            <!-- New password -->
            <div>
              <div class="zm-eyebrow" :style="{ marginBottom: '8px' }">New password</div>
              <div :style="{
                display: 'flex', alignItems: 'center', gap: '10px',
                height: '48px', padding: '0 14px',
                background: 'var(--zm-white)',
                border: error && !confirmPassword ? '1.5px solid #ef4444' : '1px solid var(--zm-border)',
                borderRadius: 'var(--zm-r-md)', boxShadow: 'var(--zm-shadow-xs)',
              }">
                <ZmIcon name="lock" :size="16" color="var(--zm-fg-muted)" />
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="At least 8 characters"
                  :style="{ flex: '1', border: 'none', outline: 'none', background: 'transparent', font: '400 15px var(--zm-font-body)', color: 'var(--zm-fg)' }"
                  @keydown.enter="submit"
                />
                <button type="button" :style="{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center' }" @click="showPassword = !showPassword">
                  <ZmIcon :name="showPassword ? 'eye_off' : 'eye'" :size="16" color="var(--zm-fg-muted)" />
                </button>
              </div>
              <!-- Strength meter -->
              <div v-if="password" :style="{ display: 'flex', gap: '4px', marginTop: '8px', alignItems: 'center' }">
                <div v-for="i in 4" :key="i" :style="{ flex: '1', height: '3px', borderRadius: '2px', background: i <= strengthLevel ? strengthColor : 'var(--zm-border)', transition: 'background 200ms' }" />
                <span :style="{ font: '500 11px var(--zm-font-body)', color: strengthColor, marginLeft: '8px', minWidth: '36px', transition: 'color 200ms' }">{{ strengthLabel }}</span>
              </div>
            </div>

            <!-- Confirm password -->
            <div>
              <div class="zm-eyebrow" :style="{ marginBottom: '8px' }">Confirm password</div>
              <div :style="{
                display: 'flex', alignItems: 'center', gap: '10px',
                height: '48px', padding: '0 14px',
                background: 'var(--zm-white)',
                border: error ? '1.5px solid #ef4444' : '1px solid var(--zm-border)',
                borderRadius: 'var(--zm-r-md)', boxShadow: 'var(--zm-shadow-xs)',
              }">
                <ZmIcon name="lock" :size="16" color="var(--zm-fg-muted)" />
                <input
                  v-model="confirmPassword"
                  :type="showConfirm ? 'text' : 'password'"
                  placeholder="Repeat your new password"
                  :style="{ flex: '1', border: 'none', outline: 'none', background: 'transparent', font: '400 15px var(--zm-font-body)', color: 'var(--zm-fg)' }"
                  @keydown.enter="submit"
                />
                <button type="button" :style="{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center' }" @click="showConfirm = !showConfirm">
                  <ZmIcon :name="showConfirm ? 'eye_off' : 'eye'" :size="16" color="var(--zm-fg-muted)" />
                </button>
              </div>
            </div>

            <!-- Error -->
            <p v-if="error" :style="{ font: '400 13px var(--zm-font-body)', color: '#ef4444', margin: '0' }">{{ error }}</p>

            <!-- Success -->
            <div v-if="success" :style="{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 14px', background: 'var(--zm-success-bg, #f0fdf4)', border: '1px solid var(--zm-success, #16a34a)22', borderRadius: 'var(--zm-r-md)' }">
              <ZmIcon name="check" :size="16" color="var(--zm-success, #16a34a)" />
              <span :style="{ font: '500 13px var(--zm-font-body)', color: 'var(--zm-success, #16a34a)' }">Password updated! Redirecting you…</span>
            </div>

            <ZmButton variant="dark" size="lg" :full="true" :loading="submitting" :disabled="submitting || success" @click="submit">
              {{ submitting ? 'Updating…' : 'Set password' }}
            </ZmButton>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>
