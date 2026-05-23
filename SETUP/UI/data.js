/* Sample data used across Zeemic screens. Realistic names, copy, prices. */

const ZM_USER = { name: 'Enoch Boison', handle: '@enochboison', location: 'Accra, Ghana' };

const ZM_BUSINESSES = [
  { name: 'Northwind Studio', tag: 'Design agency', location: 'Berlin, DE', members: 24, listings: 18, rating: 4.8 },
  { name: 'Helio Capital',    tag: 'Venture firm',  location: 'New York, US', members: 8,  listings: 4,  rating: 4.6 },
  { name: 'Pangea Labs',      tag: 'Engineering',   location: 'Kigali, RW',   members: 41, listings: 32, rating: 4.9 },
  { name: 'Brightline Legal', tag: 'Law firm',      location: 'Lagos, NG',    members: 12, listings: 6,  rating: 4.7 },
];

const ZM_SKILLS = [
  {
    id: 'ux-research',
    title: 'UX Research & Usability Testing',
    seller: 'Enoch Boison', location: 'Accra, Ghana',
    category: 'Design', delivery: 'Remote',
    price: 150, unit: '/hr', rating: 4.8, reviews: 12,
    blurb: 'Five-day moderated study with a tagged highlight reel and stakeholder readout.',
    available: 'Now', motif: 0,
    tags: ['Figma', 'Maze', 'Lookback', 'B2B', 'SaaS'],
  },
  {
    id: 'fin-modelling',
    title: 'Series A Financial Model — 5-day build',
    seller: 'Adaeze Okoye', location: 'Lagos, NG',
    category: 'Finance', delivery: 'Remote',
    price: 2400, unit: '/project', rating: 4.9, reviews: 27,
    blurb: 'Bottoms-up forecast, capital efficiency cohort, and a board-ready pitch tab.',
    available: 'Now', motif: 1,
    tags: ['Excel', 'Sheets', 'Pitch decks'],
  },
  {
    id: 'sap-impl',
    title: 'SAP S/4HANA Implementation Sprint',
    seller: 'Markus Faber', location: 'Frankfurt, DE',
    category: 'Engineering', delivery: 'Hybrid',
    price: null, unit: 'RFQ', rating: 4.7, reviews: 8,
    blurb: 'Phased migration playbook for mid-market manufacturers. Includes user enablement.',
    available: '2 weeks', motif: 2,
    tags: ['SAP', 'S/4HANA', 'Migration', 'EU'],
  },
  {
    id: 'legal-review',
    title: 'Commercial Contract Review — per doc',
    seller: 'Brightline Legal', location: 'Lagos, NG',
    category: 'Legal', delivery: 'Remote',
    price: 320, unit: '/doc', rating: 4.6, reviews: 41,
    blurb: 'Plain-English redline with negotiation flags and a recorded walkthrough.',
    available: 'Now', motif: 3, isBusiness: true,
    tags: ['SaaS contracts', 'MSAs', 'NDAs'],
  },
  {
    id: 'brand-sprint',
    title: 'Brand Identity Sprint — naming to logo',
    seller: 'Northwind Studio', location: 'Berlin, DE',
    category: 'Design', delivery: 'Remote',
    price: 8500, unit: '/project', rating: 5.0, reviews: 9,
    blurb: 'Four-week engagement: positioning, naming workshop, mark, system, and brand book.',
    available: 'Now', motif: 2, isBusiness: true,
    tags: ['Branding', 'Naming', 'Identity'],
  },
  {
    id: 'data-platform',
    title: 'Modern Data Platform Setup — Snowflake + dbt',
    seller: 'Kwesi Mensah', location: 'Accra, Ghana',
    category: 'Data', delivery: 'Remote',
    price: 4200, unit: '/project', rating: 4.8, reviews: 14,
    blurb: 'Ingestion to dashboard in two weeks. Trained dbt models, lineage, and on-call docs.',
    available: 'Now', motif: 3,
    tags: ['Snowflake', 'dbt', 'Fivetran'],
  },
  {
    id: 'go-to-market',
    title: 'B2B Go-to-Market Playbook',
    seller: 'Sade Adeyemi', location: 'London, UK',
    category: 'Marketing', delivery: 'Remote',
    price: 180, unit: '/hr', rating: 4.7, reviews: 22,
    blurb: 'ICP map, pricing experiments, and a 90-day pipeline plan you can hand to a team.',
    available: 'Now', motif: 1,
    tags: ['B2B', 'Pricing', 'GTM'],
  },
  {
    id: 'ed-curric',
    title: 'STEM Curriculum Design — secondary level',
    seller: 'Hawa Diallo', location: 'Kigali, RW',
    category: 'Education', delivery: 'Hybrid',
    price: 90, unit: '/hr', rating: 4.9, reviews: 33,
    blurb: 'WAEC/IGCSE-aligned lesson sequences with formative assessment rubrics.',
    available: 'Now', motif: 0,
    tags: ['Education', 'WAEC', 'STEM'],
  },
];

const ZM_RECRUITERS = [
  {
    id: 'jane-smith', name: 'Jane Smith', title: 'Senior Technical Recruiter',
    business: 'Pangea Labs', location: 'Berlin, DE',
    specialties: ['Engineering', 'Product'], placements: 24, rating: 4.9, reviews: 18,
    response: '< 4hr', languages: ['EN', 'DE'],
    quote: 'I source senior engineers across EU and West Africa. Specialised in platform and infra roles.',
  },
  {
    id: 'malik-ndiaye', name: 'Malik Ndiaye', title: 'Head of Talent — Africa',
    business: 'Helio Capital', location: 'Dakar, SN',
    specialties: ['Executive', 'Finance'], placements: 38, rating: 4.8, reviews: 22,
    response: '< 24hr', languages: ['EN', 'FR'],
    quote: 'I place founders, CFOs, and growth leaders into venture-backed companies across the continent.',
  },
  {
    id: 'priya-rao', name: 'Priya Rao', title: 'Design & Product Recruiter',
    business: 'Northwind Studio', location: 'Lisbon, PT',
    specialties: ['Design', 'Product'], placements: 31, rating: 4.9, reviews: 26,
    response: '< 4hr', languages: ['EN', 'PT'],
    quote: 'Specialist in senior IC and lead roles for product design teams shipping consumer software.',
  },
  {
    id: 'tomi-adekola', name: 'Tomi Adekola', title: 'Sales & Growth Recruiter',
    business: 'Pangea Labs', location: 'Lagos, NG',
    specialties: ['Sales', 'Growth'], placements: 19, rating: 4.7, reviews: 12,
    response: '< 8hr', languages: ['EN'],
    quote: 'Building outbound and enterprise sales teams for B2B SaaS scaling into West Africa.',
  },
];

const ZM_JOBS = [
  {
    id: 'sr-ux',
    title: 'Senior UX Designer',
    company: 'Northwind Studio', location: 'Berlin, DE · Remote',
    type: 'Full-time', salary: '€80–100k',
    deadline: 'Jun 30, 2026',
    recruiter: 'Priya Rao',
    posted: '2 days ago',
  },
  {
    id: 'product-eng',
    title: 'Staff Product Engineer',
    company: 'Pangea Labs', location: 'Kigali, RW · Hybrid',
    type: 'Full-time', salary: '$110–140k',
    deadline: 'Jul 10, 2026',
    recruiter: 'Jane Smith',
    posted: '4 days ago',
  },
  {
    id: 'cfo-search',
    title: 'CFO — Series B fintech',
    company: 'Helio Capital portfolio', location: 'Lagos, NG · Onsite',
    type: 'Executive', salary: 'Confidential',
    deadline: 'Open',
    recruiter: 'Malik Ndiaye',
    posted: '1 week ago',
  },
  {
    id: 'gtm-lead',
    title: 'Head of GTM — West Africa',
    company: 'Pangea Labs', location: 'Accra, GH · Remote',
    type: 'Full-time', salary: '$95–125k',
    deadline: 'Jul 1, 2026',
    recruiter: 'Tomi Adekola',
    posted: '3 days ago',
  },
];

const ZM_LEADS = [
  {
    id: 'l1', type: 'booking', status: 'new',
    skill: 'UX Research & Usability Testing',
    fromName: 'Acme Corp', contact: 'John Doe', email: 'john@acme.com', phone: '+1 555 0101',
    when: '2 hours ago',
    dates: 'Jun 5 – 7, 2026', budget: '$2,000 – $3,000',
    message: 'We need a 3-day moderated study with 8 participants for a fintech onboarding flow. Timing is firm.',
  },
  {
    id: 'l2', type: 'rfq', status: 'new',
    skill: 'UX Research & Usability Testing',
    fromName: 'TechStart Ltd', contact: 'Sarah Kim', email: 'sarah@techstart.io',
    when: '2 days ago',
    budget: '$500 – $2,000', timeline: 'Within 2 weeks',
    message: 'Looking for a quick heuristic review of our checkout. Open to packaging suggestions.',
  },
  {
    id: 'l3', type: 'lead', status: 'viewed',
    skill: 'UX Research & Usability Testing',
    fromName: 'Anonymous', contact: 'tlee@northbay.co',
    when: '5 days ago',
    message: 'Considering a Q3 engagement — would love to chat.',
  },
  {
    id: 'l4', type: 'brochure', status: 'viewed',
    skill: 'UX Research & Usability Testing',
    fromName: 'GreenHouse Health', contact: 'priya.r@greenhouse.health',
    when: '6 days ago',
  },
  {
    id: 'l5', type: 'proposal', status: 'responded',
    skill: 'UX Research & Usability Testing',
    fromName: 'Olin Bank', contact: 'k.afia@olinbank.com',
    when: 'Last week',
  },
];

const ZM_NOTIFS = [
  { type: 'booking', title: 'New booking — Product Design Sprint', body: 'Acme Corp booked 3 days · Jun 5 – 7 · $2,400', time: '2h', unread: true, actor: 'Acme Corp' },
  { type: 'application', title: 'Application moved to Shortlisted', body: 'Senior Designer at Northwind Studio', time: '1d', unread: true, actor: 'Northwind Studio' },
  { type: 'message', title: 'New message from John Doe', body: '"Hi, I saw your UX Research listing…"', time: '3d', unread: false, actor: 'John Doe' },
  { type: 'review', title: 'New ★ 5 review', body: 'Adaeze left a review on Financial Modelling', time: '5d', unread: false, actor: 'Adaeze O.' },
];

Object.assign(window, { ZM_USER, ZM_BUSINESSES, ZM_SKILLS, ZM_RECRUITERS, ZM_JOBS, ZM_LEADS, ZM_NOTIFS });
