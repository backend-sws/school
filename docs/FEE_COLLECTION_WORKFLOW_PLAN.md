# Fee Collection Workflow – Planning Document

End-to-end plan for **monthly / quarterly** fee collection with configurable frequency, due dates, notifications, emails, and easy view & management.

---

## 1. Overview

| Goal | Description |
|------|-------------|
| **Frequency** | Monthly or quarterly (configurable per institution; extendable to half-yearly/yearly later). |
| **Due dates** | Configurable day-of-month (e.g. 5th) for monthly; quarter boundaries (e.g. 5th of Jan/Apr/Jul/Oct) for quarterly. |
| **Notifications** | In-app + optional email: reminder before due, overdue reminder, receipt after payment. |
| **View & manage** | Dashboard of dues/overdue, student ledger by period, bulk reminders, reports. |
| **Extensible** | Settings-driven; new frequencies and reminder rules without code changes where possible. |

---

## 2. Current State (What Exists)

- **FeePayment**: `for_month` (Y-m), `payment_status`, `total_amount`, `receipt_no`, `payment_date`, `user_id`, etc.
- **FeeStructureRule**: Class-scoped recurring fee types and amounts; no explicit “frequency” (matrix is built as 12 months from session start).
- **StudentLedgerController**: 12-month matrix from session start; `collect()` records payment for a given `for_month`.
- **MonthlyLedgerController**: Institution-level monthly collection summary (fee_payments + admission + certificate).
- **Notifications**: `AdmissionPaymentRecordedNotification`; pattern: `NotifiesViaRealtimeAndPush` (database + broadcast).
- **Settings**: `Setting` model with `setting_key`, `setting_value`, `setting_group`, `institution_id` for institution-level config.

---

## 3. Configuration & Data Model

### 3.1 Institution-Level Settings (fee_collection_*)

Store in `settings` table, `setting_group = 'fee_collection'` (or extend existing group). Suggested keys:

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `fee_collection_frequency` | string | `monthly` | `monthly` \| `quarterly` (later: `half_yearly`, `yearly`) |
| `fee_due_day_of_month` | int | 5 | Day of month for due date (1–28 safe for all months) |
| `reminder_days_before_due` | int | 3 | Send “due soon” reminder this many days before due |
| `overdue_reminder_after_days` | int | 7 | Send “overdue” reminder this many days after due |
| `late_fee_enabled` | bool | false | Whether to apply late fee after due date |
| `late_fee_after_days` | int | 10 | Days after due before late fee applies |
| `late_fee_type` | string | `fixed` | `fixed` \| `percent` |
| `late_fee_value` | decimal | 0 | Amount (if fixed) or % (if percent) |
| `reminder_send_email` | bool | true | Also send email for reminders (if mail configured) |
| `receipt_send_email` | bool | true | Send email receipt after fee payment |

Config file (optional): `config/fee_collection.php` with defaults; values overridden by DB settings per institution.

### 3.2 Period Representation

- **Monthly**: Keep using `for_month` as `Y-m` (e.g. `2025-03`). No schema change.
- **Quarterly**: Use same `for_month` column to store quarter identifier: `Y-Qn` (e.g. `2025-Q1`, `2025-Q2`) **or** first month of quarter `Y-m` (e.g. `2025-01` for Q1). Recommendation: store as `Y-m` of the **first month of the period** (e.g. `2025-01` = Jan–Mar) so existing aggregation and filters remain simple; derive “quarter” in UI and in reminder logic from config `fee_collection_frequency`.

Alternative: add nullable `for_period` (e.g. `2025-Q1`) and keep `for_month` for backward compatibility; ledger logic uses one or the other based on frequency. For minimal change, stick to **one field** and interpret by frequency:
- monthly: `for_month` = `2025-03` → March 2025
- quarterly: `for_month` = `2025-01` → Q1 (Jan–Mar), `2025-04` → Q2, etc.

### 3.3 Late Fee (Optional)

- Store on **FeePayment**: `late_fee_applied` already exists.
- When recording payment, if `payment_date` > due_date + `late_fee_after_days` and `late_fee_enabled`, compute late fee and set `late_fee_applied`; `total_amount` = base + late_fee.
- Due date for a period: e.g. monthly March → 5th March; quarterly Q1 → 5th January (or 5th of first month of quarter).

---

## 4. Notifications & Emails

### 4.1 Notification Events

| Event | When | Recipients | In-app | Push | Email |
|-------|------|------------|--------|------|--------|
| **Fee due reminder** | X days before due (cron) | Guardian + Student (or primary contact) | ✓ | ✓ | Optional (config) |
| **Fee overdue reminder** | Y days after due (cron) | Same | ✓ | ✓ | Optional |
| **Fee payment recorded** | On ledger collect / payment | Same | ✓ | ✓ | Optional (receipt) |

### 4.2 New Classes to Add

- **Notifications** (following existing pattern: `NotifiesViaRealtimeAndPush`, queueable; **include push** via `toWebPush()`):
  - `FeeDueReminderNotification` – period, due date, amount, student name, pay link/instructions; implement `toWebPush()` for push.
  - `FeeOverdueReminderNotification` – period, overdue by X days, amount, late fee if any; implement `toWebPush()` for push.
  - `FeePaymentRecordedNotification` – amount, period, receipt no, date (for ledger payments; distinct from admission payment); implement `toWebPush()` for push.
- **Mail** (optional, for email channel):
  - `FeeDueReminderMail` (Mailable).
  - `FeeOverdueReminderMail`.
  - `FeePaymentReceiptMail` (with receipt details / PDF link if you add receipt generation later).

Register in `config/notifications.php` under a “Fee collection” section.

### 4.3 Recipient Resolution

- Prefer **guardian** (linked to student): send to guardian user and optionally to student.
- If no guardian, send to **student** user.
- Use existing `Guardian` / `User` relationships; add a small helper e.g. `FeeRecipientResolver::recipientsForStudent($student)` returning list of notifiables.

---

## 5. Scheduled Jobs & Cron

### 5.1 Jobs

- **SendFeeDueRemindersJob**  
  - Runs daily (e.g. 9:00 AM).  
  - For each institution with fee collection enabled, find periods whose **due date** is exactly `reminder_days_before_due` days from today.  
  - For each student with expected dues for that period and no full payment yet, send `FeeDueReminderNotification` (and email if enabled).

- **SendFeeOverdueRemindersJob**  
  - Runs daily.  
  - For each institution, find periods whose due date was exactly `overdue_reminder_after_days` days ago.  
  - For each student with outstanding balance for that period, send `FeeOverdueReminderNotification` (and email if enabled).

- **ApplyLateFeesJob** (optional, if you want to auto-apply late fee at payment time you can skip this)  
  - Could run daily and mark “late fee applicable” for periods past `late_fee_after_days`; actual amount applied at payment time using settings.

### 5.2 Scheduling

- In `routes/console.php` (Laravel 11):
  - `Schedule::job(new SendFeeDueRemindersJob)->dailyAt('09:00');`
  - `Schedule::job(new SendFeeOverdueRemindersJob)->dailyAt('10:00');`
- Ensure scheduler is run via cron: `* * * * * php artisan schedule:run`.

---

## 6. Backend API (Extend Existing)

### 6.1 Settings API

- **GET/PUT** institution fee collection settings (e.g. under existing settings API or `GET/PATCH /api/v1/fees/collection-settings`).  
- Return and accept keys from §3.1 so UI can configure frequency, due day, reminder days, late fee, and email flags.

### 6.2 Ledger & Dues

- **Student ledger matrix**: Already `GET /fees/ledger/student/{id}`.  
  - **Enhancement**: Accept optional `frequency` and `period` (or infer from institution settings).  
  - For **quarterly**, matrix rows = 4 quarters per year (or N quarters in session) with same structure: `month_key` → period key (e.g. `2025-Q1`), `monthly_total` → period total, etc.
- **Due date helper**: Add a small service e.g. `FeeCollectionService::getDueDateForPeriod($institutionId, $periodKey)` returning Carbon (used by reminders and UI).
- **List dues for a period**:  
  - `GET /api/v1/fees/dues?period=2025-03&lms_class_id=optional`  
  - Returns list of students with expected amount, paid amount, balance, due date, status (upcoming / due_soon / overdue / paid / partial).
- **List overdue**:  
  - `GET /api/v1/fees/dues/overdue?from=2025-01&to=2025-03`  
  - Students with balance > 0 for periods whose due date has passed.
- **Bulk send reminder**:  
  - `POST /api/v1/fees/dues/send-reminder`  
  - Body: `{ "period": "2025-03", "type": "due_soon" | "overdue", "student_ids": [] }` (empty = all with dues/overdue for that period).  
  - Triggers the corresponding notification (and email if enabled) for each student.

### 6.3 Collection (Existing + Late Fee)

- Keep `POST /fees/ledger/collect` as is; extend request to accept optional `late_fee_applied` or compute it server-side from institution settings and `payment_date` vs due date for that period.

---

## 7. Frontend – View & Manage

### 7.1 Fee Hub – Configuration

- **New page or section**: “Collection cycle” / “Fee collection settings” (e.g. under Accounts → Fee Hub → Configuration, or Settings).
- Form: frequency (monthly / quarterly), due day, reminder days, overdue reminder days, late fee toggles and values, “Send email for reminders/receipts” checkboxes.
- Save via PATCH to fee collection settings API.

### 7.2 Dashboard / Summary

- **Widget or page**: “This month/quarter” (based on frequency):
  - Total expected, total collected, collection %, list of overdue students (with balance and period).
- Reuse/expand existing Monthly Ledger or Analytics to support “current period” and “overdue” view.

### 7.3 Student Ledger (Existing)

- **StudentLedgers** → select student → **StudentLedgerDetail**.
- **Enhancement**: Period column reflects “Month” or “Quarter” based on institution setting; same matrix structure.
- Show **due date** per period (e.g. “Due: 5 Mar 2025”).
- “Collect” already opens PaymentCollectModal; ensure `for_month` (or period) and amount support quarterly; optional late fee display when applicable.

### 7.4 Dues & Overdue Management View

- **New view**: “Dues & overdue” (e.g. under Fee Hub).
  - Filters: period (month/quarter), class (optional), status (upcoming / due_soon / overdue / paid / partial).
  - Table: Student name, class, period, due date, expected, paid, balance, status, actions (View ledger, Send reminder, Collect).
  - Bulk actions: “Send due reminder”, “Send overdue reminder” (with period selector).
  - Export: CSV of dues/overdue for selected period.

### 7.5 Receipt After Payment

- After successful collect, show success message with receipt number; optionally “Email receipt” button or auto-send if `receipt_send_email` is true (backend triggers `FeePaymentRecordedNotification` + `FeePaymentReceiptMail`).

---

## 8. Extensibility Checklist

- **Frequency**: Add `half_yearly` / `yearly` in config and in period-generation logic; matrix and reminder jobs interpret new values (e.g. 2 or 1 period per year).
- **Due day**: Already per-institution; later could add per-class override in DB if needed.
- **Templates**: Store notification/mail subject and body template keys in settings (e.g. `fee_due_reminder_subject`, `fee_due_reminder_body`) and use in notifications for white-label.
- **Channels**: Notifications already support database + broadcast; add `mail` channel when sending email so one notification class can drive in-app + email.
- **Reports**: Add “Collection report by period”, “Overdue report” (with filters) reusing same dues/overdue APIs.

---

## 9. Implementation Phases

| Phase | Scope | Deliverables |
|-------|--------|----------------|
| **1 – Config & period** | Settings schema, period logic, due-date helper | `config/fee_collection.php`, settings keys, `FeeCollectionService` (due date, period list), migration/seeder for default settings |
| **2 – Ledger & API** | Quarterly support, dues/overdue APIs | StudentLedgerController matrix for quarterly; new endpoints: dues list, overdue list, send reminder; optional late fee in collect |
| **3 – Notifications & jobs** | Reminders and receipt | FeeDueReminderNotification, FeeOverdueReminderNotification, FeePaymentRecordedNotification; Mailables; SendFeeDueRemindersJob, SendFeeOverdueRemindersJob; schedule in console.php; config/notifications.php |
| **4 – UI** | Configuration and management views | Fee collection settings form; Dues & overdue page (table, filters, bulk send reminder); dashboard widget; student ledger period label and due date |
| **5 – Polish** | Email toggle, receipt email, reports | Wire receipt email on collect; optional “Collection report” and “Overdue report” pages/export |

---

## 10. File Checklist (New/Modified)

- **Config**: `config/fee_collection.php` (defaults).
- **Migrations**: Optional migration to add any new columns (e.g. `for_period` if not overloading `for_month`); else only settings.
- **Models**: None new; use `Setting`, `FeePayment`, `FeeStructureRule`, `User`, `Guardian`.
- **Services**: `FeeCollectionService` (due date, period keys, list students with dues/overdue); optional `FeeRecipientResolver`.
- **Notifications**: `FeeDueReminderNotification`, `FeeOverdueReminderNotification`, `FeePaymentRecordedNotification` (ledger).
- **Mail**: `FeeDueReminderMail`, `FeeOverdueReminderMail`, `FeePaymentReceiptMail`.
- **Jobs**: `SendFeeDueRemindersJob`, `SendFeeOverdueRemindersJob`.
- **Controllers**: Extend `StudentLedgerController` (matrix by frequency); new `FeeDuesController` or methods on existing fee controller (dues, overdue, send-reminder); settings endpoint for fee collection.
- **Routes**: `GET/PATCH fees/collection-settings`; `GET fees/dues`, `GET fees/dues/overdue`, `POST fees/dues/send-reminder`.
- **Frontend**: Fee collection settings page; Dues & overdue page (table + bulk actions); dashboard widget; student ledger enhancements (period label, due date).
- **Config**: `config/notifications.php` – add fee collection notification entries.

This plan keeps the system **flexible**, **configurable**, and **extensible** while reusing existing fee payment and ledger infrastructure.

---

## 11. Quick reference – What’s in the repo

| Item | Location |
|------|----------|
| Default config (env fallbacks) | `config/fee_collection.php` |
| Notification registry placeholders | `config/notifications.php` (§ Fee collection) |
| Default settings for DB seeding | `database/seeders/data/fee_collection_settings.php` |
| Full plan | `docs/FEE_COLLECTION_WORKFLOW_PLAN.md` |
