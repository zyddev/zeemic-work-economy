<script setup lang="ts">
const props = defineProps<{
  name: string
  size?: number
  color?: string
  stroke?: number
}>()
const size = computed(() => props.size ?? 18)
const color = computed(() => props.color ?? 'currentColor')
const stroke = computed(() => props.stroke ?? 1.6)
const P = computed(() => ({ stroke: color.value, strokeWidth: stroke.value, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' }))
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" style="flex-shrink:0">
    <template v-if="name === 'search'">
      <circle cx="11" cy="11" r="7" v-bind="P" /><path d="M21 21l-4.3-4.3" v-bind="P" />
    </template>
    <template v-else-if="name === 'bell'">
      <path d="M6 8a6 6 0 1112 0c0 7 3 9 3 9H3s3-2 3-9z" v-bind="P" /><path d="M10 21a2 2 0 004 0" v-bind="P" />
    </template>
    <template v-else-if="name === 'chevron_down'"><path d="M6 9l6 6 6-6" v-bind="P" /></template>
    <template v-else-if="name === 'chevron_right'"><path d="M9 6l6 6-6 6" v-bind="P" /></template>
    <template v-else-if="name === 'chevron_left'"><path d="M15 6l-6 6 6 6" v-bind="P" /></template>
    <template v-else-if="name === 'arrow_right'">
      <path d="M5 12h14" v-bind="P" /><path d="M13 5l7 7-7 7" v-bind="P" />
    </template>
    <template v-else-if="name === 'arrow_up_right'">
      <path d="M7 17L17 7" v-bind="P" /><path d="M8 7h9v9" v-bind="P" />
    </template>
    <template v-else-if="name === 'plus'">
      <path d="M12 5v14" v-bind="P" /><path d="M5 12h14" v-bind="P" />
    </template>
    <template v-else-if="name === 'close'">
      <path d="M6 6l12 12" v-bind="P" /><path d="M18 6L6 18" v-bind="P" />
    </template>
    <template v-else-if="name === 'check'"><path d="M4 12l5 5 11-12" v-bind="P" /></template>
    <template v-else-if="name === 'star_fill'">
      <path d="M12 2.5l3 6.6 7.3.7-5.5 4.9 1.6 7.1L12 17.9l-6.4 3.9 1.6-7.1L1.7 9.8l7.3-.7z" :fill="color" stroke="none" />
    </template>
    <template v-else-if="name === 'star'">
      <path d="M12 2.5l3 6.6 7.3.7-5.5 4.9 1.6 7.1L12 17.9l-6.4 3.9 1.6-7.1L1.7 9.8l7.3-.7z" v-bind="P" />
    </template>
    <template v-else-if="name === 'heart'">
      <path d="M20.8 8.6c0-3-2.4-4.6-4.7-4.6-1.7 0-3.2.9-4.1 2.4-.9-1.5-2.4-2.4-4.1-2.4-2.3 0-4.7 1.6-4.7 4.6 0 5.5 8.8 11 8.8 11s8.8-5.5 8.8-11z" v-bind="P" />
    </template>
    <template v-else-if="name === 'briefcase'">
      <rect x="3" y="7" width="18" height="13" rx="2" v-bind="P" /><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" v-bind="P" /><path d="M3 12h18" v-bind="P" />
    </template>
    <template v-else-if="name === 'wrench'"><path d="M14.7 6.3a4 4 0 005.5 5.5l-9 9-4.5-1-1-4.5 9-9z" v-bind="P" /></template>
    <template v-else-if="name === 'users'">
      <circle cx="9" cy="8" r="4" v-bind="P" /><path d="M2 21c0-3.5 3-6 7-6s7 2.5 7 6" v-bind="P" /><circle cx="17" cy="7" r="3" v-bind="P" /><path d="M22 19c0-2.5-2-4.5-5-4.5" v-bind="P" />
    </template>
    <template v-else-if="name === 'user'">
      <circle cx="12" cy="8" r="4" v-bind="P" /><path d="M4 21c0-4 4-7 8-7s8 3 8 7" v-bind="P" />
    </template>
    <template v-else-if="name === 'building'">
      <rect x="4" y="3" width="16" height="18" rx="1" v-bind="P" /><path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h2M13 16h2" v-bind="P" />
    </template>
    <template v-else-if="name === 'grid'">
      <rect x="3" y="3" width="7" height="7" v-bind="P" /><rect x="14" y="3" width="7" height="7" v-bind="P" /><rect x="3" y="14" width="7" height="7" v-bind="P" /><rect x="14" y="14" width="7" height="7" v-bind="P" />
    </template>
    <template v-else-if="name === 'inbox'">
      <path d="M3 13l3-8h12l3 8" v-bind="P" /><path d="M3 13h6l1 3h4l1-3h6v7H3z" v-bind="P" />
    </template>
    <template v-else-if="name === 'message'">
      <path d="M21 12c0 4.4-4 8-9 8-1.5 0-3-.3-4.3-.9L3 21l1.2-4.4C3.4 15.2 3 13.6 3 12c0-4.4 4-8 9-8s9 3.6 9 8z" v-bind="P" />
    </template>
    <template v-else-if="name === 'file_text'">
      <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z" v-bind="P" /><path d="M14 3v6h6M8 13h8M8 17h6M8 9h2" v-bind="P" />
    </template>
    <template v-else-if="name === 'download'">
      <path d="M12 3v13" v-bind="P" /><path d="M7 12l5 5 5-5" v-bind="P" /><path d="M5 21h14" v-bind="P" />
    </template>
    <template v-else-if="name === 'calendar'">
      <rect x="3" y="5" width="18" height="16" rx="2" v-bind="P" /><path d="M3 10h18M8 3v4M16 3v4" v-bind="P" />
    </template>
    <template v-else-if="name === 'map_pin'">
      <path d="M12 21s-7-6-7-12a7 7 0 1114 0c0 6-7 12-7 12z" v-bind="P" /><circle cx="12" cy="9" r="2.5" v-bind="P" />
    </template>
    <template v-else-if="name === 'globe'">
      <circle cx="12" cy="12" r="9" v-bind="P" /><path d="M3 12h18M12 3a13 13 0 010 18M12 3a13 13 0 000 18" v-bind="P" />
    </template>
    <template v-else-if="name === 'filter'"><path d="M3 5h18l-7 9v6l-4-2v-4z" v-bind="P" /></template>
    <template v-else-if="name === 'sort'"><path d="M3 6h18M6 12h12M10 18h4" v-bind="P" /></template>
    <template v-else-if="name === 'menu'"><path d="M3 6h18M3 12h18M3 18h18" v-bind="P" /></template>
    <template v-else-if="name === 'settings'">
      <circle cx="12" cy="12" r="3" v-bind="P" /><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" v-bind="P" />
    </template>
    <template v-else-if="name === 'bookmark'"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l7-4z" v-bind="P" /></template>
    <template v-else-if="name === 'sparkles'">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" v-bind="P" />
    </template>
    <template v-else-if="name === 'trending'">
      <path d="M3 17l6-6 4 4 8-9" v-bind="P" /><path d="M14 6h7v7" v-bind="P" />
    </template>
    <template v-else-if="name === 'chart_bar'">
      <path d="M3 21h18" v-bind="P" /><rect x="6" y="10" width="3" height="8" v-bind="P" /><rect x="11" y="6" width="3" height="12" v-bind="P" /><rect x="16" y="13" width="3" height="5" v-bind="P" />
    </template>
    <template v-else-if="name === 'eye'">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" v-bind="P" /><circle cx="12" cy="12" r="3" v-bind="P" />
    </template>
    <template v-else-if="name === 'dot'"><circle cx="12" cy="12" r="3" :fill="color" stroke="none" /></template>
    <template v-else-if="name === 'paperclip'"><path d="M21 12l-9 9a5 5 0 01-7-7l9-9a3.5 3.5 0 015 5l-9 9a2 2 0 01-3-3l8-8" v-bind="P" /></template>
    <template v-else-if="name === 'send'">
      <path d="M22 2L11 13" v-bind="P" /><path d="M22 2l-7 20-4-9-9-4z" v-bind="P" />
    </template>
    <template v-else-if="name === 'more'">
      <circle cx="5" cy="12" r="1.5" :fill="color" stroke="none" /><circle cx="12" cy="12" r="1.5" :fill="color" stroke="none" /><circle cx="19" cy="12" r="1.5" :fill="color" stroke="none" />
    </template>
    <template v-else-if="name === 'badge_check'">
      <path d="M12 2l2.4 2 3.1-.4.6 3 2.6 1.7-1.2 2.9 1.2 2.9-2.6 1.7-.6 3-3.1-.4L12 22l-2.4-2-3.1.4-.6-3L3.3 15.7l1.2-2.9L3.3 9.9l2.6-1.7.6-3 3.1.4z" v-bind="P" /><path d="M8.5 12.5l2.5 2.5 4.5-5" v-bind="P" />
    </template>
    <template v-else-if="name === 'layers'">
      <path d="M12 2L2 7l10 5 10-5z" v-bind="P" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" v-bind="P" />
    </template>
    <template v-else-if="name === 'play'"><path d="M5 3l14 9-14 9z" :fill="color" stroke="none" /></template>
    <template v-else-if="name === 'external'">
      <path d="M15 3h6v6M21 3l-9 9M10 5H5a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5" v-bind="P" />
    </template>
    <template v-else-if="name === 'target'">
      <circle cx="12" cy="12" r="9" v-bind="P" /><circle cx="12" cy="12" r="5" v-bind="P" /><circle cx="12" cy="12" r="1.5" :fill="color" stroke="none" />
    </template>
    <template v-else-if="name === 'bolt'"><path d="M13 2L3 14h8l-2 8 10-12h-8z" v-bind="P" /></template>
    <template v-else-if="name === 'image'">
      <rect x="3" y="4" width="18" height="16" rx="2" v-bind="P" /><circle cx="9" cy="10" r="2" v-bind="P" /><path d="M21 16l-5-5-9 9" v-bind="P" />
    </template>
    <template v-else-if="name === 'upload'">
      <path d="M12 16V4" v-bind="P" /><path d="M7 9l5-5 5 5" v-bind="P" /><path d="M5 21h14" v-bind="P" />
    </template>
    <template v-else-if="name === 'alert_circle'">
      <circle cx="12" cy="12" r="9" v-bind="P" /><path d="M12 8v4M12 16h.01" v-bind="P" />
    </template>
    <template v-else-if="name === 'alert_triangle'">
      <path d="M10.3 3.3L2.2 17A2 2 0 004 20h16a2 2 0 001.7-3L13.7 3.3a2 2 0 00-3.4 0z" v-bind="P" /><path d="M12 9v4M12 17h.01" v-bind="P" />
    </template>
    <template v-else-if="name === 'info'">
      <circle cx="12" cy="12" r="9" v-bind="P" /><path d="M12 16v-4M12 8h.01" v-bind="P" />
    </template>
    <template v-else-if="name === 'lock'">
      <rect x="5" y="11" width="14" height="10" rx="2" v-bind="P" /><path d="M8 11V7a4 4 0 018 0v4" v-bind="P" />
    </template>
    <template v-else-if="name === 'eye_off'">
      <path d="M17.9 17.4C16.4 18.4 14.3 19 12 19c-5.5 0-10-4-10-7 0-1.6.9-3.1 2.3-4.3M6.5 6.5A9.3 9.3 0 0112 5c5.5 0 10 3.6 10 7 0 1.4-.6 2.8-1.7 3.9M3 3l18 18" v-bind="P" />
    </template>
    <template v-else-if="name === 'mail'">
      <rect x="3" y="5" width="18" height="14" rx="2" v-bind="P" /><path d="M3 7l9 6 9-6" v-bind="P" />
    </template>
    <template v-else-if="name === 'link'">
      <path d="M10 14a5 5 0 007.1 0l3-3a5 5 0 00-7.1-7.1l-1.5 1.5" v-bind="P" /><path d="M14 10a5 5 0 00-7.1 0l-3 3a5 5 0 007.1 7.1l1.5-1.5" v-bind="P" />
    </template>
    <template v-else><circle cx="12" cy="12" r="3" :fill="color" stroke="none" /></template>
  </svg>
</template>
