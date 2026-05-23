<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useHead({ title: 'Messages — Zeemic' })

const { isMobile } = useBreakpoint()
const { user } = useUserInfo()

const {
  conversations,
  loadingConvs,
  selectedId,
  selectedConv,
  messages,
  loadingMsgs,
  draftMessage,
  loadConversations,
  sendMessage,
} = useMessages(computed(() => user.value?.id ?? ''))

onMounted(loadConversations)

const staticThreads = [
  { id: '1', name: 'Acme Corp', snippet: 'Thanks for getting back — Tuesday works for the readout.', time: '2h', unread: true, unreadCount: 2 },
  { id: '2', name: 'Jane Smith', snippet: 'I have a Staff Platform role that fits your profile.', time: '1d', unread: true, unreadCount: 1 },
  { id: '3', name: 'TechStart Ltd', snippet: "We're keen to lock in the heuristic review for next month.", time: '2d', unread: false },
]

const displayThreads = computed(() => conversations.value.length ? conversations.value : staticThreads)
</script>
<template>
  <div class="zm-root" style="background:var(--zm-paper);min-height:100vh">
    <!-- Mobile layout -->
    <template v-if="isMobile">
      <div :style="{ background: 'var(--zm-paper)', minHeight: '100vh', paddingBottom: '80px' }">
        <ZmMNavBar title="Messages" :back="false">
          <template #right>
            <ZmIconButton icon="plus" :size="36" />
          </template>
        </ZmMNavBar>

        <!-- Search -->
        <div :style="{ padding: '12px 16px 4px' }">
          <ZmSearch placeholder="Search messages…" size="md" />
        </div>

        <!-- Messages list -->
        <div :style="{ background: 'var(--zm-white)', marginTop: '8px' }">
          <div
            v-for="thread in displayThreads"
            :key="thread.id"
            :style="{ padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'center', borderBottom: '0.5px solid var(--zm-border)' }"
          >
            <ZmAvatar :name="thread.name" :size="48" />
            <div :style="{ flex: '1', minWidth: '0' }">
              <div :style="{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }">
                <span :style="{ font: '600 15px var(--zm-font-body)', flex: '1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">{{ thread.name }}</span>
                <span :style="{ font: '400 11.5px var(--zm-font-body)', color: 'var(--zm-fg-muted)', whiteSpace: 'nowrap' }">{{ thread.time }}</span>
              </div>
              <div :style="{ display: 'flex', alignItems: 'center', gap: '6px' }">
                <span :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', flex: '1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">{{ thread.snippet }}</span>
                <ZmBadge v-if="thread.unread && thread.unreadCount" tone="coral" size="sm">{{ thread.unreadCount }}</ZmBadge>
              </div>
            </div>
          </div>
          <div v-if="!displayThreads.length" :style="{ padding: '48px 20px', textAlign: 'center', color: 'var(--zm-fg-muted)', font: '400 14px var(--zm-font-body)' }">No messages yet.</div>
        </div>

        <ZmMTabBar active="messages" :messagesBadge="3" />
      </div>
    </template>

    <!-- Desktop layout -->
    <template v-else>
    <ZmHeader active="messages" />
    <div :style="{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - 64px)' }">
      <ZmSidebar :items="[
        { id: 'overview', label: 'Overview', icon: 'grid' },
        { id: 'skills', label: 'My skills', icon: 'wrench', count: 3 },
        { id: 'leads', label: 'Leads & inquiries', icon: 'inbox', count: 12 },
        { id: 'apps', label: 'Job applications', icon: 'briefcase', count: 4 },
        { id: 'messages', label: 'Messages', icon: 'message', count: 6 },
        { section: 'More' },
        { id: 'intel', label: 'Intelligence', icon: 'sparkles' },
        { id: 'settings', label: 'Settings', icon: 'settings' },
      ]" active="messages">
        <template #header>
          <div :style="{ padding: '4px 12px' }">
            <div class="zm-eyebrow">Personal account</div>
            <div :style="{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }">
              <ZmAvatar :name="user?.name ?? 'User'" :size="36" />
              <div>
                <div :style="{ font: '600 14px var(--zm-font-body)' }">{{ user?.name ?? 'User' }}</div>
                <div :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ user?.handle ?? '' }}</div>
              </div>
            </div>
          </div>
        </template>
      </ZmSidebar>

      <!-- Main two-column messages layout -->
      <main :style="{ display: 'grid', gridTemplateColumns: '320px 1fr', minHeight: '0', overflow: 'hidden', height: 'calc(100vh - 64px)' }">

        <!-- Left: Conversation list -->
        <div :style="{ borderRight: '1px solid var(--zm-border)', display: 'flex', flexDirection: 'column', background: 'var(--zm-paper)', overflow: 'hidden' }">
          <div :style="{ padding: '20px 20px 0' }">
            <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '32px', letterSpacing: '-0.02em', margin: '0 0 14px' }">Messages</h2>
            <ZmSearch placeholder="Search conversations…" size="sm" style="margin-bottom:14px" />
          </div>

          <!-- Loading skeleton -->
          <div v-if="loadingConvs" :style="{ flex: '1', padding: '8px 0' }">
            <div v-for="i in 4" :key="i" :style="{ padding: '14px 20px', display: 'flex', gap: '12px', borderBottom: '1px solid var(--zm-border)' }">
              <ZmSkeleton :width="38" :height="38" radius="50%" :inline="true" style="flex-shrink:0" />
              <div :style="{ flex: '1', display: 'flex', flexDirection: 'column', gap: '8px' }">
                <ZmSkeleton :height="13" />
                <ZmSkeleton :height="11" width="75%" />
              </div>
            </div>
          </div>

          <div v-else :style="{ flex: '1', overflowY: 'auto' }">
            <div
              v-for="conv in conversations"
              :key="conv.id"
              :style="{
                padding: '14px 20px',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                borderBottom: '1px solid var(--zm-border)',
                cursor: 'pointer',
                background: selectedId === conv.id ? 'var(--zm-white)' : 'transparent',
                borderLeft: selectedId === conv.id ? '3px solid var(--zm-ink-700)' : '3px solid transparent',
              }"
              @click="selectedId = conv.id"
            >
              <ZmAvatar :name="conv.name" :size="38" />
              <div :style="{ flex: '1', minWidth: '0' }">
                <div :style="{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }">
                  <span :style="{ font: (conv.unread ? '600' : '500') + ' 14px var(--zm-font-body)', flex: '1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">{{ conv.name }}</span>
                  <span :style="{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)', whiteSpace: 'nowrap' }">{{ conv.time }}</span>
                </div>
                <div :style="{ display: 'flex', alignItems: 'center', gap: '6px' }">
                  <span :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', flex: '1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">{{ conv.snippet }}</span>
                  <span v-if="conv.unread && conv.unreadCount" :style="{ flexShrink: '0', width: '18px', height: '18px', borderRadius: '9px', background: 'var(--zm-ink-700)', color: 'var(--zm-paper)', font: '700 10px/18px var(--zm-font-body)', textAlign: 'center' }">{{ conv.unreadCount }}</span>
                </div>
              </div>
            </div>
            <div v-if="!conversations.length" :style="{ padding: '48px 20px', textAlign: 'center', color: 'var(--zm-fg-muted)', font: '400 14px var(--zm-font-body)' }">No conversations yet.</div>
          </div>
        </div>

        <!-- Right: Message thread -->
        <div :style="{ display: 'flex', flexDirection: 'column', background: 'var(--zm-white)', overflow: 'hidden' }">
          <template v-if="selectedConv">
            <!-- Thread header -->
            <div :style="{ padding: '16px 24px', borderBottom: '1px solid var(--zm-border)', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: '0' }">
              <ZmAvatar :name="selectedConv.name" :size="36" />
              <div>
                <div :style="{ font: '600 15px var(--zm-font-body)' }">{{ selectedConv.name }}</div>
                <div :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">Active recently</div>
              </div>
              <span style="flex:1" />
              <ZmIconButton icon="more" :size="32" />
            </div>

            <!-- Messages -->
            <div :style="{ flex: '1', overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }">
              <!-- Loading -->
              <div v-if="loadingMsgs" :style="{ display: 'flex', flexDirection: 'column', gap: '12px' }">
                <div v-for="i in 3" :key="i" :style="{ display: 'flex', justifyContent: i % 2 === 0 ? 'flex-end' : 'flex-start' }">
                  <div :style="{ width: '60%', height: '48px', borderRadius: 'var(--zm-r-lg)', background: 'var(--zm-paper-2)', animation: 'zm-pulse 1.5s ease-in-out infinite' }" />
                </div>
              </div>
              <div
                v-else
                v-for="msg in messages"
                :key="msg.id"
                :style="{ display: 'flex', justifyContent: msg.sent ? 'flex-end' : 'flex-start' }"
              >
                <div :style="{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '70%', alignItems: msg.sent ? 'flex-end' : 'flex-start' }">
                  <div :style="{
                    padding: '10px 14px',
                    borderRadius: msg.sent ? 'var(--zm-r-lg) var(--zm-r-lg) 4px var(--zm-r-lg)' : 'var(--zm-r-lg) var(--zm-r-lg) var(--zm-r-lg) 4px',
                    background: msg.sent ? 'var(--zm-ink-900)' : 'var(--zm-paper)',
                    color: msg.sent ? 'var(--zm-paper)' : 'var(--zm-ink-950)',
                    border: msg.sent ? 'none' : '1px solid var(--zm-border)',
                    font: '400 14px/1.5 var(--zm-font-body)',
                  }">{{ msg.text }}</div>
                  <span :style="{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ msg.time }}</span>
                </div>
              </div>
            </div>

            <!-- Input -->
            <div :style="{ padding: '16px 24px', borderTop: '1px solid var(--zm-border)', flexShrink: '0' }">
              <div :style="{ display: 'flex', gap: '10px', alignItems: 'flex-end' }">
                <div :style="{
                  flex: '1', display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 14px', background: 'var(--zm-paper)', border: '1px solid var(--zm-border)',
                  borderRadius: 'var(--zm-r-md)', minHeight: '44px',
                }">
                  <input
                    v-model="draftMessage"
                    placeholder="Write a message…"
                    :style="{ flex: '1', border: 'none', outline: 'none', background: 'transparent', font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg)' }"
                    @keydown.enter.prevent="sendMessage"
                  />
                </div>
                <ZmButton variant="dark" size="md" icon="send" @click="sendMessage">Send</ZmButton>
              </div>
            </div>
          </template>

          <!-- No conversation selected -->
          <div v-else :style="{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--zm-fg-muted)', font: '400 15px var(--zm-font-body)' }">
            Select a conversation to start messaging.
          </div>
        </div>
      </main>
    </div>
    </template><!-- end desktop -->
  </div>
</template>
