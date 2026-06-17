<script setup lang="ts">
import type { Education } from '~/types'

const props = defineProps<{ entries: Education[] }>()
const emit = defineEmits<{ 'update:entries': [v: Education[]] }>()

const DEGREE_OPTIONS = [
  'High School Diploma', 'Associate Degree', "Bachelor's Degree",
  "Master's Degree", 'PhD / Doctorate', 'Professional Degree',
  'Vocational / Technical', 'Certificate Program',
]

function blank(): Education {
  return { id: crypto.randomUUID(), institution: '', degree: '', fieldOfStudy: '', grade: '', startDate: '', endDate: '', description: '' }
}

function addEntry() {
  emit('update:entries', [...props.entries, blank()])
}

function removeEntry(id: string) {
  emit('update:entries', props.entries.filter(e => e.id !== id))
}

function update(id: string, field: keyof Education, value: string) {
  emit('update:entries', props.entries.map(e => e.id === id ? { ...e, [field]: value } : e))
}

const dateError = (entry: Education) =>
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
          Education {{ i + 1 }}
        </span>
        <ZmIconButton v-if="entries.length > 1" icon="trash" :size="28" @click="removeEntry(entry.id)" />
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px">
        <ZmInput
          :model-value="entry.institution"
          label="Institution"
          placeholder="e.g. University of Ghana"
          required
          @update:model-value="update(entry.id, 'institution', $event)"
        />
        <div>
          <label class="zm-eyebrow" style="display:block; margin-bottom:6px">
            Degree <span style="color:var(--zm-coral-500)">*</span>
          </label>
          <ZmSelect
            :model-value="entry.degree"
            :options="DEGREE_OPTIONS"
            placeholder="Select degree"
            @update:model-value="update(entry.id, 'degree', $event)"
          />
        </div>
        <ZmInput
          :model-value="entry.fieldOfStudy"
          label="Field of Study"
          placeholder="e.g. Computer Science"
          @update:model-value="update(entry.id, 'fieldOfStudy', $event)"
        />
        <ZmInput
          :model-value="entry.grade ?? ''"
          label="Grade / GPA"
          placeholder="e.g. First Class / 3.9"
          @update:model-value="update(entry.id, 'grade', $event)"
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
          hint="Leave empty if ongoing"
          :error="dateError(entry)"
          @update:model-value="update(entry.id, 'endDate', $event)"
        />
      </div>

      <div style="margin-top:14px">
        <label class="zm-eyebrow" style="display:block; margin-bottom:6px">Notes</label>
        <textarea
          :value="entry.description"
          placeholder="Thesis topic, notable projects, awards…"
          rows="2"
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

    <ZmButton variant="secondary" icon="plus" @click="addEntry">Add education</ZmButton>
  </div>
</template>
