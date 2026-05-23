/* Zeemic — Skills vertical
   Standalone listing page (/skills) + skill detail (/skills/[slug]) */

// ────────────────────────────────────────────────
// Skills Listing Page (/skills)
// ────────────────────────────────────────────────
function ZmSkillsListing() {
  return (
    <div className="zm-root" style={{ width: 1440, background: 'var(--zm-paper)', minHeight: 900 }}>
      <ZmHeader active="exchange" />

      {/* Page header + breadcrumb */}
      <div style={{ padding: '40px 80px 24px', borderBottom: '1px solid var(--zm-border)' }}>
        <div style={{ display: 'flex', gap: 8, font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginBottom: 16 }}>
          <span style={{ cursor: 'pointer' }}>Exchange</span>
          <ZmIcon name="chevron_right" size={14} color="var(--zm-fg-muted)" />
          <span style={{ color: 'var(--zm-ink-950)' }}>Skills</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 64, lineHeight: 0.98, letterSpacing: '-0.03em', margin: 0 }}>
              Skills <em style={{ fontStyle: 'italic' }}>marketplace</em>
            </h1>
            <p style={{ font: '400 17px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: 12, maxWidth: 600 }}>
              Find experts ready to help. Book sessions, request quotes, or download brochures — no email back-and-forth.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>
              <span className="zm-num-tab" style={{ color: 'var(--zm-ink-950)', fontWeight: 600 }}>1,284</span> skills found
            </span>
            <ZmButton variant="dark" icon="plus">List a skill</ZmButton>
          </div>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 5,
        background: 'rgba(245,241,232,0.92)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--zm-border)',
        padding: '14px 80px',
        display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
      }}>
        <ZmChip active iconRight="close">Category: Design</ZmChip>
        <ZmChip iconRight="chevron_down">Delivery</ZmChip>
        <ZmChip iconRight="chevron_down">Price range</ZmChip>
        <ZmChip iconRight="chevron_down">Country</ZmChip>
        <ZmChip active iconRight="close">Availability: Now</ZmChip>
        <ZmChip iconRight="chevron_down">Language</ZmChip>
        <button style={{ font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0 8px' }}>
          Clear all
        </button>
        <span style={{ flex: 1 }} />
        <ZmChip tone="subtle" icon="sort" iconRight="chevron_down">Sort: Highest rated</ZmChip>
      </div>

      {/* Grid */}
      <div style={{ padding: '40px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {ZM_SKILLS.map(s => <ZmSkillCard key={s.id} skill={s} />)}
          {/* Padding cards to fill grid */}
          <ZmSkillCard skill={{ ...ZM_SKILLS[0], id: 'p1', title: 'Brand workshop with founders', motif: 1, seller: 'Lila Ngozi', location: 'Lagos, NG', price: 1200, unit: '/project', rating: 4.7, reviews: 9, blurb: 'Two-day on-site workshop to clarify positioning, voice, and visual direction.', available: 'Now' }} />
          <ZmSkillCard skill={{ ...ZM_SKILLS[2], id: 'p2', title: 'iOS App Development — MVP build', motif: 3, category: 'Development', seller: 'Theo Lambert', location: 'Cape Town, ZA', price: 12000, unit: '/project', rating: 4.9, reviews: 18, blurb: 'SwiftUI app from spec to App Store. 8-week guarantee.', available: 'Now', isBusiness: false }} />
          <ZmSkillCard skill={{ ...ZM_SKILLS[3], id: 'p3', title: 'Talent assessment & psychometrics', motif: 2, category: 'HR', seller: 'Adwoa Mensah', location: 'Accra, GH', price: 180, unit: '/candidate', rating: 4.8, reviews: 24, blurb: 'Structured interviews + psychometric reports for senior hires.', available: '2 weeks', isBusiness: false }} />
        </div>

        {/* Logged-out banner */}
        <div style={{
          marginTop: 40, padding: '28px 32px',
          background: 'var(--zm-ink-900)', color: 'var(--zm-fg-on-dark)',
          borderRadius: 'var(--zm-r-lg)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          backgroundImage: 'radial-gradient(circle at 90% 50%, rgba(242,201,76,0.15), transparent 50%)',
        }}>
          <div>
            <div className="zm-eyebrow" style={{ color: 'var(--zm-gold-500)' }}>For sellers</div>
            <h3 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 32, margin: '6px 0 0', letterSpacing: '-0.02em' }}>
              Have a skill to offer? List it on Zeemic for free.
            </h3>
          </div>
          <ZmButton variant="accent" size="lg" iconRight="arrow_right">Create a skill</ZmButton>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0 60px' }}>
          <ZmButton variant="secondary" size="lg">Load more skills</ZmButton>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Skill Detail Page (/skills/[slug])
// ────────────────────────────────────────────────
function ZmSkillDetail({ skill = ZM_SKILLS[0] }) {
  return (
    <div className="zm-root" style={{ width: 1440, background: 'var(--zm-paper)', minHeight: 900 }}>
      <ZmHeader active="exchange" />

      {/* Breadcrumb */}
      <div style={{ padding: '24px 80px 0', display: 'flex', gap: 8, font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>
        <span style={{ cursor: 'pointer' }}>Exchange</span>
        <ZmIcon name="chevron_right" size={14} color="var(--zm-fg-muted)" />
        <span style={{ cursor: 'pointer' }}>Skills</span>
        <ZmIcon name="chevron_right" size={14} color="var(--zm-fg-muted)" />
        <span style={{ color: 'var(--zm-ink-950)' }}>{skill.title}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 48, padding: '32px 80px 64px' }}>
        {/* ── LEFT — Skill content ────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, minWidth: 0 }}>
          {/* Hero */}
          <div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <ZmBadge tone="emerald">{skill.category}</ZmBadge>
              <ZmBadge tone="success" dot>Available now</ZmBadge>
              <ZmBadge tone="gold">Verified seller</ZmBadge>
            </div>
            <h1 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 64, lineHeight: 1.02, letterSpacing: '-0.025em', margin: 0, maxWidth: 760 }}>
              UX Research & <em style={{ fontStyle: 'italic' }}>Usability Testing</em>
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 24 }}>
              <ZmAvatar name={skill.seller} size={44} />
              <div>
                <div style={{ font: '600 15px var(--zm-font-body)' }}>{skill.seller}</div>
                <div style={{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>Product Designer · {skill.location}</div>
              </div>
              <span style={{ width: 1, height: 32, background: 'var(--zm-border)' }} />
              <ZmRating value={skill.rating} count={skill.reviews} size={14} />
              <span style={{ width: 1, height: 32, background: 'var(--zm-border)' }} />
              <span style={{ font: '500 13px var(--zm-font-body)' }}>
                <span className="zm-num-tab" style={{ fontWeight: 600 }}>98%</span> response · <span className="zm-num-tab" style={{ fontWeight: 600 }}>{'< 24hr'}</span>
              </span>
            </div>
          </div>

          {/* Visual hero */}
          <ZmSkillThumb category={skill.category} title="" motif={0} height={320} style={{ borderRadius: 'var(--zm-r-lg)' }} />

          {/* About */}
          <section>
            <div className="zm-eyebrow">About this skill</div>
            <p style={{ font: '400 17px/1.55 var(--zm-font-body)', color: 'var(--zm-fg)', marginTop: 14, maxWidth: 720, textWrap: 'pretty' }}>
              Moderated usability research for product teams. Over the last six years I’ve run 200+ studies for fintech, healthtech, and creator-economy products across Africa, Europe, and North America. Each engagement ships a tagged highlight reel, a written report, and a 60-minute readout for stakeholders.
            </p>
            <p style={{ font: '400 17px/1.55 var(--zm-font-body)', color: 'var(--zm-fg)', marginTop: 14, maxWidth: 720, textWrap: 'pretty' }}>
              I work in English and Twi, recruit globally, and turn around findings in five business days from kickoff.
            </p>
          </section>

          {/* What's included */}
          <section style={{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', padding: 28 }}>
            <div className="zm-eyebrow">What’s included</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 28px', marginTop: 16 }}>
              {[
                'Remote moderated sessions (up to 8 participants)',
                'Participant recruitment + screening',
                'Session recordings with timestamped highlight reel',
                'Full written research report (PDF)',
                'Stakeholder readout (60 min Zoom)',
                'One round of follow-up Q&A',
              ].map(line => (
                <div key={line} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 22, height: 22, borderRadius: 11, background: 'var(--zm-ink-700)', color: 'var(--zm-paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <ZmIcon name="check" size={13} />
                  </div>
                  <span style={{ font: '400 15px/1.4 var(--zm-font-body)' }}>{line}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Packages */}
          <section>
            <div className="zm-eyebrow">Packages</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 16 }}>
              {[
                { name: 'Heuristic', desc: '1 evaluator, 5 days, async report', price: 600 },
                { name: 'Sprint',    desc: '5 participants, recorded sessions, report + readout', price: 1800, featured: true },
                { name: 'Deep dive', desc: '8 participants, longitudinal, full team workshop', price: 3400 },
              ].map(p => (
                <div key={p.name} style={{
                  background: p.featured ? 'var(--zm-ink-900)' : 'var(--zm-white)',
                  color: p.featured ? 'var(--zm-fg-on-dark)' : 'inherit',
                  border: p.featured ? '1px solid var(--zm-ink-900)' : '1px solid var(--zm-border)',
                  borderRadius: 'var(--zm-r-lg)', padding: 24,
                  display: 'flex', flexDirection: 'column', gap: 8,
                  position: 'relative',
                }}>
                  {p.featured && <span style={{ position: 'absolute', top: 16, right: 16, padding: '3px 8px', background: 'var(--zm-gold-500)', color: 'var(--zm-ink-950)', borderRadius: 'var(--zm-r-full)', font: '600 10px var(--zm-font-body)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Most booked</span>}
                  <div style={{ font: '600 14px var(--zm-font-body)' }}>{p.name}</div>
                  <p style={{ font: `400 13px/1.4 var(--zm-font-body)`, color: p.featured ? 'var(--zm-fg-on-dark-muted)' : 'var(--zm-fg-muted)', margin: 0, minHeight: 36 }}>{p.desc}</p>
                  <div style={{ fontFamily: 'var(--zm-font-display)', fontSize: 36, letterSpacing: '-0.02em', marginTop: 8 }} className="zm-num-tab">${p.price.toLocaleString()}</div>
                  <ZmButton size="md" variant={p.featured ? 'accent' : 'secondary'} full style={{ marginTop: 4 }}>Select</ZmButton>
                </div>
              ))}
            </div>
          </section>

          {/* Reviews */}
          <section>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div className="zm-eyebrow">Reviews</div>
                <h2 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 36, letterSpacing: '-0.02em', margin: '6px 0 0' }}>
                  <ZmIcon name="star_fill" size={28} color="var(--zm-gold-500)" style={{ verticalAlign: -3 }} /> <span className="zm-num-tab">4.8</span>
                  <span style={{ font: '400 17px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginLeft: 10 }}>from 12 buyers</span>
                </h2>
              </div>
              <ZmButton variant="ghost" iconRight="arrow_right">All reviews</ZmButton>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { name: 'John Doe', biz: 'Acme Corp', date: 'May 2026', rating: 5, body: 'Excellent work, very thorough. Brought research insights to a team that had never run usability studies before, and they ran with the playbook.' },
                { name: 'Sarah Kim', biz: 'TechStart', date: 'Apr 2026', rating: 4, body: 'Good sessions, minor delays on the report. Would absolutely book again — the readout was particularly sharp.' },
              ].map((r, i) => (
                <div key={i} style={{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <ZmAvatar name={r.name} size={32} />
                    <div>
                      <div style={{ font: '600 14px var(--zm-font-body)' }}>{r.name} · <span style={{ color: 'var(--zm-fg-muted)', fontWeight: 400 }}>{r.biz}</span></div>
                      <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
                        {Array.from({ length: 5 }).map((_, j) => (
                          <ZmIcon key={j} name="star_fill" size={11} color={j < r.rating ? 'var(--zm-gold-500)' : 'var(--zm-grey-300)'} />
                        ))}
                      </div>
                    </div>
                    <span style={{ flex: 1 }} />
                    <span style={{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>{r.date}</span>
                  </div>
                  <p style={{ font: '400 15px/1.5 var(--zm-font-body)', margin: 0 }}>{r.body}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── RIGHT — Action panel ───────────────── */}
        <aside>
          <div style={{
            background: 'var(--zm-white)', border: '1px solid var(--zm-border)',
            borderRadius: 'var(--zm-r-lg)', padding: 24,
            boxShadow: 'var(--zm-shadow-md)',
            display: 'flex', flexDirection: 'column', gap: 16,
            position: 'sticky', top: 84,
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div>
                <div className="zm-eyebrow">From</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
                  <span style={{ fontFamily: 'var(--zm-font-display)', fontSize: 48, letterSpacing: '-0.025em', lineHeight: 1 }} className="zm-num-tab">$150</span>
                  <span style={{ font: '400 16px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>/hr</span>
                </div>
              </div>
              <ZmRating value={4.8} count={12} size={13} />
            </div>

            <ZmButton variant="primary" size="lg" full iconRight="arrow_right">Book now</ZmButton>
            <ZmButton variant="accent" size="lg" full>Request a quote</ZmButton>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <ZmButton variant="secondary" size="md" icon="file_text">Proposal</ZmButton>
              <ZmButton variant="secondary" size="md" icon="download">Brochure</ZmButton>
            </div>
            <ZmButton variant="ghost" size="md" icon="message" full>Send a message</ZmButton>

            <div style={{ height: 1, background: 'var(--zm-border)' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['Delivery', 'Remote'],
                ['Response', '< 24 hr'],
                ['Languages', 'English · Twi'],
                ['Member since', 'Mar 2024'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', font: '500 13px var(--zm-font-body)' }}>
                  <span style={{ color: 'var(--zm-fg-muted)' }}>{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ height: 1, background: 'var(--zm-border)' }} />

            <div>
              <div className="zm-eyebrow" style={{ marginBottom: 10 }}>Share</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <ZmIconButton icon="external" size={32} variant="surface" />
                <ZmIconButton icon="paperclip" size={32} variant="surface" />
                <ZmIconButton icon="message" size={32} variant="surface" />
                <span style={{ flex: 1 }} />
                <ZmIconButton icon="heart" size={32} variant="surface" />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

Object.assign(window, { ZmSkillsListing, ZmSkillDetail });
