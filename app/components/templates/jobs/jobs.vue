<script setup lang="ts">
import type { JobIType } from '~/types'

const props = defineProps<{
  businessId: string
  business?: any
}>()

const { fetchJobsForBusiness, archiveJob, deleteJob, loading } = useBusinessAccount()

const jobs = ref<JobIType[]>([])
const selectedJob = ref<JobIType | null>(null)
const confirmDelete = ref<string | null>(null)

onMounted(async () => {
  jobs.value = await fetchJobsForBusiness(props.businessId)
})

async function onArchive(job: JobIType, action: 'archive' | 'unarchive') {
  if (!job.id) return
  await archiveJob(props.businessId, job.id, action)
  jobs.value = await fetchJobsForBusiness(props.businessId)
}

async function onDelete(jobId: string) {
  await deleteJob(props.businessId, jobId)
  jobs.value = await fetchJobsForBusiness(props.businessId)
  confirmDelete.value = null
}

function formatDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div :style="{ padding: '32px 40px' }">
    <!-- Header -->
    <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }">
      <div>
        <div class="zm-eyebrow">{{ business?.name ?? 'Business' }}</div>
        <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '40px', lineHeight: '1', letterSpacing: '-0.025em', margin: '8px 0 0' }">Jobs</h1>
      </div>
      <NuxtLink :to="`/b/${businessId}/jobs`">
        <ZmButton variant="dark" icon="plus">New job</ZmButton>
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" :style="{ display: 'flex', justifyContent: 'center', padding: '60px 0' }">
      <ZmSpinner :size="24" color="var(--zm-ink-700)" />
    </div>

    <!-- Empty state -->
    <div
      v-else-if="jobs.length === 0"
      :style="{ textAlign: 'center', padding: '60px 0', color: 'var(--zm-fg-muted)', font: '400 15px var(--zm-font-body)' }"
    >
      <ZmIcon name="briefcase" :size="32" color="var(--zm-border-strong)" style="margin-bottom:12px;display:block;margin-inline:auto" />
      No job postings yet.
      <NuxtLink :to="`/b/${businessId}/jobs`" style="display:block;margin-top:12px">
        <ZmButton variant="secondary" icon="plus">Post your first job</ZmButton>
      </NuxtLink>
    </div>

    <!-- Job list -->
    <div
      v-else
      :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', overflow: 'hidden' }"
    >
      <div
        v-for="(job, i) in jobs"
        :key="job.id"
        :style="{
          display: 'grid', gridTemplateColumns: '1fr 120px 120px 100px',
          gap: '16px', padding: '14px 20px', alignItems: 'center',
          borderBottom: i < jobs.length - 1 ? '1px solid var(--zm-border)' : 'none',
        }"
      >
        <div>
          <div :style="{ font: '600 14px var(--zm-font-body)' }">{{ job.title }}</div>
          <div :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '2px' }">
            {{ job.city }}, {{ job.country }} · {{ job.jobType ?? 'Full-time' }}
          </div>
        </div>
        <div>
          <div class="zm-eyebrow" style="font-size:9px">Deadline</div>
          <div :style="{ font: '500 13px var(--zm-font-body)' }">{{ formatDate(job.deadline) }}</div>
        </div>
        <div>
          <div class="zm-eyebrow" style="font-size:9px">Applications</div>
          <div :style="{ font: '500 13px var(--zm-font-body)' }">{{ job.JobApplication?.length ?? 0 }}</div>
        </div>
        <div :style="{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }">
          <ZmIconButton icon="edit" :size="28" @click="selectedJob = job" />
          <ZmIconButton
            :icon="(job as any).archived ? 'eye' : 'archive'"
            :size="28"
            @click="onArchive(job, (job as any).archived ? 'unarchive' : 'archive')"
          />
          <ZmIconButton icon="trash" :size="28" @click="confirmDelete = job.id ?? null" />
        </div>
      </div>
    </div>

    <!-- Delete confirm modal -->
    <ZmModal v-if="confirmDelete" :open="true" @close="confirmDelete = null">
      <template #title>Delete job posting?</template>
      <p :style="{ font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">This action cannot be undone.</p>
      <template #actions>
        <ZmButton variant="secondary" @click="confirmDelete = null">Cancel</ZmButton>
        <ZmButton variant="danger" @click="onDelete(confirmDelete!)">Delete</ZmButton>
      </template>
    </ZmModal>
  </div>
</template>
