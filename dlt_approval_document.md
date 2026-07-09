# DLT SMS Template Approval Document

This document contains all SMS templates currently implemented in the system that require **DLT (Distributed Ledger Technology)** approval as per TRAI regulations in India.

## Important Notes for Approval
- **Header / Sender ID**: Should be a 6-character Alpha Header (e.g., `SUTRAC`, `EDUSYS`).
- **Category**: All templates below fall under **Service Implicit** (Transactional/Informational).
- **Variables**: Represented as `{#var#}` in the content.

---

### 1. OTP Verification
Used for login and multi-factor authentication.
- **Template Name**: `AUTH_OTP_VERIFICATION`
- **Content**: `Your OTP is {#var#}. Valid for 10 minutes. Do not share with anyone. - {#var#}`
- **Variables**: 
    1. `{#var#}` (6-digit OTP)
    2. `{#var#}` (Institution Branding)

### 2. Attendance Alert
Sent to parents when a student's attendance is marked.
- **Template Name**: `STUDENT_ATTENDANCE_MARK`
- **Content**: `Attendance: {#var#} marked as {#var#} on {#var#}{#var#}. - {#var#}`
- **Variables**: 
    1. Student Name
    2. Status (PRESENT/ABSENT)
    3. Date
    4. Class Name (optional extra space)
    5. Institution Branding

### 3. Fee Due Reminder
Routine reminder for upcoming fee deadlines.
- **Template Name**: `FEE_DUE_REMINDER`
- **Content**: `Fee reminder: ₹{#var#} due on {#var#} for {#var#} (Period: {#var#}). Pay now to avoid late fees. - {#var#}`
- **Variables**:
    1. Balance Amount
    2. Due Date
    3. Student Name
    4. Fee Period (e.g., March 2024)
    5. Institution Branding

### 4. Fee Overdue Alert
Urgent alert for past-due fees.
- **Template Name**: `FEE_OVERDUE_ALERT`
- **Content**: `OVERDUE: ₹{#var#} for {#var#} (Period: {#var#}) was due on {#var#}. Pay immediately to avoid penalty. - {#var#}`
- **Variables**:
    1. Balance Amount
    2. Student Name
    3. Fee Period
    4. Due Date
    5. Institution Branding

### 5. Admission Application Submitted
Confirmation sent to students/parents after submitting an application.
- **Template Name**: `ADMISSION_SUBMIT_CONFIRM`
- **Content**: `Your {#var#} application {#var#} has been submitted successfully. Track status at your student portal. - {#var#}`
- **Variables**:
    1. Application Type (admission/re-admission)
    2. Application ID
    3. Institution Branding

### 6. Admission Status Update
Sent when an admission application is approved, rejected, or updated.
- **Template Name**: `ADMISSION_STATUS_CHANGE`
- **Content**: `{#var#} update: Application {#var#} has been {#var#} - {#var#}`
- **Variables**:
    1. Application Type
    2. Application ID
    3. Status (APPROVED/REJECTED/etc.)
    4. Institution Branding

### 7. Student Enrollment Welcome
Sent when a student is bulk-imported or newly enrolled.
- **Template Name**: `STUDENT_WELCOME_IMPORT`
- **Content**: `Welcome to {#var#}! You have been enrolled. Reg No: {#var#}. Please verify your account at {#var#} - {#var#}`
- **Variables**:
    1. Institution Name
    2. Registration Number
    3. Login URL
    4. Institution Branding

---

> [!TIP]
> When applying on DLT portals (like VilPower, BSNL, MTNL), ensure the "Template Type" is selected as **Service Implicit**. This avoids the need for DND (Do Not Disturb) scrubbing and ensures high delivery rates.
