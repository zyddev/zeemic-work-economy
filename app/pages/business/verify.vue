<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Business verification — Zeemic' })

const { isMobile } = useBreakpoint()
const router = useRouter()

const step = ref(2)
const submitting = ref(false)
const formError = ref('')

// Step 1 — Identity
const legalName = ref('')
const registrationCountry = ref('')
const registrationNumber = ref('')
const taxId = ref('')
const registeredAddress = ref('')
const representative = ref('')

// Step 2 — Documents (simulated upload state)
interface Doc { name: string; state: 'uploaded' | 'pending' | 'optional'; file?: string; size?: string; help?: string }
const docs = ref<Doc[]>([
  { name: 'Certificate of incorporation', state: 'uploaded', file: 'NorthwindStudio_HRB.pdf', size: '1.2 MB' },
  { name: 'Gov-issued ID of representative', state: 'uploaded', file: 'L_Wagner_Passport.pdf', size: '2.4 MB' },
  { name: 'Proof of business address', state: 'pending', help: 'Utility bill or bank statement.' },
  { name: 'Optional · Tax certificate', state: 'optional' },
])

// Step 3 — confirmed
const confirmed = ref(false)

const COUNTRIES = ['Germany', 'United Kingdom', 'United States', 'Ghana', 'Nigeria', 'South Africa', 'France', 'Netherlands', 'Canada', 'Australia']

const steps = [
  { n: 1, label: 'Identity' },
  { n: 2, label: 'Documents' },
  { n: 3, label: 'Review' },
]

const stepTitles = ['', 'Identity', 'Documents', 'Review']

function validateStep() {
  formError.value = ''
  if (step.value === 1) {
    if (!legalName.value.trim()) { formError.value = 'Please enter the legal business name.'; return false }
    if (!registrationCountry.value) { formError.value = 'Please select the country of registration.'; return false }
    if (!registrationNumber.value.trim()) { formError.value = 'Please enter the registration number.'; return false }
    if (!registeredAddress.value.trim()) { formError.value = 'Please enter the registered address.'; return false }
    if (!representative.value.trim()) { formError.value = 'Please enter the authorised representative.'; return false }
  }
  if (step.value === 2) {
    const requiredDocs = docs.value.filter(d => d.state !== 'optional')
    if (requiredDocs.some(d => d.state === 'pending')) { formError.value = 'Please upload all required documents.'; return false }
  }
  if (step.value === 3) {
    if (!confirmed.value) { formError.value = 'Please confirm the declaration to submit.'; return false }
  }
  return true
}

function nextStep() {
  if (!validateStep()) return
  step.value++
}

function simulateUpload(i: number) {
  const doc = docs.value[i]
  if (doc.state === 'uploaded') {
    doc.state = 'pending'
    doc.file = undefined
    doc.size = undefined
  } else {
    doc.state = 'uploaded'
    doc.file = `document_${i + 1}.pdf`
    doc.size = `${(Math.random() * 2 + 0.5).toFixed(1)} MB`
  }
}

async function submitReview() {
  if (!validateStep()) return
  submitting.value = true
  try {
    await $fetch('/api/business/verify', {
      method: 'POST',
      body: {
        legalName: legalName.value,
        registrationCountry: registrationCountry.value,
        registrationNumber: registrationNumber.value,
        taxId: taxId.value,
        registeredAddress: registeredAddress.value,
        representative: representative.value,
      },
    })
    await navigateTo('/dashboard')
  } catch (err: any) {
    formError.value = err?.data?.statusMessage ?? err?.message ?? 'Submission failed. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <!-- Mobile -->
  <template v-if="isMobile">
    <div :style="{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--zm-paper)' }">

      <ZmMNavBar title="Verification" leftLabel="Save & exit" @back="router.back()" />

      <!-- Scrollable area -->
      <div :style="{ flex: '1', overflowY: 'auto', padding: '12px 0' }">

        <!-- Stepper -->
        <div :style="{ padding: '0 20px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }">
          <template v-for="(s, i) in steps" :key="s.n">
            <!-- Step bubble -->
            <div :style="{
              width: '26px', height: '26px', borderRadius: '13px', flexShrink: '0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: step === s.n ? 'var(--zm-gold-500)' : step > s.n ? 'var(--zm-ink-700)' : 'var(--zm-paper-2)',
              color: step === s.n ? 'var(--zm-ink-950)' : step > s.n ? 'var(--zm-paper)' : 'var(--zm-fg-muted)',
              font: '600 11px var(--zm-font-mono)',
            }">
              <ZmIcon v-if="step > s.n" name="check" :size="12" />
              <span v-else>{{ s.n }}</span>
            </div>
            <!-- Connector line -->
            <div v-if="i < steps.length - 1" :style="{ flex: '1', height: '2px', background: step > s.n ? 'var(--zm-ink-700)' : 'var(--zm-paper-2)' }" />
          </template>
        </div>

        <!-- Step header -->
        <div :style="{ padding: '4px 20px 16px' }">
          <div class="zm-eyebrow">Step {{ step }} of 3</div>
          <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '28px', lineHeight: '1.04', letterSpacing: '-0.025em', margin: '6px 0 0' }">{{ stepTitles[step] }}</h1>
        </div>

        <!-- Step 2: Documents -->
        <template v-if="step === 2">
          <div :style="{ padding: '4px 16px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }">
            <div
              v-for="(doc, i) in docs"
              :key="i"
              :style="{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '14px',
                background: doc.state === 'uploaded' ? 'var(--zm-success-bg)' : 'var(--zm-white)',
                border: `1px solid ${doc.state === 'uploaded' ? 'var(--zm-success)' : 'var(--zm-border)'}`,
                borderRadius: 'var(--zm-r-md)',
                transition: 'background var(--zm-d-fast) var(--zm-ease), border-color var(--zm-d-fast) var(--zm-ease)',
              }"
            >
              <!-- Icon box -->
              <div :style="{
                width: '36px', height: '36px', borderRadius: 'var(--zm-r-sm)', flexShrink: '0',
                background: doc.state === 'uploaded' ? 'var(--zm-success)' : 'var(--zm-ink-50)',
                color: doc.state === 'uploaded' ? 'var(--zm-paper)' : 'var(--zm-fg-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }">
                <ZmIcon :name="doc.state === 'uploaded' ? 'check' : 'file_text'" :size="16" :stroke="2.4" />
              </div>

              <!-- Doc info -->
              <div :style="{ flex: '1', minWidth: '0' }">
                <div :style="{ font: '600 13px var(--zm-font-body)', display: 'flex', alignItems: 'center', gap: '6px' }">
                  {{ doc.name.replace('Optional · ', '') }}
                  <span v-if="doc.state === 'optional'" :style="{ font: '500 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">optional</span>
                </div>
                <div :style="{ font: '400 11.5px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">
                  {{ doc.state === 'uploaded' ? `${doc.file} · ${doc.size}` : (doc.help || 'Tap to upload') }}
                </div>
              </div>

              <!-- Action -->
              <ZmIconButton v-if="doc.state === 'uploaded'" icon="close" :size="28" @click="simulateUpload(i)" />
              <ZmButton v-else variant="secondary" size="sm" icon="upload" @click="simulateUpload(i)">Upload</ZmButton>
            </div>
          </div>
        </template>

        <!-- Step 1: Identity -->
        <template v-else-if="step === 1">
          <div :style="{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }">
            <ZmField label="Legal business name" :required="true" help="Must match your registration documents exactly.">
              <ZmInput v-model="legalName" :full="true" placeholder="Northwind Studio GmbH" leading-icon="building" size="lg" />
            </ZmField>
            <div :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }">
              <ZmField label="Country of registration" :required="true">
                <ZmSelect v-model="registrationCountry" :options="COUNTRIES" placeholder="Select…" />
              </ZmField>
              <ZmField label="Reg. number" :required="true">
                <ZmInput v-model="registrationNumber" :full="true" placeholder="HRB 123456" size="lg" />
              </ZmField>
            </div>
            <ZmField label="Tax / VAT ID">
              <ZmInput v-model="taxId" :full="true" placeholder="DE123456789" size="lg" />
            </ZmField>
            <ZmField label="Registered address" :required="true">
              <ZmInput v-model="registeredAddress" :full="true" placeholder="Brunnenstrasse 23, 10119 Berlin" leading-icon="map_pin" size="lg" />
            </ZmField>
            <ZmField label="Authorised representative" :required="true" help="Person legally authorised to act on the business's behalf.">
              <ZmInput v-model="representative" :full="true" placeholder="Lukas Wagner · CEO" leading-icon="user" size="lg" />
            </ZmField>
          </div>
        </template>

        <!-- Step 3: Review -->
        <template v-else>
          <div :style="{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }">
            <div :style="{ padding: '14px 16px', background: 'var(--zm-success-bg)', border: '1px solid var(--zm-success)', borderRadius: 'var(--zm-r-md)', display: 'flex', gap: '12px' }">
              <ZmIcon name="check_circle" :size="18" color="var(--zm-success)" :style="{ flexShrink: '0', marginTop: '1px' }" />
              <div>
                <div :style="{ font: '600 13px var(--zm-font-body)', color: 'var(--zm-success)' }">Ready to submit</div>
                <div :style="{ font: '400 13px/1.5 var(--zm-font-body)', color: 'var(--zm-fg)', marginTop: '2px' }">Everything looks good. Our trust team will review within one business day.</div>
              </div>
            </div>
            <div :style="{ background: 'var(--zm-paper)', borderRadius: 'var(--zm-r-md)', padding: '16px', border: '1px solid var(--zm-border)' }">
              <div class="zm-eyebrow" :style="{ marginBottom: '10px' }">Submission summary</div>
              <div
                v-for="[k, v] in [
                  ['Business', legalName || '—'],
                  ['Country', registrationCountry ? `${registrationCountry} · ${registrationNumber || '—'}` : '—'],
                  ['Representative', representative || '—'],
                  ['Documents', `${docs.filter(d => d.state === 'uploaded').length} of ${docs.filter(d => d.state !== 'optional').length} required uploaded`],
                ]"
                :key="k"
                :style="{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--zm-border)', font: '500 13px var(--zm-font-body)' }"
              >
                <span :style="{ color: 'var(--zm-fg-muted)' }">{{ k }}</span>
                <span>{{ v }}</span>
              </div>
            </div>
            <label :style="{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }">
              <div
                :style="{
                  width: '18px', height: '18px', borderRadius: '4px', flexShrink: '0', marginTop: '1px',
                  background: confirmed ? 'var(--zm-ink-700)' : 'var(--zm-white)',
                  border: `1.5px solid ${confirmed ? 'var(--zm-ink-700)' : 'var(--zm-border-strong)'}`,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }"
                @click="confirmed = !confirmed"
              >
                <ZmIcon v-if="confirmed" name="check" :size="13" color="var(--zm-paper)" :stroke="2.6" />
              </div>
              <span :style="{ font: '400 12.5px/1.45 var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">
                I confirm all information is accurate and I'm authorised to apply on behalf of this business.
              </span>
            </label>
          </div>
        </template>

        <p v-if="formError" :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-coral-500)', margin: '0 16px 12px' }">{{ formError }}</p>

      </div>

      <!-- Sticky CTA -->
      <ZmMStickyCTA>
        <div :style="{ display: 'flex', gap: '10px', width: '100%' }">
          <ZmButton variant="ghost" size="lg" @click="step > 1 ? step-- : router.back()">Back</ZmButton>
          <ZmButton
            v-if="step < 3"
            variant="primary" size="lg" :full="true" icon-right="arrow_right"
            @click="nextStep"
          >Continue</ZmButton>
          <ZmButton
            v-else
            variant="primary" size="lg" :full="true" icon-right="badge_check"
            :loading="submitting" :disabled="submitting"
            @click="submitReview"
          >{{ submitting ? 'Submitting…' : 'Submit for review' }}</ZmButton>
        </div>
      </ZmMStickyCTA>
    </div>
  </template>

  <!-- Desktop -->
  <template v-else>
    <div class="zm-root" :style="{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }">

      <!-- Left: brand panel -->
      <div :style="{ background: 'var(--zm-ink-950)', color: 'var(--zm-paper)', padding: '64px 60px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }">
        <div aria-hidden :style="{ position: 'absolute', right: '-40px', top: '-40px', fontFamily: 'var(--zm-font-display)', fontSize: '320px', color: 'rgba(245,241,232,0.04)', letterSpacing: '-0.04em', fontStyle: 'italic', lineHeight: '1', pointerEvents: 'none', userSelect: 'none' }">z.</div>
        <NuxtLink to="/exchange" :style="{ textDecoration: 'none' }">
          <ZmWordmark :height="26" color="var(--zm-paper)" />
        </NuxtLink>
        <div :style="{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', maxWidth: '460px' }">
          <div class="zm-eyebrow" :style="{ color: 'var(--zm-gold-500)' }">What verification unlocks</div>
          <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '56px', lineHeight: '1.02', letterSpacing: '-0.03em', margin: '14px 0 24px' }">The <em style="font-style:italic">Verified</em> badge changes the conversation.</h2>
          <p :style="{ font: '400 17px/1.55 var(--zm-font-body)', color: 'var(--zm-fg-on-dark-muted)', margin: '0' }">Buyers see a gold check on every card. You get priority in Exchange hub rows. And bookings over $1,000 unlock our escrow-backed payment rail.</p>
          <div :style="{ marginTop: '36px', padding: '20px 0 0', borderTop: '1px solid var(--zm-border-on-dark)' }">
            <p :style="{ fontFamily: 'var(--zm-font-display)', fontStyle: 'italic', fontSize: '20px', lineHeight: '1.35', letterSpacing: '-0.015em', color: 'var(--zm-paper)', margin: '0' }">"We don't list with unverified vendors. The Verified gate at Zeemic makes that easy."</p>
            <div :style="{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px' }">
              <ZmAvatar name="Adaeze Okoye" :size="28" />
              <div>
                <div :style="{ font: '600 13px var(--zm-font-body)' }">Adaeze Okoye</div>
                <div :style="{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-on-dark-muted)' }">CFO · Helio Capital</div>
              </div>
            </div>
          </div>
        </div>
        <div :style="{ font: '400 11px var(--zm-font-mono)', color: 'var(--zm-fg-on-dark-muted)', letterSpacing: '0.05em' }">© 2026 ZEEMIC · /business/verify</div>
      </div>

      <!-- Right: form panel -->
      <div :style="{ padding: '56px 32px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: 'var(--zm-paper)' }">
        <div :style="{ width: '100%', maxWidth: '440px' }">

          <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-xl)', padding: '36px', boxShadow: 'var(--zm-shadow-md)' }">
            <div class="zm-eyebrow">Verification · /business/verify</div>
            <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '36px', lineHeight: '1.04', letterSpacing: '-0.025em', margin: '8px 0 10px' }">Get your <em style="font-style:italic">Verified</em> badge.</h1>
            <p :style="{ font: '400 14px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0 0 20px' }">Three quick steps. Most businesses complete this in under 10 minutes; reviews land within 1 business day.</p>

            <!-- Stepper -->
            <div :style="{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '24px' }">
              <template v-for="(s, i) in steps" :key="s.n">
                <div :style="{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '7px 11px', borderRadius: 'var(--zm-r-full)',
                  background: step === s.n ? 'var(--zm-ink-900)' : 'transparent',
                  color: step === s.n ? 'var(--zm-paper)' : step > s.n ? 'var(--zm-ink-700)' : 'var(--zm-fg-muted)',
                  font: (step === s.n ? '600' : '500') + ' 12.5px var(--zm-font-body)',
                }">
                  <div :style="{
                    width: '20px', height: '20px', borderRadius: '10px',
                    background: step === s.n ? 'var(--zm-gold-500)' : step > s.n ? 'var(--zm-ink-700)' : 'var(--zm-paper-2)',
                    color: step === s.n ? 'var(--zm-ink-950)' : step > s.n ? 'var(--zm-paper)' : 'var(--zm-fg-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    font: '600 11px var(--zm-font-mono)', flexShrink: '0',
                  }">
                    <ZmIcon v-if="step > s.n" name="check" :size="12" />
                    <span v-else>{{ s.n }}</span>
                  </div>
                  {{ s.label }}
                </div>
                <span v-if="i < steps.length - 1" :style="{ flex: '1', height: '1px', background: 'var(--zm-border)' }" />
              </template>
            </div>

            <!-- Step 1: Identity -->
            <template v-if="step === 1">
              <div :style="{ marginBottom: '12px' }">
                <label :style="{ display: 'block', font: '500 13px var(--zm-font-body)', marginBottom: '6px' }">Legal business name <span :style="{ color: 'var(--zm-coral-500)' }">*</span></label>
                <p :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0 0 6px' }">Must match your registration documents exactly.</p>
                <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', height: '40px', padding: '0 12px', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)' }">
                  <ZmIcon name="building" :size="16" color="var(--zm-fg-muted)" />
                  <input v-model="legalName" type="text" placeholder="Northwind Studio GmbH" :style="{ flex: '1', border: 'none', outline: 'none', background: 'transparent', font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg)' }" />
                </div>
              </div>

              <div :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }">
                <div>
                  <label :style="{ display: 'block', font: '500 13px var(--zm-font-body)', marginBottom: '6px' }">Country of registration <span :style="{ color: 'var(--zm-coral-500)' }">*</span></label>
                  <ZmSelect v-model="registrationCountry" :options="COUNTRIES" placeholder="Select…" />
                </div>
                <div>
                  <label :style="{ display: 'block', font: '500 13px var(--zm-font-body)', marginBottom: '6px' }">Registration number <span :style="{ color: 'var(--zm-coral-500)' }">*</span></label>
                  <div :style="{ display: 'flex', alignItems: 'center', height: '40px', padding: '0 12px', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)' }">
                    <input v-model="registrationNumber" type="text" placeholder="HRB 123456" :style="{ flex: '1', border: 'none', outline: 'none', background: 'transparent', font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg)' }" />
                  </div>
                </div>
              </div>

              <div :style="{ marginBottom: '12px' }">
                <label :style="{ display: 'block', font: '500 13px var(--zm-font-body)', marginBottom: '6px' }">Tax / VAT ID</label>
                <div :style="{ display: 'flex', alignItems: 'center', height: '40px', padding: '0 12px', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)' }">
                  <input v-model="taxId" type="text" placeholder="DE123456789" :style="{ flex: '1', border: 'none', outline: 'none', background: 'transparent', font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg)' }" />
                </div>
              </div>

              <div :style="{ marginBottom: '12px' }">
                <label :style="{ display: 'block', font: '500 13px var(--zm-font-body)', marginBottom: '6px' }">Registered address <span :style="{ color: 'var(--zm-coral-500)' }">*</span></label>
                <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', height: '40px', padding: '0 12px', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)' }">
                  <ZmIcon name="map_pin" :size="16" color="var(--zm-fg-muted)" />
                  <input v-model="registeredAddress" type="text" placeholder="Brunnenstrasse 23, 10119 Berlin" :style="{ flex: '1', border: 'none', outline: 'none', background: 'transparent', font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg)' }" />
                </div>
              </div>

              <div :style="{ marginBottom: '4px' }">
                <label :style="{ display: 'block', font: '500 13px var(--zm-font-body)', marginBottom: '4px' }">Authorised representative <span :style="{ color: 'var(--zm-coral-500)' }">*</span></label>
                <p :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0 0 6px' }">Person legally authorised to act on the business's behalf.</p>
                <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', height: '40px', padding: '0 12px', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)' }">
                  <ZmIcon name="user" :size="16" color="var(--zm-fg-muted)" />
                  <input v-model="representative" type="text" placeholder="Lukas Wagner · CEO" :style="{ flex: '1', border: 'none', outline: 'none', background: 'transparent', font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg)' }" />
                </div>
              </div>
            </template>

            <!-- Step 2: Documents -->
            <template v-else-if="step === 2">
              <p :style="{ font: '500 13px var(--zm-font-body)', marginBottom: '12px' }">Upload the following. PDF, PNG, or JPG. Max 10 MB each.</p>
              <div v-for="(doc, i) in docs" :key="i" :style="{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '14px',
                background: doc.state === 'uploaded' ? 'var(--zm-success-bg)' : 'var(--zm-white)',
                border: `1px solid ${doc.state === 'uploaded' ? 'var(--zm-success)' : 'var(--zm-border)'}`,
                borderRadius: 'var(--zm-r-md)', marginBottom: '10px',
                transition: 'background var(--zm-d-fast) var(--zm-ease), border-color var(--zm-d-fast) var(--zm-ease)',
              }">
                <div :style="{
                  width: '36px', height: '36px', borderRadius: 'var(--zm-r-sm)',
                  background: doc.state === 'uploaded' ? 'var(--zm-success)' : 'var(--zm-ink-50)',
                  color: doc.state === 'uploaded' ? 'var(--zm-paper)' : 'var(--zm-fg-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0',
                }">
                  <ZmIcon :name="doc.state === 'uploaded' ? 'check' : 'file_text'" :size="16" :stroke="2.4" />
                </div>
                <div :style="{ flex: '1', minWidth: '0' }">
                  <div :style="{ font: '600 13px var(--zm-font-body)' }">
                    {{ doc.name.replace('Optional · ', '') }}
                    <span v-if="doc.state === 'optional'" :style="{ marginLeft: '8px', font: '500 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">· optional</span>
                  </div>
                  <div :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '2px' }">
                    {{ doc.state === 'uploaded' ? `${doc.file} · ${doc.size}` : (doc.help || 'Click to upload') }}
                  </div>
                </div>
                <ZmIconButton v-if="doc.state === 'uploaded'" icon="close" :size="28" @click="simulateUpload(i)" />
                <ZmButton v-else variant="secondary" size="sm" icon="upload" @click="simulateUpload(i)">Upload</ZmButton>
              </div>
            </template>

            <!-- Step 3: Review -->
            <template v-else>
              <!-- Success alert -->
              <div :style="{ padding: '14px 16px', background: 'var(--zm-success-bg)', border: '1px solid var(--zm-success)', borderRadius: 'var(--zm-r-md)', display: 'flex', gap: '12px', marginBottom: '20px' }">
                <ZmIcon name="check_circle" :size="18" color="var(--zm-success)" :style="{ flexShrink: '0', marginTop: '1px' }" />
                <div>
                  <div :style="{ font: '600 13px var(--zm-font-body)', color: 'var(--zm-success)' }">Ready to submit</div>
                  <div :style="{ font: '400 13px/1.5 var(--zm-font-body)', color: 'var(--zm-fg)', marginTop: '2px' }">Everything looks good. Our trust team will review within one business day and email you at your registered work address.</div>
                </div>
              </div>

              <!-- Summary -->
              <div :style="{ background: 'var(--zm-paper)', borderRadius: 'var(--zm-r-md)', padding: '16px', border: '1px solid var(--zm-border)' }">
                <div class="zm-eyebrow" :style="{ marginBottom: '10px' }">Submission summary</div>
                <div
                  v-for="[k, v] in [
                    ['Business', legalName || '—'],
                    ['Country', registrationCountry ? `${registrationCountry} · ${registrationNumber || '—'}` : '—'],
                    ['Representative', representative || '—'],
                    ['Documents', `${docs.filter(d => d.state === 'uploaded').length} of ${docs.filter(d => d.state !== 'optional').length} required uploaded`],
                  ]"
                  :key="k"
                  :style="{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--zm-border)', font: '500 13px var(--zm-font-body)' }"
                >
                  <span :style="{ color: 'var(--zm-fg-muted)' }">{{ k }}</span>
                  <span>{{ v }}</span>
                </div>
              </div>

              <!-- Confirmation checkbox -->
              <div :style="{ marginTop: '16px' }">
                <label :style="{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }">
                  <div
                    :style="{
                      width: '18px', height: '18px', borderRadius: '4px', flexShrink: '0', marginTop: '1px',
                      background: confirmed ? 'var(--zm-ink-700)' : 'var(--zm-white)',
                      border: `1.5px solid ${confirmed ? 'var(--zm-ink-700)' : 'var(--zm-border-strong)'}`,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    }"
                    @click="confirmed = !confirmed"
                  >
                    <ZmIcon v-if="confirmed" name="check" :size="13" color="var(--zm-paper)" :stroke="2.6" />
                  </div>
                  <span :style="{ font: '400 12.5px/1.45 var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">
                    I confirm all information is accurate and I'm authorised to apply on behalf of this business.
                  </span>
                </label>
              </div>
            </template>

            <p v-if="formError" :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-coral-500)', margin: '12px 0 0' }">{{ formError }}</p>

            <!-- Navigation buttons -->
            <div :style="{ marginTop: '24px', display: 'flex', gap: '10px' }">
              <ZmButton v-if="step > 1" variant="secondary" size="lg" icon="chevron_left" @click="step--">Back</ZmButton>
              <span :style="{ flex: '1' }" />
              <ZmButton v-if="step < 3" variant="primary" size="lg" icon-right="arrow_right" @click="nextStep">Continue</ZmButton>
              <ZmButton v-else variant="primary" size="lg" icon-right="badge_check" :loading="submitting" :disabled="submitting" @click="submitReview">
                {{ submitting ? 'Submitting…' : 'Submit for review' }}
              </ZmButton>
            </div>

            <p :style="{ font: '400 11.5px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textAlign: 'center', marginTop: '14px' }">
              Step {{ step }} of 3 · Saved automatically as you go
            </p>
          </div>

          <p :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textAlign: 'center', marginTop: '20px' }">
            Need help? <a :style="{ color: 'var(--zm-ink-700)', fontWeight: '600', cursor: 'pointer', textDecoration: 'none' }">Contact our trust team</a>
          </p>
        </div>
      </div>

    </div>
  </template>
</template>
