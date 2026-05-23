/* Zeemic — Mobile screens
   iPhone 14 sized: 390 × 844. Bottom nav, full-bleed cards,
   sticky action bars. */

// Phone shell — status bar + bottom nav + home indicator
function PhoneShell({ children, hideNav, active = 'exchange', label }) {
  return (
    <div style={{
      position: 'relative', width: 390, height: 844, background: 'var(--zm-paper)',
      fontFamily: 'var(--zm-font-body)', overflow: 'hidden', display: 'flex', flexDirection: 'column',
    }}>
      {/* Status bar */}
      <div style={{
        height: 44, padding: '14px 24px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        font: '600 15px var(--zm-font-body)', color: 'var(--zm-ink-950)', flexShrink: 0,
        background: 'var(--zm-paper)', zIndex: 5,
      }}>
        <span>9:41</span>
        <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
          <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><path d="M0 3a3 3 0 013-3h11a3 3 0 013 3v5a3 3 0 01-3 3H3a3 3 0 01-3-3V3zm14 0H3v5h11V3z"/></svg>
          <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor"><path d="M1 1.5l2 9 2-6 2 6 2-9 2 9 2-6 2 6"/></svg>
          <svg width="24" height="11" viewBox="0 0 24 11" fill="none"><rect x="0.5" y="0.5" width="20" height="10" rx="2.5" stroke="currentColor"/><rect x="2" y="2" width="14" height="7" rx="1" fill="currentColor"/></svg>
        </span>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>

      {/* Bottom nav */}
      {!hideNav && (
        <div style={{
          flexShrink: 0, background: 'var(--zm-paper)',
          borderTop: '1px solid var(--zm-border)',
          padding: '8px 10px 24px', display: 'flex', justifyContent: 'space-around', alignItems: 'center',
          zIndex: 4,
        }}>
          {[
            { id: 'exchange', label: 'Exchange', icon: 'grid' },
            { id: 'dashboard', label: 'Dashboard', icon: 'user' },
            { id: 'messages', label: 'Messages', icon: 'message', badge: 2 },
            { id: 'notifs', label: 'Alerts', icon: 'bell', badge: 3 },
            { id: 'intel', label: 'Intel', icon: 'sparkles' },
          ].map(t => {
            const isActive = active === t.id;
            return (
              <div key={t.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flex: 1, position: 'relative' }}>
                <div style={{ position: 'relative' }}>
                  <ZmIcon name={t.icon} size={22} color={isActive ? 'var(--zm-ink-700)' : 'var(--zm-grey-500)'} stroke={isActive ? 2 : 1.6} />
                  {t.badge && <span style={{ position: 'absolute', top: -3, right: -7, minWidth: 16, height: 16, padding: '0 4px', borderRadius: 8, background: 'var(--zm-coral-500)', color: 'white', font: '700 9px var(--zm-font-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid var(--zm-paper)' }}>{t.badge}</span>}
                </div>
                <span style={{ font: `${isActive ? 600 : 500} 10px var(--zm-font-body)`, color: isActive ? 'var(--zm-ink-700)' : 'var(--zm-grey-500)' }}>{t.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Compact card optimized for mobile horizontal carousels
function MobileSkillCard({ skill }) {
  return (
    <div style={{
      width: 240, flexShrink: 0, background: 'var(--zm-white)',
      border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)',
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
    }}>
      <ZmSkillThumb category={skill.category} motif={skill.motif} height={120} />
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ font: '600 14px/1.25 var(--zm-font-body)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{skill.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <ZmAvatar name={skill.seller} size={18} square={skill.isBusiness} />
          <span style={{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{skill.seller}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'var(--zm-font-display)', fontSize: 18, letterSpacing: '-0.015em' }} className="zm-num-tab">
            {skill.price ? `$${skill.price}` : 'RFQ'}<span style={{ color: 'var(--zm-fg-muted)', fontSize: 10, fontFamily: 'var(--zm-font-body)' }}>{skill.unit}</span>
          </span>
          <ZmRating value={skill.rating} size={11} />
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Mobile · Exchange hub
// ────────────────────────────────────────────────
function ZmMobileExchange() {
  return (
    <PhoneShell active="exchange">
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Mobile header */}
        <div style={{ padding: '8px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <ZmWordmark height={22} />
          <div style={{ display: 'flex', gap: 8 }}>
            <ZmIconButton icon="search" size={36} />
            <ZmIconButton icon="bell" size={36} badge={3} />
          </div>
        </div>

        {/* Hero */}
        <div style={{ padding: '8px 20px 24px' }}>
          <div className="zm-eyebrow">The Exchange</div>
          <h1 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 44, lineHeight: 0.98, letterSpacing: '-0.03em', margin: '6px 0 0' }}>
            Hire skills,<br/>find <em style={{ fontStyle: 'italic' }}>work.</em>
          </h1>
          <div style={{ marginTop: 16 }}>
            <ZmSearch placeholder="Search the marketplace…" size="md" />
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 12, overflowX: 'auto', paddingBottom: 4 }}>
            <ZmChip size="sm" icon="wrench">Skills</ZmChip>
            <ZmChip size="sm" icon="users">Recruiters</ZmChip>
            <ZmChip size="sm" icon="briefcase">Jobs</ZmChip>
            <ZmChip size="sm" icon="building">Businesses</ZmChip>
          </div>
        </div>

        {/* Featured Skills */}
        <section style={{ padding: '8px 0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 20px', marginBottom: 12 }}>
            <h3 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 22, letterSpacing: '-0.02em', margin: 0 }}>Featured skills</h3>
            <a style={{ font: '500 12px var(--zm-font-body)', color: 'var(--zm-ink-700)' }}>View all →</a>
          </div>
          <div style={{ display: 'flex', gap: 12, padding: '0 20px', overflowX: 'auto', scrollSnapType: 'x mandatory' }}>
            {ZM_SKILLS.slice(0, 4).map(s => (
              <div key={s.id} style={{ scrollSnapAlign: 'start' }}>
                <MobileSkillCard skill={s} />
              </div>
            ))}
          </div>
        </section>

        {/* Recruiters strip */}
        <section style={{ background: 'var(--zm-ink-900)', color: 'var(--zm-fg-on-dark)', padding: '24px 20px', margin: '0 0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <h3 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 22, letterSpacing: '-0.02em', margin: 0 }}>Top recruiters</h3>
            <a style={{ font: '500 12px var(--zm-font-body)', color: 'var(--zm-gold-500)' }}>View all →</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ZM_RECRUITERS.slice(0, 2).map(r => (
              <div key={r.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12, background: 'rgba(245,241,232,0.06)', borderRadius: 'var(--zm-r-md)' }}>
                <ZmAvatar name={r.name} size={42} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ font: '600 13px var(--zm-font-body)' }}>{r.name}</div>
                  <div style={{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-on-dark-muted)' }}>{r.title}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--zm-font-display)', fontSize: 18 }} className="zm-num-tab">{r.placements}</div>
                  <div style={{ font: '500 9px var(--zm-font-mono)', color: 'var(--zm-fg-on-dark-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Placed</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Jobs */}
        <section style={{ padding: '0 0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 20px', marginBottom: 12 }}>
            <h3 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 22, letterSpacing: '-0.02em', margin: 0 }}>Latest jobs</h3>
            <a style={{ font: '500 12px var(--zm-font-body)', color: 'var(--zm-ink-700)' }}>View all →</a>
          </div>
          <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ZM_JOBS.slice(0, 2).map(j => (
              <div key={j.id} style={{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)', padding: 14, display: 'flex', gap: 12 }}>
                <ZmAvatar name={j.company} size={36} square />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ font: '600 14px/1.2 var(--zm-font-body)' }}>{j.title}</div>
                  <div style={{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: 2 }}>{j.company} · {j.location}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    <ZmBadge tone="emerald" size="sm">{j.salary}</ZmBadge>
                    <ZmBadge size="sm">{j.type}</ZmBadge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PhoneShell>
  );
}

// ────────────────────────────────────────────────
// Mobile · Skill detail with sticky CTA
// ────────────────────────────────────────────────
function ZmMobileSkillDetail() {
  return (
    <PhoneShell active="exchange">
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        {/* Top bar */}
        <div style={{ padding: '4px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <ZmIconButton icon="chevron_left" size={36} />
          <div style={{ display: 'flex', gap: 6 }}>
            <ZmIconButton icon="paperclip" size={36} />
            <ZmIconButton icon="heart" size={36} />
          </div>
        </div>

        {/* Hero thumb */}
        <ZmSkillThumb category="Design" motif={0} height={220} />

        <div style={{ padding: 20 }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            <ZmBadge tone="success" dot size="sm">Available</ZmBadge>
            <ZmBadge tone="gold" size="sm">Verified</ZmBadge>
          </div>
          <h1 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 34, lineHeight: 1.05, letterSpacing: '-0.025em', margin: 0 }}>
            UX Research & <em style={{ fontStyle: 'italic' }}>Usability Testing</em>
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
            <ZmAvatar name="Enoch Boison" size={32} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: '600 13px var(--zm-font-body)' }}>Enoch Boison</div>
              <div style={{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>Accra, Ghana</div>
            </div>
            <ZmRating value={4.8} count={12} size={12} />
          </div>

          {/* Price */}
          <div style={{ marginTop: 22, padding: 18, background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div>
              <div className="zm-eyebrow">From</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
                <span style={{ fontFamily: 'var(--zm-font-display)', fontSize: 32, letterSpacing: '-0.02em' }} className="zm-num-tab">$150</span>
                <span style={{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>/hr</span>
              </div>
            </div>
            <ZmBadge tone="emerald">3 packages</ZmBadge>
          </div>

          {/* About */}
          <section style={{ marginTop: 22 }}>
            <div className="zm-eyebrow">About</div>
            <p style={{ font: '400 14px/1.55 var(--zm-font-body)', margin: '8px 0 0' }}>
              Moderated usability research for product teams. Five-day turnaround from kickoff to highlight reel + report. Recruit globally, work in English and Twi.
            </p>
          </section>

          {/* Packages */}
          <section style={{ marginTop: 22 }}>
            <div className="zm-eyebrow">Packages</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
              {[
                { name: 'Heuristic', d: '1 evaluator, 5 days', price: 600 },
                { name: 'Sprint', d: '5 participants, report + readout', price: 1800, active: true },
                { name: 'Deep dive', d: '8 participants, workshop', price: 3400 },
              ].map(p => (
                <div key={p.name} style={{
                  padding: 14, borderRadius: 'var(--zm-r-md)',
                  background: p.active ? 'var(--zm-ink-900)' : 'var(--zm-white)',
                  color: p.active ? 'var(--zm-paper)' : 'inherit',
                  border: p.active ? '2px solid var(--zm-ink-900)' : '1px solid var(--zm-border)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <div style={{ font: '600 14px var(--zm-font-body)' }}>{p.name}</div>
                    <div style={{ font: '400 12px var(--zm-font-body)', opacity: p.active ? 0.7 : 1, color: p.active ? 'var(--zm-paper)' : 'var(--zm-fg-muted)' }}>{p.d}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--zm-font-display)', fontSize: 22, letterSpacing: '-0.02em' }} className="zm-num-tab">${p.price.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Reviews preview */}
          <section style={{ marginTop: 24, padding: '0 0 100px' }}>
            <div className="zm-eyebrow">Reviews</div>
            <div style={{ marginTop: 10 }}>
              <ZmRating value={4.8} count={12} size={13} />
            </div>
            <div style={{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)', padding: 14, marginTop: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ZmAvatar name="John Doe" size={24} />
                <span style={{ font: '600 12px var(--zm-font-body)' }}>John D.</span>
                <span style={{ flex: 1 }} />
                <div style={{ display: 'flex', gap: 1 }}>
                  {[0,1,2,3,4].map(i => <ZmIcon key={i} name="star_fill" size={10} color="var(--zm-gold-500)" />)}
                </div>
              </div>
              <p style={{ font: '400 13px/1.5 var(--zm-font-body)', margin: '8px 0 0' }}>“Excellent work, very thorough. Brought research insights to a team that had never run usability studies before…”</p>
            </div>
          </section>
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '14px 20px 32px', background: 'var(--zm-paper)',
        borderTop: '1px solid var(--zm-border)',
        boxShadow: '0 -8px 24px rgba(11,15,13,0.04)',
        display: 'flex', gap: 8,
      }}>
        <ZmButton variant="secondary" size="lg" icon="message" />
        <ZmButton variant="accent" size="lg" full>Get quote</ZmButton>
        <ZmButton variant="primary" size="lg" full>Book now</ZmButton>
      </div>
    </PhoneShell>
  );
}

// ────────────────────────────────────────────────
// Mobile · User Dashboard
// ────────────────────────────────────────────────
function ZmMobileDashboard() {
  return (
    <PhoneShell active="dashboard">
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ padding: '8px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ZmAvatar name="Enoch Boison" size={36} />
            <div>
              <div style={{ font: '500 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>Personal</div>
              <div style={{ font: '600 14px var(--zm-font-body)' }}>Enoch Boison</div>
            </div>
          </div>
          <ZmIconButton icon="menu" size={36} />
        </div>

        <div style={{ padding: '0 20px 24px' }}>
          <h1 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 36, lineHeight: 1, letterSpacing: '-0.025em', margin: 0 }}>
            Good morning,<br/><em style={{ fontStyle: 'italic' }}>Enoch.</em>
          </h1>
          <p style={{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: 8 }}>
            <span style={{ color: 'var(--zm-ink-950)', fontWeight: 600 }}>3 leads</span> awaiting your reply.
          </p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
            <div style={{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)', padding: 14 }}>
              <div className="zm-eyebrow" style={{ fontSize: 10 }}>Leads (30d)</div>
              <div style={{ fontFamily: 'var(--zm-font-display)', fontSize: 32, marginTop: 6 }} className="zm-num-tab">12</div>
              <div style={{ font: '500 11px var(--zm-font-body)', color: 'var(--zm-success)' }}>+34%</div>
            </div>
            <div style={{ background: 'var(--zm-ink-900)', color: 'var(--zm-paper)', borderRadius: 'var(--zm-r-md)', padding: 14 }}>
              <div className="zm-eyebrow" style={{ fontSize: 10, color: 'var(--zm-gold-500)' }}>Earnings</div>
              <div style={{ fontFamily: 'var(--zm-font-display)', fontSize: 32, marginTop: 6 }} className="zm-num-tab">$4.8k</div>
              <div style={{ font: '500 11px var(--zm-font-body)', color: 'var(--zm-success-bg)' }}>+38%</div>
            </div>
          </div>

          {/* Quick actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
            <ZmButton variant="dark" icon="plus" full>Add skill</ZmButton>
            <ZmButton variant="secondary" icon="inbox" full>View leads</ZmButton>
          </div>
        </div>

        {/* Pending bookings */}
        <section style={{ padding: '0 20px 24px' }}>
          <div className="zm-eyebrow" style={{ marginBottom: 10 }}>Awaiting your reply</div>
          {[
            { name: 'Acme Corp', type: 'Booking · Sprint', detail: 'Jun 5–7 · $2,400', time: '2h ago' },
            { name: 'TechStart Ltd', type: 'RFQ · UX Research', detail: 'Budget $500–$2k', time: '2d ago' },
          ].map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: 14, background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)', marginBottom: 10, alignItems: 'center' }}>
              <span style={{ width: 7, height: 7, borderRadius: 4, background: 'var(--zm-coral-500)' }} />
              <ZmAvatar name={b.name} size={36} square />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: '600 13px var(--zm-font-body)' }}>{b.name}</div>
                <div style={{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>{b.type}</div>
                <div style={{ font: '500 11px var(--zm-font-body)', marginTop: 4 }}>{b.detail}</div>
              </div>
              <ZmIcon name="chevron_right" size={18} color="var(--zm-fg-muted)" />
            </div>
          ))}
        </section>

        {/* My skills */}
        <section style={{ padding: '0 20px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <h3 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 22, letterSpacing: '-0.02em', margin: 0 }}>My skills</h3>
            <a style={{ font: '500 12px var(--zm-font-body)', color: 'var(--zm-ink-700)' }}>Manage →</a>
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
            <MobileSkillCard skill={ZM_SKILLS[0]} />
            <MobileSkillCard skill={ZM_SKILLS[6]} />
          </div>
        </section>
      </div>
    </PhoneShell>
  );
}

// ────────────────────────────────────────────────
// Mobile · Skills listing with filter sheet
// ────────────────────────────────────────────────
function ZmMobileSkillsListing() {
  return (
    <PhoneShell active="exchange">
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        <div style={{ padding: '8px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <ZmIconButton icon="chevron_left" size={36} />
          <span style={{ font: '600 15px var(--zm-font-body)' }}>Skills</span>
          <ZmIconButton icon="search" size={36} />
        </div>

        {/* Filter chips */}
        <div style={{ padding: '0 20px 14px', display: 'flex', gap: 6, overflowX: 'auto' }}>
          <ZmChip size="sm" active iconRight="close">Design</ZmChip>
          <ZmChip size="sm" iconRight="chevron_down">Delivery</ZmChip>
          <ZmChip size="sm" iconRight="chevron_down">Price</ZmChip>
          <ZmChip size="sm" iconRight="chevron_down">Country</ZmChip>
          <ZmChip size="sm" tone="subtle" icon="filter">Filters</ZmChip>
        </div>

        <div style={{ padding: '0 20px', font: '500 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginBottom: 14 }}>
          <span className="zm-num-tab" style={{ color: 'var(--zm-ink-950)', fontWeight: 600 }}>1,284</span> skills · sorted by Highest rated
        </div>

        <div style={{ padding: '0 20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ZM_SKILLS.slice(0, 4).map(s => (
            <div key={s.id} style={{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)', overflow: 'hidden' }}>
              <ZmSkillThumb category={s.category} motif={s.motif} height={100} />
              <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ font: '600 14px/1.25 var(--zm-font-body)' }}>{s.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ZmAvatar name={s.seller} size={20} square={s.isBusiness} />
                  <span style={{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>{s.seller}</span>
                  <span style={{ flex: 1 }} />
                  <ZmRating value={s.rating} count={s.reviews} size={11} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4 }}>
                  <span style={{ fontFamily: 'var(--zm-font-display)', fontSize: 22, letterSpacing: '-0.02em' }} className="zm-num-tab">
                    {s.price ? `$${s.price.toLocaleString()}` : 'RFQ'}<span style={{ color: 'var(--zm-fg-muted)', fontSize: 12, fontFamily: 'var(--zm-font-body)' }}>{s.unit}</span>
                  </span>
                  <ZmButton size="sm" variant="dark">Book now</ZmButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PhoneShell>
  );
}

// ────────────────────────────────────────────────
// Mobile · Account switcher (full screen sheet)
// ────────────────────────────────────────────────
function ZmMobileAccountSwitcher() {
  return (
    <PhoneShell hideNav>
      <div style={{ flex: 1, background: 'rgba(11,15,13,0.55)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-end' }}>
        <div style={{
          width: '100%', background: 'var(--zm-paper)',
          borderTopLeftRadius: 28, borderTopRightRadius: 28,
          padding: '12px 20px 24px', maxHeight: '88%', overflowY: 'auto',
        }}>
          {/* Drag handle */}
          <div style={{ width: 40, height: 4, background: 'var(--zm-border-strong)', borderRadius: 2, margin: '0 auto 16px' }} />

          <div className="zm-eyebrow">Account context</div>
          <h2 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 32, letterSpacing: '-0.025em', margin: '6px 0 16px' }}>Switch account</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: 'var(--zm-white)', borderRadius: 'var(--zm-r-md)', border: '2px solid var(--zm-ink-700)' }}>
              <ZmAvatar name="Enoch Boison" size={40} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ font: '600 14px var(--zm-font-body)' }}>Enoch Boison</span>
                  <ZmBadge tone="emerald" size="sm">Active</ZmBadge>
                </div>
                <div style={{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>Personal</div>
              </div>
              <ZmIcon name="check" size={20} color="var(--zm-ink-700)" />
            </div>
            {[
              { name: 'Northwind Studio', role: 'Owner' },
              { name: 'Helio Capital', role: 'Member' },
              { name: 'Pangea Labs', role: 'Recruiter' },
            ].map(b => (
              <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: 'var(--zm-white)', borderRadius: 'var(--zm-r-md)', border: '1px solid var(--zm-border)' }}>
                <ZmAvatar name={b.name} size={40} square />
                <div style={{ flex: 1 }}>
                  <div style={{ font: '600 14px var(--zm-font-body)' }}>{b.name}</div>
                  <div style={{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>{b.role}</div>
                </div>
                <ZmIcon name="chevron_right" size={18} color="var(--zm-fg-muted)" />
              </div>
            ))}
            <button style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 14, background: 'transparent', border: '1px dashed var(--zm-border-strong)', borderRadius: 'var(--zm-r-md)', cursor: 'pointer', font: '500 13px var(--zm-font-body)', color: 'var(--zm-ink-700)' }}>
              <ZmIcon name="plus" size={16} /> Create new business
            </button>
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}

Object.assign(window, {
  PhoneShell, MobileSkillCard,
  ZmMobileExchange, ZmMobileSkillDetail, ZmMobileDashboard,
  ZmMobileSkillsListing, ZmMobileAccountSwitcher,
});
