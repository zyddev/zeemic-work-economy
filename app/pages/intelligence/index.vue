<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Career Intelligence — Zeemic' })

const { isMobile } = useBreakpoint()
</script>

<template>
  <div class="zm-root" style="background:var(--zm-paper);min-height:100vh">
    <ZmHeader active="intelligence" />
    <div :style="{ maxWidth: '960px', margin: '0 auto', padding: isMobile ? '40px 16px' : '80px 32px' }">
      <div class="zm-eyebrow" style="margin-bottom:16px">Career Intelligence</div>
      <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: isMobile ? '48px' : '72px', lineHeight: '0.97', letterSpacing: '-0.035em', margin: '0 0 24px' }">
        Know where the <em style="font-style:italic">market</em> is going.
      </h1>
      <p :style="{ font: '400 18px/1.6 var(--zm-font-body)', color: 'var(--zm-fg-muted)', maxWidth: '560px', margin: '0 0 48px' }">
        Salary benchmarks, demand signals, and hiring trends — all in one place. Coming soon.
      </p>
      <ZmButton variant="primary" size="lg" icon-right="arrow_right" @click="navigateTo('/dashboard')">
        Back to Dashboard
      </ZmButton>
    </div>
  </div>
</template>
