<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Create business — Zeemic' })

const { isMobile } = useBreakpoint()
const router = useRouter()

type BizType = 'company' | 'agency' | 'sole-trader'

const bizType = ref<BizType>('company')
const name = ref('')
const handle = ref('')
const country = ref('')
const industry = ref('')
const teamSize = ref('')
const founded = ref('')
const workEmail = ref('')
const applyVerified = ref(true)
const agreedToTerms = ref(false)
const submitting = ref(false)
const formError = ref('')

const BIZ_TYPES: { id: BizType; label: string; icon: string }[] = [
  { id: 'company', label: 'Company', icon: 'building' },
  { id: 'agency', label: 'Agency', icon: 'users' },
  { id: 'sole-trader', label: 'Sole trader', icon: 'user' },
]

const COUNTRIES = ['Germany', 'United Kingdom', 'United States', 'Ghana', 'Nigeria', 'South Africa', 'France', 'Netherlands', 'Canada', 'Australia']
const INDUSTRIES = ['Design agency', 'Software / Tech', 'Finance', 'Marketing', 'Legal', 'Healthcare', 'Education', 'Construction', 'Media', 'Other']
const TEAM_SIZES = ['1–5', '6–20', '20–50', '50–200', '200+']

async function submit() {
  formError.value = ''
  if (!name.value.trim()) { formError.value = 'Please enter your business name.'; return }
  if (!handle.value.trim()) { formError.value = 'Please choose a public handle.'; return }
  if (!workEmail.value.includes('@')) { formError.value = 'Please enter a valid work email.'; return }
  if (!agreedToTerms.value) { formError.value = 'Please agree to the Business Terms.'; return }
  submitting.value = true
  try {
    await $fetch('/api/business/register', {
      method: 'POST',
      body: { type: bizType.value, name: name.value, handle: handle.value, country: country.value, industry: industry.value, teamSize: teamSize.value, founded: founded.value, workEmail: workEmail.value, applyVerified: applyVerified.value },
    })
    if (applyVerified.value) {
      await navigateTo('/business/verify')
    } else {
      await navigateTo('/dashboard')
    }
  } catch (err: any) {
    formError.value = err?.data?.statusMessage ?? err?.message ?? 'Registration failed. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <!-- Mobile -->
  <template v-if="isMobile">
    <div :style="{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--zm-paper)' }">

      <ZmMNavBar title="Register business" leftLabel="Back" @back="router.back()" />

      <!-- Scrollable area -->
      <div :style="{ flex: '1', overflowY: 'auto', padding: '8px 0' }">

        <!-- Auth header -->
        <div :style="{ padding: '8px 20px 16px' }">
          <div class="zm-eyebrow">Business</div>
          <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '32px', lineHeight: '1.04', letterSpacing: '-0.025em', margin: '8px 0 6px' }">Register your <em style="font-style:italic">business.</em></h1>
          <p :style="{ font: '400 13.5px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0' }">A business account unlocks team listings, recruiters, and a shared inbox.</p>
        </div>

        <!-- Form area -->
        <div :style="{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '14px' }">

          <!-- Type switcher -->
          <div :style="{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            padding: '4px', background: 'var(--zm-ink-50)',
            borderRadius: 'var(--zm-r-md)',
            border: '1px solid var(--zm-ink-100)',
          }">
            <button
              v-for="opt in BIZ_TYPES"
              :key="opt.id"
              type="button"
              :style="{
                height: '40px', border: 'none', cursor: 'pointer',
                background: bizType === opt.id ? 'var(--zm-white)' : 'transparent',
                color: bizType === opt.id ? 'var(--zm-ink-950)' : 'var(--zm-fg-muted)',
                borderRadius: 'var(--zm-r-sm)',
                font: (bizType === opt.id ? '600' : '500') + ' 12.5px var(--zm-font-body)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                boxShadow: bizType === opt.id ? 'var(--zm-shadow-xs)' : 'none',
                transition: 'all 120ms var(--zm-ease)',
              }"
              @click="bizType = opt.id"
            >
              <ZmIcon :name="opt.icon" :size="13" :color="bizType === opt.id ? 'var(--zm-ink-700)' : 'var(--zm-fg-muted)'" />
              {{ opt.label }}
            </button>
          </div>

          <!-- Business name -->
          <ZmField label="Business name" :required="true">
            <ZmInput v-model="name" :full="true" placeholder="Northwind Studio GmbH" leading-icon="building" size="lg" />
          </ZmField>

          <!-- Public handle -->
          <ZmField label="Public handle" :required="true" help="zeemic.com/business/your-handle">
            <ZmInput v-model="handle" :full="true" placeholder="northwind-studio" suffix=".zeemic" size="lg" />
          </ZmField>

          <!-- Country + Industry -->
          <div :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }">
            <ZmField label="Country">
              <ZmSelect v-model="country" :options="COUNTRIES" placeholder="Select…" size="lg" />
            </ZmField>
            <ZmField label="Industry">
              <ZmSelect v-model="industry" :options="INDUSTRIES" placeholder="Select…" size="lg" />
            </ZmField>
          </div>

          <!-- Work email -->
          <ZmField label="Work email" :required="true" help="We'll send your verification code here.">
            <ZmInput v-model="workEmail" type="email" :full="true" placeholder="hello@yourbusiness.com" leading-icon="message" size="lg" />
          </ZmField>

          <!-- Gold verified card -->
          <div :style="{ background: 'var(--zm-gold-100)', border: '1px solid var(--zm-gold-300)', borderRadius: 'var(--zm-r-md)', padding: '14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }">
            <ZmIcon name="badge_check" :size="18" color="var(--zm-gold-700)" :style="{ marginTop: '2px', flexShrink: '0' }" />
            <div :style="{ flex: '1' }">
              <div :style="{ font: '600 13px var(--zm-font-body)' }">Apply for Verified now</div>
              <div :style="{ font: '400 11.5px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '2px' }">Skip and you'll launch as unverified — apply any time from settings.</div>
            </div>
            <ZmToggle :value="applyVerified" @update:modelValue="applyVerified = $event" size="md" />
          </div>

          <!-- Terms checkbox -->
          <label :style="{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }">
            <div
              :style="{
                width: '18px', height: '18px', borderRadius: '4px', flexShrink: '0', marginTop: '1px',
                background: agreedToTerms ? 'var(--zm-ink-700)' : 'var(--zm-white)',
                border: `1.5px solid ${agreedToTerms ? 'var(--zm-ink-700)' : 'var(--zm-border-strong)'}`,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--zm-paper)',
              }"
              @click="agreedToTerms = !agreedToTerms"
            >
              <ZmIcon v-if="agreedToTerms" name="check" :size="13" color="var(--zm-paper)" :stroke="2.6" />
            </div>
            <span :style="{ font: '400 12.5px/1.45 var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">
              I agree to Business Terms and confirm I'm authorised.
            </span>
          </label>

          <!-- Error -->
          <p v-if="formError" :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-coral-500)', margin: '0' }">{{ formError }}</p>

        </div>
      </div>

      <!-- Sticky CTA -->
      <ZmMStickyCTA>
        <ZmButton variant="primary" size="lg" :full="true" icon-right="arrow_right" :loading="submitting" :disabled="submitting" @click="submit">
          Create and continue
        </ZmButton>
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
          <div class="zm-eyebrow" :style="{ color: 'var(--zm-gold-500)' }">Verified businesses</div>
          <h2 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '56px', lineHeight: '1.02', letterSpacing: '-0.03em', margin: '14px 0 24px' }">Stand out with a <em style="font-style:italic">Verified</em> badge.</h2>
          <p :style="{ font: '400 17px/1.55 var(--zm-font-body)', color: 'var(--zm-fg-on-dark-muted)', margin: '0' }">Verified businesses get a gold badge across the marketplace, priority placement in Exchange hub rows, and access to escrow-backed bookings for higher-value engagements.</p>
          <div :style="{ marginTop: '36px', padding: '20px 0 0', borderTop: '1px solid var(--zm-border-on-dark)' }">
            <p :style="{ fontFamily: 'var(--zm-font-display)', fontStyle: 'italic', fontSize: '20px', lineHeight: '1.35', letterSpacing: '-0.015em', color: 'var(--zm-paper)', margin: '0' }">"Getting verified took an afternoon. We saw a 3× lift in qualified RFQs the following week."</p>
            <div :style="{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px' }">
              <ZmAvatar name="Lukas Wagner" :size="28" />
              <div>
                <div :style="{ font: '600 13px var(--zm-font-body)' }">Lukas Wagner</div>
                <div :style="{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-on-dark-muted)' }">Founder · Northwind Studio</div>
              </div>
            </div>
          </div>
        </div>
        <div :style="{ font: '400 11px var(--zm-font-mono)', color: 'var(--zm-fg-on-dark-muted)', letterSpacing: '0.05em' }">© 2026 ZEEMIC · /business/register</div>
      </div>

      <!-- Right: form panel -->
      <div :style="{ padding: '56px 32px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: 'var(--zm-paper)' }">
        <div :style="{ width: '100%', maxWidth: '440px' }">

          <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-xl)', padding: '36px', boxShadow: 'var(--zm-shadow-md)' }">
            <div class="zm-eyebrow">Create business · /business/register</div>
            <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '36px', lineHeight: '1.04', letterSpacing: '-0.025em', margin: '8px 0 10px' }">Register your <em style="font-style:italic">business.</em></h1>
            <p :style="{ font: '400 14px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0 0 20px' }">A business account unlocks team listings, recruiter profiles, and a shared inbox. You can verify later, or upload documents now to apply for the Verified badge.</p>

            <!-- Business type segmented control -->
            <div :style="{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
              padding: '4px', background: 'var(--zm-ink-50)',
              borderRadius: 'var(--zm-r-md)', marginBottom: '20px',
              border: '1px solid var(--zm-ink-100)',
            }">
              <button
                v-for="opt in BIZ_TYPES"
                :key="opt.id"
                type="button"
                :style="{
                  height: '40px', border: 'none', cursor: 'pointer',
                  background: bizType === opt.id ? 'var(--zm-white)' : 'transparent',
                  color: bizType === opt.id ? 'var(--zm-ink-950)' : 'var(--zm-fg-muted)',
                  borderRadius: 'var(--zm-r-sm)',
                  font: (bizType === opt.id ? '600' : '500') + ' 12.5px var(--zm-font-body)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  boxShadow: bizType === opt.id ? 'var(--zm-shadow-xs)' : 'none',
                  transition: 'all 120ms var(--zm-ease)',
                }"
                @click="bizType = opt.id"
              >
                <ZmIcon :name="opt.icon" :size="13" :color="bizType === opt.id ? 'var(--zm-ink-700)' : 'var(--zm-fg-muted)'" />
                {{ opt.label }}
              </button>
            </div>

            <!-- Business name -->
            <div :style="{ marginBottom: '12px' }">
              <label :style="{ display: 'block', font: '500 13px var(--zm-font-body)', marginBottom: '6px' }">Business name <span :style="{ color: 'var(--zm-coral-500)' }">*</span></label>
              <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', height: '40px', padding: '0 12px', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)' }">
                <ZmIcon name="building" :size="16" color="var(--zm-fg-muted)" />
                <input v-model="name" type="text" placeholder="Northwind Studio GmbH" :style="{ flex: '1', border: 'none', outline: 'none', background: 'transparent', font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg)' }" />
              </div>
            </div>

            <!-- Public handle -->
            <div :style="{ marginBottom: '12px' }">
              <label :style="{ display: 'block', font: '500 13px var(--zm-font-body)', marginBottom: '6px' }">Public handle <span :style="{ color: 'var(--zm-coral-500)' }">*</span></label>
              <div :style="{ display: 'flex', alignItems: 'center', gap: '0', height: '40px', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)', overflow: 'hidden' }">
                <input v-model="handle" type="text" placeholder="northwind-studio" :style="{ flex: '1', border: 'none', outline: 'none', background: 'var(--zm-white)', font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg)', padding: '0 12px', height: '100%' }" />
                <span :style="{ padding: '0 12px', background: 'var(--zm-ink-50)', borderLeft: '1px solid var(--zm-border)', height: '100%', display: 'flex', alignItems: 'center', font: '500 13px var(--zm-font-mono)', color: 'var(--zm-fg-muted)', flexShrink: '0' }">.zeemic</span>
              </div>
              <p :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '4px 0 0' }">zeemic.com/business/your-handle</p>
            </div>

            <!-- Country + Industry -->
            <div :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }">
              <div>
                <label :style="{ display: 'block', font: '500 13px var(--zm-font-body)', marginBottom: '6px' }">Country <span :style="{ color: 'var(--zm-coral-500)' }">*</span></label>
                <ZmSelect v-model="country" :options="COUNTRIES" placeholder="Select…" />
              </div>
              <div>
                <label :style="{ display: 'block', font: '500 13px var(--zm-font-body)', marginBottom: '6px' }">Industry <span :style="{ color: 'var(--zm-coral-500)' }">*</span></label>
                <ZmSelect v-model="industry" :options="INDUSTRIES" placeholder="Select…" />
              </div>
            </div>

            <!-- Team size + Founded -->
            <div :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }">
              <div>
                <label :style="{ display: 'block', font: '500 13px var(--zm-font-body)', marginBottom: '6px' }">Team size</label>
                <ZmSelect v-model="teamSize" :options="TEAM_SIZES" placeholder="Select…" />
              </div>
              <div>
                <label :style="{ display: 'block', font: '500 13px var(--zm-font-body)', marginBottom: '6px' }">Founded</label>
                <div :style="{ display: 'flex', alignItems: 'center', gap: '0', height: '40px', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)', overflow: 'hidden' }">
                  <input v-model="founded" type="text" placeholder="YYYY" maxlength="4" :style="{ flex: '1', border: 'none', outline: 'none', background: 'var(--zm-white)', font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg)', padding: '0 12px', height: '100%' }" />
                  <span :style="{ padding: '0 10px', background: 'var(--zm-ink-50)', borderLeft: '1px solid var(--zm-border)', height: '100%', display: 'flex', alignItems: 'center', font: '500 12px var(--zm-font-mono)', color: 'var(--zm-fg-muted)', flexShrink: '0' }">year</span>
                </div>
              </div>
            </div>

            <!-- Work email -->
            <div :style="{ marginBottom: '18px' }">
              <label :style="{ display: 'block', font: '500 13px var(--zm-font-body)', marginBottom: '6px' }">Work email <span :style="{ color: 'var(--zm-coral-500)' }">*</span></label>
              <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', height: '40px', padding: '0 12px', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)' }">
                <ZmIcon name="mail" :size="16" color="var(--zm-fg-muted)" />
                <input v-model="workEmail" type="email" placeholder="hello@yourbusiness.com" :style="{ flex: '1', border: 'none', outline: 'none', background: 'transparent', font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg)' }" />
              </div>
              <p :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '4px 0 0' }">We'll send your verification code here.</p>
            </div>

            <!-- Apply for Verified toggle card -->
            <div :style="{ padding: '14px', background: 'var(--zm-gold-100)', border: '1px solid var(--zm-gold-300)', borderRadius: 'var(--zm-r-md)', display: 'flex', alignItems: 'flex-start', gap: '12px' }">
              <ZmIcon name="badge_check" :size="18" color="var(--zm-gold-700)" :style="{ marginTop: '2px', flexShrink: '0' }" />
              <div :style="{ flex: '1' }">
                <div :style="{ font: '600 13px var(--zm-font-body)' }">Apply for Verified status now</div>
                <div :style="{ font: '400 12px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: '2px' }">Skip and you'll launch as an unverified business — you can apply any time from settings.</div>
              </div>
              <ZmToggle v-model="applyVerified" />
            </div>

            <!-- Terms checkbox -->
            <div :style="{ marginTop: '14px', marginBottom: '20px' }">
              <label :style="{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }">
                <div
                  :style="{
                    width: '18px', height: '18px', borderRadius: '4px', flexShrink: '0', marginTop: '1px',
                    background: agreedToTerms ? 'var(--zm-ink-700)' : 'var(--zm-white)',
                    border: `1.5px solid ${agreedToTerms ? 'var(--zm-ink-700)' : 'var(--zm-border-strong)'}`,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--zm-paper)',
                  }"
                  @click="agreedToTerms = !agreedToTerms"
                >
                  <ZmIcon v-if="agreedToTerms" name="check" :size="13" color="var(--zm-paper)" :stroke="2.6" />
                </div>
                <span :style="{ font: '400 12.5px/1.45 var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">
                  I agree to the <NuxtLink to="/terms" :style="{ color: 'var(--zm-ink-950)', fontWeight: '600', textDecoration: 'none' }">Business Terms</NuxtLink> and confirm I'm authorised to register this business.
                </span>
              </label>
            </div>

            <p v-if="formError" :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-coral-500)', margin: '-8px 0 12px' }">{{ formError }}</p>

            <ZmButton variant="primary" size="lg" :full="true" icon-right="arrow_right" :loading="submitting" :disabled="submitting" @click="submit">
              {{ submitting ? 'Creating business…' : 'Create business and continue' }}
            </ZmButton>
          </div>

          <p :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textAlign: 'center', marginTop: '20px' }">
            Already managing a business? <NuxtLink to="/login" :style="{ color: 'var(--zm-ink-700)', fontWeight: '600', textDecoration: 'none' }">Sign in</NuxtLink>
          </p>
        </div>
      </div>

    </div>
  </template>
</template>
