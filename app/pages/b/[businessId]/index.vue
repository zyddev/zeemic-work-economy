<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const route = useRoute()
const router = useRouter()

const businessId = computed(() => route.params.businessId as string)
const activeKey = computed(() =>
  Array.isArray(route.query.s) ? route.query.s[0] : (route.query.s as string) || 'jobs'
)

const { getBusinessById, loading: bizLoading } = useBusinessAccount()
const { getComponent } = useBusinessAccountComponents()
const { user } = storeToRefs(useAuthStore())

const business = ref<any>(null)
const activeComponent = shallowRef<any>(null)
const loadError = ref(false)

onMounted(async () => {
  const data = await getBusinessById(businessId.value)
  if (data) {
    business.value = data
    const { switchToBusiness } = useContextStore()
    switchToBusiness(data.id ?? businessId.value, data.name ?? '')
  } else {
    loadError.value = true
  }
})

watchEffect(() => {
  activeComponent.value = getComponent(activeKey.value)
})

const TAB_LABELS: Record<string, string> = {
  jobs: 'Jobs',
  posts: 'Posts',
  users: 'Team',
  brand: 'Brand',
}

const NAV_ICONS: Record<string, string> = {
  jobs: 'briefcase',
  posts: 'file_text',
  users: 'users',
  brand: 'settings',
}

function goTab(key: string) {
  router.push({ query: { s: key } })
}
</script>

<template>
  <div class="zm-root" :style="{ background: 'var(--zm-paper)', minHeight: '100vh' }">
    <ZmHeader context="business" :business="business ? { name: business.name } : undefined" active="dashboard" />

    <div :style="{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - 64px)' }">
      <!-- Sidebar -->
      <aside :style="{ borderRight: '1px solid var(--zm-border)', padding: '24px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }">
        <!-- Business identity -->
        <div :style="{ padding: '4px 12px', marginBottom: '16px' }">
          <div class="zm-eyebrow">Business account</div>
          <div :style="{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }">
            <ZmAvatar :name="business?.name ?? ''" :size="36" :square="true" />
            <div style="min-width:0">
              <div :style="{ font: '600 14px var(--zm-font-body)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">
                {{ business?.name ?? '…' }}
              </div>
              <div :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ business?.category ?? '' }}</div>
            </div>
          </div>
        </div>

        <!-- Tab nav -->
        <button
          v-for="(label, key) in TAB_LABELS"
          :key="key"
          :style="{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '9px 12px', borderRadius: 'var(--zm-r-md)', border: 'none', cursor: 'pointer',
            font: '500 14px var(--zm-font-body)', textAlign: 'left',
            background: activeKey === key ? 'var(--zm-ink-900)' : 'transparent',
            color: activeKey === key ? 'var(--zm-fg-on-dark)' : 'var(--zm-ink-700)',
            transition: 'background 0.15s',
          }"
          @click="goTab(key)"
        >
          <ZmIcon :name="NAV_ICONS[key]" :size="16" :color="activeKey === key ? 'var(--zm-fg-on-dark)' : 'var(--zm-ink-700)'" />
          {{ label }}
        </button>

        <span style="flex:1" />

        <!-- Switch to personal -->
        <NuxtLink
          to="/dashboard"
          :style="{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
            borderRadius: 'var(--zm-r-md)', background: 'var(--zm-paper-2)',
            textDecoration: 'none', color: 'inherit', border: '1px solid var(--zm-border)',
          }"
        >
          <ZmAvatar :name="user?.firstName ?? ''" :size="28" />
          <div style="flex:1;min-width:0">
            <div :style="{ font: '600 12px var(--zm-font-body)' }">Switch to Personal</div>
            <div :style="{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">
              {{ user?.firstName }} {{ user?.lastName }}
            </div>
          </div>
          <ZmIcon name="chevron_right" :size="14" color="var(--zm-fg-muted)" />
        </NuxtLink>
      </aside>

      <!-- Tab content -->
      <main :style="{ overflow: 'auto' }">
        <!-- Loading -->
        <div v-if="bizLoading" :style="{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }">
          <ZmSpinner :size="28" color="var(--zm-ink-700)" />
        </div>
        <!-- Error -->
        <div v-else-if="loadError" :style="{ padding: '80px 40px', textAlign: 'center' }">
          <div :style="{ font: '500 16px var(--zm-font-body)', marginBottom: '8px' }">Business not found</div>
          <ZmButton variant="secondary" @click="$router.back()">Go back</ZmButton>
        </div>
        <!-- Active tab -->
        <component
          :is="activeComponent"
          v-else-if="activeComponent && business"
          :business-id="businessId"
          :business="business"
        />
        <!-- Unknown tab fallback -->
        <div v-else :style="{ padding: '80px 40px', textAlign: 'center', color: 'var(--zm-fg-muted)', font: '400 14px var(--zm-font-body)' }">
          Tab not found.
        </div>
      </main>
    </div>
  </div>
</template>
