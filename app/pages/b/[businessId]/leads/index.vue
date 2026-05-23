<script setup lang="ts">
import { BIZ_SIDEBAR } from '~/data'
import type { Lead } from '~/types'
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useHead({ title: 'Leads — Business Dashboard — Zeemic' })

const route = useRoute()
const businessName = 'Northwind Studio'

const activeFilter = ref<'all' | 'new' | 'viewed' | 'responded'>('all')
const { leads: allLeads, pending } = useLeads()
const selected = ref<Lead | null>(null)

watch(allLeads, (val) => {
  if (val && val.length && !selected.value) selected.value = val[0]
}, { immediate: true })

const typeMap: Record<string, { label: string; tone: 'gold' | 'emerald' | 'sky' | 'neutral' }> = {
  booking:  { label: 'Booking',   tone: 'gold' },
  rfq:      { label: 'RFQ',       tone: 'emerald' },
  lead:     { label: 'Lead form', tone: 'sky' },
  brochure: { label: 'Brochure',  tone: 'neutral' },
  proposal: { label: 'Proposal',  tone: 'gold' },
}

const filteredLeads = computed(() => {
  const arr = allLeads.value ?? []
  if (activeFilter.value === 'all') return arr
  return arr.filter(l => l.status === activeFilter.value)
})

const filterTabs: { id: 'all' | 'new' | 'viewed' | 'responded'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'new', label: 'New' },
  { id: 'viewed', label: 'Viewed' },
  { id: 'responded', label: 'Responded' },
]

const newCount = computed(() => (allLeads.value ?? []).filter(l => l.status === 'new').length)
</script>
<template>
  <div class="zm-root" style="background:var(--zm-paper);min-height:100vh">
    <ZmHeader context="business" :business="{ name: businessName }" active="dashboard" :unread="11" />
    <div :style="{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - 64px)' }">
      <ZmSidebar :items="BIZ_SIDEBAR" active="leads">
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

      <main :style="{ display: 'grid', gridTemplateColumns: '380px 1fr', minHeight: '0', overflow: 'hidden', height: 'calc(100vh - 64px)' }">

        <!-- Lead list -->
        <div :style="{ borderRight: '1px solid var(--zm-border)', display: 'flex', flexDirection: 'column', background: 'var(--zm-paper)', overflow: 'hidden' }">
          <div :style="{ padding: '24px 24px 0' }">
            <div class="zm-eyebrow" :style="{ marginBottom: '4px' }">{{ businessName }}</div>
            <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '36px', letterSpacing: '-0.02em', margin: '0' }">Leads Inbox</h2>
            <div :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '4px' }">{{ (allLeads?.length ?? 0) }} total · {{ newCount }} new</div>
            <div :style="{ marginTop: '14px' }">
              <ZmSearch placeholder="Search leads…" size="sm" />
            </div>
            <!-- Filter tabs -->
            <div :style="{ display: 'flex', gap: '6px', marginTop: '14px', paddingBottom: '14px', borderBottom: '1px solid var(--zm-border)' }">
              <ZmChip
                v-for="tab in filterTabs"
                :key="tab.id"
                size="sm"
                :active="activeFilter === tab.id"
                @click="activeFilter = tab.id"
              >
                {{ tab.label }}
                <span v-if="tab.id === 'new' && newCount > 0" :style="{ marginLeft: '4px', opacity: '0.7' }">{{ newCount }}</span>
                <span v-if="tab.id === 'all'" :style="{ marginLeft: '4px', opacity: '0.6' }">{{ (allLeads?.length ?? 0) }}</span>
              </ZmChip>
            </div>
          </div>

          <!-- Loading skeleton -->
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
            <div
              v-for="l in filteredLeads"
              :key="l.id"
              :style="{
                padding: '14px 24px',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                borderBottom: '1px solid var(--zm-border)',
                cursor: 'pointer',
                background: selected?.id === l.id ? 'var(--zm-white)' : 'transparent',
                borderLeft: selected?.id === l.id ? '3px solid var(--zm-ink-700)' : '3px solid transparent',
              }"
              @click="selected = l"
            >
              <ZmAvatar :name="l.fromName" :size="36" />
              <div style="flex:1;min-width:0">
                <div :style="{ display: 'flex', alignItems: 'center', gap: '6px' }">
                  <span v-if="l.status === 'new'" :style="{ width: '7px', height: '7px', borderRadius: '3.5px', background: 'var(--zm-ink-700)', flexShrink: '0' }" />
                  <span :style="{ font: (l.status === 'new' ? '600' : '500') + ' 14px var(--zm-font-body)', flex: '1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">{{ l.fromName }}</span>
                  <span :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ l.when }}</span>
                </div>
                <div :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">{{ l.skill }}</div>
                <ZmBadge :tone="typeMap[l.type].tone" size="sm" style="margin-top:8px">{{ typeMap[l.type].label }}</ZmBadge>
              </div>
            </div>
            <div v-if="filteredLeads.length === 0" :style="{ padding: '40px 24px', textAlign: 'center', color: 'var(--zm-fg-muted)', font: '400 14px var(--zm-font-body)' }">
              No leads in this category yet.
            </div>
          </div>
        </div>

        <!-- Detail panel -->
        <div :style="{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }">
          <DashboardLeadDetail :lead="selected" />
        </div>
      </main>
    </div>
  </div>
</template>
