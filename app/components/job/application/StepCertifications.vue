<script setup lang="ts">
import type { Certification, Achievement } from '~/types'

const props = defineProps<{
  certifications: Certification[]
  achievements: Achievement[]
}>()

const emit = defineEmits<{
  'update:certifications': [v: Certification[]]
  'update:achievements': [v: Achievement[]]
}>()

const RECOGNITION_LEVELS = ['Company', 'Regional', 'National', 'International']

function blankCert(): Certification {
  return { id: crypto.randomUUID(), title: '', issuer: '', issueDate: '', expirationDate: '', credentialUrl: '' }
}

function blankAchievement(): Achievement {
  return { id: crypto.randomUUID(), title: '', description: '', date: '', recognitionLevel: '' }
}

function addCert() {
  emit('update:certifications', [...props.certifications, blankCert()])
}

function removeCert(id: string) {
  emit('update:certifications', props.certifications.filter(c => c.id !== id))
}

function updateCert(id: string, field: keyof Certification, value: string) {
  emit('update:certifications', props.certifications.map(c => c.id === id ? { ...c, [field]: value } : c))
}

function addAchievement() {
  emit('update:achievements', [...props.achievements, blankAchievement()])
}

function removeAchievement(id: string) {
  emit('update:achievements', props.achievements.filter(a => a.id !== id))
}

function updateAchievement(id: string, field: keyof Achievement, value: string) {
  emit('update:achievements', props.achievements.map(a => a.id === id ? { ...a, [field]: value } : a))
}

const certDateError = (c: Certification) =>
  c.expirationDate && c.issueDate && c.expirationDate < c.issueDate
    ? 'Expiration must be after issue date'
    : ''
</script>

<template>
  <div style="display:flex; flex-direction:column; gap:32px">
    <!-- Certifications -->
    <section>
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px">
        <h4 style="margin:0; font:600 15px var(--zm-font-body); color:var(--zm-ink-900)">Certifications</h4>
        <ZmButton variant="secondary" size="sm" icon="plus" @click="addCert">Add</ZmButton>
      </div>

      <div v-if="!certifications.length" :style="{ padding: '20px', textAlign: 'center', color: 'var(--zm-fg-muted)', font: '400 13px var(--zm-font-body)', background: 'var(--zm-paper)', borderRadius: 'var(--zm-r-md)' }">
        No certifications added — this section is optional
      </div>

      <div v-for="cert in certifications" :key="cert.id" :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', padding: '18px', marginBottom: '12px' }">
        <div style="display:flex; justify-content:flex-end; margin-bottom:10px">
          <ZmIconButton icon="trash" :size="26" @click="removeCert(cert.id)" />
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px">
          <ZmInput :model-value="cert.title" label="Certificate Name" placeholder="e.g. AWS Solutions Architect" @update:model-value="updateCert(cert.id, 'title', $event)" />
          <ZmInput :model-value="cert.issuer" label="Issuing Organisation" placeholder="e.g. Amazon Web Services" @update:model-value="updateCert(cert.id, 'issuer', $event)" />
          <ZmInput :model-value="cert.issueDate" label="Issue Date" type="date" @update:model-value="updateCert(cert.id, 'issueDate', $event)" />
          <ZmInput :model-value="cert.expirationDate" label="Expiration Date" type="date" hint="Leave empty if no expiry" :error="certDateError(cert)" @update:model-value="updateCert(cert.id, 'expirationDate', $event)" />
          <div style="grid-column:1/-1">
            <ZmInput :model-value="cert.credentialUrl" label="Credential URL" type="url" placeholder="https://…" @update:model-value="updateCert(cert.id, 'credentialUrl', $event)" />
          </div>
        </div>
      </div>
    </section>

    <!-- Achievements -->
    <section>
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px">
        <h4 style="margin:0; font:600 15px var(--zm-font-body); color:var(--zm-ink-900)">Achievements</h4>
        <ZmButton variant="secondary" size="sm" icon="plus" @click="addAchievement">Add</ZmButton>
      </div>

      <div v-if="!achievements.length" :style="{ padding: '20px', textAlign: 'center', color: 'var(--zm-fg-muted)', font: '400 13px var(--zm-font-body)', background: 'var(--zm-paper)', borderRadius: 'var(--zm-r-md)' }">
        No achievements added — this section is optional
      </div>

      <div v-for="ach in achievements" :key="ach.id" :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', padding: '18px', marginBottom: '12px' }">
        <div style="display:flex; justify-content:flex-end; margin-bottom:10px">
          <ZmIconButton icon="trash" :size="26" @click="removeAchievement(ach.id)" />
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px">
          <ZmInput :model-value="ach.title" label="Achievement" placeholder="e.g. Employee of the Year" @update:model-value="updateAchievement(ach.id, 'title', $event)" />
          <div>
            <label class="zm-eyebrow" style="display:block; margin-bottom:6px">Recognition Level</label>
            <ZmSelect :model-value="ach.recognitionLevel ?? ''" :options="RECOGNITION_LEVELS" placeholder="Select level" @update:model-value="updateAchievement(ach.id, 'recognitionLevel', $event)" />
          </div>
          <ZmInput :model-value="ach.date" label="Date" type="date" @update:model-value="updateAchievement(ach.id, 'date', $event)" />
          <div style="grid-column:1/-1">
            <label class="zm-eyebrow" style="display:block; margin-bottom:6px">Description</label>
            <textarea
              :value="ach.description"
              placeholder="Brief description of the achievement…"
              rows="2"
              :style="{ width:'100%', resize:'vertical', padding:'10px 12px', boxSizing:'border-box', font:'400 14px/1.5 var(--zm-font-body)', color:'var(--zm-ink-900)', background:'var(--zm-white)', border:'1px solid var(--zm-border)', borderRadius:'var(--zm-r-md)', outline:'none' }"
              @input="updateAchievement(ach.id, 'description', ($event.target as HTMLTextAreaElement).value)"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
