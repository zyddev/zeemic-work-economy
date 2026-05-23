<script setup lang="ts">
import type { Job } from '~/types'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { store: business, pending } = useMarketplaceStore(slug)
useHead(() => ({ title: `${business.value?.name ?? 'Business'} — Zeemic` }))

const PALETTE = ['#1A4D3A', '#11211A', '#7A4E2D', '#1E4B68', '#6B3A6B', '#2B7A4B']
const bannerColor = computed(() => {
  const name = business.value?.name ?? ''
  return PALETTE[(name.charCodeAt(0) + name.length) % PALETTE.length]
})
const initial = computed(() => (business.value?.name ?? '?')[0].toUpperCase())
const foundedYear = computed(() => {
  const b = (business.value as any)
  if (!b?.createdAt) return null
  return new Date(b.createdAt).getFullYear()
})
const memberCount = computed(() => business.value?.members ?? 0)
const about = computed(() => business.value?.shortDescription || business.value?.description || '')
const website = computed(() => {
  const w = business.value?.website ?? ''
  return w.replace(/^https?:\/\//, '')
})
const industries = computed(() => {
  const b = business.value
  return [b?.tag].filter(Boolean) as string[]
})

const businessId = computed(() => (business.value as any)?.id ?? '')
const { projects: allJobsRaw, pending: jobsPending } = useMarketplaceProjects(undefined, { server: false })
const allJobs = computed(() =>
  businessId.value
    ? (allJobsRaw.value ?? []).filter(j => j.businessId === businessId.value)
    : []
)
const previewJobs = computed(() => allJobs.value.slice(0, 4))

const { isMobile, isTablet } = useBreakpoint()
const activeTab = ref('about')
const tabs = computed(() => [
  { id: 'about', label: 'About' },
  { id: 'jobs', label: `Open roles${allJobs.value.length ? ` (${allJobs.value.length})` : ''}` },
  { id: 'team', label: 'Team' },
])

const glanceRows = computed(() => {
  const b = business.value
  const rows: [string, string][] = []
  if (foundedYear.value) rows.push(['Founded', String(foundedYear.value)])
  if (b?.location) rows.push(['Location', b.location])
  if (b?.website) rows.push(['Website', website.value])
  if (memberCount.value) rows.push(['Team size', String(memberCount.value)])
  rows.push(['Response time', '< 24 hr'])
  return rows
})

const mobileTabs = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'jobs', label: 'Jobs' },
  { id: 'team', label: 'Team' },
]
const mobileActiveTab = ref('about')
</script>

<template>
  <div class="zm-root" style="background:var(--zm-paper);min-height:100vh">

    <!-- Mobile -->
    <template v-if="isMobile">
      <div style="background:var(--zm-paper);min-height:100vh">
        <div v-if="business">
          <!-- Hero -->
          <div :style="{ position: 'relative', height: '180px', background: '#1A4D3A', overflow: 'hidden' }">
            <!-- Decorative SVG -->
            <svg width="100%" height="100%" viewBox="0 0 375 180" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0">
              <circle cx="300" cy="50" r="120" fill="var(--zm-gold-500)" opacity="0.35" />
              <circle cx="300" cy="50" r="60" fill="#1A4D3A" />
              <circle cx="300" cy="50" r="26" fill="var(--zm-gold-500)" />
            </svg>
            <ZmMNavBar title="" leftLabel="Businesses" :transparent="true" @back="$router.back()">
              <template #right>
                <ZmIconButton icon="paperclip" :size="36" />
                <ZmIconButton icon="bookmark" :size="36" />
              </template>
            </ZmMNavBar>
          </div>

          <!-- Logo area -->
          <div :style="{ marginTop: '-32px', position: 'relative', padding: '0 20px' }">
            <!-- Logo box -->
            <div :style="{ width: '80px', height: '80px', borderRadius: 'var(--zm-r-lg)', background: 'var(--zm-paper)', border: '4px solid var(--zm-paper)', boxShadow: 'var(--zm-shadow-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--zm-font-display)', fontSize: '48px', color: '#1A4D3A', lineHeight: '1', marginBottom: '12px' }">{{ initial }}</div>

            <!-- Badges -->
            <div :style="{ display: 'flex', gap: '6px', marginBottom: '8px' }">
              <ZmBadge tone="emerald"><ZmIcon name="badge_check" :size="11" color="var(--zm-gold-500)" /> Verified</ZmBadge>
              <ZmBadge v-if="(business as any).featured" tone="gold">Featured</ZmBadge>
            </div>

            <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '32px', lineHeight: '1.05', letterSpacing: '-0.025em', margin: '0 0 4px' }">{{ business.name }}</h1>
            <div :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginBottom: '18px' }">{{ business.tag }} · {{ business.location }}</div>

            <!-- Stats grid -->
            <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '18px' }">
              <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)', padding: '12px', textAlign: 'center' }">
                <div :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '22px', lineHeight: '1', color: 'var(--zm-ink-950)' }">{{ allJobs.length || 0 }}</div>
                <div :style="{ fontFamily: 'var(--zm-font-mono)', fontSize: '10px', color: 'var(--zm-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: '3px' }">Jobs</div>
              </div>
              <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)', padding: '12px', textAlign: 'center' }">
                <div :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '22px', lineHeight: '1', color: 'var(--zm-ink-950)' }">{{ (business as any).skills?.length || 0 }}</div>
                <div :style="{ fontFamily: 'var(--zm-font-mono)', fontSize: '10px', color: 'var(--zm-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: '3px' }">Skills</div>
              </div>
              <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)', padding: '12px', textAlign: 'center' }">
                <div :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '22px', lineHeight: '1', color: 'var(--zm-ink-950)' }">{{ (business as any).rating ?? '—' }}</div>
                <div :style="{ fontFamily: 'var(--zm-font-mono)', fontSize: '10px', color: 'var(--zm-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: '3px' }">Rating</div>
              </div>
            </div>

            <!-- Tabs -->
            <div :style="{ marginTop: '20px' }">
              <ZmTabs :tabs="mobileTabs" :active="mobileActiveTab" @change="mobileActiveTab = $event" />
            </div>

            <!-- About section -->
            <div v-if="mobileActiveTab === 'about'" :style="{ marginTop: '20px' }">
              <div class="zm-eyebrow">About</div>
              <p v-if="about" :style="{ font: '400 14px/1.55 var(--zm-font-body)', marginTop: '8px', color: 'var(--zm-ink-950)' }">{{ about }}</p>
              <p v-else :style="{ font: '400 14px/1.55 var(--zm-font-body)', marginTop: '8px', color: 'var(--zm-fg-muted)' }">No description provided yet.</p>
            </div>

            <!-- Skills section -->
            <div v-if="mobileActiveTab === 'skills'" :style="{ marginTop: '20px' }">
              <div class="zm-eyebrow">Skills</div>
              <div v-if="(business as any).skills?.length" :style="{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }">
                <ZmChip v-for="s in (business as any).skills" :key="s" tone="subtle">{{ s }}</ZmChip>
              </div>
              <p v-else :style="{ font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '8px' }">No skills listed yet.</p>
            </div>

            <!-- Team section -->
            <div v-if="mobileActiveTab === 'team'" :style="{ marginTop: '20px' }">
              <div class="zm-eyebrow">Team</div>
              <p :style="{ font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '8px' }">{{ memberCount }} team members</p>
            </div>
          </div>

          <!-- Open roles (jobs tab or always visible) -->
          <div :style="{ padding: '0 20px 100px', marginTop: '24px' }">
            <div class="zm-eyebrow">Open roles</div>
            <div v-if="jobsPending" :style="{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }">
              <div v-for="i in 2" :key="i" :style="{ height: '90px', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)', animation: 'zm-pulse 1.5s ease-in-out infinite' }" />
            </div>
            <div v-else-if="allJobs.slice(0,2).length" :style="{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }">
              <div
                v-for="j in allJobs.slice(0,2)"
                :key="j.id"
                :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)', padding: '14px' }"
              >
                <div :style="{ font: '600 14px var(--zm-font-body)', marginBottom: '4px' }">{{ j.title }}</div>
                <div :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginBottom: '8px' }">{{ j.location }}</div>
                <div :style="{ display: 'flex', gap: '6px' }">
                  <ZmBadge tone="emerald" size="sm">{{ j.salary }}</ZmBadge>
                  <ZmBadge size="sm">{{ j.type }}</ZmBadge>
                </div>
              </div>
            </div>
            <p v-else :style="{ font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '10px' }">No open roles at the moment.</p>
          </div>

          <!-- Sticky CTA -->
          <div :style="{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '14px 20px 32px', background: 'var(--zm-paper)', borderTop: '1px solid var(--zm-border)', display: 'flex', gap: '8px', alignItems: 'center', zIndex: 50 }">
            <ZmIconButton icon="message" :size="48" />
            <ZmButton variant="dark" size="lg" :full="true">Start a project</ZmButton>
          </div>
        </div>

        <!-- Loading -->
        <div v-else-if="pending" :style="{ padding: '40px 20px', textAlign: 'center', color: 'var(--zm-fg-muted)' }">Loading…</div>

        <!-- Not found -->
        <div v-else :style="{ padding: '80px 20px', textAlign: 'center' }">
          <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '32px', margin: '0 0 12px' }">Not found</h2>
          <NuxtLink to="/businesses"><ZmButton variant="dark">Browse businesses</ZmButton></NuxtLink>
        </div>
      </div>
    </template>

    <!-- Desktop -->
    <template v-else>
      <ZmHeader active="exchange" />

      <!-- Loading skeleton -->
      <div v-if="pending" :style="{ padding: '40px 80px' }">
        <ZmSkeleton :height="220" radius="var(--zm-r-xl)" style="margin-bottom:32px" />
        <div :style="{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '48px' }">
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '16px' }">
            <ZmSkeleton v-for="i in 4" :key="i" :height="80" radius="var(--zm-r-lg)" />
          </div>
          <ZmSkeleton :height="300" radius="var(--zm-r-lg)" />
        </div>
      </div>

      <template v-else-if="business">
        <!-- Breadcrumb -->
        <div :style="{ padding: '20px 80px 0', display: 'flex', gap: '6px', font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', alignItems: 'center' }">
          <NuxtLink to="/exchange" style="text-decoration:none;color:inherit">Exchange</NuxtLink>
          <ZmIcon name="chevron_right" :size="13" color="var(--zm-fg-muted)" />
          <NuxtLink to="/businesses" style="text-decoration:none;color:inherit">Businesses</NuxtLink>
          <ZmIcon name="chevron_right" :size="13" color="var(--zm-fg-muted)" />
          <span :style="{ color: 'var(--zm-ink-950)' }">{{ business.name }}</span>
        </div>

        <!-- Banner -->
        <section :style="{ position: 'relative', marginTop: '18px' }">
          <div :style="{
            height: '220px', margin: '0 80px',
            background: bannerColor, borderRadius: 'var(--zm-r-xl)',
            position: 'relative', overflow: 'hidden',
          }">
            <svg width="100%" height="100%" viewBox="0 0 1280 220" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0">
              <circle cx="1100" cy="40" r="180" fill="var(--zm-gold-500)" opacity="0.4" />
              <circle cx="1100" cy="40" r="90" :fill="bannerColor" />
              <circle cx="1100" cy="40" r="40" fill="var(--zm-gold-500)" />
              <g stroke="var(--zm-gold-500)" stroke-width="1.5" fill="none" opacity="0.18">
                <line v-for="i in 9" :key="i" :x1="-40+(i-1)*70" y1="0" :x2="20+(i-1)*70" y2="220" />
              </g>
            </svg>
            <div :style="{ position: 'absolute', top: '20px', right: '24px', display: 'flex', gap: '8px' }">
              <ZmBadge tone="neutral">
                <ZmIcon name="badge_check" :size="11" color="var(--zm-gold-500)" /> Verified business
              </ZmBadge>
            </div>
          </div>

          <!-- Identity row -->
          <div :style="{ padding: '0 96px', marginTop: '-64px', position: 'relative', display: 'flex', alignItems: 'flex-end', gap: '28px' }">
            <div :style="{
              width: '144px', height: '144px', borderRadius: 'var(--zm-r-xl)',
              background: 'var(--zm-paper)',
              border: '6px solid var(--zm-paper)',
              boxShadow: 'var(--zm-shadow-md)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--zm-font-display)', fontSize: '88px',
              color: bannerColor, letterSpacing: '-0.04em', lineHeight: '1',
              flexShrink: '0',
            }">{{ initial }}</div>

            <div :style="{ flex: '1', paddingBottom: '12px', minWidth: '0' }">
              <div class="zm-eyebrow">{{ business.tag }}</div>
              <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '56px', lineHeight: '1', letterSpacing: '-0.025em', margin: '8px 0 10px' }">{{ business.name }}</h1>
              <div :style="{ display: 'flex', alignItems: 'center', gap: '18px', font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', flexWrap: 'wrap' }">
                <span v-if="business.location" :style="{ display: 'inline-flex', alignItems: 'center', gap: '6px' }">
                  <ZmIcon name="map_pin" :size="14" /> {{ business.location }}
                </span>
                <span v-if="foundedYear" :style="{ display: 'inline-flex', alignItems: 'center', gap: '6px' }">
                  <ZmIcon name="calendar" :size="14" /> Founded {{ foundedYear }}
                </span>
                <span v-if="memberCount" :style="{ display: 'inline-flex', alignItems: 'center', gap: '6px' }">
                  <ZmIcon name="users" :size="14" /> {{ memberCount }} members
                </span>
                <a v-if="website" :href="business.website" target="_blank" rel="noopener noreferrer"
                  :style="{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--zm-fg-muted)', textDecoration: 'none' }">
                  <ZmIcon name="external" :size="14" /> {{ website }}
                </a>
              </div>
            </div>

            <div :style="{ display: 'flex', gap: '8px', paddingBottom: '12px' }">
              <ZmButton variant="dark" icon="message" size="lg">Message</ZmButton>
              <ZmButton variant="secondary" icon="bookmark" size="lg">Follow</ZmButton>
              <ZmIconButton icon="more" :size="48" variant="surface" />
            </div>
          </div>
        </section>

        <!-- Stats strip -->
        <section :style="{ padding: '40px 80px 0' }">
          <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }">
            <ZmStat label="Open roles" :value="String(allJobs.length || 0)" icon="briefcase" />
            <ZmStat label="Team members" :value="String(memberCount || 0)" icon="users" />
            <ZmStat label="Profile views" :value="String((business as any).profile_view ?? 0)" icon="eye" />
            <ZmStat label="Category" :value="business.tag || 'General'" icon="grid" />
          </div>
        </section>

        <!-- Tabs -->
        <section :style="{ padding: '36px 80px 0' }">
          <div :style="{ display: 'flex', gap: '0', borderBottom: '1px solid var(--zm-border)' }">
            <button
              v-for="tab in tabs" :key="tab.id"
              @click="activeTab = tab.id"
              :style="{
                padding: '10px 20px', border: 'none', background: 'transparent', cursor: 'pointer',
                font: `${activeTab === tab.id ? '600' : '500'} 14px var(--zm-font-body)`,
                color: activeTab === tab.id ? 'var(--zm-ink-950)' : 'var(--zm-fg-muted)',
                borderBottom: activeTab === tab.id ? '2px solid var(--zm-ink-950)' : '2px solid transparent',
                marginBottom: '-1px', transition: 'color 0.15s',
              }"
            >{{ tab.label }}</button>
          </div>
        </section>

        <!-- Main content -->
        <div :style="{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '48px', padding: '40px 80px 80px' }">

          <!-- Left column -->
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '40px', minWidth: '0' }">

            <!-- About tab -->
            <template v-if="activeTab === 'about'">
              <section>
                <div class="zm-eyebrow">About</div>
                <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '36px', letterSpacing: '-0.02em', margin: '6px 0 16px', lineHeight: '1.05' }">
                  {{ business.name }}
                </h2>
                <p v-if="about" :style="{ font: '400 16px/1.55 var(--zm-font-body)', maxWidth: '720px', margin: '0' }">{{ about }}</p>
                <p v-else :style="{ font: '400 16px/1.55 var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0' }">No description provided yet.</p>
              </section>

              <section v-if="industries.length">
                <div class="zm-eyebrow" :style="{ marginBottom: '12px' }">Industries served</div>
                <div :style="{ display: 'flex', gap: '6px', flexWrap: 'wrap' }">
                  <ZmChip v-for="ind in industries" :key="ind" tone="subtle">{{ ind }}</ZmChip>
                </div>
              </section>
            </template>

            <!-- Open roles tab -->
            <template v-if="activeTab === 'jobs'">
              <section>
                <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }">
                  <div>
                    <div class="zm-eyebrow">Open roles</div>
                    <h3 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '30px', letterSpacing: '-0.02em', margin: '6px 0 0' }">
                      {{ allJobs.length }} active {{ allJobs.length === 1 ? 'search' : 'searches' }}
                    </h3>
                  </div>
                  <NuxtLink v-if="allJobs.length > 4" :to="`/businesses/${slug}/jobs`" style="text-decoration:none">
                    <ZmButton variant="ghost" icon-right="arrow_right">View all {{ allJobs.length }}</ZmButton>
                  </NuxtLink>
                </div>
                <div v-if="jobsPending" :style="{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '16px' }">
                  <div v-for="i in 4" :key="i" :style="{ height: '180px', background: 'var(--zm-paper-2)', borderRadius: 'var(--zm-r-lg)', animation: 'zm-pulse 1.5s ease-in-out infinite' }" />
                </div>
                <div v-else-if="previewJobs.length" :style="{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }">
                  <CardsJobCard v-for="j in previewJobs" :key="j.id" :job="j" />
                </div>
                <div v-else :style="{ padding: '48px', textAlign: 'center', color: 'var(--zm-fg-muted)', font: '400 15px var(--zm-font-body)', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)' }">
                  No open roles at the moment.
                </div>
                <div v-if="allJobs.length > 4" :style="{ marginTop: '20px', textAlign: 'center' }">
                  <NuxtLink :to="`/businesses/${slug}/jobs`" style="text-decoration:none">
                    <ZmButton variant="secondary" icon-right="arrow_right">
                      See all {{ allJobs.length }} open roles
                    </ZmButton>
                  </NuxtLink>
                </div>
              </section>
            </template>

            <!-- Team tab -->
            <template v-if="activeTab === 'team'">
              <section>
                <div class="zm-eyebrow" :style="{ marginBottom: '16px' }">Team members</div>
                <div v-if="memberCount" :style="{ display: 'flex', alignItems: 'center', gap: '12px', padding: '24px', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)' }">
                  <ZmAvatarStack :people="(business as any).membersData ?? [{ name: business.name }]" :size="40" :max="6" />
                  <span :style="{ font: '500 14px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ memberCount }} team members</span>
                </div>
                <div v-else :style="{ padding: '48px', textAlign: 'center', color: 'var(--zm-fg-muted)', font: '400 15px var(--zm-font-body)', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)' }">
                  No team members listed.
                </div>
              </section>
            </template>
          </div>

          <!-- Right rail -->
          <aside :style="{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '84px', alignSelf: 'start' }">

            <!-- At a glance -->
            <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', padding: '22px' }">
              <div class="zm-eyebrow" :style="{ marginBottom: '14px' }">At a glance</div>
              <div :style="{ display: 'flex', flexDirection: 'column', gap: '10px' }">
                <div v-for="[k, v] in glanceRows" :key="k" :style="{ display: 'flex', justifyContent: 'space-between', font: '500 13px var(--zm-font-body)' }">
                  <span :style="{ color: 'var(--zm-fg-muted)' }">{{ k }}</span>
                  <span>{{ v }}</span>
                </div>
              </div>
            </div>

            <!-- CTA -->
            <div :style="{ background: 'var(--zm-ink-900)', color: 'var(--zm-fg-on-dark)', borderRadius: 'var(--zm-r-lg)', padding: '22px' }">
              <div class="zm-eyebrow" :style="{ color: 'var(--zm-gold-500)' }">Work with us</div>
              <h4 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '22px', lineHeight: '1.2', letterSpacing: '-0.015em', margin: '6px 0 12px' }">Have a brief? Send it directly.</h4>
              <p :style="{ font: '400 13px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-on-dark-muted)', margin: '0 0 14px' }">
                We reply within a business day and share a proposal in three.
              </p>
              <ZmButton variant="accent" :full="true" size="md" icon-right="arrow_right">Start a project</ZmButton>
            </div>

            <!-- Jobs quick link -->
            <div v-if="allJobs.length" :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', padding: '22px' }">
              <div class="zm-eyebrow" :style="{ marginBottom: '14px' }">Open roles</div>
              <div :style="{ display: 'flex', flexDirection: 'column', gap: '10px' }">
                <div v-for="j in allJobs.slice(0, 4)" :key="j.id" :style="{ display: 'flex', alignItems: 'center', gap: '10px' }">
                  <div :style="{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--zm-success-bg)', flexShrink: '0' }" />
                  <span :style="{ font: '500 13px var(--zm-font-body)', flex: '1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">{{ j.title }}</span>
                </div>
              </div>
              <div :style="{ marginTop: '12px', display: 'flex', gap: '8px' }">
                <button @click="activeTab = 'jobs'" :style="{ background: 'none', border: 'none', cursor: 'pointer', font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', padding: '0', display: 'flex', alignItems: 'center', gap: '4px' }">
                  Preview <ZmIcon name="eye" :size="13" />
                </button>
                <NuxtLink v-if="allJobs.length > 4" :to="`/businesses/${slug}/jobs`" :style="{ font: '500 13px var(--zm-font-body)', color: 'var(--zm-ink-950)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }">
                  All {{ allJobs.length }} <ZmIcon name="arrow_right" :size="13" />
                </NuxtLink>
              </div>
            </div>
          </aside>
        </div>
      </template>

      <!-- Not found -->
      <div v-else :style="{ padding: '120px 80px', textAlign: 'center' }">
        <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '48px', margin: '0 0 12px' }">Business not found</h2>
        <p :style="{ font: '400 16px var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0 0 24px' }">This business profile does not exist or has been removed.</p>
        <NuxtLink to="/businesses"><ZmButton variant="dark">Browse businesses</ZmButton></NuxtLink>
      </div>

      <ExchangeAppFooter />
    </template>
  </div>
</template>
