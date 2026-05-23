<script setup lang="ts">
const props = defineProps<{ category?: string; title?: string; motif?: number; height?: number }>()

const VISUALS: Record<string, { bg: string; fg: string; accent: string }> = {
  Design:      { bg: '#1A4D3A', fg: '#F5F1E8', accent: '#F2C94C' },
  Development: { bg: '#11211A', fg: '#F5F1E8', accent: '#F2C94C' },
  Marketing:   { bg: '#E84A1F', fg: '#F5F1E8', accent: '#FDF6DF' },
  Legal:       { bg: '#1E4B68', fg: '#F5F1E8', accent: '#F2C94C' },
  Finance:     { bg: '#2B7A4B', fg: '#F5F1E8', accent: '#F2C94C' },
  Consulting:  { bg: '#7A4E2D', fg: '#F5F1E8', accent: '#F2C94C' },
  Engineering: { bg: '#163524', fg: '#F5F1E8', accent: '#F2C94C' },
  Data:        { bg: '#2E2E2A', fg: '#F2C94C', accent: '#F5F1E8' },
  HR:          { bg: '#6B3A6B', fg: '#F5F1E8', accent: '#F2C94C' },
  Writing:     { bg: '#EDE7D8', fg: '#11211A', accent: '#1A4D3A' },
  Education:   { bg: '#F2C94C', fg: '#11211A', accent: '#1A4D3A' },
  Other:       { bg: '#5F5F58', fg: '#F5F1E8', accent: '#F2C94C' },
}

const v = computed(() => VISUALS[props.category ?? 'Design'] ?? VISUALS.Design)
const m = computed(() => (props.motif ?? 0) % 4)
const h = computed(() => props.height ?? 140)
</script>
<template>
  <div :style="{ position: 'relative', height: `${h}px`, overflow: 'hidden', background: v.bg, color: v.fg }">
    <svg width="100%" height="100%" viewBox="0 0 300 140" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0">
      <template v-if="m === 0">
        <circle cx="240" cy="40" r="50" :fill="v.accent" opacity="0.85" />
        <circle cx="240" cy="40" r="30" :fill="v.bg" />
        <circle cx="240" cy="40" r="12" :fill="v.accent" />
      </template>
      <template v-else-if="m === 1">
        <path d="M-20 110 Q80 40 200 90 T340 70 L340 160 L-20 160 Z" :fill="v.accent" opacity="0.9" />
        <path d="M-20 130 Q100 70 220 110 T340 100 L340 160 L-20 160 Z" :fill="v.fg" opacity="0.2" />
      </template>
      <template v-else-if="m === 2">
        <rect x="180" y="-20" width="180" height="180" :fill="v.accent" transform="rotate(18 270 70)" opacity="0.85" />
        <rect x="200" y="0" width="140" height="140" :fill="v.bg" transform="rotate(18 270 70)" />
        <rect x="220" y="20" width="100" height="100" :fill="v.accent" transform="rotate(18 270 70)" opacity="0.55" />
      </template>
      <template v-else>
        <line v-for="i in 8" :key="i" :x1="20 + (i-1)*36" y1="0" :x2="(i-1)*36" y2="140" :stroke="v.accent" stroke-width="2" fill="none" opacity="0.7" />
        <circle cx="80" cy="80" r="40" :fill="v.accent" />
        <circle cx="80" cy="80" r="22" :fill="v.bg" />
      </template>
    </svg>
    <div :style="{ position: 'absolute', top: '12px', left: '14px', font: '500 11px var(--zm-font-body)', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: '0.85' }">{{ category }}</div>
    <div v-if="title" :style="{ position: 'absolute', left: '14px', right: '14px', bottom: '12px', fontFamily: 'var(--zm-font-display)', fontSize: '22px', lineHeight: '1.05', letterSpacing: '-0.02em' }">{{ title }}</div>
  </div>
</template>
