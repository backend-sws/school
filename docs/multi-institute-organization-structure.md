# Multi-Institute (Organization) Structure

## Overview

The system supports a **two-level hierarchy**:

- **Organization** (parent) – e.g. "ABC Education Trust", "Demo Education Trust"
- **Institution** (branch) – each row is one school, college, coaching centre, or university

One organization can have **multiple institutions** (schools/colleges/universities) under it. Each institution still has its own `type` (`school`, `college`, `coaching`, `university`), departments, streams, sessions, students, etc.

## Data Model

- **`organizations`** – id, name, code, address, city, state, pincode, phone, email, website, logo_url, status, timestamps
- **`institutions`** – unchanged, plus nullable **`organization_id`** (FK to `organizations`). All existing FKs (departments, streams, student_profiles, etc.) still point to `institutions`.

So:

- **Organization** has many **Institutions**.
- **Institution** belongs to **Organization** (optional; `organization_id` can be null for backward compatibility).

## API

All under admin auth + `system_console` permission group:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/organizations` | List organizations (paginated, with `institutions_count`) |
| POST | `/api/v1/organizations` | Create organization |
| GET | `/api/v1/organizations/{id}` | Get organization with its institutions |
| PUT/PATCH | `/api/v1/organizations/{id}` | Update organization |
| DELETE | `/api/v1/organizations/{id}` | Delete organization (institutions get `organization_id` set to null) |
| GET | `/api/v1/organizations/{id}/institutions` | List institutions under this organization |

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/institutions` | List institutions (paginated) |
| POST | `/api/v1/institutions` | Create institution (body can include `organization_id`) |
| GET | `/api/v1/institutions/{id}` | Get institution |
| PUT/PATCH | `/api/v1/institutions/{id}` | Update institution (body can include `organization_id`) |
| DELETE | `/api/v1/institutions/{id}` | Delete institution |

## Seeding

1. **Organizations**: `OrganizationSeeder` seeds from `database/seeders/data/organizations.php`. Run before `InstitutionSeeder` if you use `organization_id` in institution data.
2. **Institutions**: In `database/seeders/data/institutions.php` you can add `organization_id => 1` to any row so that institution is linked to organization 1. `DatabaseSeeder` runs `OrganizationSeeder` then `InstitutionSeeder`.

To seed only organizations:

```bash
php artisan db:seed --class=OrganizationSeeder
```

## Frontend / UI

- **Organization list**: Call `GET /api/v1/organizations` to show organizations; use `institutions_count` for badges.
- **Organization detail**: Call `GET /api/v1/organizations/{id}` to get one organization with `institutions` loaded, or `GET /api/v1/organizations/{id}/institutions` for just the list of institutions.
- **Create/edit institution**: In the form, add an optional "Organization" dropdown (data from `GET /api/v1/organizations`) and send `organization_id` in POST/PUT body.
- **Create organization**: Form with name, code, address, etc. → POST to `/api/v1/organizations`.
- **Institution switcher**: Unchanged; still uses `institution_id` (the branch). Users with access to multiple institutions (under one or many organizations) continue to switch by `institution_id`.

## Behaviour Notes

- **Domain → institution**: Domain resolution (e.g. `ResolveInstitutionFromDomain`) still maps to **institution** (branch), not organization. Each branch can have its own domain(s).
- **Scoping**: Existing `BelongsToDefaultInstitution` and role/permission scoping still use **institution_id** (the branch). There is no organization-level scope yet; that can be added later (e.g. "org admin" seeing all branches of one organization).
- **Backward compatibility**: Existing institutions have `organization_id = null` until you assign them. All code that uses `institution_id` continues to work.

## Landing page and domain-based access

- **Public landing (`/`)**: When a request hits an institution’s domain (via `institution_domains` or `institutions.domain`), `ResolveInstitutionFromDomain` sets `ems.default_institution_id` (and type) for that request. The home page is rendered by `WebsiteController::index` and uses the resolved institution (sliders, notices, news, etc.). So each institution’s domain shows that institution’s landing.
- **Super Admin**: Logged-in users with the `super_admin` role are redirected from `/dashboard` to the Super Admin landing (`/super-admin`). That page lists all institutions with their domains and a “View Audit Logs” link to `/admin/audit-logs`. Only users with the `super_admin` role can access `/super-admin`.
