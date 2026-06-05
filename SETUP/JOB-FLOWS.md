# Job Flows — Business Management & User Applications

## Table of Contents
1. [Overview](#overview)
2. [TypeScript Types & Interfaces](#typescript-types--interfaces)
3. [Flow 1: Job Management (Business Accounts)](#flow-1-job-management-business-accounts)
4. [Flow 2: Job Application (Users)](#flow-2-job-application-users)
5. [Composables & State](#composables--state)
6. [Integrations](#integrations)
7. [Key File Index](#key-file-index)

---

## Overview

Two distinct flows share the jobs domain:

| Flow | Actor | Entry Point | Primary Component |
|---|---|---|---|
| Job Management | Business account owner | `/b/{businessId}` | `ZydJobPostComponent.vue` |
| Job Application | Authenticated user | `/jobs` → `/jobs/{jobId}` | `ZydJobApplicationForm.vue` |

Both flows use the same `JobIType` / `Job` data model but hit different API namespaces (`/api/job` vs `/api/business/jobs/{businessId}`).

---

## TypeScript Types & Interfaces

**Source:** `types/types.ts`

### `JobIType` — create/update payload
```ts
{
  id?: string
  title: string
  city: string
  country: string
  deadline: string                   // ISO date string
  category?: string
  industry?: string
  jobType?: string
  verified?: boolean
  description: JSONContent            // TipTap rich-text JSON
  postType: 'Job'
  applicationEmail?: string
  applicationUrl?: string
  contactMethod: string | null
  phone: string
  requirements: string
  benefits: string
  maxSalary: number
  minSalary: number
  currency: string
  yearsOfExperience: number
  educationRequirement: string
  additionalInformation: JSONContent  // TipTap rich-text JSON
  createdAt: string
  updatedAt: string
  businessId?: string
  JobApplication?: { id: string }[]
}
```

### `Job` — API response (extends `JobIType`)
```ts
{
  // ...all JobIType fields, plus:
  user: {
    firstName: string
    lastName: string
    profile: { username: string; profilePicture: string }
  }
  business: {
    id: string
    name: string
    slug: string
    logoUrl: string
  }
  job_view: string
  applicationCount?: number
  rating?: RatingRollup | null
}
```

### `JobApplicationInfo` — application submission payload
```ts
{
  id?: string
  summary: string
  languages: string[]
  skills: string[]
  workExperience: WorkExperience[]
  education: Education[]
  certifications: Certification[]
  achievements: Achievement[]
}
```

### Nested application types
```ts
WorkExperience {
  id: string
  company: string
  position: string
  location: string
  employmentType?: string            // Full-time | Part-time | Contract | Freelance
  startDate: string                  // YYYY-MM-DD
  endDate: string                    // YYYY-MM-DD | '' (empty = "Present")
  description: string
}

Education {
  id: string
  institution: string
  degree: string
  fieldOfStudy: string
  grade?: string
  startDate: string                  // YYYY-MM-DD
  endDate: string                    // YYYY-MM-DD | ''
  description: string
}

Certification {
  id: string
  title: string
  issuer: string
  issueDate: string                  // YYYY-MM-DD
  expirationDate: string             // YYYY-MM-DD | ''
  credentialUrl: string
}

Achievement {
  id: string
  title: string
  description: string
  date: string                       // YYYY-MM-DD
  recognitionLevel?: string          // Company | Regional | National | International
}
```

### Rating types
```ts
RatingRollup {
  listingId: string
  weightedAvg: number
  totalRatings: number
  totalFeedback: number
  star5Pct: number; star4Pct: number; star3Pct: number
  star2Pct: number; star1Pct: number
  pctLedToRealJob: number
  pctDescriptionMatch: number
  pctLocationCorrect: number
}

MyRating {
  stars: number
}
```

### Draft persistence type
```ts
JobApplicationDraft {
  applicationInfo: JobApplicationInfo
  selectedSkills: { id: string; name: string; value: string }[]
  lastSavedAt: number                // Unix timestamp
  mode: 'create' | 'update'
}
```

---

## Flow 1: Job Management (Business Accounts)

### Entry Points

| Route | Purpose |
|---|---|
| `/b/{businessId}` | Business workspace with jobs tab |
| Business dashboard — "Create Job" button | Opens creation modal |
| Business dashboard — job row actions | Edit / Archive / Delete |

---

### Job Creation — `ZydJobPostComponent.vue`

**Location:** `components/post/posts/job/ZydJobPostComponent.vue`

A 3-step modal form. Step validation gates progression.

#### Step 1 — General Details

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | text input | ✅ | Job title |
| `description` | TipTap rich text | ✅ | Max 6 000 chars |
| `jobType` | select | ✅ | Options from `jobTypeOptions` static data |
| `industry` | select | ✅ | Options from `industrySelectOptions` (S3) |
| `country` | select | ✅ | From `country_list` (S3) |
| `city` | select | ✅ | Populated after country selection from `cities_list` |
| `deadlineInput` | date picker | ✅ | Converted to ISO string before submission |
| `applicationMethod` | radio | ✅ | `'email'` or `'url'` |
| `applicationEmail` | email input | conditional | Required when `applicationMethod === 'email'` |
| `applicationUrl` | URL input | conditional | Required when `applicationMethod === 'url'` |
| `postForBusiness` | boolean toggle | — | Links the post to a business account |
| `businessId` | select | conditional | Required when `postForBusiness === true`; populated from `getUserBusinessList()` |

#### Step 2 — Job Details (Optional but Recommended)

| Field | Type | Notes |
|---|---|---|
| `minSalary` | number | Optional lower salary bound |
| `maxSalary` | number | Optional upper salary bound |
| `currency` | select | From `currencyOptions` |
| `yearsOfExperience` | number | Years required |
| `educationRequirement` | select | From `educationOptions` |
| `phone` | `ZydPhoneInputComponent` | Contact phone with country code |
| `contactMethod` | select | From phone input component |
| `additionalInformation` | TipTap rich text | Max 6 000 chars; requirements, benefits, etc. |

#### Step 3 — Preview

Read-only preview of all fields. Submits on confirm.

#### Validation Rules

- `canProceedFromCurrentStep` computed guards each step transition
- Step 1 requires: `title`, `description`, `jobType`, `industry`, `country`, `city`, `deadline`, and one of `applicationEmail` / `applicationUrl`
- Step 2 fields are optional; numeric bounds are validated if provided
- Both rich-text fields enforce `maxLength: 6000`

---

### Business-Side API Endpoints

**API utility source:** `components/templates/jobs/utils/jobs.api.utils.ts`

All business endpoints are under `/api/business/jobs/{businessId}`.

#### Create Job
```
POST /api/job
Body: { data: { ...JobIType, email: string } }
Returns: ResponseIType
```
Called via `createJob(payload, email)` in `useJobs()` composable.

#### Update Job (business-owned)
```
PUT /api/business/jobs/{businessId}
Body: { data: { ...JobIType, email: string } }
Returns: ResponseIType
```
Called via `updateBusinessJobPost(payload, email, businessId)` in `useBusinessAccount()`.

#### Update Job (personal/user-owned)
```
PUT /api/job/
Body: { data: job, updatedBy: email }
Credentials: include
Returns: ResponseIType
```
Called via `updateJobApi(job, userEmail)` in `shared/utils/jobs/jobs.utils.api.ts`.

#### Fetch Jobs for Business
```
GET /api/business/jobs/{businessId}
Returns: { data: { jobs: Job[] } }
```
Called via `fetchJobsForBusiness(businessId)`.

#### Archive / Unarchive Job
```
PATCH /api/business/jobs/{businessId}/{status}
  status: 'archive' | 'unarchive'
Body: { data: { id: string } }
Returns: ResponseIType
```
Called via `archiveJob({ businessId, id, status })`.

#### Delete Job
```
DELETE /api/business/jobs/{businessId}/{id}
Returns: ResponseIType
```
Called via `deleteJob(businessId, id)`.

#### Fetch Applications for Business
```
GET /api/business/jobs/{businessId}/applications
Returns: { data: { applications: JobApplicationInfo[] } }
```
Called via `fetchApplicationsForBusiness(businessId)`.

#### Mark Application Reviewed
```
POST /api/business/jobs/{businessId}/applications/mark-reviewed
Body: { data: { id: string } }
Returns: ResponseIType
```
Called via `markApplicationReviewed({ businessId, id })`.

#### Get Business Info
```
GET /api/business/account/{businessId}   — by ID
GET /api/business/{slug}                 — by slug
Returns: Business details including jobs and applications
```

#### List User's Businesses
```
GET /api/user/businesses
Returns: Array<{ business: Business; role: string }>
```

---

### Job Management Data Flow

```
Business user → /b/{businessId}
  │
  ├─ getUserBusinessList()     GET /api/user/businesses
  ├─ getBusinessById()         GET /api/business/account/{businessId}
  │
  ├─ [Create Job]
  │    └─ ZydJobPostComponent (3-step modal)
  │         └─ createJob()    POST /api/job
  │
  ├─ [Edit Job]
  │    └─ ZydJobPostComponent (pre-filled, same 3-step modal)
  │         └─ updateBusinessJobPost()  PUT /api/business/jobs/{businessId}
  │
  ├─ [Archive/Unarchive Job]
  │    └─ archiveJob()        PATCH /api/business/jobs/{businessId}/{status}
  │
  ├─ [Delete Job]
  │    └─ deleteJob()         DELETE /api/business/jobs/{businessId}/{id}
  │
  └─ [Review Applications]
       ├─ fetchApplicationsForBusiness()  GET /api/business/jobs/{businessId}/applications
       └─ markApplicationReviewed()       POST /api/business/jobs/{businessId}/applications/mark-reviewed
```

---

## Flow 2: Job Application (Users)

### Entry Points

| Route | Purpose |
|---|---|
| `/jobs` | Browse and filter all jobs |
| `/jobs/{jobId}` | Job detail with application panel |

---

### Job Listing Page — `pages/jobs/index.vue`

811-line page. Combines a sticky filter bar, infinite-scroll grid, and SEO injection.

#### Filter Fields

| Field | Type | Options |
|---|---|---|
| `filters.country` | chip select | From `country_list` (S3) |
| `filters.city` | chip select | From `cities_list`, dependent on country |
| `filters.jobType` | chip select | From `jobTypeOptions` |
| `filters.industry` | chip select | From `industrySelectOptions` (S3) |
| `filters.minSalary` | number input | Free entry |
| `filters.maxSalary` | number input | Free entry |
| `filters.deadline` | date picker | ISO date string |

#### Sort Options

| Value | Label |
|---|---|
| `datePosted` | Newest First (default) |
| `deadlineSoonest` | Deadline Soonest |
| `salaryHigh` | Salary: High to Low |
| `salaryLow` | Salary: Low to High |

#### Pagination

Uses `useListingInfiniteScroll` composable backed by `IntersectionObserver`. Anchor always in DOM (no `v-if`). Post-load viewport check re-triggers if anchor is still visible after page load (see CLAUDE.md rule 8).

#### Analytics

`selectFilter` fires `job_filter_applied` with `{ filter_field, filter_value }` via `useGtag`.  
`setSortOption` fires `job_sort_changed` with `{ sort_option }` via `useGtag`.

---

### Job Detail Page — `pages/jobs/[jobid].vue`

652-line page. Three-column layout on desktop; full-screen overlay on mobile.

- Left panel: filter chips (same as index page)
- Centre panel: job list
- Right panel: `ZydJobBoardDetailPanel.vue` — job description, meta pills, apply button

Meta pills shown in detail panel:

| Pill | Source field |
|---|---|
| Location | `country`, `city` |
| Job Type | `jobType` |
| Salary range | `minSalary`, `maxSalary`, `currency` |
| Industry | `industry` |
| Experience | `yearsOfExperience` |
| Education | `educationRequirement` |
| Deadline | `deadline` |
| Views | `job_view` |

---

### Application Form — `ZydJobApplicationForm.vue`

**Location:** `components/job/application/ZydJobApplicationForm.vue`

Multi-step form with draft persistence via `useJobApplicationDraftStore` (Pinia).

#### Step 0 — Personal Summary (`JobApplicationSummary.vue`)

| Field | Type | Required | Notes |
|---|---|---|---|
| `summary` | textarea (5 rows) | ✅ | Professional summary |
| `selectedSkills` | chip input | ✅ | Picked from `allSkills` array (S3); no free-form entries |

#### Step 1 — Work Experience (`JobApplicationWorkExperience.vue`)

At least one entry required. Multiple entries supported.

| Field | Type | Required | Notes |
|---|---|---|---|
| `company` | text | ✅ | |
| `position` | text | ✅ | |
| `location` | select | — | From `country_list` |
| `employmentType` | select | — | Full-time / Part-time / Contract / Freelance |
| `startDate` | date | ✅ | YYYY-MM-DD |
| `endDate` | date | — | Empty = "Present" |
| `description` | textarea (3 rows) | — | |

Validation: `endDate` must be after `startDate` when provided.

#### Step 2 — Education (`JobApplicationEducation.vue`)

At least one entry required. Multiple entries supported.

| Field | Type | Required | Notes |
|---|---|---|---|
| `institution` | datalist input | ✅ | Autocomplete from `universities_list` (S3) |
| `degree` | datalist | ✅ | From `type_of_degree` (S3) |
| `fieldOfStudy` | datalist | — | From `field_of_study` (S3) |
| `grade` | text | — | GPA or classification |
| `startDate` | date | ✅ | YYYY-MM-DD |
| `endDate` | date | — | Empty = "Present" |
| `description` | textarea (2 rows) | — | |

Validation: same end-after-start rule as work experience.

#### Step 3 — Certifications & Achievements (`JobApplicationCertificationsAchievements.vue`)

Both sections are optional. Multiple entries supported.

**Certifications:**

| Field | Type | Notes |
|---|---|---|
| `title` | text | Certificate name |
| `issuer` | text | Issuing organisation |
| `issueDate` | date | YYYY-MM-DD |
| `expirationDate` | date | YYYY-MM-DD or '' |
| `credentialUrl` | URL | Link to online credential |

**Achievements:**

| Field | Type | Notes |
|---|---|---|
| `title` | text | Achievement name |
| `description` | textarea (2 rows) | |
| `date` | date | YYYY-MM-DD |
| `recognitionLevel` | select | Company / Regional / National / International |

Validation: `expirationDate` must be after `issueDate` when provided.

---

### CV Upload — `ZydCVUploadComponent`

Uploads a CV file and returns a `CVExtractedData` object that auto-fills the form:

| Extracted field | Maps to |
|---|---|
| `summary` | Step 0 `summary` |
| `skills` | Step 0 `selectedSkills` |
| `workExperience[]` | Step 1 entries |
| `education[]` | Step 2 entries |
| `certifications[]` | Step 3 certifications |
| `achievements[]` | Step 3 achievements |

**Type source:** `types/cv.types`

---

### User-Side API Endpoints

**API utility source:** `shared/utils/jobs/jobs.utils.api.ts`

#### Fetch All Jobs
```
GET /api/job?limit=500
Returns: { data: { jobs: Job[] } }
```
Called via `fetchJobsApi()` → consumed by `useJobs()` composable.

#### Submit Application
```
POST /api/job/application
Credentials: include
Body: { data: JobApplicationInfo }
Returns: ResponseIType
```
Called via `submitJobApplicationApi(payload)`.

#### Update Application Info
```
PUT /api/job/application/info/{username}
Credentials: include
Body: JobApplicationInfo
Returns: ResponseIType
```
Called via `updateApplicationInfoApi(username, payload)` for re-submissions.

#### Archive Job (user context)
```
POST /api/job/{jobId}/archive
Credentials: include
Returns: ResponseIType
```
Called via `archiveJobApi(jobId)`.

#### Fetch User Profile
```
GET /api/user/profile/{username}
Credentials: include
Returns: User profile including application history
```
Called via `fetchUserProfileApi(username)`.

#### Get Job Ratings
```
GET /api/ratings/job/{jobId}
Credentials: include
Returns: { data: { rollup: RatingRollup; mine: MyRating } }
```
Called via `load()` in `useJobRating()`.

#### Submit Job Rating
```
POST /api/ratings/job/{jobId}
Credentials: include
Body: { stars: number; businessId?: string }
Returns: { ok?: boolean; alreadyRated?: boolean; rateLimited?: boolean; error?: boolean }
```
Error codes handled: `409` (already rated), `429` (rate limited).  
Called via `submit(stars, businessId)` in `useJobRating()`.

---

### Application Data Flow

```
User → /jobs
  │
  ├─ fetchJobsApi()            GET /api/job?limit=500
  ├─ useJobSEO.applyIndexSEO() — sets meta + JSON-LD job list schema
  │
  ├─ [Select job] → /jobs/{jobId}
  │    ├─ useJobSEO.applyDetailSEO(job) — sets detail meta + JSON-LD job posting schema
  │    ├─ useAnalyticsEvent.trackEvent('job_view', { jobId, userId, ... })
  │    ├─ useJobRating.load()   GET /api/ratings/job/{jobId}
  │    │
  │    └─ [Click Apply]
  │         └─ ZydJobApplicationForm (4-step modal)
  │              │
  │              ├─ [Optional] ZydCVUploadComponent → auto-fills all steps
  │              │
  │              ├─ Step 0: Summary + Skills
  │              ├─ Step 1: Work Experience (≥1 entry)
  │              ├─ Step 2: Education (≥1 entry)
  │              ├─ Step 3: Certifications & Achievements (optional)
  │              │
  │              └─ submitJobApplicationApi()  POST /api/job/application
  │                   └─ Success: confirmation shown, draft cleared
  │
  └─ [Rate job]
       └─ useJobRating.submit()  POST /api/ratings/job/{jobId}
```

---

## Composables & State

### `useJobs()` — `composables/usePosts.ts`

| Method | API call | Description |
|---|---|---|
| `fetchJobs()` | `GET /api/job?limit=500` | Loads all jobs into reactive `jobs` ref |
| `createJob(payload, email)` | `POST /api/job` | Creates new job post |
| `updateJob(payload, email)` | `PUT /api/job/` | Updates user-owned job |
| `archiveJob(id)` | `POST /api/job/{id}/archive` | Soft-deletes job |

Reactive state: `jobs`, `loading`, `processing`, `error`

### `useBusinessAccount()` — `composables/useBusinessAccount.ts`

| Method | API call | Description |
|---|---|---|
| `getBusinessById(id)` | `GET /api/business/account/{id}` | Fetch single business |
| `getBusinessBySlug(slug)` | `GET /api/business/{slug}` | Fetch by URL slug |
| `getUserBusinessList()` | `GET /api/user/businesses` | List current user's businesses |
| `getBusinessList()` | `GET /api/business` | List all businesses |
| `updateBusinessJobPost(payload, email, businessId)` | `PUT /api/business/jobs/{businessId}` | Update business-owned job |

Reactive state: `loading`, `error`  
Computed: `isAuth`, `defaultBusiness`

### `useStaticData()` — `composables/useStaticData.ts`

Lazily fetches reference data from S3. Used by both flows.

| Ref | Contents |
|---|---|
| `country_list` | All countries for location selects |
| `cities_list` | Cities keyed by country code |
| `industrySelectOptions` | Industry categories |
| `universities_list` | University names for education autocomplete |
| `field_of_study` | Academic fields for education autocomplete |
| `type_of_degree` | Degree types for education autocomplete |
| `allSkills` | Skill tags for application skill picker |

Loading flags: `countriesPending`, `geoPending`

### `useJobSEO()` — `composables/seo/useJobSEO.ts`

| Method | Description |
|---|---|
| `applyIndexSEO()` | Sets `useSeoMeta` tags for `/jobs` |
| `applyDetailSEO(job)` | Sets `useSeoMeta` tags for `/jobs/{jobId}` |
| `injectIndexStructuredData(jobs)` | Injects JSON-LD breadcrumb + ItemList schema |
| `injectDetailStructuredData(job)` | Injects JSON-LD breadcrumb + JobPosting schema |

### `useJobRating()` — `composables/useJobRating.ts`

| Method | API call | Description |
|---|---|
| `load()` | `GET /api/ratings/job/{jobId}` | Fetch rating data |
| `submit(stars, businessId)` | `POST /api/ratings/job/{jobId}` | Submit user rating |

Reactive state: `rollup`, `mine`, `loading`, `submitting`, `rateLimited`, `submitError`

### `useJobApplicationDraftStore` — `stores/jobApplicationInfoDraft.store.ts`

Pinia store. Persists `ZydJobApplicationForm` state across navigation.

| Property/Method | Description |
|---|---|
| `hasDraft` | Boolean — draft exists |
| `draft` | `JobApplicationDraft` object |
| `clearDraft()` | Deletes stored draft |

### `useListingInfiniteScroll` — `composables/useListingInfiniteScroll.ts`

Wraps `useInfiniteObserver` for paginated job lists. Post-load viewport check ensures second page triggers automatically when all first-page items fit the viewport.

---

## Integrations

### Authentication
- All mutating endpoints require `credentials: 'include'` (session cookie)
- Auth state from `useLoginStore` (Pinia)
- `isAuthenticated()` guard in `useBusinessAccount`
- Unauthenticated users can browse jobs but cannot apply or rate

### SEO & Structured Data
- Dynamic `<meta>` tags via Nuxt `useSeoMeta` on every job page
- JSON-LD `JobPosting` schema on detail pages
- JSON-LD `ItemList` + `BreadcrumbList` on listing page
- OpenGraph + Twitter Card tags for social sharing

### Analytics (GA4)
- **Measurement ID:** `G-8Z8EDQHMGC`
- All custom events go through `useAnalyticsEvent` → forwards to `gtag('event', ...)` then `POST /api/analytics/events`
- UI-only events (filter, sort) call `useGtag` directly — no backend hit

| Event | Trigger | Fields |
|---|---|---|
| `job_view` | Job detail page load | `jobId`, `userId`, action metadata |
| `job_filter_applied` | Filter chip changed (value set) | `filter_field`, `filter_value` |
| `job_sort_changed` | Sort option changed | `sort_option` |

**Safe wrapper:** `composables/utils/useGtag.ts` — always import this; never call `window.gtag` directly.

### Rich Text (TipTap)
- `description` and `additionalInformation` on job posts are `JSONContent` (TipTap's internal format)
- Rendered read-only in detail panel via `TipTapReadOnly` component
- 6 000 character limit enforced in the editor

### File Upload (CV)
- `ZydCVUploadComponent` handles file selection and upload
- Returns structured `CVExtractedData` (type: `types/cv.types`) 
- Extracted fields auto-populate all four application form steps

### Form Components
All form inputs are custom Zyd design-system components:

| Component | Usage |
|---|---|
| `ZydSelectComponent` | Country, industry, job type, education, currency |
| `ZydInputComponent` | Text, email, date, URL, number |
| `ZydTextareaComponent` | Multi-line text |
| `ZydChipInputComponent` | Skill selection |
| `ZydDatalistInputComponent` | Autocomplete (institution, degree, field) |
| `ZydPhoneInputComponent` | Phone number with country code |

### Responsive Behaviour
- `/jobs`: sticky filter bar (`top-16`), collapsible mobile panel, infinite-scroll grid
- `/jobs/{jobId}`: 3-column desktop layout; full-screen overlay on mobile
- Form modals: full-screen on mobile, centred modal on desktop

---

## Key File Index

### Pages
| File | Purpose |
|---|---|
| `pages/jobs/index.vue` | Job listing with filters + infinite scroll |
| `pages/jobs/[jobid].vue` | Job detail + application trigger |
| `pages/businesses/` | Business management area (see `pages/businesses/`) |

### Core Components
| File | Purpose |
|---|---|
| `components/post/posts/job/ZydJobPostComponent.vue` | 3-step job creation/edit modal |
| `components/job/application/ZydJobApplicationForm.vue` | 4-step application form |
| `components/job/application/JobApplicationSummary.vue` | Step 0: Summary + skills |
| `components/job/application/JobApplicationWorkExperience.vue` | Step 1: Work experience |
| `components/job/application/JobApplicationEducation.vue` | Step 2: Education |
| `components/job/application/JobApplicationCertificationsAchievements.vue` | Step 3: Certs + achievements |
| `components/board/ZydJobBoardDetailPanel.vue` | Job detail view with meta pills |

### API Utilities
| File | Purpose |
|---|---|
| `shared/utils/jobs/jobs.utils.api.ts` | User-facing job & application API calls |
| `components/templates/jobs/utils/jobs.api.utils.ts` | Business-facing job management API calls |
| `components/templates/jobs/utils/jobs.format.utils.ts` | Data mapping helpers |
| `components/templates/jobs/utils/jobs.static.utils.ts` | Static column/option definitions |
| `components/templates/jobs/utils/jobs.helpers.utils.ts` | Miscellaneous helper utilities |

### Composables
| File | Purpose |
|---|---|
| `composables/usePosts.ts` | `useJobs()` — job CRUD + state |
| `composables/useBusinessAccount.ts` | Business account operations |
| `composables/useStaticData.ts` | S3-backed reference data |
| `composables/seo/useJobSEO.ts` | SEO + structured data |
| `composables/useJobRating.ts` | Job rating load + submit |
| `composables/useInfiniteObserver.ts` | IntersectionObserver wrapper |
| `composables/useListingInfiniteScroll.ts` | Paginated scroll state |
| `composables/utils/useGtag.ts` | Safe GA4 `gtag()` wrapper |

### Stores
| File | Purpose |
|---|---|
| `stores/jobApplicationInfoDraft.store.ts` | Application form draft persistence |

### Types
| File | Purpose |
|---|---|
| `types/types.ts` | `JobIType`, `Job`, `JobApplicationInfo`, all nested types |
| `types/cv.types` | `CVExtractedData` for CV upload extraction |
