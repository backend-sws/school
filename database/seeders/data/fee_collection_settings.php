<?php

/**
 * Default fee collection workflow settings.
 * Use when seeding an institution; merge with institution_id and optionally override values.
 * Keys match config/fee_collection.php and settings table (setting_group = 'fee_collection').
 */
return [
    ['setting_key' => 'fee_collection_frequency', 'setting_value' => 'monthly', 'setting_group' => 'fee_collection'],
    ['setting_key' => 'fee_due_day_of_month', 'setting_value' => '5', 'setting_group' => 'fee_collection'],
    ['setting_key' => 'reminder_days_before_due', 'setting_value' => '3', 'setting_group' => 'fee_collection'],
    ['setting_key' => 'overdue_reminder_after_days', 'setting_value' => '7', 'setting_group' => 'fee_collection'],
    ['setting_key' => 'late_fee_enabled', 'setting_value' => '0', 'setting_group' => 'fee_collection'],
    ['setting_key' => 'late_fee_after_days', 'setting_value' => '10', 'setting_group' => 'fee_collection'],
    ['setting_key' => 'late_fee_type', 'setting_value' => 'fixed', 'setting_group' => 'fee_collection'],
    ['setting_key' => 'late_fee_value', 'setting_value' => '0', 'setting_group' => 'fee_collection'],
    ['setting_key' => 'reminder_send_email', 'setting_value' => '1', 'setting_group' => 'fee_collection'],
    ['setting_key' => 'receipt_send_email', 'setting_value' => '1', 'setting_group' => 'fee_collection'],
];
