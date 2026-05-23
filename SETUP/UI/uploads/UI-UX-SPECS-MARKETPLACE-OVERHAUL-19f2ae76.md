# UI/UX Specification — Zeemic Transactional Marketplace Overhaul
**Version:** 1.1  
**Date:** 2026-05-21  
**Status:** Draft for Review  
**Prepared by:** Product Design (Claude Code assist)

---

## Table of Contents

1. [Vision & Strategic Shift](#1-vision--strategic-shift)
2. [Scope — What Changes, What Stays, What Goes](#2-scope)
3. [Information Architecture](#3-information-architecture)
4. [Global Layout & Navigation](#4-global-layout--navigation)
5. [Authentication & Onboarding](#5-authentication--onboarding)
6. [Account System — Dual Dashboard](#6-account-system--dual-dashboard)
7. [User Dashboard (New)](#7-user-dashboard-new)
8. [Business Dashboard (Overhauled)](#8-business-dashboard-overhauled)
9. [Notifications — Unified Centre](#9-notifications--unified-centre)
10. [Messaging — Business Account Support](#10-messaging--business-account-support)
11. [Marketplace — Exchange Hub Page](#11-marketplace--exchange-hub-page)
12. [Jobs Vertical (Existing → Updated)](#12-jobs-vertical)
13. [Skills Vertical (New)](#13-skills-vertical-new)
    - 13.1 Overview
    - 13.2 Skills Standalone Listing Page (`/skills`)
    - 13.3 Exchange Hub Preview Row
    - 13.4 Skill Card
    - 13.5 Skill Detail Page (`/skills/[slug]`)
    - 13.6 Skill Create/Edit Form
    - 13.7 Transactional CTAs — Behaviour
14. [Recruiter Vertical (New)](#14-recruiter-vertical-new)
    - 14.1 Overview
    - 14.2 Recruiters Standalone Listing Page (`/recruiters`)
    - 14.3 Exchange Hub Preview Row
    - 14.4 Recruiter Card
    - 14.5 Recruiter Public Profile (`/recruiter/[slug]`)
    - 14.6 Recruiter Create/Edit Form
    - 14.7 Business Dashboard Management
15. [Business Directory Vertical (Existing → Updated)](#15-business-directory-vertical)
    - 15.1 Business Directory Standalone Page (`/businesses`)
    - 15.2 Exchange Hub Preview Row
    - 15.3 Business Card Update
16. [Public Profile Pages](#16-public-profile-pages)
17. [Transactional Flows](#17-transactional-flows)
18. [Intelligence Dashboard (Carry-forward)](#18-intelligence-dashboard)
19. [Design System Notes](#19-design-system-notes)
20. [New Data Models](#20-new-data-models)
21. [Feature Flag Registry](#21-feature-flag-registry)

---

## 1. Vision & Strategic Shift

### From: Content + Career Board
Zeemic currently functions as a combination social feed (Posts), jobs board (Jobs), and a loosely connected marketplace (Exchange) with no transactional layer.

### To: Transactional Work Economy Marketplace
Zeemic becomes a **transactional marketplace for the work economy** — a platform where talent, businesses, and recruiters exchange value through structured commerce: skill bookings, proposals, quotes, and job placements.

**Core pillars after overhaul:**

| Pillar | Description |
|---|---|
| **Skill Commerce** | Individuals list skills as services; buyers book, request quotes, download brochures, and submit leads |
| **Talent Discovery** | Recruiters are discoverable entities; businesses browse and hire recruiting talent |
| **Job Market** | Job listings remain — enhanced with transactional apply + recruiter linkage |
| **Business Presence** | Businesses maintain public profiles and manage teams, recruiters, and listings |
| **Intelligence Layer** | AI-powered career and market signals, unchanged |

### Key Principles
- **Transactional first** — every listing type has a primary CTA that captures intent (book, quote, apply, download, contact)
- **Dual-context accounts** — every authenticated user can operate as an individual (user dashboard) or as a business (business dashboard), switchable at any time
- **Marketplace parity** — Skills and Recruiter verticals follow the same UX patterns as Jobs (filter chips, infinite scroll, detail panel, rating/review)
- **No social feed** — the Posts/feed vertical is discontinued; engagement happens through transactional interactions, not social content

---

## 2. Scope

### 2.1 Discontinued
| Feature | Route | Action |
|---|---|---|
| Posts feed | `/posts` | Remove entirely |
| Post creation | modal | Remove |
| Stories carousel | in posts page | Remove |
| Post-related components | `components/post/*` | Deprecate |
| "Post" nav tab (mobile + desktop) | `ZydAppsComponent` | Remove |

### 2.2 New
| Feature | Route | Notes |
|---|---|---|
| Exchange hub page | `/exchange` | Multi-section discovery hub with "View More" per vertical |
| Skills standalone listing | `/skills` | Full searchable skills listing page |
| Skill detail page | `/skills/[slug]` | Booking, RFQ, proposal, brochure, lead form |
| Recruiters standalone listing | `/recruiters` | Full searchable recruiter listing page |
| Recruiter profile | `/recruiter/[slug]` | Public recruiter page |
| Recruiter creation | `/b/[businessId]/team/recruiters/new` | Within business dashboard |
| Business directory standalone | `/businesses` | Full searchable business directory page |
| User dashboard | `/dashboard` | New — for individual users |
| Skill management (user) | `/dashboard/skills` | User creates + manages their skills |
| Lead inbox (user) | `/dashboard/leads` | User sees inbound leads, RFQs, bookings |
| Messages (business) | `/b/[businessId]/messages` | Business inbox with routing |
| Notifications (business) | `/b/[businessId]/notifications` | Business notification centre |
| Account switcher | global UI | Switch User ↔ Business contexts |

### 2.3 Carry Forward (Unchanged or Minor Update)
| Feature | Changes |
|---|---|
| Jobs listing `/jobs` | Canonical at `/jobs`; also shown in Exchange hub preview row |
| Job detail `/jobs/[id]` | Minor: show linked recruiter card |
| Exchange page `/exchange` | Overhauled to hub/discovery model — preview rows + "View More" per vertical |
| Intelligence `/intelligence` | No change |
| User profile `/user/profile/[username]` | Add Skills tab, remove Posts count |
| Auth flows (`/login`, `/signup`, `/auth/verify`) | No change |
| Messaging `/messages` | Extend for business accounts |
| Notifications `/notifications/[username]` | Extend for business context |

---

## 3. Information Architecture

### 3.1 Route Map (Post-Overhaul)

```
/                         → Landing page (marketing)
/login                    → Email OTC login
/signup                   → Registration
/auth/verify              → OTC verification
/onboarding               → Profile setup wizard

/dashboard                → User Dashboard home (new)
/dashboard/skills         → My skills listings
/dashboard/leads          → Inbound leads / RFQs / booking requests
/dashboard/applications   → Job applications (moved from profile)
/dashboard/messages       → Personal direct messages (alias of /messages)
/dashboard/settings       → Account settings

/exchange                 → Marketplace hub — preview rows per vertical + "View More" per section

/jobs                     → Full jobs listing page (canonical)
/jobs/[jobId]             → Job detail page

/skills                   → Full skills listing page (standalone, new)
/skills/[slug]            → Skill detail page (new)

/recruiters               → Full recruiters listing page (standalone, new)
/recruiter/[slug]         → Recruiter public profile (new)

/businesses               → Full business directory page (standalone, new)
/business/[slug]          → Business public profile

/products                 → Products & Services listing (standalone)
/stores                   → Stores listing (standalone)
/projects                 → Projects listing (standalone)
/portfolios               → Portfolios listing (standalone)
  — /posts removed —

/messages                 → User direct messages hub
/messages/[conversationId]→ Conversation thread

/notifications/[username] → User notification centre
/intelligence             → Career intelligence dashboard

/user/profile/[username]  → Public user profile

/business/account         → Business account selector / creator
/b/[businessId]           → Business dashboard home
/b/[businessId]/listings  → Manage all listings (jobs, skills)
/b/[businessId]/team      → Team management
/b/[businessId]/team/recruiters     → Recruiter profiles on this business
/b/[businessId]/team/recruiters/new → Create recruiter profile
/b/[businessId]/messages  → Business messages inbox (new)
/b/[businessId]/notifications       → Business notification centre (new)
/b/[businessId]/leads     → Business inbound leads
/b/[businessId]/analytics → Business analytics

/b/invite/[inviteId]      → Team invite acceptance

/guidelines               → Trust & safety
/terms                    → Terms
/policies/*               → Policy pages
```

### 3.2 Navigation Priority Order

**Primary nav (desktop header + mobile bottom bar):**
1. Exchange / Marketplace (hub)
2. Dashboard (context-aware: User or Business)
3. Messages
4. Notifications
5. Intelligence

**Removed from nav:** Posts

---

## 4. Global Layout & Navigation

### 4.1 Header (`ZydHeaderComponent`)

**Current:** Logo | Desktop nav tabs | User avatar + dropdown

**Updated:**

```
[ Logo ]   [ Exchange | Dashboard | Messages | Intelligence ]   [ 🔔 Bell | Avatar ▾ ]
```

- **Notification bell (🔔):** New — shows unread count badge; tapping opens notification dropdown (top-5 preview) or navigates to `/notifications/[username]`
- **Avatar dropdown:** Updated options:
  - My Dashboard
  - Switch to Business: [Business Name] (if user has businesses)
  - Intelligence
  - Settings
  - Sign Out
- **Context indicator:** When operating in business context, a subtle chip below the logo or inline in header reads: `Business: [Name]` with a "Switch" link

**Mobile bottom nav tabs (updated):**
```
[ Exchange ]  [ Dashboard ]  [ Messages ]  [ Notifications ]  [ Intelligence ]
```
- Exchange replaces generic Listings
- Dashboard replaces Posts
- Notifications replaces the old empty slot

### 4.2 Context Awareness

The header and nav must react to the active context (user vs business). The context is stored in global state (Pinia) and persists across navigation.

| Context | Dashboard Link | Message Route | Notification Route |
|---|---|---|---|
| User | `/dashboard` | `/messages` | `/notifications/[username]` |
| Business | `/b/[businessId]` | `/b/[businessId]/messages` | `/b/[businessId]/notifications` |

### 4.3 Account Switcher UI

The account switcher is a persistent mechanism to toggle between personal (user) context and business context.

**Trigger:** Avatar dropdown → "Switch to Business" or "Switch to Personal"

**Switcher Modal / Panel:**
```
┌─────────────────────────────────────────┐
│  Select Account Context                 │
│                                         │
│  ● Personal Account                     │
│    Enoch Boison · @enochboison          │
│                                         │
│  ○ Business Account                     │
│    [Business Logo] Zeemic Ltd           │
│    Owner                                │
│    [Select]                             │
│                                         │
│  ○ Business Account                     │
│    [Logo] Acme Corp                     │
│    Member                               │
│    [Select]                             │
│                                         │
│  + Create New Business                  │
└─────────────────────────────────────────┘
```

- Radio-style selection — only one active context at a time
- Selected context persists in Pinia store (`activeContextStore`)
- Switching business context navigates to that business's dashboard
- Switching back to personal navigates to `/dashboard`

---

## 5. Authentication & Onboarding

### 5.1 No Change to Auth Flow
Login (`/login` → `/auth/verify`) and signup (`/signup`) flows are unchanged.

### 5.2 Onboarding Wizard Update
The `/onboarding` wizard currently collects career-intelligence profile data (skills, role, industries, salary). After overhaul, add **one new step**:

**Step N+1 — Account Type:**
```
┌──────────────────────────────────────────────┐
│  How will you primarily use Zeemic?          │
│                                              │
│  ○ As a professional — sell skills, apply   │
│    to jobs, manage my career                 │
│                                              │
│  ○ As a business — post jobs, discover      │
│    talent, manage a recruiting team          │
│                                              │
│  (You can do both — switch anytime)          │
│                                              │
│               [ Get Started → ]             │
└──────────────────────────────────────────────┘
```

- "As a professional" → redirect to `/dashboard` on completion
- "As a business" → redirect to `/business/account` (business creator) on completion
- No functional gatekeeping — both paths available at any time

---

## 6. Account System — Dual Dashboard

### 6.1 Design Philosophy
Every authenticated user has **two dashboard contexts**:
- **User Dashboard** — individual workspace (skills, leads, applications, personal messages)
- **Business Dashboard** — organizational workspace (team, listings, business messages, leads, analytics)

Users without businesses see only the User Dashboard. The Business Dashboard becomes available once a business is created.

### 6.2 Switching Flow
1. User is on User Dashboard (`/dashboard`)
2. Opens avatar dropdown → "Switch to Business"
3. Switcher panel opens (see §4.3)
4. Selects a business → context switches, nav updates, navigates to `/b/[businessId]`
5. All nav links now route to business routes
6. To switch back: avatar dropdown → "Switch to Personal"

### 6.3 Visual Differentiation

| Element | User Context | Business Context |
|---|---|---|
| Header left accent | None / personal avatar | Business logo (32×32px circular) |
| "Dashboard" nav label | "My Dashboard" | "[Business Name]" |
| Avatar dropdown header | Enoch Boison · Personal | [Business Name] · Business |
| Notification badge source | Personal notifications | Business notifications |
| Message link target | `/messages` | `/b/[id]/messages` |

---

## 7. User Dashboard (New)

**Route:** `/dashboard`  
**Layout:** `zyd-header-component` with dashboard sidebar  
**Auth:** Required

### 7.1 Layout

```
┌──────────────────────────────────────────────────────────┐
│ HEADER                                                   │
├────────────┬─────────────────────────────────────────────┤
│            │                                             │
│  SIDEBAR   │  MAIN CONTENT AREA                          │
│            │                                             │
│  Overview  │  (changes per sidebar selection)            │
│  Skills    │                                             │
│  Leads     │                                             │
│  Applied   │                                             │
│  Messages  │                                             │
│  Settings  │                                             │
│            │                                             │
└────────────┴─────────────────────────────────────────────┘
```

**Sidebar (collapsible on mobile):**
- Overview
- My Skills
- Leads & Inquiries
- Job Applications
- Messages
- Intelligence (link to `/intelligence`)
- Settings

### 7.2 Overview Tab

**Stats row (4 cards):**
```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│  Skills  │ │  Leads   │ │ Bookings │ │ Messages │
│    3     │ │   12     │ │    2     │ │    4 new │
│ active   │ │ this mo  │ │ pending  │ │ unread   │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
```

**Recent activity feed (right side or below stats on mobile):**
- Timeline of: new lead, booking request, RFQ received, message received, application status change
- Each item: icon + description + timestamp + CTA link

**Quick actions (top right of overview):**
```
[ + Add Skill ]   [ View Leads ]   [ Go to Intelligence ]
```

### 7.3 My Skills Tab (`/dashboard/skills`)

Lists the user's own skill listings. Mirrors the public Skills vertical but shows manage actions.

**Header:**
```
My Skills                        [ + Create New Skill ]
3 active · 1 draft · 0 archived
```

**Skill cards (grid):**
```
┌─────────────────────────────────┐
│ [Category tag]                  │
│                                 │
│  UX Research & Usability Testing│
│  by Enoch Boison                │
│                                 │
│  From $150/hr · ★ 4.8 (12)     │
│                                 │
│  12 views · 3 inquiries         │
│                                 │
│  [Edit]  [View Public]  [•••]   │
│          Active ●               │
└─────────────────────────────────┘
```

**Status states:** Active | Draft | Paused | Archived

**••• menu:** Edit · Duplicate · Pause / Activate · Archive · Delete

**Skill create/edit:** Full-page form (see §13.6 for form spec)

### 7.4 Leads & Inquiries Tab (`/dashboard/leads`)

Consolidated inbox for all inbound transactional signals from the user's skill listings.

**Filter chips (horizontal):**
```
[ All ]  [ Bookings ]  [ RFQ ]  [ Proposals ]  [ Lead Forms ]  [ Brochure Downloads ]
```

**Lead list (left) + Detail panel (right, desktop):**

```
┌───────────────────────┬─────────────────────────────────┐
│ LEAD LIST             │ LEAD DETAIL                     │
│                       │                                 │
│ ● Booking Request     │  Booking — Product Design Sprint│
│   Acme Corp           │  From: Acme Corp                │
│   Product Design      │  Contact: John Doe              │
│   2h ago              │  john@acme.com · +1 555 0101    │
│                       │                                 │
│ ● RFQ                 │  Skill: Product Design Sprint   │
│   TechStart Ltd       │  Requested dates: Jun 5–7, 2026 │
│   2 days ago          │  Budget: $2,000–$3,000          │
│                       │  Message: "We need a 3-day..."  │
│ ● Lead Form           │                                 │
│   Anonymous           │  [ Accept ]  [ Decline ]        │
│   5 days ago          │  [ Send Message ]               │
│                       │                                 │
└───────────────────────┴─────────────────────────────────┘
```

**Lead status lifecycle:**
- New (unread) → Viewed → Responded / Accepted / Declined / Converted

**Actions per lead type:**
- Booking: Accept (→ confirm dates) | Decline (→ reason) | Propose Alternative
- RFQ: Send Quote | Decline | Request Clarification
- Lead Form: Reply by Message | Mark as Converted | Archive
- Brochure Download: Track only (no action) — shows who downloaded

### 7.5 Job Applications Tab (`/dashboard/applications`)

Existing applications functionality moved from the user profile page into the dashboard.

**Table view:**
| Job Title | Company | Applied | Status | Action |
|---|---|---|---|---|
| Senior Designer | Acme Corp | May 12 | Under Review | View |
| UX Lead | TechStart | May 3 | Shortlisted | View |

Status badges: Applied · Under Review · Shortlisted · Offered · Rejected · Withdrawn

### 7.6 Messages Tab

Thin wrapper / redirect link to `/messages` — personal direct messages hub. No separate UI needed.

---

## 8. Business Dashboard (Overhauled)

**Route:** `/b/[businessId]`  
**Layout:** `zyd-header-component` with business sidebar  
**Auth:** Required + Business member/owner

### 8.1 Layout

```
┌──────────────────────────────────────────────────────────┐
│ HEADER                [Business Name ▾] [🔔] [Avatar]   │
├────────────────┬─────────────────────────────────────────┤
│                │                                         │
│  SIDEBAR       │  MAIN CONTENT AREA                      │
│                │                                         │
│  Overview      │                                         │
│  Listings      │                                         │
│  ├ Jobs        │                                         │
│  └ Skills      │                                         │
│  Team          │                                         │
│  ├ Members     │                                         │
│  └ Recruiters  │                                         │
│  Leads         │                                         │
│  Messages      │                                         │
│  Notifications │                                         │
│  Analytics     │                                         │
│  Settings      │                                         │
│                │                                         │
└────────────────┴─────────────────────────────────────────┘
```

### 8.2 Business Overview

**Stats row (5 cards):**
```
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│  Jobs  │ │ Skills │ │ Leads  │ │ Msgs   │ │ Team   │
│  8     │ │  4     │ │  27    │ │  6 new │ │  12    │
│ active │ │ active │ │ this mo│ │ unread │ │ members│
└────────┘ └────────┘ └────────┘ └────────┘ └────────┘
```

**Recent activity + quick actions** — same pattern as User Dashboard overview.

### 8.3 Listings Management

**Jobs sub-tab:** Existing `ZydBoardManagerComponent` functionality — list, create, edit, close jobs.

**Skills sub-tab (new):** Business can also list skills (e.g. "Consulting services", "Design sprints").
- Same UI as User Dashboard skills management
- Skills are attributed to the business, not an individual user

### 8.4 Team Management

**Members tab:** Existing invite + role management. No change.

**Recruiters tab (new):**
```
Recruiters                               [ + Add Recruiter Profile ]

┌──────────────────────────────────────────────────────┐
│ [Photo]  Jane Smith                                  │
│          Senior Technical Recruiter                  │
│          Specialties: Engineering, Product           │
│          12 placements · ★ 4.9                       │
│          [View Public Profile]  [Edit]  [Remove]     │
└──────────────────────────────────────────────────────┘
```

A recruiter profile is a **public-facing persona** representing a member of this business's recruiting team. See §14 for full spec.

### 8.5 Business Leads

Same UI as User Dashboard leads (§7.4) but scoped to leads on business-owned listings (jobs, business-owned skills).

### 8.6 Business Messages (`/b/[businessId]/messages`)

See §10 for full messaging spec.

### 8.7 Business Notifications (`/b/[businessId]/notifications`)

See §9 for full notifications spec.

---

## 9. Notifications — Unified Centre

### 9.1 Notification Types

| Type | Trigger | Route |
|---|---|---|
| `new_lead` | Someone submits a lead form on your skill | `/dashboard/leads` or `/b/[id]/leads` |
| `new_booking` | Someone books a skill | `/dashboard/leads` |
| `new_rfq` | Someone sends an RFQ | `/dashboard/leads` |
| `new_message` | New DM or business message | `/messages` or `/b/[id]/messages` |
| `application_status` | Job application status changes | `/dashboard/applications` |
| `brochure_download` | Someone downloads your brochure | `/dashboard/leads` |
| `review_received` | New rating/review on your listing | Detail page |
| `team_invite` | Invited to a business | `/b/invite/[inviteId]` |
| `booking_confirmed` | Booking accepted | `/dashboard/leads` |

### 9.2 User Notifications Page (`/notifications/[username]`)

**Filter chips:**
```
[ All ]  [ Leads ]  [ Messages ]  [ Applications ]  [ Reviews ]  [ System ]
```

**Notification list:**
```
● [Icon] New Booking Request — Product Design Sprint
         Acme Corp booked 3 days · Jun 5–7 · $2,400
         2 hours ago                        [ Review ]

● [Icon] Application Update
         Your application to Senior Designer at TechStart
         has moved to Shortlisted
         Yesterday                          [ View Application ]

  [Icon] Message from John Doe
         "Hi, I saw your UX Research skill listing..."
         3 days ago                         [ Reply ]
```

**Read/unread state:** Unread = left blue dot + bold text. Tapping marks as read.

**Bulk actions (top right):** Mark all read | Clear all

### 9.3 Business Notifications Page (`/b/[businessId]/notifications`)

Same layout as user notifications but scoped to business-owned entity events.

**Additional business-specific types:**
- New job application received
- Team member joined / left
- Recruiter profile reviewed
- Business profile viewed milestone (100 views, 1K views, etc.)

### 9.4 In-header Notification Bell

**Dropdown (top 5 unread):**
```
┌──────────────────────────────────┐
│ Notifications                    │
│                                  │
│ ● New Booking — Design Sprint    │
│   2 hours ago                    │
│                                  │
│ ● Jane Smith sent a message      │
│   Yesterday                      │
│                                  │
│ ─────────────────────────────── │
│      View all notifications →    │
└──────────────────────────────────┘
```

Bell badge shows total unread count (personal + business combined if in business context, just personal otherwise). Cap badge display at 99+.

---

## 10. Messaging — Business Account Support

### 10.1 Current State
Messaging (`/messages`) is a personal DM system. Business accounts have a separate chat under `/b/[businessId]/chat/` with a different UI.

### 10.2 Target State
Business messaging is elevated to a first-class inbox under `/b/[businessId]/messages`, using the same high-quality WhatsApp-style UI as the personal messages hub.

### 10.3 Business Messages Hub (`/b/[businessId]/messages`)

**Layout:** Identical 3-column layout as `/messages`:
- Left: Conversation list
- Center/Right: Active conversation thread
- Empty state when no conversation selected

**Conversation sources for business inbox:**
1. Direct messages sent to the business profile page (via a "Message Business" CTA on the public business profile)
2. Lead-originated conversations (when a user replies to a lead acknowledgement)
3. Internal team messages (optional future feature — out of scope for this overhaul)

**Conversation list item:**
```
┌────────────────────────────────────┐
│ [Avatar] John Doe (Personal)  2h  │
│          "Thanks for getting..."   │
│                              [●] 2 │
└────────────────────────────────────┘
```

**Conversation header:**
```
← John Doe
   Sent message via: Product Design Sprint (lead)
   john@acme.com
```

**Message composition:**
- Same rich input as personal messages
- Option to attach files (brochures, proposals, quotes)

### 10.4 Routing & Context

When a user messages a business (from business public profile or skill listing), the message appears:
- In the user's personal `/messages` as "Business: Acme Corp"
- In the business's `/b/[id]/messages` as "[User Full Name]"

Both sides use the same conversation ID; the interface simply renders from the appropriate perspective.

### 10.5 New Message CTAs

| Location | CTA Label | Routes to |
|---|---|---|
| Business public profile | "Message Business" | Creates conversation in business inbox |
| Skill detail page | "Send Message to Seller" | Creates conversation (or uses existing) |
| Recruiter public profile | "Contact Recruiter" | Creates conversation in business inbox |
| Lead detail (business) | "Reply to Lead" | Opens thread pre-linked to the lead |

---

## 11. Marketplace — Exchange Hub Page

**Route:** `/exchange`  
**Layout:** `zyd-header-component`  
**Auth:** Not required (public browsing; CTAs prompt login)

### 11.1 Design Model

The `/exchange` page is a **discovery hub** — a department-store entrance that showcases all verticals in named preview rows. Each row shows a curated sample of listings (4–6 cards) with a prominent "View More →" link that navigates to the full standalone listing page for that vertical.

This replaces the previous tab-based model. Users who want to browse a specific vertical in depth go to its dedicated page. The hub is for discovery and cross-vertical exposure.

### 11.2 Page Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ HEADER                                                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  HERO / SEARCH BAR                                               │
│  "What are you looking for?"  [Search all marketplace...]  [🔍]  │
│  Quick links: Jobs · Skills · Recruiters · Businesses            │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ── SECTION: Featured Skills ───────────────── View More →      │
│                                                                  │
│  [SkillCard]  [SkillCard]  [SkillCard]  [SkillCard]             │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ── SECTION: Top Recruiters ────────────────── View More →      │
│                                                                  │
│  [RecruiterCard]  [RecruiterCard]  [RecruiterCard]              │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ── SECTION: Latest Jobs ───────────────────── View More →      │
│                                                                  │
│  [JobCard]  [JobCard]  [JobCard]  [JobCard]                     │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ── SECTION: Businesses ────────────────────── View More →      │
│                                                                  │
│  [BusinessCard]  [BusinessCard]  [BusinessCard]  [BusinessCard] │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ── SECTION: Products & Services ──────────── View More →       │
│                                                                  │
│  [Card]  [Card]  [Card]  [Card]                                 │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ── SECTION: Projects ──────────────────────── View More →      │
│                                                                  │
│  [Card]  [Card]  [Card]  [Card]                                 │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ── SECTION: Portfolios ────────────────────── View More →      │
│                                                                  │
│  [Card]  [Card]  [Card]  [Card]                                 │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 11.3 Hero / Search Bar

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   Discover the Work Economy                                      │
│   Hire skills, find jobs, connect with recruiters                │
│                                                                  │
│   ┌──────────────────────────────────────────────────┐  [Search]│
│   │  Search skills, jobs, recruiters, businesses...  │          │
│   └──────────────────────────────────────────────────┘          │
│                                                                  │
│   Browse:  [ Jobs ]  [ Skills ]  [ Recruiters ]  [ Businesses ] │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

- Quick browse chips navigate directly to the standalone listing pages (`/jobs`, `/skills`, `/recruiters`, `/businesses`)
- Global search queries across all verticals and returns a blended results page (future scope; placeholder for v1)

### 11.4 Section Row Anatomy

Each vertical section on the hub follows the same pattern:

```
┌──────────────────────────────────────────────────────────────────┐
│  Section Header                                                  │
│  ┌──────────────────────────────────┐  ┌────────────────────┐   │
│  │ [Icon]  Featured Skills          │  │  View all skills → │   │
│  │ Find experts ready to help       │  └────────────────────┘   │
│  └──────────────────────────────────┘                            │
│                                                                  │
│  [Card]  [Card]  [Card]  [Card]   ← 4 on desktop, 2 on mobile  │
│                                                                  │
│  (No load-more, no filters — preview only)                       │
└──────────────────────────────────────────────────────────────────┘
```

**Section header elements:**
- Icon: Lucide icon representing the vertical (Wrench for Skills, Users for Recruiters, Briefcase for Jobs, Building2 for Businesses)
- Title: "[Vertical Name]"
- Subtitle: 1-line value proposition for that vertical
- "View all [vertical] →" link: navigates to the standalone listing page

**Card count per row:**
- Desktop (≥1024px): 4 cards
- Tablet (768–1023px): 3 cards
- Mobile (<768px): 2 cards (horizontally scrollable row, not wrapping grid)

**Mobile row behaviour:** On mobile, section rows become **horizontally scrollable carousels** — cards don't wrap, users swipe left. This keeps the hub page compact and scannable on small screens.

**Data loading:** Each section fetches its preview data independently (parallel requests on page mount). Sections render as skeletons while loading and pop in as data arrives. A section that returns 0 results is hidden entirely.

**Section order:** Skills · Recruiters · Jobs · Businesses · Products & Services · Projects · Portfolios. Order is configurable via CMS or feature flags in a future iteration.

### 11.5 "View More" Navigation Map

| Section | "View More" destination |
|---|---|
| Skills | `/skills` |
| Recruiters | `/recruiters` |
| Jobs | `/jobs` |
| Businesses | `/businesses` |
| Products & Services | `/products` |
| Projects | `/projects` |
| Portfolios | `/portfolios` |

### 11.6 Shared Standalone Listing Page Pattern

All standalone vertical listing pages (`/skills`, `/recruiters`, `/jobs`, `/businesses`, etc.) share this layout template:

```
┌──────────────────────────────────────────────────────────────────┐
│ HEADER                                                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ PAGE TITLE + BREADCRUMB                                          │
│ Exchange  >  Skills          1,284 skills found                  │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│ STICKY FILTER BAR (below header)                                 │
│ [Filter chip ▾]  [Filter chip ▾]  [Filter chip ▾]     Sort ▾   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ITEM GRID (3-col desktop · 2-col tablet · 1-col mobile)        │
│                                                                  │
│  [Card]  [Card]  [Card]                                         │
│  [Card]  [Card]  [Card]                                         │
│  [Card]  [Card]  [Card]                                         │
│                                                                  │
│  ── (infinite scroll observer anchor) ──                         │
│                                                                  │
│  [Spinner — loading next page]                                   │
│                                                                  │
│  [ Load More ]  ← button fallback                               │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Breadcrumb:** `Exchange > [Vertical Name]` — "Exchange" links back to `/exchange`.

**Page title pattern:** `[Vertical Name] — Zeemic Marketplace` (for SEO).

**Filter bar:** Sticky at `top: 56px` (header height). Vertical-specific filter chips (defined per vertical in §12–§15). All filter bars include a `Sort ▾` control on the right.

**Infinite scroll:** Uses `useInfiniteObserver` composable (existing). Observer anchor always in DOM inside the grid container. Post-load viewport check after each page (per CLAUDE.md §8).

**Empty state:** Dashed border box with vertical icon, "No [vertical] found matching your filters", and a "Clear filters" link.

---

## 12. Jobs Vertical

**Standalone page:** `/jobs` (canonical)  
**Exchange hub preview row:** shows 4 latest jobs + "View all jobs →" link to `/jobs`  
**Detail page:** `/jobs/[jobId]` (unchanged route)

### 12.1 Jobs Standalone Listing Page (`/jobs`)

**Breadcrumb:** `Exchange > Jobs`

**Filter chips (existing, unchanged):**
```
[ Country ▾ ]  [ Industry ▾ ]  [ Job Type ▾ ]  [ Salary ▾ ]  [ Deadline ▾ ]  [ Recruiter ▾ ]
```
New filter added: **Recruiter** — filter jobs by a specific linked recruiter (name search within dropdown).

**Sort:** Newest · Salary (High–Low) · Salary (Low–High) · Deadline (Soonest)

### 12.2 Exchange Hub Preview Row

```
[Briefcase icon]  Latest Jobs               View all jobs →
Find your next opportunity

[JobCard]  [JobCard]  [JobCard]  [JobCard]
```
Data: 4 most recently posted active jobs. No filters on hub row.

### 12.3 Changes from Current State

| Element | Current | Updated |
|---|---|---|
| Route | `/jobs` (standalone) | `/jobs` (same, now also shown in Exchange hub) |
| Filter chips | Country, Industry, Job Type, Salary, Deadline | + Recruiter filter |
| Job card | No recruiter reference | Optionally shows linked recruiter chip |
| Detail page | No recruiter info | Recruiter card if linked |

### 12.4 Job Card Update

```
┌───────────────────────────────────────────┐
│ [Business Logo]  Acme Corp                │
│                  Full-time · Remote       │
│                                           │
│  Senior UX Designer                       │
│                                           │
│  $80,000–$100,000 · New York, US          │
│  Deadline: Jun 30, 2026                   │
│                                           │
│  [Recruiter: Jane Smith ↗]  ← new chip   │
│                                           │
│  ★ 4.2  (8 ratings)     [♡] [Apply →]   │
└───────────────────────────────────────────┘
```

### 12.5 Job Detail Page Update

Below the existing job description and metadata, add a **Recruiter Card** section (only if job is linked to a recruiter):

```
Posted by Recruiter
┌───────────────────────────────────────────┐
│ [Photo]  Jane Smith                       │
│          Senior Technical Recruiter       │
│          Acme Corp Recruiting Team        │
│          ★ 4.9 · 24 placements            │
│                                           │
│  [ View Recruiter Profile ]  [ Message ]  │
└───────────────────────────────────────────┘
```

---

## 13. Skills Vertical (New)

**Standalone listing page:** `/skills`  
**Exchange hub preview row:** shows 4 featured skills + "View all skills →" link to `/skills`  
**Detail page:** `/skills/[slug]`  
**Create/edit:** `/dashboard/skills/new` and `/dashboard/skills/[id]/edit`

### 13.1 Overview

The Skills vertical is the commoditisation of professional competencies. An individual (or business) lists a skill as a purchasable service. Buyers can interact via multiple transactional entry points without needing to contact the seller upfront.

**Skill listing represents:** A packaged service offering built around a specific expertise area. Examples:
- "UX Research — Remote Usability Testing (3 sessions)"
- "Financial Modelling — 1-week engagement"
- "Legal Contract Review — Per document"
- "SAP Implementation Consulting"

### 13.2 Skills Standalone Listing Page (`/skills`)

**Breadcrumb:** `Exchange > Skills`

**Page header:**
```
Skills Marketplace
Find experts ready to help — book sessions, request quotes, or download brochures
```

**Filter chips:**
```
[ Category ▾ ]  [ Delivery ▾ ]  [ Price Range ▾ ]  [ Country ▾ ]  [ Availability ▾ ]
```

- **Category:** Design · Development · Marketing · Legal · Finance · HR · Engineering · Consulting · Data · Healthcare · Education · Other
- **Delivery:** Remote | On-site | Hybrid
- **Price Range:** Under $50/hr | $50–$150/hr | $150–$500/hr | $500+/hr | RFQ / Custom
- **Availability:** Available Now | Within 2 weeks | Within a month | Any

**Filter chip active state:** When a filter is active, its chip reads `[Category: Design ×]` — value shown inline with a clear ×.

**Result count + sort:**
```
1,284 skills found     Sort: Relevance ▾
```

Sort options: Relevance · Newest · Price (Low–High) · Price (High–Low) · Highest Rated · Most Booked

**Grid:** 3-col desktop · 2-col tablet · 1-col mobile. Infinite scroll.

**Empty state (all filters cleared still yields 0):**
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   [Wrench icon — gray]                              │
│   No skills match your filters                      │
│   Try adjusting or clearing your filters            │
│                                                     │
│   [ Clear all filters ]                             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Logged-out CTA banner (below first row of cards):**
```
┌─────────────────────────────────────────────────────┐
│  Have a skill to offer?  List it on Zeemic for free │
│                              [ Create a Skill → ]   │
└─────────────────────────────────────────────────────┘
```
Only shown to unauthenticated users. Clicking "Create a Skill" redirects to `/login?redirect=/dashboard/skills/new`.

### 13.3 Exchange Hub Preview Row

```
[Wrench icon]  Featured Skills             View all skills →
Find experts ready to help — book, quote, or download

[SkillCard]  [SkillCard]  [SkillCard]  [SkillCard]
```
Data: 4 top-rated active skill listings. No filters on hub row. "View all skills →" navigates to `/skills`.

### 13.4 Skill Card

```
┌───────────────────────────────────────────┐
│ Design                 ● Available Now    │
│                                           │
│  UX Research & Usability Testing          │
│                                           │
│  [Avatar] Enoch Boison                    │
│           Accra, Ghana · Remote           │
│                                           │
│  From $150/hr  ·  ★ 4.8 (12 reviews)     │
│                                           │
│  ─────────────────────────────────────── │
│  [ Book Now ]  [ Get Quote ]  [♡]        │
└───────────────────────────────────────────┘
```

**Card states:**
- Default: white bg, hover: slight elevation + primary border
- Unavailable: muted / greyed text, no Book button, only "Get Quote"

**Primary CTAs on card:**
- **Book Now** — opens booking intent flow (see §17.1)
- **Get Quote** — opens RFQ form inline or on detail page
- **♡ Favourite** — saves to favourites (existing pattern)

### 13.5 Skill Detail Page (`/skills/[slug]`)

**Page structure (desktop: 2-column, mobile: single column stack):**

```
┌───────────────────────────────────────┬───────────────────────┐
│ LEFT — Skill Content                  │ RIGHT — Action Panel  │
│                                       │                       │
│ [Category tag]  [Availability badge]  │  From $150/hr         │
│                                       │  ★ 4.8 · 12 reviews   │
│ UX Research &                         │                       │
│ Usability Testing                     │  [ Book Now ]         │
│                                       │  [ Request a Quote ]  │
│ by Enoch Boison  ·  Accra, Ghana      │  [ Submit Proposal ]  │
│ [Avatar 40px]  [★ 4.8]  [12 reviews]  │  [ Download Brochure ]│
│                                       │  [ Contact Seller ]   │
│ ─────────────────────────────────────  │                       │
│                                       │  ─────────────────    │
│ ABOUT THIS SKILL                      │  Delivery: Remote     │
│  [rich text description]              │  Response: < 24hr     │
│                                       │  Languages: English   │
│ ─────────────────────────────────────  │                       │
│                                       │  ─────────────────    │
│ WHAT'S INCLUDED                       │  Share this skill:    │
│  ✓ Remote usability sessions (×3)     │  [Twitter][LinkedIn]  │
│  ✓ Session recordings                 │  [Link copy]          │
│  ✓ Full written report                │                       │
│  ✓ Follow-up Q&A (1hr)               └───────────────────────┘
│                                        
│ ─────────────────────────────────────
│                                        
│ PACKAGES (optional, seller-defined)
│  ┌──────────┐  ┌──────────┐  ┌──────────┐
│  │ Basic    │  │ Standard │  │ Premium  │
│  │ 1 session│  │ 3 sess.  │  │ 5 sess. +│
│  │ $150     │  │ $400     │  │ $650     │
│  │ [Select] │  │ [Select] │  │ [Select] │
│  └──────────┘  └──────────┘  └──────────┘
│
│ ─────────────────────────────────────
│
│ SELLER INFO
│  [Large avatar]  Enoch Boison
│                  Product Designer · 8 yrs exp
│                  Accra, Ghana
│                  Member since Mar 2024
│                  98% response rate
│  [View Full Profile]  [Message]
│
│ ─────────────────────────────────────
│
│ REVIEWS (12)
│  ★★★★★  "Excellent work, very thorough..."
│  John D. · Acme Corp · May 2026
│  
│  ★★★★☆  "Good sessions, minor delays..."
│  Sarah K. · TechStart · Apr 2026
│
│ [Load more reviews]
│
└───────────────────────────────────────
```

**Right Action Panel — Sticky on desktop scroll:**
The action panel sticks to the right column as the user scrolls through the left content (same pattern as Amazon product pages).

### 13.6 Skill Create/Edit Form (`/dashboard/skills/new` or `/dashboard/skills/[id]/edit`)

**Step 1 — Basics**
- Title (required, max 80 chars)
- Category (dropdown — see category taxonomy)
- Short description (required, max 200 chars, used on card)
- Full description (rich text editor)

**Step 2 — Service Details**
- Delivery mode: Remote | On-site | Hybrid
- Location (if On-site or Hybrid): country, city
- Languages spoken
- Typical response time: < 24hr | 1–3 days | 1 week | By arrangement

**Step 3 — Pricing**
- Pricing model: Hourly | Fixed per project | Per session | Package | RFQ only
- If not RFQ only:
  - Base price (number + currency)
  - Optional: packages (Basic / Standard / Premium) with name, description, inclusions, price
- Enable "Request a Quote" option: always on (cannot disable)

**Step 4 — Deliverables & Inclusions**
- What's included checklist (free-form text rows, up to 10)
- Typical turnaround / engagement length
- Number of revisions (if applicable)

**Step 5 — Brochure (optional)**
- Upload PDF brochure (max 20MB)
- Preview thumbnail
- Toggle: Require lead form before download? Yes / No
- If Yes → leads are captured in dashboard before download link is shared

**Step 6 — Lead Form (optional)**
- Toggle: Show a lead form on the detail page? Yes / No
- If Yes:
  - Customize form fields: Name (always), Email (always), Company, Phone, Message, Budget, Timeline
  - Toggle each field: Show | Require | Hide

**Step 7 — Media**
- Upload portfolio images / screenshots (max 10, JPG/PNG, max 5MB each)
- Optional: embed video URL (YouTube/Vimeo)
- Portfolio display: gallery on detail page below description

**Step 8 — Availability**
- Status: Active | Paused | Draft
- Availability note (free text, e.g. "Available from July onwards")

**Review & Publish** — summary of all entered data before saving.

### 13.7 Transactional CTAs — Behaviour

#### Book Now
1. Clicks "Book Now" on card or detail page
2. Side drawer opens (or modal on mobile):
   ```
   Book: UX Research & Usability Testing
   ─────────────────────────────────────
   Select Package:  ○ Basic  ● Standard  ○ Premium
   
   Preferred Dates (optional):
   [Date picker — from/to]
   
   Message to seller (optional):
   [Textarea]
   
   Your Contact:
   Name: [pre-filled from profile]
   Email: [pre-filled]
   Company: [__________]
   
   [ Submit Booking Request ]
   ```
3. Seller receives `new_booking` notification
4. Booking appears in seller's `/dashboard/leads` with status "Pending"
5. Seller accepts → buyer notified → status: "Confirmed"

#### Request a Quote (RFQ)
1. Clicks "Request a Quote"
2. Side drawer opens:
   ```
   Request a Quote
   ─────────────────────────────────────
   Skill: UX Research & Usability Testing
   
   Describe your requirements:
   [Textarea — required]
   
   Your Budget:
   ○ Under $500   ○ $500–$2,000   ○ $2,000–$5,000   ○ $5,000+   ○ Flexible
   
   Timeline:
   ○ ASAP   ○ Within 2 weeks   ○ 1 month   ○ Flexible
   
   Your Contact:
   Name: [pre-filled]  Email: [pre-filled]  Company: [______]
   
   [ Send Quote Request ]
   ```
3. Seller receives `new_rfq` notification → appears in `/dashboard/leads`

#### Submit Proposal
1. Clicks "Submit Proposal"
2. Proposal form (slightly more structured than RFQ):
   ```
   Submit a Proposal
   ─────────────────────────────────────
   What would you like the seller to do?
   [Textarea — required]
   
   Proposed Budget:
   [Number field + Currency selector]
   
   Proposed Timeline:
   [Date range picker]
   
   Attach Brief (optional):
   [File upload — PDF, max 10MB]
   
   Your Contact:
   Name: [__]  Email: [__]  Phone: [__]  Company: [__]
   
   [ Submit Proposal ]
   ```

#### Download Brochure
- If brochure available:
  - If no lead form required: direct download link
  - If lead form required:
    ```
    Get the Brochure
    ─────────────────────────────────────
    Name: [__]  Email: [__]  Company: [__]
    [ Download Now ]
    By downloading you agree the seller may contact you.
    ```
    On submit → PDF download starts + `brochure_download` lead appears in seller dashboard

#### Lead Form
- Displayed as a section on the skill detail page (if seller enabled it)
- Fields as configured by seller (see §13.5 Step 6)
- On submit → `new_lead` notification + appears in seller's `/dashboard/leads`

---

## 14. Recruiter Vertical (New)

**Standalone listing page:** `/recruiters`  
**Exchange hub preview row:** shows 3 featured recruiters + "View all recruiters →" link to `/recruiters`  
**Profile page:** `/recruiter/[slug]`  
**Create/edit:** `/b/[businessId]/team/recruiters/new`

### 14.1 Overview

A Recruiter profile is a **public-facing listing** representing an individual recruiter who is a member of a business account. It is created by the business (owner or admin) from within the Business Dashboard, and listed publicly in the Recruiters vertical.

**Purpose:** Allow businesses to showcase their recruiting talent. Allow job seekers to browse and directly contact recruiters. Allow recruiters to build a personal brand within their employer's presence.

### 14.2 Recruiters Standalone Listing Page (`/recruiters`)

**Breadcrumb:** `Exchange > Recruiters`

**Page header:**
```
Find a Recruiter
Browse recruiting professionals and connect with the right person for your job search
```

**Filter chips:**
```
[ Specialty ▾ ]  [ Industry ▾ ]  [ Country ▾ ]  [ Business ▾ ]  [ Available ▾ ]
```

- **Specialty:** Technical Recruiting · Executive Search · Sales & Marketing · Finance · Healthcare · Creative · Operations · General
- **Industry:** same taxonomy as Jobs (Design, Engineering, Finance, Healthcare, Legal, etc.)
- **Country:** country of the recruiter's business location
- **Business:** filter by a specific business (name search within dropdown)
- **Available:** Available Now | On Leave | Any

**Sort:** Most Placements · Highest Rated · Newest · Alphabetical

**Grid:** 3-col desktop · 2-col tablet · 1-col mobile. Infinite scroll.

**Empty state:**
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   [Users icon — gray]                               │
│   No recruiters match your filters                  │
│   Try adjusting or clearing your filters            │
│                                                     │
│   [ Clear all filters ]                             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**For businesses — CTA banner (below first row):**
```
┌─────────────────────────────────────────────────────┐
│  Are you a recruiter?  Build your public profile     │
│  on Zeemic and get discovered by candidates         │
│                   [ Create Recruiter Profile → ]    │
└─────────────────────────────────────────────────────┘
```
Shown to authenticated users who are members of a business but have no recruiter profile yet. Links to `/b/[businessId]/team/recruiters/new`.

### 14.3 Exchange Hub Preview Row

```
[Users icon]  Top Recruiters               View all recruiters →
Connect with recruiting professionals who can help you land your next role

[RecruiterCard]  [RecruiterCard]  [RecruiterCard]
```
Data: 3 highest-rated active recruiter profiles. No filters on hub row. "View all recruiters →" navigates to `/recruiters`.

### 14.4 Recruiter Card

```
┌───────────────────────────────────────────┐
│ [Photo 56px]   Jane Smith                 │
│                Senior Technical Recruiter │
│                [Business Logo] Acme Corp  │
│                                           │
│  Specialties: Engineering · Product       │
│  24 placements  ·  ★ 4.9 (18 reviews)    │
│  New York, US  ·  Remote-friendly         │
│                                           │
│  ─────────────────────────────────────── │
│  [ View Profile ]   [ Contact ]    [♡]   │
└───────────────────────────────────────────┘
```

### 14.5 Recruiter Public Profile (`/recruiter/[slug]`)

**Page structure (2-col desktop, single-col mobile):**

```
┌────────────────────────────────────────┬──────────────────────┐
│ LEFT — Recruiter Content               │ RIGHT — Action Panel  │
│                                        │                       │
│ [Cover banner — optional]              │  [Contact Recruiter]  │
│                                        │                       │
│ [Photo 80px]  Jane Smith               │  ─────────────────    │
│               Senior Technical Rec.    │  Business:            │
│               [Logo] Acme Corp         │  [Logo] Acme Corp     │
│               New York, US             │  [View Business]      │
│ ★ 4.9 · 24 placements                 │                       │
│                                        │  ─────────────────    │
│ ──────────────────────────────────     │  Specialties:         │
│                                        │  Engineering          │
│ ABOUT                                  │  Product              │
│ [Bio text]                             │  Data                 │
│                                        │                       │
│ ──────────────────────────────────     │  ─────────────────    │
│                                        │  Industries:          │
│ SPECIALTIES & INDUSTRIES               │  Fintech · SaaS       │
│ [Chip tags: Engineering, Product...]   │  HealthTech           │
│                                        │                       │
│ ──────────────────────────────────     │  ─────────────────    │
│                                        │  Share:               │
│ ACTIVE JOB POSTINGS (from this rec.)   │  [LinkedIn][Copy Link]│
│  [Job card mini × 3]                   │                       │
│  [View all jobs →]                     └───────────────────────┘
│                                         
│ ──────────────────────────────────
│                                        
│ REVIEWS (18)
│  ★★★★★  "Jane placed me at my dream..."
│  [User name] · Placed as: Senior Eng · May 2026
│
│ [Load more]
│
└────────────────────────────────────────
```

**Action Panel — Contact Recruiter:**
Opens a message compose drawer:
```
Contact Jane Smith
──────────────────
Job Interest (optional): [Select from Acme's active jobs ▾]

Your message:
[Textarea — required]

Your Contact:
Name: [pre-filled]  Email: [pre-filled]  Phone: [optional]

[ Send Message ]
```
On send → creates conversation in Acme Corp's business messages inbox, tagged to Jane Smith. Jane is notified via business notifications.

### 14.6 Recruiter Profile Create/Edit Form (`/b/[businessId]/team/recruiters/new`)

**Only accessible by Business Owner or Admin**

**Fields:**
- Select team member (dropdown of existing business members) — required
- Recruiter title (e.g. "Senior Technical Recruiter") — required
- Short bio (max 300 chars) — required
- Specialties (chip input, taxonomy-constrained)
- Industries (chip input)
- Location: country + city
- Available for new placements: toggle (Yes / No)
- Link to LinkedIn profile: optional URL
- Profile photo: uses team member's user profile photo by default; allow override
- Cover banner: optional upload

**Linked Jobs:** The system automatically queries jobs posted by this business and allows the recruiter to select which active jobs to associate with their profile. Selected jobs appear in the "Active Job Postings" section on the public profile.

**Slug generation:** Auto from name (e.g. "jane-smith-acme") with collision handling.

### 14.7 Recruiter in Business Dashboard (`/b/[businessId]/team/recruiters`)

**Table view:**

| Recruiter | Title | Placements | Rating | Status | Actions |
|---|---|---|---|---|---|
| [Photo] Jane Smith | Sr. Tech Recruiter | 24 | ★ 4.9 | Active | Edit · View · Remove |
| [Photo] Mark Lee | Exec. Search | 11 | ★ 4.7 | On Leave | Edit · View · Activate |

---

## 15. Business Directory Vertical

**Standalone listing page:** `/businesses`  
**Exchange hub preview row:** shows 4 featured businesses + "View all businesses →" link to `/businesses`  
**Profile page:** `/business/[slug]` (unchanged route)

### 15.1 Business Directory Standalone Page (`/businesses`)

**Breadcrumb:** `Exchange > Businesses`

**Page header:**
```
Business Directory
Discover companies, agencies, and service providers on the Zeemic marketplace
```

**Filter chips:**
```
[ Industry ▾ ]  [ Country ▾ ]  [ Size ▾ ]  [ Type ▾ ]
```

- **Industry:** same taxonomy as Jobs
- **Country:** country of the business
- **Size:** 1–10 · 11–50 · 51–200 · 200+ employees
- **Type:** Company · Agency · Freelance Studio · Consultancy · Non-profit

**Sort:** Newest · Most Reviews · Alphabetical · Most Active

**Grid:** 3-col desktop · 2-col tablet · 1-col mobile. Infinite scroll.

**Empty state:**
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   [Building2 icon — gray]                           │
│   No businesses match your filters                  │
│   Try adjusting or clearing your filters            │
│                                                     │
│   [ Clear all filters ]                             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Business card (updated):**
```
┌───────────────────────────────────────────┐
│ [Business Logo 48px]   Acme Corp          │
│                        Technology · SaaS  │
│                        New York, US       │
│                                           │
│  Building great products since 2018       │
│  ★ 4.6  (24 reviews)  ·  32 employees    │
│                                           │
│  ─────────────────────────────────────── │
│  [ Message ]   [ View Profile ]   [♡]   │
└───────────────────────────────────────────┘
```

"Message" opens a compose drawer → routes to the business's inbox.

### 15.2 Exchange Hub Preview Row

```
[Building2 icon]  Businesses                View all businesses →
Discover companies and agencies on the Zeemic marketplace

[BusinessCard]  [BusinessCard]  [BusinessCard]  [BusinessCard]
```
Data: 4 most recently active verified businesses. No filters on hub row. "View all businesses →" navigates to `/businesses`.

### 15.3 Business Card Changes Summary

| Element | Before | After |
|---|---|---|
| Primary CTA | `[ Contact ]` | `[ Message ]` |
| Secondary CTA | `[ View Profile ]` | unchanged |
| "Message" behaviour | n/a | opens compose drawer → routes to business messages inbox |

---

## 16. Public Profile Pages

### 16.1 User Profile Update (`/user/profile/[username]`)

**Stats row — updated:**

| Stat | Status |
|---|---|
| Reviews | Keep |
| Posts count | Remove (Posts discontinued) |
| Skills | Add — count of active skill listings |
| Jobs posted | Keep (for users who post jobs as individuals) |
| Followers | Keep |
| Profile views | Keep |

**Profile Tabs — updated:**

| Tab | Status |
|---|---|
| Profile (bio, experience, education) | Keep |
| Skills | Add — public view of user's active skill listings (cards, link to `/skills/[slug]`) |
| Reviews | Add (from rating system) |
| More | Keep |

**Remove:** Posts tab (no more posts)

### 16.2 Business Public Profile (`/business/[slug]`)

**Sections — updated:**

| Section | Status |
|---|---|
| Business header (logo, name, description) | Keep |
| Contact / Message button | Update to "Message Business" (§10.5) |
| Active Job Listings | Keep |
| Skills Offered | Add — business-owned skill listings |
| Recruiting Team | Add — list of public recruiter profiles linked to this business |
| Reviews | Keep |
| About / Company Info | Keep |

---

## 17. Transactional Flows

### 17.1 Booking Flow

```
Buyer clicks [Book Now]
→ Booking drawer opens
→ Buyer fills: package, dates, message, contact info
→ Clicks [Submit Booking Request]
→ API: POST /api/skills/[id]/bookings
→ Seller notified (notification + email)
→ Booking appears in seller /dashboard/leads (status: Pending)
→ Seller clicks [Accept] or [Decline]
  → Accept: buyer notified, status: Confirmed
  → Decline: buyer notified, optional reason shown
→ Optional: seller/buyer exchange messages via linked conversation
```

### 17.2 RFQ Flow

```
Buyer clicks [Request a Quote]
→ RFQ drawer opens
→ Buyer fills: requirements, budget range, timeline, contact
→ Clicks [Send Quote Request]
→ API: POST /api/skills/[id]/rfq
→ Seller notified → appears in /dashboard/leads (status: New RFQ)
→ Seller sends quote (message with structured quote data)
→ Buyer reviews, accepts or negotiates
→ Converted lead
```

### 17.3 Proposal Flow

```
Buyer clicks [Submit Proposal]
→ Proposal form opens
→ Buyer fills: description, proposed budget, timeline, optional attachment
→ Clicks [Submit Proposal]
→ API: POST /api/skills/[id]/proposals
→ Seller notified → appears in /dashboard/leads (status: New Proposal)
→ Seller replies via message thread
```

### 17.4 Brochure Download Flow

```
Case A: No lead capture required
→ Button click → direct file download (pre-signed URL)

Case B: Lead form required
→ Button click → lead form drawer opens
→ Buyer fills name, email, company
→ Clicks [Download Now]
→ API: POST /api/skills/[id]/brochure-leads
→ PDF download starts
→ Lead appears in seller /dashboard/leads (status: Brochure Downloaded)
→ Seller sees contact info, can follow up
```

### 17.5 Lead Form Submission Flow

```
Buyer fills in-page lead form on skill detail page
→ Clicks [Submit]
→ API: POST /api/skills/[id]/leads
→ Seller notified → appears in /dashboard/leads (status: New Lead)
→ Seller reviews and responds
```

### 17.6 Contact Recruiter Flow

```
Buyer clicks [Contact] on recruiter card or profile
→ Message drawer opens (pre-addressed to recruiter's business)
→ Buyer selects optional job interest, fills message, provides contact
→ Clicks [Send Message]
→ API: POST /api/messages/business/[businessId]
→ Message appears in /b/[businessId]/messages
→ Business (and recruiter) notified
```

---

## 18. Intelligence Dashboard

**Route:** `/intelligence`

**No structural changes.** The intelligence dashboard is carry-forward as designed. Minor updates:

1. **Profile tab on User Profile now links to Intelligence dashboard** — "See your Employability Score →"
2. **Skill listings influence `skills` score component** — If the user's skills in their Intelligence profile match active skill listings, the score reflects market demand for those skills (backend concern, no UI change needed)
3. **Remove "Posts" from activity timeline on intelligence feed** — no more post-count signals

---

## 19. Design System Notes

### 19.1 Color Usage

| Use | Token |
|---|---|
| Primary CTAs (Book Now, Apply) | `zyd-primary-600` fill, white text |
| Secondary CTAs (Get Quote, Contact) | `zyd-primary-600` border, `zyd-primary-600` text, transparent fill |
| Tertiary CTAs (Download Brochure) | `gray-700` text, no border |
| Danger (Decline, Remove) | `red-600` |
| Success / Available badge | `green-600` |
| Pending badge | `amber-500` |
| Neutral / Paused badge | `gray-400` |

### 19.2 Card Pattern Consistency

All listing cards (Jobs, Skills, Recruiters, Businesses) share:
- `bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition`
- 3-col grid desktop, 2-col tablet, 1-col mobile
- Max card height constrained — overflow hidden
- Primary CTA always bottom-right
- Favourite ♡ always top-right or bottom-left

### 19.3 Drawer Pattern

Side drawers (booking, RFQ, proposal, lead, contact) follow:
- Slide in from right on desktop (width: 480px)
- Full-screen bottom sheet on mobile
- Overlay backdrop: `bg-black/40`
- Close button: top-right ×
- Scrollable content when form is long
- Sticky submit button at bottom of drawer

### 19.4 Sticky Filter Bars

All marketplace verticals use the established sticky filter bar pattern:
```css
position: sticky;
top: 56px; /* header height */
z-index: 20;
background: white;
border-bottom: 1px solid #e5e7eb;
```

### 19.5 Dashboard Sidebar

Both User and Business dashboards use a consistent sidebar:
- Width: 240px (desktop), collapsible to icon-only 64px, hidden on mobile
- Mobile: bottom sheet or hamburger-triggered drawer
- Active item: `bg-primary-50 text-primary-700 font-medium rounded-lg`
- Hover: `bg-gray-100`
- Icons: Lucide icon set (via existing `ZydIconComponent`)

### 19.6 Empty States

All empty states follow the Bloomberg terminal aesthetic from CLAUDE.md §21:
- Dashed border box: `border-dashed border-gray-200 rounded-xl p-8`
- Subtle icon (Lucide, 40px, `text-gray-300`)
- Headline: `text-gray-500 font-medium`
- Sub-text: `text-gray-400 text-sm`
- CTA button below: primary style

---

## 20. New Data Models

### 20.1 SkillListing

```typescript
interface SkillListing {
  id: string
  slug: string
  ownerId: string           // userId
  ownerType: 'user' | 'business'
  businessId?: string

  title: string
  shortDescription: string
  description: string       // rich text / HTML
  category: SkillCategory
  status: 'active' | 'draft' | 'paused' | 'archived'

  deliveryMode: 'remote' | 'onsite' | 'hybrid'
  location?: { country: string; city: string }
  languages: string[]
  responseTime: 'under_24hr' | '1_3_days' | '1_week' | 'by_arrangement'

  pricingModel: 'hourly' | 'fixed' | 'per_session' | 'package' | 'rfq_only'
  basePrice?: number
  currency: string
  packages?: SkillPackage[]

  inclusions: string[]       // bullet point list
  turnaround?: string
  revisions?: number

  hasBrochure: boolean
  brochureUrl?: string
  brochureRequiresLead: boolean

  hasLeadForm: boolean
  leadFormFields?: LeadFormField[]

  media: SkillMedia[]

  rating?: { average: number; count: number }
  viewCount: number
  inquiryCount: number

  availabilityNote?: string
  createdAt: string
  updatedAt: string
}

interface SkillPackage {
  name: string              // 'Basic' | 'Standard' | 'Premium' or custom
  description: string
  inclusions: string[]
  price: number
  currency: string
}

interface LeadFormField {
  key: 'name' | 'email' | 'company' | 'phone' | 'message' | 'budget' | 'timeline'
  required: boolean
  visible: boolean
}

interface SkillMedia {
  type: 'image' | 'video_url'
  url: string
  order: number
}
```

### 20.2 SkillLead (consolidated inbound)

```typescript
interface SkillLead {
  id: string
  skillListingId: string
  sellerId: string
  sellerType: 'user' | 'business'

  leadType: 'booking' | 'rfq' | 'proposal' | 'lead_form' | 'brochure_download'
  status: 'new' | 'viewed' | 'responded' | 'accepted' | 'declined' | 'converted' | 'archived'

  contact: {
    name: string
    email: string
    phone?: string
    company?: string
  }
  message?: string

  // Type-specific fields
  booking?: {
    packageName?: string
    preferredDateFrom?: string
    preferredDateTo?: string
  }
  rfq?: {
    budgetRange: string
    timeline: string
  }
  proposal?: {
    budget: number
    currency: string
    timelineFrom: string
    timelineTo: string
    attachmentUrl?: string
  }
  leadForm?: Record<string, string>   // dynamic key-value pairs

  conversationId?: string             // if replied to
  createdAt: string
  updatedAt: string
}
```

### 20.3 RecruiterProfile

```typescript
interface RecruiterProfile {
  id: string
  slug: string
  businessId: string
  userId: string            // must be a member of the business

  title: string
  bio: string
  specialties: string[]
  industries: string[]

  location: { country: string; city: string }
  remoteAvailable: boolean
  available: boolean

  linkedinUrl?: string
  profilePhoto?: string     // override of user profile photo
  coverBanner?: string

  linkedJobIds: string[]    // active jobs linked to this recruiter

  placementCount: number
  rating?: { average: number; count: number }

  createdAt: string
  updatedAt: string
}
```

### 20.4 Notification

```typescript
interface Notification {
  id: string
  recipientId: string
  recipientType: 'user' | 'business'
  businessId?: string       // set if recipientType = 'business'

  type: NotificationType
  title: string
  body: string
  actionUrl: string

  read: boolean
  createdAt: string
}

type NotificationType =
  | 'new_lead'
  | 'new_booking'
  | 'new_rfq'
  | 'new_message'
  | 'application_status'
  | 'brochure_download'
  | 'review_received'
  | 'team_invite'
  | 'booking_confirmed'
  | 'booking_declined'
  | 'new_application'     // business: someone applied to a job
  | 'team_member_joined'
  | 'team_member_left'
```

### 20.5 AccountContext (Pinia Store)

```typescript
interface ActiveContext {
  type: 'user' | 'business'
  userId: string
  businessId?: string
  businessName?: string
  businessLogo?: string
  role?: 'owner' | 'admin' | 'member'
}
```

---

## 21. Feature Flag Registry

Additions to `shared/features/featureFlags.ts`:

```typescript
// New flags required for overhaul

// Exchange hub & standalone pages
EXCHANGE_HUB_PAGE            // enable new /exchange hub design (replaces tab-based exchange)
SKILLS_STANDALONE_PAGE       // enable /skills standalone listing page
RECRUITERS_STANDALONE_PAGE   // enable /recruiters standalone listing page
BUSINESSES_STANDALONE_PAGE   // enable /businesses standalone listing page
EXCHANGE_HUB_SEARCH          // show search bar on /exchange hub hero

// Skills vertical
SKILLS_VERTICAL              // show Skills section row on Exchange hub
SKILL_BOOKING                // show Book Now CTA on skills
SKILL_RFQ                    // show Get Quote CTA on skills
SKILL_PROPOSAL               // show Submit Proposal CTA on skills
SKILL_BROCHURE               // show Download Brochure CTA
SKILL_LEAD_FORM              // show lead form on skill detail page

// Recruiter vertical
RECRUITERS_VERTICAL          // show Recruiters section row on Exchange hub
RECRUITER_PROFILES           // show recruiters in business dashboard

// Dashboard & account
USER_DASHBOARD               // enable /dashboard route
ACCOUNT_SWITCHER             // enable user↔business context switching

// Business messaging & notifications
BUSINESS_MESSAGES_INBOX      // enable /b/[id]/messages
BUSINESS_NOTIFICATIONS       // enable /b/[id]/notifications

// Discontinued
POSTS_VERTICAL               // set to false — hides Posts everywhere
```

---

## Appendix A — Component Inventory Delta

### New components to build

**Exchange Hub & Standalone Listing Pages**

| Component | Path | Description |
|---|---|---|
| `ExchangeHubPage` | `pages/exchange/index.vue` | Hub discovery page with section rows |
| `ExchangeHubSection` | `components/exchange/ExchangeHubSection.vue` | Reusable section row (title, subtitle, cards, "View More" link) |
| `ExchangeHubHero` | `components/exchange/ExchangeHubHero.vue` | Search bar + quick-browse chips |
| `SkillsListingPage` | `pages/skills/index.vue` | Standalone full skills listing (`/skills`) |
| `RecruitersListingPage` | `pages/recruiters/index.vue` | Standalone full recruiters listing (`/recruiters`) |
| `BusinessesListingPage` | `pages/businesses/index.vue` | Standalone full business directory (`/businesses`) |
| `BusinessCard` | `components/business/BusinessCard.vue` | Listing card for business directory (updated: Message CTA) |
| `VerticalFilterBar` | `components/exchange/VerticalFilterBar.vue` | Shared sticky filter bar for all standalone pages |

**Skills Vertical**

| Component | Path | Description |
|---|---|---|
| `SkillCard` | `components/skills/SkillCard.vue` | Listing card for skill vertical |
| `SkillDetailPage` | `pages/skills/[slug].vue` | Full skill detail page |
| `SkillActionPanel` | `components/skills/SkillActionPanel.vue` | Sticky right panel with CTAs |
| `SkillBookingDrawer` | `components/skills/SkillBookingDrawer.vue` | Booking intent form |
| `SkillRFQDrawer` | `components/skills/SkillRFQDrawer.vue` | RFQ form |
| `SkillProposalDrawer` | `components/skills/SkillProposalDrawer.vue` | Proposal form |
| `SkillBrochureDrawer` | `components/skills/SkillBrochureDrawer.vue` | Lead capture + download |
| `SkillLeadForm` | `components/skills/SkillLeadForm.vue` | Inline lead form on detail page |
| `SkillCreateForm` | `components/skills/SkillCreateForm.vue` | Multi-step create/edit form |
| `SkillPackageSelector` | `components/skills/SkillPackageSelector.vue` | Package picker (Basic/Std/Premium) |

**Recruiter Vertical**

| Component | Path | Description |
|---|---|---|
| `RecruiterCard` | `components/recruiter/RecruiterCard.vue` | Card for recruiter vertical |
| `RecruiterProfilePage` | `pages/recruiter/[slug].vue` | Public recruiter profile |
| `RecruiterCreateForm` | `components/recruiter/RecruiterCreateForm.vue` | Create/edit recruiter profile |
| `RecruiterContactDrawer` | `components/recruiter/RecruiterContactDrawer.vue` | Message recruiter form |

**Dashboard & Account System**

| Component | Path | Description |
|---|---|---|
| `UserDashboardLayout` | `layouts/UserDashboardLayout.vue` | Dashboard sidebar layout |
| `DashboardSidebar` | `components/dashboard/DashboardSidebar.vue` | Sidebar nav (user context) |
| `BusinessDashboardSidebar` | `components/dashboard/BusinessDashboardSidebar.vue` | Sidebar nav (business context) |
| `AccountSwitcher` | `components/apps/AccountSwitcher.vue` | Context switch modal |
| `LeadInbox` | `components/dashboard/LeadInbox.vue` | Lead list + detail panel |
| `LeadDetailPanel` | `components/dashboard/LeadDetailPanel.vue` | Lead detail view |
| `NotificationBell` | `components/apps/NotificationBell.vue` | Header bell with dropdown |
| `NotificationList` | `components/notifications/NotificationList.vue` | Full notification list |
| `BusinessMessagesHub` | `pages/b/[businessId]/messages/index.vue` | Business inbox |
| `BusinessNotificationsPage` | `pages/b/[businessId]/notifications/index.vue` | Business notification centre |
| `UserDashboardOverview` | `pages/dashboard/index.vue` | User dashboard home |
| `UserDashboardSkills` | `pages/dashboard/skills/index.vue` | My skills management |
| `UserDashboardLeads` | `pages/dashboard/leads/index.vue` | My leads inbox |
| `UserDashboardApplications` | `pages/dashboard/applications/index.vue` | Job applications list |

### Components to deprecate

| Component | Path | Reason |
|---|---|---|
| `ZydPostCreatorComponent` | `components/post/ZydPostCreatorComponent.vue` | Posts discontinued |
| `ZydPostListComponent` | `components/post/ZydPostListComponent.vue` | Posts discontinued |
| `ZydPostPreviewComponent` | `components/post/ZydPostPreviewComponent.vue` | Posts discontinued |
| `ZydPostHeaderComponent` | `components/post/ZydPostHeaderComponent.vue` | Posts discontinued |
| `ZydPostFooterComponent` | `components/post/ZydPostFooterComponent.vue` | Posts discontinued |
| `ZydPostCommentComponent` | `components/post/ZydPostCommentComponent.vue` | Posts discontinued |
| `ZydSponsoredContentComponent` | `components/sponsored/` | No longer needed in new layout |
| All `posts/Zyd*PostComponent` | `components/post/posts/` | Posts discontinued |
| `ZydPostDropdownComponent` | `components/apps/ZydPostDropdownComponent.vue` | Posts discontinued |

---

## Appendix B — Analytics Events (New)

Add to existing GA4 + internal analytics bridge:

| Event | Trigger | Parameters |
|---|---|---|
| `skill_view` | Skill detail page load | `skill_id`, `skill_category`, `owner_type` |
| `skill_book_intent` | Click "Book Now" | `skill_id`, `package_selected` |
| `skill_rfq_intent` | Click "Get Quote" | `skill_id` |
| `skill_proposal_intent` | Click "Submit Proposal" | `skill_id` |
| `skill_brochure_download` | Brochure downloaded | `skill_id`, `lead_captured` |
| `skill_lead_form_submit` | Lead form submitted | `skill_id` |
| `skill_booking_submitted` | Booking request sent | `skill_id`, `package_name` |
| `skill_rfq_submitted` | RFQ sent | `skill_id` |
| `skill_proposal_submitted` | Proposal sent | `skill_id` |
| `recruiter_view` | Recruiter profile page load | `recruiter_id`, `business_id` |
| `recruiter_contact_intent` | Click "Contact Recruiter" | `recruiter_id` |
| `recruiter_message_sent` | Message to recruiter sent | `recruiter_id` |
| `account_context_switch` | User switches context | `from_context`, `to_context` |
| `dashboard_tab_view` | Dashboard tab opened | `tab_name`, `context` |
| `lead_action` | Seller acts on a lead | `lead_type`, `action` (accept/decline/reply) |

---

*End of UI/UX Specification v1.0*  
*Next: Backend API Specification | Design Mockups | Component Build Plan*
