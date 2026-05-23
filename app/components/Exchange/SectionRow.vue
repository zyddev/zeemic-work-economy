<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  subtitle?: string
  href: string
  theme?: 'light' | 'dark'
}>()
</script>
<template>
  <section :style="{
    padding: '64px 80px',
    background: theme === 'dark' ? 'var(--zm-ink-900)' : 'var(--zm-paper)',
    color: theme === 'dark' ? 'var(--zm-fg-on-dark)' : 'inherit',
    borderBottom: theme === 'dark' ? 'none' : '1px solid var(--zm-border)',
  }">
    <div :style="{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px' }">
      <div :style="{ display: 'flex', alignItems: 'flex-start', gap: '18px' }">
        <div :style="{
          width: '48px', height: '48px', borderRadius: 'var(--zm-r-md)',
          background: theme === 'dark' ? 'rgba(245,241,232,0.08)' : 'var(--zm-ink-100)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: theme === 'dark' ? 'var(--zm-gold-500)' : 'var(--zm-ink-700)',
          flexShrink: '0',
        }">
          <ZmIcon :name="icon" :size="22" />
        </div>
        <div>
          <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '44px', lineHeight: '1', letterSpacing: '-0.025em', margin: '0' }">{{ title }}</h2>
          <p v-if="subtitle" :style="{ font: '400 16px/1.4 var(--zm-font-body)', color: theme === 'dark' ? 'var(--zm-fg-on-dark-muted)' : 'var(--zm-fg-muted)', marginTop: '8px', maxWidth: '540px' }">{{ subtitle }}</p>
        </div>
      </div>
      <NuxtLink :to="href" :style="{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        font: '500 14px var(--zm-font-body)',
        color: theme === 'dark' ? 'var(--zm-paper)' : 'var(--zm-ink-950)',
        textDecoration: 'none', cursor: 'pointer',
        padding: '10px 16px', borderRadius: 'var(--zm-r-full)',
        background: theme === 'dark' ? 'rgba(245,241,232,0.06)' : 'var(--zm-white)',
        border: theme === 'dark' ? '1px solid rgba(245,241,232,0.18)' : '1px solid var(--zm-border)',
        whiteSpace: 'nowrap',
      }">View all <ZmIcon name="arrow_right" :size="14" /></NuxtLink>
    </div>
    <slot />
  </section>
</template>
