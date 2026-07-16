<script setup lang="ts">
/**
 * Page-number pagination — variants: 'full' (results summary + per-page + nav),
 * 'compact' (nav only), 'numberless' (Page X of Y, for very large/unknown counts).
 * Requires a known `total` page count — for cursor-paginated lists without a
 * total, use ZmLoadMore instead.
 */
const props = withDefaults(defineProps<{
  current: number
  total: number
  perPage?: number
  count?: number | null
  perPageOptions?: number[]
  showPerPage?: boolean
  variant?: 'full' | 'compact' | 'numberless'
  jumpEnds?: boolean
  small?: boolean
}>(), {
  perPage: 12,
  count: null,
  perPageOptions: () => [12, 24, 48],
  showPerPage: false,
  variant: 'full',
  jumpEnds: true,
  small: false,
})

const emit = defineEmits<{
  change: [page: number]
  'update:perPage': [n: number]
}>()

function pageList(current: number, total: number, siblings = 1): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const left = Math.max(current - siblings, 1)
  const right = Math.min(current + siblings, total)
  const out: (number | '…')[] = [1]
  if (left > 2) out.push('…')
  for (let p = Math.max(left, 2); p <= Math.min(right, total - 1); p++) out.push(p)
  if (right < total - 1) out.push('…')
  out.push(total)
  return out
}

const pages = computed(() => pageList(props.current, props.total, props.small ? 0 : 1))
const from = computed(() => (props.count != null ? (props.current - 1) * props.perPage + 1 : null))
const to = computed(() => (props.count != null ? Math.min(props.current * props.perPage, props.count) : null))

function go(p: number) {
  if (p >= 1 && p <= props.total && p !== props.current) emit('change', p)
}

const btnSize = computed(() => (props.small ? 32 : 38))
function btnStyle(active: boolean, disabled: boolean) {
  const s = btnSize.value
  return {
    minWidth: `${s}px`, height: `${s}px`, padding: '0 10px',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 'var(--zm-r-md)',
    font: `${active ? 600 : 500} ${props.small ? 12.5 : 13.5}px var(--zm-font-body)`,
    fontVariantNumeric: 'tabular-nums' as const,
    cursor: disabled ? 'default' : 'pointer',
    transition: 'background .12s, border-color .12s, color .12s',
    userSelect: 'none' as const,
    border: active ? '1px solid var(--zm-ink-900)' : '1px solid var(--zm-border)',
    background: active ? 'var(--zm-ink-900)' : 'var(--zm-white)',
    color: active ? 'var(--zm-paper)' : (disabled ? 'var(--zm-grey-400)' : 'var(--zm-ink-950)'),
  }
}
function onEnter(e: MouseEvent, active: boolean, disabled: boolean) {
  if (active || disabled) return
  const el = e.currentTarget as HTMLElement
  el.style.background = 'var(--zm-paper-2)'
  el.style.borderColor = 'var(--zm-border-strong)'
}
function onLeave(e: MouseEvent, active: boolean, disabled: boolean) {
  if (active || disabled) return
  const el = e.currentTarget as HTMLElement
  el.style.background = 'var(--zm-white)'
  el.style.borderColor = 'var(--zm-border)'
}
</script>

<template>
  <div :style="{ display: 'flex', alignItems: 'center', justifyContent: variant === 'compact' ? 'flex-start' : 'space-between', gap: '20px', flexWrap: 'wrap' }">
    <div v-if="variant === 'full'" :style="{ display: 'flex', alignItems: 'center', gap: '18px' }">
      <span v-if="count != null" :style="{ font: '400 13.5px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">
        <span class="zm-num-tab" :style="{ color: 'var(--zm-ink-950)', fontWeight: '600' }">{{ from!.toLocaleString() }}–{{ to!.toLocaleString() }}</span> of <span class="zm-num-tab">{{ count!.toLocaleString() }}</span>
      </span>
      <label v-if="showPerPage" :style="{ display: 'flex', alignItems: 'center', gap: '8px', font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">
        Per page
        <span style="position:relative;display:inline-flex;align-items:center">
          <select
            :value="perPage"
            :style="{ appearance: 'none', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)', background: 'var(--zm-white)', color: 'var(--zm-ink-950)', font: '500 13px var(--zm-font-body)', padding: '7px 30px 7px 12px', cursor: 'pointer' }"
            @change="emit('update:perPage', Number(($event.target as HTMLSelectElement).value))"
          >
            <option v-for="o in perPageOptions" :key="o" :value="o">{{ o }}</option>
          </select>
          <span style="position:absolute;right:9px;pointer-events:none">
            <ZmIcon name="chevron_down" :size="15" color="var(--zm-fg-muted)" />
          </span>
        </span>
      </label>
    </div>

    <nav aria-label="Pagination" style="display:flex;align-items:center;gap:6px">
      <button
        v-if="jumpEnds && !small"
        type="button" aria-label="First page" :disabled="current === 1"
        :style="btnStyle(false, current === 1)"
        @mouseenter="onEnter($event, false, current === 1)" @mouseleave="onLeave($event, false, current === 1)"
        @click="go(1)"
      >
        <ZmIcon name="chevrons_left" :size="16" :color="current === 1 ? 'var(--zm-grey-400)' : 'var(--zm-ink-900)'" />
      </button>

      <button
        type="button" aria-label="Previous page" :disabled="current === 1"
        :style="btnStyle(false, current === 1)"
        @mouseenter="onEnter($event, false, current === 1)" @mouseleave="onLeave($event, false, current === 1)"
        @click="go(current - 1)"
      >
        <ZmIcon name="chevron_left" :size="16" :color="current === 1 ? 'var(--zm-grey-400)' : 'var(--zm-ink-900)'" />
      </button>

      <span v-if="variant === 'numberless'" class="zm-num-tab" :style="{ padding: '0 14px', font: '500 13.5px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">
        Page <strong :style="{ color: 'var(--zm-ink-950)' }">{{ current }}</strong> of {{ total }}
      </span>
      <template v-else>
        <template v-for="(p, i) in pages" :key="p === '…' ? `e${i}` : p">
          <span
            v-if="p === '…'"
            aria-hidden="true"
            :style="{ minWidth: small ? '24px' : '30px', textAlign: 'center', color: 'var(--zm-grey-400)', font: '500 14px var(--zm-font-body)', userSelect: 'none' }"
          >…</span>
          <button
            v-else
            type="button" :aria-label="`Page ${p}`" :aria-current="p === current ? 'page' : undefined"
            :style="btnStyle(p === current, false)"
            @mouseenter="onEnter($event, p === current, false)" @mouseleave="onLeave($event, p === current, false)"
            @click="go(p)"
          >{{ p }}</button>
        </template>
      </template>

      <button
        type="button" aria-label="Next page" :disabled="current === total"
        :style="btnStyle(false, current === total)"
        @mouseenter="onEnter($event, false, current === total)" @mouseleave="onLeave($event, false, current === total)"
        @click="go(current + 1)"
      >
        <ZmIcon name="chevron_right" :size="16" :color="current === total ? 'var(--zm-grey-400)' : 'var(--zm-ink-900)'" />
      </button>

      <button
        v-if="jumpEnds && !small"
        type="button" aria-label="Last page" :disabled="current === total"
        :style="btnStyle(false, current === total)"
        @mouseenter="onEnter($event, false, current === total)" @mouseleave="onLeave($event, false, current === total)"
        @click="go(total)"
      >
        <ZmIcon name="chevrons_right" :size="16" :color="current === total ? 'var(--zm-grey-400)' : 'var(--zm-ink-900)'" />
      </button>
    </nav>
  </div>
</template>
