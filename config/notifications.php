<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Notification registry
    |--------------------------------------------------------------------------
    |
    | Single source of truth for all in-app notifications (realtime + DB + push).
    | When adding a new notification: create the Notification class, trigger it
    | from the controller/service using DispatchesRealtimeNotifications, then
    | add an entry here so the app stays trackable.
    |
    */

    'registry' => [
        // -------------------------------------------------------------------------
        // Admission
        // -------------------------------------------------------------------------
        'admission_application_submitted' => [
            'type' => 'admission_application_submitted',
            'notification_class' => \App\Notifications\AdmissionApplicationSubmittedNotification::class,
            'trigger' => 'ApplicationController::store, AdmissionSubmissionController::submitForm',
            'recipients' => 'Admission cell users + applicant (if different from submitter)',
        ],
        'admission_status_changed' => [
            'type' => 'admission_status_changed',
            'notification_class' => \App\Notifications\AdmissionStatusChangedNotification::class,
            'trigger' => 'ApplicationController::process',
            'recipients' => 'Applicant',
        ],
        'admission_payment_recorded' => [
            'type' => 'admission_payment_recorded',
            'notification_class' => \App\Notifications\AdmissionPaymentRecordedNotification::class,
            'trigger' => 'ApplicationController::recordPayment',
            'recipients' => 'Applicant',
        ],

        // -------------------------------------------------------------------------
        // Fee collection (monthly/quarterly workflow)
        // -------------------------------------------------------------------------
        'fee_due_reminder' => [
            'type' => 'fee_due_reminder',
            'notification_class' => \App\Notifications\FeeDueReminderNotification::class,
            'trigger' => 'SendFeeDueRemindersJob (scheduled), FeeDuesController::sendReminder',
            'recipients' => 'Guardian + Student (fee payer)',
        ],
        'fee_overdue_reminder' => [
            'type' => 'fee_overdue_reminder',
            'notification_class' => \App\Notifications\FeeOverdueReminderNotification::class,
            'trigger' => 'SendFeeOverdueRemindersJob (scheduled), FeeDuesController::sendReminder',
            'recipients' => 'Guardian + Student (fee payer)',
        ],
        'fee_payment_receipt' => [
            'type' => 'fee_payment_receipt',
            'notification_class' => \App\Notifications\FeePaymentReceiptNotification::class,
            'trigger' => 'StudentLedgerController::collect',
            'recipients' => 'Guardian + Student',
        ],

        // -------------------------------------------------------------------------
        // Class & LMS
        // -------------------------------------------------------------------------
        'class_updated' => [
            'type' => 'class_updated',
            'notification_class' => \App\Notifications\ClassUpdatedNotification::class,
            'trigger' => 'LmsClassController::update',
            'recipients' => 'Enrolled students (active)',
        ],
        'lms_test_created' => [
            'type' => 'lms_test_created',
            'notification_class' => \App\Notifications\LmsTestCreatedNotification::class,
            'trigger' => 'LmsTestController::store',
            'recipients' => 'Enrolled students (active)',
        ],
        'lms_announcement_created' => [
            'type' => 'lms_announcement_created',
            'notification_class' => \App\Notifications\LmsAnnouncementCreatedNotification::class,
            'trigger' => 'LmsAnnouncementController::store',
            'recipients' => 'Enrolled students (active)',
        ],
        'lms_assignment_created' => [
            'type' => 'lms_assignment_created',
            'notification_class' => \App\Notifications\LmsAssignmentCreatedNotification::class,
            'trigger' => 'LmsAssignmentController::store',
            'recipients' => 'Enrolled students (active)',
        ],
        'lms_material_created' => [
            'type' => 'lms_material_created',
            'notification_class' => \App\Notifications\LmsMaterialCreatedNotification::class,
            'trigger' => 'LmsMaterialController::store',
            'recipients' => 'Enrolled students (active)',
        ],
        'lms_live_session_scheduled' => [
            'type' => 'lms_live_session_scheduled',
            'notification_class' => \App\Notifications\LmsLiveSessionScheduledNotification::class,
            'trigger' => 'LmsLiveSessionController::store',
            'recipients' => 'Enrolled students (active)',
        ],
        'lms_recording_added' => [
            'type' => 'lms_recording_added',
            'notification_class' => \App\Notifications\LmsRecordingAddedNotification::class,
            'trigger' => 'LmsRecordingController::store',
            'recipients' => 'Enrolled students (active)',
        ],

        // -------------------------------------------------------------------------
        // Attendance
        // -------------------------------------------------------------------------
        'attendance_marked' => [
            'type' => 'attendance_marked',
            'notification_class' => \App\Notifications\AttendanceMarkedNotification::class,
            'trigger' => 'AttendanceController::submitDaily, AttendanceController::updateRecord',
            'recipients' => 'Student whose attendance was recorded/updated',
        ],

        // -------------------------------------------------------------------------
        // Public notices
        // -------------------------------------------------------------------------
        'public_notice' => [
            'type' => 'public_notice',
            'notification_class' => \App\Notifications\PublicNoticeNotification::class,
            'trigger' => 'NoticeController::store (when published), NoticeController::update (when published), NoticeController::toggleStatus (when published)',
            'recipients' => 'Targeted students (all or by stream/session)',
        ],

        // -------------------------------------------------------------------------
        // Dev / test
        // -------------------------------------------------------------------------
        'test' => [
            'type' => 'test',
            'notification_class' => \App\Notifications\TestNotification::class,
            'trigger' => 'POST /api/v1/notifications/test (when APP_DEBUG), php artisan notification:test',
            'recipients' => 'Specified user or current user',
        ],

        // -------------------------------------------------------------------------
        // Bulk Import
        // -------------------------------------------------------------------------
        'student_import_welcome' => [
            'type' => 'student_import_welcome',
            'notification_class' => \App\Notifications\StudentImportWelcomeNotification::class,
            'trigger' => 'ExistingStudentBulkImport (after creating each student)',
            'recipients' => 'Imported student',
        ],

        // -------------------------------------------------------------------------
        // Admission Onboard
        // -------------------------------------------------------------------------
        'student_onboard' => [
            'type' => 'student_onboard',
            'notification_class' => \App\Notifications\StudentOnboardNotification::class,
            'trigger' => 'AdmissionToStudentSyncService::stepSendNotification (after approval)',
            'recipients' => 'Approved applicant (student)',
        ],
        'password_reset' => [
            'type' => 'password_reset',
            'notification_class' => \App\Notifications\Auth\ResetPasswordNotification::class,
            'trigger' => 'Password reset request (forgot password form)',
            'recipients' => 'User requesting reset',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Channel Matrix — Software Factory Pattern
    |--------------------------------------------------------------------------
    |
    | Controls which channels each notification type uses.
    | Adding SMS/WhatsApp to any notification = ONE line change here.
    |
    | Channel keys: database, broadcast, push, mail, sms, whatsapp
    |
    */

    'channels' => [

        // ── Fee Collection (🔴 critical — all channels)
        'fee_due_reminder'       => ['database', 'broadcast', 'push', 'mail', 'sms', 'whatsapp'],
        'fee_overdue_reminder'   => ['database', 'broadcast', 'push', 'mail', 'sms', 'whatsapp'],
        'fee_payment_receipt'    => ['database', 'broadcast', 'push', 'mail', 'whatsapp'],

        // ── Attendance (🔴 parents need SMS)
        'attendance_marked'      => ['database', 'broadcast', 'push', 'sms', 'whatsapp'],

        // ── Admissions (🟠 applicant engagement)
        'admission_application_submitted' => ['database', 'broadcast', 'push', 'mail', 'sms', 'whatsapp'],
        'admission_status_changed'        => ['database', 'broadcast', 'push', 'mail', 'sms', 'whatsapp'],
        'admission_payment_recorded'      => ['database', 'broadcast', 'push', 'mail', 'whatsapp'],

        // ── LMS (🟡 student engagement)
        'lms_live_session_scheduled' => ['database', 'broadcast', 'push', 'whatsapp'],
        'lms_material_created'       => ['database', 'broadcast', 'push'],
        'lms_assignment_created'     => ['database', 'broadcast', 'push'],
        'lms_test_created'           => ['database', 'broadcast', 'push'],
        'lms_recording_added'        => ['database', 'broadcast', 'push'],
        'lms_announcement_created'   => ['database', 'broadcast', 'push', 'whatsapp'],
        'class_updated'              => ['database', 'broadcast', 'push'],

        // ── Administrative
        'public_notice'        => ['database', 'broadcast', 'push', 'whatsapp'],
        'staff_invitation'     => ['database', 'broadcast', 'mail'],
        'support_ticket'       => ['database', 'broadcast', 'push'],
        'test'                 => ['database', 'broadcast', 'push'],

        // ── Bulk Import
        'student_import_welcome' => ['database', 'broadcast', 'push', 'mail', 'sms', 'whatsapp'],

        // ── Admission Onboard
        'student_onboard' => ['database', 'broadcast', 'push', 'mail', 'sms', 'whatsapp'],

        // ── Auth
        'password_reset' => ['mail', 'sms', 'whatsapp'],
        'AUTH_OTP_VERIFICATION' => ['mail', 'sms'],
    ],

    /*
    |--------------------------------------------------------------------------
    | SMS / WhatsApp Templates — now DB-driven
    |--------------------------------------------------------------------------
    |
    | Template content and DLT/provider IDs are stored in the
    | `notification_templates` table (seeded by NotificationTemplateSeeder).
    |
    | To update templates: edit via admin panel or re-run the seeder.
    | Run: php artisan db:seed --class=NotificationTemplateSeeder
    |
    */

];
