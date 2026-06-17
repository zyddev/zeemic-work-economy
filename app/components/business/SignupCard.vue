<script setup lang="ts">
const CATEGORIES = ['Technology', 'Education', 'Retail', 'Healthcare', 'Consulting', 'Other']

const props = defineProps<{ submitting?: boolean }>()
const emit = defineEmits<{
  submit: [form: { businessName: string; category: string; businessEmail: string }]
  cancel: []
}>()

const businessName = ref('')
const category = ref('')
const businessEmail = ref('')

const isValid = computed(() => businessName.value.trim().length >= 2 && !!category.value)

function submit() {
  if (!isValid.value) return
  emit('submit', {
    businessName: businessName.value.trim(),
    category: category.value,
    businessEmail: businessEmail.value.trim(),
  })
}
</script>

<template>
  <form @submit.prevent="submit">
    <div :style="{ display: 'flex', flexDirection: 'column', gap: '16px' }">

      <div>
        <label :style="{ display: 'block', font: '500 13px var(--zm-font-body)', marginBottom: '6px', color: 'var(--zm-ink-700)' }">
          Business name <span :style="{ color: 'var(--zm-danger)' }">*</span>
        </label>
        <input
          v-model="businessName"
          type="text"
          placeholder="e.g. Acme Corp"
          required
          :style="{
            width: '100%', boxSizing: 'border-box',
            padding: '10px 14px', border: '1px solid var(--zm-border)',
            borderRadius: 'var(--zm-r-md)', font: '400 14px var(--zm-font-body)',
            background: 'var(--zm-paper-2)', outline: 'none', color: 'var(--zm-ink-950)',
          }"
        />
      </div>

      <div>
        <label :style="{ display: 'block', font: '500 13px var(--zm-font-body)', marginBottom: '6px', color: 'var(--zm-ink-700)' }">
          Category <span :style="{ color: 'var(--zm-danger)' }">*</span>
        </label>
        <select
          v-model="category"
          required
          :style="{
            width: '100%', boxSizing: 'border-box',
            padding: '10px 14px', border: '1px solid var(--zm-border)',
            borderRadius: 'var(--zm-r-md)', font: '400 14px var(--zm-font-body)',
            background: 'var(--zm-paper-2)', outline: 'none', color: category ? 'var(--zm-ink-950)' : 'var(--zm-fg-muted)',
            appearance: 'none',
          }"
        >
          <option value="" disabled>Select a category</option>
          <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <div>
        <label :style="{ display: 'block', font: '500 13px var(--zm-font-body)', marginBottom: '6px', color: 'var(--zm-ink-700)' }">
          Business email <span :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">optional</span>
        </label>
        <input
          v-model="businessEmail"
          type="email"
          placeholder="hello@yourbusiness.com"
          :style="{
            width: '100%', boxSizing: 'border-box',
            padding: '10px 14px', border: '1px solid var(--zm-border)',
            borderRadius: 'var(--zm-r-md)', font: '400 14px var(--zm-font-body)',
            background: 'var(--zm-paper-2)', outline: 'none', color: 'var(--zm-ink-950)',
          }"
        />
      </div>

      <div :style="{ display: 'flex', gap: '10px', marginTop: '8px' }">
        <ZmButton type="button" variant="secondary" style="flex:1" @click="emit('cancel')">Cancel</ZmButton>
        <ZmButton
          type="submit"
          variant="dark"
          style="flex:1"
          :disabled="!isValid || submitting"
        >
          {{ submitting ? 'Creating…' : 'Create business' }}
        </ZmButton>
      </div>

    </div>
  </form>
</template>
