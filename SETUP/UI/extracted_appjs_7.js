/* Zeemic — Exchange Hub (/exchange)
   Department-store front door. Hero + named section rows per vertical,
   each with "View all →". */

function ZmExchangeHub() {
  return (
    <div className="zm-root" style={{ width: 1440, background: 'var(--zm-paper)', minHeight: 900 }}>
      <ZmHeader active="exchange" />

      {/* ── Hero ───────────────────────────────────────── */}
      <section style={{
        padding: '72px 80px 64px',
        background: 'linear-gradient(180deg, var(--zm-paper) 0%, var(--zm-paper-2) 100%)',
        borderBottom: '1px solid var(--zm-border)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative type element */}
        <div aria-hidden style={{ position: 'absolute', right: -60, top: 40, fontFamily: 'var(--zm-font-display)', fontSize: 280, color: 'var(--zm-paper-3)', letterSpacing: '-0.04em', lineHeight: 1, fontStyle: 'italic', pointerEvents: 'none', userSelect: 'none' }}>z.</div>

        <div style={{ maxWidth: 1280, position: 'relative' }}>
          <div className="zm-eyebrow" style={{ marginBottom: 16 }}>The Exchange · Work-economy marketplace</div>
          <h1 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 88, lineHeight: 0.97, letterSpacing: '-0.035em', margin: 0, maxWidth: 920 }}>
            Hire skills, find jobs,<br/>connect with <em style={{ fontStyle: 'italic' }}>recruiters.</em>
          </h1>
          <p style={{ font: '400 18px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-muted)', maxWidth: 560, marginTop: 24 }}>
            Browse, book, and transact across the entire work economy — from a five-day design sprint to a Series A finance hire. One marketplace.
          </p>

          {/* Search */}
          <div style={{ marginTop: 36, maxWidth: 720 }}>
            <ZmSearch placeholder="Search skills, jobs, recruiters, businesses…" size="lg" actionLabel="Search" />
          </div>

          {/* Quick browse */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 20, flexWrap: 'wrap' }}>
            <span className="zm-eyebrow">Browse</span>
            <ZmChip icon="wrench" iconRight="arrow_right">Skills</ZmChip>
            <ZmChip icon="users" iconRight="arrow_right">Recruiters</ZmChip>
            <ZmChip icon="briefcase" iconRight="arrow_right">Jobs</ZmChip>
            <ZmChip icon="building" iconRight="arrow_right">Businesses</ZmChip>
            <ZmChip icon="grid" iconRight="arrow_right">Products</ZmChip>
            <ZmChip icon="layers" iconRight="arrow_right">Projects</ZmChip>
          </div>

          {/* Marketplace stats strip */}
          <div style={{ display: 'flex', gap: 48, marginTop: 64, paddingTop: 28, borderTop: '1px solid var(--zm-border)' }}>
            {[
              { v: '12,840', l: 'Skills listed' },
              { v: '3,421', l: 'Recruiters' },
              { v: '8,140', l: 'Active jobs' },
              { v: '$4.2M', l: 'Transacted YTD' },
            ].map(s => (
              <div key={s.l}>
                <div style={{ fontFamily: 'var(--zm-font-display)', fontSize: 40, lineHeight: 1, letterSpacing: '-0.02em' }} className="zm-num-tab">{s.v}</div>
                <div style={{ font: '500 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 8 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section: Featured Skills ───────────────────── */}
      <SectionRow icon="wrench" title="Featured skills" subtitle="Find experts ready to help — book, quote, or download brochures." href="/skills">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {ZM_SKILLS.slice(0, 4).map(s => <ZmSkillCard key={s.id} skill={s} />)}
        </div>
      </SectionRow>

      {/* ── Section: Top Recruiters ────────────────────── */}
      <SectionRow icon="users" title="Top recruiters" subtitle="Talent specialists, ranked by placements + buyer reviews." href="/recruiters" theme="dark">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {ZM_RECRUITERS.slice(0, 3).map(r => <ZmRecruiterCard key={r.id} recruiter={r} />)}
        </div>
      </SectionRow>

      {/* ── Section: Latest Jobs ───────────────────────── */}
      <SectionRow icon="briefcase" title="Latest jobs" subtitle="Roles posted in the last 7 days, with linked recruiters." href="/jobs">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {ZM_JOBS.map(j => <ZmJobCard key={j.id} job={j} />)}
        </div>
      </SectionRow>

      {/* ── Section: Businesses ────────────────────────── */}
      <SectionRow icon="building" title="Featured businesses" subtitle="Verified organizations hiring and selling on Zeemic." href="/businesses">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {ZM_BUSINESSES.map(b => <ZmBusinessCard key={b.name} biz={b} />)}
        </div>
      </SectionRow>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer style={{ background: 'var(--zm-ink-950)', color: 'var(--zm-fg-on-dark)', padding: '80px 80px 48px', marginTop: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 80 }}>
          <div style={{ maxWidth: 480 }}>
            <ZmWordmark height={28} color="var(--zm-paper)" />
            <p style={{ fontFamily: 'var(--zm-font-display)', fontSize: 36, lineHeight: 1.05, letterSpacing: '-0.02em', marginTop: 28 }}>
              The market for everyone who works.
            </p>
            <p style={{ font: '400 14px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-on-dark-muted)', marginTop: 16 }}>
              Berlin · New York · Accra · Kigali — bridging African talent with global demand.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 140px)', gap: 24, font: '500 13px var(--zm-font-body)' }}>
            {[
              ['Marketplace', 'Skills', 'Recruiters', 'Jobs', 'Businesses'],
              ['Sell', 'List a skill', 'Become a recruiter', 'Create a business', 'Pricing'],
              ['Company', 'About', 'Blog', 'Press', 'Careers'],
              ['Trust', 'Guidelines', 'Terms', 'Policies', 'Contact'],
            ].map((col, i) => (
              <div key={i}>
                <div style={{ color: 'var(--zm-gold-500)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: 11, marginBottom: 14 }}>{col[0]}</div>
                {col.slice(1).map(item => (
                  <div key={item} style={{ color: 'var(--zm-fg-on-dark-muted)', padding: '6px 0', cursor: 'pointer' }}>{item}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--zm-border-on-dark)', marginTop: 64, paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ font: '400 12px var(--zm-font-mono)', color: 'var(--zm-fg-on-dark-muted)' }}>© 2026 Zeemic Inc. · All work, transacted.</span>
          <div style={{ display: 'flex', gap: 16, font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-on-dark-muted)' }}>
            <span>EN</span><span>·</span><span>FR</span><span>·</span><span>DE</span><span>·</span><span>PT</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper — section row shell used on the Exchange hub
function SectionRow({ icon, title, subtitle, href, theme = 'light', children }) {
  const dark = theme === 'dark';
  return (
    <section style={{
      padding: '64px 80px',
      background: dark ? 'var(--zm-ink-900)' : 'var(--zm-paper)',
      color: dark ? 'var(--zm-fg-on-dark)' : 'inherit',
      borderBottom: dark ? 'none' : '1px solid var(--zm-border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 'var(--zm-r-md)',
            background: dark ? 'rgba(245,241,232,0.08)' : 'var(--zm-ink-100)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: dark ? 'var(--zm-gold-500)' : 'var(--zm-ink-700)',
          }}>
            <ZmIcon name={icon} size={22} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 44, lineHeight: 1, letterSpacing: '-0.025em', margin: 0 }}>{title}</h2>
            {subtitle && <p style={{ font: '400 16px/1.4 var(--zm-font-body)', color: dark ? 'var(--zm-fg-on-dark-muted)' : 'var(--zm-fg-muted)', marginTop: 8, maxWidth: 540 }}>{subtitle}</p>}
          </div>
        </div>
        <a style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          font: '500 14px var(--zm-font-body)',
          color: dark ? 'var(--zm-paper)' : 'var(--zm-ink-950)',
          textDecoration: 'none', cursor: 'pointer',
          padding: '10px 16px', borderRadius: 'var(--zm-r-full)',
          background: dark ? 'rgba(245,241,232,0.06)' : 'var(--zm-white)',
          border: dark ? '1px solid rgba(245,241,232,0.18)' : '1px solid var(--zm-border)',
        }}>
          View all <ZmIcon name="arrow_right" size={14} />
        </a>
      </div>
      {children}
    </section>
  );
}

Object.assign(window, { ZmExchangeHub, SectionRow });
