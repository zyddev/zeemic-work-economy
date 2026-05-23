/* Zeemic — Overlays + supporting screens
   Account switcher, bell dropdown, notifications page, booking drawer,
   skill create wizard. */

// ────────────────────────────────────────────────
// Account Switcher panel — shown on a contextual backdrop
// ────────────────────────────────────────────────
function ZmAccountSwitcher() {
  return (
    <div style={{ width: '100%', height: '100%', background: 'rgba(11,15,13,0.55)', padding: 32, display: 'flex', justifyContent: 'flex-end', backdropFilter: 'blur(8px)' }}>
      <div style={{
        width: 400, background: 'var(--zm-paper)',
        borderRadius: 'var(--zm-r-xl)', padding: 22,
        boxShadow: 'var(--zm-shadow-xl)', fontFamily: 'var(--zm-font-body)',
        height: 'min-content',
      }} className="zm-root">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="zm-eyebrow">Account context</div>
          <ZmIconButton icon="close" size={28} />
        </div>
        <h3 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 28, letterSpacing: '-0.02em', margin: '8px 0 18px' }}>
          Switch account
        </h3>
        <p style={{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0 0 14px' }}>
          Only one context is active at a time. Switching changes your inbox, listings, and notifications.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Personal */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: 'var(--zm-white)', borderRadius: 'var(--zm-r-md)', border: '2px solid var(--zm-ink-700)' }}>
            <ZmAvatar name="Enoch Boison" size={40} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ font: '600 14px var(--zm-font-body)' }}>Enoch Boison</span>
                <ZmBadge tone="emerald" size="sm">Active</ZmBadge>
              </div>
              <div style={{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>Personal · @enochboison</div>
            </div>
            <ZmIcon name="check" size={18} color="var(--zm-ink-700)" />
          </div>

          {/* Businesses */}
          {[
            { name: 'Northwind Studio', role: 'Owner', loc: 'Berlin' },
            { name: 'Helio Capital', role: 'Member', loc: 'New York' },
            { name: 'Pangea Labs', role: 'Recruiter', loc: 'Kigali' },
          ].map((b, i) => (
            <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: 'var(--zm-white)', borderRadius: 'var(--zm-r-md)', border: '1px solid var(--zm-border)', cursor: 'pointer' }}>
              <ZmAvatar name={b.name} size={40} square />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: '600 14px var(--zm-font-body)' }}>{b.name}</div>
                <div style={{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>Business · {b.role} · {b.loc}</div>
              </div>
              <span style={{ font: '500 13px var(--zm-font-body)', color: 'var(--zm-ink-700)' }}>Select →</span>
            </div>
          ))}

          <button style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: 14,
            background: 'transparent', border: '1px dashed var(--zm-border-strong)',
            borderRadius: 'var(--zm-r-md)', cursor: 'pointer',
            font: '500 13px var(--zm-font-body)', color: 'var(--zm-ink-700)',
            marginTop: 4,
          }}>
            <ZmIcon name="plus" size={16} /> Create new business
          </button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Bell dropdown — shown anchored to the bell icon
// ────────────────────────────────────────────────
function ZmBellDropdown() {
  return (
    <div style={{ width: '100%', height: '100%', background: 'var(--zm-paper)', padding: 40, position: 'relative' }} className="zm-root">
      {/* Simulated header for context */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 64,
        borderBottom: '1px solid var(--zm-border)', background: 'var(--zm-paper)',
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 80px', gap: 12,
      }}>
        <ZmIconButton icon="search" size={36} />
        <div style={{ position: 'relative' }}>
          <ZmIconButton icon="bell" size={36} badge={3} />
          {/* Dropdown */}
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0,
            width: 380, background: 'var(--zm-white)',
            border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)',
            boxShadow: 'var(--zm-shadow-xl)', overflow: 'hidden', zIndex: 5,
          }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--zm-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ font: '600 14px var(--zm-font-body)' }}>Notifications</div>
              <a style={{ font: '500 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', cursor: 'pointer' }}>Mark all read</a>
            </div>
            <div>
              {ZM_NOTIFS.slice(0, 4).map((n, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 12, padding: '12px 16px',
                  borderBottom: i < 3 ? '1px solid var(--zm-border)' : 'none',
                  background: n.unread ? 'var(--zm-ink-50)' : 'transparent',
                  cursor: 'pointer',
                }}>
                  {n.unread && <span style={{ width: 7, height: 7, borderRadius: 4, background: 'var(--zm-ink-700)', marginTop: 8, flexShrink: 0 }} />}
                  <ZmAvatar name={n.actor} size={32} square={n.type === 'application'} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ font: `${n.unread ? 600 : 500} 13px var(--zm-font-body)` }}>{n.title}</div>
                    <div style={{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: 2 }}>{n.body}</div>
                    <div style={{ font: '500 11px var(--zm-font-mono)', color: 'var(--zm-fg-muted)', marginTop: 6 }}>{n.time} ago</div>
                  </div>
                </div>
              ))}
            </div>
            <a style={{ display: 'block', padding: 14, textAlign: 'center', font: '500 13px var(--zm-font-body)', color: 'var(--zm-ink-700)', cursor: 'pointer', borderTop: '1px solid var(--zm-border)' }}>
              View all notifications →
            </a>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px 4px 4px', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-full)', background: 'var(--zm-white)' }}>
          <ZmAvatar name="Enoch Boison" size={28} />
          <span style={{ font: '500 13px var(--zm-font-body)' }}>Enoch</span>
          <ZmIcon name="chevron_down" size={14} color="var(--zm-fg-muted)" />
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Booking drawer — slides in from right on detail page
// ────────────────────────────────────────────────
function ZmBookingDrawer() {
  return (
    <div style={{ width: '100%', height: '100%', background: 'rgba(11,15,13,0.55)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'flex-end' }} className="zm-root">
      <div style={{
        width: 480, height: '100%', background: 'var(--zm-paper)',
        boxShadow: 'var(--zm-shadow-xl)', display: 'flex', flexDirection: 'column',
        fontFamily: 'var(--zm-font-body)',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--zm-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="zm-eyebrow">Booking request</div>
            <div style={{ font: '600 14px var(--zm-font-body)', marginTop: 4 }}>UX Research & Usability Testing</div>
          </div>
          <ZmIconButton icon="close" size={32} />
        </div>

        <div style={{ padding: 28, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 22 }}>
          {/* Package picker */}
          <div>
            <label style={{ font: '600 13px var(--zm-font-body)', display: 'block', marginBottom: 8 }}>Select package</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[
                { name: 'Heuristic', price: '$600' },
                { name: 'Sprint', price: '$1,800', active: true },
                { name: 'Deep dive', price: '$3,400' },
              ].map(p => (
                <div key={p.name} style={{
                  padding: 14, borderRadius: 'var(--zm-r-md)',
                  background: p.active ? 'var(--zm-ink-900)' : 'var(--zm-white)',
                  color: p.active ? 'var(--zm-paper)' : 'inherit',
                  border: p.active ? '2px solid var(--zm-ink-900)' : '1px solid var(--zm-border)',
                  cursor: 'pointer',
                }}>
                  <div style={{ font: '500 12px var(--zm-font-body)', opacity: p.active ? 0.7 : 0.6, marginBottom: 4 }}>{p.name}</div>
                  <div style={{ font: '600 16px var(--zm-font-display)', letterSpacing: '-0.015em' }}>{p.price}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div>
            <label style={{ font: '600 13px var(--zm-font-body)', display: 'block', marginBottom: 8 }}>Preferred dates</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div style={{ padding: '10px 12px', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <ZmIcon name="calendar" size={14} color="var(--zm-fg-muted)" />
                <span style={{ font: '500 13px var(--zm-font-body)' }}>Jun 5, 2026</span>
              </div>
              <div style={{ padding: '10px 12px', background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <ZmIcon name="calendar" size={14} color="var(--zm-fg-muted)" />
                <span style={{ font: '500 13px var(--zm-font-body)' }}>Jun 7, 2026</span>
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <label style={{ font: '600 13px var(--zm-font-body)', display: 'block', marginBottom: 8 }}>Message to seller <span style={{ color: 'var(--zm-fg-muted)', fontWeight: 400 }}>(optional)</span></label>
            <div style={{ padding: 12, background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)', minHeight: 96, font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>
              <span style={{ color: 'var(--zm-ink-950)' }}>We’d like a 3-day moderated study with 8 participants for our fintech onboarding flow. Timing is firm — readout on the Friday would be ideal.</span>
            </div>
          </div>

          {/* Contact */}
          <div style={{ background: 'var(--zm-ink-50)', borderRadius: 'var(--zm-r-md)', padding: 16, border: '1px solid var(--zm-ink-200)' }}>
            <label style={{ font: '600 13px var(--zm-font-body)', display: 'block', marginBottom: 10 }}>Your contact</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                ['Name', 'John Doe'],
                ['Email', 'john@acme.com'],
                ['Company', 'Acme Corp'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', font: '500 13px var(--zm-font-body)' }}>
                  <span style={{ color: 'var(--zm-fg-muted)' }}>{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div style={{ borderTop: '1px solid var(--zm-border)', paddingTop: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>
              <span>Sprint package</span><span>$1,800</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: 6 }}>
              <span>Service fee (5%)</span><span>$90</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--zm-font-display)', fontSize: 28, letterSpacing: '-0.02em', marginTop: 12, alignItems: 'baseline' }}>
              <span>Total</span><span className="zm-num-tab">$1,890</span>
            </div>
          </div>
        </div>

        <div style={{ padding: 28, borderTop: '1px solid var(--zm-border)' }}>
          <ZmButton variant="primary" size="lg" full iconRight="arrow_right">Submit booking request</ZmButton>
          <div style={{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textAlign: 'center', marginTop: 10 }}>
            No charge until the seller accepts. Payment held in escrow on confirmation.
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Notification Centre (full page)
// ────────────────────────────────────────────────
function ZmNotificationsPage() {
  const all = [
    ...ZM_NOTIFS,
    { type: 'message', title: 'New message from Sarah K.', body: '"Got it — does Tuesday work for the readout?"', time: '5h', unread: true, actor: 'Sarah Kim' },
    { type: 'lead', title: 'Lead form submitted', body: 'GreenHouse Health · UX Research', time: '6d', unread: false, actor: 'GreenHouse Health' },
    { type: 'team', title: 'You were added to Pangea Labs', body: 'As a Recruiter', time: '1w', unread: false, actor: 'Pangea Labs' },
  ];
  return (
    <div className="zm-root" style={{ width: 1440, background: 'var(--zm-paper)', minHeight: 900 }}>
      <ZmHeader active="dashboard" />
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '48px 32px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
          <div>
            <div className="zm-eyebrow">Inbox · everything in one place</div>
            <h1 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 56, lineHeight: 1, letterSpacing: '-0.025em', margin: '8px 0 0' }}>Notifications</h1>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <ZmButton variant="ghost" size="md">Mark all read</ZmButton>
            <ZmButton variant="ghost" size="md">Clear all</ZmButton>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          <ZmChip active>All <span style={{ marginLeft: 4, opacity: 0.6 }}>11</span></ZmChip>
          <ZmChip>Leads <span style={{ marginLeft: 4, color: 'var(--zm-fg-muted)' }}>4</span></ZmChip>
          <ZmChip>Messages <span style={{ marginLeft: 4, color: 'var(--zm-fg-muted)' }}>2</span></ZmChip>
          <ZmChip>Applications <span style={{ marginLeft: 4, color: 'var(--zm-fg-muted)' }}>1</span></ZmChip>
          <ZmChip>Reviews <span style={{ marginLeft: 4, color: 'var(--zm-fg-muted)' }}>2</span></ZmChip>
          <ZmChip>System <span style={{ marginLeft: 4, color: 'var(--zm-fg-muted)' }}>2</span></ZmChip>
        </div>

        <div style={{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', overflow: 'hidden' }}>
          {all.map((n, i) => (
            <div key={i} style={{
              display: 'flex', gap: 14, padding: '18px 22px',
              borderBottom: i < all.length - 1 ? '1px solid var(--zm-border)' : 'none',
              background: n.unread ? 'var(--zm-ink-50)' : 'transparent',
              alignItems: 'flex-start',
            }}>
              <div style={{ width: 8, marginTop: 8 }}>
                {n.unread && <span style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--zm-ink-700)', display: 'block' }} />}
              </div>
              <ZmAvatar name={n.actor} size={40} square={n.type === 'application' || n.type === 'team'} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: `${n.unread ? 600 : 500} 15px var(--zm-font-body)` }}>{n.title}</div>
                <div style={{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: 4 }}>{n.body}</div>
                <div style={{ font: '500 11px var(--zm-font-mono)', color: 'var(--zm-fg-muted)', marginTop: 8 }}>{n.time} ago</div>
              </div>
              <ZmButton size="sm" variant="secondary">{n.type === 'message' ? 'Reply' : n.type === 'review' ? 'View' : 'Review'}</ZmButton>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Skill Create Wizard (/dashboard/skills/new)
// Multi-step form, currently showing Step 3 (Pricing)
// ────────────────────────────────────────────────
function ZmSkillCreate() {
  const steps = [
    { id: 1, name: 'Basics' },
    { id: 2, name: 'Service details' },
    { id: 3, name: 'Pricing', active: true },
    { id: 4, name: 'Deliverables' },
    { id: 5, name: 'Brochure' },
    { id: 6, name: 'Lead form' },
    { id: 7, name: 'Media' },
    { id: 8, name: 'Availability' },
  ];
  return (
    <div className="zm-root" style={{ width: 1440, background: 'var(--zm-paper)', minHeight: 900 }}>
      <ZmHeader active="dashboard" />

      {/* Wizard top bar */}
      <div style={{ padding: '24px 80px 0', display: 'flex', alignItems: 'center', gap: 14 }}>
        <ZmIconButton icon="chevron_left" size={36} variant="surface" />
        <div>
          <div className="zm-eyebrow">My skills · new listing</div>
          <h2 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 28, letterSpacing: '-0.02em', margin: '4px 0 0' }}>UX Research & Usability Testing</h2>
        </div>
        <span style={{ flex: 1 }} />
        <ZmButton variant="ghost">Save as draft</ZmButton>
        <ZmButton variant="dark">Preview public page</ZmButton>
      </div>

      {/* Stepper */}
      <div style={{ padding: '32px 80px 0', borderBottom: '1px solid var(--zm-border)' }}>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {steps.map((s, i) => (
            <React.Fragment key={s.id}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '8px 12px', borderRadius: 'var(--zm-r-full)',
                background: s.active ? 'var(--zm-ink-900)' : 'transparent',
                color: s.active ? 'var(--zm-paper)' : s.id < 3 ? 'var(--zm-ink-700)' : 'var(--zm-fg-muted)',
                font: `${s.active ? 600 : 500} 13px var(--zm-font-body)`,
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 11,
                  background: s.active ? 'var(--zm-gold-500)' : s.id < 3 ? 'var(--zm-ink-700)' : 'var(--zm-paper-2)',
                  color: s.active ? 'var(--zm-ink-950)' : s.id < 3 ? 'var(--zm-paper)' : 'var(--zm-fg-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  font: '600 11px var(--zm-font-mono)',
                }}>
                  {s.id < 3 ? <ZmIcon name="check" size={12} /> : s.id}
                </div>
                {s.name}
              </div>
              {i < steps.length - 1 && <span style={{ width: 14, height: 1, background: 'var(--zm-border)' }} />}
            </React.Fragment>
          ))}
        </div>
        <div style={{ height: 24 }} />
      </div>

      {/* Form */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 48, padding: '48px 80px 80px' }}>
        <div>
          <div className="zm-eyebrow">Step 3 · Pricing</div>
          <h2 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 44, lineHeight: 1.05, letterSpacing: '-0.025em', margin: '8px 0 0' }}>
            How do buyers <em style={{ fontStyle: 'italic' }}>pay</em> for this?
          </h2>
          <p style={{ font: '400 16px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: 12, maxWidth: 540 }}>
            Pick a pricing model. Buyers can always request a custom quote — “Request a Quote” is always enabled.
          </p>

          {/* Pricing model */}
          <div style={{ marginTop: 36 }}>
            <label style={{ font: '600 13px var(--zm-font-body)', display: 'block', marginBottom: 12 }}>Pricing model</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[
                { name: 'Hourly', d: 'Per hour worked', icon: 'bolt' },
                { name: 'Per project', d: 'Fixed fee, scoped', icon: 'briefcase' },
                { name: 'Per session', d: 'Per delivery', icon: 'calendar', active: true },
                { name: 'Packages', d: 'Tiered offers', icon: 'layers' },
                { name: 'RFQ only', d: 'Custom every time', icon: 'message' },
              ].map(p => (
                <div key={p.name} style={{
                  padding: 16, borderRadius: 'var(--zm-r-md)',
                  background: p.active ? 'var(--zm-ink-50)' : 'var(--zm-white)',
                  border: p.active ? '2px solid var(--zm-ink-700)' : '1px solid var(--zm-border)',
                  cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', gap: 8,
                }}>
                  <ZmIcon name={p.icon} size={18} color={p.active ? 'var(--zm-ink-700)' : 'var(--zm-fg-muted)'} />
                  <div>
                    <div style={{ font: '600 14px var(--zm-font-body)' }}>{p.name}</div>
                    <div style={{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: 2 }}>{p.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Packages */}
          <div style={{ marginTop: 36 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <label style={{ font: '600 13px var(--zm-font-body)' }}>Packages</label>
              <ZmButton size="sm" variant="ghost" icon="plus">Add package</ZmButton>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { name: 'Heuristic', desc: '1 evaluator, 5 days, async report', price: 600 },
                { name: 'Sprint', desc: '5 participants, recorded sessions, report + readout', price: 1800, featured: true },
                { name: 'Deep dive', desc: '8 participants, longitudinal, full team workshop', price: 3400 },
              ].map(p => (
                <div key={p.name} style={{
                  display: 'grid', gridTemplateColumns: '32px 160px 1fr 140px 40px',
                  gap: 16, alignItems: 'center',
                  padding: 14, background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)',
                }}>
                  <div style={{ cursor: 'grab', color: 'var(--zm-fg-muted)' }}>
                    <ZmIcon name="menu" size={14} />
                  </div>
                  <div>
                    <input value={p.name} readOnly style={{ font: '600 14px var(--zm-font-body)', border: 'none', outline: 'none', background: 'transparent', padding: 0, width: '100%' }} />
                    {p.featured && <div style={{ font: '500 10px var(--zm-font-mono)', color: 'var(--zm-gold-700)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>Most booked</div>}
                  </div>
                  <input value={p.desc} readOnly style={{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', border: 'none', outline: 'none', background: 'transparent', padding: 0, width: '100%' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: 'var(--zm-paper)', borderRadius: 'var(--zm-r-sm)' }}>
                    <span style={{ font: '500 13px var(--zm-font-mono)', color: 'var(--zm-fg-muted)' }}>$</span>
                    <input value={p.price.toLocaleString()} readOnly style={{ font: '600 14px var(--zm-font-mono)', border: 'none', outline: 'none', background: 'transparent', padding: 0, width: '100%' }} />
                  </div>
                  <ZmIconButton icon="more" size={28} />
                </div>
              ))}
            </div>
          </div>

          {/* RFQ toggle */}
          <div style={{ marginTop: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 20, background: 'var(--zm-ink-50)', border: '1px solid var(--zm-ink-200)', borderRadius: 'var(--zm-r-md)' }}>
            <div>
              <div style={{ font: '600 14px var(--zm-font-body)' }}>Always allow Request for Quote</div>
              <div style={{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: 4 }}>Buyers can request a custom quote even when packages are listed.</div>
            </div>
            <div style={{ width: 44, height: 26, borderRadius: 13, background: 'var(--zm-ink-700)', position: 'relative', cursor: 'pointer' }}>
              <div style={{ position: 'absolute', right: 3, top: 3, width: 20, height: 20, borderRadius: 10, background: 'var(--zm-paper)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 48 }}>
            <ZmButton variant="ghost" icon="chevron_left">Back</ZmButton>
            <div style={{ display: 'flex', gap: 8 }}>
              <ZmButton variant="secondary">Save & exit</ZmButton>
              <ZmButton variant="primary" iconRight="arrow_right">Continue · Deliverables</ZmButton>
            </div>
          </div>
        </div>

        {/* Live preview */}
        <aside>
          <div style={{ position: 'sticky', top: 88 }}>
            <div className="zm-eyebrow" style={{ marginBottom: 10 }}>Live preview</div>
            <div style={{ transform: 'scale(1)', transformOrigin: 'top right' }}>
              <ZmSkillCard skill={ZM_SKILLS[0]} />
            </div>
            <div style={{ marginTop: 16, padding: 16, background: 'var(--zm-paper-2)', borderRadius: 'var(--zm-r-md)' }}>
              <div className="zm-eyebrow">Tip</div>
              <p style={{ font: '400 13px/1.5 var(--zm-font-body)', margin: '6px 0 0' }}>
                Listings with at least <strong>3 packages</strong> book 2× more often than single-price listings.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

Object.assign(window, { ZmAccountSwitcher, ZmBellDropdown, ZmBookingDrawer, ZmNotificationsPage, ZmSkillCreate });
