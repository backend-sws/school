# Short Plan: Session-Locked College Context (Pure User)

## Decisions and recommendations (your choices + suggested refinements)

**Your choices (we keep these):**
- **User stays pure** — no "current college" or "default college" inside User. Ability = f(college_id, roles/permissions) only.
- **Re-modify BelongsToDefaultCollege** — put session + active-college logic in the trait; no new CollegeContextService. Single place for "active college".
- **Single-college deploy** — env drives it: `CMS_MULTI_COLLEGE_MODE=false`, `CMS_DEFAULT_COLLEGE_ID=<id>` after seeding. No session needed.

**Suggested refinements (weave into the plan):**
- **Session key** — define once (e.g. constant in trait or config): `active_college_id`. No magic strings.
- **Thin facade** — add `CollegeContext` class that only `use BelongsToDefaultCollege;`. Callers use `CollegeContext::getActiveCollegeId($user)` so we don’t call trait methods from arbitrary models.
- **Prefer passing college_id** — callers should pass college from CollegeContext into `hasAbility($key, $collegeId)`. Support `hasAbility($key, null)` for backward compat (resolve via CollegeContext); document that explicit college_id is preferred.
- **getDefaultCollegeId in trait** — use both **student_profiles** and **staff_profiles** (trait scope today only uses student_profiles). Fixes staff-only users.
- **getEffectiveCollegeId** — leave as-is: request override (e.g. X-College-ID) or config default. No change.
- **Login hooks** — Fortify: `Illuminate\Auth\Events\Login` listener. API: right after `Auth::login($user)` in AuthController. Call `CollegeContext::refreshDefaultAfterLogin($user)` there.
- **Tests** — (1) single-college → getActiveCollegeId returns config default. (2) Multi-college, no session → returns getDefaultCollegeId. (3) Multi-college, valid session → returns session value. (4) Invalid session (not in allowed) → falls back to default (no poisoning).

---

## What we're doing

1. **User** = pure auth; remove `currentCollegeId()`. Ability only via `hasAbility($key, $collegeId)` (or null resolved via CollegeContext).
2. **BelongsToDefaultCollege** = re-modify: add static methods for session + active college (getActiveCollegeId, getDefaultCollegeId, allowedCollegeIds, setActiveCollegeId, refreshDefaultAfterLogin). Trait scope and creating callback use these; remove duplicated role/profile logic. getDefaultCollegeId uses roles + student_profiles + staff_profiles.
3. **CollegeContext** = thin class `use BelongsToDefaultCollege;` so app code calls `CollegeContext::getActiveCollegeId($user)` etc.
4. **Single-college** = when `multi_institution_mode` false, active college is always `config('ems.default_institution_id')` (env after seeding).

---

## Steps

| # | What | Where |
|---|------|--------|
| 1 | **BelongsToDefaultCollege**: add static methods + session. Define session key constant. getActiveCollegeId: if !multi_institution_mode → config default; else session (if in allowedCollegeIds) else getDefaultCollegeId. getDefaultCollegeId: first college role, else student_profiles.college_id, else staff_profiles.college_id. allowedCollegeIds, setActiveCollegeId, refreshDefaultAfterLogin. | `app/Traits/BelongsToDefaultCollege.php` |
| 2 | **CollegeContext**: new class, only `use BelongsToDefaultCollege;`. No extra logic. | `app/Support/CollegeContext.php` (or `app/Services/CollegeContext.php`) |
| 3 | **BelongsToDefaultCollege** scope and creating: get college via `CollegeContext::getActiveCollegeId(auth()->user())`; remove in-trait role/student_profiles duplication. | `app/Traits/BelongsToDefaultCollege.php` |
| 4 | **User**: remove `currentCollegeId()`. hasAbility($key, $collegeId = null): when null, use CollegeContext::getActiveCollegeId($this). Docblock: prefer passing college_id. | `app/Models/User.php` |
| 5 | **Callers**: get college from CollegeContext, pass to hasAbility / resolveEffectivePermissionKeys. | AuthShareController, StaffService, RedirectDashboard, ShareSeoSettings, SettingController, SupportTicketController |
| 6 | **Login**: Fortify — Login event listener; API — after Auth::login in AuthController. Call CollegeContext::refreshDefaultAfterLogin($user). | Event listener + AuthController |
| 7 | **Tests**: no currentCollegeId(); use CollegeContext or hasAbility($key, null). Add cases: single-college config, multi-college default, session valid, session invalid fallback. | `tests/Feature/Auth/` |

---

## Flow in one line

**Current:** User and BelongsToDefaultCollege both derive "current college" from roles/profiles; single-college from config.  
**After:** CollegeContext (trait logic) derives it: config if single-college, else session → getDefaultCollegeId. User only hasAbility(key, college_id); trait and callers use CollegeContext.

---

## User flows: current vs updated (step by step)

### Flow 1 — Login

**Current**

1. User submits credentials.
2. Fortify / API validates and runs `Auth::login($user)`.
3. Session gets user id; **no college id is stored**.
4. "Current college" is not set anywhere; next request will derive it from User again.

**Updated**

1. User submits credentials.
2. Fortify / API validates and runs `Auth::login($user)`.
3. Listener (or same place) calls `CollegeContext::refreshDefaultAfterLogin($user)`.
4. That calls `getDefaultCollegeId($user)` (roles → student_profiles → staff_profiles) and, if not null, sets `session('active_college_id', $id)`.
5. Single-college: getActiveCollegeId always returns config; session may still be set for consistency.

---

### Flow 2 — Load page / auth payload (e.g. Inertia shared auth)

**Current**

1. Request hits app; middleware/Inertia share runs.
2. AuthShareController::getAuth() runs.
3. It calls `$user->currentCollegeId()` → User runs: first college role, else studentProfile.college_id, else staffProfile.college_id.
4. It calls `$user->resolveEffectivePermissionKeys($currentCollegeId)` and builds payload with `current_college_id`, `permissions`, etc.
5. Frontend receives auth with that college and permissions.

**Updated**

1. Request hits app; middleware/Inertia share runs.
2. AuthShareController::getAuth() runs.
3. It calls `CollegeContext::getActiveCollegeId($user)` → trait: if single-college → config default; else session (if allowed) else getDefaultCollegeId($user).
4. It calls `$user->resolveEffectivePermissionKeys($collegeId)` and builds payload with `current_college_id`, `permissions`, etc.
5. Frontend receives auth with that college and permissions (same shape).

---

### Flow 3 — Check permission (e.g. can user manage staff?)

**Current**

1. Code calls `$user->hasAbility('manage_staff')` (no second arg).
2. User::hasAbility runs: `$collegeId = $collegeId ?? $this->currentCollegeId()` → User derives college (roles → profiles).
3. User::resolveEffectivePermissionKeys($collegeId) returns keys; hasAbility checks if 'manage_staff' is in that list.
4. Returns true/false.

**Updated**

1. Code calls `$user->hasAbility('manage_staff')` or `$user->hasAbility('manage_staff', CollegeContext::getActiveCollegeId($user))`.
2. If second arg null: User calls `CollegeContext::getActiveCollegeId($this)` to get college (session → default → config).
3. User::resolveEffectivePermissionKeys($collegeId) returns keys; hasAbility checks if 'manage_staff' is in that list.
4. Returns true/false (same result shape).

---

### Flow 4 — List scoped data (e.g. Staff list)

**Current**

1. Controller runs `StaffProfile::query()->...` (or similar).
2. Model uses BelongsToDefaultCollege; global scope runs.
3. Scope gets auth user, checks super_admin/global → no filter; else gets college: first college role or DB::table('student_profiles') (no staff_profiles); else guest + single-college → config default.
4. Builder gets `where(college_id, $collegeId)`.
5. User sees only rows for that college.

**Updated**

1. Controller runs `StaffProfile::query()->...`.
2. Model uses BelongsToDefaultCollege; global scope runs.
3. Scope calls `CollegeContext::getActiveCollegeId(auth()->user())` (single-college → config; multi-college → session or getDefaultCollegeId; getDefaultCollegeId uses roles + student_profiles + staff_profiles).
4. Builder gets `where(college_id, $collegeId)`.
5. User sees only rows for that college (staff-only users now get correct college via staff_profiles).

---

### Flow 5 — Create scoped model (e.g. new Department)

**Current**

1. Controller runs `Department::create([...])` (no college_id).
2. BelongsToDefaultCollege creating callback runs.
3. If multi_institution_mode: `college_id = auth()->user()->currentCollegeId()` (User derives it). Else: config default_institution_id.
4. Model saved with that college_id.

**Updated**

1. Controller runs `Department::create([...])` (no college_id).
2. BelongsToDefaultCollege creating callback runs.
3. It sets `college_id = CollegeContext::getActiveCollegeId(auth()->user())` (same resolution as scope).
4. Model saved with that college_id.

---

### Diagram — who decides "active college"

**Current**

```
Caller (e.g. AuthShare, StaffService, hasAbility)
    → User::currentCollegeId()
        → first college role OR studentProfile.college_id OR staffProfile.college_id

BelongsToDefaultCollege (scope / creating)
    → own logic: first college role OR student_profiles row (no staff) OR config if guest/single-college
```

**Updated**

```
Caller (e.g. AuthShare, StaffService)
    → CollegeContext::getActiveCollegeId($user)
        → single-college? config default
        → else session in allowed? session value
        → else getDefaultCollegeId($user) [roles + student_profiles + staff_profiles]

hasAbility($key, null)
    → CollegeContext::getActiveCollegeId($this)  → then resolveEffectivePermissionKeys($id)

BelongsToDefaultCollege (scope / creating)
    → CollegeContext::getActiveCollegeId(auth()->user())   [same as above]
```

---

### Summary flowchart

**Current — "Where does active college come from?"**

```
Login → (no college stored)
Request → AuthShare / Controller / hasAbility
    → User::currentCollegeId() → role / studentProfile / staffProfile
Request → BelongsToDefaultCollege scope or creating
    → trait’s own query: role / student_profiles (no staff) / config
```

**Updated — "Where does active college come from?"**

```
Login → CollegeContext::refreshDefaultAfterLogin($user) → session('active_college_id')
Request → Any need for "active college"
    → CollegeContext::getActiveCollegeId($user)
        → !multi_college? → config('ems.default_institution_id')
        → session in allowed? → session value
        → else getDefaultCollegeId($user) → role / student_profiles / staff_profiles
```

---

## Env (single-college deploy)

- `CMS_MULTI_COLLEGE_MODE=false`
- `CMS_DEFAULT_COLLEGE_ID=1` (or id after seeding)

Active college is always this id; no session.
