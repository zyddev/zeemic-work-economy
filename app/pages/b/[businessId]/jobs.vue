<script setup lang="ts">
import { BIZ_SIDEBAR } from '~/data'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const route = useRoute()
const businessId = computed(() => route.params.businessId as string)
useHead({ title: 'Jobs — Business Dashboard' })

const {
  fetchJobsForBusiness,
  fetchApplicationsForBusiness,
  archiveJob,
  deleteJob,
  markApplicationReviewed,
  loading,
  error,
} = useBusinessAccount()

const jobs = ref<any[]>([])
const applications = ref<any[]>([])
const view = ref<'jobs' | 'applications'>('jobs')
const createOpen = ref(false)
const editJob = ref<any | null>(null)
const deleteConfirmId = ref<string | null>(null)
const processingId = ref<string | null>(null)

const PAGE_SIZE = 10
const jobsPage = ref(1)
const applicationsPage = ref(1)
const jobsTotalPages = computed(() => Math.max(1, Math.ceil(jobs.value.length / PAGE_SIZE)))
const applicationsTotalPages = computed(() => Math.max(1, Math.ceil(applications.value.length / PAGE_SIZE)))
const pagedJobs = computed(() => jobs.value.slice((jobsPage.value - 1) * PAGE_SIZE, jobsPage.value * PAGE_SIZE))
const pagedApplications = computed(() => applications.value.slice((applicationsPage.value - 1) * PAGE_SIZE, applicationsPage.value * PAGE_SIZE))
watch(jobs, () => { jobsPage.value = 1 })
watch(applications, () => { applicationsPage.value = 1 })

async function loadData() {
  if (!businessId.value) return
  const [j, a] = await Promise.all([
    fetchJobsForBusiness(businessId.value),
    fetchApplicationsForBusiness(businessId.value),
  ])
  jobs.value = Array.isArray(j) ? j : []
  applications.value = Array.isArray(a) ? a : []
}

onMounted(loadData)

async function handleArchive(job: any) {
  processingId.value = job.id
  const status = job.archived ? 'unarchive' : 'archive'
  try {
    await archiveJob(businessId.value, job.id, status)
    await loadData()
  } finally {
    processingId.value = null
  }
}

async function handleDelete(id: string) {
  processingId.value = id
  try {
    await deleteJob(businessId.value, id)
    deleteConfirmId.value = null
    await loadData()
  } finally {
    processingId.value = null
  }
}

async function handleMarkReviewed(appId: string) {
  processingId.value = appId
  try {
    await markApplicationReviewed(businessId.value, appId)
    await loadData()
  } finally {
    processingId.value = null
  }
}

function onJobCreated() {
  createOpen.value = false
  loadData()
}

function onJobUpdated() {
  editJob.value = null
  loadData()
}

const statusTone = (job: any) => job.archived ? 'neutral' : 'emerald'
const statusLabel = (job: any) => job.archived ? 'Archived' : 'Active'
</script>

<template>
  <div class="zm-root" style="background:var(--zm-paper);min-height:100vh">
    <ZmHeader context="business" :business="{ name: 'Business' }" active="dashboard" />
    <div :style="{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - 64px)' }">
      <ZmSidebar :items="BIZ_SIDEBAR" active="jobs">
        <template #header>
          <div :style="{ padding: '4px 12px' }">
            <div class="zm-eyebrow">Business account</div>
            <div :style="{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }">
              <ZmAvatar name="Business" :size="36" :square="true" />
              <div style="min-width:0">
                <div :style="{ font: '600 14px var(--zm-font-body)' }">{{ businessId }}</div>
              </div>
            </div>
          </div>
        </template>
      </ZmSidebar>

      <main :style="{ padding: '40px' }">
        <!-- Page header -->
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:32px">
          <div>
            <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '48px', lineHeight: '1', letterSpacing: '-0.025em', margin: '0' }">
              Jobs
            </h1>
            <p :style="{ font: '400 15px var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '8px 0 0' }">
              {{ jobs.length }} active job{{ jobs.length === 1 ? '' : 's' }} · {{ applications.length }} application{{ applications.length === 1 ? '' : 's' }}
            </p>
          </div>
          <ZmButton variant="dark" icon="plus" @click="createOpen = true">Post a job</ZmButton>
        </div>

        <!-- View tabs -->
        <div style="display:flex; gap:2px; background:var(--zm-paper); border-radius:var(--zm-r-md); padding:3px; width:fit-content; margin-bottom:24px; border:1px solid var(--zm-border)">
          <button
            v-for="tab in [{ id: 'jobs', label: 'Job listings' }, { id: 'applications', label: 'Applications' }]"
            :key="tab.id"
            type="button"
            :style="{
              padding: '7px 16px', borderRadius: 'var(--zm-r-sm)', border: 'none', cursor: 'pointer',
              font: '500 13px var(--zm-font-body)',
              background: view === tab.id ? 'var(--zm-white)' : 'transparent',
              color: view === tab.id ? 'var(--zm-ink-900)' : 'var(--zm-fg-muted)',
              boxShadow: view === tab.id ? 'var(--zm-shadow-xs)' : 'none',
              transition: 'all var(--zm-d-fast)',
            }"
            @click="view = tab.id as any"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Error -->
        <ZmAlert v-if="error" tone="error" style="margin-bottom:16px">{{ error }}</ZmAlert>

        <!-- Jobs table -->
        <template v-if="view === 'jobs'">
          <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', overflow: 'hidden' }">
            <!-- Header row -->
            <div :style="{ display: 'grid', gridTemplateColumns: '1fr 120px 140px 100px 80px 120px', gap: '12px', padding: '12px 20px', background: 'var(--zm-paper)', borderBottom: '1px solid var(--zm-border)' }">
              <div class="zm-eyebrow">Title</div>
              <div class="zm-eyebrow">Type</div>
              <div class="zm-eyebrow">Deadline</div>
              <div class="zm-eyebrow">Applicants</div>
              <div class="zm-eyebrow">Status</div>
              <div class="zm-eyebrow">Actions</div>
            </div>

            <!-- Loading -->
            <template v-if="loading">
              <div v-for="i in 4" :key="i" :style="{ padding: '16px 20px', borderBottom: '1px solid var(--zm-border)', display: 'flex', gap: '12px' }">
                <ZmSkeleton :height="14" width="200px" />
              </div>
            </template>

            <!-- Empty -->
            <div v-else-if="!jobs.length" style="padding:48px 24px; text-align:center">
              <div :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '28px', marginBottom: '8px' }">No jobs posted</div>
              <p :style="{ font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0 0 20px' }">Post your first job to start receiving applications.</p>
              <ZmButton variant="dark" icon="plus" @click="createOpen = true">Post a job</ZmButton>
            </div>

            <!-- Job rows -->
            <div
              v-for="(job, i) in pagedJobs"
              :key="job.id"
              :style="{
                display: 'grid', gridTemplateColumns: '1fr 120px 140px 100px 80px 120px', gap: '12px',
                padding: '16px 20px', alignItems: 'center',
                borderBottom: i < pagedJobs.length - 1 ? '1px solid var(--zm-border)' : 'none',
                opacity: job.archived ? 0.6 : 1,
              }"
            >
              <div>
                <div :style="{ font: '600 14px var(--zm-font-body)' }">{{ job.title }}</div>
                <div :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ job.city }}, {{ job.country }}</div>
              </div>
              <div :style="{ font: '400 13px var(--zm-font-body)' }">{{ job.jobType ?? '—' }}</div>
              <div :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ job.deadline ?? '—' }}</div>
              <div :style="{ font: '500 14px var(--zm-font-body)' }">
                {{ job.JobApplication?.length ?? job.applicationCount ?? 0 }}
              </div>
              <ZmBadge :tone="statusTone(job)" dot>{{ statusLabel(job) }}</ZmBadge>
              <div style="display:flex; gap:4px">
                <ZmButton size="sm" variant="ghost" @click="editJob = job">Edit</ZmButton>
                <ZmButton
                  size="sm"
                  variant="ghost"
                  :loading="processingId === job.id"
                  @click="handleArchive(job)"
                >
                  {{ job.archived ? 'Restore' : 'Archive' }}
                </ZmButton>
                <ZmIconButton
                  icon="trash"
                  :size="28"
                  @click="deleteConfirmId = job.id"
                />
              </div>
            </div>
          </div>

          <ZmPagination
            v-if="jobs.length > PAGE_SIZE"
            :current="jobsPage"
            :total="jobsTotalPages"
            :count="jobs.length"
            :per-page="PAGE_SIZE"
            style="margin-top:16px"
            @change="jobsPage = $event"
          />
        </template>

        <!-- Applications table -->
        <template v-else>
          <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', overflow: 'hidden' }">
            <div :style="{ display: 'grid', gridTemplateColumns: '1fr 200px 120px 100px', gap: '12px', padding: '12px 20px', background: 'var(--zm-paper)', borderBottom: '1px solid var(--zm-border)' }">
              <div class="zm-eyebrow">Applicant</div>
              <div class="zm-eyebrow">Applied for</div>
              <div class="zm-eyebrow">Status</div>
              <div class="zm-eyebrow">Action</div>
            </div>

            <div v-if="loading" v-for="i in 4" :key="i" style="padding:16px 20px; border-bottom:1px solid var(--zm-border)">
              <ZmSkeleton :height="14" width="200px" />
            </div>

            <div v-else-if="!applications.length" style="padding:48px 24px; text-align:center">
              <div :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '28px', marginBottom: '8px' }">No applications yet</div>
              <p :style="{ font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: 0 }">Applications to your jobs will appear here.</p>
            </div>

            <div
              v-for="(app, i) in pagedApplications"
              :key="app.id"
              :style="{
                display: 'grid', gridTemplateColumns: '1fr 200px 120px 100px', gap: '12px',
                padding: '16px 20px', alignItems: 'center',
                borderBottom: i < pagedApplications.length - 1 ? '1px solid var(--zm-border)' : 'none',
              }"
            >
              <div style="display:flex; align-items:center; gap:10px">
                <ZmAvatar :name="app.userName ?? 'Applicant'" :size="32" />
                <div>
                  <div :style="{ font: '600 14px var(--zm-font-body)' }">{{ app.userName ?? app.userId ?? 'Anonymous' }}</div>
                  <div :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ app.userEmail ?? '' }}</div>
                </div>
              </div>
              <div :style="{ font: '400 13px var(--zm-font-body)' }">{{ app.jobTitle ?? app.jobId ?? '—' }}</div>
              <ZmBadge :tone="app.reviewed ? 'emerald' : 'neutral'" dot>
                {{ app.reviewed ? 'Reviewed' : 'New' }}
              </ZmBadge>
              <ZmButton
                v-if="!app.reviewed"
                size="sm"
                variant="secondary"
                :loading="processingId === app.id"
                @click="handleMarkReviewed(app.id)"
              >
                Mark reviewed
              </ZmButton>
              <span v-else :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">Done</span>
            </div>
          </div>

          <ZmPagination
            v-if="applications.length > PAGE_SIZE"
            :current="applicationsPage"
            :total="applicationsTotalPages"
            :count="applications.length"
            :per-page="PAGE_SIZE"
            style="margin-top:16px"
            @change="applicationsPage = $event"
          />
        </template>
      </main>
    </div>

    <!-- Create job modal -->
    <JobZmJobPostModal
      :open="createOpen"
      :default-business-id="businessId"
      @close="createOpen = false"
      @created="onJobCreated"
    />

    <!-- Edit job modal -->
    <JobZmJobPostModal
      :open="!!editJob"
      :edit-job="editJob"
      :default-business-id="businessId"
      @close="editJob = null"
      @updated="onJobUpdated"
    />

    <!-- Delete confirmation modal -->
    <ZmModal :open="!!deleteConfirmId" title="Delete job" size="sm" @close="deleteConfirmId = null">
      <p :style="{ font: '400 14px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0 0 20px' }">
        This action cannot be undone. All associated applications will also be removed.
      </p>
      <div style="display:flex; gap:10px; justify-content:flex-end">
        <ZmButton variant="ghost" @click="deleteConfirmId = null">Cancel</ZmButton>
        <ZmButton variant="danger" :loading="!!processingId" @click="handleDelete(deleteConfirmId!)">Delete</ZmButton>
      </div>
    </ZmModal>
  </div>
</template>
