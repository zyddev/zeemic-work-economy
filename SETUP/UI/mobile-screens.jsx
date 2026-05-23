/* Zeemic — Mobile native screens
   iPhone-sized (390×844) flows for every key surface.
   Native iOS-feel chrome: large nav bars, sticky bottom CTAs, bottom sheets,
   swipe carousels, full-screen pages.

   PhoneShell + MobileSkillCard come from screens-mobile.jsx. */

// ──────────────────────────────────────────────────────────────
// MNavBar — iOS-style top navigation bar with back chevron + title
// ──────────────────────────────────────────────────────────────
function MNavBar({ title, back = true, onBack, leftLabel, right, transparent }) {
  return (
    <div style={{
      flexShrink: 0,
      background: transparent ? 'transparent' : 'rgba(245,241,232,0.94)',
      backdropFilter: transparent ? 'none' : 'saturate(180%) blur(12px)',
      borderBottom: transparent ? 'none' : '0.5px solid var(--zm-border)',
      height: 48, display: 'flex', alignItems: 'center',
      padding: '0 12px', position: 'relative', zIndex: 4,
    }}>
      {back ? (
        <button onClick={onBack} style={{
          border: 'none', background: 'transparent', padding: '8px 8px 8px 4px',
          display: 'inline-flex', alignItems: 'center', gap: 2, cursor: 'pointer',
          color: 'var(--zm-ink-700)', font: '500 17px var(--zm-font-body)',
        }}>
          <ZmIcon name="chevron_left" size={20} stroke={2.2} />
          {leftLabel}
        </button>
      ) : <span style={{ width: 60 }} />}
      <div style={{
        position: 'absolute', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none',
        font: '600 16px var(--zm-font-body)', color: 'var(--zm-ink-950)',
        letterSpacing: '-0.005em',
      }}>{title}</div>
      <div style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        {right}
      </div>
    </div>
  );
}

// MStickyCTA — pinned bottom action zone above the home indicator
function MStickyCTA({ children, style }) {
  return (
    <div style={{
      flexShrink: 0, padding: '12px 16px 32px',
      background: 'rgba(245,241,232,0.96)',
      backdropFilter: 'saturate(180%) blur(12px)',
      borderTop: '0.5px solid var(--zm-border)',
      display: 'flex', gap: 10, ...style,
    }}>{children}</div>
  );
}

// MListRow — iOS-style row with title, subtitle, optional right chevron
function MListRow({ icon, leading, title, subtitle, accessory, badge, danger, last, onClick, style }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 16px', background: 'var(--zm-white)',
      borderBottom: last ? 'none' : '0.5px solid var(--zm-border)',
      cursor: onClick ? 'pointer' : 'default', ...style,
    }}>
      {leading || (icon && (
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: danger ? 'var(--zm-coral-100)' : 'var(--zm-ink-50)',
          color: danger ? 'var(--zm-coral-600)' : 'var(--zm-ink-700)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <ZmIcon name={icon} size={16} />
        </div>
      ))}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: '500 15px var(--zm-font-body)', color: danger ? 'var(--zm-coral-600)' : 'var(--zm-ink-950)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
        {subtitle && <div style={{ font: '400 12.5px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subtitle}</div>}
      </div>
      {badge != null && <ZmBadge tone="coral" size="sm">{badge}</ZmBadge>}
      {accessory !== false && <ZmIcon name="chevron_right" size={14} color="var(--zm-grey-400)" />}
    </div>
  );
}

function MSectionHead({ children, action, style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 20px 8px', ...style }}>
      <span style={{ font: '500 12px var(--zm-font-body)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--zm-fg-muted)' }}>{children}</span>
      {action}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// AUTH FLOW · mobile native
// ══════════════════════════════════════════════════════════════

// MProvider — small SSO row button (native size)
function MSso({ provider, label }) {
  const icon = provider === 'google'
    ? <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.97 10.97 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
    : provider === 'apple'
    ? <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
    : <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.27c-.96 0-1.74-.78-1.74-1.74s.78-1.74 1.74-1.74 1.74.78 1.74 1.74-.78 1.74-1.74 1.74zm13.5 12.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-11h2.88v1.5h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6v6.46z"/></svg>;
  return (
    <button style={{
      width: '100%', height: 52, padding: '0 16px',
      background: 'var(--zm-white)', color: 'var(--zm-ink-950)',
      border: '1px solid var(--zm-border-strong)',
      borderRadius: 'var(--zm-r-md)', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 12,
      font: '600 14.5px var(--zm-font-body)',
    }}>
      {icon}<span style={{ flex: 1, textAlign: 'center' }}>{label}</span><span style={{ width: 20 }} />
    </button>
  );
}

function MDivider({ label }) {
  return (
    <div style={{ position: 'relative', textAlign: 'center', margin: '14px 0', font: '500 11px var(--zm-font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--zm-fg-muted)' }}>
      <span style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, background: 'var(--zm-border)' }} />
      <span style={{ position: 'relative', background: 'var(--zm-paper)', padding: '0 10px' }}>{label}</span>
    </div>
  );
}

function MAuthHeader({ eyebrow, title, sub }) {
  return (
    <div style={{ padding: '8px 20px 16px' }}>
      <div className="zm-eyebrow">{eyebrow}</div>
      <h1 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 32, lineHeight: 1.04, letterSpacing: '-0.025em', margin: '6px 0 6px' }}>{title}</h1>
      {sub && <p style={{ font: '400 13.5px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: 0 }}>{sub}</p>}
    </div>
  );
}

// ── Sign in (Password / OTC toggle) ───────────────────────────
function MSignin({ method = 'password' }) {
  return (
    <PhoneShell hideNav>
      <MNavBar back={false} title="Sign in" right={<button style={{ border: 'none', background: 'transparent', padding: '8px 10px', font: '500 15px var(--zm-font-body)', color: 'var(--zm-ink-700)', cursor: 'pointer' }}>Help</button>} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        <div style={{ padding: '16px 20px 8px', display: 'flex', justifyContent: 'center' }}>
          <ZmWordmark height={28} />
        </div>
        <MAuthHeader eyebrow="" title={<>Welcome <em style={{ fontStyle: 'italic' }}>back.</em></>} sub="Choose how you'd like to sign in." />

        <div style={{ padding: '0 20px' }}>
          {/* Method switch */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            padding: 4, background: 'var(--zm-ink-50)',
            borderRadius: 'var(--zm-r-md)', border: '1px solid var(--zm-ink-100)',
            marginBottom: 18,
          }}>
            {[
              { id: 'password', label: 'Password', icon: 'bolt' },
              { id: 'otc', label: 'One-time code', icon: 'message' },
            ].map(opt => {
              const active = method === opt.id;
              return (
                <div key={opt.id} style={{
                  height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  background: active ? 'var(--zm-white)' : 'transparent',
                  color: active ? 'var(--zm-ink-950)' : 'var(--zm-fg-muted)',
                  borderRadius: 'var(--zm-r-sm)',
                  font: `${active ? 600 : 500} 13px var(--zm-font-body)`,
                  boxShadow: active ? 'var(--zm-shadow-xs)' : 'none',
                }}>
                  <ZmIcon name={opt.icon} size={14} color={active ? 'var(--zm-ink-700)' : 'var(--zm-fg-muted)'} />
                  {opt.label}
                </div>
              );
            })}
          </div>

          <ZmField label="Email" required>
            <ZmInput type="email" full placeholder="you@example.com" leadingIcon="message" size="lg" />
          </ZmField>

          {method === 'password' && (
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ font: '500 13px var(--zm-font-body)' }}>Password</label>
                <a style={{ font: '500 12px var(--zm-font-body)', color: 'var(--zm-ink-700)' }}>Forgot?</a>
              </div>
              <ZmInput type="password" full placeholder="Enter your password" trailingIcon="eye" size="lg" />
            </div>
          )}

          {method === 'otc' && (
            <div style={{ marginTop: 8, font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>
              No password needed. We'll send a 6-digit code.
            </div>
          )}

          <div style={{ marginTop: 22 }}>
            <ZmButton variant="primary" size="lg" full iconRight="arrow_right">
              {method === 'password' ? 'Sign in' : 'Email me a code'}
            </ZmButton>
          </div>

          <MDivider label="or continue with" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <MSso provider="google" label="Continue with Google" />
            <MSso provider="apple" label="Continue with Apple" />
            <MSso provider="linkedin" label="Continue with LinkedIn" />
          </div>

          <div style={{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textAlign: 'center', marginTop: 22, marginBottom: 32 }}>
            New here? <a style={{ color: 'var(--zm-ink-700)', fontWeight: 600 }}>Create an account</a>
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}

// ── OTC verify ────────────────────────────────────────────────
function MOtc() {
  const code = ['4', '8', '2', '1', '', ''];
  const focusIdx = code.indexOf('');
  return (
    <PhoneShell hideNav>
      <MNavBar title="Verify" leftLabel="Back" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 0' }}>
        <MAuthHeader
          eyebrow="One-time code · /auth/verify"
          title={<>Check your <em style={{ fontStyle: 'italic' }}>inbox.</em></>}
          sub={<>We sent a 6-digit code to <strong style={{ color: 'var(--zm-ink-950)' }}>you@example.com</strong>. It expires in 10 minutes.</>}
        />
        <div style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'space-between' }}>
            {code.map((d, i) => {
              const focus = i === focusIdx;
              return (
                <div key={i} style={{
                  flex: 1, height: 64, borderRadius: 'var(--zm-r-md)',
                  background: 'var(--zm-white)',
                  border: `2px solid ${d ? 'var(--zm-ink-700)' : focus ? 'var(--zm-ink-700)' : 'var(--zm-border)'}`,
                  boxShadow: focus ? '0 0 0 3px var(--zm-gold-200)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--zm-font-mono)', fontSize: 28, fontWeight: 600,
                }}>{d || (focus && <span style={{ width: 1.5, height: 26, background: 'var(--zm-ink-700)', animation: 'blink 1s infinite' }} />)}</div>
              );
            })}
          </div>
          <div style={{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textAlign: 'center', marginTop: 20 }}>
            Didn't get it? <a style={{ color: 'var(--zm-ink-700)', fontWeight: 600 }}>Resend in 28 s</a>
          </div>
        </div>
      </div>
      <MStickyCTA>
        <ZmButton variant="primary" size="lg" full iconRight="arrow_right">Verify and sign in</ZmButton>
      </MStickyCTA>
    </PhoneShell>
  );
}

// ── Sign up ───────────────────────────────────────────────────
function MSignup() {
  return (
    <PhoneShell hideNav>
      <MNavBar title="Create account" leftLabel="Back" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        <MAuthHeader
          eyebrow="Sign up · /signup"
          title={<>Join the <em style={{ fontStyle: 'italic' }}>marketplace.</em></>}
          sub="Email-only to start. You can add a password later."
        />
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <ZmField label="Full name" required>
            <ZmInput full placeholder="First Last" leadingIcon="user" size="lg" />
          </ZmField>
          <ZmField label="Email" required help="We'll send a 6-digit code.">
            <ZmInput full type="email" placeholder="you@example.com" leadingIcon="message" size="lg" />
          </ZmField>
          <ZmCheckbox checked label={<span style={{ font: '400 12.5px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>I agree to the <strong style={{ color: 'var(--zm-ink-950)' }}>Terms</strong> and <strong style={{ color: 'var(--zm-ink-950)' }}>Privacy</strong>.</span>} />

          <MDivider label="or sign up with" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <MSso provider="google" label="Sign up with Google" />
            <MSso provider="apple" label="Sign up with Apple" />
            <MSso provider="linkedin" label="Sign up with LinkedIn" />
          </div>
        </div>
      </div>
      <MStickyCTA>
        <ZmButton variant="primary" size="lg" full iconRight="arrow_right">Send verification code</ZmButton>
      </MStickyCTA>
    </PhoneShell>
  );
}

// ── Set password ──────────────────────────────────────────────
function MSetPassword() {
  return (
    <PhoneShell hideNav>
      <MNavBar title="Set password" leftLabel="Cancel" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        <MAuthHeader
          eyebrow="Account · /account/password"
          title={<>Set a <em style={{ fontStyle: 'italic' }}>password.</em></>}
          sub={<>Signed in as <strong style={{ color: 'var(--zm-ink-950)' }}>enoch@zeemic.com</strong>. After saving, you can sign in with email + password.</>}
        />
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <ZmField label="New password" required>
            <ZmInput type="password" full placeholder="At least 12 characters" trailingIcon="eye" size="lg" />
          </ZmField>
          <div>
            <div style={{ display: 'flex', gap: 4 }}>
              {[0,1,2,3].map(i => (
                <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < 3 ? 'var(--zm-success)' : 'var(--zm-grey-200)' }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', font: '500 11px var(--zm-font-body)', marginTop: 6 }}>
              <span style={{ color: 'var(--zm-success)', fontWeight: 600 }}>Strong</span>
              <span style={{ color: 'var(--zm-fg-muted)' }}>12+ chars · upper · number · symbol</span>
            </div>
          </div>
          <ZmField label="Confirm new password" required help="Both passwords must match.">
            <ZmInput type="password" full placeholder="Re-enter password" trailingIcon="check" size="lg" />
          </ZmField>
          <ZmCheckbox label={<span style={{ font: '400 13px var(--zm-font-body)' }}>Show passwords</span>} />
        </div>
      </div>
      <MStickyCTA style={{ flexDirection: 'column', gap: 8 }}>
        <ZmButton variant="primary" size="lg" full iconRight="arrow_right">Login</ZmButton>
        <ZmButton variant="ghost" size="md" full>Skip — keep one-time codes</ZmButton>
      </MStickyCTA>
    </PhoneShell>
  );
}

// ── Reset password ────────────────────────────────────────────
function MResetPassword() {
  return (
    <PhoneShell hideNav>
      <MNavBar title="Reset password" leftLabel="Cancel" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        <MAuthHeader
          eyebrow="Reset · /auth/reset"
          title={<>Choose a <em style={{ fontStyle: 'italic' }}>new</em> password.</>}
          sub={<>Reset link verified for <strong style={{ color: 'var(--zm-ink-950)' }}>enoch@zeemic.com</strong>.</>}
        />
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <ZmAlert tone="info" title="Security note">All other devices will be signed out when you save.</ZmAlert>
          <ZmField label="New password" required>
            <ZmInput type="password" full placeholder="At least 12 characters" trailingIcon="eye" size="lg" />
          </ZmField>
          <ZmField label="Confirm new password" required help="Both passwords must match.">
            <ZmInput type="password" full placeholder="Re-enter password" trailingIcon="check" size="lg" />
          </ZmField>
        </div>
      </div>
      <MStickyCTA>
        <ZmButton variant="primary" size="lg" full iconRight="arrow_right">Save and sign in</ZmButton>
      </MStickyCTA>
    </PhoneShell>
  );
}

// ── Business registration ─────────────────────────────────────
function MBusinessRegister() {
  return (
    <PhoneShell hideNav>
      <MNavBar title="Register business" leftLabel="Back" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        <MAuthHeader
          eyebrow="Business · /business/register"
          title={<>Register your <em style={{ fontStyle: 'italic' }}>business.</em></>}
          sub="A business account unlocks team listings, recruiters, and a shared inbox."
        />
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            padding: 4, background: 'var(--zm-ink-50)', borderRadius: 'var(--zm-r-md)',
            border: '1px solid var(--zm-ink-100)',
          }}>
            {[['company', 'Company', 'building'], ['agency', 'Agency', 'users'], ['sole', 'Sole', 'user']].map(([id, lbl, icon], i) => (
              <div key={id} style={{
                height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                background: i === 0 ? 'var(--zm-white)' : 'transparent',
                color: i === 0 ? 'var(--zm-ink-950)' : 'var(--zm-fg-muted)',
                borderRadius: 'var(--zm-r-sm)',
                font: `${i === 0 ? 600 : 500} 12px var(--zm-font-body)`,
                boxShadow: i === 0 ? 'var(--zm-shadow-xs)' : 'none',
              }}>
                <ZmIcon name={icon} size={12} color={i === 0 ? 'var(--zm-ink-700)' : 'var(--zm-fg-muted)'} />{lbl}
              </div>
            ))}
          </div>
          <ZmField label="Business name" required><ZmInput full placeholder="Northwind Studio GmbH" leadingIcon="building" size="lg" /></ZmField>
          <ZmField label="Public handle" required help="zeemic.com/business/your-handle"><ZmInput full placeholder="northwind-studio" suffix=".zeemic" size="lg" /></ZmField>
          <ZmField label="Country" required><ZmSelect value="Germany" full size="lg" /></ZmField>
          <ZmField label="Industry" required><ZmSelect value="Design agency" full size="lg" /></ZmField>
          <ZmField label="Work email" required help="We'll send your verification code here.">
            <ZmInput type="email" full placeholder="hello@yourbusiness.com" leadingIcon="message" size="lg" />
          </ZmField>
          <div style={{ padding: 14, background: 'var(--zm-gold-100)', border: '1px solid var(--zm-gold-300)', borderRadius: 'var(--zm-r-md)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <ZmIcon name="badge_check" size={18} color="var(--zm-gold-700)" style={{ marginTop: 2, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ font: '600 13px var(--zm-font-body)' }}>Apply for Verified now</div>
              <div style={{ font: '400 11.5px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: 2 }}>Get a gold badge, priority placement, and escrow.</div>
            </div>
            <ZmToggle value size="md" />
          </div>
          <ZmCheckbox checked label={<span style={{ font: '400 12.5px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>I agree to <strong style={{ color: 'var(--zm-ink-950)' }}>Business Terms</strong> and confirm I'm authorised.</span>} />
        </div>
      </div>
      <MStickyCTA>
        <ZmButton variant="primary" size="lg" full iconRight="arrow_right">Create and continue</ZmButton>
      </MStickyCTA>
    </PhoneShell>
  );
}

// ── Business verification (multi-step) ────────────────────────
function MBusinessVerify({ step = 2 }) {
  return (
    <PhoneShell hideNav>
      <MNavBar title="Verification" leftLabel="Save & exit" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        <div style={{ padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {[1,2,3].map(n => (
              <React.Fragment key={n}>
                <div style={{
                  width: 26, height: 26, borderRadius: 13, flexShrink: 0,
                  background: n === step ? 'var(--zm-gold-500)' : n < step ? 'var(--zm-ink-700)' : 'var(--zm-paper-2)',
                  color: n === step ? 'var(--zm-ink-950)' : n < step ? 'var(--zm-paper)' : 'var(--zm-fg-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  font: '600 12px var(--zm-font-mono)',
                }}>{n < step ? <ZmIcon name="check" size={13} /> : n}</div>
                {n < 3 && <span style={{ flex: 1, height: 2, background: n < step ? 'var(--zm-ink-700)' : 'var(--zm-paper-2)', borderRadius: 1 }} />}
              </React.Fragment>
            ))}
          </div>
          <MAuthHeader eyebrow={`Step ${step} of 3`} title={['', 'Identity', 'Documents', 'Review'][step]} sub={step === 2 ? 'Upload required documents. PDF, PNG, or JPG, max 10 MB each.' : ''} />
        </div>

        {step === 2 && (
          <div style={{ padding: '4px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { name: 'Certificate of incorporation', state: 'uploaded', file: 'NorthwindStudio_HRB.pdf', size: '1.2 MB' },
              { name: 'Gov-issued ID of representative', state: 'uploaded', file: 'L_Wagner_Passport.pdf', size: '2.4 MB' },
              { name: 'Proof of business address', state: 'pending', help: 'Utility bill or bank statement.' },
              { name: 'Optional · Tax certificate', state: 'optional' },
            ].map((doc, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: 14,
                background: doc.state === 'uploaded' ? 'var(--zm-success-bg)' : 'var(--zm-white)',
                border: `1px solid ${doc.state === 'uploaded' ? 'var(--zm-success)' : 'var(--zm-border)'}`,
                borderRadius: 'var(--zm-r-md)',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 'var(--zm-r-sm)',
                  background: doc.state === 'uploaded' ? 'var(--zm-success)' : 'var(--zm-ink-50)',
                  color: doc.state === 'uploaded' ? 'var(--zm-paper)' : 'var(--zm-fg-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <ZmIcon name={doc.state === 'uploaded' ? 'check' : 'file_text'} size={16} stroke={2.4} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ font: '600 13px var(--zm-font-body)' }}>
                    {doc.name}{doc.state === 'optional' && <span style={{ marginLeft: 6, font: '500 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>· optional</span>}
                  </div>
                  <div style={{ font: '400 11.5px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {doc.state === 'uploaded' ? `${doc.file} · ${doc.size}` : doc.help || 'Tap to upload'}
                  </div>
                </div>
                {doc.state === 'uploaded' ? <ZmIconButton icon="close" size={28} /> : <ZmButton variant="secondary" size="sm" icon="upload">Upload</ZmButton>}
              </div>
            ))}
          </div>
        )}
      </div>
      <MStickyCTA>
        <ZmButton variant="ghost" size="lg">Back</ZmButton>
        <ZmButton variant="primary" size="lg" full iconRight="arrow_right">Continue</ZmButton>
      </MStickyCTA>
    </PhoneShell>
  );
}

// ══════════════════════════════════════════════════════════════
// MARKETPLACE · mobile native
// ══════════════════════════════════════════════════════════════

// ── Recruiters list ───────────────────────────────────────────
function MRecruitersList() {
  return (
    <PhoneShell active="exchange">
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <MNavBar title="Recruiters" leftLabel="Exchange" right={<ZmIconButton icon="filter" size={36} />} />
        <div style={{ padding: '12px 20px 8px' }}>
          <div className="zm-eyebrow">3,421 results</div>
          <h1 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 32, lineHeight: 0.98, letterSpacing: '-0.025em', margin: '6px 0 0' }}>
            Recruiters, <em style={{ fontStyle: 'italic' }}>vetted.</em>
          </h1>
        </div>
        <div style={{ padding: '8px 16px 8px', display: 'flex', gap: 6, overflowX: 'auto' }}>
          <ZmChip size="sm" active iconRight="close">Engineering</ZmChip>
          <ZmChip size="sm" iconRight="chevron_down">Country</ZmChip>
          <ZmChip size="sm" iconRight="chevron_down">Response</ZmChip>
        </div>
        <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ZM_RECRUITERS.map(r => (
            <div key={r.id} style={{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <ZmAvatar name={r.name} size={48} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ font: '600 14px var(--zm-font-body)' }}>{r.name}</span>
                    <ZmIcon name="badge_check" size={12} color="var(--zm-ink-700)" />
                  </div>
                  <div style={{ font: '400 11.5px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>{r.title}</div>
                </div>
                <ZmRating value={r.rating} size={11} />
              </div>
              <p style={{ font: 'italic 400 13px/1.4 var(--zm-font-display)', margin: '10px 0 8px', fontSize: 14, color: 'var(--zm-ink-950)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>"{r.quote}"</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {r.specialties.slice(0, 2).map(s => <ZmChip size="sm" key={s} tone="subtle">{s}</ZmChip>)}
                <span style={{ font: '500 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginLeft: 'auto' }}>
                  <span style={{ fontFamily: 'var(--zm-font-display)', fontSize: 16, color: 'var(--zm-ink-950)' }} className="zm-num-tab">{r.placements}</span> placements
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PhoneShell>
  );
}

// ── Recruiter profile ─────────────────────────────────────────
function MRecruiterProfile({ recruiter = ZM_RECRUITERS[0] }) {
  return (
    <PhoneShell hideNav>
      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--zm-ink-900)', color: 'var(--zm-paper)' }}>
        <MNavBar title="" leftLabel="Recruiters" transparent right={<ZmIconButton icon="bookmark" size={36} variant="onDark" />} />
        <div style={{ padding: '24px 20px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', right: -40, top: -40, fontFamily: 'var(--zm-font-display)', fontSize: 280, color: 'rgba(245,241,232,0.04)', fontStyle: 'italic', lineHeight: 1, pointerEvents: 'none' }}>R.</div>
          <div style={{ display: 'inline-flex', position: 'relative' }}>
            <ZmAvatar name={recruiter.name} size={96} ring />
          </div>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 14 }}>
            <ZmBadge tone="onDark"><ZmIcon name="badge_check" size={10} color="var(--zm-gold-500)" /> Verified</ZmBadge>
            <ZmBadge tone="gold">Top 5% Eng.</ZmBadge>
          </div>
          <h1 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 36, lineHeight: 1, letterSpacing: '-0.025em', margin: '14px 0 6px' }}>{recruiter.name}</h1>
          <div style={{ font: '400 14px var(--zm-font-body)', color: 'var(--zm-fg-on-dark-muted)' }}>{recruiter.title} · {recruiter.business}</div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12, font: '500 12px var(--zm-font-body)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><ZmIcon name="map_pin" size={12} color="var(--zm-gold-500)" /> {recruiter.location}</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><ZmIcon name="bolt" size={12} color="var(--zm-gold-500)" /> Responds {recruiter.response}</span>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 20 }}>
            <div style={{ textAlign: 'center', padding: '8px 16px', background: 'rgba(245,241,232,0.06)', borderRadius: 'var(--zm-r-md)', border: '1px solid rgba(245,241,232,0.14)' }}>
              <div style={{ fontFamily: 'var(--zm-font-display)', fontSize: 22, lineHeight: 1 }} className="zm-num-tab">{recruiter.placements}</div>
              <div style={{ font: '500 10px var(--zm-font-mono)', color: 'var(--zm-fg-on-dark-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>Placed</div>
            </div>
            <div style={{ textAlign: 'center', padding: '8px 16px', background: 'rgba(245,241,232,0.06)', borderRadius: 'var(--zm-r-md)', border: '1px solid rgba(245,241,232,0.14)' }}>
              <ZmRating value={recruiter.rating} count={recruiter.reviews} size={13} />
              <div style={{ font: '500 10px var(--zm-font-mono)', color: 'var(--zm-fg-on-dark-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>Rating</div>
            </div>
          </div>
        </div>
        <div style={{ background: 'var(--zm-paper)', color: 'var(--zm-ink-950)', borderRadius: '24px 24px 0 0', padding: '24px 20px 100px' }}>
          <blockquote style={{ margin: 0, padding: '16px 18px', background: 'var(--zm-white)', borderLeft: '3px solid var(--zm-gold-500)', borderRadius: 'var(--zm-r-md)', fontFamily: 'var(--zm-font-display)', fontStyle: 'italic', fontSize: 17, lineHeight: 1.35 }}>"{recruiter.quote}"</blockquote>
          <div className="zm-eyebrow" style={{ marginTop: 22 }}>Specialties</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
            {[...recruiter.specialties, 'Platform', 'EU + Africa'].map(s => <ZmChip key={s} tone="subtle">{s}</ZmChip>)}
          </div>
          <div className="zm-eyebrow" style={{ marginTop: 22 }}>Open roles · 4</div>
          {ZM_JOBS.slice(0, 1).map(j => (
            <div key={j.id} style={{ marginTop: 10, padding: 14, background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)' }}>
              <div style={{ font: '600 14px var(--zm-font-body)' }}>{j.title}</div>
              <div style={{ font: '400 11.5px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: 2 }}>{j.company} · {j.location}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <ZmBadge tone="emerald" size="sm">{j.salary}</ZmBadge>
              </div>
            </div>
          ))}
        </div>
      </div>
      <MStickyCTA>
        <ZmIconButton icon="message" size={48} variant="surface" />
        <ZmButton variant="accent" size="lg" full>Contact recruiter</ZmButton>
      </MStickyCTA>
    </PhoneShell>
  );
}

// ── Jobs list ─────────────────────────────────────────────────
function MJobsList() {
  return (
    <PhoneShell active="exchange">
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <MNavBar title="Jobs" leftLabel="Exchange" right={<ZmIconButton icon="filter" size={36} />} />
        <div style={{ padding: '12px 20px 8px' }}>
          <div className="zm-eyebrow">8,140 active jobs</div>
          <h1 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 32, lineHeight: 0.98, letterSpacing: '-0.025em', margin: '6px 0 0' }}>
            Latest <em style={{ fontStyle: 'italic' }}>roles.</em>
          </h1>
        </div>
        <div style={{ padding: '8px 16px 8px', display: 'flex', gap: 6, overflowX: 'auto' }}>
          <ZmChip size="sm" active iconRight="close">Full-time</ZmChip>
          <ZmChip size="sm" iconRight="chevron_down">Country</ZmChip>
          <ZmChip size="sm" iconRight="chevron_down">Salary</ZmChip>
          <ZmChip size="sm" iconRight="chevron_down">Recruiter</ZmChip>
        </div>
        <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ZM_JOBS.map(j => (
            <div key={j.id} style={{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-lg)', padding: 14 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                <ZmAvatar name={j.company} size={32} square />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ font: '500 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>{j.company}</div>
                  <div style={{ font: '600 15px var(--zm-font-body)' }}>{j.title}</div>
                </div>
                <ZmIcon name="bookmark" size={18} color="var(--zm-fg-muted)" />
              </div>
              <div style={{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginBottom: 8 }}>{j.location}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <ZmBadge tone="emerald" size="sm">{j.salary}</ZmBadge>
                <ZmBadge size="sm">{j.type}</ZmBadge>
                {j.recruiter && <ZmBadge tone="gold" size="sm">via {j.recruiter}</ZmBadge>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PhoneShell>
  );
}

// ── Job detail ────────────────────────────────────────────────
function MJobDetail({ job = ZM_JOBS[0] }) {
  return (
    <PhoneShell hideNav>
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        <MNavBar title="Job" leftLabel="Jobs" right={<><ZmIconButton icon="paperclip" size={36} /><ZmIconButton icon="bookmark" size={36} /></>} />
        <div style={{ padding: '20px 20px 8px' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
            <ZmAvatar name={job.company} size={56} square />
            <div>
              <div style={{ font: '600 14px var(--zm-font-body)' }}>{job.company}</div>
              <div style={{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>{job.location}</div>
            </div>
          </div>
          <h1 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 32, lineHeight: 1.05, letterSpacing: '-0.025em', margin: 0 }}>{job.title}</h1>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
            <ZmBadge tone="emerald" size="md">{job.salary}</ZmBadge>
            <ZmBadge size="md">{job.type}</ZmBadge>
            <ZmBadge tone="gold" size="md">Deadline · {job.deadline}</ZmBadge>
          </div>
        </div>
        <div style={{ padding: '16px 20px' }}>
          <div className="zm-eyebrow">Overview</div>
          <p style={{ font: '400 14px/1.55 var(--zm-font-body)', marginTop: 8 }}>
            We're hiring a {job.title} to lead our European product design practice. You'll work with engineering and product leads to ship reliable software for a buyer-facing audience of 40,000+ businesses across the EU and Africa.
          </p>
          <div className="zm-eyebrow" style={{ marginTop: 22 }}>What you'll do</div>
          <ul style={{ font: '400 14px/1.6 var(--zm-font-body)', margin: '8px 0 0', paddingLeft: 20 }}>
            <li>Own end-to-end product design for one platform vertical.</li>
            <li>Partner with research to ship a quarterly roadmap of usability work.</li>
            <li>Mentor mid-level designers, lead one design ritual.</li>
          </ul>

          {job.recruiter && (
            <div style={{ marginTop: 24, padding: 14, background: 'var(--zm-paper)', borderRadius: 'var(--zm-r-md)', border: '1px solid var(--zm-border)' }}>
              <div className="zm-eyebrow">Posted via</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                <ZmAvatar name={job.recruiter} size={40} />
                <div style={{ flex: 1 }}>
                  <div style={{ font: '600 14px var(--zm-font-body)' }}>{job.recruiter}</div>
                  <div style={{ font: '400 11.5px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>Verified recruiter</div>
                </div>
                <ZmIcon name="chevron_right" size={16} color="var(--zm-fg-muted)" />
              </div>
            </div>
          )}
          <div style={{ height: 100 }} />
        </div>
      </div>
      <MStickyCTA>
        <ZmIconButton icon="message" size={48} variant="surface" />
        <ZmButton variant="dark" size="lg" full iconRight="arrow_right">Apply now</ZmButton>
      </MStickyCTA>
    </PhoneShell>
  );
}

// ── Business profile ──────────────────────────────────────────
function MBusinessProfile() {
  return (
    <PhoneShell hideNav>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ position: 'relative', height: 180, background: '#1A4D3A' }}>
          <svg width="100%" height="100%" viewBox="0 0 390 180" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
            <circle cx="340" cy="20" r="120" fill="#F2C94C" opacity="0.4" />
            <circle cx="340" cy="20" r="60" fill="#1A4D3A" />
          </svg>
          <MNavBar title="" transparent right={<><ZmIconButton icon="paperclip" size={36} variant="onDark" /><ZmIconButton icon="bookmark" size={36} variant="onDark" /></>} />
        </div>
        <div style={{ padding: '0 20px', marginTop: -32, position: 'relative' }}>
          <div style={{ width: 80, height: 80, borderRadius: 'var(--zm-r-lg)', background: 'var(--zm-paper)', border: '4px solid var(--zm-paper)', boxShadow: 'var(--zm-shadow-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--zm-font-display)', fontSize: 48, color: '#1A4D3A', letterSpacing: '-0.04em' }}>N</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
            <ZmBadge tone="emerald"><ZmIcon name="badge_check" size={11} color="var(--zm-ink-700)" /> Verified</ZmBadge>
            <ZmBadge tone="gold">Featured</ZmBadge>
          </div>
          <h1 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 32, lineHeight: 1, letterSpacing: '-0.025em', margin: '10px 0 6px' }}>Northwind Studio</h1>
          <div style={{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>Design agency · Berlin, DE</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 18 }}>
            {[['8', 'Jobs'], ['4', 'Skills'], ['4.8', 'Rating']].map(([v, l]) => (
              <div key={l} style={{ background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)', padding: 12, textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--zm-font-display)', fontSize: 22, lineHeight: 1 }} className="zm-num-tab">{v}</div>
                <div style={{ font: '500 10px var(--zm-font-mono)', color: 'var(--zm-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>

          <ZmTabs active="about" tabs={[{id:'about',label:'About'},{id:'skills',label:'Skills',count:4},{id:'jobs',label:'Jobs',count:8},{id:'team',label:'Team'}]} style={{ marginTop: 20 }} />
          <div className="zm-eyebrow" style={{ marginTop: 18 }}>About</div>
          <p style={{ font: '400 14px/1.55 var(--zm-font-body)', marginTop: 8, marginBottom: 24 }}>
            A design and product studio working with venture-backed companies on brand, product, and go-to-market. Founded in 2018 in Berlin.
          </p>
        </div>
        <div style={{ padding: '0 20px 100px' }}>
          <div className="zm-eyebrow">Open roles</div>
          {ZM_JOBS.slice(0, 2).map(j => (
            <div key={j.id} style={{ marginTop: 10, padding: 14, background: 'var(--zm-white)', border: '1px solid var(--zm-border)', borderRadius: 'var(--zm-r-md)' }}>
              <div style={{ font: '600 14px var(--zm-font-body)' }}>{j.title}</div>
              <div style={{ font: '400 11.5px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: 2 }}>{j.location}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}><ZmBadge tone="emerald" size="sm">{j.salary}</ZmBadge></div>
            </div>
          ))}
        </div>
      </div>
      <MStickyCTA>
        <ZmIconButton icon="message" size={48} variant="surface" />
        <ZmButton variant="dark" size="lg" full>Start a project</ZmButton>
      </MStickyCTA>
    </PhoneShell>
  );
}

// ── Search (global) ───────────────────────────────────────────
function MSearch() {
  return (
    <PhoneShell hideNav>
      <MNavBar title="" back leftLabel="Cancel" />
      <div style={{ padding: '0 16px 12px' }}>
        <ZmSearch placeholder="Skills, jobs, recruiters…" size="lg" />
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <MSectionHead>Recent searches</MSectionHead>
        <div style={{ background: 'var(--zm-white)' }}>
          <MListRow icon="search" title="UX research" subtitle="Skills" />
          <MListRow icon="search" title="Senior designer Berlin" subtitle="Jobs" />
          <MListRow icon="search" title="Jane Smith" subtitle="Recruiters" last />
        </div>
        <MSectionHead>Trending</MSectionHead>
        <div style={{ padding: '0 16px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['Brand sprints', 'Financial modelling', 'Series A roles', 'Remote design', 'SAP'].map(t => <ZmChip key={t} tone="subtle">{t}</ZmChip>)}
        </div>
        <MSectionHead>Browse all</MSectionHead>
        <div style={{ background: 'var(--zm-white)' }}>
          <MListRow icon="wrench" title="Skills" subtitle="12,840 listed" />
          <MListRow icon="users" title="Recruiters" subtitle="3,421" />
          <MListRow icon="briefcase" title="Jobs" subtitle="8,140 active" />
          <MListRow icon="building" title="Businesses" subtitle="2,180 verified" last />
        </div>
      </div>
    </PhoneShell>
  );
}

// ══════════════════════════════════════════════════════════════
// DASHBOARD · mobile native
// ══════════════════════════════════════════════════════════════

// ── Leads list ────────────────────────────────────────────────
function MLeadsList() {
  return (
    <PhoneShell active="dashboard">
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <MNavBar title="Leads" leftLabel="Dashboard" right={<ZmIconButton icon="filter" size={36} />} />
        <div style={{ padding: '12px 20px 8px' }}>
          <div className="zm-eyebrow">12 this month · 3 unread</div>
          <h1 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 32, lineHeight: 0.98, letterSpacing: '-0.025em', margin: '6px 0 0' }}>Leads</h1>
        </div>
        <div style={{ padding: '8px 16px 8px', display: 'flex', gap: 6, overflowX: 'auto' }}>
          <ZmChip size="sm" active>All <span style={{ marginLeft: 4, opacity: 0.6 }}>12</span></ZmChip>
          <ZmChip size="sm">Bookings <span style={{ marginLeft: 4, color: 'var(--zm-fg-muted)' }}>2</span></ZmChip>
          <ZmChip size="sm">RFQ <span style={{ marginLeft: 4, color: 'var(--zm-fg-muted)' }}>4</span></ZmChip>
          <ZmChip size="sm">Forms <span style={{ marginLeft: 4, color: 'var(--zm-fg-muted)' }}>3</span></ZmChip>
        </div>
        <div style={{ background: 'var(--zm-white)', marginTop: 8 }}>
          {ZM_LEADS.map((l, i) => {
            const typeMeta = {
              booking:  { label: 'Booking', tone: 'gold' },
              rfq:      { label: 'RFQ', tone: 'emerald' },
              lead:     { label: 'Lead form', tone: 'sky' },
              brochure: { label: 'Brochure', tone: 'neutral' },
              proposal: { label: 'Proposal', tone: 'gold' },
            }[l.type];
            return (
              <div key={l.id} style={{ padding: '14px 16px', borderBottom: i < ZM_LEADS.length - 1 ? '0.5px solid var(--zm-border)' : 'none', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <ZmAvatar name={l.fromName} size={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {l.status === 'new' && <span style={{ width: 7, height: 7, borderRadius: 3.5, background: 'var(--zm-ink-700)' }} />}
                    <span style={{ font: `${l.status === 'new' ? 600 : 500} 15px var(--zm-font-body)`, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.fromName}</span>
                    <span style={{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>{l.when}</span>
                  </div>
                  <div style={{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.skill}</div>
                  <div style={{ marginTop: 6 }}><ZmBadge tone={typeMeta.tone} size="sm">{typeMeta.label}</ZmBadge></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PhoneShell>
  );
}

// ── Lead detail ───────────────────────────────────────────────
function MLeadDetail() {
  return (
    <PhoneShell hideNav>
      <MNavBar title="Lead" leftLabel="Leads" right={<ZmIconButton icon="more" size={36} />} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 100px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          <ZmBadge tone="gold" size="md">Booking request</ZmBadge>
          <ZmBadge tone="warning" dot>Awaiting reply</ZmBadge>
        </div>
        <h1 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 28, lineHeight: 1.05, letterSpacing: '-0.025em', margin: 0 }}>Product Design Sprint — 3 days</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
          <ZmAvatar name="Acme Corp" size={36} square />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: '600 14px var(--zm-font-body)' }}>Acme Corp <ZmIcon name="badge_check" size={11} color="var(--zm-ink-700)" style={{ verticalAlign: -1 }} /></div>
            <div style={{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>John Doe · john@acme.com</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 18 }}>
          {[
            ['Skill', 'UX Research', 'wrench'],
            ['Dates', 'Jun 5–7, 2026', 'calendar'],
            ['Budget', '$2,000 – $3,000', 'target'],
          ].map(([k, v, icon]) => (
            <div key={k} style={{ display: 'flex', gap: 12, padding: 14, background: 'var(--zm-paper)', borderRadius: 'var(--zm-r-md)' }}>
              <ZmIcon name={icon} size={16} color="var(--zm-fg-muted)" />
              <div>
                <div className="zm-eyebrow" style={{ fontSize: 10 }}>{k}</div>
                <div style={{ font: '600 14px var(--zm-font-body)', marginTop: 2 }}>{v}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 18, padding: 16, background: 'var(--zm-ink-50)', border: '1px solid var(--zm-ink-200)', borderRadius: 'var(--zm-r-md)' }}>
          <div className="zm-eyebrow">Message from buyer</div>
          <p style={{ font: '400 14px/1.55 var(--zm-font-body)', margin: '8px 0 0' }}>
            Hi — we need a 3-day moderated study with 8 participants for a fintech onboarding flow. Timing is firm and we'd ideally finish with a stakeholder readout that Friday.
          </p>
        </div>
      </div>
      <MStickyCTA style={{ flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8, width: '100%' }}>
          <ZmButton variant="secondary" size="lg" full>Decline</ZmButton>
          <ZmButton variant="primary" size="lg" full iconRight="check">Accept</ZmButton>
        </div>
        <ZmButton variant="ghost" size="md" full icon="message">Send message</ZmButton>
      </MStickyCTA>
    </PhoneShell>
  );
}

// ── Applications ──────────────────────────────────────────────
function MApplications() {
  const apps = [
    { title: 'Senior UX Designer', co: 'Northwind Studio', date: 'May 12', status: 'Shortlisted', tone: 'gold' },
    { title: 'Staff Product Engineer', co: 'Pangea Labs', date: 'May 8', status: 'Under review', tone: 'sky' },
    { title: 'Head of GTM', co: 'Pangea Labs', date: 'Apr 30', status: 'Applied', tone: 'neutral' },
    { title: 'Lead Designer', co: 'Brightline Legal', date: 'Apr 24', status: 'Offered', tone: 'success' },
    { title: 'Marketing Lead', co: 'Helio Capital', date: 'Apr 12', status: 'Rejected', tone: 'danger' },
  ];
  return (
    <PhoneShell active="dashboard">
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <MNavBar title="Applications" leftLabel="Dashboard" />
        <div style={{ padding: '12px 20px 8px' }}>
          <div className="zm-eyebrow">4 active · 5 total</div>
          <h1 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 32, lineHeight: 0.98, letterSpacing: '-0.025em', margin: '6px 0 0' }}>My applications</h1>
        </div>
        <div style={{ background: 'var(--zm-white)', marginTop: 12 }}>
          {apps.map((a, i) => (
            <MListRow key={i}
              leading={<ZmAvatar name={a.co} size={36} square />}
              title={a.title}
              subtitle={`${a.co} · Applied ${a.date}`}
              accessory={<ZmBadge tone={a.tone} size="sm">{a.status}</ZmBadge>}
              last={i === apps.length - 1}
            />
          ))}
        </div>
      </div>
    </PhoneShell>
  );
}

// ── Notifications ─────────────────────────────────────────────
function MNotifications() {
  return (
    <PhoneShell active="notifs">
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <MNavBar title="Notifications" back={false} right={<button style={{ border: 'none', background: 'transparent', font: '500 14px var(--zm-font-body)', color: 'var(--zm-ink-700)' }}>Mark all read</button>} />
        <div style={{ padding: '12px 20px 8px' }}>
          <div className="zm-eyebrow">2 unread</div>
          <h1 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 32, lineHeight: 0.98, letterSpacing: '-0.025em', margin: '6px 0 0' }}>Alerts</h1>
        </div>
        <div style={{ padding: '8px 16px 8px', display: 'flex', gap: 6, overflowX: 'auto' }}>
          <ZmChip size="sm" active>All</ZmChip>
          <ZmChip size="sm">Leads</ZmChip>
          <ZmChip size="sm">Messages</ZmChip>
          <ZmChip size="sm">Reviews</ZmChip>
        </div>
        <div style={{ background: 'var(--zm-white)', marginTop: 8 }}>
          {ZM_NOTIFS.map((n, i) => (
            <div key={i} style={{
              padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start',
              background: n.unread ? 'var(--zm-ink-50)' : 'var(--zm-white)',
              borderBottom: i < ZM_NOTIFS.length - 1 ? '0.5px solid var(--zm-border)' : 'none',
            }}>
              {n.unread && <span style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--zm-ink-700)', marginTop: 8, flexShrink: 0 }} />}
              <ZmAvatar name={n.actor} size={36} square={n.type === 'application'} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: `${n.unread ? 600 : 500} 14px var(--zm-font-body)` }}>{n.title}</div>
                <div style={{ font: '400 12.5px/1.4 var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: 2 }}>{n.body}</div>
                <div style={{ font: '500 11px var(--zm-font-mono)', color: 'var(--zm-fg-muted)', marginTop: 6 }}>{n.time} ago</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PhoneShell>
  );
}

// ── Messages list ─────────────────────────────────────────────
function MMessages() {
  const msgs = [
    { name: 'Acme Corp', preview: 'Thanks for getting back — Tuesday works for the readout.', time: '2h', unread: 2 },
    { name: 'Jane Smith', preview: 'I have a Staff Platform role that fits your profile.', time: '1d', unread: 1 },
    { name: 'TechStart Ltd', preview: "We're keen to lock in the heuristic review for next month.", time: '2d' },
    { name: 'Adaeze Okoye', preview: 'Sending over the spec now. Let me know.', time: '4d' },
    { name: 'Sarah Kim', preview: '"Excellent work, very thorough."', time: '1w' },
  ];
  return (
    <PhoneShell active="messages">
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <MNavBar title="Messages" back={false} right={<ZmIconButton icon="plus" size={36} />} />
        <div style={{ padding: '12px 16px 4px' }}>
          <ZmSearch placeholder="Search messages…" size="md" />
        </div>
        <div style={{ background: 'var(--zm-white)', marginTop: 8 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'center', borderBottom: i < msgs.length - 1 ? '0.5px solid var(--zm-border)' : 'none' }}>
              <ZmAvatar name={m.name} size={48} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ font: '600 15px var(--zm-font-body)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</span>
                  <span style={{ font: '400 11.5px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>{m.time}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <span style={{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.preview}</span>
                  {m.unread && <ZmBadge tone="coral" size="sm">{m.unread}</ZmBadge>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PhoneShell>
  );
}

// ── Settings page ─────────────────────────────────────────────
function MSettings() {
  return (
    <PhoneShell active="dashboard">
      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--zm-grey-50)' }}>
        <MNavBar title="Settings" leftLabel="Dashboard" />
        <div style={{ padding: '20px 20px 8px', display: 'flex', alignItems: 'center', gap: 14, background: 'var(--zm-white)' }}>
          <ZmAvatar name="Enoch Boison" size={56} />
          <div style={{ flex: 1 }}>
            <div style={{ font: '600 16px var(--zm-font-body)' }}>Enoch Boison</div>
            <div style={{ font: '400 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>@enochboison</div>
          </div>
          <ZmButton size="sm" variant="secondary">Edit</ZmButton>
        </div>
        <MSectionHead>Account</MSectionHead>
        <div style={{ background: 'var(--zm-white)' }}>
          <MListRow icon="user" title="Profile" subtitle="Name, bio, location" />
          <MListRow icon="message" title="Email & verification" subtitle="enoch@zeemic.com · verified" />
          <MListRow icon="bolt" title="Password" subtitle="Set a password" />
          <MListRow icon="globe" title="Languages" subtitle="English · Twi" last />
        </div>
        <MSectionHead>Workspace</MSectionHead>
        <div style={{ background: 'var(--zm-white)' }}>
          <MListRow icon="building" title="My businesses" subtitle="2 businesses · 1 owner" badge={2} />
          <MListRow icon="badge_check" title="Verification" subtitle="Verified ✓" last />
        </div>
        <MSectionHead>Notifications</MSectionHead>
        <div style={{ background: 'var(--zm-white)' }}>
          <MListRow title="Push notifications" accessory={<ZmToggle value />} />
          <MListRow title="Email digest" subtitle="Weekly summary" accessory={<ZmToggle value />} last />
        </div>
        <MSectionHead>Trust & safety</MSectionHead>
        <div style={{ background: 'var(--zm-white)' }}>
          <MListRow icon="file_text" title="Guidelines" />
          <MListRow icon="file_text" title="Privacy" />
          <MListRow icon="file_text" title="Terms" last />
        </div>
        <div style={{ padding: '20px', marginTop: 8 }}>
          <ZmButton variant="danger" size="lg" full>Sign out</ZmButton>
        </div>
      </div>
    </PhoneShell>
  );
}

// ══════════════════════════════════════════════════════════════
// TRANSACTIONAL · mobile native sheets
// ══════════════════════════════════════════════════════════════

// Bottom sheet shell — covers ~85% of viewport, rounded top corners
function MBottomSheet({ title, eyebrow, children, primary, secondary }) {
  return (
    <PhoneShell hideNav>
      <div style={{ flex: 1, background: 'rgba(11,15,13,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-end', position: 'relative' }}>
        {/* Faded skill detail showing through behind */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.3, pointerEvents: 'none' }}>
          <ZmSkillThumb category="Design" motif={0} height={220} />
        </div>
        <div style={{
          position: 'relative', width: '100%', background: 'var(--zm-paper)',
          borderTopLeftRadius: 28, borderTopRightRadius: 28,
          maxHeight: '92%', display: 'flex', flexDirection: 'column',
          paddingTop: 8,
        }}>
          <div style={{ width: 40, height: 4, background: 'var(--zm-border-strong)', borderRadius: 2, margin: '4px auto 8px' }} />
          <div style={{ padding: '12px 20px 12px' }}>
            <div className="zm-eyebrow">{eyebrow}</div>
            <h2 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 28, letterSpacing: '-0.025em', margin: '6px 0 0', lineHeight: 1.05 }}>{title}</h2>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 16px' }}>{children}</div>
          {(primary || secondary) && (
            <div style={{ padding: '12px 20px 32px', borderTop: '1px solid var(--zm-border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {primary}
              {secondary}
            </div>
          )}
        </div>
      </div>
    </PhoneShell>
  );
}

// ── Booking sheet ─────────────────────────────────────────────
function MBookingSheet() {
  return (
    <MBottomSheet
      eyebrow="Book a session"
      title="UX Research & Usability Testing"
      primary={<ZmButton variant="primary" size="lg" full iconRight="arrow_right">Submit booking request</ZmButton>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ font: '500 13px var(--zm-font-body)', display: 'block', marginBottom: 8 }}>Package</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
        </div>
        <ZmField label="Preferred dates">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <ZmInput value="Jun 5, 2026" leadingIcon="calendar" size="lg" />
            <ZmInput value="Jun 7, 2026" leadingIcon="calendar" size="lg" />
          </div>
        </ZmField>
        <ZmField label="Message to seller (optional)">
          <ZmTextarea value="We'd like a 3-day moderated study with 8 participants for our fintech onboarding flow." rows={3} full />
        </ZmField>
        <div style={{ background: 'var(--zm-white)', borderRadius: 'var(--zm-r-md)', padding: 14, border: '1px solid var(--zm-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>
            <span>Sprint package</span><span>$1,800</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', marginTop: 4 }}>
            <span>Service fee (5%)</span><span>$90</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--zm-font-display)', fontSize: 22, letterSpacing: '-0.02em', marginTop: 8, alignItems: 'baseline' }}>
            <span>Total</span><span className="zm-num-tab">$1,890</span>
          </div>
        </div>
        <div style={{ font: '400 11px var(--zm-font-body)', color: 'var(--zm-fg-muted)', textAlign: 'center' }}>
          No charge until the seller accepts. Payment held in escrow on confirmation.
        </div>
      </div>
    </MBottomSheet>
  );
}

// ── RFQ sheet ─────────────────────────────────────────────────
function MRfqSheet() {
  return (
    <MBottomSheet
      eyebrow="Request a quote"
      title="UX Research & Usability Testing"
      primary={<ZmButton variant="accent" size="lg" full iconRight="arrow_right">Send quote request</ZmButton>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <ZmField label="Describe your requirements" required>
          <ZmTextarea placeholder="What are you trying to accomplish?" rows={4} full />
        </ZmField>
        <div>
          <label style={{ font: '500 13px var(--zm-font-body)', display: 'block', marginBottom: 8 }}>Your budget</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['Under $500', '$500–$2k', '$2k–$5k', '$5k+', 'Flexible'].map((b, i) => (
              <ZmChip key={b} size="md" active={i === 2}>{b}</ZmChip>
            ))}
          </div>
        </div>
        <div>
          <label style={{ font: '500 13px var(--zm-font-body)', display: 'block', marginBottom: 8 }}>Timeline</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['ASAP', 'Within 2 weeks', '1 month', 'Flexible'].map((b, i) => (
              <ZmChip key={b} size="md" active={i === 1}>{b}</ZmChip>
            ))}
          </div>
        </div>
        <div style={{ background: 'var(--zm-ink-50)', borderRadius: 'var(--zm-r-md)', padding: 14, border: '1px solid var(--zm-ink-200)' }}>
          <label style={{ font: '600 13px var(--zm-font-body)', display: 'block', marginBottom: 8 }}>Your contact</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[['Name', 'John Doe'], ['Email', 'john@acme.com'], ['Company', 'Acme Corp']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', font: '500 13px var(--zm-font-body)' }}>
                <span style={{ color: 'var(--zm-fg-muted)' }}>{k}</span><span>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MBottomSheet>
  );
}

// ── Account switcher sheet ────────────────────────────────────
function MAccountSwitcherSheet() {
  return (
    <MBottomSheet eyebrow="Account context" title="Switch account">
      <p style={{ font: '400 13.5px var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: '0 0 16px' }}>
        Only one context is active at a time. Switching changes your inbox, listings, and notifications.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: 'var(--zm-white)', borderRadius: 'var(--zm-r-md)', border: '2px solid var(--zm-ink-700)' }}>
          <ZmAvatar name="Enoch Boison" size={42} />
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
            <ZmAvatar name={b.name} size={42} square />
            <div style={{ flex: 1 }}>
              <div style={{ font: '600 14px var(--zm-font-body)' }}>{b.name}</div>
              <div style={{ font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>Business · {b.role}</div>
            </div>
            <ZmIcon name="chevron_right" size={18} color="var(--zm-fg-muted)" />
          </div>
        ))}
        <button style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 14, background: 'transparent', border: '1px dashed var(--zm-border-strong)', borderRadius: 'var(--zm-r-md)', cursor: 'pointer', font: '500 13px var(--zm-font-body)', color: 'var(--zm-ink-700)' }}>
          <ZmIcon name="plus" size={16} /> Create new business
        </button>
      </div>
    </MBottomSheet>
  );
}

Object.assign(window, {
  MNavBar, MStickyCTA, MListRow, MSectionHead, MDivider, MSso, MAuthHeader, MBottomSheet,
  // Auth
  MSignin, MOtc, MSignup, MSetPassword, MResetPassword, MBusinessRegister, MBusinessVerify,
  // Marketplace
  MRecruitersList, MRecruiterProfile, MJobsList, MJobDetail, MBusinessProfile, MSearch,
  // Dashboard
  MLeadsList, MLeadDetail, MApplications, MNotifications, MMessages, MSettings,
  // Transactional
  MBookingSheet, MRfqSheet, MAccountSwitcherSheet,
});
