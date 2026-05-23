<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Notifications — Zeemic' })

const { isMobile } = useBreakpoint()

const filters = ['All', 'Leads', 'Messages', 'Applications', 'Reviews', 'System']
const active = ref('All')
const iconMap: Record<string, string> = {
  booking: 'calendar',
  application: 'briefcase',
  message: 'message',
  review: 'star_fill',
  system: 'bell',
}

const filterTypeMap: Record<string, string[]> = {
  Leads: ['booking', 'lead', 'rfq'],
  Messages: ['message'],
  Applications: ['application'],
  Reviews: ['review'],
  System: ['system'],
}

const { notifications, pending, markRead, markAllRead } = useNotifications()

const filtered = computed(() => {
  if (!notifications.value) return []
  if (active.value === 'All') return notifications.value
  const types = filterTypeMap[active.value] ?? []
  return notifications.value.filter(n => types.includes(n.type))
})

const unreadCount = computed(() => (notifications.value ?? []).filter(n => n.unread).length)
</script>
<template>
  <div class="zm-root" style="background:var(--zm-paper);min-height:100vh">
    <!-- Mobile layout -->
    <template v-if="isMobile">
      <div :style="{ background: 'var(--zm-paper)', minHeight: '100vh', paddingBottom: '80px' }">
        <ZmMNavBar title="Notifications" :back="false">
          <template #right>
            <button
              :style="{ font: '500 14px var(--zm-font-body)', color: 'var(--zm-ink-700)', border: 'none', background: 'transparent', cursor: 'pointer', padding: '0 4px' }"
              @click="markAllRead"
            >Mark all read</button>
          </template>
        </ZmMNavBar>

        <!-- Header -->
        <div :style="{ padding: '12px 20px 8px' }">
          <div class="zm-eyebrow">{{ unreadCount }} unread</div>
          <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '32px', lineHeight: '1', letterSpacing: '-0.025em', margin: '6px 0 0' }">Alerts</h1>
        </div>

        <!-- Filter chips -->
        <div :style="{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '8px 16px 8px', scrollbarWidth: 'none' }">
          <ZmChip size="sm" :active="active === 'All'" @click="active = 'All'">All</ZmChip>
          <ZmChip size="sm" :active="active === 'Leads'" @click="active = 'Leads'">Leads</ZmChip>
          <ZmChip size="sm" :active="active === 'Messages'" @click="active = 'Messages'">Messages</ZmChip>
          <ZmChip size="sm" :active="active === 'Reviews'" @click="active = 'Reviews'">Reviews</ZmChip>
        </div>

        <!-- Notifications list -->
        <div :style="{ background: 'var(--zm-white)', marginTop: '8px' }">
          <div
            v-for="(n, i) in filtered"
            :key="n.id"
            :style="{
              padding: '14px 16px',
              display: 'flex',
              gap: '12px',
              background: n.unread ? 'var(--zm-ink-50)' : 'var(--zm-white)',
              borderBottom: '0.5px solid var(--zm-border)',
              cursor: 'pointer',
            }"
            @click="n.unread && markRead(n.id)"
          >
            <div :style="{ width: '8px', height: '8px', borderRadius: '4px', background: n.unread ? 'var(--zm-ink-700)' : 'transparent', marginTop: '8px', flexShrink: '0' }" />
            <ZmAvatar :name="n.actor" :size="36" :square="n.type === 'application'" />
            <div :style="{ flex: '1', minWidth: '0' }">
              <div :style="{ font: (n.unread ? '600' : '500') + ' 14px var(--zm-font-body)' }">{{ n.title }}</div>
              <div :style="{ font: '400 12.5px/1.4 var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '2px' }">{{ n.body }}</div>
              <div :style="{ font: '500 11px var(--zm-font-mono, monospace)', color: 'var(--zm-fg-muted)', marginTop: '6px' }">{{ n.time }}</div>
            </div>
          </div>
          <div v-if="filtered.length === 0" :style="{ padding: '48px 20px', textAlign: 'center', color: 'var(--zm-fg-muted)', font: '400 14px var(--zm-font-body)' }">
            No notifications.
          </div>
        </div>

        <ZmMTabBar active="notifs" :notifsBadge="unreadCount" />
      </div>
    </template>

    <!-- Desktop layout -->
    <template v-else>
      <ZmHeader active="dashboard" />
      <div :style="{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }">
        <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }">
          <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '48px', lineHeight: '1', letterSpacing: '-0.025em', margin: '0' }">Notifications</h1>
          <ZmButton variant="ghost" size="sm" :disabled="pending" @click="markAllRead">Mark all read</ZmButton>
        </div>
        <div :style="{ display: 'flex', gap: '8px', marginBottom: '24px' }">
          <ZmChip v-for="f in filters" :key="f" size="sm" :active="active === f" @click="active = f">{{ f }}</ZmChip>
        </div>

        <!-- Loading skeleton -->
        <div v-if="pending" :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', overflow: 'hidden' }">
          <div v-for="i in 4" :key="i" :style="{ display: 'flex', gap: '16px', padding: '18px 20px', borderBottom: i < 4 ? '1px solid var(--zm-border)' : 'none', alignItems: 'flex-start' }">
            <ZmSkeleton :width="8" :height="8" radius="4px" :inline="true" style="margin-top:6px;flex-shrink:0" />
            <ZmSkeleton :width="40" :height="40" radius="50%" :inline="true" style="flex-shrink:0" />
            <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:6px">
              <ZmSkeleton :height="14" width="60%" />
              <ZmSkeleton :height="13" width="85%" />
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else-if="filtered.length === 0" :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', padding: '64px 24px', textAlign: 'center' }">
          <ZmIcon name="bell" :size="32" color="var(--zm-fg-subtle)" />
          <div :style="{ font: '500 15px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '12px' }">No notifications</div>
        </div>

        <!-- Notification list -->
        <div v-else :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', overflow: 'hidden' }">
          <div
            v-for="(n, i) in filtered"
            :key="n.id"
            :style="{ display: 'flex', gap: '16px', padding: '18px 20px', borderBottom: i < filtered.length - 1 ? '1px solid var(--zm-border)' : 'none', alignItems: 'flex-start', background: n.unread ? 'var(--zm-ink-50)' : 'transparent', cursor: 'pointer' }"
            @click="n.unread && markRead(n.id)"
          >
            <div :style="{ width: '8px', height: '8px', borderRadius: '4px', background: n.unread ? 'var(--zm-ink-700)' : 'transparent', marginTop: '6px', flexShrink: '0' }" />
            <div :style="{ width: '40px', height: '40px', borderRadius: '20px', background: 'var(--zm-ink-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }">
              <ZmIcon :name="iconMap[n.type] ?? 'bell'" :size="18" color="var(--zm-ink-700)" />
            </div>
            <div style="flex:1;min-width:0">
              <div :style="{ font: (n.unread ? '600' : '500') + ' 14px var(--zm-font-body)' }">{{ n.title }}</div>
              <div :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '2px' }">{{ n.body }}</div>
              <div :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-subtle)', marginTop: '4px' }">{{ n.time }} ago</div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
