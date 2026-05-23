<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Settings — Zeemic' })
const { isMobile } = useBreakpoint()
const { user } = useUserInfo()
const router = useRouter()

interface SettingsItem { icon: string; title: string; subtitle?: string; href: string; badge?: number }
interface SettingsSection { title: string; items: SettingsItem[] }

const sections: SettingsSection[] = [
  {
    title: 'Account',
    items: [
      { icon: 'user', title: 'Profile', subtitle: 'Name, bio, location', href: '/dashboard' },
      { icon: 'message', title: 'Email & verification', subtitle: 'Verified', href: '#' },
      { icon: 'bolt', title: 'Password', subtitle: 'Set a password', href: '/account/password' },
      { icon: 'globe', title: 'Languages', subtitle: 'English', href: '#' },
    ],
  },
  {
    title: 'Workspace',
    items: [
      { icon: 'building', title: 'My businesses', subtitle: '2 businesses', href: '/b/northwind', badge: 2 },
      { icon: 'badge_check', title: 'Verification', subtitle: 'Verified ✓', href: '/business/verify' },
    ],
  },
  {
    title: 'Trust & safety',
    items: [
      { icon: 'file_text', title: 'Guidelines', href: '/guidelines' },
      { icon: 'file_text', title: 'Privacy', href: '/policies/privacy' },
      { icon: 'file_text', title: 'Terms', href: '/terms' },
    ],
  },
]
</script>
<template>
  <div style="background:var(--zm-paper);min-height:100vh">
    <!-- Mobile -->
    <template v-if="isMobile">
      <div :style="{ background: 'var(--zm-grey-50)', minHeight: '100vh', paddingBottom: '80px' }">
        <ZmMNavBar title="Settings" leftLabel="Dashboard" @back="router.push('/dashboard')" />
        <!-- Profile row -->
        <div :style="{ padding: '20px 20px 8px', display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--zm-white)' }">
          <ZmAvatar :name="user?.name ?? 'User'" :size="56" />
          <div :style="{ flex: 1 }">
            <div :style="{ font: '600 16px var(--zm-font-body)' }">{{ user?.name ?? 'User' }}</div>
            <div :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ user?.handle ? `@${user.handle}` : '' }}</div>
          </div>
          <ZmButton size="sm" variant="secondary">Edit</ZmButton>
        </div>
        <!-- Sections -->
        <template v-for="section in sections" :key="section.title">
          <ZmMSectionHead>{{ section.title }}</ZmMSectionHead>
          <div :style="{ background: 'var(--zm-white)' }">
            <template v-for="(item, i) in section.items" :key="item.title">
              <NuxtLink :to="item.href" style="text-decoration:none;color:inherit;display:block">
                <ZmMListRow
                  :icon="item.icon"
                  :title="item.title"
                  :subtitle="item.subtitle"
                  :badge="item.badge"
                  :last="i === section.items.length - 1"
                />
              </NuxtLink>
            </template>
          </div>
        </template>
        <!-- Notifications section -->
        <ZmMSectionHead>Notifications</ZmMSectionHead>
        <div :style="{ background: 'var(--zm-white)' }">
          <ZmMListRow title="Push notifications" :accessory="false">
            <template #accessory><ZmToggle :value="true" /></template>
          </ZmMListRow>
          <ZmMListRow title="Email digest" subtitle="Weekly summary" :last="true" :accessory="false">
            <template #accessory><ZmToggle :value="true" /></template>
          </ZmMListRow>
        </div>
        <!-- Sign out -->
        <div :style="{ padding: '20px', marginTop: '8px' }">
          <NuxtLink to="/auth/logout" style="text-decoration:none">
            <ZmButton variant="danger" size="lg" :full="true">Sign out</ZmButton>
          </NuxtLink>
        </div>
        <ZmMTabBar active="dashboard" />
      </div>
    </template>
    <!-- Desktop -->
    <template v-else>
      <ZmHeader active="dashboard" />
      <div :style="{ maxWidth: '640px', margin: '0 auto', padding: '48px 24px 80px' }">
        <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '48px', letterSpacing: '-0.025em', margin: '0 0 32px' }">Settings</h1>
        <template v-for="section in sections" :key="section.title">
          <div :style="{ marginBottom: '32px' }">
            <div class="zm-eyebrow" :style="{ marginBottom: '12px' }">{{ section.title }}</div>
            <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', overflow: 'hidden' }">
              <NuxtLink
                v-for="(item, i) in section.items"
                :key="item.title"
                :to="item.href"
                :style="{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 18px',
                  borderBottom: i < section.items.length - 1 ? '1px solid var(--zm-border)' : 'none',
                }"
              >
                <ZmIcon :name="item.icon" :size="16" color="var(--zm-ink-700)" />
                <div :style="{ flex: 1 }">
                  <div :style="{ font: '500 14px var(--zm-font-body)' }">{{ item.title }}</div>
                  <div v-if="item.subtitle" :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '2px' }">{{ item.subtitle }}</div>
                </div>
                <ZmIcon name="chevron_right" :size="14" color="var(--zm-grey-400)" />
              </NuxtLink>
            </div>
          </div>
        </template>
        <NuxtLink to="/auth/logout" style="text-decoration:none">
          <ZmButton variant="danger" size="lg" :full="true">Sign out</ZmButton>
        </NuxtLink>
      </div>
      <ExchangeAppFooter />
    </template>
  </div>
</template>
