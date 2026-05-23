/* Zeemic — Dashboards
   User Dashboard (/dashboard), Leads inbox (/dashboard/leads),
   Business Dashboard (/b/[id]), Business Recruiters (/b/[id]/team/recruiters) */

// Shared user sidebar
const USER_SIDEBAR = [
  { id: 'overview', label: 'Overview', icon: 'grid' },
  { id: 'skills', label: 'My skills', icon: 'wrench', count: 3 },
  { id: 'leads', label: 'Leads & inquiries', icon: 'inbox', count: 12 },
  { id: 'apps', label: 'Job applications', icon: 'briefcase', count: 4 },
  { id: 'messages', label: 'Messages', icon: 'message', count: 6 },
  { section: 'More' },
  { id: 'intel', label: 'Intelligence', icon: 'sparkles' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];
const BIZ_SIDEBAR = [
  { id: 'overview', label: 'Overview', icon: 'grid' },
  { section: 'Listings' },
  { id: 'jobs', label: 'Jobs', icon: 'briefcase', count: 8, indent: true },
  { id: 'skills', label: 'Skills', icon: 'wrench', count: 4, indent: true },
  { section: 'Team' },
  { id: 'members', label: 'Members', icon: 'users', count: 12, indent: true },
  { id: 'recruiters', label: 'Recruiters', icon: 'badge_check', count: 4, indent: true },
  { section: 'Inbox' },
  { id: 'leads', label: 'Leads', icon: 'inbox', count: 27 },
  { id: 'messages', label: 'Messages', icon: 'message', count: 6 },
  { id: 'notifs', label: 'Notifications', icon: 'bell', count: 11 },
  { section: 'Insights' },
  { id: 'analytics', label: 'Analytics', icon: 'chart_bar' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

// ────────────────────────────────────────────────
// User Dashboard — Overview
// ────────────────────────────────────────────────
function ZmUserDashboard() {
  return (
    <div className="zm-root" style={{ width: 1440, background: 'var(--zm-paper)', minHeight: 900 }}>
      <ZmHeader active="dashboard" />
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 900 - 64 }}>
        <ZmSidebar items={USER_SIDEBAR} active="overview"
          header={<div style={{ padding: '4px 12px' }}>
            <div className="zm-eyebrow">Personal account</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 10 }}>
              <ZmAvatar name="Enoch Boison" size={36} />
              <div style={{ minWidth: 0 }}>
                <div style={{ font: '600 14px var(--zm-font-body)' }}>Enoch Boison</div>
                <div style={{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>@enochboison</div>
              </div>
            </div>
          </div>}
          footer={<div style={{ padding: '12px 12px 4px', borderTop: '1px solid var(--zm-border)', marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, borderRadius: 'var(--zm-r-md)', background: 'var(--zm-ink-100)' }}>
              <ZmAvatar name="Northwind Studio" size={28} square />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: '600 12px var(--zm-font-body)' }}>Switch to Business</div>
                <div style={{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>Northwind Studio</div>
              </div>
              <ZmIcon name="chevron_right" size={14} color="var(--zm-fg-muted)" />
            </div>
          </div>}
        />

        <main style={{ padding: 40, overflow: 'hidden' }}>
          {/* Welcome bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
            <div>
              <div className="zm-eyebrow">Wednesday, May 21</div>
              <h1 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 52, lineHeight: 1, letterSpacing: '-0.025em', margin: '8px 0 0' }}>
                Good morning, <em style={{ fontStyle: 'italic' }}>Enoch.</em>
              </h1>
              <p style={{ font: '400 16px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: 10 }}>
                You have <span style={{ color: 'var(--zm-ink-950)', fontWeight: 600 }}>3 unresponded leads</span> and 1 booking awaiting confirmation.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <ZmButton variant="secondary" icon="bookmark">View leads</ZmButton>
              <ZmButton variant="dark" icon="plus">Add skill</ZmButton>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
            <ZmStat label="Active skills" value="3" delta="+1 this month" icon="wrench" />
            <ZmStat label="Leads (30d)" value="12" delta="+34% vs prev." icon="inbox" />
            <ZmStat label="Bookings" value="2" delta="1 pending" deltaTone="warning" icon="calendar" />
            <ZmStat label="Profile views" value="284" delta="+12 this week" icon="eye" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
            {/* Recent activity */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
                <h3 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 28, letterSpacing: '-0.02em', margin: 0 }}>Recent activity</h3>
                <a style={{ font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', cursor: 'pointer' }}>View all →</a>
              </div>
              <div style={{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', overflow: 'hidden' }}>
                {[
                  { type: 'booking', who: 'Acme Corp', what: 'booked Product Design Sprint', detail: 'Jun 5–7 · $2,400', time: '2h ago', tone: 'gold' },
                  { type: 'rfq', who: 'TechStart Ltd', what: 'sent a quote request', detail: 'Budget $500–$2,000', time: '2d ago', tone: 'emerald' },
                  { type: 'review', who: 'John D.', what: 'left a ★ 5 review', detail: '“Excellent work, very thorough…”', time: '3d ago', tone: 'success' },
                  { type: 'app', who: 'Northwind Studio', what: 'shortlisted your application', detail: 'Senior Designer', time: '4d ago', tone: 'sky' },
                  { type: 'download', who: 'Anonymous', what: 'downloaded your brochure', detail: 'UX Research', time: '5d ago', tone: 'neutral' },
                ].map((a, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 14, padding: '16px 18px',
                    borderBottom: i < 4 ? '1px solid var(--zm-border)' : 'none', alignItems: 'center',
                  }}>
                    <ZmAvatar name={a.who} size={36} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ font: '400 14px var(--zm-font-body)' }}>
                        <span style={{ fontWeight: 600 }}>{a.who}</span> {a.what}
                      </div>
                      <div style={{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: 2 }}>{a.detail}</div>
                    </div>
                    <span style={{ font: '500 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', whiteSpace: 'nowrap' }}>{a.time}</span>
                    <ZmIconButton icon="chevron_right" size={28} />
                  </div>
                ))}
              </div>
            </div>

            {/* Right rail */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Earnings */}
              <div style={{ background: 'var(--zm-ink-900)', color: 'var(--zm-fg-on-dark)', borderRadius: 'var(--zm-r-lg)', padding: 22 }}>
                <div className="zm-eyebrow" style={{ color: 'var(--zm-gold-500)' }}>Earnings this month</div>
                <div style={{ fontFamily: 'var(--zm-font-display)', fontSize: 56, lineHeight: 1, letterSpacing: '-0.025em', marginTop: 12 }} className="zm-num-tab">$4,820</div>
                <div style={{ font: '500 13px var(--zm-font-body)', color: 'var(--zm-success-bg)', marginTop: 6 }}>+38% vs April</div>
                {/* Mini bar chart */}
                <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', marginTop: 24, height: 64 }}>
                  {[28, 34, 22, 46, 40, 58, 50, 70, 64, 78, 92, 100].map((v, i) => (
                    <div key={i} style={{ flex: 1, height: `${v}%`, background: i === 11 ? 'var(--zm-gold-500)' : 'rgba(245,241,232,0.18)', borderRadius: 2 }} />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, font: '400 11px var(--zm-font-mono)', color: 'var(--zm-fg-on-dark-muted)' }}>
                  <span>Jun</span><span>May</span>
                </div>
              </div>

              {/* Intelligence */}
              <div style={{ background: 'var(--zm-gold-200)', borderRadius: 'var(--zm-r-lg)', padding: 22, position: 'relative', overflow: 'hidden' }}>
                <div className="zm-eyebrow">Career intelligence</div>
                <h4 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 22, letterSpacing: '-0.015em', margin: '8px 0 12px', lineHeight: 1.2 }}>
                  Senior Designer roles in Berlin paid <em>14% more</em> in Q1.
                </h4>
                <ZmButton size="sm" variant="dark">Open intelligence</ZmButton>
              </div>
            </div>
          </div>

          {/* My skills row */}
          <div style={{ marginTop: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
              <h3 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 28, letterSpacing: '-0.02em', margin: 0 }}>My active skills</h3>
              <a style={{ font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', cursor: 'pointer' }}>Manage all →</a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <ZmSkillManageCard skill={ZM_SKILLS[0]} views={284} inquiries={12} status="Active" />
              <ZmSkillManageCard skill={ZM_SKILLS[6]} views={142} inquiries={7} status="Active" />
              <ZmSkillManageCard skill={{ ...ZM_SKILLS[5], title: 'Design Systems Workshop' }} views={0} inquiries={0} status="Draft" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Leads Inbox (/dashboard/leads)
// ────────────────────────────────────────────────
function ZmLeadsInbox() {
  return (
    <div className="zm-root" style={{ width: 1440, background: 'var(--zm-paper)', minHeight: 900 }}>
      <ZmHeader active="dashboard" />
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 900 - 64 }}>
        <ZmSidebar items={USER_SIDEBAR} active="leads"
          header={<div style={{ padding: '4px 12px' }}>
            <div className="zm-eyebrow">Personal account</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 10 }}>
              <ZmAvatar name="Enoch Boison" size={36} />
              <div style={{ minWidth: 0 }}>
                <div style={{ font: '600 14px var(--zm-font-body)' }}>Enoch Boison</div>
                <div style={{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>@enochboison</div>
              </div>
            </div>
          </div>}
        />

        <main style={{ display: 'grid', gridTemplateColumns: '380px 1fr', minHeight: 0 }}>
          {/* Lead list */}
          <div style={{ borderRight: '1px solid var(--zm-border)', display: 'flex', flexDirection: 'column', background: 'var(--zm-paper)' }}>
            <div style={{ padding: '24px 24px 0' }}>
              <h2 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 36, letterSpacing: '-0.02em', margin: 0 }}>Leads</h2>
              <div style={{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: 4 }}>12 this month · 3 unread</div>
              <div style={{ marginTop: 16 }}>
                <ZmSearch placeholder="Search leads…" size="sm" />
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 14, overflowX: 'auto', paddingBottom: 14, borderBottom: '1px solid var(--zm-border)' }}>
                <ZmChip size="sm" active>All <span style={{ marginLeft: 4, opacity: 0.6 }}>12</span></ZmChip>
                <ZmChip size="sm">Bookings <span style={{ marginLeft: 4, color: 'var(--zm-fg-muted)' }}>2</span></ZmChip>
                <ZmChip size="sm">RFQ <span style={{ marginLeft: 4, color: 'var(--zm-fg-muted)' }}>4</span></ZmChip>
                <ZmChip size="sm">Proposals <span style={{ marginLeft: 4, color: 'var(--zm-fg-muted)' }}>1</span></ZmChip>
                <ZmChip size="sm">Forms <span style={{ marginLeft: 4, color: 'var(--zm-fg-muted)' }}>3</span></ZmChip>
                <ZmChip size="sm">Brochure <span style={{ marginLeft: 4, color: 'var(--zm-fg-muted)' }}>2</span></ZmChip>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {ZM_LEADS.map((l, i) => {
                const isActive = i === 0;
                const typeMeta = {
                  booking:  { label: 'Booking',  tone: 'gold',   icon: 'calendar' },
                  rfq:      { label: 'RFQ',      tone: 'emerald',icon: 'file_text' },
                  lead:     { label: 'Lead form',tone: 'sky',    icon: 'inbox' },
                  brochure: { label: 'Brochure', tone: 'neutral',icon: 'download' },
                  proposal: { label: 'Proposal', tone: 'gold',   icon: 'file_text' },
                }[l.type];
                return (
                  <div key={l.id} style={{
                    padding: '14px 24px', display: 'flex', gap: 12, alignItems: 'flex-start',
                    borderBottom: '1px solid var(--zm-border)',
                    background: isActive ? 'var(--zm-white)' : 'transparent',
                    cursor: 'pointer',
                    borderLeft: isActive ? '3px solid var(--zm-ink-700)' : '3px solid transparent',
                  }}>
                    <ZmAvatar name={l.fromName} size={36} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {l.status === 'new' && <span style={{ width: 7, height: 7, borderRadius: 3.5, background: 'var(--zm-ink-700)' }} />}
                        <span style={{ font: `${l.status === 'new' ? 600 : 500} 14px var(--zm-font-body)`, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.fromName}</span>
                        <span style={{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>{l.when}</span>
                      </div>
                      <div style={{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.skill}</div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                        <ZmBadge tone={typeMeta.tone} size="sm">{typeMeta.label}</ZmBadge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detail panel */}
          <div style={{ padding: 36, overflowY: 'auto', background: 'var(--zm-white)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <ZmBadge tone="gold" size="lg">Booking request</ZmBadge>
              <ZmBadge tone="warning" dot>Awaiting your reply</ZmBadge>
            </div>
            <h1 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 44, lineHeight: 1.05, letterSpacing: '-0.025em', margin: 0 }}>Product Design Sprint — 3 days</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 16 }}>
              <ZmAvatar name="Acme Corp" size={44} square />
              <div>
                <div style={{ font: '600 15px var(--zm-font-body)' }}>Acme Corp <ZmIcon name="badge_check" size={13} color="var(--zm-ink-700)" style={{ verticalAlign: -1 }} /></div>
                <div style={{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>John Doe · john@acme.com · +1 555 0101</div>
              </div>
              <span style={{ flex: 1 }} />
              <span style={{ font: '500 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>Received 2 hours ago</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 28 }}>
              {[
                ['Skill', 'UX Research & Usability Testing', 'wrench'],
                ['Dates', 'Jun 5 – 7, 2026', 'calendar'],
                ['Budget', '$2,000 – $3,000', 'target'],
              ].map(([k, v, icon]) => (
                <div key={k} style={{ background: 'var(--zm-paper)', borderRadius: 'var(--zm-r-md)', padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <ZmIcon name={icon} size={18} color="var(--zm-fg-muted)" />
                  <div>
                    <div className="zm-eyebrow">{k}</div>
                    <div style={{ font: '600 14px var(--zm-font-body)', marginTop: 4 }}>{v}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 28, padding: 22, borderRadius: 'var(--zm-r-lg)', background: 'var(--zm-ink-50)', border: '1px solid var(--zm-ink-200)' }}>
              <div className="zm-eyebrow">Message from buyer</div>
              <p style={{ font: '400 16px/1.55 var(--zm-font-body)', margin: '10px 0 0' }}>
                Hi — we need a 3-day moderated study with 8 participants for a fintech onboarding flow. Timing is firm and we’d ideally finish with a stakeholder readout that Friday. We have a participant pool but happy to hear your sourcing approach.
              </p>
              <p style={{ font: '400 16px/1.55 var(--zm-font-body)', margin: '10px 0 0' }}>
                Budget is flexible inside the range above. Let us know if your <em style={{ fontStyle: 'italic', fontFamily: 'var(--zm-font-display)' }}>Sprint</em> package fits.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 32 }}>
              <ZmButton variant="primary" size="lg" iconRight="check">Accept booking</ZmButton>
              <ZmButton variant="secondary" size="lg">Propose alternative</ZmButton>
              <ZmButton variant="ghost" size="lg">Decline</ZmButton>
              <span style={{ flex: 1 }} />
              <ZmButton variant="dark" size="lg" icon="message">Send message</ZmButton>
            </div>

            <div style={{ marginTop: 36 }}>
              <div className="zm-eyebrow">Activity</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 12, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 11, top: 6, bottom: 6, width: 2, background: 'var(--zm-border)' }} />
                {[
                  ['2h ago', 'Booking request submitted', 'check'],
                  ['2h ago', 'Notification sent to your inbox', 'bell'],
                  ['—', 'Pending your response', 'dot'],
                  ['—', 'Buyer notified of decision', 'dot'],
                  ['—', 'Confirmed · added to calendar', 'dot'],
                ].map(([t, label, icon], i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', position: 'relative' }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: 12,
                      background: i < 2 ? 'var(--zm-ink-700)' : 'var(--zm-paper-2)',
                      color: i < 2 ? 'var(--zm-paper)' : 'var(--zm-fg-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      border: '2px solid var(--zm-white)',
                    }}>
                      <ZmIcon name={icon} size={12} />
                    </div>
                    <span style={{ font: `${i < 2 ? 500 : 400} 13px var(--zm-font-body)`, color: i < 2 ? 'var(--zm-ink-950)' : 'var(--zm-fg-muted)', flex: 1 }}>{label}</span>
                    <span style={{ font: '400 12px var(--zm-font-mono)', color: 'var(--zm-fg-muted)' }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Business Dashboard — Overview (/b/[id])
// ────────────────────────────────────────────────
function ZmBusinessDashboard() {
  return (
    <div className="zm-root" style={{ width: 1440, background: 'var(--zm-paper)', minHeight: 900 }}>
      <ZmHeader context="business" business={{ name: 'Northwind Studio' }} active="dashboard" unread={11} />
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 900 - 64 }}>
        <ZmSidebar items={BIZ_SIDEBAR} active="overview"
          header={<div style={{ padding: '4px 12px' }}>
            <div className="zm-eyebrow">Business account</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 10 }}>
              <ZmAvatar name="Northwind Studio" size={36} square />
              <div style={{ minWidth: 0 }}>
                <div style={{ font: '600 14px var(--zm-font-body)' }}>Northwind Studio</div>
                <div style={{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>Owner · Berlin</div>
              </div>
            </div>
          </div>}
          footer={<div style={{ padding: '12px 12px 4px', borderTop: '1px solid var(--zm-border)', marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, borderRadius: 'var(--zm-r-md)', background: 'var(--zm-paper-2)' }}>
              <ZmAvatar name="Enoch Boison" size={28} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: '600 12px var(--zm-font-body)' }}>Switch to Personal</div>
                <div style={{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>Enoch Boison</div>
              </div>
              <ZmIcon name="chevron_right" size={14} color="var(--zm-fg-muted)" />
            </div>
          </div>}
        />

        <main style={{ padding: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
            <div>
              <div className="zm-eyebrow">Northwind Studio · 12 members</div>
              <h1 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 52, lineHeight: 1, letterSpacing: '-0.025em', margin: '8px 0 0' }}>
                Business overview
              </h1>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <ZmButton variant="secondary" icon="external">Public profile</ZmButton>
              <ZmButton variant="dark" icon="plus">New listing</ZmButton>
            </div>
          </div>

          {/* 5 stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 32 }}>
            <ZmStat label="Active jobs" value="8" delta="+2 this week" icon="briefcase" />
            <ZmStat label="Active skills" value="4" delta="—" icon="wrench" />
            <ZmStat label="Leads (30d)" value="27" delta="+58%" icon="inbox" />
            <ZmStat label="Messages" value="6" delta="6 unread" deltaTone="warning" icon="message" />
            <ZmStat label="Team" value="12" delta="4 recruiters" icon="users" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
            <div>
              {/* Lead funnel */}
              <div style={{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', padding: 24, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
                  <h3 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 26, letterSpacing: '-0.02em', margin: 0 }}>Lead funnel — 30 days</h3>
                  <ZmChip size="sm" tone="subtle" iconRight="chevron_down">Last 30 days</ZmChip>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, alignItems: 'flex-end' }}>
                  {[
                    { label: 'Brochure', value: 412, h: 100, tone: 'var(--zm-paper-3)' },
                    { label: 'Lead forms', value: 184, h: 64, tone: 'var(--zm-ink-300)' },
                    { label: 'RFQs', value: 92, h: 42, tone: 'var(--zm-ink-500)' },
                    { label: 'Bookings', value: 27, h: 24, tone: 'var(--zm-ink-700)' },
                    { label: 'Closed', value: 14, h: 14, tone: 'var(--zm-gold-500)' },
                  ].map(s => (
                    <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ height: 160, display: 'flex', alignItems: 'flex-end' }}>
                        <div style={{ width: '100%', height: `${s.h}%`, background: s.tone, borderRadius: 'var(--zm-r-sm)', position: 'relative' }}>
                          <span style={{ position: 'absolute', top: -22, left: 0, font: '600 13px var(--zm-font-body)' }} className="zm-num-tab">{s.value}</span>
                        </div>
                      </div>
                      <div style={{ font: '500 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid var(--zm-border)' }}>
                  <span style={{ font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>Conversion: 3.4% brochure → close</span>
                  <ZmButton size="sm" variant="ghost" iconRight="arrow_right">Open analytics</ZmButton>
                </div>
              </div>

              {/* Recent listings */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
                <h3 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 26, letterSpacing: '-0.02em', margin: 0 }}>Top-performing listings</h3>
              </div>
              <div style={{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)' }}>
                {[
                  { title: 'Brand Identity Sprint', type: 'Skill', views: 842, leads: 12, rev: '$8,500' },
                  { title: 'Senior UX Designer', type: 'Job', views: 1240, leads: 24, rev: '—' },
                  { title: 'Commercial Contract Review', type: 'Skill', views: 614, leads: 9, rev: '$2,880' },
                  { title: 'Staff Product Engineer', type: 'Job', views: 980, leads: 18, rev: '—' },
                ].map((l, i) => (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '1fr 80px 80px 100px 60px',
                    gap: 16, padding: '14px 20px', alignItems: 'center',
                    borderBottom: i < 3 ? '1px solid var(--zm-border)' : 'none',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    <div>
                      <div style={{ font: '600 14px var(--zm-font-body)' }}>{l.title}</div>
                      <div style={{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: 2 }}>{l.type}</div>
                    </div>
                    <div><div className="zm-eyebrow" style={{ fontSize: 9 }}>Views</div><div style={{ font: '500 14px var(--zm-font-body)' }}>{l.views.toLocaleString()}</div></div>
                    <div><div className="zm-eyebrow" style={{ fontSize: 9 }}>Leads</div><div style={{ font: '500 14px var(--zm-font-body)' }}>{l.leads}</div></div>
                    <div><div className="zm-eyebrow" style={{ fontSize: 9 }}>Revenue</div><div style={{ font: '500 14px var(--zm-font-body)' }}>{l.rev}</div></div>
                    <ZmIconButton icon="more" size={28} />
                  </div>
                ))}
              </div>
            </div>

            {/* Right rail */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: 'var(--zm-ink-900)', color: 'var(--zm-fg-on-dark)', borderRadius: 'var(--zm-r-lg)', padding: 22 }}>
                <div className="zm-eyebrow" style={{ color: 'var(--zm-gold-500)' }}>Recruiting team</div>
                <h4 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 28, letterSpacing: '-0.02em', margin: '8px 0 12px' }}>4 recruiters · 109 placements</h4>
                <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                  <ZmAvatarStack people={ZM_RECRUITERS} size={36} max={4} />
                  <span style={{ flex: 1 }} />
                  <ZmButton variant="onDark" size="sm" iconRight="arrow_right">Manage</ZmButton>
                </div>
              </div>
              <div style={{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', padding: 22 }}>
                <div className="zm-eyebrow">Inbox — needs your attention</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
                  {[
                    ['3 RFQs awaiting quote', 'rfq · oldest 2 days'],
                    ['1 booking unconfirmed', 'Sprint · Jun 5–7'],
                    ['2 unanswered messages', 'Latest from Acme Corp'],
                  ].map(([t, sub]) => (
                    <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--zm-paper)', borderRadius: 'var(--zm-r-md)' }}>
                      <span style={{ width: 7, height: 7, borderRadius: 4, background: 'var(--zm-coral-500)' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ font: '600 13px var(--zm-font-body)' }}>{t}</div>
                        <div style={{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>{sub}</div>
                      </div>
                      <ZmIcon name="chevron_right" size={14} color="var(--zm-fg-muted)" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Business Recruiters tab (/b/[id]/team/recruiters)
// ────────────────────────────────────────────────
function ZmBusinessRecruiters() {
  return (
    <div className="zm-root" style={{ width: 1440, background: 'var(--zm-paper)', minHeight: 900 }}>
      <ZmHeader context="business" business={{ name: 'Northwind Studio' }} active="dashboard" unread={11} />
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 900 - 64 }}>
        <ZmSidebar items={BIZ_SIDEBAR} active="recruiters"
          header={<div style={{ padding: '4px 12px' }}>
            <div className="zm-eyebrow">Business account</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 10 }}>
              <ZmAvatar name="Northwind Studio" size={36} square />
              <div style={{ minWidth: 0 }}>
                <div style={{ font: '600 14px var(--zm-font-body)' }}>Northwind Studio</div>
                <div style={{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>Owner · Berlin</div>
              </div>
            </div>
          </div>}
        />

        <main style={{ padding: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
            <div>
              <div className="zm-eyebrow">Team · recruiters</div>
              <h1 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 48, lineHeight: 1, letterSpacing: '-0.025em', margin: '8px 0 6px' }}>
                Recruiting team
              </h1>
              <p style={{ font: '400 15px var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: 0 }}>
                Public-facing recruiter profiles attached to Northwind Studio. Each profile gets its own marketplace presence and review thread.
              </p>
            </div>
            <ZmButton variant="dark" icon="plus" size="lg">Add recruiter profile</ZmButton>
          </div>

          {/* Recruiter cards as horizontal rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {ZM_RECRUITERS.map(r => (
              <div key={r.id} style={{
                background: 'var(--zm-white)', border: '1px solid var(--zm-border)',
                borderRadius: 'var(--zm-r-lg)', padding: 22,
                display: 'grid', gridTemplateColumns: '72px 1fr 200px 240px',
                gap: 24, alignItems: 'center',
              }}>
                <ZmAvatar name={r.name} size={56} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ font: '600 16px var(--zm-font-body)' }}>{r.name}</span>
                    <ZmIcon name="badge_check" size={14} color="var(--zm-ink-700)" />
                    <ZmBadge tone="success" dot size="sm">Active</ZmBadge>
                  </div>
                  <div style={{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: 4 }}>{r.title} · {r.location}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                    {r.specialties.map(s => <ZmChip key={s} size="sm" tone="subtle">{s}</ZmChip>)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 24 }}>
                  <div>
                    <div className="zm-eyebrow">Placements</div>
                    <div style={{ font: '600 22px var(--zm-font-display)', letterSpacing: '-0.02em' }} className="zm-num-tab">{r.placements}</div>
                  </div>
                  <div>
                    <div className="zm-eyebrow">Rating</div>
                    <ZmRating value={r.rating} count={r.reviews} size={13} style={{ marginTop: 4 }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <ZmButton size="sm" variant="secondary">View profile</ZmButton>
                  <ZmButton size="sm" variant="ghost">Edit</ZmButton>
                  <ZmIconButton icon="more" size={36} />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

Object.assign(window, { ZmUserDashboard, ZmLeadsInbox, ZmBusinessDashboard, ZmBusinessRecruiters, USER_SIDEBAR, BIZ_SIDEBAR });
