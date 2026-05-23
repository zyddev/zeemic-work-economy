<script setup lang="ts">
useHead({ title: 'Forgot Password — Zeemic' })

const email = ref('')
const error = ref('')
const sent = ref(false)
const submitting = ref(false)

const { requestPasswordReset } = useAuth()
const { isMobile } = useBreakpoint()
const toast = useToast()

async function sendReset() {
  error.value = ''
  if (!email.value.includes('@')) {
    error.value = 'Please enter a valid email.'
    return
  }
  submitting.value = true
  try {
    await requestPasswordReset(email.value)
    sent.value = true
  } catch {
    error.value = 'Something went wrong. Please try again.'
    toast.error('Something went wrong. Please try again.')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="zm-root" :style="{ minHeight: '100vh', background: 'var(--zm-paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '24px 12px' : '40px 16px' }">
    <div :style="{ width: '100%', maxWidth: '420px' }">

      <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-xl)', padding: isMobile ? '24px 20px' : '40px', boxShadow: 'var(--zm-shadow-lg)' }">

        <!-- Icon -->
        <div :style="{ width: '52px', height: '52px', borderRadius: 'var(--zm-r-lg)', background: 'var(--zm-ink-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }">
          <ZmIcon :name="sent ? 'check' : 'mail'" :size="24" color="var(--zm-ink-700)" />
        </div>

        <!-- State: not sent -->
        <template v-if="!sent">
          <div :style="{ marginBottom: '28px' }">
            <ZmWordmark :height="28" :style="{ marginBottom: '20px' }" />
            <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '36px', lineHeight: '1', letterSpacing: '-0.025em', margin: '0 0 8px' }">Forgot your password?</h1>
            <p :style="{ font: '400 15px var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0' }">Enter your email address and we'll send you a link to reset your password.</p>
          </div>

          <div :style="{ display: 'flex', flexDirection: 'column', gap: '16px' }">
            <div>
              <div class="zm-eyebrow" :style="{ marginBottom: '8px' }">Email address</div>
              <div :style="{
                display: 'flex', alignItems: 'center', gap: '10px',
                height: '48px', padding: '0 14px',
                background: 'var(--zm-white)',
                border: error ? '1.5px solid #ef4444' : '1px solid var(--zm-border)',
                borderRadius: 'var(--zm-r-md)', boxShadow: 'var(--zm-shadow-xs)',
              }">
                <ZmIcon name="mail" :size="16" color="var(--zm-fg-muted)" />
                <input
                  v-model="email"
                  type="email"
                  placeholder="you@example.com"
                  autofocus
                  :style="{ flex: '1', border: 'none', outline: 'none', background: 'transparent', font: '400 15px var(--zm-font-body)', color: 'var(--zm-fg)' }"
                  @keydown.enter="sendReset"
                />
              </div>
              <ZmAlert v-if="error" tone="error" :style="{ marginTop: '6px' }">{{ error }}</ZmAlert>
            </div>

            <ZmButton variant="dark" size="lg" :full="true" icon-right="arrow_right" :loading="submitting" :disabled="submitting" @click="sendReset">
              {{ submitting ? 'Sending…' : 'Send reset link' }}
            </ZmButton>

            <NuxtLink to="/login" :style="{ display: 'block', textAlign: 'center', font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textDecoration: 'none' }">
              Back to sign in
            </NuxtLink>
          </div>
        </template>

        <!-- State: sent -->
        <template v-else>
          <div :style="{ marginBottom: '28px' }">
            <ZmWordmark :height="28" :style="{ marginBottom: '20px' }" />
            <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '36px', lineHeight: '1', letterSpacing: '-0.025em', margin: '0 0 8px' }">Check your inbox</h1>
            <p :style="{ font: '400 15px var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0' }">
              If your email is registered, you'll receive a reset link shortly.
            </p>
          </div>

          <div :style="{ display: 'flex', flexDirection: 'column', gap: '12px' }">
            <p :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textAlign: 'center', margin: '0' }">
              Didn't receive it?
              <button
                :style="{ border: 'none', background: 'transparent', cursor: 'pointer', font: '500 13px var(--zm-font-body)', color: 'var(--zm-ink-700)', padding: '0' }"
                :disabled="submitting"
                @click="sendReset"
              >{{ submitting ? 'Resending…' : 'Resend' }}</button>
            </p>
            <NuxtLink to="/login" :style="{ display: 'block', textAlign: 'center', font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textDecoration: 'none' }">
              Back to sign in
            </NuxtLink>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
