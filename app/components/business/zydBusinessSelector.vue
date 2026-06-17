<script setup lang="ts">
interface BusinessOption {
  label: string
  value: string
  logoUrl?: string | null
}

const props = defineProps<{
  businesses: BusinessOption[]
  isLoading?: boolean
}>()

const emit = defineEmits<{
  select: [id: string]
  'create-new': []
  refresh: []
}>()

function initials(name: string) {
  return name.slice(0, 2).toUpperCase()
}
</script>

<template>
  <div>
    <!-- Loading skeleton -->
    <template v-if="isLoading">
      <div :style="{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }">
        <div v-for="i in 3" :key="i" :style="{ height: '52px', borderRadius: 'var(--zm-r-md)', background: 'var(--zm-paper-2)', animation: 'pulse 1.4s ease-in-out infinite' }" />
      </div>
      <ZmButton variant="secondary" disabled icon="plus" style="width:100%">Create new</ZmButton>
    </template>

    <!-- Empty state -->
    <template v-else-if="businesses.length === 0">
      <div :style="{ textAlign: 'center', padding: '24px 0 20px', color: 'var(--zm-fg-muted)', font: '400 14px var(--zm-font-body)' }">
        You are not assigned to any businesses yet.
      </div>
      <ZmButton variant="dark" icon="plus" style="width:100%" @click="emit('create-new')">Create new business</ZmButton>
    </template>

    <!-- Business list -->
    <template v-else>
      <div :style="{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }">
        <button
          v-for="biz in businesses"
          :key="biz.value"
          :style="{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 16px', width: '100%', textAlign: 'left',
            background: 'var(--zm-paper-2)', border: '1px solid var(--zm-border)',
            borderRadius: 'var(--zm-r-md)', cursor: 'pointer',
            font: '500 14px var(--zm-font-body)', color: 'var(--zm-ink-950)',
            transition: 'border-color 0.15s',
          }"
          @click="emit('select', biz.value)"
          @mouseenter="(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--zm-ink-400)')"
          @mouseleave="(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--zm-border)')"
        >
          <div
            v-if="!biz.logoUrl"
            :style="{
              width: '36px', height: '36px', borderRadius: 'var(--zm-r-sm)',
              background: 'var(--zm-ink-900)', color: 'var(--zm-fg-on-dark)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              font: '600 13px var(--zm-font-display)', flexShrink: '0',
            }"
          >{{ initials(biz.label) }}</div>
          <img
            v-else
            :src="biz.logoUrl"
            :alt="biz.label"
            :style="{ width: '36px', height: '36px', borderRadius: 'var(--zm-r-sm)', objectFit: 'cover', flexShrink: '0' }"
          />
          <span style="flex:1">{{ biz.label }}</span>
          <ZmIcon name="chevron_right" :size="16" color="var(--zm-fg-muted)" />
        </button>
      </div>
      <ZmButton variant="secondary" icon="plus" style="width:100%" @click="emit('create-new')">Create new business</ZmButton>
    </template>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50%       { opacity: 0.3; }
}
</style>
