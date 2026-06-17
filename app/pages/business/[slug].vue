<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { getBusinessBySlug, getUserBusinessList } = useBusinessAccount()
const { isAuthenticated, user } = storeToRefs(useAuthStore())
const { applyBusinessSlugSEO } = useBusinessSEO()
const { trackEvent } = useAnalyticsEvent()

const isLoading = ref(true)
const loadError = ref(false)
const business = reactive<Record<string, any>>({})

const userBusinesses = ref<any[]>([])
const showDashboardMenu = ref(false)

onMounted(async () => {
  const data = await getBusinessBySlug(slug.value)
  if (!data || data.error) {
    loadError.value = true
    isLoading.value = false
    return
  }
  Object.assign(business, data)
  isLoading.value = false

  applyBusinessSlugSEO({
    id: business.id,
    name: business.name,
    slug: slug.value,
    category: business.category,
    industry: business.industry,
    location: business.location,
    shortDescription: business.shortDescription,
    profilePicture: business.profilePicture,
  })

  trackEvent({
    event: 'profile_view',
    entityType: 'business',
    entityId: business.id,
    userId: user.value?.id,
    metadata: { location: business.location, action: 'view_business' },
  })

  if (isAuthenticated.value) {
    const list = await getUserBusinessList()
    userBusinesses.value = list.filter(
      (m: any) => ['OWNER', 'ADMIN', 'MEMBER'].includes(m.role) && m.status !== 'INACTIVE'
    )
  }
})

function initials() {
  return (business.name ?? '').slice(0, 2).toUpperCase() || '??'
}

function truncateText(str: string, max: number) {
  if (!str) return ''
  return str.length > max ? str.slice(0, max) + '…' : str
}

function formatHours(open: string | null, close: string | null) {
  if (!open || !close) return 'Closed'
  const fmt = (t: string) => {
    const [h, m] = t.split(':').map(Number)
    const suffix = h >= 12 ? 'PM' : 'AM'
    const hour = h % 12 || 12
    return m === 0 ? `${hour} ${suffix}` : `${hour}:${String(m).padStart(2, '0')} ${suffix}`
  }
  return `${fmt(open)} – ${fmt(close)}`
}

async function copy(value: string) {
  await navigator.clipboard.writeText(value)
}

function copyProfileLink() {
  if (typeof window !== 'undefined') copy(window.location.href)
}

const isOpen = computed(() => {
  const hours = business.businessHours as { day: string; open: string | null; close: string | null }[] | undefined
  if (!hours?.length) return false
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const today = DAYS[new Date().getDay()]
  const entry = hours.find(h => h.day === today)
  if (!entry?.open || !entry?.close) return false
  const now = new Date()
  const [oh, om] = entry.open.split(':').map(Number)
  const [ch, cm] = entry.close.split(':').map(Number)
  const nowMins = now.getHours() * 60 + now.getMinutes()
  return nowMins >= oh * 60 + om && nowMins < ch * 60 + cm
})

const members = computed(() => {
  const raw = business.members ?? []
  return raw.map((m: any) => ({
    id: m.id ?? '',
    username: m.user?.profile?.username ?? m.username ?? '',
    name: [m.user?.firstName, m.user?.lastName].filter(Boolean).join(' ') || m.name || '',
    image: m.user?.profile?.profilePicture ?? m.image ?? null,
    url: `user/profile/${m.user?.profile?.username ?? m.username ?? ''}`,
    role: m.role ?? 'MEMBER',
  }))
})

const { isFeatureEnabled } = useFeatureFlags()
const showActionsPanel = isFeatureEnabled('BUSINESS_PROFILE_ACTIONS_PANEL')
const showSocials = isFeatureEnabled('BUSINESS_PROFILE_SOCIALS')
</script>

<template>
  <div class="zm-root" :style="{ background: 'var(--zm-paper)', minHeight: '100vh' }">
    <ZmHeader active="exchange" />

    <!-- Loading -->
    <template v-if="isLoading">
      <div :style="{ padding: '40px 80px', maxWidth: '1200px', margin: '0 auto' }">
        <div v-for="i in 4" :key="i" :style="{ height: '24px', background: 'var(--zm-paper-2)', borderRadius: 'var(--zm-r-md)', marginBottom: '16px', animation: 'pulse 1.4s ease-in-out infinite' }" />
      </div>
    </template>

    <!-- Error -->
    <template v-else-if="loadError">
      <div :style="{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', textAlign: 'center' }">
        <div :style="{ font: '500 20px var(--zm-font-body)', marginBottom: '12px' }">Business not found</div>
        <p :style="{ font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginBottom: '20px' }">This business profile doesn't exist or has been removed.</p>
        <ZmButton variant="secondary" @click="$router.back()">Go back</ZmButton>
      </div>
    </template>

    <!-- Profile -->
    <template v-else>
      <!-- Header band -->
      <div :style="{ background: 'var(--zm-ink-900)', padding: '32px 80px 0', position: 'relative' }">
        <!-- Avatar -->
        <div :style="{ width: '80px', height: '80px', borderRadius: 'var(--zm-r-lg)', background: 'var(--zm-white)', border: '3px solid var(--zm-paper)', boxShadow: 'var(--zm-shadow-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }">
          <img v-if="business.profilePicture" :src="business.profilePicture" :alt="business.name" :style="{ width: '100%', height: '100%', objectFit: 'cover' }" />
          <span v-else :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '32px', color: 'var(--zm-ink-900)' }">{{ initials() }}</span>
        </div>
        <div :style="{ paddingBottom: '24px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }">
          <div>
            <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }">
              <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '36px', lineHeight: '1', letterSpacing: '-0.025em', color: 'var(--zm-fg-on-dark)', margin: '0' }">
                {{ truncateText(business.name ?? '', 32) }}
              </h1>
              <ZmBadge v-if="business.verified" tone="emerald">Verified</ZmBadge>
            </div>
            <div :style="{ font: '400 14px var(--zm-font-body)', color: 'rgba(255,255,255,0.65)' }">
              {{ [business.category, business.industry, business.location].filter(Boolean).join(' · ') }}
            </div>
          </div>
          <div :style="{ display: 'flex', gap: '8px' }">
            <ZmButton variant="onDark" size="sm" icon="link" @click="copyProfileLink">Copy link</ZmButton>

            <!-- Dashboard dropdown for members -->
            <div v-if="isAuthenticated && userBusinesses.length" style="position:relative">
              <ZmButton variant="onDark" size="sm" icon-right="chevron_down" @click="showDashboardMenu = !showDashboardMenu">
                Dashboard
              </ZmButton>
              <div
                v-if="showDashboardMenu"
                :style="{
                  position: 'absolute', right: '0', top: 'calc(100% + 6px)', minWidth: '200px',
                  background: 'var(--zm-white)', border: '1px solid var(--zm-border)',
                  borderRadius: 'var(--zm-r-md)', boxShadow: 'var(--zm-shadow-md)', zIndex: '50', overflow: 'hidden',
                }"
              >
                <NuxtLink
                  v-for="m in userBusinesses"
                  :key="m.business?.id"
                  :to="`/b/${m.business?.id}`"
                  :style="{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', textDecoration: 'none', color: 'var(--zm-ink-950)', font: '400 13px var(--zm-font-body)' }"
                  @click="showDashboardMenu = false"
                >
                  <ZmAvatar :name="m.business?.name ?? ''" :size="24" :square="true" />
                  {{ m.business?.name }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Metrics strip -->
      <div :style="{ borderBottom: '1px solid var(--zm-border)', padding: '14px 80px', display: 'flex', gap: '28px', background: 'var(--zm-white)' }">
        <div v-for="(val, label) in { 'Employees': business.employees, 'Years active': business.yearsInOperation, 'Reviews': business.reviews, 'Profile views': business.profile_view }" :key="label">
          <span :style="{ font: '600 15px var(--zm-font-body)' }">{{ val ?? '—' }}</span>
          <span :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginLeft: '5px' }">{{ label }}</span>
        </div>
      </div>

      <!-- Body -->
      <div :style="{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px', maxWidth: '1200px', margin: '0 auto', padding: '40px 80px' }">
        <!-- Left column -->
        <div :style="{ display: 'flex', flexDirection: 'column', gap: '28px' }">

          <!-- About -->
          <section>
            <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '24px', letterSpacing: '-0.02em', margin: '0 0 12px' }">About</h2>
            <p v-if="business.about" :style="{ font: '400 15px var(--zm-font-body)', lineHeight: '1.65', color: 'var(--zm-ink-800)', margin: '0' }">{{ business.about }}</p>
            <p v-else :style="{ font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0' }">No description provided.</p>
          </section>

          <!-- Business Hours -->
          <section v-if="business.businessHours?.length">
            <div :style="{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }">
              <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '24px', letterSpacing: '-0.02em', margin: '0' }">Business Hours</h2>
              <ZmBadge :tone="isOpen ? 'emerald' : 'neutral'">{{ isOpen ? 'OPEN' : 'CLOSED' }}</ZmBadge>
            </div>
            <div :style="{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '6px 16px' }">
              <template v-for="h in business.businessHours" :key="h.day">
                <div :style="{ font: '500 13px var(--zm-font-body)', color: 'var(--zm-ink-700)' }">{{ h.day }}</div>
                <div :style="{ font: '400 13px var(--zm-font-body)', color: h.open ? 'var(--zm-ink-950)' : 'var(--zm-fg-muted)' }">
                  {{ formatHours(h.open, h.close) }}
                </div>
              </template>
            </div>
          </section>

          <!-- Contact -->
          <section>
            <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '24px', letterSpacing: '-0.02em', margin: '0 0 12px' }">Contact</h2>
            <div :style="{ display: 'flex', flexDirection: 'column', gap: '8px' }">
              <div v-if="business.phone" :style="{ display: 'flex', alignItems: 'center', gap: '10px' }">
                <ZmIcon name="phone" :size="16" color="var(--zm-fg-muted)" />
                <span :style="{ font: '400 14px var(--zm-font-body)' }">{{ business.phone }}</span>
                <ZmIconButton icon="copy" :size="24" @click="copy(business.phone)" />
              </div>
              <div v-if="business.email" :style="{ display: 'flex', alignItems: 'center', gap: '10px' }">
                <ZmIcon name="mail" :size="16" color="var(--zm-fg-muted)" />
                <span :style="{ font: '400 14px var(--zm-font-body)' }">{{ business.email }}</span>
                <ZmIconButton icon="copy" :size="24" @click="copy(business.email)" />
              </div>
              <div v-if="business.website" :style="{ display: 'flex', alignItems: 'center', gap: '10px' }">
                <ZmIcon name="link" :size="16" color="var(--zm-fg-muted)" />
                <a :href="business.website" target="_blank" rel="noopener" :style="{ font: '400 14px var(--zm-font-body)', color: 'var(--zm-ink-700)' }">
                  {{ business.websiteLabel ?? business.website }}
                </a>
              </div>

              <!-- Social links (feature flagged) -->
              <template v-if="showSocials && business.socials?.length">
                <div v-for="s in business.socials" :key="s.platform" :style="{ display: 'flex', alignItems: 'center', gap: '10px' }">
                  <ZmIcon :name="s.icon ?? 'link'" :size="16" color="var(--zm-fg-muted)" />
                  <a :href="s.url" target="_blank" rel="noopener" :style="{ font: '400 14px var(--zm-font-body)', color: 'var(--zm-ink-700)' }">{{ s.platform }}</a>
                </div>
              </template>
            </div>
          </section>
        </div>

        <!-- Right sidebar -->
        <div :style="{ display: 'flex', flexDirection: 'column', gap: '20px' }">
          <!-- Team -->
          <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', padding: '20px' }">
            <h3 :style="{ font: '600 15px var(--zm-font-body)', margin: '0 0 14px' }">Team · {{ members.length }}</h3>
            <ZmAvatarStack :people="members" :size="36" :max="6" />
          </div>

          <!-- Actions panel (feature flagged) -->
          <div
            v-if="showActionsPanel"
            :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }"
          >
            <ZmButton variant="dark" style="width:100%">Request Quote</ZmButton>
            <ZmButton variant="secondary" style="width:100%">Contact Sales</ZmButton>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50%       { opacity: 0.25; }
}
</style>
