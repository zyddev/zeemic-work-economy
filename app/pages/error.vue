<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Error — Zeemic' })

const route = useRoute()

// ── Error catalogue ───────────────────────────────────────────────────────────
type ErrorVariant = {
  code: string
  tone: 'neutral' | 'error' | 'warning'
  eyebrow: string
  title: string
  titleEmphasis: string
  body: string
  primary: { label: string; icon: string; href?: string }
  secondary: { label: string; icon: string; href?: string }
  ref: string
}

const ERRORS: Record<string, ErrorVariant> = {
  '404': {
    code: '404', tone: 'neutral',
    eyebrow: 'Page not found',
    title: 'This page took a', titleEmphasis: 'wrong turn.',
    body: 'The link may be broken, or the page may have moved. Let\'s get you back to somewhere useful.',
    primary: { label: 'Back to marketplace', icon: 'arrow_right', href: '/exchange' },
    secondary: { label: 'Search listings', icon: 'search', href: '/exchange' },
    ref: 'ref_9a2f-404',
  },
  '500': {
    code: '500', tone: 'error',
    eyebrow: 'Server error',
    title: 'Something broke on', titleEmphasis: 'our end.',
    body: "This one's on us. The team has been notified automatically. Try again in a moment, or head back home.",
    primary: { label: 'Try again', icon: 'arrow_right' },
    secondary: { label: 'Back to home', icon: 'chevron_left', href: '/' },
    ref: 'ref_3c8b-500',
  },
  '403': {
    code: '403', tone: 'warning',
    eyebrow: 'Access denied',
    title: "You don't have", titleEmphasis: 'access here.',
    body: "Your account isn't permitted to view this page. If you think this is a mistake, sign in with a different account or ask an admin.",
    primary: { label: 'Sign in', icon: 'arrow_right', href: '/login' },
    secondary: { label: 'Back to home', icon: 'chevron_left', href: '/' },
    ref: 'ref_71de-403',
  },
  '503': {
    code: '503', tone: 'warning',
    eyebrow: 'Scheduled maintenance',
    title: 'Down for a', titleEmphasis: 'quick tune-up.',
    body: "We're shipping an upgrade and will be back shortly. Bookings and payments resume automatically — nothing is lost.",
    primary: { label: 'Check status page', icon: 'arrow_up_right', href: 'https://status.zeemic.com' },
    secondary: { label: 'Retry now', icon: 'arrow_right' },
    ref: `maint_${new Date().toISOString().slice(0, 10)}`,
  },
  offline: {
    code: '⚲', tone: 'neutral',
    eyebrow: 'No connection',
    title: "You're", titleEmphasis: 'offline.',
    body: "We can't reach Zeemic right now. Check your internet connection and try again — your draft is saved locally.",
    primary: { label: 'Retry', icon: 'arrow_right' },
    secondary: { label: 'Back to home', icon: 'chevron_left', href: '/' },
    ref: 'net_offline',
  },
  oauth: {
    code: '!', tone: 'error',
    eyebrow: 'Authentication failed',
    title: 'Sign-in', titleEmphasis: 'failed.',
    body: 'We couldn\'t complete your sign-in. Please try again — if the problem persists, contact support.',
    primary: { label: 'Try again', icon: 'arrow_right', href: '/login' },
    secondary: { label: 'Back to sign-in', icon: 'chevron_left', href: '/login' },
    ref: 'ERR_OAUTH',
  },
}

// ── Resolve which variant to show ─────────────────────────────────────────────
const resolvedVariant = computed((): ErrorVariant => {
  const code = route.query.code as string | undefined
  const msg = route.query.msg as string | undefined

  if (code && ERRORS[code]) return ERRORS[code]!
  if (msg) {
    // OAuth error from backend: ?msg=Authentication%20Failed
    return {
      ...ERRORS.oauth!,
      body: decodeURIComponent(msg),
    }
  }
  return ERRORS['404']!
})

const e = resolvedVariant

const accentColor = computed(() => ({
  neutral: 'var(--zm-ink-300)',
  error: 'var(--zm-coral-400)',
  warning: 'var(--zm-gold-400)',
}[e.value.tone]))

const medallionBg = computed(() => ({
  neutral: 'var(--zm-ink-50)',
  error: 'var(--zm-coral-50)',
  warning: 'var(--zm-gold-50)',
}[e.value.tone]))

const medallionColor = computed(() => ({
  neutral: 'var(--zm-ink-600)',
  error: 'var(--zm-coral-600, #dc2626)',
  warning: 'var(--zm-gold-600, #ca8a04)',
}[e.value.tone]))

const MEDALLION_ICONS: Record<string, string> = {
  '404': 'search',
  '500': 'bolt',
  '403': 'user',
  '503': 'settings',
  offline: 'globe',
  oauth: 'alert_circle',
}
const medallionIcon = computed(() => {
  const code = route.query.code as string | undefined
  if (code && MEDALLION_ICONS[code]) return MEDALLION_ICONS[code]!
  if (route.query.msg) return 'alert_circle'
  return 'search'
})

function handlePrimary() {
  const href = e.value.primary.href
  if (href) {
    if (href.startsWith('http')) window.open(href, '_blank')
    else navigateTo(href)
  } else {
    window.location.reload()
  }
}

function handleSecondary() {
  const href = e.value.secondary.href
  if (href) navigateTo(href)
  else window.location.reload()
}
</script>

<template>
  <div class="zm-root" :style="{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1.05fr 1fr' }">

    <!-- Left — dark editorial panel with oversized code watermark -->
    <div :style="{ background: 'var(--zm-ink-950)', color: 'var(--zm-paper)', padding: '56px 60px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }">
      <!-- Oversized code watermark -->
      <div
        aria-hidden
        :style="{
          position: 'absolute', right: '-30px', bottom: '-120px',
          fontFamily: 'var(--zm-font-display)', fontSize: '520px', lineHeight: '0.8',
          color: 'rgba(245,241,232,0.05)', letterSpacing: '-0.04em',
          pointerEvents: 'none', userSelect: 'none',
        }"
      >
        {{ e.code }}
      </div>

      <NuxtLink to="/" :style="{ textDecoration: 'none', flexShrink: '0' }">
        <ZmWordmark :height="26" color="var(--zm-paper)" />
      </NuxtLink>

      <!-- Large code display -->
      <div :style="{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }">
        <div :style="{ display: 'flex', alignItems: 'baseline', gap: '4px' }">
          <span :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '200px', lineHeight: '0.86', letterSpacing: '-0.04em', color: 'var(--zm-paper)' }">
            {{ e.code }}
          </span>
          <span :style="{ width: '16px', height: '16px', borderRadius: '8px', background: accentColor, transform: 'translateY(-18px)', flexShrink: '0' }" />
        </div>
        <div class="zm-eyebrow" :style="{ color: accentColor, marginTop: '10px' }">{{ e.eyebrow }}</div>
      </div>

      <div :style="{ font: '400 11px var(--zm-font-mono)', color: 'var(--zm-fg-on-dark-muted)', letterSpacing: '0.05em' }">
        © 2026 ZEEMIC · {{ e.ref }}
      </div>
    </div>

    <!-- Right — recovery content on paper -->
    <div :style="{ padding: '56px 60px', display: 'flex', alignItems: 'center', background: 'var(--zm-paper)' }">
      <div :style="{ maxWidth: '420px', width: '100%' }">

        <!-- Medallion -->
        <div
          :style="{
            width: '68px', height: '68px', borderRadius: '50%',
            background: medallionBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '24px',
          }"
        >
          <ZmIcon :name="medallionIcon" :size="32" :color="medallionColor" />
        </div>

        <!-- Headline -->
        <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '48px', lineHeight: '1.02', letterSpacing: '-0.03em', margin: '0 0 14px' }">
          {{ e.title }} <em style="font-style:italic">{{ e.titleEmphasis }}</em>
        </h1>

        <!-- Body -->
        <p :style="{ font: '400 16px/1.6 var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0 0 28px' }">
          {{ e.body }}
        </p>

        <!-- Actions -->
        <div :style="{ display: 'flex', gap: '10px', flexWrap: 'wrap' }">
          <ZmButton variant="primary" size="lg" :icon-right="e.primary.icon" @click="handlePrimary">
            {{ e.primary.label }}
          </ZmButton>
          <ZmButton variant="secondary" size="lg" :icon="e.secondary.icon" @click="handleSecondary">
            {{ e.secondary.label }}
          </ZmButton>
        </div>

        <!-- Support ref -->
        <div :style="{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--zm-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }">
          <span :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">
            Still stuck? Share this code with support.
          </span>
          <span :style="{ font: '500 11px var(--zm-font-mono)', color: 'var(--zm-ink-700)', background: 'var(--zm-ink-50)', padding: '5px 9px', borderRadius: 'var(--zm-r-sm)', letterSpacing: '0.03em', whiteSpace: 'nowrap' }">
            {{ e.ref }}
          </span>
        </div>
      </div>
    </div>

  </div>
</template>
