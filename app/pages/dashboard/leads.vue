<script setup lang="ts">
import { USER_SIDEBAR } from '~/data'
import type { Lead } from '~/types'
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useHead({ title: 'Leads & Inquiries — Zeemic' })

const { leads, pending } = useLeads()
const selected = ref<Lead | null>(null)
const { isMobile, isTablet } = useBreakpoint()
const mobileSidebarOpen = ref(false)
const router = useRouter()

watch(leads, (val) => {
  if (val && val.length && !selected.value) {
    selected.value = val[0]
  }
}, { immediate: true })

const typeMap: Record<string, { label: string; tone: 'gold' | 'emerald' | 'sky' | 'neutral' }> = {
  booking:  { label: 'Booking',   tone: 'gold' },
  rfq:      { label: 'RFQ',       tone: 'emerald' },
  lead:     { label: 'Lead form', tone: 'sky' },
  brochure: { label: 'Brochure',  tone: 'neutral' },
  proposal: { label: 'Proposal',  tone: 'gold' },
}

const unreadCount = computed(() => (leads.value ?? []).filter(l => l.status === 'new').length)
</script>
<template>
  <div class="zm-root" style="background:var(--zm-paper);min-height:100vh">
    <!-- Mobile layout -->
    <template v-if="isMobile">
      <div :style="{ background: 'var(--zm-paper)', minHeight: '100vh', paddingBottom: '80px' }">
        <ZmMNavBar title="Leads" leftLabel="Dashboard" @back="router.push('/dashboard')">
          <template #right>
            <ZmIconButton icon="filter" :size="36" />
          </template>
        </ZmMNavBar>

        <!-- Header -->
        <div :style="{ padding: '12px 20px 8px' }">
          <div class="zm-eyebrow">{{ leads?.length ?? 0 }} this month · {{ unreadCount }} unread</div>
          <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '32px', lineHeight: '1', letterSpacing: '-0.025em', margin: '6px 0 0' }">Leads</h1>
        </div>

        <!-- Filter chips -->
        <div :style="{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '8px 16px 8px', scrollbarWidth: 'none' }">
          <ZmChip size="sm" :active="true">All 12</ZmChip>
          <ZmChip size="sm">Bookings</ZmChip>
          <ZmChip size="sm">RFQ</ZmChip>
          <ZmChip size="sm">Forms</ZmChip>
        </div>

        <!-- Leads list -->
        <div :style="{ background: 'var(--zm-white)', marginTop: '8px' }">
          <NuxtLink
            v-for="l in (leads ?? [])"
            :key="l.id"
            to="/dashboard/leads"
            style="text-decoration:none;color:inherit;display:block"
          >
            <div :style="{ padding: '14px 16px', borderBottom: '0.5px solid var(--zm-border)', display: 'flex', gap: '12px', alignItems: 'flex-start' }">
              <ZmAvatar :name="l.fromName" :size="40" />
              <div :style="{ flex: '1', minWidth: '0' }">
                <div :style="{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }">
                  <span v-if="l.status === 'new'" :style="{ width: '7px', height: '7px', borderRadius: '3.5px', background: 'var(--zm-ink-700)', flexShrink: '0' }" />
                  <span :style="{ font: (l.status === 'new' ? '600' : '500') + ' 15px var(--zm-font-body)', flex: '1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">{{ l.fromName }}</span>
                  <span :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', whiteSpace: 'nowrap' }">{{ l.when }}</span>
                </div>
                <div :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '2px' }">{{ l.skill }}</div>
                <ZmBadge :tone="(typeMap[l.type] ?? typeMap.lead).tone" size="sm" style="margin-top:6px">{{ (typeMap[l.type] ?? typeMap.lead).label }}</ZmBadge>
              </div>
            </div>
          </NuxtLink>
          <div v-if="!(leads ?? []).length" :style="{ padding: '48px 20px', textAlign: 'center', color: 'var(--zm-fg-muted)', font: '400 14px var(--zm-font-body)' }">No leads yet.</div>
        </div>

        <ZmMTabBar active="dashboard" />
      </div>
    </template>

    <!-- Desktop layout -->
    <template v-else>
      <ZmHeader active="dashboard" />
      <!-- Mobile sidebar backdrop -->
      <div v-if="mobileSidebarOpen" @click="mobileSidebarOpen = false" :style="{ position: 'fixed', inset: '0', background: 'rgba(0,0,0,0.3)', zIndex: 149 }" />
      <div :style="{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - 64px)' }">
        <ZmSidebar :items="USER_SIDEBAR" active="leads">
          <template #header>
            <div :style="{ padding: '4px 12px' }">
              <div class="zm-eyebrow">Personal account</div>
              <div :style="{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }">
                <ZmAvatar name="Enoch Boison" :size="36" />
                <div>
                  <div :style="{ font: '600 14px var(--zm-font-body)' }">Enoch Boison</div>
                  <div :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">@enochboison</div>
                </div>
              </div>
            </div>
          </template>
        </ZmSidebar>

        <main :style="{ display: 'grid', gridTemplateColumns: '380px 1fr', minHeight: '0', overflow: 'hidden' }">
          <!-- Lead list -->
          <div :style="{ borderRight: '1px solid var(--zm-border)', display: 'flex', flexDirection: 'column', background: 'var(--zm-paper)', overflow: 'hidden' }">
            <div :style="{ padding: '24px 24px 0' }">
              <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '36px', letterSpacing: '-0.02em', margin: '0' }">Leads</h2>
              <div :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '4px' }">
                {{ leads?.length ?? 0 }} total · {{ unreadCount }} unread
              </div>
              <div :style="{ marginTop: '16px' }"><ZmSearch placeholder="Search leads…" size="sm" /></div>
              <div :style="{ display: 'flex', gap: '6px', marginTop: '14px', overflowX: 'auto', paddingBottom: '14px', borderBottom: '1px solid var(--zm-border)' }">
                <ZmChip size="sm" :active="true">All <span style="margin-left:4px;opacity:0.6">{{ leads?.length ?? 0 }}</span></ZmChip>
                <ZmChip size="sm">Bookings</ZmChip>
                <ZmChip size="sm">RFQ</ZmChip>
                <ZmChip size="sm">Proposals</ZmChip>
                <ZmChip size="sm">Forms</ZmChip>
              </div>
            </div>

            <!-- Loading state -->
            <div v-if="pending" :style="{ flex: '1', padding: '8px 0' }">
              <div v-for="i in 4" :key="i" :style="{ padding: '14px 24px', display: 'flex', gap: '12px', borderBottom: '1px solid var(--zm-border)' }">
                <ZmSkeleton :width="36" :height="36" radius="50%" :inline="true" style="flex-shrink:0" />
                <div :style="{ flex: '1', display: 'flex', flexDirection: 'column', gap: '8px' }">
                  <ZmSkeleton :height="14" />
                  <ZmSkeleton :height="12" width="60%" />
                </div>
              </div>
            </div>

            <div v-else :style="{ flex: '1', overflowY: 'auto' }">
              <div v-for="(l, i) in (leads ?? [])" :key="l.id" :style="{ padding: '14px 24px', display: 'flex', gap: '12px', alignItems: 'flex-start', borderBottom: '1px solid var(--zm-border)', cursor: 'pointer', background: selected?.id === l.id ? 'var(--zm-white)' : 'transparent', borderLeft: selected?.id === l.id ? '3px solid var(--zm-ink-700)' : '3px solid transparent' }" @click="selected = l">
                <ZmAvatar :name="l.fromName" :size="36" />
                <div style="flex:1;min-width:0">
                  <div :style="{ display: 'flex', alignItems: 'center', gap: '6px' }">
                    <span v-if="l.status === 'new'" :style="{ width: '7px', height: '7px', borderRadius: '3.5px', background: 'var(--zm-ink-700)', flexShrink: '0' }" />
                    <span :style="{ font: (l.status === 'new' ? '600' : '500') + ' 14px var(--zm-font-body)', flex: '1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">{{ l.fromName }}</span>
                    <span :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ l.when }}</span>
                  </div>
                  <div :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">{{ l.skill }}</div>
                  <ZmBadge :tone="(typeMap[l.type] ?? typeMap.lead).tone" size="sm" style="margin-top:8px">{{ (typeMap[l.type] ?? typeMap.lead).label }}</ZmBadge>
                </div>
              </div>
              <div v-if="!(leads ?? []).length" :style="{ padding: '48px 24px', textAlign: 'center', color: 'var(--zm-fg-muted)', font: '400 14px var(--zm-font-body)' }">No leads yet.</div>
            </div>
          </div>

          <!-- Detail -->
          <DashboardLeadDetail v-if="selected" :lead="selected" />
          <div v-else :style="{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--zm-fg-muted)', font: '400 15px var(--zm-font-body)' }">Select a lead to view details.</div>
        </main>
      </div>
    </template>
  </div>
</template>
