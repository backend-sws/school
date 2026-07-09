<?php

/**
 * Maps human-readable class names (from CSV imports) to stream codes.
 *
 * Stream codes must match the `code` column in the `streams` table.
 * See: database/seeders/data/inst/pds-education/academics.php
 *
 * null = non-class student (NC) — enrolled without class assignment.
 */
return [
    // Pre-Primary
    'NUR'     => 'NUR',
    'NURSERY' => 'NUR',
    'LKG'     => 'LKG',
    'UKG'     => 'UKG',

    // Primary (Roman numerals)
    'I'    => 'CLS-1',
    'II'   => 'CLS-2',
    'III'  => 'CLS-3',
    'IV'   => 'CLS-4',
    'V'    => 'CLS-5',

    // Middle (Roman numerals)
    'VI'   => 'CLS-6',
    'VII'  => 'CLS-7',
    'VIII' => 'CLS-8',

    // Secondary
    'IX'   => 'CLS-9',
    'X'    => 'CLS-10',

    // Sr. Secondary
    'XI'   => 'CLS-11-SCI',
    'XII'  => 'CLS-12-SCI',

    // Numeric variants (from messy CSV data)
    '1'  => 'CLS-1',
    '2'  => 'CLS-2',
    '3'  => 'CLS-3',
    '4'  => 'CLS-4',
    '5'  => 'CLS-5',
    '6'  => 'CLS-6',
    '7'  => 'CLS-7',
    '8'  => 'CLS-8',
    '9'  => 'CLS-9',
    '10' => 'CLS-10',
    '11' => 'CLS-11-SCI',
    '12' => 'CLS-12-SCI',

    // Kids / KG variants (from messy CSV data)
    'KIDS'  => 'NUR',
    'KG-1'  => 'LKG',
    'KG-I'  => 'LKG',
    'KG-II' => 'UKG',
    'KG-2'  => 'UKG',
    'KG1'   => 'LKG',
    'KG2'   => 'UKG',

    // Non-class
    'NC' => null,
];
