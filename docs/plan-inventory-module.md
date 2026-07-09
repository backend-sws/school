# Plan: Inventory Module

This document plans the **Inventory** module for the Education Management System, following the same patterns as Admission, Fees, Certificates, and Office Registry (permissions, workflows, institution-scoped data, web + API routes, sidebar).

---

## 1. Scope

**Inventory** covers:

- **Categories** – Types of assets (e.g. Lab Equipment, Library Books, Furniture, Stationery, IT Assets).
- **Items** – Individual asset types or SKUs (name, category, code, unit, min/max stock, location).
- **Stock / quantity** – Per-item quantity (and optionally per location if multi-location is needed later).
- **Movements** – Issue, return, receive, adjust (who, when, quantity, reference, remarks).

Optionally in a later phase: locations/warehouses, barcode/serial, vendor and purchase orders.

---

## 2. Permission group and workflow

- **Config key:** `inventory` (middleware) and `inventory` (permission group).
- **Workflow key:** `inventory` – “Inventory – Assets & Stock”.
- **Middleware:** `ensure-permission-group:inventory` for all inventory routes.

| Permission key | Name |
|----------------|------|
| `view_inventory_categories` | View Inventory Categories |
| `create_inventory_categories` | Create Inventory Categories |
| `update_inventory_categories` | Update Inventory Categories |
| `delete_inventory_categories` | Delete Inventory Categories |
| `view_inventory_items` | View Inventory Items |
| `create_inventory_items` | Create Inventory Items |
| `update_inventory_items` | Update Inventory Items |
| `delete_inventory_items` | Delete Inventory Items |
| `view_inventory_movements` | View Stock Movements |
| `create_inventory_movements` | Issue / Receive / Adjust Stock |
| `view_inventory_reports` | View Inventory Reports |

---

## 3. Database (migrations)

All tables **institution-scoped** via `institution_id` and `BelongsToDefaultInstitution`.

### 3.1 `inventory_categories`

| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| institution_id | FK institutions | |
| name | string(100) | e.g. "Lab Equipment" |
| code | string(50) nullable | Optional short code |
| description | text nullable | |
| created_at, updated_at | timestamps | |

Index: `institution_id`.

### 3.2 `inventory_items`

| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| institution_id | FK institutions | |
| inventory_category_id | FK inventory_categories | |
| name | string(200) | |
| code | string(80) nullable | SKU/code unique per institution |
| unit | string(20) default 'piece' | piece, box, set, etc. |
| min_stock | decimal(12,3) default 0 | Low-stock threshold |
| current_quantity | decimal(12,3) default 0 | Denormalized for quick list/reports |
| location | string(150) nullable | Optional storage location |
| description | text nullable | |
| is_active | boolean default true | |
| created_at, updated_at | timestamps | |

Unique: `(institution_id, code)` when code not null. Indexes: `institution_id`, `inventory_category_id`, `is_active`.

### 3.3 `inventory_movements`

| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| institution_id | FK institutions | |
| inventory_item_id | FK inventory_items | |
| type | string(20) | issue, return, receive, adjust |
| quantity | decimal(12,3) | Positive for receive/return, negative for issue, +/- for adjust |
| quantity_after | decimal(12,3) nullable | Snapshot after movement (optional) |
| reference_type | string(50) nullable | e.g. "user", "application" |
| reference_id | bigint nullable | |
| performed_by | FK users | |
| remarks | text nullable | |
| created_at | timestamp | |

Indexes: `institution_id`, `inventory_item_id`, `type`, `created_at`.

**Triggers or app logic:** On insert of `inventory_movements`, update `inventory_items.current_quantity` (and optionally set `quantity_after`).

---

## 4. Models

- **InventoryCategory** – `BelongsToDefaultInstitution`, fillable, `institution_id`, hasMany InventoryItem.
- **InventoryItem** – `BelongsToDefaultInstitution`, fillable, belongsTo InventoryCategory, hasMany InventoryMovement; mutator/observer or service to update `current_quantity` on movement.
- **InventoryMovement** – `BelongsToDefaultInstitution`, fillable, belongsTo InventoryItem, belongsTo User (performed_by).

All use `institution_id` and the existing trait so global scope filters by active institution.

---

## 5. API routes (under `api/v1`)

All under middleware: `auth` + `ensure-permission-group:inventory` (or equivalent from `route_permissions.middleware.inventory`).

- **Categories:**  
  `GET/POST /inventory/categories`, `GET/PUT/DELETE /inventory/categories/{id}`  
  (index, store, show, update, destroy; gate by view_* / create_* / update_* / delete_* permissions in controller.)

- **Items:**  
  `GET/POST /inventory/items`, `GET/PUT/DELETE /inventory/items/{id}`  
  Optional: `GET /inventory/items?category_id=...` for filtering.

- **Movements:**  
  `GET /inventory/items/{id}/movements` (or `GET /inventory/movements?item_id=...`),  
  `POST /inventory/movements` (body: inventory_item_id, type, quantity, remarks, optional reference_*).  
  Controller updates item’s `current_quantity` and optionally sets `quantity_after`.

- **Reports (optional):**  
  `GET /inventory/reports/low-stock` – items where `current_quantity <= min_stock`.

Use existing `BaseController` and response helpers; enforce permissions with `EnsurePermission` or inline checks against `auth()->user()->hasAbility(...)`.

---

## 6. Web routes (Inertia)

Under `Route::middleware(['auth', 'verified', config('route_permissions.middleware.inventory')])`:

- `GET /inventory` → Inertia `inventory/dashboard` or `inventory/index` (overview / list).
- `GET /inventory/categories` → `inventory/categories/index`.
- `GET /inventory/categories/create`, `GET /inventory/categories/{id}/edit`.
- `GET /inventory/items` → `inventory/items/index`.
- `GET /inventory/items/create`, `GET /inventory/items/{id}`, `GET /inventory/items/{id}/edit`.
- `GET /inventory/movements` → `inventory/movements/index` (optional filter by item).
- Optional: `GET /inventory/reports/low-stock` → `inventory/reports/low-stock`.

---

## 7. Config and seeders

### 7.1 `config/route_permissions.php`

- **middleware:** add  
  `'inventory' => ['ensure-permission-group:inventory'],`
- **Permission group (inventory):** list all keys above (view_inventory_categories, create_inventory_categories, …).

### 7.2 `database/seeders/data/permissions.php`

Append all inventory permission entries (key, name, module `inventory`).

### 7.3 `database/seeders/data/workflows.php`

Add one workflow:

```php
[
    'key' => 'inventory',
    'name' => 'Inventory – Assets & Stock',
    'description' => 'Manage inventory categories, items, and stock movements (issue/receive/adjust).',
    'permissions' => [
        'view_inventory_categories',
        'create_inventory_categories',
        'update_inventory_categories',
        'delete_inventory_categories',
        'view_inventory_items',
        'create_inventory_items',
        'update_inventory_items',
        'delete_inventory_items',
        'view_inventory_movements',
        'create_inventory_movements',
        'view_inventory_reports',
    ],
],
```

### 7.4 `database/seeders/data/role_mapping.php`

Add `inventory` workflow to roles that should have inventory access, e.g.:

- **institution_admin**, **principal:** add `'inventory'` to `workflows` array.
- **staff:** add `'inventory'` if store/office staff should manage stock.

(No change for student/candidate unless you later add a portal “request item” flow.)

---

## 8. Frontend (sidebar and pages)

- **Sidebar:** In `resources/js/constants/sidebar/admin.ts` (or equivalent), add a group e.g. “Inventory” with links to `/inventory`, `/inventory/categories`, `/inventory/items`, `/inventory/movements`, and optionally “Low stock” report. Use existing permission-based visibility (e.g. show if user has any of the inventory permissions).
- **Pages:** Add Inertia pages under `resources/js/pages/inventory/` (categories index/create/edit, items index/create/show/edit, movements index, optional reports). Reuse existing patterns (tables, forms, API hooks) from admission/fees/certificates.

---

## 9. Implementation order

1. **Config & permissions**  
   - Add `inventory` middleware and permission group in `route_permissions.php`.  
   - Add permission rows in `database/seeders/data/permissions.php`.  
   - Add workflow in `database/seeders/data/workflows.php`.  
   - Add `inventory` workflow to role_mapping for institution_admin, principal (and optionally staff).  
   - Run PermissionSeeder, WorkflowSeeder, RoleMappingSeeder (or full `db:seed`).

2. **Migrations**  
   - Create migration for `inventory_categories`, `inventory_items`, `inventory_movements`.  
   - Run `php artisan migrate`.

3. **Models**  
   - Create InventoryCategory, InventoryItem, InventoryMovement with `BelongsToDefaultInstitution` and relationships.

4. **API**  
   - Create `App\Http\Controllers\Api\V1\Inventory\InventoryCategoryController`, `InventoryItemController`, `InventoryMovementController` (and optional `InventoryReportController`).  
   - Register routes in `routes/api.php` under the inventory middleware.  
   - Enforce permission keys (view_*, create_*, update_*, delete_*) in each method.

5. **Web routes**  
   - Register Inertia routes in `routes/web.php` under the same inventory middleware.

6. **Frontend**  
   - Add sidebar group and links.  
   - Add Inertia pages and wire them to the new API endpoints.

7. **Optional**  
   - Low-stock report API + page.  
   - Seed demo categories/items per institution (e.g. in DemoSchoolSeeder) if desired.

---

## 10. Summary table

| Layer | Action |
|-------|--------|
| Config | `route_permissions.php`: middleware `inventory`, group `inventory` (all keys) |
| Permissions | `permissions.php`: 11 new keys, module `inventory` |
| Workflows | `workflows.php`: workflow `inventory` with above permissions |
| Role mapping | `role_mapping.php`: add `inventory` to institution_admin, principal (and optionally staff) |
| Migrations | 3 tables: inventory_categories, inventory_items, inventory_movements |
| Models | InventoryCategory, InventoryItem, InventoryMovement (BelongsToDefaultInstitution) |
| API | Controllers: InventoryCategory, InventoryItem, InventoryMovement (CRUD + movements list/create) |
| Web | Routes under middleware inventory → Inertia pages |
| Frontend | Sidebar group “Inventory”; pages under `inventory/` |

This keeps the inventory module consistent with existing modules (Admission, Fees, Certificates, Office Registry) and ready to extend later (locations, vendors, purchase orders, barcodes).
