 # API Routes & Integrations — zyd-frontend-microservice

**Last updated:** 2026-05-22  
**Stack:** Nuxt 3 / Nitro / Vue 3

---

## Table of Contents

1. [Environment Variables](#1-environment-variables)
2. [Server-Side API Routes](#2-server-side-api-routes)
3. [Client-Side API Calls](#3-client-side-api-calls)
4. [Dynamic Page Routes](#4-dynamic-page-routes)
5. [External Service Integrations](#5-external-service-integrations)
6. [Composables API Reference](#6-composables-api-reference)
7. [Nuxt Config Reference](#7-nuxt-config-reference)

---

## 1. Environment Variables

All runtime config is injected via `.env` and surfaced through `nuxt.config.ts → runtimeConfig`.

| Variable | Scope | Required | Description |
|---|---|---|---|
| `NUXT_PUBLIC_APP_URL` | Client + Server | Yes | Backend REST API base URL (e.g. `https://api.zeemic.com`) |
| `NUXT_PUBLIC_AUTH_URL` | Client + Server | No | Auth service base URL; falls back to `NUXT_PUBLIC_APP_URL` if unset |
| `NUXT_PUBLIC_STORAGE_URL` | Client + Server | Yes | S3-compatible base URL used by `/api/resource/[resource]` for static asset fallback |
| `NUXT_CRYPTO_SECRET` | Server only | Yes | AES-GCM symmetric key for encrypting sensitive query params (e.g. `category`) before forwarding to the backend |

Access in server routes:
```ts
const config = useRuntimeConfig()
config.cryptoSecret           // server-only
config.public.appUrl          // client + server
config.public.authUrl         // client + server
config.public.storageUrl      // client + server
config.public.siteUrl         // hardcoded: "https://zeemic.com"
```

---

## 2. Server-Side API Routes

All files live under `server/api/`. Nitro exposes them at `/api/*`. Requests that reach these handlers are proxied to the backend or processed server-side.

### Header sanitisation (applied by most proxy routes)

Only the following request headers are forwarded to the backend:
`authorization`, `content-type`, `accept`, `user-agent`, `x-requested-with`, `set-cookie`

Additional headers injected by the proxy:
- `x-api-gateway: nuxt-proxy`
- `x-forwarded-for: <client IP>`

Set-Cookie responses from the backend have the `Domain=` attribute stripped before being forwarded to the browser.

---

### `GET /api/client-ip`

**File:** `server/api/client-ip.ts`

Returns the requesting client's IP address. Reads `x-forwarded-for` header first (proxy-aware).

```jsonc
// Response
{ "ip": "41.189.0.1" }
```

---

### `GET /api/resource/[resource]`

**File:** `server/api/resource/[resource].get.ts`

Serves static reference data (countries, industries, skills, etc.) with server-side caching via Nitro's `assets:server` storage. On first miss, fetches from S3 and caches indefinitely until restart.

| Param | Type | Description |
|---|---|---|
| `resource` | path | Resource name, resolved to `${NUXT_PUBLIC_STORAGE_URL}/api/{resource}.json` on S3 |

**Registered resources (consumed by client):**

| Resource name | S3 Path | Consumer |
|---|---|---|
| `geo` | `/api/geo.json` | `useStaticData` |

---

### `ANY /api/auth/[...path]`

**File:** `server/api/auth/[...path].ts`

Proxy for all auth-service routes. Strips sensitive headers, rewrites Set-Cookie, and forwards to `NUXT_PUBLIC_AUTH_URL` (fallback: `NUXT_PUBLIC_APP_URL`).

**Matched routes (examples):**

| Method | Proxied path | Purpose |
|---|---|---|
| `POST` | `/api/auth/login` | Password login |
| `POST` | `/api/auth/logout` | Session termination |
| `POST` | `/api/auth/register` | New account creation |
| `POST` | `/api/auth/refresh` | Token refresh |
| `GET` | `/api/auth/login/verify` | Email verification link |

---

### `ANY /api/user/profile/[username]`

**File:** `server/api/user/profile/[username].ts`

Proxies to backend `/user/profile/{username}`. Supports all HTTP methods; body forwarded on `PATCH`, `POST`, `PUT`, `DELETE`.

| Param | Type | Description |
|---|---|---|
| `username` | path | Target user's username |

---

### `ANY /api/user/profile/me/info`

**File:** `server/api/user/profile/me/info.ts`

Returns authenticated user's own profile info. Proxies to backend `/user/profile/me/info`. Structured error responses: `{ statusCode, statusMessage }`.

---

### `ANY /api/user/upload/profile/[username]`

**File:** `server/api/user/upload/profile/[username].ts`

Handles profile image uploads. Proxies multipart form data to backend `/user/upload/profile/{username}`.

| Param | Type | Description |
|---|---|---|
| `username` | path | Owner of the profile being updated |

---

### `ANY /api/user/admin/[...path]`

**File:** `server/api/user/admin/[...path].ts`

Admin catch-all proxy. Encrypts the `category` query parameter using AES-GCM (`NUXT_CRYPTO_SECRET`) before forwarding to backend `/user/admin/{path}`. Supports nested paths.

---

### `ANY /api/post`

**File:** `server/api/post.ts`

Proxies to backend `/post`. Encrypts query parameters using runtime crypto secret. Supports all HTTP methods.

---

### `ANY /api/[...path]` *(catch-all)*

**File:** `server/api/[...path].ts`

Generic fallback proxy for every `/api/*` route not matched by a more specific handler. Path format is validated before forwarding.

**Proxied to:** `${NUXT_PUBLIC_APP_URL}/{path}`

This single handler covers all domain-specific backend endpoints not explicitly listed above, including:

| Prefix | Domain |
|---|---|
| `/api/marketplace/*` | Marketplace listings (products, portfolios, stores, projects, reviews, recommendations) |
| `/api/messaging/*` | Real-time messaging, conversations, presence |
| `/api/notification/*` | Notifications read/unread |
| `/api/ratings/*` | Job ratings and feedback sessions |
| `/api/analytics/events` | Internal event tracking |
| `/api/intelligence/*` | Career intelligence and scoring |
| `/api/business/*` | Business account management |
| `/api/career/*` | Career actions, insights, role discovery |
| `/api/user/*` | User data not covered by specific routes |

---

## 3. Client-Side API Calls

### Convention

- **SSR / component setup:** use `useFetch(url, options)` — returns reactive refs, hydration-safe
- **Post-mount / event handlers / infinite scroll / pagination:** use `$fetch(url, options)` — imperative, no stale refs

---

### Static Reference Data (`composables/useStaticData.ts`)

All calls use `useFetch` with client-only guard. Data is fetched once and cached in memory.

| Data | Source | Path |
|---|---|---|
| Country codes | AWS S3 (direct) | `https://zyd-object-store.s3.us-east-1.amazonaws.com/api/country_codes.json` |
| Industries | AWS S3 (direct) | `https://zyd-object-store.s3.us-east-1.amazonaws.com/api/industries.json` |
| Technical skills | AWS S3 (direct) | `https://zyd-object-store.s3.us-east-1.amazonaws.com/api/technical_skills.json` |
| Social skills | AWS S3 (direct) | `https://zyd-object-store.s3.us-east-1.amazonaws.com/api/social_skills.json` |
| Universities | AWS S3 (direct) | `https://zyd-object-store.s3.us-east-1.amazonaws.com/api/universities.json` |
| Field of study | AWS S3 (direct) | `https://zyd-object-store.s3.us-east-1.amazonaws.com/api/field_of_study.json` |
| Degree types | AWS S3 (direct) | `https://zyd-object-store.s3.us-east-1.amazonaws.com/api/type_of_degree.json` |
| Geo (cities) | Nitro server cache | `/api/resource/geo` |

---

### Messaging (`composables/messages/useMessages.ts`)

All calls use `$fetch` (post-mount, real-time). Socket.io handles live push; REST handles history/state.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/messaging/conversations?userId={userId}` | List all conversations for user |
| `GET` | `/api/messaging/conversations/{conversationId}` | Fetch single conversation |
| `PATCH` | `/api/messaging/conversations/{conversationId}` | Update conversation (e.g. rename) |
| `DELETE` | `/api/messaging/conversations/{conversationId}` | Delete conversation |
| `PATCH` | `/api/messaging/conversations/{conversationId}/read` | Mark conversation as read |
| `GET` | `/api/messaging/messages/conversation/{conversationId}` | Fetch message history |
| `POST` | `/api/messaging/messages` | Send new message |
| `PATCH` | `/api/messaging/messages/{messageId}` | Edit message |
| `DELETE` | `/api/messaging/messages/{messageId}` | Delete message |
| `GET` | `/api/messaging/messages/unread-count?userId={userId}` | Get unread count badge |
| `GET` | `/api/messaging/users/presence?{queryParams}` | Check online presence for user(s) |

**Real-time transport:** Socket.io client plugin (`plugins/socket.client.ts`). Socket connects on client mount; messages arrive via socket events and are merged into the local conversation state.

---

### Recipient Selection (`composables/messages/useConversationRecipients.ts`)

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/user/all` | Fetch all users available for direct messaging |

---

### Ratings (`composables/useRatingSession.ts`, `useJobRating.ts`, `useRatingFeedback.ts`)

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/ratings/session` | Open a new rating session |
| `GET` | `/api/ratings/job/{id}` | Fetch current rating state for a job |
| `PATCH` | `/api/ratings/job/{id}` | Submit / update a job rating |
| `POST` | `/api/ratings/job/{id}/feedback` | Submit detailed feedback for a rated job |
| `POST` | `/api/ratings/feedback` | Submit general (non-job) feedback |

---

### Notifications (`stores/notificationStore.ts`, `composables/useNotifications.ts`)

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/notification` | Fetch notification list |
| `PATCH` | `/api/notification/{notificationId}/read` | Mark single notification as read |
| `PATCH` | `/api/notification/read-all` | Mark all notifications as read |

---

### Marketplace (`composables/marketplace/*`)

All use `useFetch`. Search calls accept standard query params (`q`, `page`, `limit`, `filters`).

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/marketplace/products/{productId}` | Single product detail |
| `GET` | `/api/marketplace/products/search` | Search/filter products |
| `GET` | `/api/marketplace/portfolios/{portfolioId}` | Single portfolio detail |
| `GET` | `/api/marketplace/portfolios/search` | Search/filter portfolios |
| `GET` | `/api/marketplace/stores/{storeId}` | Single store detail |
| `GET` | `/api/marketplace/stores/search` | Search/filter stores |
| `GET` | `/api/marketplace/projects/{projectId}` | Single project detail |
| `GET` | `/api/marketplace/projects/search` | Search/filter projects |
| `GET` | `/api/marketplace/reviews/{reviewId}` | Single review detail |
| `GET` | `/api/marketplace/reviews/search` | Search/filter reviews |
| `GET` | `/api/marketplace/recommended/personalized` | Personalised recommendations |

---

### Posts (`composables/usePosts.ts`)

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/post` | Fetch paginated post feed |
| `POST` | `/api/post` | Create new post |
| `PATCH` | `/api/post` | Update / archive post |

---

### Analytics (`composables/analytics/useAnalyticsEvent.ts`)

Dual-posts every event: once to GA4 via `gtag('event', ...)`, once to the backend for internal logging.

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/analytics/events` | Log custom event to backend |

**Tracked events:**

| Event name | Fired from | Params |
|---|---|---|
| `job_view` | Job detail page | `job_id`, `job_title` |
| `profile_view` | User/recruiter profile | `username` |
| `marketplace_view` | Exchange hub | — |
| `marketplace_vertical_view` | Exchange section | `vertical` |
| `marketplace_item_click` | Any listing card | `item_id`, `vertical` |
| `marketplace_favorite_toggle` | Heart button | `item_id`, `state` |
| `marketplace_tab_navigation` | Exchange tabs | `tab` |
| `marketplace_load_more` | Infinite scroll | `vertical`, `page` |
| `marketplace_session_duration` | On unload | `seconds` |
| `job_filter_applied` | Jobs filter chips | `filter_field`, `filter_value` |
| `job_sort_changed` | Jobs sort dropdown | `sort_option` |

---

### Business (`composables/useBusinessAccount.ts`, `components/templates/brand.vue`)

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/business/{businessId}` | Fetch business details |
| `GET` | `/api/business/account/*` | Business account management |

---

### Career Intelligence (`composables/useIntelligence.ts`)

AI-powered endpoints share a **5 requests/hour per-user** budget. A `429` response sets `rateLimited = true` in the composable and surfaces the server message; it is never re-thrown unhandled.

| Method | Endpoint | Cache TTL | Purpose |
|---|---|---|---|
| `GET` | `/api/career/actions` | DB read (no AI) | Fetch cached career action cards |
| `POST` | `/api/career/actions/refresh` | — | Trigger AI refresh of career actions |
| `GET` | `/api/career/insights` | 7 days | Lazy-generate market insights on first call |
| `GET` | `/api/career/role-discovery` | 72 hours | Fetch role discovery result (null until triggered) |
| `POST` | `/api/career/role-discovery/trigger` | — | Manually trigger role discovery |
| `PUT` | `/api/profile` | — | Update profile; setting `targetRole` triggers role discovery async |

Score breakdown: each component (role_fit, skills, experience, education, market_demand) is returned as an integer **0–20**. Total max = 100. Bar width = `(value / 20) * 100 + '%'`.

---

### Auth Verification (`components/button/verify.vue`)

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `${NUXT_PUBLIC_APP_URL}/auth/login/verify` | Validate email verification token |

---

## 4. Dynamic Page Routes

All file-based routes under `pages/`. Parameters are extracted via `useRoute().params`.

### Single-param routes

| URL pattern | File | Param | Description |
|---|---|---|---|
| `/business/:slug` | `pages/business/[slug].vue` | `slug` | Public business profile |
| `/exchange/:vertical?` | `pages/exchange/[[vertical]].vue` | `vertical` (optional) | Exchange hub, optionally pre-filtered to a vertical (`skills`, `recruiters`, `jobs`, `businesses`) |
| `/jobs/:jobid` | `pages/jobs/[jobid].vue` | `jobid` | Single job detail |
| `/messages/:id` | `pages/messages/[id].vue` | `id` | Conversation thread |
| `/notifications/:username` | `pages/notifications/[username].vue` | `username` | User notifications (scoped) |
| `/recruiter/:slug` | `pages/recruiter/[slug].vue` | `slug` | Public recruiter profile |
| `/skills/:id` | `pages/skills/[id]/index.vue` | `id` | Skill listing detail |
| `/skills/:id/edit` | `pages/skills/[id]/edit.vue` | `id` | Edit owned skill listing |
| `/user/profile/:username` | `pages/user/profile/[username].vue` | `username` | Public user profile |

### Nested-param routes (business dashboard)

| URL pattern | File | Params | Description |
|---|---|---|---|
| `/b/:businessId` | `pages/b/[businessId]/index.vue` | `businessId` | Business dashboard overview |
| `/b/:businessId/chat/:conversationId` | `pages/b/[businessId]/chat/[conversationId].vue` | `businessId`, `conversationId` | Business-scoped chat thread |
| `/b/invite/:inviteId` | `pages/b/invite/[inviteId].vue` | `inviteId` | Business invite acceptance |

### Route priority note

`pages/exchange.vue` (root-level file) takes priority over `pages/exchange/[[vertical]].vue` for the exact path `/exchange`. The `[[vertical]].vue` file handles `/exchange/skills`, `/exchange/recruiters`, etc.

### Prerendered static routes

Configured in `nuxt.config.ts → routeRules`:

| Route | Mode |
|---|---|
| `/guidelines` | `prerender: true` |
| `/terms` | `prerender: true` |
| `/policies/**` | `prerender: true` |
| `/landing` | `prerender: true` |

---

## 5. External Service Integrations

### Google Fonts

| Detail | Value |
|---|---|
| Family | Inter (400, 500, 600, 700) |
| Family | Fraunces (ital, opsz 9–144, wght 300–900) — loaded via `zeemic-v2.css` |
| Endpoint | `https://fonts.googleapis.com/css2?...&display=swap` |
| Preconnect | `https://fonts.googleapis.com`, `https://fonts.gstatic.com` |
| Strategy | `display=swap` — text renders in fallback font until Inter/Fraunces loads |

### Google Analytics 4

| Detail | Value |
|---|---|
| Measurement ID | `G-8Z8EDQHMGC` |
| Script src | `https://www.googletagmanager.com/gtag/js?id=G-8Z8EDQHMGC` |
| Init | Inline script in `<head>` — `gtag('config', 'G-8Z8EDQHMGC', { anonymize_ip: true })` |
| Preconnect | `https://www.googletagmanager.com`, `https://www.google-analytics.com` |
| Safe wrapper | `composables/utils/useGtag.ts` — always use this, never call `window.gtag` directly |

Auto-tracked events (no code needed): page views on every route change (handled by the global `config` call).

Custom events: see the Analytics table in §3. All custom events dual-post: GA4 + `/api/analytics/events`.

### AWS S3

| Detail | Value |
|---|---|
| Bucket | `zyd-object-store` |
| Region | `us-east-1` |
| Base URL | `https://zyd-object-store.s3.us-east-1.amazonaws.com` |
| DNS prefetch | `https://amazonaws.com` |
| Access model | Public GET; no auth required from the browser |

Static JSON files served directly to the client (not proxied through Nitro, except `geo` which uses server cache).

### Socket.io

| Detail | Value |
|---|---|
| Plugin | `plugins/socket.client.ts` (client-only) |
| Use | Real-time messaging push (new messages, presence updates) |
| Fallback | REST polling via `$fetch` for history and initial state |

---

## 6. Composables API Reference

| Composable | File | What it wraps |
|---|---|---|
| `useStaticData` | `composables/useStaticData.ts` | S3 static JSON + `/api/resource/geo` |
| `useIntelligence` | `composables/useIntelligence.ts` | `/api/career/*` — score, actions, insights, role discovery |
| `useMessages` | `composables/messages/useMessages.ts` | `/api/messaging/*` + Socket.io |
| `useConversationRecipients` | `composables/messages/useConversationRecipients.ts` | `/api/user/all` |
| `useMessageSound` | `composables/messages/useMessageSound.ts` | Browser Audio API (no HTTP) |
| `usePosts` | `composables/usePosts.ts` | `/api/post` |
| `useNotifications` | `composables/useNotifications.ts` | `/api/notification` |
| `useRatingSession` | `composables/useRatingSession.ts` | `/api/ratings/session` |
| `useJobRating` | `composables/useJobRating.ts` | `/api/ratings/job/{id}` |
| `useRatingFeedback` | `composables/useRatingFeedback.ts` | `/api/ratings/job/{id}/feedback` |
| `useUserInfo` | `composables/useUserInfo.ts` | `/api/user/businesses`, `/api/user/profile/{username}` |
| `useBusinessAccount` | `composables/useBusinessAccount.ts` | `/api/business/account/*` |
| `useMarketplaceProducts` | `composables/marketplace/useMarketplaceProducts.ts` | `/api/marketplace/products/*` |
| `useMarketplacePortfolios` | `composables/marketplace/useMarketplacePortfolios.ts` | `/api/marketplace/portfolios/*` |
| `useMarketplaceStores` | `composables/marketplace/useMarketplaceStores.ts` | `/api/marketplace/stores/*` |
| `useMarketplaceProjects` | `composables/marketplace/useMarketplaceProjects.ts` | `/api/marketplace/projects/*` |
| `useMarketplaceReviews` | `composables/marketplace/useMarketplaceReviews.ts` | `/api/marketplace/reviews/*` |
| `useMarketplaceRecommended` | `composables/marketplace/useMarketplaceRecommended.ts` | `/api/marketplace/recommended/personalized` |
| `useMarketplaceAnalytics` | `composables/marketplace/useMarketplaceAnalytics.ts` | Analytics events for marketplace |
| `useMarketplaceMock` | `composables/marketplace/useMarketplaceMock.ts` | Mock data (dev only) |
| `useAnalyticsEvent` | `composables/analytics/useAnalyticsEvent.ts` | `/api/analytics/events` + GA4 |
| `useGtag` | `composables/utils/useGtag.ts` | `window.gtag` safe wrapper |
| `useEncryption` | `composables/useEncryption.ts` | AES-GCM encrypt/decrypt (server-side only) |
| `useInfiniteObserver` | `composables/useInfiniteObserver.ts` | IntersectionObserver (no HTTP) |
| `useListingInfiniteScroll` | `composables/useListingInfiniteScroll.ts` | Infinite scroll state machine (no HTTP) |
| `useFeatureFlags` | `composables/useFeatureFlags.ts` | `shared/features/featureFlags.ts` (no HTTP) |
| `useEditOwnProfile` | `composables/useEditOwnProfile.ts` | Store reads only (no HTTP) |
| `useUserLocation` | `composables/useUserLocation.ts` | Browser Geolocation API (no HTTP) |
| `useCVParser` | `composables/useCVParser.ts` | Client-side text parsing (no HTTP) |
| `useUniqueList` | `composables/useUniqueList.ts` | Array utility (no HTTP) |
| `useCounter` | `composables/useCounter.ts` | Counter utility (no HTTP) |
| `useSEO` | `composables/seo/useSEO.ts` | `useHead` / meta tags (no HTTP) |
| `useAuthPageSEO` | `composables/seo/useAuthPageSEO.ts` | Auth page meta |
| `useBusinessSEO` | `composables/seo/useBusinessSEO.ts` | Business page meta |
| `useBusinessAccountSEO` | `composables/seo/useBusinessAccountSEO.ts` | Business account meta |
| `useJobSEO` | `composables/seo/useJobSEO.ts` | Job detail meta |
| `useUserProfileSEO` | `composables/seo/useUserProfileSEO.ts` | User profile meta |

---

## 7. Nuxt Config Reference

**File:** `nuxt.config.ts`

### Modules

| Module | Purpose |
|---|---|
| `@nuxtjs/tailwindcss` | Tailwind CSS integration |
| `@pinia/nuxt` | Pinia state management |
| `pinia-plugin-persistedstate/nuxt` | Pinia state persisted to `sessionStorage` (`sameSite: lax`) |
| `nuxt-icons` | SVG icon component support |
| `@nuxt/image` | Optimised `<NuxtImg>` — serves WebP/JPEG at quality 82; allows `amazonaws.com` domain |
| `nuxt-tiptap-editor` | Tiptap rich text editor (prefix: `Tiptap`) |

### Global CSS

```
assets/css/rating.css   ← loaded globally via nuxt.config.ts
```

All other CSS (Tailwind utilities, `zeemic-v2.css`) is imported per-component or per-layout.

### Image optimisation

```ts
image: {
  domains: ['amazonaws.com'],
  format: ['webp', 'jpeg'],
  quality: 82
}
```

### Client-only plugins

```
plugins/socket.client.ts   ← Socket.io initialisation (browser only)
```
