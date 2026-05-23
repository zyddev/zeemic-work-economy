/* Zeemic — listing cards (SkillCard, RecruiterCard, JobCard, BusinessCard).
   Used in the Exchange hub preview rows AND in standalone listing pages. */

// ────────────────────────────────────────────────
// SkillCard
// ────────────────────────────────────────────────
function ZmSkillCard({ skill, layout = 'full', style }) {
  const priceText = skill.price == null
    ? <><span style={{ fontFamily: 'var(--zm-font-display)', fontSize: 22 }}>RFQ</span><span style={{ color: 'var(--zm-fg-muted)', fontSize: 12, marginLeft: 4 }}>· custom</span></>
    : <><span className="zm-num-tab" style={{ fontFamily: 'var(--zm-font-display)', fontSize: 26, letterSpacing: '-0.02em' }}>${skill.price.toLocaleString()}</span><span style={{ color: 'var(--zm-fg-muted)', fontSize: 12 }}>{skill.unit}</span></>;
  return (
    <div style={{
      background: 'var(--zm-white)', border: '1px solid var(--zm-border)',
      borderRadius: 'var(--zm-r-lg)', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      boxShadow: 'var(--zm-shadow-xs)',
      transition: 'box-shadow var(--zm-d-base) var(--zm-ease), transform var(--zm-d-base) var(--zm-ease)',
      ...style,
    }}>
      <ZmSkillThumb category={skill.category} title={skill.title} motif={skill.motif} height={140} />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ZmAvatar name={skill.seller} size={24} square={skill.isBusiness} />
          <span style={{ font: '500 13px var(--zm-font-body)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{skill.seller}</span>
          {skill.available === 'Now' && <ZmBadge tone="success" dot size="sm">Available</ZmBadge>}
        </div>
        <p style={{ margin: 0, font: '400 13px/1.45 var(--zm-font-body)', color: 'var(--zm-fg-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {skill.blurb}
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>{priceText}</div>
          <ZmRating value={skill.rating} count={skill.reviews} />
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
          <ZmButton size="sm" full>Book now</ZmButton>
          <ZmButton size="sm" variant="secondary" full>Get quote</ZmButton>
          <ZmIconButton icon="heart" size={32} variant="surface" />
        </div>
      </div>
    </div>
  );
}

// Compact horizontal skill card for "My Skills" management
function ZmSkillManageCard({ skill, views = 12, inquiries = 3, status = 'Active' }) {
  return (
    <div style={{
      background: 'var(--zm-white)', border: '1px solid var(--zm-border)',
      borderRadius: 'var(--zm-r-lg)', overflow: 'hidden',
      display: 'grid', gridTemplateColumns: '120px 1fr', minHeight: 140,
    }}>
      <ZmSkillThumb category={skill.category} motif={skill.motif} height="100%" style={{ height: '100%' }} />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div>
            <div style={{ font: '600 15px var(--zm-font-body)', letterSpacing: '-0.005em' }}>{skill.title}</div>
            <div style={{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: 4 }}>
              {skill.category} · {skill.delivery} · From ${skill.price ?? '—'}{skill.unit}
            </div>
          </div>
          <ZmBadge tone={status === 'Active' ? 'success' : status === 'Paused' ? 'warning' : 'neutral'} dot>{status}</ZmBadge>
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 'auto', alignItems: 'center' }}>
          <span style={{ font: '500 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>
            <ZmIcon name="eye" size={13} color="var(--zm-fg-muted)" style={{ verticalAlign: -2, marginRight: 4 }} /> {views} views
          </span>
          <span style={{ font: '500 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>
            <ZmIcon name="inbox" size={13} color="var(--zm-fg-muted)" style={{ verticalAlign: -2, marginRight: 4 }} /> {inquiries} inquiries
          </span>
          <ZmRating value={skill.rating} count={skill.reviews} size={12} />
          <span style={{ flex: 1 }} />
          <ZmButton size="sm" variant="secondary">Edit</ZmButton>
          <ZmButton size="sm" variant="ghost">View public</ZmButton>
          <ZmIconButton icon="more" size={32} />
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// RecruiterCard
// ────────────────────────────────────────────────
function ZmRecruiterCard({ recruiter, style }) {
  return (
    <div style={{
      background: 'var(--zm-white)', border: '1px solid var(--zm-border)',
      borderRadius: 'var(--zm-r-lg)', padding: 20,
      display: 'flex', flexDirection: 'column', gap: 14,
      boxShadow: 'var(--zm-shadow-xs)', ...style,
    }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <ZmAvatar name={recruiter.name} size={56} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ font: '600 15px var(--zm-font-body)', letterSpacing: '-0.005em' }}>{recruiter.name}</span>
            <ZmIcon name="badge_check" size={14} color="var(--zm-ink-700)" />
          </div>
          <div style={{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>{recruiter.title}</div>
          <div style={{ font: '500 12px var(--zm-font-body)', color: 'var(--zm-ink-700)', marginTop: 4 }}>{recruiter.business}</div>
        </div>
      </div>
      <p style={{ margin: 0, font: 'italic 400 13px/1.5 var(--zm-font-display)', color: 'var(--zm-fg)', fontSize: 16 }}>
        “{recruiter.quote}”
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {recruiter.specialties.map(s => <ZmChip key={s} size="sm" tone="subtle">{s}</ZmChip>)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 12, borderTop: '1px solid var(--zm-border)' }}>
        <span className="zm-eyebrow" style={{ fontSize: 10 }}>
          <span style={{ fontFamily: 'var(--zm-font-display)', fontSize: 20, color: 'var(--zm-ink-950)', fontStyle: 'normal', textTransform: 'none', letterSpacing: '-0.02em' }} className="zm-num-tab">{recruiter.placements}</span>
          <span style={{ marginLeft: 4 }}>placements</span>
        </span>
        <span style={{ width: 1, height: 16, background: 'var(--zm-border)' }} />
        <ZmRating value={recruiter.rating} count={recruiter.reviews} size={12} />
        <span style={{ flex: 1 }} />
        <ZmButton size="sm">Contact</ZmButton>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// JobCard
// ────────────────────────────────────────────────
function ZmJobCard({ job, style }) {
  return (
    <div style={{
      background: 'var(--zm-white)', border: '1px solid var(--zm-border)',
      borderRadius: 'var(--zm-r-lg)', padding: 20,
      display: 'flex', flexDirection: 'column', gap: 14,
      boxShadow: 'var(--zm-shadow-xs)', ...style,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <ZmAvatar name={job.company} size={36} square />
          <div>
            <div style={{ font: '500 13px var(--zm-font-body)' }}>{job.company}</div>
            <div style={{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>{job.type} · {job.location}</div>
          </div>
        </div>
        <ZmIconButton icon="heart" size={32} />
      </div>
      <div>
        <div style={{ fontFamily: 'var(--zm-font-display)', fontSize: 24, lineHeight: 1.05, letterSpacing: '-0.02em', textWrap: 'pretty' }}>{job.title}</div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <ZmBadge tone="emerald">{job.salary}</ZmBadge>
        <ZmBadge>Deadline · {job.deadline}</ZmBadge>
      </div>
      {job.recruiter && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'var(--zm-paper)', borderRadius: 'var(--zm-r-sm)', alignSelf: 'flex-start' }}>
          <ZmAvatar name={job.recruiter} size={20} />
          <span style={{ font: '500 12px var(--zm-font-body)' }}>via {job.recruiter}</span>
          <ZmIcon name="arrow_up_right" size={12} color="var(--zm-fg-muted)" />
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto' }}>
        <span style={{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>Posted {job.posted}</span>
        <span style={{ flex: 1 }} />
        <ZmButton size="sm" variant="dark" iconRight="arrow_right">Apply</ZmButton>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// BusinessCard
// ────────────────────────────────────────────────
function ZmBusinessCard({ biz, style }) {
  // Use a colored tile for the business logo, mirroring the SkillThumb motif palette
  const palette = ['#1A4D3A', '#11211A', '#7A4E2D', '#1E4B68', '#6B3A6B', '#2B7A4B'];
  const idx = (biz.name.charCodeAt(0) + biz.name.length) % palette.length;
  return (
    <div style={{
      background: 'var(--zm-white)', border: '1px solid var(--zm-border)',
      borderRadius: 'var(--zm-r-lg)', overflow: 'hidden',
      boxShadow: 'var(--zm-shadow-xs)', display: 'flex', flexDirection: 'column',
      ...style,
    }}>
      <div style={{ height: 80, background: palette[idx], position: 'relative', overflow: 'hidden' }}>
        <svg width="100%" height="100%" viewBox="0 0 200 80" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
          <circle cx="170" cy="20" r="40" fill="var(--zm-gold-500)" opacity="0.6" />
          <circle cx="170" cy="20" r="22" fill={palette[idx]} />
        </svg>
      </div>
      <div style={{ padding: '0 18px', marginTop: -22, position: 'relative' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 'var(--zm-r-md)',
          background: 'var(--zm-paper)', border: '3px solid var(--zm-white)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--zm-font-display)', fontSize: 28, color: palette[idx],
          letterSpacing: '-0.02em',
        }}>{biz.name[0]}</div>
      </div>
      <div style={{ padding: '8px 18px 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ font: '600 15px var(--zm-font-body)', letterSpacing: '-0.005em' }}>{biz.name}</span>
          <ZmIcon name="badge_check" size={13} color="var(--zm-ink-700)" />
        </div>
        <div style={{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>{biz.tag} · {biz.location}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, font: '500 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>
          <span><ZmIcon name="users" size={13} color="var(--zm-fg-muted)" style={{ verticalAlign: -2 }} /> {biz.members}</span>
          <span><ZmIcon name="grid" size={13} color="var(--zm-fg-muted)" style={{ verticalAlign: -2 }} /> {biz.listings}</span>
          <ZmRating value={biz.rating} size={12} />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ZmSkillCard, ZmSkillManageCard, ZmRecruiterCard, ZmJobCard, ZmBusinessCard });
