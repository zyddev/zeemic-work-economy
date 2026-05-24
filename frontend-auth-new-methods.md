# Frontend Integration Guide — Password Auth & OAuth

> **Applies to:** User-facing frontend (Zeemic web app)
> **Prerequisite:** Read `docs/frontend-auth-migration.md` for the base OTC + cookie model this guide extends.

These endpoints were added to the BFF alongside the existing OTC flow. All auth methods issue the same `access_token` / `refresh_token` httpOnly cookies — once a user is logged in by any method, all protected routes work identically.

---

## Quick Reference

| Method | BFF Path | Purpose |
|--------|----------|---------|
| `POST` | `/auth/login/password` | Log in with email + password |
| `POST` | `/auth/password/set` | Attach a password to an existing account |
| `POST` | `/auth/password/reset` | Send a password-reset email |
| `POST` | `/auth/password/reset/confirm` | Complete the reset with token + new password |
| `GET`  | `/auth/oauth/:provider` | Start OAuth login (browser redirect) |
| `GET`  | `/auth/oauth/callback` | OAuth landing — handled by BFF, not the frontend |

`:provider` is one of: `google`, `apple`, `linkedin`

All endpoints are rate-limited (5 requests / 5 minutes per IP). All return errors in the standard shape:
```json
{ "message": "Human-readable error", "statusCode": 401 }
```

---

## Part 1 — Password Auth

### 1.1 Login with Password

```
POST /auth/login/password
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "StrongPass1!"
}
```

**Success (200):**
```json
{
  "message": "Login successful",
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "role": "User"
  }
}
```

The response also sets `access_token` and `refresh_token` as httpOnly cookies. Pass `credentials: 'include'` on this request so the browser stores them.

**Error responses:**

| Status | Meaning | UI action |
|--------|---------|-----------|
| `401` | Wrong password or no password set | Show generic "invalid email or password" — do not distinguish between the two |
| `429` | Rate limited | Show cooldown message |

**Example:**
```js
const res = await fetch('/auth/login/password', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});

if (res.ok) {
  const { data } = await res.json();
  // Redirect to dashboard — cookies are set automatically
  router.push('/dashboard');
} else if (res.status === 401) {
  setError('Invalid email or password.');
} else if (res.status === 429) {
  setError('Too many attempts. Please try again later.');
}
```

---

### 1.2 Set Password (for existing OTC / OAuth users)

Use this when a logged-in user wants to add a password to their account. The user must already have an account (created via OTC or OAuth).

```
POST /auth/password/set
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "StrongPass1!"
}
```

**Password requirements:** minimum 8 characters, must include uppercase, lowercase, a digit, and a special character.

**Responses:**

| Status | Meaning | UI action |
|--------|---------|-----------|
| `200` | Password set | Confirm to user; optionally redirect to login |
| `404` | No account for this email | Show "account not found" |
| `409` | Password already set | Tell user to use "Forgot password" instead |
| `400` | Weak password | Show password requirements |

---

### 1.3 Initiate Password Reset

```
POST /auth/password/reset
Content-Type: application/json

{
  "email": "user@example.com"
}
```

Always returns `200` regardless of whether the email is registered (prevents email enumeration). Show a generic message to the user:

> "If your email is registered, you'll receive a reset link shortly."

The reset email contains a link to `{APP_URL}/password/reset?token=...`. Your frontend reset page should extract the `token` query parameter and submit it in Step 1.4.

---

### 1.4 Confirm Password Reset

Called when the user clicks the reset link, lands on your reset page, and submits a new password.

```
POST /auth/password/reset/confirm
Content-Type: application/json

{
  "token": "<token from URL query param>",
  "newPassword": "NewStrongPass1!"
}
```

**Responses:**

| Status | Meaning | UI action |
|--------|---------|-----------|
| `200` | Password updated | Redirect user to login |
| `401` | Token invalid, expired, or already used | Show error; offer a new reset link |
| `400` | Weak password | Show password requirements |

**Example reset page:**
```js
// Extract token from current URL: /password/reset?token=abc123
const token = new URLSearchParams(window.location.search).get('token');

async function submitReset(newPassword) {
  const res = await fetch('/auth/password/reset/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  });

  if (res.ok) {
    router.push('/login?message=password_updated');
  } else if (res.status === 401) {
    setError('This reset link has expired. Please request a new one.');
  } else if (res.status === 400) {
    setError('Password must be at least 8 characters with uppercase, lowercase, a digit, and a special character.');
  }
}
```

---

## Part 2 — OAuth (Google, Apple, LinkedIn)

OAuth uses a three-step browser redirect flow. The frontend does not manage tokens directly — the BFF exchanges the OAuth code for cookies on the server side.

### Flow overview

```
1. User clicks "Sign in with Google"
2. Frontend navigates the browser to:  GET /auth/oauth/google
3. BFF redirects browser to Google's OAuth consent page
4. User authenticates with Google
5. Google redirects to BFF:            GET /auth/oauth/callback?exchange_code=<uuid>
6. BFF calls auth service, receives JWT cookies, sets them on the response
7. BFF redirects browser to:           {FRONTEND_URL}/dashboard
8. User is now logged in — cookies are set
```

### 2.1 Initiate OAuth

Navigate the browser (not a fetch call) to:

```
GET /auth/oauth/:provider
```

where `:provider` is `google`, `apple`, or `linkedin`.

**The simplest implementation — an anchor tag or `window.location` assignment:**

```jsx
// React example
function OAuthButtons() {
  const startOAuth = (provider) => {
    window.location.href = `/auth/oauth/${provider}`;
  };

  return (
    <>
      <button onClick={() => startOAuth('google')}>Sign in with Google</button>
      <button onClick={() => startOAuth('apple')}>Sign in with Apple</button>
      <button onClick={() => startOAuth('linkedin')}>Sign in with LinkedIn</button>
    </>
  );
}
```

**Do not use `fetch()` for this step.** The flow requires the browser to follow redirects through OAuth consent pages which set their own cookies. A `fetch` call cannot do this.

**Optional `role` query param** — for admin sign-in via OAuth, append `?role=Admin`:
```js
window.location.href = `/auth/oauth/google?role=Admin`;
```

---

### 2.2 OAuth Callback — Handled by BFF

The BFF handles `GET /auth/oauth/callback` automatically. Your frontend does not need to implement this route.

After a successful OAuth:
- The BFF sets `access_token` and `refresh_token` cookies on the browser
- The browser is redirected to `{FRONTEND_URL}/dashboard`

After a failed OAuth (invalid code, auth service error, timeout):
- The browser is redirected to `{FRONTEND_URL}/login?error=oauth_failed`

Your login page should check for `?error=oauth_failed` and show an appropriate message:

```js
// On /login page mount
const error = new URLSearchParams(window.location.search).get('error');
if (error === 'oauth_failed') {
  setError('Sign-in failed. Please try again.');
}
```

---

### 2.3 Provider Notes for the Frontend

**Google:** Standard redirect flow. No special frontend handling needed.

**Apple:**
- Apple only returns the user's name on the very first sign-in. On subsequent sign-ins, the name is not returned. Store the user's name from the first session if needed.
- Apple's OAuth callback arrives as a `POST` (not `GET`) — the BFF and auth service handle this transparently.

**LinkedIn:** Standard redirect flow. No special frontend handling needed.

---

## Part 3 — Choosing the Right Auth Method

Users can have multiple auth methods on the same account (e.g. both OTC and Google). The account is uniquely identified by `(email, role)`.

| Scenario | Recommended flow |
|----------|-----------------|
| New user, first sign-in | Any method — OTC, password, or OAuth |
| Existing OTC user who wants a password | Call `POST /auth/password/set` while logged in |
| Existing user signs in with Google (same email) | Google is linked to their existing account automatically |
| Forgot password | `POST /auth/password/reset` → email link → `POST /auth/password/reset/confirm` |
| Email not accessible | Cannot reset without email access — direct user to support |

---

## Part 4 — Session Behaviour After Login

Regardless of which auth method was used, all sessions work the same way after login:

- Tokens arrive as `HttpOnly; SameSite=Strict; Secure` cookies
- Every API request must pass `credentials: 'include'`
- On `401`, call `POST /auth/token/refresh` then retry
- On second `401` (refresh also failed), redirect to `/login`
- Logout via `POST /auth/logout` (clears cookies server-side)

See `docs/frontend-auth-migration.md` Section 3 for the full token refresh interceptor pattern.

---

## Part 5 — Error Reference

All auth endpoints return:
```json
{ "message": "Human-readable description", "statusCode": 400 }
```

| Status | Meaning |
|--------|---------|
| `400` | Validation error — missing field, weak password, bad format |
| `401` | Auth failed — wrong password, expired token, bad exchange code |
| `404` | Account not found |
| `409` | Conflict — e.g. password already set on this account |
| `429` | Rate limited — back off and show cooldown UI |
| `503` | Auth service temporarily unavailable — show "try again later" |
