<script setup lang="ts">
const props = defineProps<{
  businessId: string
  business?: any
}>()

const loading = ref(false)
const members = ref<any[]>([])

onMounted(async () => {
  loading.value = true
  try {
    const res = await $fetch<any>(`/api/business/account/${props.businessId}`, { credentials: 'include' })
    const data = res?.data ?? res
    members.value = data?.members ?? []
  } catch {
    members.value = []
  } finally {
    loading.value = false
  }
})

const ROLE_TONE: Record<string, string> = {
  OWNER: 'var(--zm-gold-600)',
  ADMIN: 'var(--zm-ink-700)',
  MEMBER: 'var(--zm-fg-muted)',
}
</script>

<template>
  <div :style="{ padding: '32px 40px' }">
    <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }">
      <div>
        <div class="zm-eyebrow">{{ business?.name ?? 'Business' }}</div>
        <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '40px', lineHeight: '1', letterSpacing: '-0.025em', margin: '8px 0 0' }">Team</h1>
      </div>
      <NuxtLink :to="`/b/${businessId}/team`">
        <ZmButton variant="secondary" icon="users">Manage team</ZmButton>
      </NuxtLink>
    </div>

    <div v-if="loading" :style="{ display: 'flex', justifyContent: 'center', padding: '60px 0' }">
      <ZmSpinner :size="24" color="var(--zm-ink-700)" />
    </div>

    <div
      v-else-if="members.length === 0"
      :style="{ textAlign: 'center', padding: '60px 0', color: 'var(--zm-fg-muted)', font: '400 15px var(--zm-font-body)' }"
    >
      <ZmIcon name="users" :size="32" color="var(--zm-border-strong)" style="margin-bottom:12px;display:block;margin-inline:auto" />
      No team members yet.
    </div>

    <div
      v-else
      :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', overflow: 'hidden' }"
    >
      <div
        v-for="(m, i) in members"
        :key="m.id ?? i"
        :style="{
          display: 'grid', gridTemplateColumns: '40px 1fr 100px 60px',
          gap: '14px', padding: '12px 20px', alignItems: 'center',
          borderBottom: i < members.length - 1 ? '1px solid var(--zm-border)' : 'none',
        }"
      >
        <ZmAvatar :name="m.name ?? m.firstName ?? '?'" :size="32" :src="m.image ?? m.profilePicture" />
        <div>
          <div :style="{ font: '600 14px var(--zm-font-body)' }">{{ m.name ?? `${m.firstName ?? ''} ${m.lastName ?? ''}`.trim() }}</div>
          <div :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ m.username ? `@${m.username}` : m.email ?? '' }}</div>
        </div>
        <div :style="{ font: '500 12px var(--zm-font-body)', color: ROLE_TONE[m.role] ?? 'var(--zm-fg-muted)' }">
          {{ m.role ?? 'MEMBER' }}
        </div>
        <ZmIconButton icon="more" :size="28" />
      </div>
    </div>
  </div>
</template>
