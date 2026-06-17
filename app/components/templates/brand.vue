<script setup lang="ts">
const props = defineProps<{
  businessId: string
  business?: any
}>()

const saving = ref(false)
const saved = ref(false)
const loadError = ref(false)

const CATEGORIES = ['Technology', 'Education', 'Retail', 'Healthcare', 'Consulting', 'Other']
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const form = reactive({
  name: '',
  category: '',
  industry: '',
  country: '',
  city: '',
  shortDescription: '',
  about: '',
  phone: '',
  email: '',
  website: '',
  businessHours: DAYS.map(day => ({ day, open: null as string | null, close: null as string | null })),
})

onMounted(() => {
  const b = props.business
  if (!b) return
  form.name = b.name ?? ''
  form.category = b.category ?? ''
  form.industry = b.industry ?? ''
  const parts = (b.location ?? '').split(',')
  form.city = parts[0]?.trim() ?? ''
  form.country = parts[1]?.trim() ?? ''
  form.shortDescription = b.shortDescription ?? ''
  form.about = b.about ?? ''
  form.phone = b.phone ?? ''
  form.email = b.email ?? ''
  form.website = b.website ?? ''
  if (b.businessHours?.length) {
    form.businessHours = DAYS.map(day => {
      const entry = b.businessHours.find((h: any) => h.day === day)
      return { day, open: entry?.open ?? null, close: entry?.close ?? null }
    })
  }
})

async function save() {
  saving.value = true
  saved.value = false
  try {
    await $fetch(`/api/business/account/${props.businessId}`, {
      method: 'PUT',
      credentials: 'include',
      body: {
        name: form.name,
        category: form.category,
        industry: form.industry,
        location: [form.city, form.country].filter(Boolean).join(', '),
        shortDescription: form.shortDescription,
        about: form.about,
        phone: form.phone,
        email: form.email,
        website: form.website,
        businessHours: form.businessHours,
      },
    })
    saved.value = true
    setTimeout(() => { saved.value = false }, 2500)
  } catch {
    loadError.value = true
  } finally {
    saving.value = false
  }
}

const previewTab = ref<'card' | 'full'>('card')
const slug = computed(() => props.business?.slug ?? props.businessId)

const inputStyle = {
  width: '100%', boxSizing: 'border-box' as const,
  padding: '9px 12px', border: '1px solid var(--zm-border)',
  borderRadius: 'var(--zm-r-md)', font: '400 14px var(--zm-font-body)',
  background: 'var(--zm-white)', outline: 'none', color: 'var(--zm-ink-950)',
}
</script>

<template>
  <div :style="{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '0', minHeight: 'calc(100vh - 64px)' }">
    <!-- Editor -->
    <div :style="{ padding: '32px 40px', overflowY: 'auto' }">
      <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }">
        <div>
          <div class="zm-eyebrow">{{ business?.name ?? 'Business' }}</div>
          <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '40px', lineHeight: '1', letterSpacing: '-0.025em', margin: '8px 0 0' }">Brand</h1>
        </div>
        <ZmButton variant="dark" :disabled="saving" @click="save">
          {{ saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save changes' }}
        </ZmButton>
      </div>

      <!-- Business Identity -->
      <section :style="{ marginBottom: '32px' }">
        <h3 :style="{ font: '600 16px var(--zm-font-body)', margin: '0 0 16px', paddingBottom: '10px', borderBottom: '1px solid var(--zm-border)' }">Business Identity</h3>
        <div :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }">
          <div>
            <label :style="{ display: 'block', font: '500 12px var(--zm-font-body)', color: 'var(--zm-ink-700)', marginBottom: '6px' }">Business name</label>
            <input v-model="form.name" type="text" :style="inputStyle" />
          </div>
          <div>
            <label :style="{ display: 'block', font: '500 12px var(--zm-font-body)', color: 'var(--zm-ink-700)', marginBottom: '6px' }">Category</label>
            <select v-model="form.category" :style="inputStyle">
              <option value="">Select category</option>
              <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
          <div>
            <label :style="{ display: 'block', font: '500 12px var(--zm-font-body)', color: 'var(--zm-ink-700)', marginBottom: '6px' }">Industry</label>
            <input v-model="form.industry" type="text" placeholder="e.g. SaaS" :style="inputStyle" />
          </div>
          <div>
            <label :style="{ display: 'block', font: '500 12px var(--zm-font-body)', color: 'var(--zm-ink-700)', marginBottom: '6px' }">Country</label>
            <input v-model="form.country" type="text" :style="inputStyle" />
          </div>
          <div>
            <label :style="{ display: 'block', font: '500 12px var(--zm-font-body)', color: 'var(--zm-ink-700)', marginBottom: '6px' }">City</label>
            <input v-model="form.city" type="text" :style="inputStyle" />
          </div>
        </div>
      </section>

      <!-- Description -->
      <section :style="{ marginBottom: '32px' }">
        <h3 :style="{ font: '600 16px var(--zm-font-body)', margin: '0 0 16px', paddingBottom: '10px', borderBottom: '1px solid var(--zm-border)' }">Description</h3>
        <div :style="{ display: 'flex', flexDirection: 'column', gap: '16px' }">
          <div>
            <label :style="{ display: 'block', font: '500 12px var(--zm-font-body)', color: 'var(--zm-ink-700)', marginBottom: '6px' }">
              Short description
              <span :style="{ color: form.shortDescription.length > 250 ? 'var(--zm-danger)' : 'var(--zm-fg-muted)', marginLeft: '4px' }">{{ form.shortDescription.length }}/250</span>
            </label>
            <input v-model="form.shortDescription" type="text" maxlength="250" :style="inputStyle" />
          </div>
          <div>
            <label :style="{ display: 'block', font: '500 12px var(--zm-font-body)', color: 'var(--zm-ink-700)', marginBottom: '6px' }">About</label>
            <textarea v-model="form.about" rows="5" :style="{ ...inputStyle, resize: 'vertical' }" />
          </div>
        </div>
      </section>

      <!-- Business Hours -->
      <section :style="{ marginBottom: '32px' }">
        <h3 :style="{ font: '600 16px var(--zm-font-body)', margin: '0 0 16px', paddingBottom: '10px', borderBottom: '1px solid var(--zm-border)' }">Business Hours</h3>
        <div :style="{ display: 'flex', flexDirection: 'column', gap: '8px' }">
          <div
            v-for="entry in form.businessHours"
            :key="entry.day"
            :style="{ display: 'grid', gridTemplateColumns: '100px 1fr 1fr', gap: '12px', alignItems: 'center' }"
          >
            <div :style="{ font: '500 13px var(--zm-font-body)', color: entry.open ? 'var(--zm-ink-950)' : 'var(--zm-fg-muted)' }">{{ entry.day }}</div>
            <input v-model="entry.open" type="time" :style="inputStyle" placeholder="Open" />
            <input v-model="entry.close" type="time" :style="inputStyle" placeholder="Close" />
          </div>
        </div>
        <p :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '8px' }">Leave blank for days the business is closed.</p>
      </section>

      <!-- Contact -->
      <section>
        <h3 :style="{ font: '600 16px var(--zm-font-body)', margin: '0 0 16px', paddingBottom: '10px', borderBottom: '1px solid var(--zm-border)' }">Contact</h3>
        <div :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }">
          <div>
            <label :style="{ display: 'block', font: '500 12px var(--zm-font-body)', color: 'var(--zm-ink-700)', marginBottom: '6px' }">Phone</label>
            <input v-model="form.phone" type="tel" :style="inputStyle" />
          </div>
          <div>
            <label :style="{ display: 'block', font: '500 12px var(--zm-font-body)', color: 'var(--zm-ink-700)', marginBottom: '6px' }">Email</label>
            <input v-model="form.email" type="email" :style="inputStyle" />
          </div>
          <div style="grid-column:span 2">
            <label :style="{ display: 'block', font: '500 12px var(--zm-font-body)', color: 'var(--zm-ink-700)', marginBottom: '6px' }">Website</label>
            <input v-model="form.website" type="url" placeholder="https://" :style="inputStyle" />
          </div>
        </div>
      </section>
    </div>

    <!-- Preview panel -->
    <div :style="{ borderLeft: '1px solid var(--zm-border)', background: 'var(--zm-paper-2)', padding: '24px', position: 'sticky', top: '64px', height: 'calc(100vh - 64px)', overflowY: 'auto' }">
      <div :style="{ display: 'flex', gap: '8px', marginBottom: '20px' }">
        <button
          v-for="t in ['card', 'full'] as const"
          :key="t"
          :style="{
            flex: 1, padding: '8px', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)', cursor: 'pointer',
            font: '500 13px var(--zm-font-body)',
            background: previewTab === t ? 'var(--zm-ink-900)' : 'var(--zm-white)',
            color: previewTab === t ? 'var(--zm-fg-on-dark)' : 'var(--zm-ink-700)',
          }"
          @click="previewTab = t"
        >{{ t === 'card' ? 'Card Preview' : 'Full Preview' }}</button>
      </div>

      <!-- Card preview -->
      <div v-if="previewTab === 'card'" :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', overflow: 'hidden' }">
        <div :style="{ height: '80px', background: 'var(--zm-ink-900)' }" />
        <div :style="{ padding: '0 16px 16px' }">
          <div :style="{ marginTop: '-24px', marginBottom: '10px' }">
            <ZmAvatar :name="form.name || 'B'" :size="48" :square="true" />
          </div>
          <div :style="{ font: '600 15px var(--zm-font-body)' }">{{ form.name || 'Business name' }}</div>
          <div :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '4px' }">{{ form.category || 'Category' }} · {{ form.city || 'City' }}</div>
          <p :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-ink-700)', margin: '8px 0 0', lineHeight: '1.4' }">
            {{ (form.shortDescription || 'Short description appears here.').slice(0, 100) }}
          </p>
        </div>
      </div>

      <!-- Full preview link -->
      <div v-else :style="{ textAlign: 'center', padding: '24px 0' }">
        <p :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginBottom: '12px' }">View the live public profile</p>
        <NuxtLink :to="`/business/${slug}`" target="_blank">
          <ZmButton variant="secondary" icon-right="external">Open public profile</ZmButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

