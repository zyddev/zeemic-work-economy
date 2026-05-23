<script setup lang="ts">
import type { Lead } from '~/types'
const props = defineProps<{ lead: Lead | null }>()
const lead = computed(() => props.lead)
const typeMeta = computed(() => {
  if (!lead.value) return null
  const map: Record<string, { label: string; tone: 'gold' | 'emerald' | 'sky' | 'neutral' }> = {
    booking:  { label: 'Booking request', tone: 'gold' },
    rfq:      { label: 'RFQ',             tone: 'emerald' },
    lead:     { label: 'Lead form',       tone: 'sky' },
    brochure: { label: 'Brochure',        tone: 'neutral' },
    proposal: { label: 'Proposal',        tone: 'gold' },
  }
  return map[lead.value.type]
})
</script>
<template>
  <div v-if="lead" :style="{ padding: '36px', overflowY: 'auto', background: 'var(--zm-white)', flex: '1' }">
    <div :style="{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }">
      <ZmBadge :tone="typeMeta?.tone" size="lg">{{ typeMeta?.label }}</ZmBadge>
      <ZmBadge tone="warning" dot>Awaiting your reply</ZmBadge>
    </div>
    <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '44px', lineHeight: '1.05', letterSpacing: '-0.025em', margin: '0' }">{{ lead.skill }}</h1>
    <div :style="{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '16px' }">
      <ZmAvatar :name="lead.fromName" :size="44" :square="true" />
      <div>
        <div :style="{ font: '600 15px var(--zm-font-body)' }">{{ lead.fromName }}</div>
        <div :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ lead.contact }} · {{ lead.email }}<span v-if="lead.phone"> · {{ lead.phone }}</span></div>
      </div>
      <span style="flex:1" />
      <span :style="{ font: '500 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">Received {{ lead.when }}</span>
    </div>
    <div v-if="lead.type === 'booking'" :style="{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginTop: '28px' }">
      <div v-for="[k,v,icon] in [['Skill', lead.skill, 'wrench'],['Dates', lead.dates ?? '-', 'calendar'],['Budget', lead.budget ?? '-', 'target']]" :key="k" :style="{ background: 'var(--zm-paper)', borderRadius: 'var(--zm-r-md)', padding: '16px', display: 'flex', gap: '12px' }">
        <ZmIcon :name="icon" :size="18" color="var(--zm-fg-muted)" />
        <div>
          <div class="zm-eyebrow">{{ k }}</div>
          <div :style="{ font: '600 14px var(--zm-font-body)', marginTop: '4px' }">{{ v }}</div>
        </div>
      </div>
    </div>
    <div v-if="lead.message" :style="{ marginTop: '28px', padding: '22px', borderRadius: 'var(--zm-r-lg)', background: 'var(--zm-ink-50)', border: '1px solid var(--zm-ink-200)' }">
      <div class="zm-eyebrow">Message</div>
      <p :style="{ font: '400 16px/1.55 var(--zm-font-body)', margin: '10px 0 0' }">{{ lead.message }}</p>
    </div>
    <div :style="{ display: 'flex', gap: '10px', marginTop: '32px' }">
      <ZmButton variant="primary" size="lg" icon-right="check">Accept</ZmButton>
      <ZmButton variant="secondary" size="lg">Propose alternative</ZmButton>
      <ZmButton variant="ghost" size="lg">Decline</ZmButton>
      <span style="flex:1" />
      <ZmButton variant="dark" size="lg" icon="message">Send message</ZmButton>
    </div>
  </div>
  <div v-else :style="{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--zm-white)', color: 'var(--zm-fg-muted)', flexDirection: 'column', gap: '12px' }">
    <ZmIcon name="inbox" :size="40" color="var(--zm-grey-300)" />
    <span :style="{ font: '500 15px var(--zm-font-body)' }">Select a lead to view details</span>
  </div>
</template>
