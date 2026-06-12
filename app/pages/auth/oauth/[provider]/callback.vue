<script setup lang="ts">
definePageMeta({ layout: false })

const route = useRoute()
const { public: { appUrl } } = useRuntimeConfig()

const provider = computed(() => route.params.provider as string)
const step = ref(0)

const STEPS = [
  'Validating security token',
  'Exchanging authorization code',
  'Establishing your session',
]

const PROVIDER_LABELS: Record<string, string> = {
  google: 'Google',
  apple: 'Apple',
  linkedin: 'LinkedIn',
}

const providerLabel = computed(() => PROVIDER_LABELS[provider.value] ?? provider.value)

let t1: ReturnType<typeof setTimeout>
let t2: ReturnType<typeof setTimeout>

onMounted(() => {
  t1 = setTimeout(() => { step.value = 1 }, 1100)
  t2 = setTimeout(() => { step.value = 2 }, 2300)
  window.location.replace(`${appUrl}/auth/oauth/${provider.value}/callback${window.location.search}`)
})

onUnmounted(() => {
  clearTimeout(t1)
  clearTimeout(t2)
})
</script>

<template>
  <div
    class="zm-root"
    :style="{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--zm-paper)', padding: '24px' }"
  >
    <!-- Card -->
    <div :style="{ width: '100%', maxWidth: '420px', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-xl)', padding: '36px', boxShadow: 'var(--zm-shadow-md)' }">

      <!-- Exchange visual -->
      <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }">
        <!-- Provider logo circle -->
        <div :style="{ width: '52px', height: '52px', borderRadius: '50%', border: '1.5px solid var(--zm-border)', background: 'var(--zm-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }">
          <!-- Google -->
          <svg v-if="provider === 'google'" width="24" height="24" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.97 10.97 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <!-- Apple -->
          <svg v-else-if="provider === 'apple'" width="24" height="24" viewBox="0 0 24 24" fill="var(--zm-ink-950)">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
          <!-- LinkedIn -->
          <svg v-else-if="provider === 'linkedin'" width="24" height="24" viewBox="0 0 24 24" fill="#0A66C2">
            <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.27c-.96 0-1.74-.78-1.74-1.74s.78-1.74 1.74-1.74 1.74.78 1.74 1.74-.78 1.74-1.74 1.74zm13.5 12.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-11h2.88v1.5h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6v6.46z"/>
          </svg>
          <!-- Fallback -->
          <ZmIcon v-else name="user" :size="22" color="var(--zm-fg-muted)" />
        </div>

        <!-- Transit track -->
        <div :style="{ position: 'relative', width: '72px', height: '2px', background: 'var(--zm-ink-100)', flexShrink: '0', overflow: 'visible' }">
          <span class="zm-transit-dot" />
        </div>

        <!-- Zeemic mark circle -->
        <div :style="{ width: '52px', height: '52px', borderRadius: '50%', border: '1.5px solid var(--zm-border)', background: 'var(--zm-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }">
          <svg width="28" height="28" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <path d="M10 12 H54 V22 L24 42 H54 V52 H10 V42 L40 22 H10 Z" fill="var(--zm-ink-700)" />
            <path d="M44 12 H54 V22 H50 Z" fill="var(--zm-gold-500)" />
            <path d="M10 42 H20 L10 52 Z" fill="var(--zm-gold-500)" />
          </svg>
        </div>
      </div>

      <!-- Eyebrow -->
      <div class="zm-eyebrow" :style="{ textAlign: 'center' }">Signing you in</div>

      <!-- Heading -->
      <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '34px', lineHeight: '1.05', letterSpacing: '-0.025em', margin: '8px 0', textAlign: 'center' }">
        Completing sign-in<span class="zm-ellipsis-pulse">…</span>
      </h1>

      <!-- Description -->
      <p :style="{ font: '400 14px/1.55 var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0 auto 22px', textAlign: 'center', maxWidth: '320px' }">
        Finishing your <strong :style="{ color: 'var(--zm-ink-950)' }">{{ providerLabel }}</strong> sign-in. This usually takes a couple of seconds — please keep this tab open.
      </p>

      <!-- Step list -->
      <div :style="{ borderTop: '1px solid var(--zm-border)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }">
        <div
          v-for="(label, i) in STEPS"
          :key="i"
          :style="{ display: 'flex', alignItems: 'center', gap: '10px' }"
        >
          <!-- Done -->
          <div
            v-if="i < step"
            :style="{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--zm-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 12l5 5 11-12" />
            </svg>
          </div>
          <!-- Current -->
          <div v-else-if="i === step" :style="{ width: '18px', height: '18px', flexShrink: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }">
            <ZmSpinner :size="14" color="var(--zm-ink-700)" />
          </div>
          <!-- Pending -->
          <div
            v-else
            :style="{ width: '18px', height: '18px', borderRadius: '50%', border: '1.5px solid var(--zm-border-strong)', flexShrink: '0' }"
          />
          <span
            :style="{
              font: i === step ? '500 13px var(--zm-font-body)' : '400 13px var(--zm-font-body)',
              color: i < step ? 'var(--zm-success)' : i === step ? 'var(--zm-ink-950)' : 'var(--zm-fg-muted)',
            }"
          >{{ label }}</span>
        </div>
      </div>
    </div>

    <!-- Shell footer -->
    <p :style="{ font: '400 11px var(--zm-font-mono)', color: 'var(--zm-fg-subtle)', marginTop: '20px', letterSpacing: '0.05em', textAlign: 'center' }">
      {{ providerLabel }} · zeemic.com/auth/callback
    </p>
  </div>
</template>

<style scoped>
@keyframes zm-transit {
  0%   { left: 0; opacity: 0; transform: scale(0.5); }
  20%  { opacity: 1; transform: scale(1); }
  80%  { opacity: 1; transform: scale(1); }
  100% { left: calc(100% - 6px); opacity: 0; transform: scale(0.5); }
}

@keyframes zm-pulse {
  0%, 100% { opacity: 0.35; transform: scale(0.7); }
  50%       { opacity: 1;    transform: scale(1); }
}

.zm-transit-dot {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--zm-ink-700);
  top: -2px;
  animation: zm-transit 1.4s ease-in-out infinite;
}

.zm-ellipsis-pulse {
  display: inline-block;
  animation: zm-pulse 1.2s ease-in-out infinite;
}
</style>
