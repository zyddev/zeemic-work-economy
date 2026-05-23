/* Zeemic — brand identity components
   Logo wordmark, mark (icon-only), brand presentation cards.
   All marks are pure SVG so they scale + recolor via currentColor. */

// ────────────────────────────────────────────────
// Logo Mark — the "Z" chevron.
// Three strokes: top bar, forward chevron (the diagonal), bottom bar.
// The chevron points right — encoding exchange / forward motion.
// ────────────────────────────────────────────────
function ZmMark({ size = 32, color, accent, background = 'transparent', radius = 0, style }) {
  // Square mark. Geometry tuned at 100×100 viewBox.
  const c = color || 'currentColor';
  const a = accent || 'var(--zm-gold-500)';
  return (
    <div style={{
      width: size, height: size, borderRadius: radius,
      background, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, ...style,
    }}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* top bar */}
        <rect x="14" y="16" width="72" height="14" rx="3" fill={c} />
        {/* bottom bar */}
        <rect x="14" y="70" width="72" height="14" rx="3" fill={c} />
        {/* chevron — diagonal of Z, points right (forward exchange) */}
        <path d="M22 64 L60 36 L52 30 L14 58 L22 64 Z" fill={c} />
        <path d="M60 36 L62 50 L76 50 L74 30 L60 36 Z" fill={a} />
        <path d="M60 36 L66 32 L86 46 L82 50 L62 50 L60 36 Z" fill={c} opacity="0.0" />
      </svg>
    </div>
  );
}

// Cleaner / more refined geometric Z mark — used as the primary mark.
// ONE connected polygon path — top bar, diagonal stroke, bottom bar all share edges.
function ZmMarkPrimary({ size = 40, color = 'var(--zm-ink-700)', accent = 'var(--zm-gold-500)', background, radius, style }) {
  const wrap = {
    width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, ...(background ? { background, borderRadius: radius ?? size * 0.22 } : {}), ...style,
  };
  // Z outline traced clockwise from top-left.
  // Top bar: y=12 to y=22, full width 10→54
  // Diagonal: parallelogram connecting (54,22)→(24,42) on top edge and (10,42)→(40,22) on bottom edge
  // Bottom bar: y=42 to y=52, full width 10→54
  const z = "M10 12 H54 V22 L24 42 H54 V52 H10 V42 L40 22 H10 Z";
  return (
    <div style={wrap}>
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d={z} fill={color} />
        {/* Gold accent — top-right tip of the top bar (marketplace pop) */}
        <path d="M44 12 H54 V22 H50 Z" fill={accent} />
        {/* Gold accent — bottom-left tip of the bottom bar */}
        <path d="M10 42 H20 L10 52 Z" fill={accent} />
      </svg>
    </div>
  );
}

// Full wordmark — "zeemic" set in Instrument Serif, with the Z replaced
// by the geometric mark so it reads as a single integrated lockup.
function ZmWordmark({ height = 36, color = 'var(--zm-ink-950)', accent = 'var(--zm-gold-500)', style }) {
  const markSize = Math.round(height * 1.0);
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: Math.round(height * 0.12), ...style }}>
      <ZmMarkPrimary size={markSize} color={color} accent={accent} />
      <span style={{
        fontFamily: 'var(--zm-font-body)',
        fontWeight: 600,
        fontSize: Math.round(height * 0.62),
        letterSpacing: '-0.025em',
        color, lineHeight: 1, marginLeft: -2,
      }}>eemic</span>
    </div>
  );
}

// Wordmark variant using the display serif italic — for editorial / hero use
function ZmWordmarkEditorial({ height = 56, color = 'var(--zm-ink-950)', accent = 'var(--zm-gold-500)', style }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2, fontFamily: 'var(--zm-font-display)', color, lineHeight: 0.9, ...style }}>
      <span style={{ fontSize: height, letterSpacing: '-0.03em', fontStyle: 'italic' }}>z</span>
      <span style={{ fontSize: height, letterSpacing: '-0.03em' }}>eemic</span>
      <span style={{ display: 'inline-block', width: height * 0.14, height: height * 0.14, borderRadius: '50%', background: accent, marginLeft: 4, transform: `translateY(-${height * 0.05}px)` }} />
    </div>
  );
}

// Favicon-sized mark on a tile background
function ZmFavicon({ size = 48, theme = 'dark' }) {
  const dark = theme === 'dark';
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.22,
      background: dark ? 'var(--zm-ink-900)' : 'var(--zm-paper)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: 'var(--zm-shadow-sm)',
    }}>
      <ZmMarkPrimary size={size * 0.66} color={dark ? 'var(--zm-paper)' : 'var(--zm-ink-950)'} accent="var(--zm-gold-500)" />
    </div>
  );
}

Object.assign(window, { ZmMark, ZmMarkPrimary, ZmWordmark, ZmWordmarkEditorial, ZmFavicon });
