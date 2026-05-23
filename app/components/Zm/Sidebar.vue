<script setup lang="ts">
import type { SidebarItem } from '~/types'
defineProps<{ items: SidebarItem[]; active?: string; width?: number }>()
</script>
<template>
  <aside :style="{ width: `${width ?? 240}px`, flexShrink: '0', background: 'var(--zm-paper)', borderRight: '1px solid var(--zm-border)', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '4px', minHeight: '0' }">
    <slot name="header" />
    <div :style="{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '16px' }">
      <template v-for="(it, i) in items" :key="i">
        <div v-if="it.section" class="zm-eyebrow" :style="{ padding: '14px 12px 6px', fontSize: '10px' }">{{ it.section }}</div>
        <NuxtLink v-else :to="`#${it.id}`" :style="{
          display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'space-between',
          padding: '8px 12px', borderRadius: 'var(--zm-r-sm)', cursor: 'pointer',
          background: active === it.id ? 'var(--zm-ink-900)' : 'transparent',
          color: active === it.id ? 'var(--zm-paper)' : 'var(--zm-ink-900)',
          font: (active === it.id ? '600' : '500') + ' 14px var(--zm-font-body)',
          textDecoration: 'none',
          marginLeft: it.indent ? '16px' : '0',
        }">
          <span :style="{ display: 'inline-flex', alignItems: 'center', gap: '12px' }">
            <ZmIcon v-if="it.icon" :name="it.icon" :size="16" :color="active === it.id ? 'var(--zm-paper)' : 'var(--zm-fg-muted)'" />
            {{ it.label }}
          </span>
          <span v-if="it.count != null" :style="{
            font: '600 11px var(--zm-font-body)',
            background: active === it.id ? 'rgba(245,241,232,0.18)' : 'var(--zm-ink-100)',
            color: active === it.id ? 'var(--zm-paper)' : 'var(--zm-ink-700)',
            padding: '1px 7px', borderRadius: 'var(--zm-r-full)',
          }">{{ it.count }}</span>
        </NuxtLink>
      </template>
    </div>
    <div style="flex:1" />
    <slot name="footer" />
  </aside>
</template>
