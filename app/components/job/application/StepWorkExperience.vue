<script setup lang="ts">
import type { WorkExperience } from '~/types'

const props = defineProps<{ entries: WorkExperience[] }>()
const emit = defineEmits<{ 'update:entries': [v: WorkExperience[]] }>()

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Freelance']

function blank(): WorkExperience {
  return { id: crypto.randomUUID(), company: '', position: '', location: '', employmentType: '', startDate: '', endDate: '', description: '' }
}

function addEntry() {
  emit('update:entries', [...props.entries, blank()])
}

function removeEntry(id: string) {
  emit('update:entries', props.entries.filter(e => e.id !== id))
}

function update(id: string, field: keyof WorkExperience, value: string) {
  emit('update:entries', props.entries.map(e => e.id === id ? { ...e, [field]: value } : e))
}

const dateError = (entry: WorkExperience) =>
  entry.endDate && entry.startDate && entry.endDate < entry.startDate
    ? 'End date must be after start date'
    : ''
</script>

<template>
  <div style="display:flex; flex-direction:column; gap:20px">
    <div
      v-for="(entry, i) in entries"
      :key="entry.id"
      :style="{
        background: 'var(--zm-white)', border: '1px solid var(--zm-border)',
        borderRadius: 'var(--zm-r-lg)', padding: '20px',
      }"
    >
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px">
        <span :style="{ font: '600 13px var(--zm-font-body)', color: 'var(--zm-ink-700)' }">
          Position {{ i + 1 }}
        </span>
        <ZmIconButton v-if="entries.length > 1" icon="trash" :size="28" @click="removeEntry(entry.id)" />
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px">
        <ZmInput
          :model-value="entry.position"
          label="Job Title"
          placeholder="e.g. Senior Designer"
          required
          @update:model-value="update(entry.id, 'position', $event)"
        />
        <ZmInput
          :model-value="entry.company"
          label="Company"
          placeholder="e.g. Acme Corp"
          required
          @update:model-value="update(entry.id, 'company', $event)"
        />
        <div>
          <label class="zm-eyebrow" style="display:block; margin-bottom:6px">Employment Type</label>
          <ZmSelect
            :model-value="entry.employmentType"
            :options="EMPLOYMENT_TYPES"
            placeholder="Select type"
            @update:model-value="update(entry.id, 'employmentType', $event)"
          />
        </div>
        <ZmInput
          :model-value="entry.location"
          label="Location"
          placeholder="e.g. Berlin, Germany"
          @update:model-value="update(entry.id, 'location', $event)"
        />
        <ZmInput
          :model-value="entry.startDate"
          label="Start Date"
          type="date"
          required
          @update:model-value="update(entry.id, 'startDate', $event)"
        />
        <ZmInput
          :model-value="entry.endDate"
          label="End Date"
          type="date"
          :hint="'Leave empty for current role'"
          :error="dateError(entry)"
          @update:model-value="update(entry.id, 'endDate', $event)"
        />
      </div>

      <div style="margin-top:14px">
        <label class="zm-eyebrow" style="display:block; margin-bottom:6px">Description</label>
        <textarea
          :value="entry.description"
          placeholder="Describe your role and key achievements…"
          rows="3"
          :style="{
            width: '100%', resize: 'vertical', padding: '10px 12px', boxSizing: 'border-box',
            font: '400 14px/1.5 var(--zm-font-body)', color: 'var(--zm-ink-900)',
            background: 'var(--zm-white)', border: '1px solid var(--zm-border)',
            borderRadius: 'var(--zm-r-md)', outline: 'none',
          }"
          @input="update(entry.id, 'description', ($event.target as HTMLTextAreaElement).value)"
        />
      </div>
    </div>

    <ZmButton variant="secondary" icon="plus" @click="addEntry">Add position</ZmButton>
  </div>
</template>
