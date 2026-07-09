<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default fee collection workflow settings
    |--------------------------------------------------------------------------
    | These are used when institution has not set values in settings table.
    | Institution settings (setting_group = 'fee_collection') override these.
    */

    'frequency' => env('FEE_COLLECTION_FREQUENCY', 'monthly'), // monthly | quarterly

    'due_day_of_month' => (int) env('FEE_DUE_DAY_OF_MONTH', 5),

    'reminder_days_before_due' => (int) env('FEE_REMINDER_DAYS_BEFORE', 3),

    'overdue_reminder_after_days' => (int) env('FEE_OVERDUE_REMINDER_AFTER_DAYS', 7),

    'late_fee' => [
        'enabled' => env('FEE_LATE_FEE_ENABLED', false),
        'after_days' => (int) env('FEE_LATE_FEE_AFTER_DAYS', 10),
        'type' => env('FEE_LATE_FEE_TYPE', 'fixed'), // fixed | percent
        'value' => (float) env('FEE_LATE_FEE_VALUE', 0),
    ],

    'notifications' => [
        'send_email_reminder' => env('FEE_SEND_EMAIL_REMINDER', true),
        'send_email_receipt' => env('FEE_SEND_EMAIL_RECEIPT', true),
    ],

    /*
    | Supported frequencies for validation and UI.
    */
    'supported_frequencies' => ['monthly', 'quarterly'],
];
