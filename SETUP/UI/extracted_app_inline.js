
    const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
      "accent": "#F2C94C",
      "tone": "warm-cream"
    }/*EDITMODE-END*/;

    function App() {
      const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

      // Theme switching via root CSS variables
      React.useEffect(() => {
        const root = document.documentElement;
        const accents = {
          '#F2C94C': { v: '#F2C94C', deep: '#C9A634', light: '#FCEFC4', xlight: '#FDF6DF' },
          '#E84A1F': { v: '#E84A1F', deep: '#C73E1D', light: '#FBE0D5', xlight: '#FDEDE3' },
          '#3C8AC0': { v: '#3C8AC0', deep: '#1E4B68', light: '#D9E8F3', xlight: '#EAF2F9' },
          '#8B5BC7': { v: '#8B5BC7', deep: '#5E3491', light: '#E4D6F2', xlight: '#F2EAF9' },
        };
        const a = accents[t.accent] || accents['#F2C94C'];
        root.style.setProperty('--zm-gold-500', a.v);
        root.style.setProperty('--zm-gold-700', a.deep);
        root.style.setProperty('--zm-gold-200', a.light);
        root.style.setProperty('--zm-gold-100', a.xlight);

        const tones = {
          'warm-cream':  { paper: '#F5F1E8', p2: '#EDE7D8', p3: '#E3DBC6', border: '#DDD7C7', bdr: '#C5BFB0' },
          'cool-white':  { paper: '#F6F7F4', p2: '#EEEFEC', p3: '#E2E3DF', border: '#D8DAD3', bdr: '#BFC2BB' },
          'deep-canvas': { paper: '#11211A', p2: '#0B0F0D', p3: '#163524', border: 'rgba(245,241,232,0.14)', bdr: 'rgba(245,241,232,0.22)' },
        };
        const tn = tones[t.tone] || tones['warm-cream'];
        root.style.setProperty('--zm-paper', tn.paper);
        root.style.setProperty('--zm-paper-2', tn.p2);
        root.style.setProperty('--zm-paper-3', tn.p3);
        root.style.setProperty('--zm-border', tn.border);
        root.style.setProperty('--zm-border-strong', tn.bdr);
      }, [t.accent, t.tone]);

      return (
        <>
          <DesignCanvas>
            {/* ── 01 · Brand identity ─────────────────────────── */}
            <DCSection id="brand" title="01 · Brand"
              subtitle="Zeemic — the market for everyone who works. New identity built for the marketplace overhaul.">
              <DCArtboard id="zm-brand" label="Brand · hero" width={1100} height={720}>
                <ZmBrandCard />
              </DCArtboard>
              <DCArtboard id="zm-logo" label="Mark studies" width={900} height={720}>
                <ZmLogoStudiesCard />
              </DCArtboard>
            </DCSection>

            {/* ── 02 · Design system ──────────────────────────── */}
            <DCSection id="system" title="02 · Design system"
              subtitle="Tokens · color · type · components. Every screen below is built on these primitives.">
              <DCArtboard id="zm-color" label="Color" width={760} height={680}>
                <ZmColorCard />
              </DCArtboard>
              <DCArtboard id="zm-type" label="Type" width={760} height={720}>
                <ZmTypeCard />
              </DCArtboard>
              <DCArtboard id="zm-comp" label="Components" width={760} height={680}>
                <ZmComponentsCard />
              </DCArtboard>
            </DCSection>

            {/* ── 03 · Marketplace surfaces (desktop) ─────────── */}
            <DCSection id="marketplace" title="03 · Marketplace surfaces"
              subtitle="The Exchange hub + standalone listing pages. Public-facing, marketing-grade hi-fi. 1440 wide.">
              <DCArtboard id="exchange" label="Exchange hub (/exchange)" width={1440} height={3650}>
                <ZmExchangeHub />
              </DCArtboard>
              <DCArtboard id="skills-list" label="Skills listing (/skills)" width={1440} height={2240}>
                <ZmSkillsListing />
              </DCArtboard>
              <DCArtboard id="skill-detail" label="Skill detail (/skills/[slug])" width={1440} height={2050}>
                <ZmSkillDetail />
              </DCArtboard>
              <DCArtboard id="recruiters-list" label="Recruiters listing (/recruiters)" width={1440} height={1380}>
                <ZmRecruitersListing />
              </DCArtboard>
              <DCArtboard id="recruiter-profile" label="Recruiter profile (/recruiter/[slug])" width={1440} height={1750}>
                <ZmRecruiterProfile />
              </DCArtboard>
              <DCArtboard id="jobs-list" label="Jobs listing (/jobs)" width={1440} height={1500}>
                <ZmJobsListing />
              </DCArtboard>
              <DCArtboard id="business-profile" label="Business profile (/business/[slug])" width={1440} height={3760}>
                <ZmBusinessProfile />
              </DCArtboard>
            </DCSection>

            {/* ── 04 · Dashboards (desktop) ───────────────────── */}
            <DCSection id="dashboards" title="04 · Dashboards"
              subtitle="Dual-context account model. Personal dashboard (skills, leads, applications) and Business dashboard (listings, team, recruiters).">
              <DCArtboard id="user-dash" label="User Dashboard (/dashboard)" width={1440} height={1200}>
                <ZmUserDashboard />
              </DCArtboard>
              <DCArtboard id="leads-inbox" label="Leads inbox (/dashboard/leads)" width={1440} height={1000}>
                <ZmLeadsInbox />
              </DCArtboard>
              <DCArtboard id="skill-create" label="Skill create wizard (/dashboard/skills/new)" width={1440} height={1500}>
                <ZmSkillCreate />
              </DCArtboard>
              <DCArtboard id="biz-dash" label="Business Dashboard (/b/[id])" width={1440} height={1200}>
                <ZmBusinessDashboard />
              </DCArtboard>
              <DCArtboard id="biz-recruiters" label="Business · recruiters team" width={1440} height={900}>
                <ZmBusinessRecruiters />
              </DCArtboard>
              <DCArtboard id="notifs-page" label="Notifications centre" width={1440} height={1200}>
                <ZmNotificationsPage />
              </DCArtboard>
            </DCSection>

            {/* ── 05 · Overlays ───────────────────────────────── */}
            <DCSection id="overlays" title="05 · Overlays & flows"
              subtitle="Account switcher · bell dropdown · booking drawer. The transactional moments.">
              <DCArtboard id="bell" label="Notification bell dropdown" width={1100} height={520}>
                <ZmBellDropdown />
              </DCArtboard>
              <DCArtboard id="switcher" label="Account switcher" width={900} height={620}>
                <ZmAccountSwitcher />
              </DCArtboard>
              <DCArtboard id="booking" label="Booking drawer" width={900} height={820}>
                <ZmBookingDrawer />
              </DCArtboard>
            </DCSection>

            {/* ── 06 · Mobile ─────────────────────────────────── */}
            <DCSection id="mobile" title="06 · Mobile"
              subtitle="iPhone-sized flows. Bottom nav + sticky action bars + horizontal carousels for vertical rows.">
              <DCArtboard id="m-exchange" label="Exchange hub · mobile" width={390} height={844}>
                <ZmMobileExchange />
              </DCArtboard>
              <DCArtboard id="m-skills" label="Skills listing · mobile" width={390} height={844}>
                <ZmMobileSkillsListing />
              </DCArtboard>
              <DCArtboard id="m-skill" label="Skill detail · mobile" width={390} height={844}>
                <ZmMobileSkillDetail />
              </DCArtboard>
              <DCArtboard id="m-dash" label="User dashboard · mobile" width={390} height={844}>
                <ZmMobileDashboard />
              </DCArtboard>
              <DCArtboard id="m-switch" label="Account switcher · mobile" width={390} height={844}>
                <ZmMobileAccountSwitcher />
              </DCArtboard>
            </DCSection>
          </DesignCanvas>

          <TweaksPanel title="Zeemic tweaks">
            <TweakSection label="Brand accent" />
            <TweakColor label="Accent color" value={t.accent}
              onChange={v => setTweak('accent', v)}
              options={['#F2C94C', '#E84A1F', '#3C8AC0', '#8B5BC7']} />
            <TweakSection label="Surface tone" />
            <TweakRadio label="Paper" value={t.tone}
              onChange={v => setTweak('tone', v)}
              options={['warm-cream', 'cool-white', 'deep-canvas']} />
          </TweaksPanel>
        </>
      );
    }
    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  