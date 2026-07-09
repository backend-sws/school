# Plan: Inventory Selling (Sales to Parents, Students, Others)

This document plans the **selling of inventory items** to parents, students, or anyone else, reusing the **existing fee module** for payment recording and collection.

---

## 1. Scope

- **Sell** inventory items (e.g. books, stationery, uniforms, lab kits) to:
  - **Students** (users with student profile / role)
  - **Parents / guardians** (users linked as parent or with parent role)
  - **Others** (walk-in / external buyer; name captured, optional user link)
- **Payment** is recorded via the existing **FeePayment** flow so:
  - All sales appear in fee/payment reports.
  - Same payment modes (cash, online, etc.) and collection workflow.
  - One payment per sale (sale total = payment amount).

---

## 2. Integration with Fee Module

### 2.1 Current fee flow (brief)

- **FeeHead** – A fee bundle (e.g. "Semester Fee 2024") with optional stream/session; has `amount`, `allow_custom_fee`, `min_allowed_fee`, etc.
- **FeePayment** – One record per payment: `user_id` (payee), `fee_head_id`, `amount`, `total_amount`, `payment_status`, `payment_mode`, `collected_by`, `transaction_id`, etc.
- **FeeParticular** / **FeeHeadStructure** – Break down a fee head into particulars and amounts (used for structured fees; for inventory sales we use a single “Inventory Sales” head with custom amount).

### 2.2 Approach: Dedicated “Inventory Sales” fee head

- **Per institution**, ensure one **FeeHead** used only for inventory sales, e.g.:
  - Title: **"Inventory Sales"** (or "Store Sales")
  - No stream/session required (nullable).
  - `allow_custom_fee` = true so the **amount is the sale total** (not fixed).
  - No late fee; status active.
- **Each sale** creates **one FeePayment**:
  - `fee_head_id` = Inventory Sales fee head
  - `user_id` = buyer (see below for “Other”)
  - `amount` = `total_amount` = sale total
  - `payment_status` = `pending` until collected; then `paid` via existing confirm/collect.
- **Linking**: A new **inventory_sales** table holds the sale header and has `fee_payment_id` (nullable until payment is created). So: **Sale → FeePayment (same amount) → on payment confirm, reduce stock**.

### 2.3 Buyer and `user_id`

- **Student / Parent**: Buyer is an existing **User** (student or parent/guardian). `FeePayment.user_id` = that user’s id.
- **Other (walk-in)**: Two options:
  - **Option A (simplest):** Create a generic institution user per institution, e.g. "Walk-in Buyer" / "Cash Sale Customer", and use that `user_id` for all walk-in sales. Store the actual buyer name in `inventory_sales.buyer_name`.
  - **Option B:** Allow `user_id` nullable on FeePayment for a new “type” (e.g. inventory_sale). That would require migration and controller changes to FeePayment. **Recommended for first phase: Option A** so existing fee reports and constraints stay unchanged.

---

## 3. Data model

### 3.1 Inventory items: selling price

Add optional selling price on items (default price at sale time; can be overridden per line).

| Column           | Type              | Notes                          |
|------------------|-------------------|--------------------------------|
| selling_price    | decimal(12,2) nullable | Default sale price per unit |

- Migration: `add_column inventory_items, selling_price, decimal(12,2) nullable`.
- Model: add to `InventoryItem` fillable and cast.

### 3.2 New table: `inventory_sales`

Sale header: who bought, total, link to payment.

| Column            | Type         | Notes |
|-------------------|--------------|--------|
| id                | bigint PK    | |
| institution_id    | FK institutions | |
| fee_payment_id    | FK fee_payments nullable | Set when payment record is created |
| user_id           | FK users nullable | Buyer (student/parent); null for walk-in if using Option B, else walk-in user |
| buyer_type        | string(20)   | `student`, `parent`, `other` |
| buyer_name        | string(200) nullable | Display name; for walk-in or override |
| total_amount      | decimal(12,2) | Sum of line amounts |
| payment_status    | string(20) default pending | Mirror or derive from fee_payment.payment_status |
| collected_by      | FK users nullable | Staff who collected payment |
| remarks           | text nullable | |
| created_at        | timestamp    | |

Indexes: `institution_id`, `fee_payment_id`, `user_id`, `created_at`, `payment_status`.

### 3.3 New table: `inventory_sale_lines`

Line items: what was sold, qty, price.

| Column            | Type         | Notes |
|-------------------|--------------|--------|
| id                | bigint PK    | |
| inventory_sale_id | FK inventory_sales | |
| inventory_item_id | FK inventory_items | |
| quantity          | decimal(12,3) | |
| unit_price        | decimal(12,2) | Price at time of sale |
| amount            | decimal(12,2) | quantity * unit_price |

Indexes: `inventory_sale_id`, `inventory_item_id`.

### 3.4 Stock reduction and movement

- When a sale is **confirmed/paid** (payment collected):
  - For each **inventory_sale_line**, create an **InventoryMovement**:
    - `type` = `issue`
    - `quantity` = **negative** (e.g. -2) so that `current_quantity` decreases
    - `reference_type` = `inventory_sale`
    - `reference_id` = `inventory_sale.id`
    - `remarks` = optional (e.g. "Sale #123")
  - Use existing movement logic to update `inventory_items.current_quantity` and set `quantity_after`.
- **Validation**: Before confirming, check each line’s item has `current_quantity >= line.quantity`; otherwise reject or allow partial (depending on product decision).

---

## 4. Models

- **InventoryItem** – Add `selling_price` (fillable, cast).
- **InventorySale** – `BelongsToDefaultInstitution`, belongsTo Institution, belongsTo FeePayment (nullable), belongsTo User (nullable, buyer), belongsTo User (collectedBy), hasMany InventorySaleLine. Scoped by institution.
- **InventorySaleLine** – belongsTo InventorySale, belongsTo InventoryItem; fillable: quantity, unit_price, amount (or computed).
- **InventoryMovement** – Already has `reference_type`, `reference_id`; use for linking to InventorySale.
- **FeePayment** – No schema change. Optional: hasOne InventorySale (if we add `inventory_sale_id` on fee_payments later for quick lookup; otherwise link from inventory_sales.fee_payment_id only).

---

## 5. Permissions and workflow

Add to inventory permission group (or a new “inventory_sales” group):

| Key                     | Name                          |
|-------------------------|-------------------------------|
| view_inventory_sales    | View Inventory Sales          |
| create_inventory_sales  | Create Sale (sell items)      |
| view_inventory_sale_reports | View Sales Reports        |

- Reuse existing **fee** permissions for viewing/collecting payments (e.g. `view_fee_payments`); inventory sales will appear in fee payment lists when filtered by the Inventory Sales fee head.
- Optional: Add these to the existing **inventory** workflow so same roles that manage stock can also sell.

---

## 6. Fee head setup (Inventory Sales)

- **Seeder / bootstrap**: For each institution (or in a migration/seeder), ensure one FeeHead exists:
  - `title` = "Inventory Sales" (or from config)
  - `institution_id`, other FKs nullable (no stream/session)
  - `allow_custom_fee` = true
  - `min_allowed_fee` = 0
  - `status` = active
- **Config**: Optional `config/inventory.php` with `sales_fee_head_title` or `create_sales_fee_head_if_missing` so the first sale can create it if absent.

---

## 7. API (backend)

All under existing auth and institution scope; add inventory (or inventory_sales) permission checks.

### 7.1 Sales

- **POST /api/v1/inventory/sales**  
  - Body: `buyer_type`, `user_id` (optional; required for student/parent), `buyer_name` (optional; for walk-in/display), `lines`: `[{ inventory_item_id, quantity, unit_price }]`, optional `remarks`.  
  - Validate: user_id required when buyer_type in (student, parent); for “other”, use walk-in user and store buyer_name.  
  - Compute total from lines; check stock (current_quantity >= quantity per line).  
  - Create: InventorySale (pending), InventorySaleLine(s), then FeePayment (fee_head_id = Inventory Sales, user_id = buyer or walk-in user, amount = total).  
  - Set inventory_sale.fee_payment_id and optionally payment_status from fee_payment.  
  - Return sale + fee_payment (so frontend can redirect to payment collect or show “Pay now”).

- **GET /api/v1/inventory/sales**  
  - List sales (paginated), filter by payment_status, user_id, date range. With lines and fee_payment.

- **GET /api/v1/inventory/sales/{id}**  
  - Single sale with lines, item details, fee_payment.

- **POST /api/v1/inventory/sales/{id}/confirm**  
  - Idempotent: if payment already collected (fee_payment.payment_status = paid), create movements and reduce stock (if not already done), mark sale as completed. If payment still pending, either fail or trigger collection flow (product choice).

### 7.2 Fee payment integration

- **Existing**  
  - **GET /api/v1/fee-payments?fee_head_id={inventory_sales_head_id}** – list sales payments.  
  - **POST /api/v1/fee-payments/{id}/confirm** (or collect) – when called for a payment that has an linked inventory_sale, after marking paid, create issue movements and reduce stock (or delegate to a service called from both confirm and sales/confirm).

- **Recommendation**: Centralise “on fee payment confirmed for an inventory sale” in a **service** (e.g. `InventorySaleService::confirmPayment(FeePayment $payment)`), and call it from:
  - FeePaymentController (when confirm is called for a payment that has an inventory_sale), or
  - InventorySaleController (when sales/{id}/confirm is called and payment is already paid).

---

## 8. Frontend (Inertia + React)

### 8.1 New pages / flows

- **Sales list**  
  - Route: `GET /inventory/sales` → `inventory/sales/index.tsx`.  
  - Table: date, buyer (name/user), total, payment status, actions (View, Collect payment link if pending).

- **Create sale (Point of Sale)**  
  - Route: `GET /inventory/sales/create` → `inventory/sales/create.tsx`.  
  - Steps:  
    1. Choose **buyer type**: Student / Parent / Other.  
    2. If Student/Parent: search/select **user** (students or parents list).  
    3. If Other: enter **buyer name** (and optionally phone); backend uses walk-in user.  
    4. Add **line items**: select inventory item (name, code, current stock, default selling_price), quantity, unit_price (editable), amount.  
    5. Show **total**; optional remarks.  
    6. Submit → POST inventory/sales → backend creates sale + FeePayment → redirect to “Collect payment” (existing fee payment collect UI) or show success with link to collect.

- **Collect payment**  
  - Reuse existing fee payment collect flow: from sale detail or from fee-payments list (filter by Inventory Sales head).  
  - On success (payment confirmed), backend runs stock reduction and marks sale complete (if not already).

- **Sale detail**  
  - Route: `GET /inventory/sales/{id}` → `inventory/sales/show.tsx`.  
  - Show lines, buyer, total, payment status, link to fee payment (view/collect).

### 8.2 Sidebar / navigation

- Under **Inventory**: add **“Sales”** (or “Point of Sale”) → `/inventory/sales`.  
- Optional: **“Sales reports”** → simple report (sales by date, by buyer type, total collected) using existing sale and fee_payment data.

---

## 9. Flow summary

1. Staff opens **Create sale**; selects buyer type and buyer (user or name for walk-in).
2. Adds line items (item, qty, unit price); total is computed.
3. Submits → **Backend**: creates InventorySale + lines + **FeePayment** (Inventory Sales head, amount = total). Returns sale + fee_payment_id.
4. Frontend redirects to **Collect payment** (existing fee flow) or staff collects cash and marks paid in fee payment.
5. When **FeePayment** is marked **paid**: backend (in confirm or in a listener/service) creates **InventoryMovement** (issue) per line and decrements **inventory_items.current_quantity**; marks sale as completed.
6. **Reports**: Sales list and fee payment list (filter by fee head) show all sales; financial reports remain in fee module.

---

## 10. Implementation order

1. **Migration**: Add `selling_price` to `inventory_items`; create `inventory_sales` and `inventory_sale_lines`; ensure `inventory_movements` has `reference_type`/`reference_id` (already present).
2. **Seeder**: Create “Inventory Sales” FeeHead per institution (or on first use).
3. **Models**: InventorySale, InventorySaleLine; extend InventoryItem; optional FeePayment relation to InventorySale.
4. **Service**: `InventorySaleService` (create sale + fee payment; confirm payment = create movements + reduce stock).
5. **API**: InventorySaleController (store, index, show, confirm); optionally hook FeePaymentController confirm to call service when payment has linked sale.
6. **Permissions**: view_inventory_sales, create_inventory_sales, view_inventory_sale_reports; add to workflow/role mapping.
7. **Frontend**: Sales list, Create sale (POS), Sale detail; link to existing fee payment collect.
8. **Tests**: Unit tests for sale creation and stock reduction; feature test for API and payment confirm.

---

## 11. Optional enhancements (later)

- **Discount**: Optional discount per sale (amount or %) and store in `inventory_sales`; adjust total before creating FeePayment.
- **Partial payment**: Multiple FeePayments per sale (split payments); more complex; can defer.
- **Receipt**: PDF/print receipt with sale id, lines, total, payment id.
- **Barcode**: Scan item to add to sale (use item code or future barcode field).
- **Nullable user_id on FeePayment**: If product prefers “no generic walk-in user”, add nullable user_id and buyer_name on fee_payments for type=inventory_sale (requires migration and controller changes).

This plan keeps the selling process consistent with the existing fee module and reuses payment collection and reporting while adding a clear sales and stock-out flow.
