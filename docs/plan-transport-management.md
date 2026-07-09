# Plan: Transport Management Module

This document plans the **Transport Management** module for the Education Management System, following the same patterns as Inventory, Admission, Fees, and Certificates (permissions, workflows, institution-scoped data, web + API routes, sidebar).

---

## 0. Branch

- **Create and use a separate branch** for all transport work: `feature/transport-module`.
- Before starting implementation: `git checkout -b feature/transport-module` (from main or current development branch).
- All config, migrations, models, API, web routes, and frontend changes for transport go on this branch until feature-complete and merged.

---

## 1. Scope

**Transport Management** covers:

- **Routes** – Named bus/van routes (e.g. "Route A – North Sector", "Van 1 – City Centre") with ordered stops and optional timings.
- **Stops** – Pickup/drop points (name, address, optional coordinates); reusable across routes.
- **Vehicles** – Buses/vans (registration number, capacity, type, status) with optional driver and route assignment.
- **Drivers** – Driver records (name, license number, contact); can be staff or external; linked to vehicles.
- **Student transport assignment** – Which student uses which route and stop (for manifests and optional transport fee).
- **Transport fee (optional)** – Integration with existing Fee module: a "Transport Fee" fee head and assignment so transport users can be charged; collection via existing fee payment flow.

Optionally in a later phase: trip-wise attendance (mark present/absent per trip), live tracking, parent app for bus ETA.

---

## 2. Permission group and workflow

- **Config key:** `transport` (middleware) and `transport` (permission group).
- **Workflow key:** `transport` – "Transport – Routes, Vehicles & Assignments".
- **Middleware:** `ensure-permission-group:transport` for all transport routes.

| Permission key | Name |
|----------------|------|
| `view_transport_routes` | View Transport Routes |
| `create_transport_routes` | Create Transport Routes |
| `update_transport_routes` | Update Transport Routes |
| `delete_transport_routes` | Delete Transport Routes |
| `view_transport_stops` | View Transport Stops |
| `create_transport_stops` | Create Transport Stops |
| `update_transport_stops` | Update Transport Stops |
| `delete_transport_stops` | Delete Transport Stops |
| `view_transport_vehicles` | View Vehicles |
| `create_transport_vehicles` | Create Vehicles |
| `update_transport_vehicles` | Update Vehicles |
| `delete_transport_vehicles` | Delete Vehicles |
| `view_transport_drivers` | View Drivers |
| `create_transport_drivers` | Create Drivers |
| `update_transport_drivers` | Update Drivers |
| `delete_transport_drivers` | Delete Drivers |
| `view_transport_assignments` | View Student Transport Assignments |
| `create_transport_assignments` | Assign Students to Route/Stop |
| `update_transport_assignments` | Update Assignments |
| `delete_transport_assignments` | Remove Assignments |
| `view_transport_reports` | View Transport Reports (manifests, occupancy) |

---

## 3. Database (migrations)

All tables **institution-scoped** via `institution_id` and `BelongsToDefaultInstitution`.

### 3.1 `transport_stops`

Pickup/drop points; reusable across routes.

| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| institution_id | FK institutions | |
| name | string(150) | e.g. "Main Gate", "Sector 5 Crossing" |
| code | string(50) nullable | Optional short code |
| address | string(255) nullable | Full address |
| landmark | string(150) nullable | Landmark for identification |
| latitude | decimal(10,7) nullable | Optional for maps |
| longitude | decimal(10,7) nullable | Optional for maps |
| is_active | boolean default true | |
| created_at, updated_at | timestamps | |

Indexes: `institution_id`, `is_active`.  
Unique: `(institution_id, code)` when `code` is not null (enforce in migration or unique index).

### 3.2 `transport_routes`

Named route (e.g. "Route A"); stop order and timings in junction table.

| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| institution_id | FK institutions | |
| name | string(150) | e.g. "Route A – North Sector" |
| code | string(50) nullable | Optional route code |
| description | text nullable | |
| is_active | boolean default true | |
| created_at, updated_at | timestamps | |

Indexes: `institution_id`, `is_active`.  
Unique: `(institution_id, code)` when `code` is not null (enforce in migration or unique index).

### 3.3 `transport_route_stops`

Ordered stops per route with optional arrival/departure time.

| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| transport_route_id | FK transport_routes | |
| transport_stop_id | FK transport_stops | |
| sequence | integer | 1, 2, 3… (order along route) |
| arrival_time | time nullable | Optional scheduled arrival |
| departure_time | time nullable | Optional scheduled departure |
| created_at, updated_at | timestamps | |

Unique: `(transport_route_id, sequence)`. Indexes: `transport_route_id`, `transport_stop_id`.

### 3.4 `transport_drivers`

Driver master (may or may not be a User/staff).

| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| institution_id | FK institutions | |
| name | string(150) | |
| license_number | string(80) nullable | |
| license_valid_until | date nullable | |
| mobile | string(20) nullable | |
| email | string(100) nullable | |
| user_id | FK users nullable | If driver is a staff user |
| is_active | boolean default true | |
| created_at, updated_at | timestamps | |

Indexes: `institution_id`, `user_id`, `is_active`.

### 3.5 `transport_vehicles`

Buses/vans; optional driver and route assignment.

| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| institution_id | FK institutions | |
| registration_number | string(30) | Unique per institution |
| vehicle_type | string(30) default 'bus' | bus, van, cab, etc. |
| capacity | integer | Seats (e.g. 40, 15) |
| transport_route_id | FK transport_routes nullable | Assigned route (optional) |
| transport_driver_id | FK transport_drivers nullable | Current driver (optional) |
| status | string(20) default 'active' | active, maintenance, inactive |
| notes | text nullable | |
| created_at, updated_at | timestamps | |

Unique: `(institution_id, registration_number)`. Indexes: `institution_id`, `transport_route_id`, `transport_driver_id`, `status`.

### 3.6 `transport_assignments`

Student (or user) assigned to a route and stop (pick/drop).

| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| institution_id | FK institutions | |
| user_id | FK users | Student (or guardian) – typically StudentProfile.user_id |
| transport_route_id | FK transport_routes | |
| transport_stop_id | FK transport_stops | Pickup/drop stop (must belong to this route) |
| effective_from | date | Start date of assignment |
| effective_until | date nullable | End date (null = ongoing) |
| remarks | text nullable | |
| created_at, updated_at | timestamps | |

Indexes: `institution_id`, `user_id`, `transport_route_id`, `transport_stop_id`, `effective_from`, `effective_until`.  
Business rule: only one active assignment per user at a time; enforce in service/validation (see 3.7).

### 3.7 Foreign keys and delete behavior

In migrations, use `constrained()` with explicit `onDelete` so deletes behave consistently:

- **transport_stops, transport_routes:** `institution_id` → `cascadeOnDelete` (same as inventory).
- **transport_route_stops:** `transport_route_id` → `cascadeOnDelete`; `transport_stop_id` → `cascadeOnDelete` (deleting a route removes its stop order; deleting a stop removes it from all routes).
- **transport_drivers:** `institution_id` → `cascadeOnDelete`; `user_id` → `nullOnDelete`.
- **transport_vehicles:** `institution_id` → `cascadeOnDelete`; `transport_route_id` → `nullOnDelete` (vehicle stays, route unset); `transport_driver_id` → `nullOnDelete`.
- **transport_assignments:** `institution_id` → `cascadeOnDelete`; `user_id` → `cascadeOnDelete`; `transport_route_id` → `restrictOnDelete`; `transport_stop_id` → `restrictOnDelete` (do not delete route/stop while assignments exist; reassign or end assignments first).

### 3.8 Assignment business rules

- **Active assignment:** `effective_from <= today` AND (`effective_until` IS NULL OR `effective_until >= today`). Only one active assignment per user at a time.
- **When creating a new assignment** for a user who already has an active one: **auto-end** the previous assignment by setting its `effective_until` to the day before the new assignment’s `effective_from`. Then create the new assignment. (Alternative: reject with an error; this plan recommends auto-end for better UX.)
- **Validation:** On create/update, ensure `transport_stop_id` belongs to `transport_route_id` (exists in `transport_route_stops`). Ensure `user_id` belongs to the active institution (exists in `student_profiles` or `staff_profiles` for the active `institution_id`). Product choice: restrict to **students only** (user must have StudentProfile for institution) or allow **any user in institution** (StudentProfile or StaffProfile); document the choice in config or plan (recommend students only for first phase).

---

## 4. Models

- **TransportStop** – `BelongsToDefaultInstitution`, fillable; hasMany through TransportRouteStop (or belongsToMany TransportRoute with pivot).
- **TransportRoute** – `BelongsToDefaultInstitution`, fillable; belongsToMany TransportStop with pivot `transport_route_stops` (sequence, arrival_time, departure_time); hasMany TransportVehicle; hasMany TransportAssignment.
- **TransportRouteStop** – Pivot/junction table (no `institution_id`). belongsTo TransportRoute, belongsTo TransportStop; fillable: sequence, arrival_time, departure_time. No global scope; always accessed via route.
- **TransportDriver** – `BelongsToDefaultInstitution`, fillable; belongsTo User (nullable); hasMany TransportVehicle.
- **TransportVehicle** – `BelongsToDefaultInstitution`, fillable; belongsTo TransportRoute (nullable), belongsTo TransportDriver (nullable).
- **TransportAssignment** – `BelongsToDefaultInstitution`, fillable; belongsTo User, TransportRoute, TransportStop. Validation (in service or form request): `transport_stop_id` must belong to `transport_route_id` (via transport_route_stops); `user_id` must belong to active institution (per 3.8); one active assignment per user with auto-end of previous.

All entity models (except TransportRouteStop) use `institution_id` and `BelongsToDefaultInstitution` so global scope filters by active institution.

---

## 5. Integration with Fee Module (optional)

- **Transport fee head** – Per institution, one FeeHead e.g. "Transport Fee" (optional stream/session; allow_custom_fee or fixed amount). Students with an active **transport_assignment** can be charged transport fee.
- **No new payment table** – Use existing FeePayment; transport fee is just another fee head. Assignment is for **eligibility** (who should be charged); actual collection is via existing fee payment flow.
- **Optional:** A **transport_fee_assignments** or a flag on student/fee structure to mark "transport fee applicable" – can be derived from `transport_assignments` (user has active assignment) so no extra table is strictly necessary; fee structure can list "Transport Fee" and staff assigns it to students who use transport.

For first phase, transport module can be **standalone** (routes, stops, vehicles, drivers, assignments). Fee integration can be Phase 2: e.g. report "Students with transport assignment" and a bulk action to add Transport Fee head to their fee structure, or a dedicated "Transport Fee" fee head and manual assignment.

---

## 6. API routes (under `api/v1`)

**Route nesting:** Register all transport API routes **inside** the same admin middleware group used for inventory (i.e. after `Route::middleware(config('route_permissions.middleware.admin'))` in `routes/api.php`), then apply `config('route_permissions.middleware.transport')` and `prefix('transport')`. So: auth → admin (check-role) → transport (permission group) → transport routes.

All transport endpoints: middleware `auth` + `ensure-permission-group:transport`; gate each action by view_* / create_* / update_* / delete_* as appropriate.

- **Stops**  
  `GET/POST /transport/stops`, `GET/PUT/DELETE /transport/stops/{id}`  
  (index, store, show, update, destroy.)

- **Routes**  
  `GET/POST /transport/routes`, `GET/PUT/DELETE /transport/routes/{id}`.  
  Route stops (pivot) – see below.

- **Route stops (pivot)**  
  `GET /transport/routes/{id}/stops` – list with sequence, arrival_time, departure_time.  
  `POST /transport/routes/{id}/stops` – body: `transport_stop_id`, `sequence`, optional `arrival_time`, `departure_time`.  
  `PUT /transport/routes/{id}/stops` – body: array of `{ transport_stop_id, sequence, arrival_time, departure_time }` to **replace** full ordering (omitting a stop from the list removes it from the route).  
  Optional: `DELETE /transport/routes/{id}/stops/{route_stop_id}` – remove one pivot row. If not implemented, removal is done only via PUT with the new list.

- **Drivers**  
  `GET/POST /transport/drivers`, `GET/PUT/DELETE /transport/drivers/{id}`.

- **Vehicles**  
  `GET/POST /transport/vehicles`, `GET/PUT/DELETE /transport/vehicles/{id}`  
  Optional: `GET /transport/vehicles?route_id=…` to filter by assigned route.

- **Assignments**  
  `GET /transport/assignments` – list (paginated), filter by `user_id`, `route_id`, `effective_on` (date).  
  `POST /transport/assignments` – body: `user_id`, `transport_route_id`, `transport_stop_id`, `effective_from`, optional `effective_until`, `remarks`. Validate: stop belongs to route; user belongs to active institution (student_profiles or staff_profiles for institution_id); enforce one active assignment per user (auto-end previous per 3.8).  
  `GET /transport/assignments/{id}`, `PUT /transport/assignments/{id}`, `DELETE /transport/assignments/{id}`.

- **Reports (optional)**  
  `GET /transport/reports/manifest` – query: `route_id`, `date` (optional); returns list of students (from assignments) for that route, with stop order.  
  `GET /transport/reports/occupancy` – vehicles with assignment counts per route (capacity vs assigned).

Use existing `BaseController` and response helpers; enforce permissions with `EnsurePermission` or `auth()->user()->hasAbility(...)`.

---

## 7. Web routes (Inertia)

**Route nesting:** Register transport web routes **inside** the existing admin middleware group in `routes/web.php` (i.e. inside `Route::middleware(config('route_permissions.middleware.admin'))`), then apply `config('route_permissions.middleware.transport')`. Same pattern as inventory (inventory routes sit inside admin, then inventory middleware). So: auth, verified → admin (check-role) → transport (permission group) → transport routes.

Under that group:

- `GET /transport` → Inertia `transport/index` (dashboard/overview).
- `GET /transport/stops` → `transport/stops/index`.
- `GET /transport/stops/create`, `GET /transport/stops/{id}/edit`.
- `GET /transport/routes` → `transport/routes/index`.
- `GET /transport/routes/create`, `GET /transport/routes/{id}`, `GET /transport/routes/{id}/edit` (route detail with stops).
- `GET /transport/vehicles` → `transport/vehicles/index`.
- `GET /transport/vehicles/create`, `GET /transport/vehicles/{id}/edit`.
- `GET /transport/drivers` → `transport/drivers/index`.
- `GET /transport/drivers/create`, `GET /transport/drivers/{id}/edit`.
- `GET /transport/assignments` → `transport/assignments/index`.
- `GET /transport/assignments/create` (or assign from student profile), `GET /transport/assignments/{id}/edit`.
- Optional: `GET /transport/reports/manifest`, `GET /transport/reports/occupancy`.

---

## 8. Config and seeders

### 8.1 `config/route_permissions.php`

- **middleware:** add  
  `'transport' => ['ensure-permission-group:transport'],`
- **Permission group (transport):** list all keys from section 2 (view_transport_routes, create_transport_routes, …).

### 8.2 `database/seeders/data/permissions.php`

Append all transport permission entries (key, name, module `transport`).

### 8.3 `database/seeders/data/workflows.php`

Add one workflow:

```php
[
    'key' => 'transport',
    'name' => 'Transport – Routes, Vehicles & Assignments',
    'description' => 'Manage transport stops, routes, vehicles, drivers, and student transport assignments.',
    'permissions' => [
        'view_transport_routes',
        'create_transport_routes',
        'update_transport_routes',
        'delete_transport_routes',
        'view_transport_stops',
        'create_transport_stops',
        'update_transport_stops',
        'delete_transport_stops',
        'view_transport_vehicles',
        'create_transport_vehicles',
        'update_transport_vehicles',
        'delete_transport_vehicles',
        'view_transport_drivers',
        'create_transport_drivers',
        'update_transport_drivers',
        'delete_transport_drivers',
        'view_transport_assignments',
        'create_transport_assignments',
        'update_transport_assignments',
        'delete_transport_assignments',
        'view_transport_reports',
    ],
],
```

### 8.4 `database/seeders/data/role_mapping.php`

Add `transport` workflow to roles that should manage transport, e.g.:

- **institution_admin**, **principal:** add `'transport'` to `workflows` array.
- **staff:** add `'transport'` if transport office staff should manage routes/vehicles/assignments.

---

## 9. Frontend (sidebar and pages)

- **Sidebar:** In `resources/js/constants/sidebar/admin.ts`, add a group e.g. **"Transport"** with links to:
  - **Overview** → `/transport`
  - **Stops** → `/transport/stops`
  - **Routes** → `/transport/routes`
  - **Vehicles** → `/transport/vehicles`
  - **Drivers** → `/transport/drivers`
  - **Assignments** → `/transport/assignments`
  - **Manifest** (optional) → `/transport/reports/manifest`
  - **Occupancy** (optional) → `/transport/reports/occupancy`

  Use permission-based visibility (e.g. show if user has any of the transport permissions). Use an icon such as `Bus` or `Car` from lucide-react.

- **Pages:** Add Inertia pages under `resources/js/pages/transport/` (stops, routes, vehicles, drivers, assignments index/create/edit/show). Reuse existing patterns (tables, forms, API hooks) from inventory/admission/fees.

- **Student profile (optional):** On student detail/edit, show current transport assignment and link to "Change transport" or "Assign transport" (create assignment) if permission allows.

---

## 9a. UI Plan (detailed)

UI follows the same patterns as the Inventory module: [resources/js/pages/inventory](resources/js/pages/inventory), [resources/js/constants/page/admin/inventory.ts](resources/js/constants/page/admin/inventory.ts), [resources/js/lib/api/inventoryApi.ts](resources/js/lib/api/inventoryApi.ts), and shared components (DataTable, FilterBar, ConfirmDialog, MainPageHeader, AppLayout).

### 9a.1 Layout and shell

- **Layout:** Every transport page uses `AppLayout` with `breadcrumbs` prop (same as inventory).
- **Breadcrumbs:** Define in a single constants file so all pages use consistent trail (Transport → Stops, Transport → Routes, etc.).
- **Page header:** Use `MainPageHeader` with `breadcrumbs`, `icon`, `title`, `subtitle`, and optional `guidance` (short bullet list).
- **Sidebar:** Add a **Transport** group under the admin sidebar (inside [resources/js/constants/sidebar/admin.ts](resources/js/constants/sidebar/admin.ts)) with permission-based items; icon `Bus` from lucide-react.

### 9a.2 Constants file

- **Path:** `resources/js/constants/page/admin/transport.ts`.
- **Contents:**
  - **Breadcrumbs:** `TRANSPORT_BREADCRUMBS`, `TRANSPORT_STOPS_BREADCRUMBS`, `TRANSPORT_ROUTES_BREADCRUMBS`, `TRANSPORT_VEHICLES_BREADCRUMBS`, `TRANSPORT_DRIVERS_BREADCRUMBS`, `TRANSPORT_ASSIGNMENTS_BREADCRUMBS`, `TRANSPORT_MANIFEST_BREADCRUMBS`, `TRANSPORT_OCCUPANCY_BREADCRUMBS`.
  - **Guidelines:** Short arrays for each section (e.g. "Stops are pickup/drop points; define them before building routes.").
  - **Form layouts (for dialogs or create/edit pages):** Use `FORM_TYPE` from [resources/js/constants/shared/form.ts](resources/js/constants/shared/form.ts). Define initial values and field config for:
    - Stop: name, code, address, landmark, latitude, longitude, is_active.
    - Route: name, code, description, is_active (stops are managed separately on route show/edit).
    - Driver: name, license_number, license_valid_until, mobile, email, is_active (user_id optional, for staff driver).
    - Vehicle: registration_number, vehicle_type, capacity, transport_route_id, transport_driver_id, status, notes.
    - Assignment: user_id (student picker), transport_route_id, transport_stop_id (filtered by route), effective_from, effective_until, remarks.
  - **Options:** Vehicle type options (bus, van, cab), status options (active, maintenance, inactive).

### 9a.3 API client

- **Path:** `resources/js/lib/api/transportApi.ts`.
- **Pattern:** Same as [resources/js/lib/api/inventoryApi.ts](resources/js/lib/api/inventoryApi.ts): use shared `api` instance, base path `/transport`.
- **Endpoints to wrap:**
  - **stops:** index(params), show(id), store(data), update(id, data), destroy(id).
  - **routes:** index(params), show(id), store(data), update(id, destroy(id)); **routeStops:** index(routeId), store(routeId, data), updateBulk(routeId, array).
  - **drivers:** index(params), show(id), store(data), update(id, data), destroy(id).
  - **vehicles:** index(params), show(id), store(data), update(id, data), destroy(id).
  - **assignments:** index(params: user_id?, route_id?, effective_on?), show(id), store(data), update(id, data), destroy(id).
  - **reports:** manifest(route_id, date?), occupancy().

### 9a.4 Page structure (Inertia pages)

| Route | Page path | Purpose |
|-------|-----------|--------|
| GET /transport | `transport/index.tsx` | Overview: card grid linking to Stops, Routes, Vehicles, Drivers, Assignments, Manifest, Occupancy (same pattern as [resources/js/pages/inventory/index.tsx](resources/js/pages/inventory/index.tsx)). |
| GET /transport/stops | `transport/stops/index.tsx` | List stops: DataTable, FilterBar (search), Add button opens dialog or navigates to create. Edit/Delete per row. |
| GET /transport/stops/create | `transport/stops/create.tsx` | Create stop: form (name, code, address, landmark, optional lat/lng, is_active). Submit → transportApi.stops.store; on success → visit /transport/stops. |
| GET /transport/stops/{id}/edit | `transport/stops/edit.tsx` | Edit stop: same fields, pre-filled; transportApi.stops.update. |
| GET /transport/routes | `transport/routes/index.tsx` | List routes: DataTable, Add → create, View/Edit per row. |
| GET /transport/routes/create | `transport/routes/create.tsx` | Create route: name, code, description, is_active. After create, redirect to route show to add stops. |
| GET /transport/routes/{id} | `transport/routes/show.tsx` | Route detail: name, code, description; **ordered list of stops** (from routeStops) with sequence, arrival_time, departure_time. Buttons: Add stop (dialog or inline), Reorder (e.g. PUT bulk), Edit route. |
| GET /transport/routes/{id}/edit | `transport/routes/edit.tsx` | Edit route basic fields; optionally embed stop order here or keep on show. |
| GET /transport/vehicles | `transport/vehicles/index.tsx` | List vehicles: DataTable (registration, type, capacity, route, driver, status), Add, Edit, Delete. |
| GET /transport/vehicles/create | `transport/vehicles/create.tsx` | Create vehicle: form with route and driver dropdowns (optional). |
| GET /transport/vehicles/{id}/edit | `transport/vehicles/edit.tsx` | Edit vehicle. |
| GET /transport/drivers | `transport/drivers/index.tsx` | List drivers: DataTable, Add, Edit, Delete. |
| GET /transport/drivers/create | `transport/drivers/create.tsx` | Create driver. |
| GET /transport/drivers/{id}/edit | `transport/drivers/edit.tsx` | Edit driver. |
| GET /transport/assignments | `transport/assignments/index.tsx` | List assignments: DataTable (user name, route, stop, effective_from, effective_until). FilterBar: user_id, route_id, effective_on (date). Add, Edit, Delete. |
| GET /transport/assignments/create | `transport/assignments/create.tsx` | Create assignment: user picker (students of institution), route select, stop select (filtered by route), effective_from, effective_until, remarks. |
| GET /transport/assignments/{id}/edit | `transport/assignments/edit.tsx` | Edit assignment. |
| GET /transport/reports/manifest | `transport/reports/manifest.tsx` | Report: select route (required), optional date. Display list of students (from assignments) grouped or ordered by stop sequence. |
| GET /transport/reports/occupancy | `transport/reports/occupancy.tsx` | Report: vehicles with assigned route; count of assignments per route; capacity vs count (occupancy). |

### 9a.5 Reusable components

- **Dialogs (optional):** For quick add/edit without leaving the list, use modal dialogs (e.g. `TransportStopDialog`, `TransportDriverDialog`, `TransportVehicleDialog`) similar to [InventoryCategoryDialog](resources/js/components/admin/inventoryCategoryDialog.tsx) / [InventoryItemDialog](resources/js/components/admin/inventoryItemDialog.tsx). Alternatively use full-page create/edit only (simpler; matches categories create/edit).
- **Tables:** Use `DataTable`, `TableSkeletonLoader`, `TableEmptyState` from `@/components/dataTable`; `TableCell`, `TableRow` from `@/components/ui/table`.
- **Filters:** `FilterBar` + `useSearchFilter` for index pages that support search or filters (stops, routes, vehicles, drivers, assignments).
- **Delete confirmation:** `ConfirmDialog` with `useDisclosure` for delete target; on confirm call transportApi.*.destroy(id) and invalidate query.
- **Forms:** Use shared `Input`, `Label`, `Button`, `Card`, `Select`, `Textarea`; for layout-driven forms use the constants (form layout arrays) with a generic form renderer if one exists, or build per-page.

### 9a.6 Data flow

- **List pages:** `useQuery` with queryKey including entity and filter; `queryFn` calls transportApi.*.index(filter). Invalidate on create/update/delete (useQueryClient.invalidateQueries).
- **Create/Edit pages:** Local state or form state; `useMutation` with transportApi.*.store or update; onSuccess redirect (router.visit) or close dialog and invalidate.
- **Route show (stops):** Load route by id (useQuery transportApi.routes.show(id)); load routeStops (transportApi.routeStops.index(routeId)). Add/remove/reorder via store or updateBulk, then invalidate routeStops query.
- **Assignment create:** Load routes (transportApi.routes.index), stops (transportApi.stops.index) or stops by route; load students (existing students API or dedicated transport “students for assignment” endpoint). When route changes, filter stops to those on the selected route (from routeStops or a stops-by-route API).

### 9a.7 Permissions in UI

- **Sidebar:** Each nav item uses `permission` prop (e.g. `view_transport_stops`) so the item is hidden if the user lacks that permission (same as inventory sidebar).
- **Buttons:** Hide “Add”, “Edit”, “Delete” when user lacks create_*, update_*, delete_* respectively (e.g. `hasPermission('create_transport_stops')` from auth or a permissions helper).
- **Reports:** Manifest and Occupancy pages check `view_transport_reports` before rendering or fetching.

---

## 10. Implementation order

0. **Branch**  
   - Create and switch to `feature/transport-module`. All following steps are done on this branch.

1. **Config & permissions**  
   - Add `transport` middleware and permission group in `route_permissions.php`.  
   - Add permission rows in `database/seeders/data/permissions.php`.  
   - Add workflow in `database/seeders/data/workflows.php`.  
   - Add `transport` workflow to role_mapping for institution_admin, principal (and optionally staff).  
   - Run PermissionSeeder, WorkflowSeeder, RoleMappingSeeder (or full `db:seed`).

2. **Migrations**  
   - Create migrations: `transport_stops`, `transport_routes`, `transport_route_stops`, `transport_drivers`, `transport_vehicles`, `transport_assignments`.  
   - Run `php artisan migrate`.

3. **Models**  
   - Create TransportStop, TransportRoute, TransportRouteStop, TransportDriver, TransportVehicle, TransportAssignment with `BelongsToDefaultInstitution` and relationships.  
   - Validate in TransportAssignment that the selected stop belongs to the selected route (e.g. in a service or model rule).

4. **API**  
   - Create controllers: TransportStopController, TransportRouteController (with route-stops actions), TransportDriverController, TransportVehicleController, TransportAssignmentController; optional TransportReportController.  
   - Register routes in `routes/api.php` under the transport middleware.  
   - Enforce permission keys in each method.

5. **Web routes**  
   - Register Inertia routes in `routes/web.php` under the transport middleware.

6. **Frontend**  
   - Add `resources/js/constants/page/admin/transport.ts` (breadcrumbs, guidelines, form layouts, options).  
   - Add `resources/js/lib/api/transportApi.ts` (stops, routes, routeStops, drivers, vehicles, assignments, reports).  
   - Add sidebar group "Transport" in `resources/js/constants/sidebar/admin.ts` with permission-based links.  
   - Add Inertia pages under `resources/js/pages/transport/`: index (overview), stops (index, create, edit), routes (index, create, show, edit), vehicles (index, create, edit), drivers (index, create, edit), assignments (index, create, edit), reports (manifest, occupancy).  
   - Wire list pages to transportApi with useQuery/useMutation; use DataTable, FilterBar, ConfirmDialog, MainPageHeader, AppLayout. Optionally add dialog components for quick add/edit (e.g. TransportStopDialog) or rely on full-page create/edit only.

7. **Optional (Phase 2)**  
   - Transport fee: FeeHead "Transport Fee", report of students with assignment, bulk add to fee structure.  
   - Manifest report (by route/date).  
   - Occupancy report (vehicle capacity vs assigned count).  
   - Student profile: show/edit transport assignment.

---

## 11. Summary table

| Layer | Action |
|-------|--------|
| Branch | Create `feature/transport-module`; all work on this branch until merge |
| Config | `route_permissions.php`: middleware `transport`, group `transport` (all keys) |
| Permissions | `permissions.php`: transport permission keys, module `transport` |
| Workflows | `workflows.php`: workflow `transport` with above permissions |
| Role mapping | `role_mapping.php`: add `transport` to institution_admin, principal (and optionally staff) |
| Migrations | 6 tables with FKs and onDelete per 3.7; unique (institution_id, code) for stops and routes when code not null |
| Models | TransportStop, TransportRoute, TransportRouteStop (pivot), TransportDriver, TransportVehicle, TransportAssignment; assignment validation per 3.8 |
| API | Register inside admin middleware, then transport; Controllers: Stops, Routes (+ route-stops PUT bulk, optional DELETE one); Drivers, Vehicles, Assignments; optional Reports |
| Web | Register inside admin middleware, then transport; Inertia pages per section 7 and 9a |
| Frontend | Constants, transportApi, sidebar "Transport", pages under `transport/`; permissions in UI per 9a.7 |
| Validation | Assignment: stop on route; user in institution (students only recommended); one active per user, auto-end previous |

---

## 12. Optional enhancements (later)

- **Trip attendance** – Table `transport_trips` (date, route_id, vehicle_id) and `transport_trip_attendances` (trip_id, user_id, status: present/absent). Mark students present per trip; reports for absenteeism.
- **Transport fee automation** – Auto-create fee structure line for "Transport Fee" for users with active transport_assignment; sync when assignment is added/removed.
- **Parent/student portal** – View assigned route and stop; optional bus ETA if tracking is added.
- **Live tracking** – Vehicle location updates (external integration or app); show on map.
- **Multiple stops per student** – Separate pickup_stop_id and drop_stop_id on assignment if needed (currently one stop for both; can be extended later).
- **Student list / profile integration** – On students (office registry) list or student detail page, show current transport assignment (route + stop) and link to "Change transport" or "Assign transport" when user has transport assignment permissions.
- **Export reports** – Manifest and occupancy: export as PDF or Excel (Phase 2).
- **Auditable** – Use `Auditable` trait on TransportAssignment (and optionally on TransportRoute, TransportVehicle, TransportDriver) for audit trail consistency with fee/inventory.
- **Driver license expiry** – Report or dashboard widget: "Drivers with license expiring within 30 days" using `license_valid_until`.

**Product choice (assignable users):** For first phase, restrict assignments to **students only** (validate that `user_id` has a StudentProfile for the active institution). If later the product allows staff transport, relax to "user belongs to institution" (StudentProfile or StaffProfile). Document the chosen rule in config or code comments.

This plan keeps the transport module consistent with existing modules and allows phased delivery: core (stops, routes, vehicles, drivers, assignments) first, then reports and fee integration.
