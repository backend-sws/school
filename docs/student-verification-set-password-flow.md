# Generic user verification & set-password flow (students, staff, etc.)

## Overview

The flow is **generic** and can be used for any user type (students after approval, staff invite, etc.). The system sends an email with a **verification link**. The link leads to a **set-password** page. After the user sets a password, they are logged in and redirected by role (e.g. student → student portal dashboard, staff → admin dashboard).

**Use cases:** Admission approval (student), staff onboarding, or any “verify email + set password” flow.

## Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. Application approved (admin clicks "Approve" or payment recorded)        │
│    → AdmissionToStudentSyncService runs (profile, role, etc.)                │
│    → SendStudentVerificationEmailJob dispatched                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. Email sent to student                                                     │
│    Subject: "Verify your account – {Institution}"                            │
│    Body: Message + button/link to:                                           │
│    /verify-email?token={token}  (generic; same for students & staff)          │
│    (Token = encrypted payload: user_id + expiry, e.g. 7 days)                │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. User clicks link in email                                                 │
│    GET /verify-email?token=xxx                                                │
│    → Backend verifies token (decrypt, check expiry, load user)                │
│    → If invalid: redirect to /student-portal/login?error=invalid_link        │
│    → If valid: render Inertia page "Set your password" with token in props   │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. User submits password on "Set password" page                              │
│    POST /api/v1/auth/set-password-with-token  (generic)                      │
│    Body: { token, password, password_confirmation }                          │
│    → Backend verifies token again, updates user password,                    │
│      sets email_verified_at, Auth::login($user)                              │
│    → Returns { success: true, redirect: "/student-portal/dashboard" }        │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 5. Frontend redirects to dashboard                                           │
│    router.visit("/student-portal/dashboard")                                 │
│    User is now logged in (cookie set by API response)                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Components

| Component | Purpose |
|-----------|---------|
| **Token** | `App\Support\VerificationToken` – `createToken(User)`, `verifyToken(string)`, `verifyEmailUrl(User)`. Generic for any user. Encrypted payload: user_id + exp (e.g. 7 days). |
| **Mail** | `StudentVerificationMail` (content generic) – link is `VerificationToken::verifyEmailUrl($user)` → `/verify-email?token=...`. |
| **Route** | `GET /verify-email` – verify token, render `auth/set-password` or redirect to `/login` with error. |
| **Page** | `auth/set-password.tsx` – form with token (from props), password, password_confirmation; POST to `auth/set-password-with-token`. |
| **API** | `POST auth/set-password-with-token` – verify token, set password, email_verified_at, login, return `redirect` by role (student/candidate → student-portal/dashboard, else → /dashboard). |
| **Jobs** | `SendStudentVerificationEmailJob` (students after approval), `SendVerificationEmailJob` (generic: use for staff invite). |

## Security

- Token is encrypted (Laravel `Crypt`), not signed-only; do not put sensitive data beyond user_id and exp.
- Token has an expiry (e.g. 7 days); after that the user must use "Forgot password" from the login page.
- Rate-limit the set-password API (e.g. throttle:5,1).

---

## Related: System-Generated Passwords (Seeder Flow)

This doc covers **token-based** verification (admission approval, staff invite). A separate flow exists for **seeded users**:

| Aspect | Token-based (this doc) | System-generated password |
|--------|----------------------|---------------------------|
| **Trigger** | Admission approval or staff invite | Seeder creates user with `system_generated_password = true` |
| **Entry** | Email link → `/verify-email?token=...` | Normal login → auto-redirect to `/settings/password` |
| **Mechanism** | `VerificationToken` + `set-password-with-token` API | `UserRedirectResolver` Rule 4 (`forcePasswordReset`) |
| **Cleared by** | Setting password via token API | Changing password on `/settings/password` |
| **Frontend** | `auth/set-password.tsx` | `settings/password.tsx` (with amber banner) |

Both flows ensure users don't operate with default/system-generated credentials.
