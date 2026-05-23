<script setup lang="ts">
import { USER_SIDEBAR } from '~/data'
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useHead({ title: 'My Dashboard — Zeemic' })

const { user } = useUserInfo()
const { products: skills } = useMarketplaceProducts()
const { notifications } = useNotifications()
const { leads } = useLeads()
const { isMobile, isTablet } = useBreakpoint()
const mobileSidebarOpen = ref(false)
const router = useRouter()

const displayName = computed(() => user.value?.name ?? 'there')
const firstName = computed(() => displayName.value.split(' ')[0])

const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

const unrespondedLeads = computed(() =>
  (notifications.value ?? []).filter(n => n.type === 'booking' || n.type === 'lead' || n.type === 'rfq').length
)

const recentActivity = computed(() =>
  (notifications.value ?? []).slice(0, 4).map(n => ({
    who:    n.actor,
    what:   n.title,
    detail: n.body,
    time:   n.time,
  }))
)

const pendingLeads = computed(() => (leads.value ?? []).slice(0, 2))
</script>
<template>
  <div class="zm-root" style="background:var(--zm-paper);min-height:100vh">
    <!-- Mobile layout -->
    <template v-if="isMobile">
      <div :style="{ background: 'var(--zm-paper)', paddingBottom: '80px' }">
        <!-- Mobile header -->
        <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 20px 16px' }">
          <div :style="{ display: 'flex', alignItems: 'center', gap: '10px' }">
            <ZmAvatar :name="user?.name ?? 'User'" :size="36" />
            <div>
              <div :style="{ font: '500 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">Personal</div>
              <div :style="{ font: '600 14px var(--zm-font-body)' }">{{ user?.name ?? 'User' }}</div>
            </div>
          </div>
          <ZmIconButton icon="menu" :size="36" @click="mobileSidebarOpen = true" />
        </div>

        <!-- Hero section -->
        <div :style="{ padding: '0 20px 24px' }">
          <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '36px', lineHeight: '1', letterSpacing: '-0.025em', margin: '0' }">
            Good morning, <em style="font-style:italic">{{ firstName }}.</em>
          </h1>
          <p :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '8px' }">
            {{ unrespondedLeads }} leads awaiting your reply.
          </p>
          <!-- Stats grid -->
          <div :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px' }">
            <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)', padding: '14px' }">
              <div class="zm-eyebrow" :style="{ fontSize: '10px' }">Leads (30d)</div>
              <div :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '32px', lineHeight: '1', letterSpacing: '-0.025em', marginTop: '4px' }">12</div>
              <div :style="{ font: '500 11px var(--zm-font-body)', color: 'var(--zm-success)', marginTop: '4px' }">+34%</div>
            </div>
            <div :style="{ background: 'var(--zm-ink-900)', color: 'var(--zm-paper)', borderRadius: 'var(--zm-r-md)', padding: '14px' }">
              <div class="zm-eyebrow" :style="{ color: 'var(--zm-gold-500)' }">Earnings</div>
              <div :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '32px', lineHeight: '1', letterSpacing: '-0.025em', marginTop: '4px' }">$4.8k</div>
              <div :style="{ font: '500 11px var(--zm-font-body)', color: 'var(--zm-success-bg)', marginTop: '4px' }">+38%</div>
            </div>
          </div>
          <!-- Quick actions -->
          <div :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }">
            <NuxtLink to="/dashboard/skills/new" style="text-decoration:none">
              <ZmButton variant="dark" icon="plus" :full="true">Add skill</ZmButton>
            </NuxtLink>
            <NuxtLink to="/dashboard/leads" style="text-decoration:none">
              <ZmButton variant="secondary" icon="inbox" :full="true">View leads</ZmButton>
            </NuxtLink>
          </div>
        </div>

        <!-- Pending section -->
        <div :style="{ padding: '0 20px 24px' }">
          <div class="zm-eyebrow">Awaiting your reply</div>
          <NuxtLink
            v-for="lead in pendingLeads"
            :key="lead.id"
            to="/dashboard/leads"
            style="text-decoration:none;color:inherit;display:block"
          >
            <div :style="{ display: 'flex', gap: '12px', padding: '14px', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)', marginBottom: '10px', alignItems: 'center' }">
              <div :style="{ width: '7px', height: '7px', borderRadius: '3.5px', background: 'var(--zm-coral-500)', flexShrink: '0' }" />
              <ZmAvatar :name="lead.fromName" :size="36" :square="true" />
              <div :style="{ flex: '1', minWidth: '0' }">
                <div :style="{ font: '600 13px var(--zm-font-body)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">{{ lead.fromName }}</div>
                <div :style="{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ lead.skill }} · {{ lead.type }}</div>
                <div :style="{ font: '500 11px var(--zm-font-body)', marginTop: '4px' }">{{ lead.when }}</div>
              </div>
              <ZmIcon name="chevron_right" :size="18" color="var(--zm-fg-muted)" />
            </div>
          </NuxtLink>
        </div>

        <!-- My skills section -->
        <div :style="{ padding: '0 20px 32px' }">
          <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }">
            <h3 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '22px', letterSpacing: '-0.015em', margin: '0' }">My skills</h3>
            <NuxtLink to="/dashboard/skills" :style="{ font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textDecoration: 'none' }">Manage →</NuxtLink>
          </div>
          <div :style="{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }">
            <ZmMobileSkillCard
              v-for="s in (skills ?? []).slice(0, 2)"
              :key="s.id"
              :skill="s"
            />
          </div>
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
        <ZmSidebar :items="USER_SIDEBAR" active="overview">
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
          <template #footer>
            <div :style="{ padding: '12px 12px 4px', borderTop: '1px solid var(--zm-border)', marginTop: '12px' }">
              <NuxtLink to="/b/northwind" :style="{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: 'var(--zm-r-md)', background: 'var(--zm-ink-100)', textDecoration: 'none', color: 'inherit' }">
                <ZmAvatar name="Northwind Studio" :size="28" :square="true" />
                <div style="flex:1;min-width:0">
                  <div :style="{ font: '600 12px var(--zm-font-body)' }">Switch to Business</div>
                  <div :style="{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">Northwind Studio</div>
                </div>
                <ZmIcon name="chevron_right" :size="14" color="var(--zm-fg-muted)" />
              </NuxtLink>
            </div>
          </template>
        </ZmSidebar>

        <main :style="{ padding: '40px', overflow: 'hidden' }">
          <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }">
            <div>
              <div class="zm-eyebrow">{{ today }}</div>
              <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '52px', lineHeight: '1', letterSpacing: '-0.025em', margin: '8px 0 0' }">Good morning, <em style="font-style:italic">{{ firstName }}.</em></h1>
              <p :style="{ font: '400 16px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '10px' }">
                You have
                <span :style="{ color: 'var(--zm-ink-950)', fontWeight: '600' }">{{ unrespondedLeads }} unresponded leads</span>
                and 1 booking awaiting confirmation.
              </p>
            </div>
            <div :style="{ display: 'flex', gap: '10px' }">
              <NuxtLink to="/dashboard/leads" style="text-decoration:none"><ZmButton variant="secondary" icon="bookmark">View leads</ZmButton></NuxtLink>
              <NuxtLink to="/dashboard/skills" style="text-decoration:none"><ZmButton variant="dark" icon="plus">Add skill</ZmButton></NuxtLink>
            </div>
          </div>

          <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '32px' }">
            <ZmStat label="Active skills" value="3" delta="+1 this month" icon="wrench" />
            <ZmStat label="Leads (30d)" value="12" delta="+34% vs prev." icon="inbox" />
            <ZmStat label="Bookings" value="2" delta="1 pending" delta-tone="warning" icon="calendar" />
            <ZmStat label="Profile views" value="284" delta="+12 this week" icon="eye" />
          </div>

          <div :style="{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }">
            <div>
              <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }">
                <h3 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '28px', letterSpacing: '-0.02em', margin: '0' }">Recent activity</h3>
                <NuxtLink to="/dashboard/leads" :style="{ font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textDecoration: 'none' }">View all →</NuxtLink>
              </div>
              <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', overflow: 'hidden' }">
                <div v-for="(a, i) in recentActivity" :key="i" :style="{ display: 'flex', gap: '14px', padding: '16px 18px', borderBottom: i < recentActivity.length - 1 ? '1px solid var(--zm-border)' : 'none', alignItems: 'center' }">
                  <ZmAvatar :name="a.who" :size="36" />
                  <div style="flex:1;min-width:0">
                    <div :style="{ font: '400 14px var(--zm-font-body)' }"><span :style="{ fontWeight: '600' }">{{ a.who }}</span> {{ a.what }}</div>
                    <div :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '2px' }">{{ a.detail }}</div>
                  </div>
                  <span :style="{ font: '500 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', whiteSpace: 'nowrap' }">{{ a.time }}</span>
                </div>
                <div v-if="!recentActivity.length" :style="{ padding: '32px', textAlign: 'center', color: 'var(--zm-fg-muted)', font: '400 14px var(--zm-font-body)' }">No recent activity yet.</div>
              </div>
            </div>

            <div :style="{ display: 'flex', flexDirection: 'column', gap: '16px' }">
              <div :style="{ background: 'var(--zm-ink-900)', color: 'var(--zm-fg-on-dark)', borderRadius: 'var(--zm-r-lg)', padding: '22px' }">
                <div class="zm-eyebrow" :style="{ color: 'var(--zm-gold-500)' }">Earnings this month</div>
                <div :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '56px', lineHeight: '1', letterSpacing: '-0.025em', marginTop: '12px' }" class="zm-num-tab">$4,820</div>
                <div :style="{ font: '500 13px var(--zm-font-body)', color: 'var(--zm-success-bg)', marginTop: '6px' }">+38% vs April</div>
              </div>
              <NuxtLink to="/intelligence" :style="{ background: 'var(--zm-gold-200)', borderRadius: 'var(--zm-r-lg)', padding: '22px', textDecoration: 'none', color: 'inherit', display: 'block' }">
                <div class="zm-eyebrow">Career intelligence</div>
                <h4 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '22px', letterSpacing: '-0.015em', margin: '8px 0 12px', lineHeight: '1.2' }">Senior Designer roles in Berlin paid <em>14% more</em> in Q1.</h4>
                <ZmButton size="sm" variant="dark">Open intelligence</ZmButton>
              </NuxtLink>
            </div>
          </div>

          <div :style="{ marginTop: '40px' }">
            <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }">
              <h3 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '28px', letterSpacing: '-0.02em', margin: '0' }">My active skills</h3>
              <NuxtLink to="/dashboard/skills" :style="{ font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textDecoration: 'none' }">Manage all →</NuxtLink>
            </div>
            <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }">
              <CardsSkillManageCard
                v-for="s in (skills ?? []).slice(0,3)"
                :key="s.id"
                :skill="s"
                :views="0"
                :inquiries="0"
                status="Active"
              />
            </div>
          </div>
        </main>
      </div>
    </template>
  </div>
</template>
