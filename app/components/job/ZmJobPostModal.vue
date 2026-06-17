<script setup lang="ts">
import type { JobIType, JSONContent, UserBusinessMembership } from '~/types'
import { createJobApi, updateBusinessJobApi } from '~/composables/utils/jobs.api'

const props = defineProps<{
  open: boolean
  editJob?: JobIType | null
  defaultBusinessId?: string
}>()

const emit = defineEmits<{ close: []; created: []; updated: [] }>()

const { user } = storeToRefs(useAuthStore())
const { getUserBusinessList } = useBusinessAccount()

// Static options
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Executive', 'Internship']
const CURRENCIES = ['USD', 'EUR', 'GBP', 'GHS', 'NGN', 'KES', 'ZAR', 'RWF', 'EGP']
const EDUCATION_OPTS = [
  'No Requirement', 'High School', 'Associate Degree', "Bachelor's Degree",
  "Master's Degree", 'PhD', 'Professional Degree', 'Vocational Training',
]
const INDUSTRIES = [
  'Technology', 'Finance', 'Design', 'Marketing', 'Sales', 'Engineering',
  'Healthcare', 'Legal', 'Education', 'Data / Analytics', 'Operations', 'HR', 'Other',
]

// Form state
const step = ref(1)
const processing = ref(false)
const errorMsg = ref('')
const userBusinesses = ref<UserBusinessMembership[]>([])

const form = reactive({
  title: '',
  description: '',
  jobType: '',
  industry: '',
  country: '',
  city: '',
  deadline: '',
  applicationMethod: 'email' as 'email' | 'url',
  applicationEmail: '',
  applicationUrl: '',
  postForBusiness: false,
  businessId: '',
  minSalary: '',
  maxSalary: '',
  currency: 'USD',
  yearsOfExperience: '',
  educationRequirement: '',
  phone: '',
  requirements: '',
  benefits: '',
})

function textToJSONContent(text: string): JSONContent {
  return { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text }] }] }
}

function jsonToText(jc: JSONContent | string | null | undefined): string {
  if (!jc) return ''
  if (typeof jc === 'string') return jc
  if (jc.text) return jc.text
  return (jc.content ?? []).map(c => jsonToText(c as JSONContent)).join('\n').trim()
}

// Prefill when editing
watch(() => props.editJob, (job) => {
  if (!job) return
  form.title = job.title
  form.description = jsonToText(job.description)
  form.jobType = job.jobType ?? ''
  form.industry = job.industry ?? ''
  form.country = job.country
  form.city = job.city
  form.deadline = job.deadline
  form.applicationMethod = job.applicationEmail ? 'email' : 'url'
  form.applicationEmail = job.applicationEmail ?? ''
  form.applicationUrl = job.applicationUrl ?? ''
  form.postForBusiness = !!job.businessId
  form.businessId = job.businessId ?? ''
  form.minSalary = job.minSalary ? String(job.minSalary) : ''
  form.maxSalary = job.maxSalary ? String(job.maxSalary) : ''
  form.currency = job.currency ?? 'USD'
  form.yearsOfExperience = job.yearsOfExperience ? String(job.yearsOfExperience) : ''
  form.educationRequirement = job.educationRequirement ?? ''
  form.phone = job.phone ?? ''
  form.requirements = job.requirements ?? ''
  form.benefits = job.benefits ?? ''
}, { immediate: true })

// Reset on open
watch(() => props.open, async (val) => {
  if (val) {
    step.value = 1
    errorMsg.value = ''
    processing.value = false
    if (!props.editJob) {
      Object.assign(form, {
        title: '', description: '', jobType: '', industry: '', country: '', city: '', deadline: '',
        applicationMethod: 'email', applicationEmail: '', applicationUrl: '',
        postForBusiness: !!props.defaultBusinessId, businessId: props.defaultBusinessId ?? '',
        minSalary: '', maxSalary: '', currency: 'USD', yearsOfExperience: '',

        educationRequirement: '', phone: '', requirements: '', benefits: '',
      })
    }
    try {
      userBusinesses.value = await getUserBusinessList()
    } catch {}
  }
})

// Step 1 validation
const step1Valid = computed(() =>
  !!form.title.trim() &&
  !!form.description.trim() &&
  !!form.jobType &&
  !!form.industry &&
  !!form.country &&
  !!form.city.trim() &&
  !!form.deadline &&
  (form.applicationMethod === 'email' ? !!form.applicationEmail.trim() : !!form.applicationUrl.trim()) &&
  (!form.postForBusiness || !!form.businessId),
)

const isEditing = computed(() => !!props.editJob)

async function submit() {
  if (processing.value) return
  processing.value = true
  errorMsg.value = ''

  const payload: JobIType = {
    ...(props.editJob?.id ? { id: props.editJob.id } : {}),
    title: form.title,
    description: textToJSONContent(form.description),
    additionalInformation: textToJSONContent(`${form.requirements}\n${form.benefits}`),
    jobType: form.jobType,
    industry: form.industry,
    country: form.country,
    city: form.city,
    deadline: form.deadline,
    applicationEmail: form.applicationMethod === 'email' ? form.applicationEmail : undefined,
    applicationUrl: form.applicationMethod === 'url' ? form.applicationUrl : undefined,
    businessId: form.postForBusiness ? form.businessId : undefined,
    postType: 'Job',
    contactMethod: null,
    phone: form.phone,
    requirements: form.requirements,
    benefits: form.benefits,
    minSalary: Number(form.minSalary) || 0,
    maxSalary: Number(form.maxSalary) || 0,
    currency: form.currency,
    yearsOfExperience: Number(form.yearsOfExperience) || 0,
    educationRequirement: form.educationRequirement,
    createdAt: props.editJob?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  try {
    const email = user.value?.email ?? ''
    if (isEditing.value && form.postForBusiness && form.businessId) {
      await updateBusinessJobApi(payload, email, form.businessId)
      emit('updated')
    } else {
      await createJobApi(payload, email)
      emit('created')
    }
    emit('close')
  } catch (e: any) {
    errorMsg.value = e?.data?.message ?? e?.message ?? 'Something went wrong. Please try again.'
  } finally {
    processing.value = false
  }
}
</script>

<template>
  <ZmModal :open="open" size="lg" :hide-close="processing" @close="emit('close')">
    <!-- Header: step indicator -->
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:24px">
      <div>
        <div class="zm-eyebrow" style="margin-bottom:4px">
          {{ isEditing ? 'Edit job' : 'Post a job' }} · Step {{ step }} of 3
        </div>
        <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '28px', letterSpacing: '-0.02em', margin: '0' }">
          {{ step === 1 ? 'General details' : step === 2 ? 'Compensation & contact' : 'Preview & post' }}
        </h2>
      </div>
      <!-- Step dots -->
      <div style="display:flex; gap:6px">
        <div v-for="s in 3" :key="s" :style="{ width: '8px', height: '8px', borderRadius: '4px', background: s <= step ? 'var(--zm-ink-900)' : 'var(--zm-border)' }" />
      </div>
    </div>

    <!-- Step 1: General Details -->
    <template v-if="step === 1">
      <div style="display:flex; flex-direction:column; gap:16px">
        <ZmInput v-model="form.title" label="Job Title" placeholder="e.g. Senior Product Designer" required />

        <div>
          <label class="zm-eyebrow" style="display:block; margin-bottom:6px">
            Description <span style="color:var(--zm-coral-500)">*</span>
          </label>
          <textarea
            v-model="form.description"
            placeholder="Describe the role, responsibilities, and what success looks like…"
            rows="5"
            maxlength="6000"
            :style="{
              width: '100%', resize: 'vertical', padding: '12px 14px', boxSizing: 'border-box',
              font: '400 14px/1.55 var(--zm-font-body)', color: 'var(--zm-ink-900)',
              background: 'var(--zm-white)', border: '1px solid var(--zm-border)',
              borderRadius: 'var(--zm-r-md)', outline: 'none',
            }"
          />
          <div :style="{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '3px', textAlign: 'right' }">
            {{ form.description.length }}/6000
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px">
          <div>
            <label class="zm-eyebrow" style="display:block; margin-bottom:6px">Job Type <span style="color:var(--zm-coral-500)">*</span></label>
            <ZmSelect v-model="form.jobType" :options="JOB_TYPES" placeholder="Select type" />
          </div>
          <div>
            <label class="zm-eyebrow" style="display:block; margin-bottom:6px">Industry <span style="color:var(--zm-coral-500)">*</span></label>
            <ZmSelect v-model="form.industry" :options="INDUSTRIES" placeholder="Select industry" />
          </div>
          <ZmInput v-model="form.country" label="Country" placeholder="e.g. Ghana" required />
          <ZmInput v-model="form.city" label="City" placeholder="e.g. Accra" required />
          <ZmInput v-model="form.deadline" label="Application Deadline" type="date" required />
        </div>

        <!-- Application method -->
        <div>
          <label class="zm-eyebrow" style="display:block; margin-bottom:8px">Application Method <span style="color:var(--zm-coral-500)">*</span></label>
          <div style="display:flex; gap:12px; margin-bottom:10px">
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font:500 14px var(--zm-font-body)">
              <input type="radio" v-model="form.applicationMethod" value="email" /> Via email
            </label>
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font:500 14px var(--zm-font-body)">
              <input type="radio" v-model="form.applicationMethod" value="url" /> Via URL
            </label>
          </div>
          <ZmInput
            v-if="form.applicationMethod === 'email'"
            v-model="form.applicationEmail"
            type="email"
            placeholder="applications@company.com"
            icon="mail"
          />
          <ZmInput
            v-else
            v-model="form.applicationUrl"
            type="url"
            placeholder="https://careers.company.com/…"
            icon="external"
          />
        </div>

        <!-- Link to business -->
        <div style="display:flex; align-items:center; gap:12px; padding:14px; background:var(--zm-paper); border-radius:var(--zm-r-md)">
          <div style="flex:1">
            <div :style="{ font: '600 14px var(--zm-font-body)' }">Post on behalf of a business</div>
            <div :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '2px' }">Link this job to one of your business accounts</div>
          </div>
          <ZmToggle :model-value="form.postForBusiness" @update:model-value="form.postForBusiness = $event" />
        </div>
        <div v-if="form.postForBusiness">
          <label class="zm-eyebrow" style="display:block; margin-bottom:6px">Business <span style="color:var(--zm-coral-500)">*</span></label>
          <ZmSelect
            v-model="form.businessId"
            :options="userBusinesses.map(b => b.business.id)"
            placeholder="Select business"
          />
          <div v-if="userBusinesses.length === 0" :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '4px' }">
            No businesses found. Create one in your settings.
          </div>
        </div>
      </div>
    </template>

    <!-- Step 2: Compensation & Contact -->
    <template v-else-if="step === 2">
      <div style="display:flex; flex-direction:column; gap:16px">
        <div style="display:grid; grid-template-columns:1fr 1fr 120px; gap:14px">
          <ZmInput v-model="form.minSalary" label="Min Salary" type="number" placeholder="e.g. 80000" />
          <ZmInput v-model="form.maxSalary" label="Max Salary" type="number" placeholder="e.g. 120000" />
          <div>
            <label class="zm-eyebrow" style="display:block; margin-bottom:6px">Currency</label>
            <ZmSelect v-model="form.currency" :options="CURRENCIES" />
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px">
          <ZmInput v-model="form.yearsOfExperience" label="Years of Experience" type="number" placeholder="e.g. 3" />
          <div>
            <label class="zm-eyebrow" style="display:block; margin-bottom:6px">Education Requirement</label>
            <ZmSelect v-model="form.educationRequirement" :options="EDUCATION_OPTS" placeholder="Select requirement" />
          </div>
          <ZmInput v-model="form.phone" label="Contact Phone" type="tel" placeholder="+1 555 0100" />
        </div>

        <div>
          <label class="zm-eyebrow" style="display:block; margin-bottom:6px">Requirements</label>
          <textarea
            v-model="form.requirements"
            placeholder="List key requirements and qualifications…"
            rows="3"
            maxlength="2000"
            :style="{
              width: '100%', resize: 'vertical', padding: '10px 12px', boxSizing: 'border-box',
              font: '400 14px/1.5 var(--zm-font-body)', color: 'var(--zm-ink-900)',
              background: 'var(--zm-white)', border: '1px solid var(--zm-border)',
              borderRadius: 'var(--zm-r-md)', outline: 'none',
            }"
          />
        </div>

        <div>
          <label class="zm-eyebrow" style="display:block; margin-bottom:6px">Benefits</label>
          <textarea
            v-model="form.benefits"
            placeholder="Describe benefits, perks, and company culture…"
            rows="3"
            maxlength="2000"
            :style="{
              width: '100%', resize: 'vertical', padding: '10px 12px', boxSizing: 'border-box',
              font: '400 14px/1.5 var(--zm-font-body)', color: 'var(--zm-ink-900)',
              background: 'var(--zm-white)', border: '1px solid var(--zm-border)',
              borderRadius: 'var(--zm-r-md)', outline: 'none',
            }"
          />
        </div>
      </div>
    </template>

    <!-- Step 3: Preview & Post -->
    <template v-else>
      <div :style="{ background: 'var(--zm-paper)', borderRadius: 'var(--zm-r-lg)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }">
        <div style="display:flex; align-items:center; gap:12px">
          <ZmAvatar :name="form.title" :size="48" :square="true" />
          <div>
            <div :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '22px', letterSpacing: '-0.02em' }">{{ form.title }}</div>
            <div :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ form.city }}, {{ form.country }}</div>
          </div>
        </div>

        <div style="display:flex; flex-wrap:wrap; gap:6px">
          <ZmBadge>{{ form.jobType }}</ZmBadge>
          <ZmBadge tone="gold">{{ form.industry }}</ZmBadge>
          <ZmBadge tone="emerald" v-if="form.minSalary || form.maxSalary">
            {{ form.currency }} {{ form.minSalary }}–{{ form.maxSalary }}
          </ZmBadge>
          <ZmBadge v-if="form.deadline">Deadline · {{ form.deadline }}</ZmBadge>
        </div>

        <div>
          <div class="zm-eyebrow" style="margin-bottom:6px">Description</div>
          <p :style="{ font: '400 14px/1.55 var(--zm-font-body)', margin: 0, color: 'var(--zm-ink-800)', whiteSpace: 'pre-wrap' }">{{ form.description }}</p>
        </div>

        <div v-if="form.requirements">
          <div class="zm-eyebrow" style="margin-bottom:4px">Requirements</div>
          <p :style="{ font: '400 14px/1.5 var(--zm-font-body)', margin: 0, color: 'var(--zm-ink-800)', whiteSpace: 'pre-wrap' }">{{ form.requirements }}</p>
        </div>

        <div v-if="form.benefits">
          <div class="zm-eyebrow" style="margin-bottom:4px">Benefits</div>
          <p :style="{ font: '400 14px/1.5 var(--zm-font-body)', margin: 0, color: 'var(--zm-ink-800)', whiteSpace: 'pre-wrap' }">{{ form.benefits }}</p>
        </div>
      </div>

      <ZmAlert v-if="errorMsg" tone="error" :style="{ marginTop: '12px' }">{{ errorMsg }}</ZmAlert>
    </template>

    <!-- Footer actions -->
    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:24px; padding-top:20px; border-top:1px solid var(--zm-border)">
      <ZmButton variant="ghost" @click="step > 1 ? step-- : emit('close')">
        {{ step > 1 ? 'Back' : 'Cancel' }}
      </ZmButton>
      <div style="display:flex; gap:10px">
        <ZmButton v-if="step < 3" variant="secondary" @click="step++">Save draft</ZmButton>
        <ZmButton
          v-if="step < 3"
          variant="dark"
          icon-right="arrow_right"
          :disabled="step === 1 && !step1Valid"
          @click="step++"
        >
          Continue
        </ZmButton>
        <ZmButton
          v-else
          variant="dark"
          :loading="processing"
          icon-right="arrow_right"
          @click="submit"
        >
          {{ isEditing ? 'Save changes' : 'Post job' }}
        </ZmButton>
      </div>
    </div>
  </ZmModal>
</template>
