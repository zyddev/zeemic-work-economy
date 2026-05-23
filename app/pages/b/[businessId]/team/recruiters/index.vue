<script setup lang="ts">
import { BIZ_SIDEBAR } from '~/data'
const { portfolios: recruiters } = useMarketplacePortfolios()
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useHead({ title: 'Recruiting Team — Zeemic' })
</script>
<template>
  <div class="zm-root" style="background:var(--zm-paper);min-height:100vh">
    <ZmHeader context="business" :business="{ name: 'Northwind Studio' }" active="dashboard" :unread="11" />
    <div :style="{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - 64px)' }">
      <ZmSidebar :items="BIZ_SIDEBAR" active="recruiters">
        <template #header>
          <div :style="{ padding: '4px 12px' }">
            <div class="zm-eyebrow">Business account</div>
            <div :style="{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }">
              <ZmAvatar name="Northwind Studio" :size="36" :square="true" />
              <div>
                <div :style="{ font: '600 14px var(--zm-font-body)' }">Northwind Studio</div>
                <div :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">Owner · Berlin</div>
              </div>
            </div>
          </div>
        </template>
      </ZmSidebar>
      <main :style="{ padding: '40px' }">
        <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }">
          <div>
            <div class="zm-eyebrow">Team · recruiters</div>
            <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '48px', lineHeight: '1', letterSpacing: '-0.025em', margin: '8px 0 6px' }">Recruiting team</h1>
            <p :style="{ font: '400 15px var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0' }">Public-facing recruiter profiles attached to Northwind Studio.</p>
          </div>
          <ZmButton variant="dark" icon="plus" size="lg">Add recruiter profile</ZmButton>
        </div>
        <div :style="{ display: 'flex', flexDirection: 'column', gap: '14px' }">
          <div v-for="r in (recruiters ?? [])" :key="r.id" :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', padding: '22px', display: 'grid', gridTemplateColumns: '72px 1fr 200px 240px', gap: '24px', alignItems: 'center' }">
            <ZmAvatar :name="r.name" :size="56" />
            <div>
              <div :style="{ display: 'flex', alignItems: 'center', gap: '8px' }">
                <span :style="{ font: '600 16px var(--zm-font-body)' }">{{ r.name }}</span>
                <ZmIcon name="badge_check" :size="14" color="var(--zm-ink-700)" />
                <ZmBadge tone="success" dot size="sm">Active</ZmBadge>
              </div>
              <div :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '4px' }">{{ r.title }} · {{ r.location }}</div>
              <div :style="{ display: 'flex', gap: '6px', marginTop: '10px' }">
                <ZmChip v-for="s in r.specialties" :key="s" size="sm" tone="subtle">{{ s }}</ZmChip>
              </div>
            </div>
            <div :style="{ display: 'flex', gap: '24px' }">
              <div>
                <div class="zm-eyebrow">Placements</div>
                <div :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '22px', letterSpacing: '-0.02em' }" class="zm-num-tab">{{ r.placements }}</div>
              </div>
              <div>
                <div class="zm-eyebrow">Rating</div>
                <ZmRating :value="r.rating" :count="r.reviews" :size="13" style="margin-top:4px" />
              </div>
            </div>
            <div :style="{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }">
              <NuxtLink :to="`/recruiter/${r.id}`" style="text-decoration:none"><ZmButton size="sm" variant="secondary">View profile</ZmButton></NuxtLink>
              <ZmButton size="sm" variant="ghost">Edit</ZmButton>
              <ZmIconButton icon="more" :size="36" />
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
