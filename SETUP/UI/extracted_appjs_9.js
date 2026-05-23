/* Zeemic — Business Profile page (/business/[slug])
   Public profile for a business. Banner + identity + tabs + content rows. */

function ZmBusinessProfile({ biz }) {
  // Default to Northwind Studio with extended fixture data
  const b = biz || {
    name: 'Northwind Studio',
    tag: 'Design agency',
    location: 'Berlin, DE',
    founded: 2018, size: '20–50',
    site: 'northwindstudio.com',
    members: 24, listings: 18, recruiters: 4, rating: 4.8, reviews: 41,
    bannerColor: '#1A4D3A',
    initial: 'N',
    about: 'A design and product studio working with venture-backed companies on brand, product, and go-to-market. Northwind Studio was founded in 2018 in Berlin and has grown to a 24-person team across three offices. We pair senior designers with embedded engineers for end-to-end product delivery.',
    mission: 'We exist to make great products legible — to their users, their builders, and the people who fund them.',
    offices: ['Berlin (HQ)', 'Lisbon', 'Lagos'],
    languages: ['English', 'German', 'Portuguese', 'Yoruba'],
    industries: ['Fintech', 'Healthtech', 'Climate', 'Consumer'],
  };
  const businessSkills = [ZM_SKILLS[4], ZM_SKILLS[3], { ...ZM_SKILLS[6], seller: b.name, isBusiness: true, motif: 2, title: 'Senior Designer secondment — 12 weeks' }, { ...ZM_SKILLS[0], seller: b.name, isBusiness: true, motif: 3, title: 'Design Audit & Roadmap' }];
  const businessJobs = ZM_JOBS.slice(0, 3).map(j => ({ ...j, company: b.name }));
  const businessRecruiters = ZM_RECRUITERS.slice(0, 4).map(r => ({ ...r, business: b.name }));

  return (
    <div className="zm-root" style={{ width: 1440, background: 'var(--zm-paper)', minHeight: 900 }}>
      <ZmHeader active="exchange" />

      {/* Breadcrumb */}
      <div style={{ padding: '20px 80px 0' }}>
        <ZmBreadcrumb items={['Exchange', 'Businesses', b.name]} />
      </div>

      {/* ── Banner ──────────────────────────────────── */}
      <section style={{ position: 'relative', marginTop: 18 }}>
        <div style={{
          height: 220, margin: '0 80px',
          background: b.bannerColor, borderRadius: 'var(--zm-r-xl)',
          position: 'relative', overflow: 'hidden',
        }}>
          <svg width="100%" height="100%" viewBox="0 0 1280 220" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
            <circle cx="1100" cy="40" r="180" fill="var(--zm-gold-500)" opacity="0.4" />
            <circle cx="1100" cy="40" r="90" fill={b.bannerColor} />
            <circle cx="1100" cy="40" r="40" fill="var(--zm-gold-500)" />
            <g stroke="var(--zm-gold-500)" strokeWidth="1.5" fill="none" opacity="0.18">
              {[0,1,2,3,4,5,6,7,8].map(i => <line key={i} x1={-40+i*70} y1="0" x2={20+i*70} y2="220" />)}
            </g>
          </svg>
          <div style={{ position: 'absolute', top: 20, right: 24, display: 'flex', gap: 8 }}>
            <ZmBadge tone="onDark"><ZmIcon name="badge_check" size={11} color="var(--zm-gold-500)" /> Verified business</ZmBadge>
            <ZmBadge tone="gold">★ Featured</ZmBadge>
          </div>
        </div>

        {/* Identity row — overlaps banner */}
        <div style={{ padding: '0 96px', marginTop: -64, position: 'relative', display: 'flex', alignItems: 'flex-end', gap: 28 }}>
          <div style={{
            width: 144, height: 144, borderRadius: 'var(--zm-r-xl)',
            background: 'var(--zm-paper)',
            border: '6px solid var(--zm-paper)',
            boxShadow: 'var(--zm-shadow-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--zm-font-display)', fontSize: 88, color: b.bannerColor,
            letterSpacing: '-0.04em', lineHeight: 1, flexShrink: 0,
          }}>{b.initial}</div>
          <div style={{ flex: 1, paddingBottom: 12, minWidth: 0 }}>
            <div className="zm-eyebrow">{b.tag}</div>
            <h1 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 56, lineHeight: 1, letterSpacing: '-0.025em', margin: '8px 0 10px' }}>{b.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><ZmIcon name="map_pin" size={14} /> {b.location}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><ZmIcon name="calendar" size={14} /> Founded {b.founded}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><ZmIcon name="users" size={14} /> {b.size} employees</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><ZmIcon name="external" size={14} /> {b.site}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, paddingBottom: 12 }}>
            <ZmButton variant="dark" icon="message" size="lg">Message business</ZmButton>
            <ZmButton variant="secondary" icon="bookmark" size="lg">Follow</ZmButton>
            <ZmIconButton icon="paperclip" size={48} variant="surface" />
            <ZmIconButton icon="more" size={48} variant="surface" />
          </div>
        </div>
      </section>

      {/* ── Stats strip ─────────────────────────────── */}
      <section style={{ padding: '40px 80px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
          {[
            { label: 'Active jobs', value: '8', delta: '+2 this week', icon: 'briefcase' },
            { label: 'Skills offered', value: '4', delta: '4.9★ avg', icon: 'wrench' },
            { label: 'Team members', value: '24', icon: 'users' },
            { label: 'Recruiters', value: '4', delta: '109 placements', icon: 'badge_check' },
            { label: 'Buyer reviews', value: '41', delta: <ZmRating value={4.8} size={12} />, icon: 'star_fill' },
          ].map(s => (
            <ZmStat key={s.label} label={s.label} value={s.value} delta={s.delta} icon={s.icon} />
          ))}
        </div>
      </section>

      {/* ── Tabs ────────────────────────────────────── */}
      <section style={{ padding: '36px 80px 0' }}>
        <ZmTabs active="about" tabs={[
          { id: 'about', label: 'About' },
          { id: 'skills', label: 'Skills offered', count: b.listings - 8 },
          { id: 'jobs', label: 'Open roles', count: 8 },
          { id: 'team', label: 'Team', count: b.members },
          { id: 'recruiters', label: 'Recruiters', count: b.recruiters },
          { id: 'reviews', label: 'Reviews', count: b.reviews },
        ]} />
      </section>

      {/* ── Main content (About tab) ───────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 48, padding: '40px 80px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36, minWidth: 0 }}>
          {/* About */}
          <section>
            <div className="zm-eyebrow">About</div>
            <h2 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 36, letterSpacing: '-0.02em', margin: '6px 0 16px', lineHeight: 1.05 }}>
              Making great products <em style={{ fontStyle: 'italic' }}>legible.</em>
            </h2>
            <p style={{ font: '400 16px/1.55 var(--zm-font-body)', maxWidth: 720, textWrap: 'pretty', margin: 0 }}>{b.about}</p>
            <blockquote style={{
              margin: '24px 0 0', padding: '20px 24px',
              background: 'var(--zm-white)', borderLeft: '4px solid var(--zm-gold-500)',
              borderRadius: 'var(--zm-r-md)',
              fontFamily: 'var(--zm-font-display)', fontStyle: 'italic', fontSize: 22,
              lineHeight: 1.35, letterSpacing: '-0.015em',
            }}>“{b.mission}”</blockquote>
          </section>

          {/* Industries + Languages chips */}
          <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            <div>
              <div className="zm-eyebrow">Industries served</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
                {b.industries.map(i => <ZmChip key={i} tone="subtle">{i}</ZmChip>)}
              </div>
            </div>
            <div>
              <div className="zm-eyebrow">Working languages</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
                {b.languages.map(l => <ZmChip key={l} tone="subtle" icon="globe">{l}</ZmChip>)}
              </div>
            </div>
          </section>

          {/* Skills offered */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
              <div>
                <div className="zm-eyebrow">Skills offered</div>
                <h3 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 30, letterSpacing: '-0.02em', margin: '6px 0 0' }}>Bookable services</h3>
              </div>
              <ZmButton variant="ghost" iconRight="arrow_right">All skills</ZmButton>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {businessSkills.slice(0, 4).map(s => <ZmSkillCard key={s.id || s.title} skill={s} />)}
            </div>
          </section>

          {/* Open roles */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
              <div>
                <div className="zm-eyebrow">Open roles</div>
                <h3 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 30, letterSpacing: '-0.02em', margin: '6px 0 0' }}>8 active searches</h3>
              </div>
              <ZmButton variant="ghost" iconRight="arrow_right">All jobs</ZmButton>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {businessJobs.map(j => <ZmJobCard key={j.id} job={j} />)}
            </div>
          </section>

          {/* Recruiting team */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
              <div>
                <div className="zm-eyebrow">Recruiting team</div>
                <h3 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 30, letterSpacing: '-0.02em', margin: '6px 0 0' }}>4 specialists · 109 placements</h3>
              </div>
              <ZmButton variant="ghost" iconRight="arrow_right">All recruiters</ZmButton>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {businessRecruiters.slice(0, 2).map(r => <ZmRecruiterCard key={r.id} recruiter={r} />)}
            </div>
          </section>

          {/* Reviews */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
              <div>
                <div className="zm-eyebrow">Reviews</div>
                <h3 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 30, letterSpacing: '-0.02em', margin: '6px 0 0' }}>
                  <ZmIcon name="star_fill" size={22} color="var(--zm-gold-500)" style={{ verticalAlign: -3 }} /> <span className="zm-num-tab">4.8</span>
                  <span style={{ font: '400 15px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginLeft: 10 }}>from 41 buyers</span>
                </h3>
              </div>
              <ZmButton variant="ghost" iconRight="arrow_right">All reviews</ZmButton>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { name: 'Adaeze Okoye', biz: 'Helio Capital', date: 'May 2026', rating: 5, body: 'Northwind redesigned our portfolio dashboard end-to-end in six weeks. Senior team, clear process, no agency drama. Would book again tomorrow.' },
                { name: 'Lukas Wagner', biz: 'TechStart', date: 'Apr 2026', rating: 5, body: 'Their Design Sprint package is genuinely excellent. We shipped a new onboarding two weeks after the readout and saw a 22% activation lift.' },
                { name: 'Sade Adeyemi', biz: 'Pangea Labs', date: 'Mar 2026', rating: 4, body: 'Strong work; one small scheduling hiccup mid-engagement. The team made it right. Recommend for senior product design work.' },
              ].map((r, i) => (
                <div key={i} style={{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', padding: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <ZmAvatar name={r.name} size={32} />
                    <span style={{ font: '600 14px var(--zm-font-body)' }}>{r.name} · <span style={{ color: 'var(--zm-fg-muted)', fontWeight: 400 }}>{r.biz}</span></span>
                    <span style={{ flex: 1 }} />
                    <div style={{ display: 'flex', gap: 1 }}>
                      {Array.from({length: 5}).map((_, j) => <ZmIcon key={j} name="star_fill" size={11} color={j < r.rating ? 'var(--zm-gold-500)' : 'var(--zm-grey-300)'} />)}
                    </div>
                    <span style={{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginLeft: 8 }}>{r.date}</span>
                  </div>
                  <p style={{ font: '400 14.5px/1.5 var(--zm-font-body)', margin: 0 }}>{r.body}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── Right rail ─────────────────────────── */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', padding: 22 }}>
            <div className="zm-eyebrow">At a glance</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
              {[
                ['Founded', String(b.founded)],
                ['Headquarters', b.location],
                ['Team size', b.size],
                ['Website', b.site],
                ['Response time', '< 24 hr'],
                ['Plan', 'Verified Pro'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', font: '500 13px var(--zm-font-body)' }}>
                  <span style={{ color: 'var(--zm-fg-muted)' }}>{k}</span><span>{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', padding: 22 }}>
            <div className="zm-eyebrow">Offices</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
              {b.offices.map((o, i) => (
                <div key={o} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 16, background: 'var(--zm-ink-100)', color: 'var(--zm-ink-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ZmIcon name="map_pin" size={14} />
                  </div>
                  <div>
                    <div style={{ font: '600 13px var(--zm-font-body)' }}>{o}</div>
                    <div style={{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>{i === 0 ? 'Primary office' : 'Satellite'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--zm-ink-900)', color: 'var(--zm-fg-on-dark)', borderRadius: 'var(--zm-r-lg)', padding: 22 }}>
            <div className="zm-eyebrow" style={{ color: 'var(--zm-gold-500)' }}>Work with us</div>
            <h4 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 22, lineHeight: 1.2, letterSpacing: '-0.015em', margin: '6px 0 12px' }}>Have a brief? Send it directly.</h4>
            <p style={{ font: '400 13px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-on-dark-muted)', margin: '0 0 14px' }}>
              We reply within a business day, share a packaged proposal in three.
            </p>
            <ZmButton variant="accent" full size="md" iconRight="arrow_right">Start a project</ZmButton>
          </div>

          <div style={{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', padding: 22 }}>
            <div className="zm-eyebrow">Team preview</div>
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
              <ZmAvatarStack people={[...ZM_RECRUITERS, {name:'Anders Lee'},{name:'Yasmin Diop'},{name:'Otto Becker'},{name:'Maya Ofori'}]} size={36} max={5} />
            </div>
            <ZmButton variant="ghost" size="sm" iconRight="arrow_right" style={{ marginTop: 14 }}>View all 24 members</ZmButton>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 80 }}>
        <ZmFooter />
      </div>
    </div>
  );
}

Object.assign(window, { ZmBusinessProfile });
