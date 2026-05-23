<script setup lang="ts">
const props = defineProps<{
  context?: 'user' | 'business'
  business?: { name: string }
  user?: { name: string; handle: string }
  active?: string
  compact?: boolean
}>()

const u = computed(() => props.user ?? { name: 'Enoch Boison', handle: '@enochboison' })
const tabs = computed(() => [
  { id: 'exchange', label: 'Exchange', href: '/exchange' },
  { id: 'dashboard', label: props.context === 'business' ? (props.business?.name ?? 'Business') : 'Dashboard', href: props.context === 'business' ? '/b/northwind' : '/dashboard' },
  { id: 'messages', label: 'Messages', href: '/messages' },
  { id: 'intelligence', label: 'Intelligence', href: '/intelligence' },
])

// Notification dropdown
const { notifications, markRead, markAllRead } = useNotifications()

const unreadCount = computed(() => (notifications.value ?? []).filter(n => n.unread).length)

const bellOpen = ref(false)

// Account switcher
const switcherOpen = ref(false)

function onSwitchTo(id: string) {
  if (id === 'personal') {
    navigateTo('/dashboard')
  } else {
    navigateTo('/b/' + id)
  }
}

const { isMobile } = useBreakpoint()
const mobileMenuOpen = ref(false)

watch(() => useRoute().fullPath, () => { mobileMenuOpen.value = false })

// Close bell on outside click
function onWindowClick() {
  if (bellOpen.value) bellOpen.value = false
}

onMounted(() => {
  window.addEventListener('click', onWindowClick)
})

onUnmounted(() => {
  window.removeEventListener('click', onWindowClick)
})
</script>

<template>
  <header :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '0 16px' : '0 32px', height: '64px', background: 'var(--zm-paper)', borderBottom: '1px solid var(--zm-border)', position: 'sticky', top: '0', zIndex: '50' }">
    <div :style="{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '32px' }">
      <ZmIconButton v-if="isMobile" icon="menu" :size="36" @click="mobileMenuOpen = true" />
      <NuxtLink to="/exchange" :style="{ textDecoration: 'none' }">
        <ZmWordmark :height="26" />
      </NuxtLink>
      <div v-if="!isMobile && context === 'business' && business" :style="{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 10px', borderRadius: 'var(--zm-r-sm)', background: 'var(--zm-ink-100)' }">
        <ZmAvatar :name="business.name" :size="20" :square="true" />
        <span :style="{ font: '500 12px var(--zm-font-body)', color: 'var(--zm-ink-700)' }">{{ business.name }}</span>
        <span :style="{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">· Business</span>
      </div>
      <nav v-if="!compact && !isMobile" :style="{ display: 'flex', gap: '4px' }">
        <NuxtLink v-for="t in tabs" :key="t.id" :to="t.href" :style="{
          padding: '8px 12px', borderRadius: 'var(--zm-r-sm)',
          font: (active === t.id ? '600' : '500') + ' 14px var(--zm-font-body)',
          color: active === t.id ? 'var(--zm-ink-950)' : 'var(--zm-fg-muted)',
          textDecoration: 'none', cursor: 'pointer', position: 'relative',
        }">
          {{ t.label }}
          <span v-if="active === t.id" :style="{ position: 'absolute', bottom: '-22px', left: '12px', right: '12px', height: '2px', background: 'var(--zm-ink-950)', borderRadius: '1px' }" />
        </NuxtLink>
      </nav>
    </div>

    <div :style="{ display: 'flex', alignItems: 'center', gap: '12px' }">
      <ZmIconButton v-if="!isMobile" icon="search" :size="36" />

      <!-- Bell + dropdown wrapper -->
      <div :style="{ position: 'relative' }">
        <div style="display:inline-flex" @click.stop="bellOpen = !bellOpen">
          <ZmIconButton icon="bell" :size="36" :badge="unreadCount" />
        </div>
        <div
          v-if="bellOpen"
          :style="{ position: 'absolute', top: 'calc(100% + 8px)', right: '0', zIndex: '100' }"
          @click.stop
        >
          <ZmNotifDropdown
            :notifications="notifications ?? []"
            :username="u.handle.replace('@', '')"
            @mark-all-read="markAllRead"
            @mark-read="markRead"
            @close="bellOpen = false"
          />
        </div>
      </div>

      <!-- Avatar pill -->
      <div
        :style="{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 10px 4px 4px', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-full)', background: 'var(--zm-white)', cursor: 'pointer' }"
        @click="switcherOpen = true"
      >
        <ZmAvatar :name="u.name" :size="28" />
        <span v-if="!isMobile" :style="{ font: '500 13px var(--zm-font-body)' }">{{ u.name.split(' ')[0] }}</span>
        <ZmIcon name="chevron_down" :size="14" color="var(--zm-fg-muted)" />
      </div>
    </div>

    <!-- Account switcher panel -->
    <ZmAccountSwitcher
      :open="switcherOpen"
      :user="u"
      :businesses="[]"
      active-id="personal"
      @close="switcherOpen = false"
      @switch-to="onSwitchTo"
      @create-business="navigateTo('/b/new')"
    />
  </header>

  <Teleport to="body">
    <div v-if="mobileMenuOpen" :style="{ position: 'fixed', inset: '0', zIndex: '200', background: 'var(--zm-paper)', display: 'flex', flexDirection: 'column' }">
      <!-- Top bar -->
      <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: '64px', borderBottom: '1px solid var(--zm-border)' }">
        <ZmWordmark :height="26" />
        <ZmIconButton icon="x" :size="36" @click="mobileMenuOpen = false" />
      </div>
      <!-- Nav links -->
      <nav :style="{ flex: '1', display: 'flex', flexDirection: 'column', padding: '8px 0' }">
        <NuxtLink v-for="t in tabs" :key="t.id" :to="t.href" :style="{ padding: '16px 24px', font: (active === t.id ? '600' : '500') + ' 18px var(--zm-font-body)', color: active === t.id ? 'var(--zm-ink-950)' : 'var(--zm-fg-muted)', textDecoration: 'none', borderBottom: '1px solid var(--zm-border)' }">
          {{ t.label }}
        </NuxtLink>
      </nav>
      <!-- User footer -->
      <div :style="{ padding: '20px 24px', borderTop: '1px solid var(--zm-border)', display: 'flex', alignItems: 'center', gap: '12px' }">
        <ZmAvatar :name="u.name" :size="36" />
        <div>
          <div :style="{ font: '600 14px var(--zm-font-body)' }">{{ u.name }}</div>
          <div :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ u.handle }}</div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
