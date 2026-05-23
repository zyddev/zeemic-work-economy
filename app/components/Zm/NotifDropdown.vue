<script setup lang="ts">
interface Notification {
  id: string
  type: string
  title: string
  body: string
  time: string
  unread: boolean
  actor: string
}

const props = defineProps<{
  notifications?: Notification[]
  username?: string
}>()

const emit = defineEmits<{
  markAllRead: []
  markRead: [id: string]
  close: []
}>()

const visible = computed(() => (props.notifications ?? []).slice(0, 4))
</script>

<template>
  <div
    style="width:380px; background:var(--zm-white); border:1px solid var(--zm-border); border-radius:var(--zm-r-lg); box-shadow:var(--zm-shadow-xl); overflow:hidden"
  >
    <!-- Header -->
    <div style="padding:14px 16px; border-bottom:1px solid var(--zm-border); display:flex; justify-content:space-between; align-items:center">
      <span style="font:600 14px var(--zm-font-body); color:var(--zm-ink-900)">Notifications</span>
      <button
        type="button"
        style="background:none; border:none; padding:0; cursor:pointer; font:500 12px var(--zm-font-body); color:var(--zm-fg-muted)"
        @click="emit('markAllRead')"
      >Mark all read</button>
    </div>

    <!-- Notification rows -->
    <div v-if="visible.length > 0">
      <div
        v-for="(n, i) in visible"
        :key="n.id"
        :style="{
          display: 'flex',
          gap: '12px',
          padding: '12px 16px',
          cursor: 'pointer',
          borderBottom: i < visible.length - 1 ? '1px solid var(--zm-border)' : 'none',
          background: n.unread ? 'var(--zm-ink-50)' : 'transparent',
        }"
        @click="emit('markRead', n.id)"
      >
        <!-- Unread dot -->
        <div
          :style="{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: n.unread ? 'var(--zm-ink-700)' : 'transparent',
            marginTop: '8px',
            flexShrink: '0',
          }"
        />

        <!-- Avatar -->
        <ZmAvatar
          :name="n.actor"
          :size="32"
          :square="n.type === 'application'"
          style="flex-shrink:0; margin-top:2px"
        />

        <!-- Content -->
        <div style="flex:1; min-width:0">
          <p
            :style="{
              margin: '0 0 2px',
              font: `${n.unread ? 600 : 500} 13px var(--zm-font-body)`,
              color: 'var(--zm-ink-900)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }"
          >{{ n.title }}</p>
          <p
            style="margin:0; font:400 12px var(--zm-font-body); color:var(--zm-fg-muted); overflow:hidden; text-overflow:ellipsis; white-space:nowrap"
          >{{ n.body }}</p>
          <p style="margin:6px 0 0; font:500 11px var(--zm-font-mono); color:var(--zm-fg-muted)">{{ n.time }}</p>
        </div>
      </div>
    </div>

    <div v-else style="padding:24px 16px; text-align:center; font:400 13px var(--zm-font-body); color:var(--zm-fg-muted)">
      No notifications
    </div>

    <!-- Footer -->
    <NuxtLink
      :to="'/notifications/' + (username ?? 'me')"
      style="display:block; padding:14px; text-align:center; font:500 13px var(--zm-font-body); color:var(--zm-ink-700); cursor:pointer; border-top:1px solid var(--zm-border); text-decoration:none"
      @click="emit('close')"
    >View all notifications →</NuxtLink>
  </div>
</template>
