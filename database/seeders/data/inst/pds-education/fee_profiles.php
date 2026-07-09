<?php

/**
 * PDS Education — Fee Regulation Profiles.
 *
 * Derived from the 2026-27 fee chart.
 * Each profile groups fee type names → amounts for a class band or scenario.
 * FeeType names must match fee_particulars.php exactly.
 */
return [
    // ── Default New Admission (Pre-Primary NUR-UKG) ──────────────────
    [
        'name'        => 'New Admission – Pre-Primary (NUR-UKG)',
        'category'    => 'Standard',
        'description' => 'One-time + recurring fees for new pre-primary admissions (Nursery, LKG, UKG).',
        'is_default'  => true,
        'items'       => [
            ['name' => 'Registration Fee',  'amount' => 1000,  'category' => 'one_time'],
            ['name' => 'Admission Fee',     'amount' => 2000,  'category' => 'one_time'],
            ['name' => '1st Uniform Fee',   'amount' => 1250,  'category' => 'one_time'],
            ['name' => '2nd Uniform Fee',   'amount' => 600,   'category' => 'one_time'],
            ['name' => 'Blazer',            'amount' => 950,   'category' => 'one_time'],
            ['name' => 'Sweater',           'amount' => 575,   'category' => 'one_time'],
            ['name' => 'Cap',               'amount' => 190,   'category' => 'one_time'],
            ['name' => 'Bag',               'amount' => 400,   'category' => 'one_time'],
            ['name' => 'Books',             'amount' => 1620,  'category' => 'one_time'],
            ['name' => 'Basic Monthly Fee', 'amount' => 700,   'category' => 'recurring'],
        ],
    ],

    // ── New Admission (Primary I-V) ──────────────────────────────────
    [
        'name'        => 'New Admission – Primary (I-V)',
        'category'    => 'Standard',
        'description' => 'One-time + recurring fees for new primary admissions (Class I to V).',
        'is_default'  => false,
        'items'       => [
            ['name' => 'Registration Fee',  'amount' => 1000,  'category' => 'one_time'],
            ['name' => 'Admission Fee',     'amount' => 2000,  'category' => 'one_time'],
            ['name' => '1st Uniform Fee',   'amount' => 1320,  'category' => 'one_time'],
            ['name' => '2nd Uniform Fee',   'amount' => 690,   'category' => 'one_time'],
            ['name' => 'Blazer',            'amount' => 1090,  'category' => 'one_time'],
            ['name' => 'Sweater',           'amount' => 590,   'category' => 'one_time'],
            ['name' => 'Muffler',           'amount' => 225,   'category' => 'one_time'],
            ['name' => 'Bag',               'amount' => 415,   'category' => 'one_time'],
            ['name' => 'Books',             'amount' => 2790,  'category' => 'one_time'],
            ['name' => 'Basic Monthly Fee', 'amount' => 1130,  'category' => 'recurring'],
        ],
    ],

    // ── New Admission (Middle VI-VIII) ───────────────────────────────
    [
        'name'        => 'New Admission – Middle (VI-VIII)',
        'category'    => 'Standard',
        'description' => 'One-time + recurring fees for new middle school admissions (Class VI to VIII).',
        'is_default'  => false,
        'items'       => [
            ['name' => 'Registration Fee',  'amount' => 1000,  'category' => 'one_time'],
            ['name' => 'Admission Fee',     'amount' => 2000,  'category' => 'one_time'],
            ['name' => '1st Uniform Fee',   'amount' => 1445,  'category' => 'one_time'],
            ['name' => '2nd Uniform Fee',   'amount' => 790,   'category' => 'one_time'],
            ['name' => 'Blazer',            'amount' => 1180,  'category' => 'one_time'],
            ['name' => 'Sweater',           'amount' => 690,   'category' => 'one_time'],
            ['name' => 'Muffler',           'amount' => 225,   'category' => 'one_time'],
            ['name' => 'Bag',               'amount' => 420,   'category' => 'one_time'],
            ['name' => 'Books',             'amount' => 3530,  'category' => 'one_time'],
            ['name' => 'Basic Monthly Fee', 'amount' => 1400,  'category' => 'recurring'],
        ],
    ],

    // ── New Admission (Secondary IX-X) ──────────────────────────────
    [
        'name'        => 'New Admission – Secondary (IX-X)',
        'category'    => 'Standard',
        'description' => 'One-time + recurring fees for new secondary admissions (Class IX & X). Books not included.',
        'is_default'  => false,
        'items'       => [
            ['name' => 'Registration Fee',  'amount' => 1000,  'category' => 'one_time'],
            ['name' => 'Admission Fee',     'amount' => 2000,  'category' => 'one_time'],
            ['name' => '1st Uniform Fee',   'amount' => 1510,  'category' => 'one_time'],
            ['name' => '2nd Uniform Fee',   'amount' => 835,   'category' => 'one_time'],
            ['name' => 'Blazer',            'amount' => 1245,  'category' => 'one_time'],
            ['name' => 'Sweater',           'amount' => 750,   'category' => 'one_time'],
            ['name' => 'Muffler',           'amount' => 225,   'category' => 'one_time'],
            ['name' => 'Bag',               'amount' => 420,   'category' => 'one_time'],
            ['name' => 'Basic Monthly Fee', 'amount' => 1575,  'category' => 'recurring'],
        ],
    ],

    // ── Hostel Supplement ────────────────────────────────────────────
    [
        'name'        => 'Hostel Supplement',
        'category'    => 'Residential',
        'description' => 'Additional monthly hostel fee for boarding students. Amount varies by class.',
        'is_default'  => false,
        'items'       => [
            ['name' => 'Hostel Fee', 'amount' => 5500, 'category' => 'variable'],
        ],
    ],

    // ── Re-Registration (Returning Students) ────────────────────────
    [
        'name'        => 'Re-Registration (Returning Students)',
        'category'    => 'Standard',
        'description' => 'Annual re-registration fee for existing students continuing to next session.',
        'is_default'  => false,
        'items'       => [
            ['name' => 'Re-Registration Fee', 'amount' => 1000, 'category' => 'one_time'],
        ],
    ],
];
