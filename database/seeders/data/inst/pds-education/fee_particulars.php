<?php

/**
 * PDS Education fee particulars.
 * Extracted from the 2026-27 New Admission Fee Structure chart.
 *
 * Categories:
 *   one_time  – charged once at admission (registration, admission, uniform, books, bag, etc.)
 *   recurring – monthly tuition / basic fee
 *   variable  – optional / distance-based (hostel, transport, re-registration)
 */
return [
    // ── One-time admission fees ──────────────────────────────────────
    ['name' => 'Registration Fee',      'type' => 'one_time'],
    ['name' => 'Admission Fee',         'type' => 'one_time'],
    ['name' => '1st Uniform Fee',       'type' => 'one_time'],
    ['name' => '2nd Uniform Fee',       'type' => 'one_time'],
    ['name' => 'Blazer',                'type' => 'one_time'],
    ['name' => 'Sweater',               'type' => 'one_time'],
    ['name' => 'Cap',                   'type' => 'one_time'],
    ['name' => 'Muffler',               'type' => 'one_time'],
    ['name' => 'Bag',                   'type' => 'one_time'],
    ['name' => 'Books',                 'type' => 'one_time'],

    // ── Recurring (monthly) ──────────────────────────────────────────
    ['name' => 'Basic Monthly Fee',     'type' => 'institution'],

    // ── Variable / optional ──────────────────────────────────────────
    ['name' => 'Hostel Fee',            'type' => 'variable'],
    ['name' => 'Transport Fee',         'type' => 'variable'],
    ['name' => 'Re-Registration Fee',   'type' => 'one_time'],
];
