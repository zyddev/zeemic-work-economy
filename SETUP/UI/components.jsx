/* Zeemic — shared UI components
   Buttons, chips, avatars, badges, icons, headers, inputs, cards.
   All use the tokens defined in tokens.css. */

// ZmIcon — minimal Lucide-style line icons inline.
function ZmIcon({ name, size = 18, color = 'currentColor', stroke = 1.6, style }) {
  const P = { stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' };
  const icons = {
    search:    <><circle cx="11" cy="11" r="7" {...P} /><path d="M21 21l-4.3-4.3" {...P} /></>,
    bell:      <><path d="M6 8a6 6 0 1112 0c0 7 3 9 3 9H3s3-2 3-9z" {...P} /><path d="M10 21a2 2 0 004 0" {...P} /></>,
    chevron_down: <path d="M6 9l6 6 6-6" {...P} />,
    chevron_right: <path d="M9 6l6 6-6 6" {...P} />,
    chevron_left:  <path d="M15 6l-6 6 6 6" {...P} />,
    arrow_right: <><path d="M5 12h14" {...P} /><path d="M13 5l7 7-7 7" {...P} /></>,
    arrow_up_right: <><path d="M7 17L17 7" {...P} /><path d="M8 7h9v9" {...P} /></>,
    plus:      <><path d="M12 5v14" {...P} /><path d="M5 12h14" {...P} /></>,
    close:     <><path d="M6 6l12 12" {...P} /><path d="M18 6L6 18" {...P} /></>,
    check:     <path d="M4 12l5 5 11-12" {...P} />,
    star_fill: <path d="M12 2.5l3 6.6 7.3.7-5.5 4.9 1.6 7.1L12 17.9l-6.4 3.9 1.6-7.1L1.7 9.8l7.3-.7z" fill={color} stroke="none" />,
    star:      <path d="M12 2.5l3 6.6 7.3.7-5.5 4.9 1.6 7.1L12 17.9l-6.4 3.9 1.6-7.1L1.7 9.8l7.3-.7z" {...P} />,
    heart:     <path d="M20.8 8.6c0-3-2.4-4.6-4.7-4.6-1.7 0-3.2.9-4.1 2.4-.9-1.5-2.4-2.4-4.1-2.4-2.3 0-4.7 1.6-4.7 4.6 0 5.5 8.8 11 8.8 11s8.8-5.5 8.8-11z" {...P} />,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" {...P} /><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" {...P} /><path d="M3 12h18" {...P} /></>,
    wrench:    <path d="M14.7 6.3a4 4 0 005.5 5.5l-9 9-4.5-1-1-4.5 9-9z" {...P} />,
    users:     <><circle cx="9" cy="8" r="4" {...P} /><path d="M2 21c0-3.5 3-6 7-6s7 2.5 7 6" {...P} /><circle cx="17" cy="7" r="3" {...P} /><path d="M22 19c0-2.5-2-4.5-5-4.5" {...P} /></>,
    user:      <><circle cx="12" cy="8" r="4" {...P} /><path d="M4 21c0-4 4-7 8-7s8 3 8 7" {...P} /></>,
    building:  <><rect x="4" y="3" width="16" height="18" rx="1" {...P} /><path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h2M13 16h2" {...P} /></>,
    grid:      <><rect x="3" y="3" width="7" height="7" {...P} /><rect x="14" y="3" width="7" height="7" {...P} /><rect x="3" y="14" width="7" height="7" {...P} /><rect x="14" y="14" width="7" height="7" {...P} /></>,
    inbox:     <><path d="M3 13l3-8h12l3 8" {...P} /><path d="M3 13h6l1 3h4l1-3h6v7H3z" {...P} /></>,
    message:   <path d="M21 12c0 4.4-4 8-9 8-1.5 0-3-.3-4.3-.9L3 21l1.2-4.4C3.4 15.2 3 13.6 3 12c0-4.4 4-8 9-8s9 3.6 9 8z" {...P} />,
    file_text: <><path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z" {...P} /><path d="M14 3v6h6M8 13h8M8 17h6M8 9h2" {...P} /></>,
    download:  <><path d="M12 3v13" {...P} /><path d="M7 12l5 5 5-5" {...P} /><path d="M5 21h14" {...P} /></>,
    calendar:  <><rect x="3" y="5" width="18" height="16" rx="2" {...P} /><path d="M3 10h18M8 3v4M16 3v4" {...P} /></>,
    map_pin:   <><path d="M12 21s-7-6-7-12a7 7 0 1114 0c0 6-7 12-7 12z" {...P} /><circle cx="12" cy="9" r="2.5" {...P} /></>,
    globe:     <><circle cx="12" cy="12" r="9" {...P} /><path d="M3 12h18M12 3a13 13 0 010 18M12 3a13 13 0 000 18" {...P} /></>,
    filter:    <path d="M3 5h18l-7 9v6l-4-2v-4z" {...P} />,
    sort:      <><path d="M3 6h18M6 12h12M10 18h4" {...P} /></>,
    menu:      <><path d="M3 6h18M3 12h18M3 18h18" {...P} /></>,
    settings:  <><circle cx="12" cy="12" r="3" {...P} /><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" {...P} /></>,
    bookmark:  <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l7-4z" {...P} />,
    sparkles:  <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" {...P} /></>,
    trending:  <><path d="M3 17l6-6 4 4 8-9" {...P} /><path d="M14 6h7v7" {...P} /></>,
    chart_bar: <><path d="M3 21h18" {...P} /><rect x="6" y="10" width="3" height="8" {...P} /><rect x="11" y="6" width="3" height="12" {...P} /><rect x="16" y="13" width="3" height="5" {...P} /></>,
    eye:       <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" {...P} /><circle cx="12" cy="12" r="3" {...P} /></>,
    dot:       <circle cx="12" cy="12" r="3" fill={color} stroke="none" />,
    paperclip: <path d="M21 12l-9 9a5 5 0 01-7-7l9-9a3.5 3.5 0 015 5l-9 9a2 2 0 01-3-3l8-8" {...P} />,
    send:      <><path d="M22 2L11 13" {...P} /><path d="M22 2l-7 20-4-9-9-4z" {...P} /></>,
    more:      <><circle cx="5" cy="12" r="1.5" fill={color} stroke="none" /><circle cx="12" cy="12" r="1.5" fill={color} stroke="none" /><circle cx="19" cy="12" r="1.5" fill={color} stroke="none" /></>,
    badge_check: <><path d="M12 2l2.4 2 3.1-.4.6 3 2.6 1.7-1.2 2.9 1.2 2.9-2.6 1.7-.6 3-3.1-.4L12 22l-2.4-2-3.1.4-.6-3L3.3 15.7l1.2-2.9L3.3 9.9l2.6-1.7.6-3 3.1.4z" {...P} /><path d="M8.5 12.5l2.5 2.5 4.5-5" {...P} /></>,
    layers:    <><path d="M12 2L2 7l10 5 10-5z" {...P} /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" {...P} /></>,
    play:      <path d="M5 3l14 9-14 9z" fill={color} stroke="none" />,
    external:  <><path d="M15 3h6v6M21 3l-9 9M10 5H5a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5" {...P} /></>,
    target:    <><circle cx="12" cy="12" r="9" {...P} /><circle cx="12" cy="12" r="5" {...P} /><circle cx="12" cy="12" r="1.5" fill={color} stroke="none" /></>,
    bolt:      <path d="M13 2L3 14h8l-2 8 10-12h-8z" {...P} />,
    image:     <><rect x="3" y="4" width="18" height="16" rx="2" {...P} /><circle cx="9" cy="10" r="2" {...P} /><path d="M21 16l-5-5-9 9" {...P} /></>,
    upload:    <><path d="M12 16V4" {...P} /><path d="M7 9l5-5 5 5" {...P} /><path d="M5 21h14" {...P} /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0, ...style }}>
      {icons[name] || icons.dot}
    </svg>
  );
}

// Avatars — colored circle with initials
const AVATAR_PALETTE = [
  ['#1A4D3A', '#ECF3EF'], ['#C9A634', '#FDF6DF'], ['#C73E1D', '#FBE0D5'],
  ['#1E4B68', '#D9E8F3'], ['#5F5F58', '#ECECE3'], ['#7A4E2D', '#F1E4D4'],
  ['#3D5A3D', '#E0EAE0'], ['#6B3A6B', '#EFE0EE'],
];
function avatarColors(name = '') {
  let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return AVATAR_PALETTE[Math.abs(h) % AVATAR_PALETTE.length];
}
function initials(name = '') {
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0] || '') + (p[p.length - 1]?.[0] || '')).toUpperCase();
}
function ZmAvatar({ name = '', size = 36, src, square = false, ring = false, style }) {
  const [fg, bg] = avatarColors(name);
  return (
    <div style={{
      width: size, height: size, flexShrink: 0,
      borderRadius: square ? Math.max(4, size * 0.18) : '50%',
      background: src ? `center/cover url(${src})` : bg,
      color: fg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--zm-font-body)', fontWeight: 600,
      fontSize: Math.round(size * 0.4), letterSpacing: '-0.01em',
      boxShadow: ring ? '0 0 0 2px var(--zm-paper), 0 0 0 4px var(--zm-ink-700)' : 'none',
      backgroundImage: src ? `url(${src})` : undefined, ...style,
    }}>{!src && initials(name)}</div>
  );
}
function ZmAvatarStack({ people = [], size = 28, max = 4, style }) {
  const shown = people.slice(0, max);
  const more = people.length - shown.length;
  return (
    <div style={{ display: 'inline-flex', ...style }}>
      {shown.map((p, i) => (
        <div key={i} style={{ marginLeft: i === 0 ? 0 : -size * 0.34, border: '2px solid var(--zm-paper)', borderRadius: '50%' }}>
          <ZmAvatar name={p.name || p} size={size} src={p.src} />
        </div>
      ))}
      {more > 0 && (
        <div style={{
          marginLeft: -size * 0.34, width: size, height: size, borderRadius: '50%',
          border: '2px solid var(--zm-paper)', background: 'var(--zm-ink-100)', color: 'var(--zm-ink-700)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: Math.round(size * 0.34), fontWeight: 600,
        }}>+{more}</div>
      )}
    </div>
  );
}

// Button — primary / secondary / ghost / quiet
function ZmButton({ variant = 'primary', size = 'md', children, icon, iconRight, full, onClick, style, disabled }) {
  const sizes = {
    sm: { padX: 12, padY: 6,  font: 13, h: 32, gap: 6,  icon: 14 },
    md: { padX: 16, padY: 9,  font: 14, h: 40, gap: 8,  icon: 16 },
    lg: { padX: 20, padY: 12, font: 15, h: 48, gap: 10, icon: 18 },
  }[size];
  const variants = {
    primary: { bg: 'var(--zm-ink-700)', fg: 'var(--zm-paper)', bd: 'var(--zm-ink-700)', hover: 'var(--zm-ink-800)' },
    accent:  { bg: 'var(--zm-gold-500)', fg: 'var(--zm-ink-950)', bd: 'var(--zm-gold-500)', hover: 'var(--zm-gold-700)' },
    secondary: { bg: 'transparent', fg: 'var(--zm-ink-900)', bd: 'var(--zm-border-strong)', hover: 'var(--zm-ink-100)' },
    ghost:   { bg: 'transparent', fg: 'var(--zm-ink-900)', bd: 'transparent', hover: 'var(--zm-ink-100)' },
    dark:    { bg: 'var(--zm-ink-950)', fg: 'var(--zm-paper)', bd: 'var(--zm-ink-950)', hover: 'var(--zm-ink-800)' },
    danger:  { bg: 'var(--zm-coral-500)', fg: 'var(--zm-paper)', bd: 'var(--zm-coral-500)', hover: 'var(--zm-coral-600)' },
    onDark:  { bg: 'rgba(245,241,232,0.12)', fg: 'var(--zm-paper)', bd: 'rgba(245,241,232,0.22)', hover: 'rgba(245,241,232,0.22)' },
  }[variant];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      appearance: 'none', border: `1px solid ${variants.bd}`,
      background: variants.bg, color: variants.fg,
      font: `${variant === 'accent' || variant === 'primary' || variant === 'dark' || variant === 'danger' ? 600 : 500} ${sizes.font}px/1 var(--zm-font-body)`,
      letterSpacing: '-0.005em',
      padding: `${sizes.padY}px ${sizes.padX}px`, height: sizes.h,
      borderRadius: 'var(--zm-r-md)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: sizes.gap,
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
      width: full ? '100%' : 'auto',
      whiteSpace: 'nowrap', ...style,
    }}>
      {icon && <ZmIcon name={icon} size={sizes.icon} />}
      {children}
      {iconRight && <ZmIcon name={iconRight} size={sizes.icon} />}
    </button>
  );
}

function ZmIconButton({ icon, size = 36, variant = 'ghost', badge, onClick, style }) {
  const variants = {
    ghost: { bg: 'transparent', fg: 'var(--zm-ink-900)', bd: 'transparent' },
    surface:{ bg: 'var(--zm-white)', fg: 'var(--zm-ink-900)', bd: 'var(--zm-border)' },
    onDark:{ bg: 'rgba(245,241,232,0.06)', fg: 'var(--zm-paper)', bd: 'rgba(245,241,232,0.14)' },
  }[variant];
  return (
    <button onClick={onClick} style={{
      appearance: 'none', border: `1px solid ${variants.bd}`,
      background: variants.bg, color: variants.fg,
      width: size, height: size, borderRadius: 'var(--zm-r-md)',
      position: 'relative', cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style,
    }}>
      <ZmIcon name={icon} size={Math.round(size * 0.5)} />
      {badge != null && badge !== 0 && (
        <span style={{
          position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, padding: '0 5px',
          borderRadius: 9, background: 'var(--zm-coral-500)', color: 'white',
          fontSize: 10, fontWeight: 700, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid var(--zm-paper)',
        }}>{badge > 99 ? '99+' : badge}</span>
      )}
    </button>
  );
}

function ZmChip({ children, icon, iconRight, active, removable, size = 'md', tone, onClick, style }) {
  const sizes = { sm: { h: 26, px: 10, font: 12, gap: 5 }, md: { h: 32, px: 12, font: 13, gap: 6 }, lg: { h: 38, px: 16, font: 14, gap: 7 } }[size];
  let bg = 'var(--zm-white)', fg = 'var(--zm-ink-900)', bd = 'var(--zm-border)';
  if (active) { bg = 'var(--zm-ink-900)'; fg = 'var(--zm-paper)'; bd = 'var(--zm-ink-900)'; }
  if (tone === 'subtle') { bg = 'var(--zm-ink-50)'; fg = 'var(--zm-ink-700)'; bd = 'transparent'; }
  if (tone === 'gold') { bg = 'var(--zm-gold-200)'; fg = 'var(--zm-grey-900)'; bd = 'transparent'; }
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: sizes.gap,
      height: sizes.h, padding: `0 ${sizes.px}px`,
      border: `1px solid ${bd}`, background: bg, color: fg,
      borderRadius: 'var(--zm-r-full)',
      font: `500 ${sizes.font}px/1 var(--zm-font-body)`,
      cursor: onClick ? 'pointer' : 'default', whiteSpace: 'nowrap', ...style,
    }}>
      {icon && <ZmIcon name={icon} size={sizes.font + 2} />}
      {children}
      {iconRight && <ZmIcon name={iconRight} size={sizes.font + 2} />}
      {removable && <ZmIcon name="close" size={sizes.font} style={{ marginLeft: 2 }} />}
    </button>
  );
}

function ZmBadge({ children, tone = 'neutral', size = 'md', dot, style }) {
  const tones = {
    neutral: { bg: 'var(--zm-ink-50)', fg: 'var(--zm-ink-800)' },
    emerald: { bg: 'var(--zm-ink-100)', fg: 'var(--zm-ink-700)' },
    gold:    { bg: 'var(--zm-gold-200)', fg: 'var(--zm-grey-900)' },
    coral:   { bg: 'var(--zm-coral-100)', fg: 'var(--zm-coral-600)' },
    sky:     { bg: 'var(--zm-sky-100)',  fg: 'var(--zm-sky-700)' },
    success: { bg: 'var(--zm-success-bg)', fg: 'var(--zm-success)' },
    warning: { bg: 'var(--zm-warning-bg)', fg: 'var(--zm-warning)' },
    danger:  { bg: 'var(--zm-danger-bg)',  fg: 'var(--zm-danger)' },
    onDark:  { bg: 'rgba(245,241,232,0.12)', fg: 'var(--zm-paper)' },
  }[tone];
  const sz = { sm: { px: 6, h: 18, font: 10.5 }, md: { px: 8, h: 22, font: 11.5 }, lg: { px: 10, h: 26, font: 12.5 } }[size];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: `0 ${sz.px}px`, height: sz.h, borderRadius: 'var(--zm-r-sm)',
      background: tones.bg, color: tones.fg,
      font: `600 ${sz.font}px/1 var(--zm-font-body)`,
      letterSpacing: '0.01em', ...style,
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: 3, background: tones.fg, opacity: 0.8 }} />}
      {children}
    </span>
  );
}

function ZmRating({ value = 4.5, count, size = 13, color = 'var(--zm-ink-950)', style }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color, fontSize: size, fontWeight: 600, ...style }}>
      <ZmIcon name="star_fill" size={size + 1} color="var(--zm-gold-500)" />
      <span className="zm-num-tab">{value.toFixed(1)}</span>
      {count != null && <span style={{ color: 'var(--zm-fg-muted)', fontWeight: 400 }}>({count})</span>}
    </span>
  );
}

function ZmCard({ children, padding = 20, hoverable, style }) {
  return (
    <div style={{
      background: 'var(--zm-white)',
      border: '1px solid var(--zm-border)',
      borderRadius: 'var(--zm-r-lg)',
      padding, ...style,
    }}>{children}</div>
  );
}

function ZmSearch({ placeholder = 'Search…', value, size = 'md', icon = 'search', actionLabel, style }) {
  const sz = { sm: { h: 36, font: 13, pad: 10 }, md: { h: 44, font: 14, pad: 14 }, lg: { h: 56, font: 16, pad: 18 } }[size];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      height: sz.h, padding: `0 ${sz.pad}px`,
      background: 'var(--zm-white)', border: '1px solid var(--zm-border)',
      borderRadius: 'var(--zm-r-md)', boxShadow: 'var(--zm-shadow-xs)', ...style,
    }}>
      <ZmIcon name={icon} size={sz.font + 4} color="var(--zm-fg-muted)" />
      <input defaultValue={value || ''} placeholder={placeholder} style={{
        flex: 1, border: 'none', outline: 'none', background: 'transparent',
        font: `400 ${sz.font}px var(--zm-font-body)`, color: 'var(--zm-fg)',
      }} />
      {actionLabel && (
        <button style={{
          border: 'none', background: 'var(--zm-ink-900)', color: 'var(--zm-paper)',
          height: sz.h - 12, padding: '0 14px', borderRadius: 'var(--zm-r-sm)',
          font: `600 ${sz.font - 1}px var(--zm-font-body)`, cursor: 'pointer',
        }}>{actionLabel}</button>
      )}
    </div>
  );
}

function ZmHeader({ context = 'user', business, user = { name: 'Enoch Boison', handle: '@enochboison' }, active = 'exchange', unread = 3, compact = false, style }) {
  const tabs = [
    { id: 'exchange', label: 'Exchange' },
    { id: 'dashboard', label: context === 'business' ? (business?.name || 'Business') : 'Dashboard' },
    { id: 'messages', label: 'Messages' },
    { id: 'intelligence', label: 'Intelligence' },
  ];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px', height: 64,
      background: 'var(--zm-paper)', borderBottom: '1px solid var(--zm-border)', ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <ZmWordmark height={26} />
        {context === 'business' && business && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px', borderRadius: 'var(--zm-r-sm)', background: 'var(--zm-ink-100)' }}>
            <ZmAvatar name={business.name} size={20} square />
            <span style={{ font: '500 12px var(--zm-font-body)', color: 'var(--zm-ink-700)' }}>{business.name}</span>
            <span style={{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>· Business</span>
          </div>
        )}
        {!compact && (
          <nav style={{ display: 'flex', gap: 4 }}>
            {tabs.map(t => (
              <a key={t.id} style={{
                padding: '8px 12px', borderRadius: 'var(--zm-r-sm)',
                font: `${active === t.id ? 600 : 500} 14px var(--zm-font-body)`,
                color: active === t.id ? 'var(--zm-ink-950)' : 'var(--zm-fg-muted)',
                textDecoration: 'none', cursor: 'pointer', position: 'relative',
              }}>
                {t.label}
                {active === t.id && (
                  <span style={{ position: 'absolute', bottom: -22, left: 12, right: 12, height: 2, background: 'var(--zm-ink-950)', borderRadius: 1 }} />
                )}
              </a>
            ))}
          </nav>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <ZmIconButton icon="search" size={36} />
        <ZmIconButton icon="bell" size={36} badge={unread} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px 4px 4px', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-full)', background: 'var(--zm-white)', cursor: 'pointer' }}>
          <ZmAvatar name={user.name} size={28} />
          {user.name && <span style={{ font: '500 13px var(--zm-font-body)' }}>{user.name.split(' ')[0]}</span>}
          <ZmIcon name="chevron_down" size={14} color="var(--zm-fg-muted)" />
        </div>
      </div>
    </div>
  );
}

function ZmSidebar({ items = [], active, footer, header, width = 240, style }) {
  return (
    <aside style={{
      width, flexShrink: 0,
      background: 'var(--zm-paper)',
      borderRight: '1px solid var(--zm-border)',
      padding: '24px 16px', display: 'flex', flexDirection: 'column',
      gap: 4, ...style,
    }}>
      {header}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: header ? 16 : 0 }}>
        {items.map((it, i) => {
          if (it.section) return <div key={i} className="zm-eyebrow" style={{ padding: '14px 12px 6px', fontSize: 10 }}>{it.section}</div>;
          const isActive = active === it.id;
          return (
            <a key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between',
              padding: '8px 12px', borderRadius: 'var(--zm-r-sm)', cursor: 'pointer',
              background: isActive ? 'var(--zm-ink-900)' : 'transparent',
              color: isActive ? 'var(--zm-paper)' : 'var(--zm-ink-900)',
              font: `${isActive ? 600 : 500} 14px var(--zm-font-body)`,
              textDecoration: 'none', marginLeft: it.indent ? 16 : 0,
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                {it.icon && <ZmIcon name={it.icon} size={16} color={isActive ? 'var(--zm-paper)' : 'var(--zm-fg-muted)'} />}
                {it.label}
              </span>
              {it.count != null && (
                <span style={{
                  font: '600 11px var(--zm-font-body)',
                  background: isActive ? 'rgba(245,241,232,0.18)' : 'var(--zm-ink-100)',
                  color: isActive ? 'var(--zm-paper)' : 'var(--zm-ink-700)',
                  padding: '1px 7px', borderRadius: 'var(--zm-r-full)',
                }}>{it.count}</span>
              )}
            </a>
          );
        })}
      </div>
      <div style={{ flex: 1 }} />
      {footer}
    </aside>
  );
}

const CATEGORY_VISUALS = {
  Design:      { bg: '#1A4D3A', fg: '#F5F1E8', accent: '#F2C94C' },
  Development: { bg: '#11211A', fg: '#F5F1E8', accent: '#F2C94C' },
  Marketing:   { bg: '#E84A1F', fg: '#F5F1E8', accent: '#FDF6DF' },
  Legal:       { bg: '#1E4B68', fg: '#F5F1E8', accent: '#F2C94C' },
  Finance:     { bg: '#2B7A4B', fg: '#F5F1E8', accent: '#F2C94C' },
  Consulting:  { bg: '#7A4E2D', fg: '#F5F1E8', accent: '#F2C94C' },
  Engineering: { bg: '#163524', fg: '#F5F1E8', accent: '#F2C94C' },
  Data:        { bg: '#2E2E2A', fg: '#F2C94C', accent: '#F5F1E8' },
  HR:          { bg: '#6B3A6B', fg: '#F5F1E8', accent: '#F2C94C' },
  Writing:     { bg: '#EDE7D8', fg: '#11211A', accent: '#1A4D3A' },
  Education:   { bg: '#F2C94C', fg: '#11211A', accent: '#1A4D3A' },
  Other:       { bg: '#5F5F58', fg: '#F5F1E8', accent: '#F2C94C' },
};
function ZmSkillThumb({ category = 'Design', title, motif = 0, height = 140, style }) {
  const v = CATEGORY_VISUALS[category] || CATEGORY_VISUALS.Design;
  return (
    <div style={{ position: 'relative', height, overflow: 'hidden', background: v.bg, color: v.fg, ...style }}>
      <svg width="100%" height="100%" viewBox="0 0 300 140" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
        {motif % 4 === 0 && (<><circle cx="240" cy="40" r="50" fill={v.accent} opacity="0.85" /><circle cx="240" cy="40" r="30" fill={v.bg} /><circle cx="240" cy="40" r="12" fill={v.accent} /></>)}
        {motif % 4 === 1 && (<><path d="M-20 110 Q80 40 200 90 T340 70 L340 160 L-20 160 Z" fill={v.accent} opacity="0.9" /><path d="M-20 130 Q100 70 220 110 T340 100 L340 160 L-20 160 Z" fill={v.fg} opacity="0.2" /></>)}
        {motif % 4 === 2 && (<><rect x="180" y="-20" width="180" height="180" fill={v.accent} transform="rotate(18 270 70)" opacity="0.85" /><rect x="200" y="0" width="140" height="140" fill={v.bg} transform="rotate(18 270 70)" /><rect x="220" y="20" width="100" height="100" fill={v.accent} transform="rotate(18 270 70)" opacity="0.55" /></>)}
        {motif % 4 === 3 && (<><g stroke={v.accent} strokeWidth="2" fill="none" opacity="0.7">{[0,1,2,3,4,5,6,7].map(i => <line key={i} x1={20+i*36} y1="0" x2={i*36} y2="140" />)}</g><circle cx="80" cy="80" r="40" fill={v.accent} /><circle cx="80" cy="80" r="22" fill={v.bg} /></>)}
      </svg>
      <div style={{ position: 'absolute', top: 12, left: 14, font: '500 11px var(--zm-font-body)', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.85 }}>{category}</div>
      {title && (
        <div style={{ position: 'absolute', left: 14, right: 14, bottom: 12, fontFamily: 'var(--zm-font-display)', fontSize: 22, lineHeight: 1.05, letterSpacing: '-0.02em', textWrap: 'pretty' }}>{title}</div>
      )}
    </div>
  );
}

function ZmStat({ label, value, delta, deltaTone = 'success', icon, style }) {
  return (
    <div style={{
      background: 'var(--zm-white)', border: '1px solid var(--zm-border)',
      borderRadius: 'var(--zm-r-lg)', padding: 20,
      display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0, ...style,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ font: '500 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
        {icon && <ZmIcon name={icon} size={16} color="var(--zm-fg-subtle)" />}
      </div>
      <div style={{ fontFamily: 'var(--zm-font-display)', fontSize: 36, lineHeight: 1, letterSpacing: '-0.02em', marginTop: 4 }} className="zm-num-tab">{value}</div>
      {delta && (
        <div style={{ font: '500 12px var(--zm-font-body)', color: deltaTone === 'success' ? 'var(--zm-success)' : deltaTone === 'danger' ? 'var(--zm-danger)' : deltaTone === 'warning' ? 'var(--zm-warning)' : 'var(--zm-fg-muted)' }}>{delta}</div>
      )}
    </div>
  );
}

function ZmDivider({ label, style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--zm-border-strong)', ...style }}>
      <div style={{ flex: 1, height: 1, background: 'currentColor' }} />
      {label && <span className="zm-eyebrow" style={{ color: 'var(--zm-fg-muted)' }}>{label}</span>}
      {label && <div style={{ flex: 1, height: 1, background: 'currentColor' }} />}
    </div>
  );
}

// ── ZmFooter — main marketing footer (dark canvas) ────────
function ZmFooter({ style }) {
  return (
    <footer style={{ background: 'var(--zm-ink-950)', color: 'var(--zm-fg-on-dark)', padding: '80px 80px 48px', ...style }}>
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
  );
}

Object.assign(window, {
  ZmIcon, ZmAvatar, ZmAvatarStack,
  ZmButton, ZmIconButton, ZmChip, ZmBadge, ZmRating,
  ZmCard, ZmSearch, ZmHeader, ZmSidebar,
  ZmSkillThumb, ZmStat, ZmDivider, ZmFooter,
  CATEGORY_VISUALS,
});
