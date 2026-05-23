<script setup lang="ts">
import { BIZ_SIDEBAR } from '~/data'
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useHead({ title: 'Messages — Business Dashboard — Zeemic' })

const businessName = 'Northwind Studio'

interface Conversation {
  id: string
  name: string
  snippet: string
  time: string
  unread: boolean
  unreadCount?: number
  tag?: string
}

interface Message {
  id: string
  text: string
  sent: boolean
  time: string
}

const conversations: Conversation[] = [
  { id: 'c1', name: 'Jane Osei', snippet: 'Thanks for sending the contract. I have reviewed…', time: '1h', unread: true, unreadCount: 3, tag: 'Candidate' },
  { id: 'c2', name: 'Kwame Mensah', snippet: 'Looking forward to starting the project on Monday.', time: '3h', unread: true, unreadCount: 1, tag: 'Freelancer' },
  { id: 'c3', name: 'Acme Corp', snippet: 'We have another sprint request for Q3 if you are available…', time: '1d', unread: false, tag: 'Client' },
  { id: 'c4', name: 'David Thornton', snippet: 'My availability for next week — Mon, Tue, and Thu are open.', time: '2d', unread: false, tag: 'Candidate' },
  { id: 'c5', name: 'TechStart Ltd', snippet: 'The RFQ has been approved. When can we kick off?', time: '3d', unread: false, tag: 'Client' },
]

const threadMessages: Record<string, Message[]> = {
  c1: [
    { id: 'm1', text: 'Hi Northwind Studio! I am very excited about the Senior Designer role. Could you share the onboarding details?', sent: false, time: '9:15 AM' },
    { id: 'm2', text: 'Welcome Jane! We have sent the contract to your email. Please review and sign by Friday.', sent: true, time: '9:45 AM' },
    { id: 'm3', text: 'Thanks for sending the contract. I have reviewed it and have a few questions about the remote policy.', sent: false, time: '10:30 AM' },
    { id: 'm4', text: 'Of course — remote first with quarterly team retreats. We will go over it all in your onboarding call.', sent: true, time: '10:50 AM' },
  ],
  c2: [
    { id: 'm1', text: 'Hi! I am confirmed for the data platform build starting Monday. Ready to go.', sent: false, time: 'Yesterday 2:00 PM' },
    { id: 'm2', text: 'Great, we will share Jira access and the infrastructure credentials by end of day Sunday.', sent: true, time: 'Yesterday 3:15 PM' },
    { id: 'm3', text: 'Looking forward to starting the project on Monday. Talk soon!', sent: false, time: 'Yesterday 3:30 PM' },
  ],
  c3: [
    { id: 'm1', text: 'Hey Northwind! The Brand Sprint was excellent. Our team is really happy with the output.', sent: false, time: 'Mon 11:00 AM' },
    { id: 'm2', text: 'So glad to hear that! It was a great collaboration.', sent: true, time: 'Mon 11:30 AM' },
    { id: 'm3', text: 'We have another sprint request for Q3 if you are available — thinking October.', sent: false, time: 'Mon 2:00 PM' },
  ],
  c4: [
    { id: 'm1', text: 'Hi, following up on the UX Lead application. When would you like to schedule the interview?', sent: false, time: 'Tue 10:00 AM' },
    { id: 'm2', text: 'We are targeting next week. Could you share your availability?', sent: true, time: 'Tue 10:30 AM' },
    { id: 'm3', text: 'My availability for next week — Mon, Tue, and Thu are open. Anytime after 10am works.', sent: false, time: 'Tue 11:15 AM' },
  ],
  c5: [
    { id: 'm1', text: 'Hello! We submitted the RFQ for the brand identity work last week.', sent: false, time: '3 days ago' },
    { id: 'm2', text: 'Yes, we have it. Our team is reviewing the scope. We will respond by Thursday.', sent: true, time: '3 days ago' },
    { id: 'm3', text: 'The RFQ has been approved. When can we kick off?', sent: false, time: '3 days ago' },
  ],
}

const selectedId = ref('c1')
const selectedConv = computed(() => conversations.find(c => c.id === selectedId.value))
const messages = computed(() => threadMessages[selectedId.value] ?? [])
const draftMessage = ref('')

const tagTone: Record<string, string> = {
  Candidate: 'var(--zm-sky-100)',
  Freelancer: 'var(--zm-gold-200)',
  Client: 'var(--zm-ink-100)',
}
const tagFg: Record<string, string> = {
  Candidate: 'var(--zm-sky-700)',
  Freelancer: 'var(--zm-grey-900)',
  Client: 'var(--zm-ink-700)',
}
</script>
<template>
  <div class="zm-root" style="background:var(--zm-paper);min-height:100vh">
    <ZmHeader context="business" :business="{ name: businessName }" active="dashboard" :unread="11" />
    <div :style="{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - 64px)' }">
      <ZmSidebar :items="BIZ_SIDEBAR" active="messages">
        <template #header>
          <div :style="{ padding: '4px 12px' }">
            <div class="zm-eyebrow">Business account</div>
            <div :style="{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }">
              <ZmAvatar :name="businessName" :size="36" :square="true" />
              <div style="min-width:0">
                <div :style="{ font: '600 14px var(--zm-font-body)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">{{ businessName }}</div>
                <div :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">Owner · Berlin</div>
              </div>
            </div>
          </div>
        </template>
        <template #footer>
          <div :style="{ padding: '12px 12px 4px', borderTop: '1px solid var(--zm-border)', marginTop: '12px' }">
            <NuxtLink to="/dashboard" :style="{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: 'var(--zm-r-md)', background: 'var(--zm-paper-2)', textDecoration: 'none', color: 'inherit' }">
              <ZmAvatar name="Enoch Boison" :size="28" />
              <div style="flex:1;min-width:0">
                <div :style="{ font: '600 12px var(--zm-font-body)' }">Switch to Personal</div>
                <div :style="{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">Enoch Boison</div>
              </div>
              <ZmIcon name="chevron_right" :size="14" color="var(--zm-fg-muted)" />
            </NuxtLink>
          </div>
        </template>
      </ZmSidebar>

      <!-- Main two-column messages layout -->
      <main :style="{ display: 'grid', gridTemplateColumns: '320px 1fr', minHeight: '0', overflow: 'hidden', height: 'calc(100vh - 64px)' }">

        <!-- Left: Conversation list -->
        <div :style="{ borderRight: '1px solid var(--zm-border)', display: 'flex', flexDirection: 'column', background: 'var(--zm-paper)', overflow: 'hidden' }">
          <div :style="{ padding: '20px 20px 0' }">
            <div class="zm-eyebrow" :style="{ marginBottom: '4px' }">{{ businessName }}</div>
            <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '30px', letterSpacing: '-0.02em', margin: '0 0 14px' }">Messages</h2>
            <ZmSearch placeholder="Search conversations…" size="sm" style="margin-bottom:14px" />
          </div>
          <div :style="{ flex: '1', overflowY: 'auto' }">
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
                <div :style="{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }">
                  <span :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', flex: '1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">{{ conv.snippet }}</span>
                  <span v-if="conv.unread && conv.unreadCount" :style="{ flexShrink: '0', width: '18px', height: '18px', borderRadius: '9px', background: 'var(--zm-ink-700)', color: 'var(--zm-paper)', font: '700 10px/18px var(--zm-font-body)', textAlign: 'center' }">{{ conv.unreadCount }}</span>
                </div>
                <span v-if="conv.tag" :style="{ display: 'inline-block', padding: '2px 7px', borderRadius: 'var(--zm-r-sm)', background: tagTone[conv.tag] || 'var(--zm-ink-50)', color: tagFg[conv.tag] || 'var(--zm-ink-700)', font: '600 10px/1 var(--zm-font-body)', letterSpacing: '0.01em' }">{{ conv.tag }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Message thread -->
        <div :style="{ display: 'flex', flexDirection: 'column', background: 'var(--zm-white)', overflow: 'hidden' }">
          <!-- Thread header -->
          <div :style="{ padding: '16px 24px', borderBottom: '1px solid var(--zm-border)', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: '0' }">
            <ZmAvatar :name="selectedConv?.name" :size="36" />
            <div>
              <div :style="{ font: '600 15px var(--zm-font-body)' }">{{ selectedConv?.name }}</div>
              <div :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">
                {{ selectedConv?.tag ?? 'Contact' }} · Active recently
              </div>
            </div>
            <span style="flex:1" />
            <ZmButton variant="secondary" size="sm">View profile</ZmButton>
            <ZmIconButton icon="more" :size="32" />
          </div>

          <!-- Messages -->
          <div :style="{ flex: '1', overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }">
            <div
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
                />
              </div>
              <ZmButton variant="dark" size="md" icon="send">Send</ZmButton>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
