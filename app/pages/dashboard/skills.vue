<script setup lang="ts">
import { USER_SIDEBAR } from '~/data'
const { products } = useMarketplaceProducts()
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useHead({ title: 'My Skills — Zeemic' })
const { isMobile } = useBreakpoint()
const mobileSidebarOpen = ref(false)
</script>
<template>
  <div class="zm-root" style="background:var(--zm-paper);min-height:100vh">
    <ZmHeader active="dashboard" />
    <div :style="{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '240px 1fr', minHeight: 'calc(100vh - 64px)' }">
      <div v-if="isMobile && mobileSidebarOpen" @click="mobileSidebarOpen = false" :style="{ position: 'fixed', inset: '0', background: 'rgba(0,0,0,0.3)', zIndex: 149 }" />
      <ZmSidebar
        v-show="!isMobile || mobileSidebarOpen"
        :items="USER_SIDEBAR"
        active="skills"
        :style="isMobile ? { position: 'fixed', top: '0', left: '0', height: '100vh', width: '280px', zIndex: 150, background: 'var(--zm-white)', boxShadow: 'var(--zm-shadow-lg)', overflowY: 'auto' } : {}"
      >
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
      <main :style="{ padding: isMobile ? '20px 16px' : '40px' }">
        <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }">
          <div>
            <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '48px', lineHeight: '1', letterSpacing: '-0.025em', margin: '0' }">My skills</h1>
            <p :style="{ font: '400 15px var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '8px 0 0' }">3 active · 1 draft · 0 archived</p>
          </div>
          <ZmButton variant="dark" icon="plus" size="lg">Create new skill</ZmButton>
        </div>
        <div :style="{ display: 'flex', flexDirection: 'column', gap: '16px' }">
          <CardsSkillManageCard
            v-for="s in (products ?? []).slice(0, 4)"
            :key="s.id"
            :skill="s"
            :views="0"
            :inquiries="0"
            status="Active"
          />
        </div>
      </main>
    </div>
    <div v-if="isMobile" :style="{ position: 'fixed', bottom: '24px', left: '16px', zIndex: 100 }">
      <ZmIconButton icon="menu" :size="44" @click="mobileSidebarOpen = true" />
    </div>
  </div>
</template>
