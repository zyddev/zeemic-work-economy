<script setup lang="ts">
import { BIZ_SIDEBAR } from '~/data'
const { portfolios: teamMembers } = useMarketplacePortfolios()
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useHead({ title: 'Business Dashboard — Zeemic' })
</script>
<template>
  <div class="zm-root" style="background:var(--zm-paper);min-height:100vh">
    <ZmHeader context="business" :business="{ name: 'Northwind Studio' }" active="dashboard" :unread="11" />
    <div :style="{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - 64px)' }">
      <ZmSidebar :items="BIZ_SIDEBAR" active="overview">
        <template #header>
          <div :style="{ padding: '4px 12px' }">
            <div class="zm-eyebrow">Business account</div>
            <div :style="{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }">
              <ZmAvatar name="Northwind Studio" :size="36" :square="true" />
              <div style="min-width:0">
                <div :style="{ font: '600 14px var(--zm-font-body)' }">Northwind Studio</div>
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

      <main :style="{ padding: '40px' }">
        <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }">
          <div>
            <div class="zm-eyebrow">Northwind Studio · 12 members</div>
            <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '52px', lineHeight: '1', letterSpacing: '-0.025em', margin: '8px 0 0' }">Business overview</h1>
          </div>
          <div :style="{ display: 'flex', gap: '10px' }">
            <ZmButton variant="secondary" icon="external">Public profile</ZmButton>
            <ZmButton variant="dark" icon="plus">New listing</ZmButton>
          </div>
        </div>

        <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '14px', marginBottom: '32px' }">
          <ZmStat label="Active jobs" value="8" delta="+2 this week" icon="briefcase" />
          <ZmStat label="Active skills" value="4" delta="—" icon="wrench" />
          <ZmStat label="Leads (30d)" value="27" delta="+58%" icon="inbox" />
          <ZmStat label="Messages" value="6" delta="6 unread" delta-tone="warning" icon="message" />
          <ZmStat label="Team" value="12" delta="4 recruiters" icon="users" />
        </div>

        <div :style="{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px' }">
          <div>
            <!-- Top listings table -->
            <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)' }">
              <div :style="{ padding: '20px 20px 16px', borderBottom: '1px solid var(--zm-border)' }">
                <h3 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '26px', letterSpacing: '-0.02em', margin: '0' }">Top-performing listings</h3>
              </div>
              <div v-for="(l, i) in [{ title:'Brand Identity Sprint',type:'Skill',views:842,leads:12,rev:'$8,500'},{ title:'Senior UX Designer',type:'Job',views:1240,leads:24,rev:'-'},{ title:'Commercial Contract Review',type:'Skill',views:614,leads:9,rev:'$2,880'}]" :key="i" :style="{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 100px 60px', gap: '16px', padding: '14px 20px', alignItems: 'center', borderBottom: i < 2 ? '1px solid var(--zm-border)' : 'none' }">
                <div>
                  <div :style="{ font: '600 14px var(--zm-font-body)' }">{{ l.title }}</div>
                  <div :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ l.type }}</div>
                </div>
                <div><div class="zm-eyebrow" style="font-size:9px">Views</div><div :style="{ font: '500 14px var(--zm-font-body)' }">{{ l.views.toLocaleString() }}</div></div>
                <div><div class="zm-eyebrow" style="font-size:9px">Leads</div><div :style="{ font: '500 14px var(--zm-font-body)' }">{{ l.leads }}</div></div>
                <div><div class="zm-eyebrow" style="font-size:9px">Revenue</div><div :style="{ font: '500 14px var(--zm-font-body)' }">{{ l.rev }}</div></div>
                <ZmIconButton icon="more" :size="28" />
              </div>
            </div>
          </div>

          <div :style="{ display: 'flex', flexDirection: 'column', gap: '16px' }">
            <div :style="{ background: 'var(--zm-ink-900)', color: 'var(--zm-fg-on-dark)', borderRadius: 'var(--zm-r-lg)', padding: '22px' }">
              <div class="zm-eyebrow" :style="{ color: 'var(--zm-gold-500)' }">Recruiting team</div>
              <h4 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '28px', letterSpacing: '-0.02em', margin: '8px 0 12px' }">4 recruiters · 109 placements</h4>
              <div :style="{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '14px' }">
                <ZmAvatarStack :people="teamMembers ?? []" :size="36" :max="4" />
                <span style="flex:1" />
                <NuxtLink :to="`/b/${$route.params.businessId}/team/recruiters`" style="text-decoration:none">
                  <ZmButton variant="onDark" size="sm" icon-right="arrow_right">Manage</ZmButton>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
