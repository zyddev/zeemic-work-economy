<script setup lang="ts">
defineProps<{
  people?: Array<{ name: string; src?: string } | string>
  size?: number
  max?: number
}>()
</script>

<template>
  <div style="display:inline-flex">
    <div
      v-for="(p, i) in (people ?? []).slice(0, max ?? 4)"
      :key="i"
      :style="{ marginLeft: i === 0 ? '0' : `-${(size ?? 28) * 0.34}px`, border: '2px solid var(--zm-paper)', borderRadius: '50%' }"
    >
      <ZmAvatar :name="typeof p === 'string' ? p : p.name" :src="typeof p === 'string' ? undefined : p.src" :size="size ?? 28" />
    </div>
    <div
      v-if="(people?.length ?? 0) > (max ?? 4)"
      :style="{
        marginLeft: `-${(size ?? 28) * 0.34}px`,
        width: `${size ?? 28}px`, height: `${size ?? 28}px`,
        borderRadius: '50%', border: '2px solid var(--zm-paper)',
        background: 'var(--zm-ink-100)', color: 'var(--zm-ink-700)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: `${Math.round((size ?? 28) * 0.34)}px`, fontWeight: '600',
      }"
    >+{{ (people?.length ?? 0) - (max ?? 4) }}</div>
  </div>
</template>
