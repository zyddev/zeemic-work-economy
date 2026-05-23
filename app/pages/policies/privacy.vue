<script setup lang="ts">
useHead({ title: 'Privacy Policy — Zeemic' })

const { isMobile } = useBreakpoint()
</script>

<template>
  <div class="zm-root" style="background:var(--zm-paper);min-height:100vh">
    <div :style="{ maxWidth: '760px', margin: '0 auto', padding: isMobile ? '40px 16px' : '80px 32px' }">
      <NuxtLink to="/exchange" style="text-decoration:none;display:inline-flex;align-items:center;gap:8px;margin-bottom:40px">
        <ZmWordmark :height="22" />
      </NuxtLink>
      <div class="zm-eyebrow" style="margin-bottom:12px">Legal</div>
      <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: isMobile ? '40px' : '60px', lineHeight: '1.0', letterSpacing: '-0.03em', margin: '0 0 8px' }">
        Privacy Policy
      </h1>
      <p :style="{ font: '400 14px var(--zm-font-mono)', color: 'var(--zm-fg-muted)', margin: '0 0 48px' }">
        Effective date: January 1, 2026
      </p>
      <ZmDivider style="margin-bottom:32px" />
      <div :style="{ font: '400 16px/1.7 var(--zm-font-body)', color: 'var(--zm-fg)' }">
        <p>This Privacy Policy explains how Zeemic collects, uses, and protects your personal information when you use the Zeemic platform.</p>
        <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '28px', letterSpacing: '-0.02em', margin: '40px 0 16px' }">1. Information We Collect</h2>
        <p>We collect information you provide directly — such as your name, email address, and profile details — as well as usage data generated when you interact with the platform.</p>
        <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '28px', letterSpacing: '-0.02em', margin: '40px 0 16px' }">2. How We Use It</h2>
        <p>We use your information to operate the marketplace, process transactions, send account notifications, and improve platform features. We do not sell your data to third parties.</p>
        <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '28px', letterSpacing: '-0.02em', margin: '40px 0 16px' }">3. Cookies</h2>
        <p>We use session cookies for authentication and analytics. You can disable cookies in your browser settings, though some features may not function correctly.</p>
        <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '28px', letterSpacing: '-0.02em', margin: '40px 0 16px' }">4. Data Retention</h2>
        <p>We retain your data as long as your account is active or as required by law. You may request deletion of your data from Account settings.</p>
        <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '28px', letterSpacing: '-0.02em', margin: '40px 0 16px' }">5. Contact</h2>
        <p>For privacy-related questions, contact us at <a href="mailto:privacy@zeemic.com" style="color:var(--zm-ink-700)">privacy@zeemic.com</a>.</p>
      </div>
      <div :style="{ marginTop: '64px', paddingTop: '32px', borderTop: '1px solid var(--zm-border)' }">
        <p :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">
          Also read our <NuxtLink to="/terms" style="color:var(--zm-ink-700)">Terms of Service</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
