<script setup lang="ts">
useHead({ title: 'Community Guidelines — Zeemic' })

const { isMobile } = useBreakpoint()
</script>

<template>
  <div class="zm-root" style="background:var(--zm-paper);min-height:100vh">
    <div :style="{ maxWidth: '760px', margin: '0 auto', padding: isMobile ? '40px 16px' : '80px 32px' }">
      <NuxtLink to="/exchange" style="text-decoration:none;display:inline-flex;align-items:center;gap:8px;margin-bottom:40px">
        <ZmWordmark :height="22" />
      </NuxtLink>
      <div class="zm-eyebrow" style="margin-bottom:12px">Community</div>
      <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: isMobile ? '40px' : '60px', lineHeight: '1.0', letterSpacing: '-0.03em', margin: '0 0 48px' }">
        Community Guidelines
      </h1>
      <ZmDivider style="margin-bottom:32px" />
      <div :style="{ font: '400 16px/1.7 var(--zm-font-body)', color: 'var(--zm-fg)' }">
        <p>Zeemic is a professional marketplace. We expect all members to interact with respect, honesty, and integrity.</p>
        <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '28px', letterSpacing: '-0.02em', margin: '40px 0 16px' }">Be Accurate</h2>
        <p>Represent your skills, experience, and credentials truthfully. Misrepresentation is grounds for removal.</p>
        <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '28px', letterSpacing: '-0.02em', margin: '40px 0 16px' }">Respect Others</h2>
        <p>Treat every member — buyers, sellers, and recruiters — with professionalism. Harassment or discrimination will result in account suspension.</p>
        <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '28px', letterSpacing: '-0.02em', margin: '40px 0 16px' }">Transact on Platform</h2>
        <p>All payments must go through Zeemic's escrow system. Off-platform transactions forfeit buyer protection.</p>
        <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '28px', letterSpacing: '-0.02em', margin: '40px 0 16px' }">Report Issues</h2>
        <p>If you encounter a violation, use the report feature on any listing or profile. Our team reviews all reports within 48 hours.</p>
      </div>
    </div>
  </div>
</template>
