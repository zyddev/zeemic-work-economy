<script setup lang="ts">
/**
 * Progressive-disclosure "load more" control — for cursor-paginated or feed-style
 * lists where a total page count isn't known up front. Pairs with ZmPagination's
 * 'full'/'compact'/'numberless' variants, which need a known total instead.
 */
const props = defineProps<{
  loading?: boolean
  hasMore: boolean
  shown?: number
  total?: number | null
}>()

defineEmits<{ 'load-more': [] }>()

const progressPct = computed(() => {
  if (!props.total || !props.shown) return 0
  return Math.min(100, (props.shown / props.total) * 100)
})
</script>

<template>
  <div style="display:flex;flex-direction:column;align-items:center;gap:10px">
    <div v-if="total" style="width:100%;max-width:240px;height:4px;border-radius:999px;background:var(--zm-border);overflow:hidden">
      <div :style="{ width: `${progressPct}%`, height: '100%', background: 'var(--zm-ink-900)', transition: 'width .3s' }" />
    </div>

    <span v-if="shown != null" :style="{ font: '400 12.5px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">
      Showing <span class="zm-num-tab" :style="{ color: 'var(--zm-ink-950)', fontWeight: '600' }">{{ shown.toLocaleString() }}</span>
      <template v-if="total"> of <span class="zm-num-tab">{{ total.toLocaleString() }}</span></template>
    </span>

    <ZmButton v-if="hasMore" variant="secondary" icon="plus" :loading="loading" @click="$emit('load-more')">
      Load more
    </ZmButton>
    <span v-else-if="shown" :style="{ font: '500 12.5px var(--zm-font-body)', color: 'var(--zm-fg-muted)', padding: '10px 0' }">
      You've reached the end
    </span>
  </div>
</template>
