<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Registration Number Configuration (Polymorphic)
    |--------------------------------------------------------------------------
    |
    | Pattern: {ROLE_PREFIX}-{ORG_CODE}-{YY}{RANDOM}
    | Example: STU-ACME-257KX3P
    |
    | ROLE_PREFIX -> from 'prefixes' map below (config-driven, static)
    | ORG_CODE    -> from organizations.code  (dynamic, fetched at runtime)
    | YY          -> 2-digit year of enrollment/joining
    | RANDOM      -> collision-checked random string from 'random_charset'
    |
    | Adding a new role = add one line to the 'prefixes' array. No code changes.
    |
    */

    'prefixes' => [
        'student'            => 'STU',
        'teaching_staff'     => 'TCH',
        'non_teaching_staff' => 'STF',
        'admin'              => 'ADM',
        'librarian'          => 'LIB',
        'accountant'         => 'ACT',
        'driver'             => 'DRV',
        'guardian'           => 'GRD',
        'temporary'          => 'VIS',
        'staff'              => 'STF',
    ],

    // Random segment length: 5 chars = 33M+ combinations per prefix-org-year
    'random_length' => 5,

    // Charset excludes I, O, 0, 1 to avoid visual confusion on printed cards
    'random_charset' => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',

    'separator' => '-',
];
