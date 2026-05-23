<script setup lang="ts">
const route = useRoute()
const { product: skill, pending } = useMarketplaceProduct(computed(() => route.params.slug as string))
useHead(() => ({ title: `${skill.value?.title ?? 'Skill'} — Zeemic Skills` }))
const { isMobile, isTablet } = useBreakpoint()

const packages = [
  { name: 'Heuristic', desc: '1 evaluator, 5 days, async report', price: 600 },
  { name: 'Sprint', desc: '5 participants, recorded sessions, report + readout', price: 1800, featured: true },
  { name: 'Deep dive', desc: '8 participants, longitudinal, full team workshop', price: 3400 },
]
const reviews = [
  { name: 'John Doe', biz: 'Acme Corp', date: 'May 2026', rating: 5, body: 'Excellent work, very thorough. Brought research insights to a team that had never run usability studies before.' },
  { name: 'Sarah Kim', biz: 'TechStart', date: 'Apr 2026', rating: 4, body: 'Good sessions, minor delays on the report. Would absolutely book again — the readout was particularly sharp.' },
]

// Booking drawer state
const bookingOpen = ref(false)
const selectedPackage = ref(packages[1])
const bookingDate = ref('')
const bookingMessage = ref('')

const bookingServiceFee = computed(() => selectedPackage.value.price * 0.05)
const bookingTotal = computed(() => {
  const total = selectedPackage.value.price * 1.05
  return '$' + total.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
})

const skillMeta = [['Delivery', 'Remote'], ['Response', '< 24 hr'], ['Languages', 'English · Twi'], ['Member since', 'Mar 2024']]
const contactInfo = [['Name', 'Enoch Boison'], ['Email', 'enoch@zeemic.com'], ['Company', '—']]

const mSelectedPackage = ref(packages[1])
</script>
<template>
  <!-- Mobile native -->
  <div v-if="isMobile" :style="{ background: 'var(--zm-paper)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }">
    <template v-if="skill">
      <!-- Scrollable content -->
      <div :style="{ flex: '1', overflowY: 'auto', paddingBottom: '100px' }">
        <!-- Top bar -->
        <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 16px 8px' }">
          <NuxtLink to="/skills" style="text-decoration:none"><ZmIconButton icon="chevron_left" :size="36" /></NuxtLink>
          <div :style="{ display: 'flex', gap: '4px' }">
            <ZmIconButton icon="paperclip" :size="36" />
            <ZmIconButton icon="heart" :size="36" />
          </div>
        </div>

        <!-- Skill thumb -->
        <ZmSkillThumb :category="skill.category" :motif="skill.motif" :height="220" />

        <!-- Content -->
        <div :style="{ padding: '20px' }">
          <!-- Badges -->
          <div :style="{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }">
            <ZmBadge tone="success" dot size="sm">Available</ZmBadge>
            <ZmBadge tone="gold" size="sm">Verified</ZmBadge>
          </div>

          <!-- Title -->
          <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '34px', lineHeight: '1.05', letterSpacing: '-0.025em', margin: '0 0 14px' }">{{ skill.title }}</h1>

          <!-- Seller row -->
          <div :style="{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }">
            <ZmAvatar :name="skill.seller" :size="32" />
            <div :style="{ flex: 1, minWidth: 0 }">
              <div :style="{ font: '600 13px var(--zm-font-body)' }">{{ skill.seller }}</div>
              <div :style="{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ skill.location }}</div>
            </div>
            <ZmRating :value="skill.rating" :count="skill.reviews" :size="12" />
          </div>

          <!-- Price box -->
          <div :style="{ marginTop: '22px', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)', padding: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }">
            <div>
              <div class="zm-eyebrow">From</div>
              <span :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '32px', letterSpacing: '-0.025em', lineHeight: '1' }">${{ skill.price }}</span>
              <span :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ skill.unit }}</span>
            </div>
            <ZmBadge tone="emerald">3 packages</ZmBadge>
          </div>

          <!-- About -->
          <section :style="{ marginTop: '22px' }">
            <div class="zm-eyebrow">About this skill</div>
            <p :style="{ font: '400 14px/1.55 var(--zm-font-body)', margin: '10px 0 0' }">{{ skill.blurb }}</p>
          </section>

          <!-- Packages -->
          <section :style="{ marginTop: '22px' }">
            <div class="zm-eyebrow">Packages</div>
            <div :style="{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }">
              <div
                v-for="p in packages"
                :key="p.name"
                :style="{
                  padding: '14px',
                  borderRadius: 'var(--zm-r-md)',
                  background: mSelectedPackage.name === p.name ? 'var(--zm-ink-900)' : 'var(--zm-white)',
                  color: mSelectedPackage.name === p.name ? 'var(--zm-fg-on-dark)' : 'inherit',
                  border: mSelectedPackage.name === p.name ? '1px solid var(--zm-ink-900)' : '1px solid var(--zm-border)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }"
                @click="mSelectedPackage = p"
              >
                <div>
                  <div :style="{ font: '600 14px var(--zm-font-body)' }">{{ p.name }}</div>
                  <div :style="{ font: '400 12px var(--zm-font-body)', color: mSelectedPackage.name === p.name ? 'var(--zm-fg-on-dark-muted)' : 'var(--zm-fg-muted)', marginTop: '4px' }">{{ p.desc }}</div>
                </div>
                <div :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '22px', letterSpacing: '-0.02em', flexShrink: '0', marginLeft: '12px' }">${{ p.price.toLocaleString() }}</div>
              </div>
            </div>
          </section>

          <!-- Reviews -->
          <section :style="{ marginTop: '24px' }">
            <div class="zm-eyebrow">Reviews</div>
            <ZmRating :value="skill.rating" :count="skill.reviews" :size="13" :style="{ marginTop: '8px' }" />
            <div v-if="reviews[0]" :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)', padding: '14px', marginTop: '12px' }">
              <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }">
                <ZmAvatar :name="reviews[0].name" :size="24" />
                <span :style="{ font: '600 12px var(--zm-font-body)' }">{{ reviews[0].name }}</span>
                <span style="flex:1" />
                <div :style="{ display: 'flex', gap: '2px' }">
                  <ZmIcon v-for="j in 5" :key="j" name="star_fill" :size="10" :color="j <= reviews[0].rating ? 'var(--zm-gold-500)' : 'var(--zm-grey-300)'" />
                </div>
              </div>
              <p :style="{ font: '400 13px/1.5 var(--zm-font-body)', margin: '0' }">"{{ reviews[0].body }}"</p>
            </div>
          </section>
        </div>
      </div>

      <!-- Sticky CTA -->
      <div :style="{ position: 'fixed', bottom: '0', left: '0', right: '0', padding: '14px 20px 32px', background: 'var(--zm-paper)', borderTop: '1px solid var(--zm-border)', boxShadow: '0 -4px 20px rgba(0,0,0,0.08)', display: 'flex', gap: '8px', zIndex: '100' }">
        <ZmButton variant="secondary" size="lg" icon="message" />
        <ZmButton variant="accent" size="lg" :full="true">Get quote</ZmButton>
        <ZmButton variant="primary" size="lg" :full="true" @click="bookingOpen = true">Book now</ZmButton>
      </div>

      <!-- Booking drawer (shared with desktop) -->
      <ZmDrawer
        :open="bookingOpen"
        title="Booking request"
        :subtitle="skill.title"
        width="100%"
        :style="{ maxWidth: '100vw' }"
        @close="bookingOpen = false"
      >
        <div :style="{ display: 'flex', flexDirection: 'column', gap: '22px' }">
          <div>
            <div class="zm-eyebrow" style="margin-bottom:10px">Select package</div>
            <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }">
              <div
                v-for="p in packages"
                :key="p.name"
                :style="{
                  padding: '14px',
                  borderRadius: 'var(--zm-r-md)',
                  background: selectedPackage.name === p.name ? 'var(--zm-ink-900)' : 'var(--zm-white)',
                  color: selectedPackage.name === p.name ? 'var(--zm-fg-on-dark)' : 'inherit',
                  border: selectedPackage.name === p.name ? '2px solid var(--zm-ink-900)' : '1px solid var(--zm-border)',
                  cursor: 'pointer',
                }"
                @click="selectedPackage = p"
              >
                <div :style="{ font: '500 12px var(--zm-font-body)', opacity: '0.7', marginBottom: '4px' }">{{ p.name }}</div>
                <div :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '16px', fontWeight: '600', letterSpacing: '-0.01em' }">${{ p.price.toLocaleString() }}</div>
              </div>
            </div>
          </div>
          <div>
            <div class="zm-eyebrow" style="margin-bottom:10px">Preferred start date</div>
            <div :style="{ height: '44px', padding: '0 12px', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)', display: 'flex', alignItems: 'center', gap: '8px' }">
              <ZmIcon name="calendar" :size="14" color="var(--zm-fg-muted)" />
              <input v-model="bookingDate" type="date" :style="{ flex: '1', border: 'none', outline: 'none', background: 'transparent', font: '500 13px var(--zm-font-body)', color: 'var(--zm-ink-900)' }" />
            </div>
          </div>
          <div>
            <div class="zm-eyebrow" style="margin-bottom:10px">Message to seller <span style="font-weight:400;text-transform:none;opacity:0.6">(optional)</span></div>
            <textarea v-model="bookingMessage" placeholder="Tell the seller what you need..." :style="{ width: '100%', boxSizing: 'border-box', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)', padding: '12px', minHeight: '96px', font: '400 14px var(--zm-font-body)', outline: 'none', resize: 'vertical', background: 'var(--zm-white)', color: 'var(--zm-ink-900)' }" />
          </div>
          <div :style="{ background: 'var(--zm-ink-50)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)', padding: '16px' }">
            <div :style="{ font: '600 13px var(--zm-font-body)', marginBottom: '10px' }">Your contact</div>
            <div :style="{ display: 'flex', flexDirection: 'column', gap: '8px' }">
              <div v-for="[k,v] in contactInfo" :key="k" :style="{ display: 'flex', justifyContent: 'space-between', font: '500 13px var(--zm-font-body)' }">
                <span :style="{ color: 'var(--zm-fg-muted)' }">{{ k }}</span>
                <span>{{ v }}</span>
              </div>
            </div>
          </div>
          <div :style="{ borderTop: '1px solid var(--zm-border)', paddingTop: '18px' }">
            <div :style="{ display: 'flex', justifyContent: 'space-between', font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginBottom: '6px' }">
              <span>{{ selectedPackage.name }} package</span><span>${{ selectedPackage.price.toLocaleString() }}</span>
            </div>
            <div :style="{ display: 'flex', justifyContent: 'space-between', font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginBottom: '14px' }">
              <span>Service fee (5%)</span><span>${{ bookingServiceFee.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</span>
            </div>
            <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }">
              <span :style="{ font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">Total</span>
              <span :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '28px', letterSpacing: '-0.02em', fontWeight: '600' }">{{ bookingTotal }}</span>
            </div>
          </div>
        </div>
        <template #footer>
          <ZmButton variant="primary" size="lg" :full="true" icon-right="arrow_right">Submit booking request</ZmButton>
          <div :style="{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textAlign: 'center', marginTop: '10px' }">No charge until the seller accepts. Payment held in escrow.</div>
        </template>
      </ZmDrawer>
    </template>
  </div>

  <!-- Desktop -->
  <div v-else class="zm-root" style="background:var(--zm-paper);min-height:100vh">
    <ZmHeader active="exchange" />

    <!-- Loading skeleton -->
    <template v-if="pending && !skill">
      <div :style="{ padding: '24px 80px 0', display: 'flex', gap: '8px', alignItems: 'center' }">
        <ZmSkeleton :height="13" width="60px" :inline="true" />
        <ZmSkeleton :height="13" width="6px" :inline="true" />
        <ZmSkeleton :height="13" width="40px" :inline="true" />
        <ZmSkeleton :height="13" width="6px" :inline="true" />
        <ZmSkeleton :height="13" width="160px" :inline="true" />
      </div>
      <div :style="{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '48px', padding: '32px 80px 64px' }">
        <!-- Left -->
        <div :style="{ display: 'flex', flexDirection: 'column', gap: '32px' }">
          <div>
            <div :style="{ display: 'flex', gap: '10px', marginBottom: '16px' }">
              <ZmSkeleton :height="24" width="80px" radius="var(--zm-r-full)" :inline="true" />
              <ZmSkeleton :height="24" width="110px" radius="var(--zm-r-full)" :inline="true" />
              <ZmSkeleton :height="24" width="96px" radius="var(--zm-r-full)" :inline="true" />
            </div>
            <ZmSkeleton :height="68" radius="var(--zm-r-sm)" style="max-width:680px;margin-bottom:10px" />
            <ZmSkeleton :height="52" width="55%" radius="var(--zm-r-sm)" />
            <div :style="{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '24px' }">
              <ZmSkeleton :width="44" :height="44" radius="50%" :inline="true" style="flex-shrink:0" />
              <div :style="{ display: 'flex', flexDirection: 'column', gap: '6px' }">
                <ZmSkeleton :height="15" width="120px" />
                <ZmSkeleton :height="13" width="170px" />
              </div>
              <ZmSkeleton :height="32" width="1px" :inline="true" style="flex-shrink:0;background:var(--zm-border)" />
              <ZmSkeleton :height="14" width="100px" />
            </div>
          </div>
          <ZmSkeleton :height="320" radius="var(--zm-r-lg)" />
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '8px' }">
            <ZmSkeleton :height="11" width="90px" />
            <ZmSkeleton :height="17" />
            <ZmSkeleton :height="17" />
            <ZmSkeleton :height="17" width="70%" />
          </div>
          <ZmSkeleton :height="200" radius="var(--zm-r-lg)" />
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '12px' }">
            <ZmSkeleton :height="11" width="65px" />
            <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }">
              <ZmSkeleton v-for="i in 3" :key="i" :height="160" radius="var(--zm-r-lg)" />
            </div>
          </div>
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '12px' }">
            <ZmSkeleton :height="11" width="55px" />
            <ZmSkeleton :height="110" radius="var(--zm-r-lg)" />
            <ZmSkeleton :height="110" radius="var(--zm-r-lg)" />
          </div>
        </div>
        <!-- Right sticky panel -->
        <aside>
          <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', padding: '24px', boxShadow: 'var(--zm-shadow-md)', display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '84px' }">
            <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }">
              <ZmSkeleton :height="56" width="110px" radius="var(--zm-r-sm)" />
              <ZmSkeleton :height="14" width="80px" />
            </div>
            <ZmSkeleton :height="48" radius="var(--zm-r-md)" />
            <ZmSkeleton :height="48" radius="var(--zm-r-md)" />
            <div :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }">
              <ZmSkeleton :height="40" radius="var(--zm-r-md)" />
              <ZmSkeleton :height="40" radius="var(--zm-r-md)" />
            </div>
            <ZmSkeleton :height="40" radius="var(--zm-r-md)" />
            <ZmSkeleton :height="1" />
            <div :style="{ display: 'flex', flexDirection: 'column', gap: '10px' }">
              <div v-for="i in 4" :key="i" :style="{ display: 'flex', justifyContent: 'space-between' }">
                <ZmSkeleton :height="13" width="55px" />
                <ZmSkeleton :height="13" width="90px" />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </template>

    <template v-else-if="skill">

    <div :style="{ padding: isMobile ? '16px 16px 0' : '24px 80px 0', display: 'flex', gap: '8px', font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">
      <NuxtLink to="/exchange" style="text-decoration:none;color:inherit">Exchange</NuxtLink>
      <ZmIcon name="chevron_right" :size="14" color="var(--zm-fg-muted)" />
      <NuxtLink to="/skills" style="text-decoration:none;color:inherit">Skills</NuxtLink>
      <ZmIcon name="chevron_right" :size="14" color="var(--zm-fg-muted)" />
      <span :style="{ color: 'var(--zm-ink-950)' }">{{ skill.title }}</span>
    </div>

    <div :style="{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 380px', gap: '48px', padding: isMobile ? '0' : '32px 80px 64px' }">
      <!-- Left content -->
      <div :style="{ display: 'flex', flexDirection: 'column', gap: '32px', minWidth: '0', padding: isMobile ? '16px 16px 0' : '0' }">
        <div>
          <div :style="{ display: 'flex', gap: '10px', marginBottom: '16px' }">
            <ZmBadge tone="emerald">{{ skill.category }}</ZmBadge>
            <ZmBadge tone="success" dot>Available now</ZmBadge>
            <ZmBadge tone="gold">Verified seller</ZmBadge>
          </div>
          <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: isMobile ? '32px' : '64px', lineHeight: '1.02', letterSpacing: '-0.025em', margin: '0', maxWidth: '760px' }">{{ skill.title }}</h1>
          <div :style="{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '24px' }">
            <ZmAvatar :name="skill.seller" :size="44" />
            <div>
              <div :style="{ font: '600 15px var(--zm-font-body)' }">{{ skill.seller }}</div>
              <div :style="{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">Product Designer · {{ skill.location }}</div>
            </div>
            <span :style="{ width: '1px', height: '32px', background: 'var(--zm-border)' }" />
            <ZmRating :value="skill.rating" :count="skill.reviews" :size="14" />
          </div>
        </div>

        <ZmSkillThumb :category="skill.category" :motif="skill.motif" :height="320" :style="{ borderRadius: 'var(--zm-r-lg)' }" />

        <section>
          <div class="zm-eyebrow">About this skill</div>
          <p :style="{ font: '400 17px/1.55 var(--zm-font-body)', marginTop: '14px', maxWidth: '720px' }">{{ skill.blurb }}</p>
        </section>

        <section :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', padding: '28px' }">
          <div class="zm-eyebrow">What's included</div>
          <div :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 28px', marginTop: '16px' }">
            <div v-for="line in ['Remote moderated sessions (up to 8 participants)','Participant recruitment + screening','Session recordings with timestamped highlight reel','Full written research report (PDF)','Stakeholder readout (60 min Zoom)','One round of follow-up Q&A']" :key="line" :style="{ display: 'flex', gap: '12px', alignItems: 'flex-start' }">
              <div :style="{ width: '22px', height: '22px', borderRadius: '11px', background: 'var(--zm-ink-700)', color: 'var(--zm-paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0', marginTop: '1px' }">
                <ZmIcon name="check" :size="13" />
              </div>
              <span :style="{ font: '400 15px/1.4 var(--zm-font-body)' }">{{ line }}</span>
            </div>
          </div>
        </section>

        <section>
          <div class="zm-eyebrow">Packages</div>
          <div :style="{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: '16px', marginTop: '16px' }">
            <div v-for="p in packages" :key="p.name" :style="{ background: p.featured ? 'var(--zm-ink-900)' : 'var(--zm-white)', color: p.featured ? 'var(--zm-fg-on-dark)' : 'inherit', border: p.featured ? '1px solid var(--zm-ink-900)' : '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }">
              <span v-if="p.featured" :style="{ position: 'absolute', top: '16px', right: '16px', padding: '3px 8px', background: 'var(--zm-gold-500)', color: 'var(--zm-ink-950)', borderRadius: 'var(--zm-r-full)', font: '600 10px var(--zm-font-body)', textTransform: 'uppercase' }">Most booked</span>
              <div :style="{ font: '600 14px var(--zm-font-body)' }">{{ p.name }}</div>
              <p :style="{ font: '400 13px/1.4 var(--zm-font-body)', color: p.featured ? 'var(--zm-fg-on-dark-muted)' : 'var(--zm-fg-muted)', margin: '0', minHeight: '36px' }">{{ p.desc }}</p>
              <div :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '36px', letterSpacing: '-0.02em', marginTop: '8px' }" class="zm-num-tab">${{ p.price.toLocaleString() }}</div>
              <ZmButton :variant="p.featured ? 'accent' : 'secondary'" size="md" :full="true" style="margin-top:4px" @click="selectedPackage = p; bookingOpen = true">Select</ZmButton>
            </div>
          </div>
        </section>

        <section>
          <div class="zm-eyebrow">Reviews</div>
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }">
            <div v-for="r in reviews" :key="r.name" :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', padding: '20px' }">
              <div :style="{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }">
                <ZmAvatar :name="r.name" :size="32" />
                <div>
                  <div :style="{ font: '600 14px var(--zm-font-body)' }">{{ r.name }} · <span :style="{ color: 'var(--zm-fg-muted)', fontWeight: '400' }">{{ r.biz }}</span></div>
                  <div :style="{ display: 'flex', gap: '2px', marginTop: '2px' }">
                    <ZmIcon v-for="j in 5" :key="j" name="star_fill" :size="11" :color="j <= r.rating ? 'var(--zm-gold-500)' : 'var(--zm-grey-300)'" />
                  </div>
                </div>
                <span style="flex:1" />
                <span :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ r.date }}</span>
              </div>
              <p :style="{ font: '400 15px/1.5 var(--zm-font-body)', margin: '0' }">{{ r.body }}</p>
            </div>
          </div>
        </section>
      </div>

      <!-- Right action panel (sticky) -->
      <aside :style="{ padding: isMobile ? '0 16px 16px' : '0' }">
        <div :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', padding: '24px', boxShadow: 'var(--zm-shadow-md)', display: 'flex', flexDirection: 'column', gap: '16px', position: isMobile ? 'static' : 'sticky', top: '84px' }">
          <div :style="{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }">
            <div>
              <div class="zm-eyebrow">From</div>
              <div :style="{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '4px' }">
                <span :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '48px', letterSpacing: '-0.025em', lineHeight: '1' }" class="zm-num-tab">${{ skill.price ?? 'RFQ' }}</span>
                <span v-if="skill.price" :style="{ font: '400 16px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ skill.unit }}</span>
              </div>
            </div>
            <ZmRating :value="skill.rating" :count="skill.reviews" :size="13" />
          </div>
          <ZmButton variant="primary" size="lg" :full="true" icon-right="arrow_right" @click="bookingOpen = true">Book now</ZmButton>
          <ZmButton variant="accent" size="lg" :full="true">Request a quote</ZmButton>
          <div :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }">
            <ZmButton variant="secondary" size="md" icon="file_text">Proposal</ZmButton>
            <ZmButton variant="secondary" size="md" icon="download">Brochure</ZmButton>
          </div>
          <ZmButton variant="ghost" size="md" icon="message" :full="true">Send a message</ZmButton>
          <div :style="{ height: '1px', background: 'var(--zm-border)' }" />
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '10px' }">
            <div v-for="[k,v] in skillMeta" :key="k" :style="{ display: 'flex', justifyContent: 'space-between', font: '500 13px var(--zm-font-body)' }">
              <span :style="{ color: 'var(--zm-fg-muted)' }">{{ k }}</span>
              <span>{{ v }}</span>
            </div>
          </div>
          <div :style="{ height: '1px', background: 'var(--zm-border)' }" />
          <div>
            <div class="zm-eyebrow" style="margin-bottom:10px">Share</div>
            <div :style="{ display: 'flex', gap: '6px' }">
              <ZmIconButton icon="external" :size="32" variant="surface" />
              <ZmIconButton icon="paperclip" :size="32" variant="surface" />
              <ZmIconButton icon="message" :size="32" variant="surface" />
              <span style="flex:1" />
              <ZmIconButton icon="heart" :size="32" variant="surface" />
            </div>
          </div>
        </div>
      </aside>
    </div>
    <ExchangeAppFooter />

    <!-- Booking drawer -->
    <ZmDrawer
      :open="bookingOpen"
      title="Booking request"
      :subtitle="skill.title"
      :width="isMobile ? '100%' : 520"
      :style="{ maxWidth: '100vw' }"
      @close="bookingOpen = false"
    >
      <!-- Body -->
      <div :style="{ display: 'flex', flexDirection: 'column', gap: '22px' }">

        <!-- 1. Package picker -->
        <div>
          <div class="zm-eyebrow" style="margin-bottom:10px">Select package</div>
          <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }">
            <div
              v-for="p in packages"
              :key="p.name"
              :style="{
                padding: '14px',
                borderRadius: 'var(--zm-r-md)',
                background: selectedPackage.name === p.name ? 'var(--zm-ink-900)' : 'var(--zm-white)',
                color: selectedPackage.name === p.name ? 'var(--zm-fg-on-dark)' : 'inherit',
                border: selectedPackage.name === p.name ? '2px solid var(--zm-ink-900)' : '1px solid var(--zm-border)',
                cursor: 'pointer',
              }"
              @click="selectedPackage = p"
            >
              <div :style="{ font: '500 12px var(--zm-font-body)', opacity: '0.7', marginBottom: '4px' }">{{ p.name }}</div>
              <div :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '16px', fontWeight: '600', letterSpacing: '-0.01em' }">${{ p.price.toLocaleString() }}</div>
            </div>
          </div>
        </div>

        <!-- 2. Preferred start date -->
        <div>
          <div class="zm-eyebrow" style="margin-bottom:10px">Preferred start date</div>
          <div :style="{
            height: '44px',
            padding: '0 12px',
            background: 'var(--zm-white)',
            border: '1px solid var(--zm-border)',
            borderRadius: 'var(--zm-r-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }">
            <ZmIcon name="calendar" :size="14" color="var(--zm-fg-muted)" />
            <input
              v-model="bookingDate"
              type="date"
              :style="{ flex: '1', border: 'none', outline: 'none', background: 'transparent', font: '500 13px var(--zm-font-body)', color: 'var(--zm-ink-900)' }"
            />
          </div>
        </div>

        <!-- 3. Message to seller -->
        <div>
          <div class="zm-eyebrow" style="margin-bottom:10px">Message to seller <span style="font-weight:400;text-transform:none;opacity:0.6">(optional)</span></div>
          <textarea
            v-model="bookingMessage"
            placeholder="Tell the seller what you need..."
            :style="{
              width: '100%',
              boxSizing: 'border-box',
              border: '1px solid var(--zm-border)',
              borderRadius: 'var(--zm-r-md)',
              padding: '12px',
              minHeight: '96px',
              font: '400 14px var(--zm-font-body)',
              outline: 'none',
              resize: 'vertical',
              background: 'var(--zm-white)',
              color: 'var(--zm-ink-900)',
            }"
          />
        </div>

        <!-- 4. Contact info panel -->
        <div :style="{
          background: 'var(--zm-ink-50)',
          border: '1px solid var(--zm-border)',
          borderRadius: 'var(--zm-r-md)',
          padding: '16px',
        }">
          <div :style="{ font: '600 13px var(--zm-font-body)', marginBottom: '10px' }">Your contact</div>
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '8px' }">
            <div v-for="[k,v] in contactInfo" :key="k" :style="{ display: 'flex', justifyContent: 'space-between', font: '500 13px var(--zm-font-body)' }">
              <span :style="{ color: 'var(--zm-fg-muted)' }">{{ k }}</span>
              <span>{{ v }}</span>
            </div>
          </div>
        </div>

        <!-- 5. Order summary -->
        <div :style="{ borderTop: '1px solid var(--zm-border)', paddingTop: '18px' }">
          <div :style="{ display: 'flex', justifyContent: 'space-between', font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginBottom: '6px' }">
            <span>{{ selectedPackage.name }} package</span>
            <span>${{ selectedPackage.price.toLocaleString() }}</span>
          </div>
          <div :style="{ display: 'flex', justifyContent: 'space-between', font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginBottom: '14px' }">
            <span>Service fee (5%)</span>
            <span>${{ bookingServiceFee.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</span>
          </div>
          <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }">
            <span :style="{ font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">Total</span>
            <span :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '28px', letterSpacing: '-0.02em', fontWeight: '600' }">{{ bookingTotal }}</span>
          </div>
        </div>
      </div>

      <!-- Footer slot -->
      <template #footer>
        <ZmButton variant="primary" size="lg" :full="true" icon-right="arrow_right">Submit booking request</ZmButton>
        <div :style="{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textAlign: 'center', marginTop: '10px' }">
          No charge until the seller accepts. Payment held in escrow.
        </div>
      </template>
    </ZmDrawer>

    </template><!-- end v-else-if="skill" -->
  </div>
</template>
