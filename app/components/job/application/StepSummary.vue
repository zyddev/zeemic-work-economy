<script setup lang="ts">
const props = defineProps<{
  summary: string
  selectedSkills: { id: string; name: string; value: string }[]
}>()

const emit = defineEmits<{
  'update:summary': [v: string]
  'update:selectedSkills': [v: { id: string; name: string; value: string }[]]
}>()

const skillInput = ref('')
const { data: allSkillsRaw } = useStaticData<string[]>('skills')

const FALLBACK_SKILLS = [
  'Project Management', 'Communication', 'Leadership', 'JavaScript', 'Python',
  'Data Analysis', 'UI/UX Design', 'Marketing', 'Sales', 'SQL', 'React', 'Node.js',
  'Product Management', 'Agile', 'Financial Modelling',
]

const allSkillNames = computed<string[]>(() => {
  const raw = allSkillsRaw.value
  if (Array.isArray(raw)) return raw
  return FALLBACK_SKILLS
})

const filteredSkills = computed(() =>
  skillInput.value.length < 1
    ? []
    : allSkillNames.value
        .filter(s => s.toLowerCase().includes(skillInput.value.toLowerCase()))
        .filter(s => !props.selectedSkills.some(sel => sel.value === s))
        .slice(0, 8),
)

function addSkill(name: string) {
  if (props.selectedSkills.some(s => s.value === name)) return
  const next = [...props.selectedSkills, { id: crypto.randomUUID(), name, value: name }]
  emit('update:selectedSkills', next)
  skillInput.value = ''
}

function removeSkill(id: string) {
  emit('update:selectedSkills', props.selectedSkills.filter(s => s.id !== id))
}
</script>

<template>
  <div style="display:flex; flex-direction:column; gap:20px">
    <div>
      <label class="zm-eyebrow" style="display:block; margin-bottom:6px">
        Professional summary <span style="color:var(--zm-coral-500)">*</span>
      </label>
      <textarea
        :value="summary"
        placeholder="Write a brief summary of your professional background and key strengths…"
        rows="5"
        :style="{
          width: '100%', resize: 'vertical', padding: '12px 14px', boxSizing: 'border-box',
          font: '400 14px/1.55 var(--zm-font-body)', color: 'var(--zm-ink-900)',
          background: 'var(--zm-white)', border: '1px solid var(--zm-border)',
          borderRadius: 'var(--zm-r-md)', outline: 'none',
        }"
        @input="emit('update:summary', ($event.target as HTMLTextAreaElement).value)"
      />
    </div>

    <div>
      <label class="zm-eyebrow" style="display:block; margin-bottom:6px">
        Skills <span style="color:var(--zm-coral-500)">*</span>
      </label>

      <!-- Selected skills chips -->
      <div v-if="selectedSkills.length" style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:8px">
        <span
          v-for="s in selectedSkills"
          :key="s.id"
          :style="{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            padding: '4px 10px', background: 'var(--zm-ink-900)', color: 'var(--zm-paper)',
            borderRadius: 'var(--zm-r-sm)', font: '500 12px var(--zm-font-body)',
          }"
        >
          {{ s.name }}
          <button
            type="button"
            style="background:none; border:none; padding:0; cursor:pointer; color:inherit; display:flex; align-items:center; opacity:0.7"
            @click="removeSkill(s.id)"
          >
            <ZmIcon name="close" :size="12" />
          </button>
        </span>
      </div>

      <!-- Skill search input -->
      <div style="position:relative">
        <ZmInput
          v-model="skillInput"
          placeholder="Search and add skills…"
          icon="search"
        />
        <div
          v-if="filteredSkills.length"
          :style="{
            position: 'absolute', top: 'calc(100% + 4px)', left: '0', right: '0', zIndex: 20,
            background: 'var(--zm-white)', border: '1px solid var(--zm-border)',
            borderRadius: 'var(--zm-r-md)', boxShadow: 'var(--zm-shadow-md)', overflow: 'hidden',
          }"
        >
          <button
            v-for="skill in filteredSkills"
            :key="skill"
            type="button"
            :style="{
              display: 'block', width: '100%', padding: '10px 14px', textAlign: 'left',
              font: '400 14px var(--zm-font-body)', color: 'var(--zm-ink-900)',
              background: 'none', border: 'none', borderBottom: '1px solid var(--zm-border)',
              cursor: 'pointer',
            }"
            @click="addSkill(skill)"
          >
            {{ skill }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
