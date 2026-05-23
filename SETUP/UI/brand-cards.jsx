/* Zeemic — Brand & Design System presentation cards */

// Brand identity hero card — logo, tagline, mark variants
function ZmBrandCard() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'var(--zm-paper)', display: 'flex', flexDirection: 'column',
      padding: 56, color: 'var(--zm-ink-950)',
      backgroundImage: 'radial-gradient(ellipse at top right, var(--zm-gold-100), transparent 60%)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <ZmWordmark height={36} />
        <span className="zm-eyebrow">Brand identity · v1.0</span>
      </div>

      <div style={{ marginTop: 64, maxWidth: 720 }}>
        <div className="zm-eyebrow" style={{ marginBottom: 16 }}>Work, transacted</div>
        <h1 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 96, lineHeight: 0.95, letterSpacing: '-0.035em', margin: 0 }}>
          The market<br/>for <em style={{ fontStyle: 'italic' }}>everyone</em><br/>who works.
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.5, color: 'var(--zm-fg-muted)', marginTop: 28, maxWidth: 520 }}>
          Zeemic is a transactional marketplace for the work economy — where talent, businesses, and recruiters exchange value with structured commerce. Book skills, request quotes, hire recruiters, place jobs.
        </p>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
          <ZmFavicon size={88} theme="dark" />
          <ZmFavicon size={88} theme="light" />
          <div style={{ width: 88, height: 88, borderRadius: 20, background: 'var(--zm-gold-500)', boxShadow: 'var(--zm-shadow-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ZmMarkPrimary size={56} color="var(--zm-ink-950)" accent="var(--zm-paper)" />
          </div>
          <div style={{ width: 88, height: 88, borderRadius: 20, background: 'var(--zm-ink-700)', boxShadow: 'var(--zm-shadow-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ZmMarkPrimary size={56} color="var(--zm-paper)" accent="var(--zm-gold-500)" />
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="zm-eyebrow">Favicons & app icons</div>
          <div style={{ fontFamily: 'var(--zm-font-display)', fontSize: 28, marginTop: 8, fontStyle: 'italic', color: 'var(--zm-fg-muted)' }}>z.</div>
        </div>
      </div>
    </div>
  );
}

// Logo studies — variations of the mark
function ZmLogoStudiesCard() {
  return (
    <div style={{ width: '100%', height: '100%', padding: 40, background: 'var(--zm-white)', display: 'flex', flexDirection: 'column' }}>
      <div className="zm-eyebrow">Mark studies</div>
      <h2 className="zm-d-xl" style={{ margin: '8px 0 28px' }}>The Z, in three states</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, flex: 1 }}>
        <div style={{ background: 'var(--zm-paper)', borderRadius: 'var(--zm-r-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 24, gap: 12 }}>
          <ZmMarkPrimary size={88} />
          <span className="zm-eyebrow">Light · primary</span>
        </div>
        <div style={{ background: 'var(--zm-ink-900)', borderRadius: 'var(--zm-r-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 24, gap: 12 }}>
          <ZmMarkPrimary size={88} color="var(--zm-paper)" accent="var(--zm-gold-500)" />
          <span className="zm-eyebrow" style={{ color: 'var(--zm-fg-on-dark-muted)' }}>Dark · reversed</span>
        </div>
        <div style={{ background: 'var(--zm-gold-500)', borderRadius: 'var(--zm-r-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 24, gap: 12 }}>
          <ZmMarkPrimary size={88} color="var(--zm-ink-950)" accent="var(--zm-paper)" />
          <span className="zm-eyebrow" style={{ color: 'rgba(17,33,26,0.7)' }}>Bold · accent</span>
        </div>
      </div>

      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: 'var(--zm-paper)', padding: 24, borderRadius: 'var(--zm-r-md)' }}>
          <span className="zm-eyebrow">Wordmark · primary</span>
          <div style={{ marginTop: 16 }}><ZmWordmark height={44} /></div>
        </div>
        <div style={{ background: 'var(--zm-ink-900)', padding: 24, borderRadius: 'var(--zm-r-md)' }}>
          <span className="zm-eyebrow" style={{ color: 'var(--zm-fg-on-dark-muted)' }}>Wordmark · on dark</span>
          <div style={{ marginTop: 16 }}><ZmWordmark height={44} color="var(--zm-paper)" /></div>
        </div>
      </div>
    </div>
  );
}

// Color palette
function ZmColorCard() {
  const groups = [
    { name: 'Ink (primary)', desc: 'Emerald foundation — surfaces, primary actions',
      swatches: [
        { c: '#0B0F0D', l: '950' }, { c: '#11211A', l: '900' }, { c: '#163524', l: '800' },
        { c: '#1A4D3A', l: '700' }, { c: '#2B6A52', l: '600' }, { c: '#468B71', l: '500' },
        { c: '#7DB39C', l: '400' }, { c: '#B5D2C4', l: '300' }, { c: '#ECF3EF', l: '100' },
      ] },
    { name: 'Paper', desc: 'Warm cream surface — primary background',
      swatches: [
        { c: '#F5F1E8', l: 'base' }, { c: '#EDE7D8', l: 'deep' }, { c: '#E3DBC6', l: 'darker' }, { c: '#FFFFFF', l: 'pure' },
      ] },
    { name: 'Gold (accent)', desc: 'Marigold — badges, highlights, accents only',
      swatches: [
        { c: '#FDF6DF', l: '100' }, { c: '#FCEFC4', l: '200' }, { c: '#FBE7A5', l: '300' },
        { c: '#F7D979', l: '400' }, { c: '#F2C94C', l: '500' }, { c: '#C9A634', l: '700' },
      ] },
    { name: 'Coral (signal)', desc: 'Used only for urgency, errors, deletions',
      swatches: [
        { c: '#FBE0D5', l: '100' }, { c: '#EF7B5A', l: '400' }, { c: '#E84A1F', l: '500' }, { c: '#C73E1D', l: '600' },
      ] },
  ];
  return (
    <div style={{ width: '100%', height: '100%', padding: 40, background: 'var(--zm-white)', display: 'flex', flexDirection: 'column' }}>
      <div className="zm-eyebrow">Color system</div>
      <h2 className="zm-d-xl" style={{ margin: '8px 0 24px' }}>Warm, confident, monetary</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: 1 }}>
        {groups.map(g => (
          <div key={g.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <span style={{ font: '600 14px var(--zm-font-body)' }}>{g.name}</span>
              <span style={{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>{g.desc}</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {g.swatches.map((s, i) => (
                <div key={i} style={{ flex: 1, height: 64, borderRadius: 'var(--zm-r-sm)', background: s.c, border: s.c.toLowerCase() === '#ffffff' ? '1px solid var(--zm-border)' : 'none', position: 'relative', overflow: 'hidden' }}>
                  <span style={{ position: 'absolute', bottom: 6, left: 8, font: '500 10.5px var(--zm-font-mono)', color: i >= g.swatches.length - 2 || (g.name === 'Paper' && i < 2) ? 'var(--zm-ink-900)' : 'rgba(255,255,255,0.85)', letterSpacing: '0.05em' }}>{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Type scale
function ZmTypeCard() {
  return (
    <div style={{ width: '100%', height: '100%', padding: 40, background: 'var(--zm-white)', display: 'flex', flexDirection: 'column' }}>
      <div className="zm-eyebrow">Type system</div>
      <h2 className="zm-d-xl" style={{ margin: '8px 0 32px' }}>Instrument Serif × Geist</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28, flex: 1 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <span style={{ font: '600 14px var(--zm-font-body)' }}>Display — Instrument Serif</span>
            <span style={{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>Editorial · hero · marketing</span>
          </div>
          <div className="zm-d-3xl">The market for everyone <em>who works.</em></div>
          <div className="zm-d-lg" style={{ color: 'var(--zm-fg-muted)', marginTop: 10 }}>Featured skills, top recruiters, latest jobs.</div>
        </div>

        <div style={{ height: 1, background: 'var(--zm-border)' }} />

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <span style={{ font: '600 14px var(--zm-font-body)' }}>Body — Geist</span>
            <span style={{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>UI · product · tables</span>
          </div>
          <div className="zm-t-2xl" style={{ fontWeight: 500 }}>Strong, neutral sans for product surfaces.</div>
          <div className="zm-t-lg" style={{ color: 'var(--zm-fg-muted)', marginTop: 8 }}>From dashboards to detail pages — sets a calm, technical baseline that doesn’t fight the serif. Body text reads at 14 px and scales up cleanly.</div>
        </div>

        <div style={{ height: 1, background: 'var(--zm-border)' }} />

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div className="zm-eyebrow">Eyebrow · 11 px</div>
            <div style={{ font: '500 11px var(--zm-font-mono)', color: 'var(--zm-fg-muted)', marginTop: 4, letterSpacing: '0.05em' }}>--zm-font-mono · 11/14</div>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span style={{ fontFamily: 'var(--zm-font-display)', fontSize: 64, fontStyle: 'italic', lineHeight: 1 }}>Aa</span>
            <span style={{ fontFamily: 'var(--zm-font-body)', fontSize: 56, fontWeight: 600, lineHeight: 1 }}>Aa</span>
            <span className="zm-mono" style={{ fontSize: 32, lineHeight: 1 }}>Aa</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component primitives card
function ZmComponentsCard() {
  return (
    <div style={{ width: '100%', height: '100%', padding: 40, background: 'var(--zm-paper)', display: 'flex', flexDirection: 'column' }}>
      <div className="zm-eyebrow">Component primitives</div>
      <h2 className="zm-d-xl" style={{ margin: '8px 0 28px' }}>Buttons, chips, badges</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div>
          <div className="zm-eyebrow" style={{ marginBottom: 10 }}>Buttons</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <ZmButton>Book now</ZmButton>
            <ZmButton variant="accent">Get a quote</ZmButton>
            <ZmButton variant="secondary">Download brochure</ZmButton>
            <ZmButton variant="ghost" icon="heart">Save</ZmButton>
            <ZmButton variant="dark" iconRight="arrow_right">Apply</ZmButton>
            <ZmIconButton icon="bell" badge={3} />
            <ZmIconButton icon="search" />
          </div>
        </div>

        <div>
          <div className="zm-eyebrow" style={{ marginBottom: 10 }}>Sizes</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <ZmButton size="sm">Small</ZmButton>
            <ZmButton size="md">Medium</ZmButton>
            <ZmButton size="lg">Large</ZmButton>
          </div>
        </div>

        <div>
          <div className="zm-eyebrow" style={{ marginBottom: 10 }}>Filter chips</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <ZmChip active>Category: Design</ZmChip>
            <ZmChip iconRight="chevron_down">Delivery</ZmChip>
            <ZmChip iconRight="chevron_down">Price</ZmChip>
            <ZmChip iconRight="chevron_down">Country</ZmChip>
            <ZmChip iconRight="chevron_down">Availability</ZmChip>
            <ZmChip tone="subtle" icon="sort">Sort: Relevance</ZmChip>
          </div>
        </div>

        <div>
          <div className="zm-eyebrow" style={{ marginBottom: 10 }}>Badges</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <ZmBadge tone="success" dot>Available now</ZmBadge>
            <ZmBadge tone="emerald">Verified</ZmBadge>
            <ZmBadge tone="gold">Featured</ZmBadge>
            <ZmBadge tone="sky">New</ZmBadge>
            <ZmBadge tone="warning" dot>Paused</ZmBadge>
            <ZmBadge tone="danger">Closed</ZmBadge>
            <ZmRating value={4.8} count={12} />
          </div>
        </div>

        <div>
          <div className="zm-eyebrow" style={{ marginBottom: 10 }}>Avatars · people</div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <ZmAvatar name="Enoch Boison" size={44} />
            <ZmAvatar name="Adaeze Okoye" size={44} />
            <ZmAvatar name="Markus Faber" size={44} />
            <ZmAvatar name="Jane Smith" size={44} />
            <ZmAvatarStack people={[{name:'Jane S'},{name:'Malik N'},{name:'Priya R'},{name:'Tomi A'},{name:'Sade A'}]} size={36} />
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ZmBrandCard, ZmLogoStudiesCard, ZmColorCard, ZmTypeCard, ZmComponentsCard });
