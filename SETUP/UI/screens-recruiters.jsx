/* Zeemic — Recruiters & Jobs verticals
   /recruiters listing, /recruiter/[slug] profile, /jobs listing */

// ────────────────────────────────────────────────
// Recruiters Listing (/recruiters)
// ────────────────────────────────────────────────
function ZmRecruitersListing() {
  // Pad the recruiter list out
  const more = [
    { id: 'r5', name: 'Sade Iredia', title: 'Engineering Recruiter', business: 'Brightline Legal', location: 'Lagos, NG', specialties: ['Backend', 'DevOps'], placements: 16, rating: 4.7, reviews: 9, response: '< 8hr', languages: ['EN'], quote: 'Eight years placing backend engineers across fintech and adtech.' },
    { id: 'r6', name: 'Hannes Wirth', title: 'Product Recruiter', business: 'Northwind Studio', location: 'Munich, DE', specialties: ['Product', 'Strategy'], placements: 22, rating: 4.8, reviews: 14, response: '< 24hr', languages: ['EN', 'DE'], quote: 'I help DACH companies hire senior product leaders for international markets.' },
  ];
  const all = [...ZM_RECRUITERS, ...more];

  return (
    <div className="zm-root" style={{ width: 1440, background: 'var(--zm-paper)', minHeight: 900 }}>
      <ZmHeader active="exchange" />

      <div style={{ padding: '40px 80px 24px', borderBottom: '1px solid var(--zm-border)' }}>
        <div style={{ display: 'flex', gap: 8, font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginBottom: 16 }}>
          <span style={{ cursor: 'pointer' }}>Exchange</span>
          <ZmIcon name="chevron_right" size={14} color="var(--zm-fg-muted)" />
          <span style={{ color: 'var(--zm-ink-950)' }}>Recruiters</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 64, lineHeight: 0.98, letterSpacing: '-0.03em', margin: 0 }}>
              Recruiters, <em style={{ fontStyle: 'italic' }}>vetted.</em>
            </h1>
            <p style={{ font: '400 17px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: 12, maxWidth: 600 }}>
              Specialised talent partners ranked by placements and verified buyer reviews. Hire a recruiter the way you hire any other skill.
            </p>
          </div>
          <span style={{ font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>
            <span className="zm-num-tab" style={{ color: 'var(--zm-ink-950)', fontWeight: 600 }}>3,421</span> recruiters
          </span>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 5,
        background: 'rgba(245,241,232,0.92)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--zm-border)',
        padding: '14px 80px',
        display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
      }}>
        <ZmChip active iconRight="close">Specialty: Engineering</ZmChip>
        <ZmChip iconRight="chevron_down">Country</ZmChip>
        <ZmChip iconRight="chevron_down">Response time</ZmChip>
        <ZmChip iconRight="chevron_down">Languages</ZmChip>
        <ZmChip iconRight="chevron_down">Placements</ZmChip>
        <span style={{ flex: 1 }} />
        <ZmChip tone="subtle" icon="sort" iconRight="chevron_down">Sort: Most placements</ZmChip>
      </div>

      {/* Grid */}
      <div style={{ padding: '40px 80px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {all.map(r => <ZmRecruiterCard key={r.id} recruiter={r} />)}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Recruiter Profile (/recruiter/[slug])
// ────────────────────────────────────────────────
function ZmRecruiterProfile({ recruiter = ZM_RECRUITERS[0] }) {
  return (
    <div className="zm-root" style={{ width: 1440, background: 'var(--zm-paper)', minHeight: 900 }}>
      <ZmHeader active="exchange" />

      {/* Hero — dark canvas */}
      <section style={{ background: 'var(--zm-ink-900)', color: 'var(--zm-fg-on-dark)', padding: '48px 80px 80px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', right: -40, top: -100, fontFamily: 'var(--zm-font-display)', fontSize: 420, color: 'rgba(245,241,232,0.04)', letterSpacing: '-0.04em', fontStyle: 'italic', lineHeight: 1, pointerEvents: 'none' }}>R.</div>

        <div style={{ display: 'flex', gap: 8, font: '500 12px var(--zm-font-body)', color: 'var(--zm-fg-on-dark-muted)', marginBottom: 28 }}>
          <span>Exchange</span><ZmIcon name="chevron_right" size={12} color="var(--zm-fg-on-dark-muted)" />
          <span>Recruiters</span><ZmIcon name="chevron_right" size={12} color="var(--zm-fg-on-dark-muted)" />
          <span style={{ color: 'var(--zm-paper)' }}>{recruiter.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 360px', gap: 40, alignItems: 'flex-start', position: 'relative' }}>
          <ZmAvatar name={recruiter.name} size={140} ring style={{ border: '4px solid var(--zm-paper)' }} />
          <div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
              <ZmBadge tone="onDark"><ZmIcon name="badge_check" size={11} color="var(--zm-gold-500)" /> Verified</ZmBadge>
              <ZmBadge tone="gold">Top 5% in Engineering</ZmBadge>
            </div>
            <h1 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 72, lineHeight: 1, letterSpacing: '-0.03em', margin: 0 }}>{recruiter.name}</h1>
            <div style={{ font: '400 19px var(--zm-font-body)', color: 'var(--zm-fg-on-dark-muted)', marginTop: 12 }}>{recruiter.title} · {recruiter.business}</div>
            <div style={{ display: 'flex', gap: 18, marginTop: 24, alignItems: 'center' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: '500 13px var(--zm-font-body)' }}>
                <ZmIcon name="map_pin" size={14} color="var(--zm-gold-500)" /> {recruiter.location}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: '500 13px var(--zm-font-body)' }}>
                <ZmIcon name="globe" size={14} color="var(--zm-gold-500)" /> {recruiter.languages.join(' · ')}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: '500 13px var(--zm-font-body)' }}>
                <ZmIcon name="bolt" size={14} color="var(--zm-gold-500)" /> Responds {recruiter.response}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <ZmButton variant="accent" size="lg" full>Contact recruiter</ZmButton>
            <ZmButton variant="onDark" size="md" full icon="bookmark">Save profile</ZmButton>
            <div style={{ marginTop: 10, padding: 16, background: 'rgba(245,241,232,0.06)', border: '1px solid rgba(245,241,232,0.14)', borderRadius: 'var(--zm-r-md)' }}>
              <div className="zm-eyebrow" style={{ color: 'var(--zm-fg-on-dark-muted)' }}>Track record</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginTop: 8 }}>
                <div>
                  <div style={{ fontFamily: 'var(--zm-font-display)', fontSize: 36, lineHeight: 1 }} className="zm-num-tab">{recruiter.placements}</div>
                  <div style={{ font: '500 11px var(--zm-font-body)', color: 'var(--zm-fg-on-dark-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>Placements</div>
                </div>
                <div>
                  <ZmRating value={recruiter.rating} count={recruiter.reviews} size={14} color="var(--zm-paper)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 48, padding: '48px 80px 80px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, minWidth: 0 }}>
          {/* Quote */}
          <blockquote style={{
            margin: 0, padding: '32px 36px',
            background: 'var(--zm-white)', borderLeft: '4px solid var(--zm-gold-500)',
            borderRadius: 'var(--zm-r-md)',
            fontFamily: 'var(--zm-font-display)', fontStyle: 'italic',
            fontSize: 28, lineHeight: 1.3, letterSpacing: '-0.015em',
            color: 'var(--zm-ink-950)',
          }}>
            “{recruiter.quote}”
          </blockquote>

          {/* Specialties */}
          <section>
            <div className="zm-eyebrow">Specialties</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
              {[...recruiter.specialties, 'Platform', 'Infrastructure', 'Distributed systems', 'EU + Africa'].map(s => <ZmChip key={s} tone="subtle">{s}</ZmChip>)}
            </div>
          </section>

          {/* About */}
          <section>
            <div className="zm-eyebrow">About</div>
            <p style={{ font: '400 16px/1.55 var(--zm-font-body)', maxWidth: 720, marginTop: 12, textWrap: 'pretty' }}>
              I’ve spent eight years placing senior engineers into Berlin and Kigali tech teams. Before joining Pangea Labs I led talent at two Series B startups. My playbook combines a network-first sourcing model with a structured competency interview I co-developed with several CTOs in my network.
            </p>
            <p style={{ font: '400 16px/1.55 var(--zm-font-body)', maxWidth: 720, marginTop: 12, textWrap: 'pretty' }}>
              I work retained on senior IC and lead roles, with a typical engagement of 6–10 weeks. I’m open to introductions outside my focus area if the team aligns.
            </p>
          </section>

          {/* Open roles */}
          <section>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <div className="zm-eyebrow">Open roles</div>
                <h3 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 32, margin: '6px 0 0', letterSpacing: '-0.02em' }}>4 active searches</h3>
              </div>
              <ZmButton variant="ghost" iconRight="arrow_right">All roles</ZmButton>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {ZM_JOBS.slice(0, 2).map(j => <ZmJobCard key={j.id} job={j} />)}
            </div>
          </section>

          {/* Reviews */}
          <section>
            <div className="zm-eyebrow">Buyer reviews</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, margin: '8px 0 20px' }}>
              <h3 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 32, margin: 0, letterSpacing: '-0.02em' }}>
                <ZmIcon name="star_fill" size={24} color="var(--zm-gold-500)" style={{ verticalAlign: -2 }} /> 4.9
              </h3>
              <span style={{ font: '400 15px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>from 18 verified hires</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { name: 'Lukas Wagner', biz: 'Northwind Studio', date: 'Apr 2026', body: 'Placed our Staff Platform Engineer in 6 weeks. Sourced candidates we’d been unable to reach for months. Highly recommend.' },
                { name: 'Adaeze O.', biz: 'Helio Capital', date: 'Feb 2026', body: 'Jane vetted candidates rigorously and saved me dozens of hours. Excellent communication throughout.' },
              ].map((r, i) => (
                <div key={i} style={{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', padding: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <ZmAvatar name={r.name} size={28} />
                    <span style={{ font: '600 13px var(--zm-font-body)' }}>{r.name} · <span style={{ color: 'var(--zm-fg-muted)', fontWeight: 400 }}>{r.biz}</span></span>
                    <span style={{ flex: 1 }} />
                    <span style={{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>{r.date}</span>
                  </div>
                  <p style={{ font: '400 14px/1.5 var(--zm-font-body)', margin: 0 }}>{r.body}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Side */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', padding: 22 }}>
            <div className="zm-eyebrow">Engagement</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
              {[
                ['Model', 'Retained search'],
                ['Typical length', '6–10 weeks'],
                ['Guarantee', '90 days'],
                ['Fee', '20% of base'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', font: '500 13px var(--zm-font-body)' }}>
                  <span style={{ color: 'var(--zm-fg-muted)' }}>{k}</span><span>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', padding: 22 }}>
            <div className="zm-eyebrow">Recent placements</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
              {[
                ['Staff Platform Engineer', 'Northwind Studio · Berlin'],
                ['Sr. Backend Engineer', 'Pangea Labs · Kigali'],
                ['SRE Lead', 'Helio Capital portfolio · Lagos'],
              ].map(([role, at]) => (
                <div key={role}>
                  <div style={{ font: '600 13px var(--zm-font-body)' }}>{role}</div>
                  <div style={{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>{at}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Jobs Listing (/jobs)
// ────────────────────────────────────────────────
function ZmJobsListing() {
  const more = [
    { id: 'j5', title: 'Lead Product Designer', company: 'Brightline Legal', location: 'Lagos, NG · Remote', type: 'Full-time', salary: '$70–95k', deadline: 'Jul 5', recruiter: 'Priya Rao', posted: '2 days ago' },
    { id: 'j6', title: 'Data Engineer', company: 'Helio Capital', location: 'Kigali, RW · Hybrid', type: 'Contract', salary: '$80–110k', deadline: 'Jun 20', recruiter: 'Jane Smith', posted: '1 day ago' },
    { id: 'j7', title: 'Marketing Lead', company: 'Pangea Labs', location: 'Accra, GH · Onsite', type: 'Full-time', salary: '$60–90k', deadline: 'Jul 12', recruiter: 'Tomi Adekola', posted: '5 days ago' },
    { id: 'j8', title: 'Senior Mobile Engineer', company: 'Northwind Studio', location: 'Berlin, DE · Hybrid', type: 'Full-time', salary: '€85–115k', deadline: 'Aug 1', recruiter: 'Hannes Wirth', posted: '6 days ago' },
  ];
  return (
    <div className="zm-root" style={{ width: 1440, background: 'var(--zm-paper)', minHeight: 900 }}>
      <ZmHeader active="exchange" />

      <div style={{ padding: '40px 80px 24px', borderBottom: '1px solid var(--zm-border)' }}>
        <div style={{ display: 'flex', gap: 8, font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginBottom: 16 }}>
          <span style={{ cursor: 'pointer' }}>Exchange</span>
          <ZmIcon name="chevron_right" size={14} color="var(--zm-fg-muted)" />
          <span style={{ color: 'var(--zm-ink-950)' }}>Jobs</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 64, lineHeight: 0.98, letterSpacing: '-0.03em', margin: 0 }}>
              Latest <em style={{ fontStyle: 'italic' }}>roles.</em>
            </h1>
            <p style={{ font: '400 17px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: 12, maxWidth: 600 }}>
              Each role is linked to a real, reviewable recruiter. Apply once — track every status from your dashboard.
            </p>
          </div>
          <span style={{ font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>
            <span className="zm-num-tab" style={{ color: 'var(--zm-ink-950)', fontWeight: 600 }}>8,140</span> active jobs
          </span>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 5,
        background: 'rgba(245,241,232,0.92)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--zm-border)',
        padding: '14px 80px',
        display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
      }}>
        <ZmChip iconRight="chevron_down">Country</ZmChip>
        <ZmChip iconRight="chevron_down">Industry</ZmChip>
        <ZmChip active iconRight="close">Type: Full-time</ZmChip>
        <ZmChip iconRight="chevron_down">Salary</ZmChip>
        <ZmChip iconRight="chevron_down">Deadline</ZmChip>
        <ZmChip iconRight="chevron_down" icon="users">Recruiter</ZmChip>
        <span style={{ flex: 1 }} />
        <ZmChip tone="subtle" icon="sort" iconRight="chevron_down">Sort: Newest</ZmChip>
      </div>

      <div style={{ padding: '40px 80px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[...ZM_JOBS, ...more].map(j => <ZmJobCard key={j.id} job={j} />)}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ZmRecruitersListing, ZmRecruiterProfile, ZmJobsListing });
