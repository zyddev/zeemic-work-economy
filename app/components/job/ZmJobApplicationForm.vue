<script setup lang="ts">
import type { JobApplicationInfo } from '~/types'
import { submitJobApplicationApi, updateApplicationInfoApi } from '~/composables/utils/jobs.api'

const props = defineProps<{
  open: boolean
  jobId: string
  jobTitle: string
  jobCompany?: string
}>()

const emit = defineEmits<{ close: []; submitted: [] }>()

const { user } = storeToRefs(useAuthStore())
const draftStore = useJobApplicationDraftStore()

const STEPS = ['Summary', 'Experience', 'Education', 'Certifications']

const step = ref(0)
const processing = ref(false)
const submitted = ref(false)
const errorMsg = ref('')

const info = reactive<JobApplicationInfo>({
  summary: '',
  languages: [],
  skills: [],
  workExperience: [],
  education: [],
  certifications: [],
  achievements: [],
})

const selectedSkills = ref<{ id: string; name: string; value: string }[]>([])

// Load draft on open
watch(() => props.open, (val) => {
  if (!val) return
  submitted.value = false
  step.value = 0
  errorMsg.value = ''

  draftStore.loadDraft()
  if (draftStore.hasDraft && draftStore.draft) {
    const d = draftStore.draft
    Object.assign(info, d.applicationInfo)
    selectedSkills.value = d.selectedSkills
  } else {
    Object.assign(info, {
      summary: '', languages: [], skills: [],
      workExperience: [{ id: crypto.randomUUID(), company: '', position: '', location: '', employmentType: '', startDate: '', endDate: '', description: '' }],
      education: [{ id: crypto.randomUUID(), institution: '', degree: '', fieldOfStudy: '', grade: '', startDate: '', endDate: '', description: '' }],
      certifications: [],
      achievements: [],
    })
    selectedSkills.value = []
  }
})

// Auto-save draft on changes
watch([() => ({ ...info }), selectedSkills], () => {
  if (!props.open || submitted.value) return
  draftStore.saveDraft({ applicationInfo: { ...info }, selectedSkills: selectedSkills.value, mode: info.id ? 'update' : 'create' })
}, { deep: true })

// Step validation
const canProceed = computed(() => {
  if (step.value === 0) return !!info.summary.trim() && selectedSkills.value.length > 0
  if (step.value === 1) return info.workExperience.length > 0 && info.workExperience.every(e => !!e.company && !!e.position && !!e.startDate)
  if (step.value === 2) return info.education.length > 0 && info.education.every(e => !!e.institution && !!e.degree && !!e.startDate)
  return true
})

async function handleSubmit() {
  if (processing.value) return
  processing.value = true
  errorMsg.value = ''

  const payload: JobApplicationInfo = {
    ...info,
    skills: selectedSkills.value.map(s => s.value),
  }

  try {
    if (info.id) {
      const username = user.value?.id ?? ''
      await updateApplicationInfoApi(username, payload)
    } else {
      await submitJobApplicationApi(payload)
    }
    draftStore.clearDraft()
    submitted.value = true
    emit('submitted')
  } catch (e: any) {
    if (e?.status === 409) errorMsg.value = 'You have already applied to this job.'
    else errorMsg.value = e?.data?.message ?? e?.message ?? 'Something went wrong. Please try again.'
  } finally {
    processing.value = false
  }
}

function next() {
  if (step.value < STEPS.length - 1) step.value++
  else handleSubmit()
}
</script>

<template>
  <ZmModal :open="open" size="lg" :hide-close="processing" @close="emit('close')">
    <!-- Success state -->
    <template v-if="submitted">
      <div style="text-align:center; padding:32px 0">
        <div :style="{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--zm-ink-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }">
          <ZmIcon name="check" :size="28" color="var(--zm-ink-800)" />
        </div>
        <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '28px', letterSpacing: '-0.02em', margin: '0 0 8px' }">Application submitted</h2>
        <p :style="{ font: '400 15px var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0 0 24px' }">
          Your application for {{ jobTitle }} at {{ jobCompany }} has been sent.
        </p>
        <ZmButton variant="dark" @click="emit('close')">Back to jobs</ZmButton>
      </div>
    </template>

    <template v-else>
      <!-- Header -->
      <div style="margin-bottom:24px">
        <div class="zm-eyebrow" style="margin-bottom:4px">Apply for</div>
        <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '24px', letterSpacing: '-0.02em', margin: '0 0 16px' }">
          {{ jobTitle }}<span v-if="jobCompany" :style="{ color: 'var(--zm-fg-muted)', fontSize: '18px' }"> · {{ jobCompany }}</span>
        </h2>

        <!-- Step bar -->
        <div style="display:flex; gap:0; border-radius:var(--zm-r-md); overflow:hidden; border:1px solid var(--zm-border)">
          <div
            v-for="(label, i) in STEPS"
            :key="label"
            :style="{
              flex: 1, padding: '8px 4px', textAlign: 'center',
              font: `${i === step ? 600 : 400} 11px var(--zm-font-body)`,
              background: i < step ? 'var(--zm-ink-100)' : i === step ? 'var(--zm-ink-900)' : 'var(--zm-white)',
              color: i === step ? 'var(--zm-paper)' : i < step ? 'var(--zm-ink-700)' : 'var(--zm-fg-muted)',
              borderRight: i < STEPS.length - 1 ? '1px solid var(--zm-border)' : 'none',
            }"
          >
            {{ label }}
          </div>
        </div>
      </div>

      <!-- Step content -->
      <div style="max-height:55vh; overflow-y:auto; padding-right:4px">
        <JobApplicationStepSummary
          v-if="step === 0"
          :summary="info.summary"
          :selected-skills="selectedSkills"
          @update:summary="info.summary = $event"
          @update:selected-skills="selectedSkills = $event"
        />

        <JobApplicationStepWorkExperience
          v-else-if="step === 1"
          :entries="info.workExperience"
          @update:entries="info.workExperience = $event"
        />

        <JobApplicationStepEducation
          v-else-if="step === 2"
          :entries="info.education"
          @update:entries="info.education = $event"
        />

        <JobApplicationStepCertifications
          v-else
          :certifications="info.certifications"
          :achievements="info.achievements"
          @update:certifications="info.certifications = $event"
          @update:achievements="info.achievements = $event"
        />
      </div>

      <ZmAlert v-if="errorMsg" tone="error" style="margin-top:12px">{{ errorMsg }}</ZmAlert>

      <!-- Footer -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; padding-top:18px; border-top:1px solid var(--zm-border)">
        <ZmButton variant="ghost" @click="step > 0 ? step-- : emit('close')">
          {{ step > 0 ? 'Back' : 'Cancel' }}
        </ZmButton>
        <ZmButton
          variant="dark"
          :loading="processing"
          :disabled="!canProceed && step < 3"
          :icon-right="step < STEPS.length - 1 ? 'arrow_right' : undefined"
          @click="next"
        >
          {{ step < STEPS.length - 1 ? 'Continue' : 'Submit application' }}
        </ZmButton>
      </div>
    </template>
  </ZmModal>
</template>
