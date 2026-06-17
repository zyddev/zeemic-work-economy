<script setup lang="ts">
import type { Job } from '~/types'

const props = defineProps<{
  job: Job
  loading?: boolean
}>()

const emit = defineEmits<{ apply: []; message: [] }>()

const { isAuthenticated } = storeToRefs(useAuthStore())
const { rollup, mine, load: loadRating, submit: submitRating, submitting, rateLimited } = useJobRating(computed(() => props.job.id))
const applyOpen = ref(false)

onMounted(loadRating)
watch(() => props.job.id, loadRating)

function handleApply() {
  if (!isAuthenticated.value) {
    navigateTo('/login')
    return
  }
  if (props.job.externalLink && props.job.applicationUrl) {
    window.open(props.job.applicationUrl, '_blank', 'noopener,noreferrer')
    return
  }
  applyOpen.value = true
}

const salaryText = computed(() => props.job.salary || 'Not specified')
const stars = computed(() => rollup.value ? Math.round(rollup.value.weightedAvg) : 0)

function rateJob(s: number) {
  if (mine.value) return
  submitRating(s, (props.job as any).businessId)
}
</script>

<template>
  <div>
    <!-- Loading skeleton -->
    <template v-if="loading">
      <div style="display:flex; flex-direction:column; gap:14px">
        <ZmSkeleton :height="48" radius="var(--zm-r-md)" />
        <ZmSkeleton :height="20" width="60%" />
        <ZmSkeleton :height="16" width="80%" />
        <ZmSkeleton :height="40" radius="var(--zm-r-md)" />
        <ZmSkeleton :height="40" radius="var(--zm-r-md)" />
      </div>
    </template>

    <template v-else>
      <!-- Company + Title -->
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px">
        <ZmAvatar :name="job.company" :size="44" :square="true" />
        <div>
          <div :style="{ font: '600 14px var(--zm-font-body)' }">{{ job.company }}</div>
          <div :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ job.location }}</div>
        </div>
      </div>

      <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '28px', lineHeight: '1.05', letterSpacing: '-0.02em', margin: '0 0 14px' }">
        {{ job.title }}
      </h2>

      <!-- Meta pills -->
      <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:20px">
        <ZmBadge>{{ job.type }}</ZmBadge>
        <ZmBadge tone="emerald">{{ salaryText }}</ZmBadge>
        <ZmBadge v-if="job.deadline" tone="gold">Deadline · {{ job.deadline }}</ZmBadge>
      </div>

      <!-- CTAs -->
      <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:20px">
        <ZmButton variant="dark" size="lg" :full="true" icon-right="arrow_right" @click="handleApply">
          Apply now
        </ZmButton>
        <ZmButton variant="ghost" size="md" :full="true" icon="message" @click="emit('message')">
          Message recruiter
        </ZmButton>
      </div>

      <div style="border-top:1px solid var(--zm-border); padding-top:16px; margin-bottom:20px">
        <div class="zm-eyebrow" style="margin-bottom:10px">Job details</div>
        <div style="display:flex; flex-direction:column; gap:8px">
          <div v-if="job.type" style="display:flex; justify-content:space-between; align-items:center">
            <span :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">Type</span>
            <span :style="{ font: '500 13px var(--zm-font-body)' }">{{ job.type }}</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center">
            <span :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">Location</span>
            <span :style="{ font: '500 13px var(--zm-font-body)' }">{{ job.location }}</span>
          </div>
          <div v-if="job.salary" style="display:flex; justify-content:space-between; align-items:center">
            <span :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">Salary</span>
            <span :style="{ font: '500 13px var(--zm-font-body)' }">{{ job.salary }}</span>
          </div>
          <div v-if="job.deadline" style="display:flex; justify-content:space-between; align-items:center">
            <span :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">Deadline</span>
            <span :style="{ font: '500 13px var(--zm-font-body)' }">{{ job.deadline }}</span>
          </div>
          <div v-if="job.recruiter" style="display:flex; justify-content:space-between; align-items:center">
            <span :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">Recruiter</span>
            <span :style="{ font: '500 13px var(--zm-font-body)' }">{{ job.recruiter }}</span>
          </div>
        </div>
      </div>

      <!-- Rating section -->
      <div v-if="rollup" style="border-top:1px solid var(--zm-border); padding-top:16px">
        <div class="zm-eyebrow" style="margin-bottom:10px">Recruiter rating</div>
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px">
          <span :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '32px', lineHeight: '1' }">{{ rollup.weightedAvg.toFixed(1) }}</span>
          <div>
            <ZmRating :value="rollup.weightedAvg" :count="rollup.totalRatings" />
            <div :style="{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '2px' }">{{ rollup.totalRatings }} rating{{ rollup.totalRatings === 1 ? '' : 's' }}</div>
          </div>
        </div>
        <div v-if="!mine && isAuthenticated" style="margin-top:10px">
          <div class="zm-eyebrow" style="margin-bottom:6px">Rate this recruiter</div>
          <div style="display:flex; gap:6px">
            <button
              v-for="s in 5"
              :key="s"
              type="button"
              :style="{
                background: 'none', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
                font: '20px var(--zm-font-body)', padding: '2px', opacity: submitting ? 0.5 : 1,
              }"
              @click="rateJob(s)"
            >
              ★
            </button>
          </div>
          <div v-if="rateLimited" :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-coral-500)', marginTop: '4px' }">Rate limit reached. Try again later.</div>
        </div>
        <div v-else-if="mine" :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">
          You rated this {{ mine.stars }}★
        </div>
      </div>
    </template>

    <!-- Application form modal -->
    <JobZmJobApplicationForm
      :open="applyOpen"
      :job-id="job.id"
      :job-title="job.title"
      :job-company="job.company"
      @close="applyOpen = false"
      @submitted="applyOpen = false"
    />
  </div>
</template>
