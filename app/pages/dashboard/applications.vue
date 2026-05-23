<script setup lang="ts">
import { USER_SIDEBAR } from '~/data'
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useHead({ title: 'Job Applications — Zeemic' })
const { isMobile, isTablet } = useBreakpoint()
const mobileSidebarOpen = ref(false)
const router = useRouter()

// Desktop apps data (original)
const apps = [
  { title: 'Senior Designer', company: 'Northwind Studio', applied: 'May 12', status: 'Shortlisted' },
  { title: 'UX Lead', company: 'TechStart', applied: 'May 3', status: 'Under Review' },
  { title: 'Product Designer', company: 'Helio Capital', applied: 'Apr 28', status: 'Applied' },
  { title: 'Head of Design', company: 'Pangea Labs', applied: 'Apr 15', status: 'Rejected' },
]
const statusTone: Record<string, string> = { Applied: 'neutral', 'Under Review': 'sky', Shortlisted: 'emerald', Offered: 'gold', Rejected: 'coral' }

// Mobile apps data (richer static set)
const mobileApps = [
  { title: 'Senior UX Designer', co: 'Northwind Studio', date: 'May 12', status: 'Shortlisted', tone: 'gold' },
  { title: 'Staff Product Engineer', co: 'Pangea Labs', date: 'May 8', status: 'Under review', tone: 'sky' },
  { title: 'Head of GTM', co: 'Pangea Labs', date: 'Apr 30', status: 'Applied', tone: 'neutral' },
  { title: 'Lead Designer', co: 'Brightline Legal', date: 'Apr 24', status: 'Offered', tone: 'success' },
  { title: 'Marketing Lead', co: 'Helio Capital', date: 'Apr 12', status: 'Rejected', tone: 'danger' },
]
</script>
<template>
  <div class="zm-root" style="background:var(--zm-paper);min-height:100vh">
    <!-- Mobile layout -->
    <template v-if="isMobile">
      <div :style="{ background: 'var(--zm-paper)', minHeight: '100vh', paddingBottom: '80px' }">
        <ZmMNavBar title="Applications" leftLabel="Dashboard" @back="router.push('/dashboard')" />

        <!-- Header -->
        <div :style="{ padding: '12px 20px 8px' }">
          <div class="zm-eyebrow">4 active · 5 total</div>
          <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '32px', lineHeight: '1', letterSpacing: '-0.025em', margin: '6px 0 0' }">My applications</h1>
        </div>

        <!-- Applications list -->
        <div :style="{ background: 'var(--zm-white)', marginTop: '12px' }">
          <ZmMListRow
            v-for="(a, i) in mobileApps"
            :key="i"
            :title="a.title"
            :subtitle="`${a.co} · Applied ${a.date}`"
            :last="i === mobileApps.length - 1"
          >
            <template #leading>
              <ZmAvatar :name="a.co" :size="36" :square="true" />
            </template>
            <template #accessory>
              <ZmBadge :tone="(a.tone as any)" size="sm">{{ a.status }}</ZmBadge>
            </template>
          </ZmMListRow>
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
        <ZmSidebar :items="USER_SIDEBAR" active="apps">
          <template #header>
            <div :style="{ padding: '4px 12px' }">
              <div class="zm-eyebrow">Personal account</div>
              <div :style="{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }">
                <ZmAvatar name="Enoch Boison" :size="36" />
                <div>
                  <div :style="{ font: '600 14px var(--zm-font-body)' }">Enoch Boison</div>
                </div>
              </div>
            </div>
          </template>
        </ZmSidebar>
        <main :style="{ padding: '40px' }">
          <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '48px', lineHeight: '1', letterSpacing: '-0.025em', margin: '0 0 32px' }">Job applications</h1>
          <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', overflow: 'hidden' }">
            <!-- Table header -->
            <div :style="{ display: 'grid', gridTemplateColumns: '1fr 160px 100px 140px 80px', gap: '16px', padding: '12px 20px', borderBottom: '1px solid var(--zm-border)', background: 'var(--zm-paper)' }">
              <div class="zm-eyebrow">Job Title</div>
              <div class="zm-eyebrow">Company</div>
              <div class="zm-eyebrow">Applied</div>
              <div class="zm-eyebrow">Status</div>
              <div class="zm-eyebrow">Action</div>
            </div>
            <div v-for="(a, i) in apps" :key="i" :style="{ display: 'grid', gridTemplateColumns: '1fr 160px 100px 140px 80px', gap: '16px', padding: '16px 20px', borderBottom: i < apps.length - 1 ? '1px solid var(--zm-border)' : 'none', alignItems: 'center' }">
              <span :style="{ font: '600 14px var(--zm-font-body)' }">{{ a.title }}</span>
              <span :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ a.company }}</span>
              <span :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ a.applied }}</span>
              <ZmBadge :tone="(statusTone[a.status] as any) ?? 'neutral'" dot>{{ a.status }}</ZmBadge>
              <ZmButton size="sm" variant="ghost">View</ZmButton>
            </div>
          </div>
        </main>
      </div>
    </template>
  </div>
</template>
