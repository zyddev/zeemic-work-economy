<script setup lang="ts">
const route = useRoute()
const { project: job, pending } = useMarketplaceProject(computed(() => route.params.id as string))
useHead(() => ({ title: `${job.value?.title ?? 'Job'} — Zeemic Jobs` }))
const { isMobile } = useBreakpoint()
const router = useRouter()
</script>
<template>
  <div style="background:var(--zm-paper);min-height:100vh">
    <!-- Mobile -->
    <template v-if="isMobile">
      <div v-if="job" :style="{ display: 'flex', flexDirection: 'column', height: '100vh' }">
        <ZmMNavBar title="Job" leftLabel="Jobs" @back="router.push('/jobs')">
          <template #right>
            <ZmIconButton icon="paperclip" :size="36" />
            <ZmIconButton icon="bookmark" :size="36" />
          </template>
        </ZmMNavBar>
        <div :style="{ flex: 1, overflowY: 'auto', padding: '20px 20px 100px' }">
          <div :style="{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '14px' }">
            <ZmAvatar :name="job.company" :size="56" :square="true" />
            <div>
              <div :style="{ font: '600 14px var(--zm-font-body)' }">{{ job.company }}</div>
              <div :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ job.location }}</div>
            </div>
          </div>
          <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '32px', lineHeight: 1.05, letterSpacing: '-0.025em', margin: 0 }">{{ job.title }}</h1>
          <div :style="{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }">
            <ZmBadge tone="emerald" size="md">{{ job.salary }}</ZmBadge>
            <ZmBadge size="md">{{ job.type }}</ZmBadge>
            <ZmBadge v-if="job.deadline" tone="gold" size="md">Deadline · {{ job.deadline }}</ZmBadge>
          </div>
          <div :style="{ marginTop: '22px' }">
            <div class="zm-eyebrow">Overview</div>
            <p :style="{ font: '400 14px/1.55 var(--zm-font-body)', marginTop: '8px' }">
              We're hiring a {{ job.title }} to lead our product practice. You'll work with engineering and product leads to ship reliable software.
            </p>
          </div>
          <div :style="{ marginTop: '22px' }">
            <div class="zm-eyebrow">What you'll do</div>
            <ul :style="{ font: '400 14px/1.6 var(--zm-font-body)', margin: '8px 0 0', paddingLeft: '20px' }">
              <li>Own end-to-end work for one platform vertical.</li>
              <li>Partner with the team to ship a quarterly roadmap.</li>
              <li>Mentor team members and lead rituals.</li>
            </ul>
          </div>
          <div v-if="job.recruiter" :style="{ marginTop: '24px', padding: '14px', background: 'var(--zm-paper)', borderRadius: 'var(--zm-r-md)', border: '1px solid var(--zm-border)' }">
            <div class="zm-eyebrow">Posted via</div>
            <div :style="{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }">
              <ZmAvatar :name="job.recruiter" :size="40" />
              <div :style="{ flex: 1 }">
                <div :style="{ font: '600 14px var(--zm-font-body)' }">{{ job.recruiter }}</div>
                <div :style="{ font: '400 11.5px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">Verified recruiter</div>
              </div>
              <ZmIcon name="chevron_right" :size="16" color="var(--zm-fg-muted)" />
            </div>
          </div>
        </div>
        <ZmMStickyCTA>
          <ZmIconButton icon="message" :size="48" />
          <ZmButton variant="dark" size="lg" :full="true" icon-right="arrow_right">Apply now</ZmButton>
        </ZmMStickyCTA>
      </div>
      <div v-else :style="{ padding: '40px 20px', textAlign: 'center', color: 'var(--zm-fg-muted)' }">Loading…</div>
    </template>
    <!-- Desktop -->
    <template v-else>
      <ZmHeader active="exchange" />
      <div v-if="job" :style="{ padding: '40px 80px 80px', maxWidth: '1280px' }">
        <div :style="{ display: 'flex', gap: '8px', font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginBottom: '24px' }">
          <NuxtLink to="/exchange" style="text-decoration:none;color:inherit">Exchange</NuxtLink>
          <ZmIcon name="chevron_right" :size="14" color="var(--zm-fg-muted)" />
          <NuxtLink to="/jobs" style="text-decoration:none;color:inherit">Jobs</NuxtLink>
          <ZmIcon name="chevron_right" :size="14" color="var(--zm-fg-muted)" />
          <span :style="{ color: 'var(--zm-ink-950)' }">{{ job.title }}</span>
        </div>
        <div :style="{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '48px' }">
          <div>
            <div :style="{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '20px' }">
              <ZmAvatar :name="job.company" :size="64" :square="true" />
              <div>
                <div :style="{ font: '600 16px var(--zm-font-body)' }">{{ job.company }}</div>
                <div :style="{ font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }">{{ job.location }}</div>
              </div>
            </div>
            <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '64px', lineHeight: 1, letterSpacing: '-0.03em', margin: '0 0 16px' }">{{ job.title }}</h1>
            <div :style="{ display: 'flex', gap: '8px', marginBottom: '32px' }">
              <ZmBadge tone="emerald">{{ job.salary }}</ZmBadge>
              <ZmBadge>{{ job.type }}</ZmBadge>
              <ZmBadge v-if="job.deadline" tone="gold">Deadline · {{ job.deadline }}</ZmBadge>
            </div>
            <div class="zm-eyebrow">Overview</div>
            <p :style="{ font: '400 17px/1.55 var(--zm-font-body)', marginTop: '14px', maxWidth: '720px' }">
              We're hiring a {{ job.title }} to lead our product practice. You'll work with engineering and product leads to ship reliable software.
            </p>
          </div>
          <aside>
            <div :style="{ position: 'sticky', top: '84px', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', padding: '24px', boxShadow: 'var(--zm-shadow-md)', display: 'flex', flexDirection: 'column', gap: '12px' }">
              <ZmButton variant="dark" size="lg" :full="true" icon-right="arrow_right">Apply now</ZmButton>
              <ZmButton variant="ghost" size="md" :full="true" icon="message">Message recruiter</ZmButton>
            </div>
          </aside>
        </div>
      </div>
      <div v-else-if="pending" :style="{ padding: '80px', textAlign: 'center', color: 'var(--zm-fg-muted)' }">Loading…</div>
      <ExchangeAppFooter />
    </template>
  </div>
</template>
