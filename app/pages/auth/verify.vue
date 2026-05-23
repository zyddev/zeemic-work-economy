<script setup lang="ts">
useHead({ title: 'Verify code — Zeemic' })

const route = useRoute()
const email = computed(() => (route.query.email as string) || '')
const next = computed(() => (route.query.next as string) || '/dashboard')

const code = ref(['', '', '', '', '', ''])
const focusedIdx = ref(-1)
const error = ref('')
const submitting = ref(false)
const resending = ref(false)
const resent = ref(false)
const countdown = ref(0)
const otpRefs = ref<HTMLInputElement[]>([])

const { verifyOTC, requestOTC } = useAuth()
const { isMobile } = useBreakpoint()
const router = useRouter()
const toast = useToast()

let countdownTimer: ReturnType<typeof setInterval> | null = null
function startCountdown(seconds = 30) {
  countdown.value = seconds
  if (countdownTimer) clearInterval(countdownTimer)
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0 && countdownTimer) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  }, 1000)
}
onMounted(() => startCountdown())
onUnmounted(() => { if (countdownTimer) clearInterval(countdownTimer) })

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

async function verify() {
  error.value = ''
  if (code.value.some(d => d === '')) { error.value = 'Please enter all 6 digits.'; return }
  submitting.value = true
  try {
    await verifyOTC(email.value, code.value.join(''))
    await navigateTo(next.value)
  } catch (err: any) {
    error.value = err?.data?.statusMessage ?? err?.message ?? 'Invalid or expired code. Please try again.'
  } finally {
    submitting.value = false
  }
}

async function resend() {
  if (countdown.value > 0 || resending.value) return
  resending.value = true
  resent.value = false
  try {
    await requestOTC(email.value)
    resent.value = true
    startCountdown(30)
    setTimeout(() => { resent.value = false }, 4000)
    toast.success('Code resent — check your inbox.')
  } catch {
    toast.error('Failed to resend. Please try again.')
  } finally {
    resending.value = false
  }
}
</script>

<style>
@keyframes zm-blink { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }
</style>

<template>
  <!-- Mobile -->
  <template v-if="isMobile">
    <div :style="{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--zm-paper)' }">

      <ZmMNavBar title="Verify" leftLabel="Back" @back="router.back()" />

      <!-- Scrollable area -->
      <div :style="{ flex: '1', overflowY: 'auto', padding: '20px 0' }">

        <!-- Auth header -->
        <div :style="{ padding: '8px 20px 16px' }">
          <div class="zm-eyebrow">One-time code</div>
          <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '32px', lineHeight: '1.04', letterSpacing: '-0.025em', margin: '8px 0 6px' }">Check your <em style="font-style:italic">inbox.</em></h1>
          <p :style="{ font: '400 13.5px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0' }">
            We sent a 6-digit code to <strong :style="{ color: 'var(--zm-ink-950)' }">{{ email || 'your email' }}</strong>. It expires in 10 minutes.
          </p>
        </div>

        <!-- Code input area -->
        <div :style="{ padding: '12px 16px' }">
          <!-- 6 OTP boxes -->
          <div :style="{ display: 'flex', gap: '6px', justifyContent: 'space-between' }">
            <input
              v-for="(_, i) in code"
              :key="i"
              :ref="(el) => { if (el) otpRefs[i] = el as HTMLInputElement }"
              :value="code[i]"
              type="text"
              inputmode="numeric"
              maxlength="1"
              :style="{
                flex: '1',
                height: '64px',
                border: code[i] !== '' ? '2px solid var(--zm-ink-700)' : focusedIdx === i ? '2px solid var(--zm-ink-700)' : '1px solid var(--zm-border)',
                boxShadow: focusedIdx === i ? '0 0 0 3px var(--zm-gold-200)' : 'none',
                borderRadius: 'var(--zm-r-md)',
                textAlign: 'center',
                fontFamily: 'var(--zm-font-mono, monospace)',
                fontSize: '28px',
                fontWeight: '600',
                color: 'var(--zm-ink-950)',
                background: 'var(--zm-white)',
                outline: 'none',
                transition: 'border-color 100ms, box-shadow 100ms',
              }"
              @input="onOtpInput(i, $event)"
              @keydown="onOtpKeydown(i, $event)"
              @focus="focusedIdx = i; ($event.target as HTMLInputElement).select()"
              @blur="focusedIdx = -1"
            />
          </div>

          <!-- Error -->
          <ZmAlert v-if="error" tone="error" :style="{ marginTop: '10px' }">{{ error }}</ZmAlert>

          <!-- Resend -->
          <div :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textAlign: 'center', marginTop: '20px' }">
            <template v-if="resent">Code resent — check your inbox.</template>
            <template v-else>
              Didn't get it?
              <button
                :style="{ border: 'none', background: 'transparent', padding: '0', font: '600 13px var(--zm-font-body)', color: countdown > 0 ? 'var(--zm-fg-muted)' : 'var(--zm-ink-700)', cursor: countdown > 0 ? 'default' : 'pointer' }"
                :disabled="countdown > 0 || resending"
                @click="resend"
              >{{ resending ? 'Resending…' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend' }}</button>
            </template>
          </div>
        </div>

      </div>

      <!-- Sticky CTA -->
      <ZmMStickyCTA>
        <ZmButton variant="primary" size="lg" :full="true" icon-right="arrow_right" :loading="submitting" :disabled="submitting" @click="verify">
          Verify and sign in
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
          <div class="zm-eyebrow">Verify code</div>
          <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '36px', lineHeight: '1.04', letterSpacing: '-0.025em', margin: '8px 0 10px' }">Enter the <em style="font-style:italic">code.</em></h1>
          <p :style="{ font: '400 14px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0 0 24px' }">
            We sent a 6-digit code to <strong :style="{ color: 'var(--zm-ink-950)' }">{{ email || 'your email' }}</strong>. It expires in 10 minutes.
          </p>

          <!-- OTP boxes -->
          <div :style="{ display: 'flex', gap: '8px', justifyContent: 'space-between', marginBottom: '16px' }">
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
                border: code[i] !== '' ? '1.5px solid var(--zm-ink-700)' : focusedIdx === i ? '1.5px solid var(--zm-ink-700)' : error ? '1px solid var(--zm-coral-500, #E84A1F)' : '1px solid var(--zm-border)',
                boxShadow: focusedIdx === i && code[i] === '' ? '0 0 0 3px var(--zm-gold-200)' : 'none',
                borderRadius: 'var(--zm-r-md)',
                textAlign: 'center',
                font: '600 26px var(--zm-font-mono, monospace)',
                color: 'var(--zm-ink-950)',
                background: 'var(--zm-white)',
                outline: 'none',
                transition: 'border-color 100ms, box-shadow 100ms',
              }"
              @input="onOtpInput(i, $event)"
              @keydown="onOtpKeydown(i, $event)"
              @focus="focusedIdx = i; ($event.target as HTMLInputElement).select()"
              @blur="focusedIdx = -1"
            />
          </div>

          <!-- Error -->
          <ZmAlert v-if="error" tone="error" :style="{ margin: '-4px 0 14px' }">{{ error }}</ZmAlert>

          <ZmButton variant="primary" size="lg" :full="true" icon-right="arrow_right" :loading="submitting" :disabled="submitting" @click="verify">
            {{ submitting ? 'Verifying…' : 'Verify and sign in' }}
          </ZmButton>

          <!-- Resend -->
          <div :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textAlign: 'center', marginTop: '18px' }">
            <template v-if="resent">Code resent — check your inbox.</template>
            <template v-else>
              Didn't get it?
              <button
                :style="{ border: 'none', background: 'transparent', padding: '0', font: '600 13px var(--zm-font-body)', color: countdown > 0 ? 'var(--zm-fg-muted)' : 'var(--zm-ink-700)', cursor: countdown > 0 ? 'default' : 'pointer' }"
                :disabled="countdown > 0 || resending"
                @click="resend"
              >{{ resending ? 'Resending…' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend' }}</button>
            </template>
          </div>

          <ZmDivider label="or" style="margin:16px 0" />

          <ZmButton variant="ghost" size="md" :full="true" icon="chevron_left" @click="navigateTo('/login')">
            Use a different method
          </ZmButton>
        </div>

        <!-- Footer -->
        <p :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textAlign: 'center', marginTop: '20px' }">
          Wrong email?
          <NuxtLink to="/login" :style="{ color: 'var(--zm-ink-700)', fontWeight: '600', textDecoration: 'none' }">Go back</NuxtLink>
        </p>
      </div>
    </div>
  </template>
</template>
