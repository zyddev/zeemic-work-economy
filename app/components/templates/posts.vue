<script setup lang="ts">
const props = defineProps<{
  businessId: string
  business?: any
}>()

const loading = ref(false)
const posts = ref<any[]>([])

onMounted(async () => {
  loading.value = true
  try {
    const res = await $fetch<any>(`/api/post?businessId=${props.businessId}`, { credentials: 'include' })
    posts.value = res?.data?.posts ?? res?.data ?? res?.posts ?? []
  } catch {
    posts.value = []
  } finally {
    loading.value = false
  }
})

function formatDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div :style="{ padding: '32px 40px' }">
    <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }">
      <div>
        <div class="zm-eyebrow">{{ business?.name ?? 'Business' }}</div>
        <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '40px', lineHeight: '1', letterSpacing: '-0.025em', margin: '8px 0 0' }">Posts</h1>
      </div>
      <ZmButton variant="dark" icon="plus">New post</ZmButton>
    </div>

    <div v-if="loading" :style="{ display: 'flex', justifyContent: 'center', padding: '60px 0' }">
      <ZmSpinner :size="24" color="var(--zm-ink-700)" />
    </div>

    <div
      v-else-if="posts.length === 0"
      :style="{ textAlign: 'center', padding: '60px 0', color: 'var(--zm-fg-muted)', font: '400 15px var(--zm-font-body)' }"
    >
      <ZmIcon name="file_text" :size="32" color="var(--zm-border-strong)" style="margin-bottom:12px;display:block;margin-inline:auto" />
      No posts published yet.
    </div>

    <div
      v-else
      :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', overflow: 'hidden' }"
    >
      <div
        v-for="(post, i) in posts"
        :key="post.id"
        :style="{
          display: 'grid', gridTemplateColumns: '1fr 140px 60px',
          gap: '16px', padding: '14px 20px', alignItems: 'center',
          borderBottom: i < posts.length - 1 ? '1px solid var(--zm-border)' : 'none',
        }"
      >
        <div>
          <div :style="{ font: '600 14px var(--zm-font-body)' }">{{ post.title ?? '(Untitled post)' }}</div>
          <div :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '2px' }">
            {{ post.type ?? 'Post' }}
          </div>
        </div>
        <div :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ formatDate(post.createdAt) }}</div>
        <ZmIconButton icon="more" :size="28" />
      </div>
    </div>
  </div>
</template>
