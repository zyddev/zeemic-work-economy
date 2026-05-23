<template>
  <footer :style="{ background: 'var(--zm-ink-950)', color: 'var(--zm-fg-on-dark)', padding: '80px 80px 48px', marginTop: '32px' }">
    <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '80px' }">
      <div :style="{ maxWidth: '480px' }">
        <ZmWordmark :height="28" color="var(--zm-paper)" />
        <p :style="{ fontFamily: 'var(--zm-font-display)', fontSize: '36px', lineHeight: '1.05', letterSpacing: '-0.02em', marginTop: '28px' }">The market for everyone who works.</p>
        <p :style="{ font: '400 14px/1.5 var(--zm-font-body)', color: 'var(--zm-fg-on-dark-muted)', marginTop: '16px' }">Berlin · New York · Accra · Kigali — bridging African talent with global demand.</p>
      </div>
      <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(4, 140px)', gap: '24px', font: '500 13px var(--zm-font-body)' }">
        <div v-for="col in [['Marketplace','Skills','Recruiters','Jobs','Businesses'],['Sell','List a skill','Become a recruiter','Create a business','Pricing'],['Company','About','Blog','Press','Careers'],['Trust','Guidelines','Terms','Policies','Contact']]" :key="col[0]">
          <div :style="{ color: 'var(--zm-gold-500)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '11px', marginBottom: '14px' }">{{ col[0] }}</div>
          <div v-for="item in col.slice(1)" :key="item" :style="{ color: 'var(--zm-fg-on-dark-muted)', padding: '6px 0', cursor: 'pointer' }">{{ item }}</div>
        </div>
      </div>
    </div>
    <div :style="{ borderTop: '1px solid var(--zm-border-on-dark)', marginTop: '64px', paddingTop: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }">
      <span :style="{ font: '400 12px var(--zm-font-mono)', color: 'var(--zm-fg-on-dark-muted)' }">© 2026 Zeemic Inc. · All work, transacted.</span>
      <div :style="{ display: 'flex', gap: '16px', font: '400 12px var(--zm-font-body)', color: 'var(--zm-fg-on-dark-muted)' }">
        <span>EN</span><span>·</span><span>FR</span><span>·</span><span>DE</span><span>·</span><span>PT</span>
      </div>
    </div>
  </footer>
</template>
