<script setup lang="ts">
defineProps<{
  skill: {
    id: string | number
    title: string
    category: string
    motif?: number
    seller: string
    isBusiness?: boolean
    price?: number
    unit?: string
    rating?: number
  }
}>()
</script>

<template>
  <NuxtLink :to="`/skills/${skill.id}`" style="text-decoration:none;color:inherit">
    <div :style="{
      width: '240px', flexShrink: 0, background: 'var(--zm-white)',
      border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)',
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
    }">
      <ZmSkillThumb :category="skill.category" :motif="skill.motif ?? 0" :height="120" />
      <div :style="{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }">
        <div :style="{ font: '600 14px/1.25 var(--zm-font-body)', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }">{{ skill.title }}</div>
        <div :style="{ display: 'flex', alignItems: 'center', gap: '6px' }">
          <ZmAvatar :name="skill.seller" :size="18" :square="skill.isBusiness" />
          <span :style="{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">{{ skill.seller }}</span>
        </div>
        <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }">
          <span :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '18px', letterSpacing: '-0.015em' }" class="zm-num-tab">
            {{ skill.price ? `$${skill.price.toLocaleString()}` : 'RFQ' }}<span :style="{ color: 'var(--zm-fg-muted)', fontSize: '10px', fontFamily: 'var(--zm-font-body)' }">{{ skill.unit }}</span>
          </span>
          <ZmRating :value="skill.rating ?? 0" :size="11" />
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
