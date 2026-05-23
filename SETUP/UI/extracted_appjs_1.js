/* Zeemic — Atomic primitives
   Inputs, toggles, alerts, modals, breadcrumbs, pagination.
   These complement components.jsx; together they form the atom + molecule layer. */

// ────────────────────────────────────────────────
// ZmInput — text input with optional leading/trailing icons + suffix
// ────────────────────────────────────────────────
function ZmInput({ placeholder, value, error, leadingIcon, trailingIcon, suffix, size = 'md', type = 'text', disabled, full, style }) {
  const sz = { sm: { h: 32, font: 13, pad: 10 }, md: { h: 40, font: 14, pad: 12 }, lg: { h: 48, font: 15, pad: 14 } }[size];
  const borderColor = error ? 'var(--zm-coral-500)' : 'var(--zm-border)';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      height: sz.h, padding: `0 ${sz.pad}px`,
      background: disabled ? 'var(--zm-grey-50)' : 'var(--zm-white)',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--zm-r-md)', width: full ? '100%' : 'auto',
      ...style,
    }}>
      {leadingIcon && <ZmIcon name={leadingIcon} size={sz.font + 2} color="var(--zm-fg-muted)" />}
      <input type={type} defaultValue={value} placeholder={placeholder} disabled={disabled} style={{
        flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent',
        font: `400 ${sz.font}px var(--zm-font-body)`, color: 'var(--zm-fg)',
      }} />
      {suffix && <span style={{ font: `500 ${sz.font - 1}px var(--zm-font-mono)`, color: 'var(--zm-fg-muted)' }}>{suffix}</span>}
      {trailingIcon && <ZmIcon name={trailingIcon} size={sz.font + 2} color="var(--zm-fg-muted)" />}
    </div>
  );
}

// ZmTextarea
function ZmTextarea({ placeholder, value, rows = 4, error, full, style }) {
  return (
    <textarea defaultValue={value} placeholder={placeholder} rows={rows} style={{
      width: full ? '100%' : 320, padding: 12,
      background: 'var(--zm-white)',
      border: `1px solid ${error ? 'var(--zm-coral-500)' : 'var(--zm-border)'}`,
      borderRadius: 'var(--zm-r-md)', outline: 'none',
      font: '400 14px/1.5 var(--zm-font-body)', resize: 'vertical',
      color: 'var(--zm-fg)', boxSizing: 'border-box', ...style,
    }} />
  );
}

// ZmSelect — visual representation only
function ZmSelect({ value, placeholder, full, size = 'md', style }) {
  const sz = { sm: { h: 32, font: 13, pad: 10 }, md: { h: 40, font: 14, pad: 12 }, lg: { h: 48, font: 15, pad: 14 } }[size];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      height: sz.h, padding: `0 ${sz.pad}px`,
      background: 'var(--zm-white)', border: '1px solid var(--zm-border)',
      borderRadius: 'var(--zm-r-md)', cursor: 'pointer', width: full ? '100%' : 'auto',
      ...style,
    }}>
      <span style={{ font: `400 ${sz.font}px var(--zm-font-body)`, color: value ? 'var(--zm-fg)' : 'var(--zm-fg-muted)', flex: 1 }}>
        {value || placeholder || 'Select…'}
      </span>
      <ZmIcon name="chevron_down" size={14} color="var(--zm-fg-muted)" />
    </div>
  );
}

// ZmToggle — switch
function ZmToggle({ value, size = 'md', disabled }) {
  const sz = { sm: { w: 32, h: 18, knob: 12 }, md: { w: 44, h: 26, knob: 20 }, lg: { w: 52, h: 30, knob: 24 } }[size];
  return (
    <div style={{
      width: sz.w, height: sz.h, borderRadius: sz.h / 2,
      background: value ? 'var(--zm-ink-700)' : 'var(--zm-grey-300)',
      position: 'relative', opacity: disabled ? 0.5 : 1,
      transition: 'background 150ms var(--zm-ease)',
      flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: (sz.h - sz.knob) / 2,
        [value ? 'right' : 'left']: (sz.h - sz.knob) / 2,
        width: sz.knob, height: sz.knob, borderRadius: sz.knob / 2,
        background: 'var(--zm-paper)',
        boxShadow: '0 1px 2px rgba(17,33,26,0.15)',
      }} />
    </div>
  );
}

// ZmCheckbox
function ZmCheckbox({ checked, indeterminate, label, disabled, style }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, ...style }}>
      <div style={{
        width: 18, height: 18, borderRadius: 4,
        background: checked || indeterminate ? 'var(--zm-ink-700)' : 'var(--zm-white)',
        border: `1.5px solid ${checked || indeterminate ? 'var(--zm-ink-700)' : 'var(--zm-border-strong)'}`,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--zm-paper)', flexShrink: 0,
      }}>
        {checked && !indeterminate && <ZmIcon name="check" size={13} color="currentColor" stroke={2.6} />}
        {indeterminate && <div style={{ width: 9, height: 2, background: 'currentColor' }} />}
      </div>
      {label && <span style={{ font: '400 14px var(--zm-font-body)' }}>{label}</span>}
    </label>
  );
}

// ZmRadio
function ZmRadio({ checked, label, disabled, style }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, ...style }}>
      <div style={{
        width: 18, height: 18, borderRadius: 9,
        background: 'var(--zm-white)',
        border: `1.5px solid ${checked ? 'var(--zm-ink-700)' : 'var(--zm-border-strong)'}`,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {checked && <div style={{ width: 9, height: 9, borderRadius: 4.5, background: 'var(--zm-ink-700)' }} />}
      </div>
      {label && <span style={{ font: '400 14px var(--zm-font-body)' }}>{label}</span>}
    </label>
  );
}

// ────────────────────────────────────────────────
// ZmField — molecule. Label + child input + help/error text.
// ────────────────────────────────────────────────
function ZmField({ label, required, help, error, children, style }) {
  return (
    <div style={style}>
      {label && (
        <label style={{ display: 'flex', alignItems: 'center', gap: 3, font: '500 13px var(--zm-font-body)', marginBottom: 6 }}>
          {label}
          {required && <span style={{ color: 'var(--zm-coral-500)' }}>*</span>}
        </label>
      )}
      {children}
      {(help || error) && (
        <div style={{ font: '400 12px var(--zm-font-body)', color: error ? 'var(--zm-coral-500)' : 'var(--zm-fg-muted)', marginTop: 6 }}>
          {error || help}
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────
// ZmBreadcrumb · ZmPagination
// ────────────────────────────────────────────────
function ZmBreadcrumb({ items = [], style }) {
  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: 8, font: '500 13px var(--zm-font-body)', color: 'var(--zm-fg-muted)', ...style }}>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <ZmIcon name="chevron_right" size={14} color="var(--zm-fg-muted)" />}
          <span style={{ cursor: i === items.length - 1 ? 'default' : 'pointer', color: i === items.length - 1 ? 'var(--zm-ink-950)' : 'inherit' }}>{item}</span>
        </React.Fragment>
      ))}
    </nav>
  );
}

function ZmPagination({ current = 3, total = 24, perPage = 12, count = 1284 }) {
  const pages = [1, 2, 3, 4, '…', total];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, font: '500 13px var(--zm-font-body)' }}>
      <span style={{ color: 'var(--zm-fg-muted)', marginRight: 16 }}>
        Showing <span className="zm-num-tab" style={{ color: 'var(--zm-ink-950)', fontWeight: 600 }}>{(current - 1) * perPage + 1}–{Math.min(current * perPage, count)}</span> of <span className="zm-num-tab">{count.toLocaleString()}</span>
      </span>
      <ZmIconButton icon="chevron_left" size={34} variant="surface" />
      {pages.map((p, i) => (
        <button key={i} style={{
          minWidth: 34, height: 34, padding: '0 10px',
          border: '1px solid ' + (p === current ? 'var(--zm-ink-900)' : 'var(--zm-border)'),
          borderRadius: 'var(--zm-r-md)',
          background: p === current ? 'var(--zm-ink-900)' : 'var(--zm-white)',
          color: p === current ? 'var(--zm-paper)' : 'var(--zm-ink-950)',
          font: `${p === current ? 600 : 500} 13px var(--zm-font-body)`,
          cursor: typeof p === 'number' ? 'pointer' : 'default',
        }}>{p}</button>
      ))}
      <ZmIconButton icon="chevron_right" size={34} variant="surface" />
    </div>
  );
}

// ────────────────────────────────────────────────
// ZmAlert — inline contextual message
// ────────────────────────────────────────────────
function ZmAlert({ tone = 'info', title, children, icon, dismissible, action, style }) {
  const tones = {
    info:    { bg: 'var(--zm-sky-100)',    bd: 'var(--zm-sky-500)',  fg: 'var(--zm-sky-700)',  defaultIcon: 'sparkles' },
    success: { bg: 'var(--zm-success-bg)', bd: 'var(--zm-success)',  fg: 'var(--zm-success)',  defaultIcon: 'check' },
    warning: { bg: 'var(--zm-warning-bg)', bd: 'var(--zm-warning)',  fg: 'var(--zm-warning)',  defaultIcon: 'bell' },
    danger:  { bg: 'var(--zm-danger-bg)',  bd: 'var(--zm-danger)',   fg: 'var(--zm-danger)',   defaultIcon: 'close' },
  }[tone];
  return (
    <div style={{
      padding: '14px 16px', background: tones.bg,
      borderLeft: `3px solid ${tones.bd}`,
      borderRadius: 'var(--zm-r-md)',
      display: 'flex', gap: 12, alignItems: 'flex-start',
      ...style,
    }}>
      <ZmIcon name={icon || tones.defaultIcon} size={18} color={tones.fg} style={{ marginTop: 2, flexShrink: 0 }} />
      <div style={{ flex: 1, color: 'var(--zm-fg)' }}>
        {title && <div style={{ font: '600 14px var(--zm-font-body)', color: tones.fg, marginBottom: 2 }}>{title}</div>}
        <div style={{ font: '400 13px/1.5 var(--zm-font-body)' }}>{children}</div>
      </div>
      {action}
      {dismissible && <ZmIconButton icon="close" size={28} />}
    </div>
  );
}

// ────────────────────────────────────────────────
// ZmToast — floating notification (dark)
// ────────────────────────────────────────────────
function ZmToast({ tone = 'success', title, body, action, style }) {
  const tones = {
    success: { dot: 'var(--zm-success)', icon: 'check' },
    info:    { dot: 'var(--zm-sky-500)', icon: 'sparkles' },
    warning: { dot: 'var(--zm-warning)', icon: 'bell' },
    danger:  { dot: 'var(--zm-coral-500)', icon: 'close' },
  }[tone];
  return (
    <div style={{
      display: 'flex', gap: 12, alignItems: 'flex-start',
      padding: '14px 16px',
      background: 'var(--zm-ink-950)', color: 'var(--zm-paper)',
      borderRadius: 'var(--zm-r-md)',
      boxShadow: 'var(--zm-shadow-lg)',
      minWidth: 320, maxWidth: 460, ...style,
    }}>
      <div style={{
        width: 26, height: 26, borderRadius: 13,
        background: tones.dot, color: 'var(--zm-ink-950)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: 1,
      }}>
        <ZmIcon name={tones.icon} size={14} color="currentColor" stroke={2.5} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ font: '600 14px var(--zm-font-body)' }}>{title}</div>}
        {body && <div style={{ font: '400 13px/1.45 var(--zm-font-body)', color: 'var(--zm-fg-on-dark-muted)', marginTop: 2 }}>{body}</div>}
      </div>
      {action && <button style={{ background: 'transparent', border: 'none', color: 'var(--zm-gold-500)', font: '600 13px var(--zm-font-body)', cursor: 'pointer', whiteSpace: 'nowrap', padding: '0 4px' }}>{action}</button>}
    </div>
  );
}

// ────────────────────────────────────────────────
// ZmEmptyState
// ────────────────────────────────────────────────
function ZmEmptyState({ icon = 'inbox', title, body, action, style }) {
  return (
    <div style={{
      padding: 48, textAlign: 'center',
      border: '2px dashed var(--zm-border-strong)',
      borderRadius: 'var(--zm-r-lg)',
      background: 'transparent',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
      ...style,
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 32,
        background: 'var(--zm-ink-50)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--zm-fg-muted)',
      }}>
        <ZmIcon name={icon} size={30} stroke={1.4} />
      </div>
      <div style={{ font: '600 17px var(--zm-font-body)', marginTop: 6 }}>{title || 'No items found'}</div>
      {body && <div style={{ font: '400 14px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-muted)', maxWidth: 360 }}>{body}</div>}
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  );
}

// ────────────────────────────────────────────────
// ZmConfirmDialog — destructive confirmation
// ────────────────────────────────────────────────
function ZmConfirmDialog({ title, body, primaryLabel = 'Confirm', primaryTone = 'primary', cancelLabel = 'Cancel', tone = 'primary' }) {
  const iconTones = {
    danger:  { bg: 'var(--zm-danger-bg)',  fg: 'var(--zm-danger)',  icon: 'close' },
    warning: { bg: 'var(--zm-warning-bg)', fg: 'var(--zm-warning)', icon: 'bell' },
    primary: { bg: 'var(--zm-ink-50)',     fg: 'var(--zm-ink-700)', icon: 'check' },
  }[tone];
  return (
    <div style={{
      background: 'var(--zm-white)',
      borderRadius: 'var(--zm-r-lg)',
      padding: 28,
      maxWidth: 440, width: '100%',
      boxShadow: 'var(--zm-shadow-xl)',
      fontFamily: 'var(--zm-font-body)',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 22,
        background: iconTones.bg, color: iconTones.fg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <ZmIcon name={iconTones.icon} size={22} stroke={2} />
      </div>
      <h3 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 26, lineHeight: 1.1, letterSpacing: '-0.02em', margin: '18px 0 8px' }}>{title}</h3>
      <p style={{ font: '400 14px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-muted)', margin: 0 }}>{body}</p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 22 }}>
        <ZmButton variant="secondary">{cancelLabel}</ZmButton>
        <ZmButton variant={primaryTone}>{primaryLabel}</ZmButton>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// ZmDialog — generic modal shell
// ────────────────────────────────────────────────
function ZmDialog({ title, eyebrow, onClose, footer, width = 480, children, style }) {
  return (
    <div style={{
      background: 'var(--zm-white)', borderRadius: 'var(--zm-r-xl)',
      width, maxWidth: '100%',
      boxShadow: 'var(--zm-shadow-xl)', overflow: 'hidden',
      fontFamily: 'var(--zm-font-body)', ...style,
    }}>
      <div style={{ padding: '20px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          {eyebrow && <div className="zm-eyebrow">{eyebrow}</div>}
          {title && <h2 style={{ fontFamily: 'var(--zm-font-display)', fontSize: 28, letterSpacing: '-0.02em', margin: '6px 0 0' }}>{title}</h2>}
        </div>
        <ZmIconButton icon="close" size={32} />
      </div>
      <div style={{ padding: '20px 24px' }}>{children}</div>
      {footer && <div style={{ padding: '18px 24px', borderTop: '1px solid var(--zm-border)', background: 'var(--zm-paper)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>{footer}</div>}
    </div>
  );
}

// ────────────────────────────────────────────────
// ZmProgressBar
// ────────────────────────────────────────────────
function ZmProgressBar({ value = 0.4, label, tone = 'primary', size = 'md', style }) {
  const sz = { sm: 4, md: 6, lg: 10 }[size];
  const bg = { primary: 'var(--zm-ink-700)', gold: 'var(--zm-gold-500)', coral: 'var(--zm-coral-500)' }[tone];
  return (
    <div style={style}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', font: '500 12px var(--zm-font-body)', marginBottom: 6 }}>
          <span>{label}</span><span className="zm-num-tab" style={{ color: 'var(--zm-fg-muted)' }}>{Math.round(value * 100)}%</span>
        </div>
      )}
      <div style={{ height: sz, background: 'var(--zm-grey-200)', borderRadius: sz / 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value * 100}%`, background: bg, borderRadius: sz / 2 }} />
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// ZmStepper — wizard step indicator (horizontal)
// ────────────────────────────────────────────────
function ZmStepper({ steps = [], current = 0, style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, ...style }}>
      {steps.map((s, i) => {
        const active = i === current;
        const done = i < current;
        return (
          <React.Fragment key={i}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 12px', borderRadius: 'var(--zm-r-full)',
              background: active ? 'var(--zm-ink-900)' : 'transparent',
              color: active ? 'var(--zm-paper)' : done ? 'var(--zm-ink-700)' : 'var(--zm-fg-muted)',
              font: `${active ? 600 : 500} 13px var(--zm-font-body)`,
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: 11,
                background: active ? 'var(--zm-gold-500)' : done ? 'var(--zm-ink-700)' : 'var(--zm-paper-2)',
                color: active ? 'var(--zm-ink-950)' : done ? 'var(--zm-paper)' : 'var(--zm-fg-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                font: '600 11px var(--zm-font-mono)',
              }}>
                {done ? <ZmIcon name="check" size={12} /> : i + 1}
              </div>
              {s}
            </div>
            {i < steps.length - 1 && <span style={{ width: 14, height: 1, background: 'var(--zm-border)' }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ────────────────────────────────────────────────
// ZmTabs — horizontal tab bar
// ────────────────────────────────────────────────
function ZmTabs({ tabs = [], active, style }) {
  return (
    <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--zm-border)', ...style }}>
      {tabs.map((t, i) => (
        <button key={i} style={{
          padding: '12px 14px', border: 'none', background: 'transparent',
          font: `${t.id === active ? 600 : 500} 14px var(--zm-font-body)`,
          color: t.id === active ? 'var(--zm-ink-950)' : 'var(--zm-fg-muted)',
          cursor: 'pointer', position: 'relative',
          borderBottom: t.id === active ? '2px solid var(--zm-ink-950)' : '2px solid transparent',
          marginBottom: -1,
        }}>{t.label}{t.count != null && <span style={{ marginLeft: 6, font: '500 12px var(--zm-font-body)', color: 'var(--zm-fg-muted)' }}>{t.count}</span>}</button>
      ))}
    </div>
  );
}

Object.assign(window, {
  ZmInput, ZmTextarea, ZmSelect, ZmToggle, ZmCheckbox, ZmRadio,
  ZmField, ZmBreadcrumb, ZmPagination,
  ZmAlert, ZmToast, ZmEmptyState,
  ZmConfirmDialog, ZmDialog, ZmProgressBar, ZmStepper, ZmTabs,
});
