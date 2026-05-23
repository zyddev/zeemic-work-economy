<script setup lang="ts">
defineProps<{
  active?: 'exchange' | 'dashboard' | 'messages' | 'notifs' | 'intel'
  messagesBadge?: number
  notifsBadge?: number
}>()

const tabs = [
  { id: 'exchange', label: 'Exchange', icon: 'grid', href: '/exchange' },
  { id: 'dashboard', label: 'Dashboard', icon: 'user', href: '/dashboard' },
  { id: 'messages', label: 'Messages', icon: 'message', href: '/messages' },
  { id: 'notifs', label: 'Alerts', icon: 'bell', href: '/notifications' },
  { id: 'intel', label: 'Intel', icon: 'sparkles', href: '/intelligence' },
] as const
</script>

<template>
  <nav :style="{
    position: 'fixed', bottom: 0, left: 0, right: 0,
    background: 'var(--zm-paper)',
    borderTop: '1px solid var(--zm-border)',
    padding: '8px 10px env(safe-area-inset-bottom, 24px)',
    display: 'flex', justifyContent: 'space-around', alignItems: 'center',
    zIndex: 100,
  }">
    <NuxtLink
      v-for="t in tabs"
      :key="t.id"
      :to="t.href"
      style="text-decoration:none;flex:1"
    >
      <div :style="{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', position: 'relative' }">
        <div :style="{ position: 'relative' }">
          <ZmIcon
            :name="t.icon"
            :size="22"
            :color="active === t.id ? 'var(--zm-ink-700)' : 'var(--zm-grey-500)'"
            :stroke="active === t.id ? 2 : 1.6"
          />
          <span
            v-if="(t.id === 'messages' && messagesBadge) || (t.id === 'notifs' && notifsBadge)"
            :style="{
              position: 'absolute', top: '-3px', right: '-7px',
              minWidth: '16px', height: '16px', padding: '0 4px', borderRadius: '8px',
              background: 'var(--zm-coral-500)', color: 'white',
              font: '700 9px var(--zm-font-body)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1.5px solid var(--zm-paper)',
            }"
          >{{ t.id === 'messages' ? messagesBadge : notifsBadge }}</span>
        </div>
        <span :style="{ font: `${active === t.id ? 600 : 500} 10px var(--zm-font-body)`, color: active === t.id ? 'var(--zm-ink-700)' : 'var(--zm-grey-500)' }">{{ t.label }}</span>
      </div>
    </NuxtLink>
  </nav>
</template>
