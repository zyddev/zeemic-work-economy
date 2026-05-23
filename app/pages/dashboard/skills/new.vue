<script setup lang="ts">
import { ZM_SKILLS } from '~/data'
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useHead({ title: 'New Skill — Zeemic' })
const { isMobile, isTablet } = useBreakpoint()

const step = ref(1)
const STEPS = [
  { id: 1, label: 'Basics' },
  { id: 2, label: 'Service details' },
  { id: 3, label: 'Pricing' },
  { id: 4, label: 'Deliverables' },
  { id: 5, label: 'Brochure' },
  { id: 6, label: 'Lead form' },
  { id: 7, label: 'Media' },
  { id: 8, label: 'Availability' },
]

// Step 1 fields
const skillTitle = ref('')
const skillCategory = ref('Design')
const skillBlurb = ref('')
const skillDelivery = ref<'Remote' | 'On-site'>('Remote')
const CATEGORIES = ['Design', 'Development', 'Marketing', 'Consulting', 'Engineering', 'Finance', 'HR', 'Writing']

// Step 3 fields
const pricingModel = ref('Per session')
const PRICING_MODELS = [
  { label: 'Hourly', icon: 'bolt' },
  { label: 'Per project', icon: 'briefcase' },
  { label: 'Per session', icon: 'calendar' },
  { label: 'Packages', icon: 'layers' },
  { label: 'RFQ only', icon: 'message' },
]

type PkgRow = { name: string; desc: string; price: string }
const pkgRows = ref<PkgRow[]>([
  { name: 'Starter', desc: 'Quick engagement, 1 deliverable', price: '600' },
  { name: 'Standard', desc: 'Full engagement + report', price: '1800' },
  { name: 'Premium', desc: 'Extended scope + workshop', price: '3400' },
])
const rfqEnabled = ref(false)

function addPackage() {
  pkgRows.value.push({ name: '', desc: '', price: '' })
}

const previewSkill = ZM_SKILLS[0]

const tipsByStep: Record<number, string> = {
  1: 'A clear, specific title gets 3× more views. Avoid generic terms like "Consulting" — describe exactly what you do.',
  2: 'Break your service into clear phases. Buyers want to know exactly what they\'re getting at each stage.',
  3: 'Sellers who offer 3 packages close 40% more bookings. The middle tier is chosen most often.',
  4: 'List concrete outputs — reports, recordings, workshops. Tangible deliverables reduce buyer hesitation.',
  5: 'Your brochure is shared with buyers. Keep it concise: one page, outcome-focused.',
  6: 'A focused lead form increases conversion. Ask only what you need to qualify a lead.',
  7: 'Listings with a cover image get 5× more clicks. Use a high-contrast, professional image.',
  8: 'Clear availability windows reduce back-and-forth by 60%. Be specific about your schedule.',
}
</script>

<template>
  <div class="zm-root" :style="{ background: 'var(--zm-paper)', minHeight: '100vh' }">
    <ZmHeader active="dashboard" />

    <!-- Wizard top bar -->
    <div :style="{ padding: isMobile ? '16px 16px 0' : '24px 80px 0', display: 'flex', alignItems: 'center', gap: '16px' }">
      <ZmIconButton icon="chevron_left" :size="36" variant="surface" @click="navigateTo('/dashboard/skills')" />
      <div style="flex:1">
        <div class="zm-eyebrow">My skills · new listing</div>
        <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '28px', letterSpacing: '-0.02em', margin: '4px 0 0' }">New skill listing</h2>
      </div>
      <span style="flex:1" />
      <ZmButton variant="ghost" size="md">Save as draft</ZmButton>
      <ZmButton variant="dark" size="md">Preview</ZmButton>
    </div>

    <!-- Stepper -->
    <div :style="{ padding: isMobile ? '16px 16px 0' : '32px 80px 0', borderBottom: '1px solid var(--zm-border)', marginTop: '16px' }">
      <div :style="{ display: 'flex', alignItems: 'center', paddingBottom: isMobile ? '12px' : '24px', overflowX: 'auto' }">
        <template v-for="(s, i) in STEPS" :key="s.id">
          <div :style="{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flexShrink: '0' }">
            <!-- Circle -->
            <div :style="{
              width: '22px',
              height: '22px',
              borderRadius: '11px',
              background: s.id < step ? 'var(--zm-ink-700)' : s.id === step ? 'var(--zm-gold-500)' : 'var(--zm-paper-2)',
              color: s.id < step ? 'var(--zm-paper)' : s.id === step ? 'var(--zm-ink-950)' : 'var(--zm-fg-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: '0',
            }">
              <ZmIcon v-if="s.id < step" name="check" :size="11" />
              <span v-else :style="{ font: '600 11px var(--zm-font-body)' }">{{ s.id }}</span>
            </div>
            <!-- Label -->
            <span :style="{
              font: s.id === step ? '600 13px var(--zm-font-body)' : '500 13px var(--zm-font-body)',
              color: s.id === step ? 'var(--zm-ink-900)' : 'var(--zm-fg-muted)',
              whiteSpace: 'nowrap',
            }">{{ s.label }}</span>
          </div>
          <!-- Connector -->
          <div
            v-if="i < STEPS.length - 1"
            :style="{ width: '14px', height: '1px', background: 'var(--zm-border)', flexShrink: '0', marginBottom: '22px', marginLeft: '4px', marginRight: '4px' }"
          />
        </template>
      </div>
    </div>

    <!-- Form area -->
    <div :style="{ padding: isMobile ? '16px' : '48px 80px 80px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 360px', gap: '48px', alignItems: 'start' }">

      <!-- Left column -->
      <div>

        <!-- STEP 1: Basics -->
        <template v-if="step === 1">
          <div class="zm-eyebrow" style="margin-bottom:8px">Step 1 · Basics</div>
          <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '44px', letterSpacing: '-0.025em', lineHeight: '1.05', margin: '0 0 32px' }">What is your skill?</h2>

          <div :style="{ display: 'flex', flexDirection: 'column', gap: '20px' }">
            <!-- Skill title -->
            <div>
              <label :style="{ font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', display: 'block', marginBottom: '8px' }">Skill title</label>
              <input
                v-model="skillTitle"
                placeholder="e.g. UX Research & Usability Testing"
                :style="{
                  height: '44px',
                  width: '100%',
                  boxSizing: 'border-box',
                  border: '1px solid var(--zm-border)',
                  borderRadius: 'var(--zm-r-md)',
                  padding: '0 14px',
                  font: '500 14px var(--zm-font-body)',
                  color: 'var(--zm-ink-900)',
                  background: 'var(--zm-white)',
                  outline: 'none',
                }"
              />
            </div>

            <!-- Category -->
            <div>
              <label :style="{ font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', display: 'block', marginBottom: '8px' }">Category</label>
              <div :style="{ display: 'flex', flexWrap: 'wrap', gap: '8px' }">
                <ZmChip
                  v-for="cat in CATEGORIES"
                  :key="cat"
                  :active="skillCategory === cat"
                  @click="skillCategory = cat"
                >{{ cat }}</ZmChip>
              </div>
            </div>

            <!-- Short description -->
            <div>
              <label :style="{ font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', display: 'block', marginBottom: '8px' }">Short description</label>
              <textarea
                v-model="skillBlurb"
                placeholder="One or two sentences describing what you offer and for whom..."
                :style="{
                  width: '100%',
                  boxSizing: 'border-box',
                  border: '1px solid var(--zm-border)',
                  borderRadius: 'var(--zm-r-md)',
                  padding: '12px 14px',
                  minHeight: '96px',
                  font: '400 14px var(--zm-font-body)',
                  color: 'var(--zm-ink-900)',
                  outline: 'none',
                  resize: 'vertical',
                  background: 'var(--zm-white)',
                }"
              />
            </div>

            <!-- Location / delivery -->
            <div>
              <label :style="{ font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', display: 'block', marginBottom: '8px' }">Location / delivery</label>
              <div :style="{ display: 'flex', gap: '8px' }">
                <ZmChip :active="skillDelivery === 'Remote'" @click="skillDelivery = 'Remote'">Remote</ZmChip>
                <ZmChip :active="skillDelivery === 'On-site'" @click="skillDelivery = 'On-site'">On-site</ZmChip>
              </div>
            </div>
          </div>
        </template>

        <!-- STEP 3: Pricing -->
        <template v-else-if="step === 3">
          <div class="zm-eyebrow" style="margin-bottom:8px">Step 3 · Pricing</div>
          <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '44px', letterSpacing: '-0.025em', lineHeight: '1.05', margin: '0 0 32px' }">How do you price?</h2>

          <!-- Pricing model cards -->
          <div>
            <label :style="{ font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', display: 'block', marginBottom: '12px' }">Pricing model</label>
            <div :style="{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: '10px', marginBottom: '32px' }">
              <div
                v-for="pm in PRICING_MODELS"
                :key="pm.label"
                :style="{
                  padding: '16px',
                  borderRadius: 'var(--zm-r-md)',
                  background: pricingModel === pm.label ? 'var(--zm-ink-900)' : 'var(--zm-white)',
                  color: pricingModel === pm.label ? 'var(--zm-fg-on-dark)' : 'inherit',
                  border: pricingModel === pm.label ? '2px solid var(--zm-ink-900)' : '1px solid var(--zm-border)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }"
                @click="pricingModel = pm.label"
              >
                <ZmIcon
                  :name="pm.icon"
                  :size="18"
                  :color="pricingModel === pm.label ? 'var(--zm-fg-on-dark)' : 'var(--zm-fg-muted)'"
                />
                <span :style="{ font: '600 13px var(--zm-font-body)' }">{{ pm.label }}</span>
              </div>
            </div>

            <!-- Packages list -->
            <div v-if="pricingModel === 'Packages' || pricingModel === 'Per session'">
              <label :style="{ font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', display: 'block', marginBottom: '12px' }">Packages</label>
              <div :style="{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }">
                <div
                  v-for="(pkg, idx) in pkgRows"
                  :key="idx"
                  :style="{
                    background: 'var(--zm-white)',
                    border: '1px solid var(--zm-border)',
                    borderRadius: 'var(--zm-r-md)',
                    padding: '14px 16px',
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '24px 1fr 100px' : '24px 1fr 1fr 100px',
                    gap: '10px',
                    alignItems: 'center',
                  }"
                >
                  <ZmIcon name="drag_handle" :size="16" color="var(--zm-fg-muted)" style="cursor:grab" />
                  <input
                    v-model="pkg.name"
                    placeholder="Package name"
                    :style="{ border: 'none', outline: 'none', font: '600 13px var(--zm-font-body)', background: 'transparent', width: '100%' }"
                  />
                  <input
                    v-model="pkg.desc"
                    placeholder="Short description"
                    :style="{ border: 'none', outline: 'none', font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', background: 'transparent', width: '100%' }"
                  />
                  <div :style="{ display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-sm)', padding: '0 10px', height: '34px' }">
                    <span :style="{ font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">$</span>
                    <input
                      v-model="pkg.price"
                      type="number"
                      placeholder="0"
                      :style="{ border: 'none', outline: 'none', font: '500 13px var(--zm-font-body)', background: 'transparent', width: '100%' }"
                    />
                  </div>
                </div>
              </div>
              <ZmButton variant="secondary" size="sm" icon="plus" @click="addPackage">Add package</ZmButton>
            </div>

            <!-- RFQ toggle -->
            <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '28px', padding: '16px', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)' }">
              <div>
                <div :style="{ font: '600 14px var(--zm-font-body)' }">Also accept quote requests</div>
                <div :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '2px' }">Buyers can request a custom quote in addition to your packages.</div>
              </div>
              <ZmToggle v-model="rfqEnabled" />
            </div>
          </div>
        </template>

        <!-- All other steps (2, 4, 5, 6, 7, 8) -->
        <template v-else>
          <div class="zm-eyebrow" style="margin-bottom:8px">Step {{ step }} · {{ STEPS[step - 1].label }}</div>
          <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '44px', letterSpacing: '-0.025em', lineHeight: '1.05', margin: '0 0 20px' }">{{ STEPS[step - 1].label }}</h2>
          <p :style="{ font: '400 16px/1.6 var(--zm-font-body)', color: 'var(--zm-fg-muted)', maxWidth: '480px' }">Coming soon — this step will be available shortly.</p>
        </template>

        <!-- Navigation buttons -->
        <div :style="{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: isMobile ? '20px' : '48px' }">
          <ZmButton
            variant="ghost"
            icon="chevron_left"
            :disabled="step === 1"
            @click="step > 1 && step--"
          >Back</ZmButton>
          <span style="flex:1" />
          <ZmButton variant="secondary" @click="navigateTo('/dashboard/skills')">Save &amp; exit</ZmButton>
          <ZmButton
            variant="primary"
            icon-right="arrow_right"
            :disabled="step === 8"
            @click="step < 8 && step++"
          >Continue</ZmButton>
        </div>
      </div>

      <!-- Right column: preview -->
      <div :style="{ position: 'sticky', top: '88px', display: isMobile ? 'none' : 'flex', flexDirection: 'column', gap: '16px' }">
        <div class="zm-eyebrow" style="margin-bottom:4px">Live preview</div>

        <!-- Preview card -->
        <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', overflow: 'hidden' }">
          <ZmSkillThumb :category="previewSkill.category" :motif="previewSkill.motif" :height="140" />
          <div :style="{ padding: '16px' }">
            <div :style="{ display: 'flex', gap: '6px', marginBottom: '10px' }">
              <ZmBadge tone="emerald">{{ previewSkill.category }}</ZmBadge>
              <ZmBadge tone="success" dot>Available now</ZmBadge>
            </div>
            <div :style="{ font: '600 15px var(--zm-font-body)', lineHeight: '1.35', marginBottom: '8px' }">
              {{ skillTitle || previewSkill.title }}
            </div>
            <div :style="{ display: 'flex', alignItems: 'baseline', gap: '4px' }">
              <span :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '24px', letterSpacing: '-0.02em' }">
                ${{ pkgRows[0]?.price || previewSkill.price }}
              </span>
              <span :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ previewSkill.unit }}</span>
            </div>
          </div>
        </div>

        <!-- Tip box -->
        <div :style="{ background: 'var(--zm-paper-2)', borderRadius: 'var(--zm-r-md)', padding: '16px' }">
          <div class="zm-eyebrow" style="margin-bottom:6px">Tip</div>
          <p :style="{ font: '400 13px/1.5 var(--zm-font-body)', margin: '0', color: 'var(--zm-fg-muted)' }">
            {{ tipsByStep[step] }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
