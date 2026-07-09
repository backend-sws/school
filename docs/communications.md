# 📡 Communications & Alerts

> **Module:** `communications`
> **Scope:** All institution types
> **Permissions Workflow:** `communications` (4 permissions)

---

## Overview

Centralized communication platform for SMS sending, delivery tracking, and automated alerts. Supports provider-agnostic SMS dispatch (currently Msg91), bulk messaging, and configurable auto-alert rules that trigger based on events (fee overdue, attendance, exam scores).

---

## Architecture

```mermaid
flowchart TD
    subgraph "Manual Trigger"
    ADMIN["Admin / Staff"] --> COMPOSE["Compose SMS"]
    COMPOSE --> BULK["Bulk Send"]
    end

    subgraph "Auto Trigger"
    EVENT["System Event"] --> ENGINE["AlertRuleEngine"]
    SCHED["Cron Job"] --> ENGINE
    ENGINE --> RULES["Evaluate Active Rules"]
    RULES --> MATCH["Match Recipients"]
    end

    BULK --> SMS["SmsService"]
    MATCH --> SMS
    SMS --> PROVIDER["Provider (Msg91)"]
    PROVIDER --> LOG["SmsLog (DB)"]
    LOG --> STATS["Analytics Dashboard"]
```

---

## Data Model

```mermaid
erDiagram
    SMS_LOG {
        int id
        int institution_id
        int sent_by
        string recipient_phone
        string recipient_name
        int recipient_user_id "nullable"
        string template_id "DLT template"
        text message
        string status "queued|sent|delivered|failed"
        string provider "msg91"
        string provider_message_id
        text error_message
        string category "fee_reminder|attendance|exam|general"
        decimal cost
        timestamp sent_at
        timestamp delivered_at
    }
    ALERT_RULE {
        int id
        int institution_id
        int created_by
        string name
        string trigger_event
        json conditions
        string channel "sms|email|push|all"
        text message_template
        string recipient_type "student|guardian|faculty|all"
        boolean is_active
        string frequency "once|daily|weekly"
        timestamp last_triggered_at
        int trigger_count
    }
```

---

## SmsService

**File:** `app/Services/SmsService.php`

| Method | Description |
|--------|-------------|
| `send()` | Single SMS — creates log, dispatches to provider |
| `sendBulk()` | Array of recipients → sequential sends |
| `processAlertRule()` | Renders template variables, sends to recipients |
| `getStats()` | Aggregate stats (total, sent, delivered, failed, cost, by category) |

### Provider Configuration

```env
# .env
SMS_PROVIDER=msg91
MSG91_AUTH_KEY=your_auth_key
MSG91_DEFAULT_TEMPLATE=your_template_id
```

---

## AlertRuleEngine

**File:** `app/Services/AlertRuleEngine.php`

### Trigger Events

| Event | Description |
|-------|-------------|
| `fee_overdue` | Student has unpaid fees past due date |
| `attendance_absent` | Student absent for N consecutive days |
| `exam_score_low` | Score below threshold |
| `assignment_due` | Assignment deadline approaching |
| `fee_payment_received` | Confirmation after payment |
| `enrollment_confirmed` | New enrollment success |
| `custom` | User-defined trigger |

### Message Templates

Templates support `{{variable}}` placeholders:

```
Dear {{name}}, your fee of ₹{{amount}} for {{month}} is overdue.
Please pay by {{due_date}} to avoid late charges.
```

### Frequency Control

| Frequency | Behavior |
|-----------|----------|
| `once` | Triggers once, never again |
| `daily` | At most once per day |
| `weekly` | At most once per week |

---

## API Endpoints

| Method | Endpoint | Action |
|--------|----------|--------|
| `GET` | `/api/v1/communications/sms-logs` | List logs (filter by status, category) |
| `POST` | `/api/v1/communications/sms/send` | Send bulk SMS |
| `GET` | `/api/v1/communications/sms/stats` | Usage statistics |
| `GET` | `/api/v1/communications/alert-rules` | List rules |
| `POST` | `/api/v1/communications/alert-rules` | Create rule |
| `PUT` | `/api/v1/communications/alert-rules/{id}` | Update rule |
| `DELETE` | `/api/v1/communications/alert-rules/{id}` | Delete rule |
| `POST` | `/api/v1/communications/alert-rules/trigger` | Manually trigger all rules |

---

## Permissions (4)

| Key | Description |
|-----|-------------|
| `send_sms` | Compose and send SMS |
| `view_sms_logs` | View delivery logs |
| `manage_alert_rules` | Create/edit/delete alert rules |
| `trigger_alerts` | Manually trigger alert processing |

---

## Frontend Files

| File | Purpose |
|------|---------|
| `lib/api/communicationsApi.ts` | API module |
| `lib/querykey/communications.ts` | `CommunicationsQueryKeys` |
