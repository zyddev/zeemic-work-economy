<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: 'auth' })

const { getUserBusinessList, loading } = useBusinessAccount()
const route = useRoute()

const businesses = ref<{ label: string; value: string; logoUrl?: string | null }[]>([])
const showSignup = ref(false)
const submitting = ref(false)
const alertMsg = ref('')
const alertTone = ref<'error' | 'success'>('error')

const { user } = storeToRefs(useAuthStore())

onMounted(getBusinesses)

async function getBusinesses() {
  const list = await getUserBusinessList()
  businesses.value = list.map((item: any) => ({
    label: item.business?.name ?? item.name ?? '',
    value: item.business?.id ?? item.id ?? '',
    logoUrl: item.business?.logoUrl ?? null,
  }))
}

function onSelectBusiness(bId: string) {
  navigateTo(`/b/${bId}`)
}

function openCreateForm() {
  showSignup.value = true
}

function closeCreateForm() {
  showSignup.value = false
  getBusinesses()
}

function showAlert(tone: 'error' | 'success', msg: string) {
  alertTone.value = tone
  alertMsg.value = msg
}

async function handleCreate(form: {
  businessName: string
  category: string
  businessEmail: string
}) {
  if (!form.businessName.trim() || form.businessName.trim().length < 2) {
    showAlert('error', 'Business name must be at least 2 characters.')
    return
  }
  if (!form.category) {
    showAlert('error', 'Please select a category.')
    return
  }
  submitting.value = true
  alertMsg.value = ''
  try {
    const res = await $fetch<any>('/api/business/account', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: {
        firstName: user.value?.firstName ?? '',
        lastName: user.value?.lastName ?? '',
        email: user.value?.email ?? '',
        businessName: form.businessName,
        category: form.category,
        businessEmail: form.businessEmail || undefined,
      },
    })
    if (res?.success) {
      navigateTo(`/b/${res.data.id}`)
    } else {
      showAlert('error', res?.message ?? 'Signup failed. Please try again.')
    }
  } catch (err: any) {
    showAlert('error', err?.data?.message ?? err?.message ?? 'An error occurred. Please try again.')
  } finally {
    submitting.value = false
  }
}

const { applySEO } = useBusinessAccountSEO()
applySEO()
</script>

<template>
  <div class="zm-root" :style="{ minHeight: '100vh', background: 'var(--zm-paper)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }">
    <div :style="{ width: '100%', maxWidth: '480px' }">
      <!-- Header -->
      <div :style="{ marginBottom: '32px', textAlign: 'center' }">
        <div class="zm-eyebrow" :style="{ marginBottom: '8px' }">Business account</div>
        <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '40px', lineHeight: '1', letterSpacing: '-0.025em', margin: '0' }">
          {{ showSignup ? 'Create a business' : 'Choose a workspace' }}
        </h1>
        <p :style="{ font: '400 15px var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '10px 0 0' }">
          {{ showSignup ? 'Set up your business profile to start posting jobs and managing your team.' : 'Select an existing business or create a new one.' }}
        </p>
      </div>

      <!-- Alert -->
      <div
        v-if="alertMsg"
        :style="{
          padding: '12px 16px', borderRadius: 'var(--zm-r-md)', marginBottom: '16px',
          background: alertTone === 'error' ? 'var(--zm-danger-subtle)' : 'var(--zm-success-subtle)',
          color: alertTone === 'error' ? 'var(--zm-danger)' : 'var(--zm-success)',
          font: '400 13px var(--zm-font-body)',
        }"
      >{{ alertMsg }}</div>

      <!-- Card -->
      <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-xl)', padding: '32px' }">
        <!-- Selector -->
        <BusinessZydBusinessSelector
          v-if="!showSignup"
          :businesses="businesses"
          :is-loading="loading"
          @select="onSelectBusiness"
          @create-new="openCreateForm"
          @refresh="getBusinesses"
        />

        <!-- Creation form -->
        <BusinessSignupCard
          v-else
          :submitting="submitting"
          @submit="handleCreate"
          @cancel="closeCreateForm"
        />
      </div>
    </div>
  </div>
</template>
