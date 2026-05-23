<script setup lang="ts">
const route = useRoute()
const { portfolio: recruiter, pending } = useMarketplacePortfolio(computed(() => route.params.slug as string))
const { projects: jobs } = useMarketplaceProjects()
const { isMobile } = useBreakpoint()

useHead(() => ({ title: `${recruiter.value?.name ?? 'Recruiter'} — Recruiter Profile` }))
</script>
<template>
  <div class="zm-root" style="background:var(--zm-paper);min-height:100vh">

    <!-- Mobile -->
    <template v-if="isMobile">
      <div style="background:var(--zm-paper);min-height:100vh">
        <div v-if="recruiter" :style="{ display: 'flex', flexDirection: 'column', height: '100vh' }">
          <!-- Scrollable content -->
          <div :style="{ flex: 1, overflowY: 'auto' }">
            <!-- Dark hero area -->
            <div :style="{ background: 'var(--zm-ink-900)' }">
              <ZmMNavBar title="" leftLabel="Recruiters" :transparent="true" @back="$router.push('/recruiters')">
                <template #right>
                  <ZmIconButton icon="bookmark" :size="36" />
                </template>
              </ZmMNavBar>

              <!-- Hero -->
              <div :style="{ padding: '24px 20px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }">
                <!-- Decorative R. -->
                <div aria-hidden :style="{ position: 'absolute', right: '-40px', top: '-40px', fontFamily: 'var(--zm-font-display)', fontSize: '280px', color: 'rgba(245,241,232,0.04)', letterSpacing: '-0.04em', fontStyle: 'italic', lineHeight: '1', pointerEvents: 'none' }">R.</div>

                <div :style="{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }">
                  <ZmAvatar :name="recruiter.name" :size="96" :ring="true" />
                </div>

                <!-- Badges -->
                <div :style="{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '10px' }">
                  <ZmBadge tone="onDark"><ZmIcon name="badge_check" :size="11" color="var(--zm-gold-500)" /> Verified</ZmBadge>
                  <ZmBadge tone="gold">Top 5%</ZmBadge>
                </div>

                <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '36px', lineHeight: '1', letterSpacing: '-0.025em', margin: '0 0 6px', color: 'var(--zm-fg-on-dark)' }">{{ recruiter.name }}</h1>
                <div :style="{ font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg-on-dark-muted)' }">{{ recruiter.title }} · {{ recruiter.business }}</div>

                <!-- Location + response -->
                <div :style="{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }">
                  <ZmBadge tone="onDark" style="font-size:12px"><ZmIcon name="map_pin" :size="11" color="var(--zm-gold-500)" /> {{ recruiter.location }}</ZmBadge>
                  <ZmBadge tone="onDark" style="font-size:12px"><ZmIcon name="bolt" :size="11" color="var(--zm-gold-500)" /> Responds {{ recruiter.response }}</ZmBadge>
                </div>

                <!-- Stats row -->
                <div :style="{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }">
                  <div :style="{ background: 'rgba(245,241,232,0.08)', border: '1px solid rgba(245,241,232,0.14)', borderRadius: 'var(--zm-r-md)', padding: '12px 20px', textAlign: 'center' }">
                    <div :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '22px', lineHeight: '1', color: 'var(--zm-fg-on-dark)' }">{{ recruiter.placements }}</div>
                    <div :style="{ font: '500 10px var(--zm-font-body)', color: 'var(--zm-fg-on-dark-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '4px' }">Placed</div>
                  </div>
                  <div :style="{ background: 'rgba(245,241,232,0.08)', border: '1px solid rgba(245,241,232,0.14)', borderRadius: 'var(--zm-r-md)', padding: '12px 20px', textAlign: 'center' }">
                    <ZmRating :value="recruiter.rating" :size="14" color="var(--zm-paper)" />
                    <div :style="{ font: '500 10px var(--zm-font-body)', color: 'var(--zm-fg-on-dark-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '4px' }">Rating</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Content section -->
            <div :style="{ background: 'var(--zm-paper)', borderRadius: '24px 24px 0 0', padding: '24px 20px 100px', marginTop: '-1px' }">
              <!-- Quote -->
              <blockquote v-if="recruiter.quote" :style="{ margin: '0 0 24px', padding: '16px 18px', background: 'var(--zm-white)', borderLeft: '3px solid var(--zm-gold-500)', borderRadius: 'var(--zm-r-md)', fontFamily: 'var(--zm-font-display)', fontStyle: 'italic', fontSize: '17px', lineHeight: '1.4' }">"{{ recruiter.quote }}"</blockquote>

              <!-- Specialties -->
              <section :style="{ marginTop: '16px' }">
                <div class="zm-eyebrow">Specialties</div>
                <div :style="{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }">
                  <ZmChip v-for="s in recruiter.specialties" :key="s" tone="subtle">{{ s }}</ZmChip>
                </div>
              </section>

              <!-- Open roles -->
              <section :style="{ marginTop: '24px' }">
                <div class="zm-eyebrow">Open roles</div>
                <div :style="{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }">
                  <div
                    v-for="j in (jobs ?? []).slice(0,1)"
                    :key="j.id"
                    :style="{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)', padding: '14px' }"
                  >
                    <div :style="{ font: '600 14px var(--zm-font-body)', marginBottom: '4px' }">{{ j.title }}</div>
                    <div :style="{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginBottom: '8px' }">{{ j.company }} · {{ j.location }}</div>
                    <div :style="{ display: 'flex', gap: '6px' }">
                      <ZmBadge tone="emerald" size="sm">{{ j.salary }}</ZmBadge>
                      <ZmBadge size="sm">{{ j.type }}</ZmBadge>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <!-- Sticky CTA -->
          <div :style="{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '14px 20px 32px', background: 'var(--zm-paper)', borderTop: '1px solid var(--zm-border)', display: 'flex', gap: '8px', alignItems: 'center', zIndex: 50 }">
            <ZmIconButton icon="message" :size="48" />
            <ZmButton variant="accent" size="lg" :full="true">Contact recruiter</ZmButton>
          </div>
        </div>
        <div v-else-if="pending" :style="{ padding: '40px 20px', textAlign: 'center', color: 'var(--zm-fg-muted)' }">Loading…</div>
      </div>
    </template>

    <!-- Desktop -->
    <template v-else>
      <ZmHeader active="exchange" />

      <!-- Loading skeleton -->
      <template v-if="pending && !recruiter">
        <!-- Dark hero skeleton -->
        <section :style="{ background: 'var(--zm-ink-900)', padding: '48px 80px 80px' }">
          <div :style="{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '28px' }">
            <ZmSkeleton :height="12" width="55px" radius="var(--zm-r-full)" :inline="true" style="background:rgba(245,241,232,0.12)" />
            <ZmSkeleton :height="12" width="6px" radius="var(--zm-r-full)" :inline="true" style="background:rgba(245,241,232,0.12)" />
            <ZmSkeleton :height="12" width="70px" radius="var(--zm-r-full)" :inline="true" style="background:rgba(245,241,232,0.12)" />
            <ZmSkeleton :height="12" width="6px" radius="var(--zm-r-full)" :inline="true" style="background:rgba(245,241,232,0.12)" />
            <ZmSkeleton :height="12" width="120px" radius="var(--zm-r-full)" :inline="true" style="background:rgba(245,241,232,0.12)" />
          </div>
          <div :style="{ display: 'grid', gridTemplateColumns: '160px 1fr 360px', gap: '40px', alignItems: 'flex-start' }">
            <ZmSkeleton :width="140" :height="140" radius="50%" :inline="true" style="background:rgba(245,241,232,0.12)" />
            <div :style="{ display: 'flex', flexDirection: 'column', gap: '12px' }">
              <div :style="{ display: 'flex', gap: '8px' }">
                <ZmSkeleton :height="22" width="70px" radius="var(--zm-r-full)" :inline="true" style="background:rgba(245,241,232,0.12)" />
                <ZmSkeleton :height="22" width="55px" radius="var(--zm-r-full)" :inline="true" style="background:rgba(245,241,232,0.12)" />
              </div>
              <ZmSkeleton :height="72" width="70%" radius="var(--zm-r-sm)" style="background:rgba(245,241,232,0.12)" />
              <ZmSkeleton :height="48" width="55%" radius="var(--zm-r-sm)" style="background:rgba(245,241,232,0.12)" />
              <div :style="{ display: 'flex', gap: '18px', marginTop: '8px' }">
                <ZmSkeleton :height="13" width="100px" :inline="true" style="background:rgba(245,241,232,0.12)" />
                <ZmSkeleton :height="13" width="120px" :inline="true" style="background:rgba(245,241,232,0.12)" />
                <ZmSkeleton :height="13" width="90px" :inline="true" style="background:rgba(245,241,232,0.12)" />
              </div>
            </div>
            <div :style="{ display: 'flex', flexDirection: 'column', gap: '10px' }">
              <ZmSkeleton :height="48" radius="var(--zm-r-md)" style="background:rgba(245,241,232,0.12)" />
              <ZmSkeleton :height="40" radius="var(--zm-r-md)" style="background:rgba(245,241,232,0.12)" />
              <ZmSkeleton :height="96" radius="var(--zm-r-md)" style="background:rgba(245,241,232,0.08);margin-top:10px" />
            </div>
          </div>
        </section>
        <!-- Body skeleton -->
        <div :style="{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '48px', padding: '48px 80px 80px' }">
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '32px' }">
            <ZmSkeleton :height="100" radius="var(--zm-r-md)" />
            <div :style="{ display: 'flex', flexDirection: 'column', gap: '10px' }">
              <ZmSkeleton :height="11" width="70px" />
              <div :style="{ display: 'flex', gap: '8px', flexWrap: 'wrap' }">
                <ZmSkeleton v-for="i in 4" :key="i" :height="28" :width="60 + i * 14" radius="var(--zm-r-full)" :inline="true" />
              </div>
            </div>
            <div :style="{ display: 'flex', flexDirection: 'column', gap: '10px' }">
              <ZmSkeleton :height="11" width="65px" />
              <div :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }">
                <CardsJobCard :loading="true" />
                <CardsJobCard :loading="true" />
              </div>
            </div>
          </div>
          <aside>
            <ZmSkeleton :height="200" radius="var(--zm-r-lg)" />
          </aside>
        </div>
      </template>

      <template v-else-if="recruiter">
        <!-- Hero dark section -->
        <section :style="{ background: 'var(--zm-ink-900)', color: 'var(--zm-fg-on-dark)', padding: '48px 80px 80px', position: 'relative', overflow: 'hidden' }">
          <div aria-hidden :style="{ position: 'absolute', right: '-40px', top: '-100px', fontFamily: 'var(--zm-font-display)', fontSize: '420px', color: 'rgba(245,241,232,0.04)', letterSpacing: '-0.04em', fontStyle: 'italic', lineHeight: '1', pointerEvents: 'none' }">R.</div>
          <div :style="{ display: 'flex', gap: '8px', font: '500 12px var(--zm-font-body)', color: 'var(--zm-fg-on-dark-muted)', marginBottom: '28px' }">
            <NuxtLink to="/exchange" style="text-decoration:none;color:inherit">Exchange</NuxtLink>
            <ZmIcon name="chevron_right" :size="12" color="var(--zm-fg-on-dark-muted)" />
            <NuxtLink to="/recruiters" style="text-decoration:none;color:inherit">Recruiters</NuxtLink>
            <ZmIcon name="chevron_right" :size="12" color="var(--zm-fg-on-dark-muted)" />
            <span :style="{ color: 'var(--zm-paper)' }">{{ recruiter.name }}</span>
          </div>
          <div :style="{ display: 'grid', gridTemplateColumns: '160px 1fr 360px', gap: '40px', alignItems: 'flex-start', position: 'relative' }">
            <ZmAvatar :name="recruiter.name" :size="140" :ring="true" :style="{ border: '4px solid var(--zm-paper)' }" />
            <div>
              <div :style="{ display: 'flex', gap: '10px', marginBottom: '14px' }">
                <ZmBadge tone="onDark"><ZmIcon name="badge_check" :size="11" color="var(--zm-gold-500)" /> Verified</ZmBadge>
                <ZmBadge tone="gold">Top 5%</ZmBadge>
              </div>
              <h1 :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '72px', lineHeight: '1', letterSpacing: '-0.03em', margin: '0' }">{{ recruiter.name }}</h1>
              <div :style="{ font: '400 19px var(--zm-font-body)', color: 'var(--zm-fg-on-dark-muted)', marginTop: '12px' }">{{ recruiter.title }} · {{ recruiter.business }}</div>
              <div :style="{ display: 'flex', gap: '18px', marginTop: '24px', alignItems: 'center' }">
                <span :style="{ display: 'inline-flex', alignItems: 'center', gap: '6px', font: '500 13px var(--zm-font-body)' }"><ZmIcon name="map_pin" :size="14" color="var(--zm-gold-500)" /> {{ recruiter.location }}</span>
                <span :style="{ display: 'inline-flex', alignItems: 'center', gap: '6px', font: '500 13px var(--zm-font-body)' }"><ZmIcon name="globe" :size="14" color="var(--zm-gold-500)" /> {{ recruiter.languages.join(' · ') }}</span>
                <span :style="{ display: 'inline-flex', alignItems: 'center', gap: '6px', font: '500 13px var(--zm-font-body)' }"><ZmIcon name="bolt" :size="14" color="var(--zm-gold-500)" /> Responds {{ recruiter.response }}</span>
              </div>
            </div>
            <div :style="{ display: 'flex', flexDirection: 'column', gap: '10px' }">
              <ZmButton variant="accent" size="lg" :full="true">Contact recruiter</ZmButton>
              <ZmButton variant="onDark" size="md" :full="true" icon="bookmark">Save profile</ZmButton>
              <div :style="{ marginTop: '10px', padding: '16px', background: 'rgba(245,241,232,0.06)', border: '1px solid rgba(245,241,232,0.14)', borderRadius: 'var(--zm-r-md)' }">
                <div class="zm-eyebrow" :style="{ color: 'var(--zm-fg-on-dark-muted)' }">Track record</div>
                <div :style="{ display: 'flex', alignItems: 'baseline', gap: '20px', marginTop: '8px' }">
                  <div>
                    <div :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '36px', lineHeight: '1' }" class="zm-num-tab">{{ recruiter.placements }}</div>
                    <div :style="{ font: '500 11px var(--zm-font-body)', color: 'var(--zm-fg-on-dark-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }">Placements</div>
                  </div>
                  <ZmRating :value="recruiter.rating" :count="recruiter.reviews" :size="14" color="var(--zm-paper)" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div :style="{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '48px', padding: '48px 80px 80px' }">
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '32px' }">
            <blockquote v-if="recruiter.quote" :style="{ margin: '0', padding: '32px 36px', background: 'var(--zm-white)', borderLeft: '4px solid var(--zm-gold-500)', borderRadius: 'var(--zm-r-md)', fontFamily: 'var(--zm-font-display)', fontStyle: 'italic', fontSize: '28px', lineHeight: '1.3', letterSpacing: '-0.015em' }">"{{ recruiter.quote }}"</blockquote>
            <section>
              <div class="zm-eyebrow">Specialties</div>
              <div :style="{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }">
                <ZmChip v-for="s in recruiter.specialties" :key="s" tone="subtle">{{ s }}</ZmChip>
              </div>
            </section>
            <section>
              <div class="zm-eyebrow">Open roles</div>
              <div :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '14px' }">
                <CardsJobCard v-for="j in (jobs ?? []).slice(0,2)" :key="j.id" :job="j" />
              </div>
            </section>
          </div>
          <aside :style="{ display: 'flex', flexDirection: 'column', gap: '16px' }">
            <ZmCard :padding="22">
              <div class="zm-eyebrow">Engagement</div>
              <div :style="{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }">
                <div v-for="[k,v] in [['Model','Retained search'],['Typical length','6-10 weeks'],['Guarantee','90 days'],['Fee','20% of base']]" :key="k" :style="{ display: 'flex', justifyContent: 'space-between', font: '500 13px var(--zm-font-body)' }">
                  <span :style="{ color: 'var(--zm-fg-muted)' }">{{ k }}</span><span>{{ v }}</span>
                </div>
              </div>
            </ZmCard>
          </aside>
        </div>
      </template>

      <ExchangeAppFooter />
    </template>
  </div>
</template>
