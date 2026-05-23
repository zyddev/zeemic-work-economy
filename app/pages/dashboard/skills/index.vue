<script setup lang="ts">
import { USER_SIDEBAR } from '~/data'
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
const { products: allProducts, pending } = useMarketplaceProducts()
useHead({ title: 'My Skills — Zeemic' })
const { isMobile, isTablet } = useBreakpoint()
const mobileSidebarOpen = ref(false)

const activeFilter = ref<'All' | 'Active' | 'Draft' | 'Paused'>('All')
const filters = ['All', 'Active', 'Draft', 'Paused'] as const

const skillStatuses = computed(() =>
  (allProducts.value ?? []).map((skill, i) => ({
    skill,
    views:     0,
    inquiries: 0,
    status:    'Active' as const,
  }))
)

const filteredSkills = computed(() =>
  activeFilter.value === 'All'
    ? skillStatuses.value
    : skillStatuses.value.filter(s => s.status === activeFilter.value)
)
</script>
<template>
  <div class="zm-root" style="background:var(--zm-paper);min-height:100vh">
    <ZmHeader active="dashboard" />
    <!-- Mobile sidebar backdrop -->
    <div v-if="isMobile && mobileSidebarOpen" @click="mobileSidebarOpen = false" :style="{ position: 'fixed', inset: '0', background: 'rgba(0,0,0,0.3)', zIndex: 149 }" />
    <div :style="{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '240px 1fr', minHeight: 'calc(100vh - 64px)' }">
      <ZmSidebar v-show="!isMobile || mobileSidebarOpen" :items="USER_SIDEBAR" active="skills" :style="isMobile && mobileSidebarOpen ? { position: 'fixed', top: '0', left: '0', height: '100vh', width: '280px', zIndex: '150', overflowY: 'auto', background: 'var(--zm-white)', boxShadow: 'var(--zm-shadow-lg)' } : {}">
        <template #header>
          <div :style="{ padding: '4px 12px' }">
            <div class="zm-eyebrow">Personal account</div>
            <div :style="{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }">
              <ZmAvatar name="Enoch Boison" :size="36" />
              <div>
                <div :style="{ font: '600 14px var(--zm-font-body)' }">Enoch Boison</div>
                <div :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">@enochboison</div>
              </div>
            </div>
          </div>
        </template>
      </ZmSidebar>

      <main :style="{ padding: isMobile ? '20px 16px' : '40px', overflow: 'hidden' }">
        <!-- Page header row -->
        <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }">
          <div>
            <div class="zm-eyebrow">My skills</div>
            <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '48px', lineHeight: '1', letterSpacing: '-0.025em', margin: '8px 0 0' }">Skills</h1>
          </div>
          <ZmButton variant="primary" icon="plus" size="lg" @click="navigateTo('/dashboard/skills/new')">New skill</ZmButton>
        </div>

        <!-- Filter bar -->
        <div :style="{ display: 'flex', gap: '8px', marginBottom: '24px' }">
          <ZmChip
            v-for="f in filters"
            :key="f"
            :active="activeFilter === f"
            @click="activeFilter = f"
          >{{ f }}</ZmChip>
        </div>

        <!-- Skills grid -->
        <div :style="{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', gap: '16px' }">
          <template v-if="pending">
            <CardsSkillManageCard v-for="i in 4" :key="i" :loading="true" />
          </template>
          <template v-else>
            <CardsSkillManageCard
              v-for="item in filteredSkills"
              :key="item.skill.id"
              :skill="item.skill"
              :views="item.views"
              :inquiries="item.inquiries"
              :status="item.status"
            />
          </template>
        </div>

        <div v-if="!pending && filteredSkills.length === 0" :style="{ padding: '64px 0', textAlign: 'center', color: 'var(--zm-fg-muted)', font: '400 15px var(--zm-font-body)' }">
          No skills in this category yet.
        </div>
      </main>
    </div>
    <!-- Mobile floating hamburger -->
    <div v-if="isMobile" :style="{ position: 'fixed', bottom: '24px', left: '16px', zIndex: '100' }">
      <ZmIconButton icon="menu" :size="44" @click="mobileSidebarOpen = true" />
    </div>
  </div>
</template>
