<script setup lang="ts">
useHead({ title: 'Terms of Service — Zeemic' })

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
        Terms of Service
      </h1>
      <p :style="{ font: '400 14px var(--zm-font-mono)', color: 'var(--zm-fg-muted)', margin: '0 0 48px' }">
        Effective date: January 1, 2026
      </p>
      <ZmDivider style="margin-bottom:32px" />
      <div :style="{ font: '400 16px/1.7 var(--zm-font-body)', color: 'var(--zm-fg)' }">
        <p>These Terms of Service govern your use of the Zeemic platform. By creating an account or using any Zeemic service, you agree to these terms.</p>
        <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '28px', letterSpacing: '-0.02em', margin: '40px 0 16px' }">1. Use of the Platform</h2>
        <p>Zeemic provides a marketplace for skills, job listings, and recruiter services. You may use the platform only for lawful purposes and in accordance with these terms.</p>
        <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '28px', letterSpacing: '-0.02em', margin: '40px 0 16px' }">2. Accounts</h2>
        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.</p>
        <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '28px', letterSpacing: '-0.02em', margin: '40px 0 16px' }">3. Transactions</h2>
        <p>Payments for services are processed through Zeemic's escrow system. Zeemic earns a platform fee only when transactions are completed.</p>
        <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '28px', letterSpacing: '-0.02em', margin: '40px 0 16px' }">4. Content</h2>
        <p>You retain ownership of content you post. By posting content, you grant Zeemic a non-exclusive license to display it on the platform.</p>
        <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '28px', letterSpacing: '-0.02em', margin: '40px 0 16px' }">5. Termination</h2>
        <p>We may suspend or terminate accounts that violate these terms. You may close your account at any time from Account settings.</p>
      </div>
      <div :style="{ marginTop: '64px', paddingTop: '32px', borderTop: '1px solid var(--zm-border)' }">
        <p :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">
          Questions? Email <a href="mailto:legal@zeemic.com" style="color:var(--zm-ink-700)">legal@zeemic.com</a>
        </p>
      </div>
    </div>
  </div>
</template>
