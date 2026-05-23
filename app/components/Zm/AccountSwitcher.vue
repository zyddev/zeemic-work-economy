<script setup lang="ts">
interface Business {
  id: string
  name: string
  role: string
  location: string
}

interface User {
  name: string
  handle: string
}

const props = defineProps<{
  open?: boolean
  user?: User
  businesses?: Business[]
  activeId?: string
}>()

const emit = defineEmits<{
  close: []
  switchTo: [id: string]
  createBusiness: []
  logout: []
}>()

const hoverId = ref<string | null>(null)

function onBackdropClick(e: MouseEvent) {
  if (e.target === e.currentTarget) emit('close')
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))

const personalBorder = computed(() =>
  props.activeId === 'personal'
    ? '2px solid var(--zm-ink-700)'
    : '1px solid var(--zm-border)'
)

function businessBorder(id: string) {
  return props.activeId === id
    ? '2px solid var(--zm-ink-700)'
    : '1px solid var(--zm-border)'
}
</script>

<template>
  <Teleport to="body">
    <Transition name="zm-switcher-overlay">
      <div
        v-if="open"
        style="position:fixed; inset:0; z-index:100"
        @click="onBackdropClick"
      >
        <!-- Backdrop -->
        <div style="position:absolute; inset:0; background:rgba(11,15,13,0.55); backdrop-filter:blur(8px)" />

        <!-- Panel -->
        <Transition name="zm-switcher-panel" appear>
          <div
            v-if="open"
            style="position:absolute; top:0; right:0; bottom:0; width:420px; background:var(--zm-paper); box-shadow:var(--zm-shadow-xl); overflow-y:auto; padding:22px"
            @click.stop
          >
            <!-- Header -->
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px">
              <p class="zm-eyebrow" style="margin:0">Account context</p>
              <ZmIconButton icon="close" :size="32" @click="emit('close')" />
            </div>

            <h2 style="font-family:var(--zm-font-display); font-size:28px; letter-spacing:-0.02em; margin:8px 0 18px; color:var(--zm-ink-900); font-weight:700">
              Switch account
            </h2>

            <p style="font:400 13px var(--zm-font-body); color:var(--zm-fg-muted); margin:0 0 14px">
              Choose which account context to work in. Your view and permissions will update accordingly.
            </p>

            <!-- Personal account row -->
            <div
              :style="{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px',
                background: 'var(--zm-white)',
                borderRadius: 'var(--zm-r-md)',
                border: personalBorder,
                marginBottom: '10px',
                cursor: 'pointer',
              }"
              @click="emit('switchTo', 'personal')"
            >
              <ZmAvatar :name="user?.name" :size="40" style="flex-shrink:0" />
              <div style="flex:1; min-width:0">
                <p style="margin:0 0 2px; font:600 14px var(--zm-font-body); color:var(--zm-ink-900)">{{ user?.name }}</p>
                <p style="margin:0; font:400 12px var(--zm-font-body); color:var(--zm-fg-muted)">{{ user?.handle }}</p>
              </div>
              <div v-if="activeId === 'personal'" style="display:flex; align-items:center; gap:6px; flex-shrink:0">
                <ZmBadge tone="emerald" size="sm">Active</ZmBadge>
                <ZmIcon name="check" :size="16" style="color:var(--zm-ink-700)" />
              </div>
            </div>

            <!-- Business rows -->
            <div
              v-for="b in (businesses ?? [])"
              :key="b.id"
              :style="{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px',
                background: 'var(--zm-white)',
                borderRadius: 'var(--zm-r-md)',
                border: businessBorder(b.id),
                marginBottom: '10px',
                cursor: 'pointer',
              }"
              @mouseenter="hoverId = b.id"
              @mouseleave="hoverId = null"
              @click="emit('switchTo', b.id)"
            >
              <ZmAvatar :name="b.name" :size="40" :square="true" style="flex-shrink:0" />
              <div style="flex:1; min-width:0">
                <p style="margin:0 0 2px; font:600 14px var(--zm-font-body); color:var(--zm-ink-900)">{{ b.name }}</p>
                <p style="margin:0; font:400 12px var(--zm-font-body); color:var(--zm-fg-muted)">{{ b.role }} · {{ b.location }}</p>
              </div>
              <div style="flex-shrink:0; display:flex; align-items:center; gap:6px">
                <ZmBadge v-if="activeId === b.id" tone="emerald" size="sm">Active</ZmBadge>
                <ZmIcon v-if="activeId === b.id" name="check" :size="16" style="color:var(--zm-ink-700)" />
                <span
                  v-else-if="hoverId === b.id"
                  style="font:500 12px var(--zm-font-body); color:var(--zm-ink-700)"
                >Select →</span>
              </div>
            </div>

            <!-- Create new business -->
            <button
              type="button"
              style="display:flex; align-items:center; gap:10px; padding:14px; background:transparent; border:1px dashed var(--zm-border-strong); border-radius:var(--zm-r-md); cursor:pointer; font:500 13px var(--zm-font-body); color:var(--zm-ink-700); width:100%; text-align:left; margin-top:4px"
              @click="emit('createBusiness')"
            >
              <ZmIcon name="plus" :size="18" />
              Create new business
            </button>

            <!-- Sign out -->
            <div style="margin-top:24px; padding-top:16px; border-top:1px solid var(--zm-border)">
              <button
                type="button"
                style="display:flex; align-items:center; gap:10px; padding:12px 14px; background:transparent; border:1px solid var(--zm-border); border-radius:var(--zm-r-md); cursor:pointer; font:500 13px var(--zm-font-body); color:var(--zm-coral-500, #E84A1F); width:100%; text-align:left"
                @click="emit('logout')"
              >
                <ZmIcon name="log_out" :size="16" color="var(--zm-coral-500, #E84A1F)" />
                Sign out
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.zm-switcher-overlay-enter-active,
.zm-switcher-overlay-leave-active {
  transition: opacity 280ms cubic-bezier(0.22, 1, 0.36, 1);
}
.zm-switcher-overlay-enter-from,
.zm-switcher-overlay-leave-to {
  opacity: 0;
}

.zm-switcher-panel-enter-active,
.zm-switcher-panel-leave-active {
  transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
}
.zm-switcher-panel-enter-from,
.zm-switcher-panel-leave-to {
  transform: translateX(100%);
}
.zm-switcher-panel-enter-to,
.zm-switcher-panel-leave-from {
  transform: translateX(0);
}
</style>
