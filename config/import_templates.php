<?php

/**
 * Import Templates Configuration (Software Factory).
 *
 * All bulk import template definitions, validation notes, and valid value
 * references live here — NOT hardcoded in classes.
 *
 * To add a new import module:
 *   1. Add entry to 'templates' with headings + sample
 *   2. Add entry to 'validation_notes' (optional)
 *   3. Add entry to 'valid_values' (optional)
 *   4. Register the importer class in ImportPipeline::IMPORTERS
 */

return [

    // ── Template Definitions ────────────────────────────────────────────
    // Each module has 'headings' (column names) and 'sample' (example row).

    'templates' => [

        'departments' => [
            'headings' => ['name', 'code'],
            'sample'   => ['Computer Science', 'CS'],
        ],

        'streams' => [
            'headings' => ['name', 'code', 'department_code', 'main_stream_code', 'duration_years'],
            'sample'   => ['B.Tech CSE', 'BTCSE', 'CS', 'UG', '4'],
        ],

        'subjects' => [
            'headings' => ['name', 'code', 'stream_code', 'is_practical'],
            'sample'   => ['Data Structures', 'CS201', 'BTCSE', 'No'],
        ],

        'students' => [
            'headings' => [
                'name', 'email', 'mobile', 'gender', 'dob', 'class', 'stream_code',
                'session_name', 'reg_no', 'roll_no', 'father_name', 'father_mobile',
                'mother_name', 'category', 'religion', 'aadhar_no', 'address',
                'city', 'state', 'pincode',
            ],
            'sample' => [
                'Rahul Sharma', 'rahul@mail.com', '9876543210', 'BOY', '8/15/19',
                'LKG', '', '2025-26', '', '', 'Suresh Sharma', '9876543211',
                'Meena Sharma', 'General', 'Hindu', '1234-5678-9012', '123 Main St',
                'Lucknow', 'Uttar Pradesh', '226001',
            ],
        ],

        'staff' => [
            'headings' => ['name', 'email', 'mobile', 'employee_id', 'designation', 'category', 'joining_date'],
            'sample'   => ['Dr. Anil Kumar', 'anil@inst.edu', '9876543210', 'EMP001', 'HOD', 'Teaching', '2020-07-01'],
        ],

        'fee_types' => [
            'headings' => ['name', 'category'],
            'sample'   => ['Tuition Fee', 'tuition'],
        ],

        'fee_payments' => [
            'headings' => ['student_reg_no', 'student_email', 'fee_head', 'amount', 'payment_mode', 'payment_date', 'for_month', 'receipt_no', 'transaction_ref', 'remarks'],
            'sample'   => ['2025/CS/001', 'rahul@mail.com', 'Semester Fee 2025-26', '15000', 'cash', '2025-06-15', 'June 2025', 'RCP-001', '', 'Paid at counter'],
        ],

        'existing_students' => [
            'headings' => [
                'students', 'email', 'mobile', 'gender', 'dob', 'class', 'section',
                'session_name', 'roll_no', 'father_name', 'father_mobile', 'mother_name',
                'category', 'religion', 'aadhar_no', 'address', 'city', 'state', 'pincode',
            ],
            'sample' => [
                'Sonu Kumar', 'rahul@mail.com', '7761809386', 'BOY', '8/15/19',
                'LKG', 'A', '2025-26', '', 'SAURAV KUMAR YADAV', '9876543211',
                'ROJI KUMARI', 'General', 'Hindu', '1234-5678-9012', 'KHIRADIH',
                'Lucknow', 'Uttar Pradesh', '226001',
            ],
        ],
    ],

    // ── Validation Notes (shown at top of data sheet) ───────────────────
    // Each entry = [label, allowed values / format hint].
    // Yellow rows in Excel. Users see these before filling data.

    'validation_notes' => [

        'students' => [
            ['⚠️ IMPORT INSTRUCTIONS', 'DO NOT delete these rows. Start entering data from the row below the GREY header row.'],
            ['class (required)', 'Use Roman numerals only: NUR, LKG, UKG, I, II, III, IV, V, VI, VII, VIII, IX, X, XI, XII, NC (NOT 1, 2, 3...)'],
            ['gender', 'BOY, GIRL, Male, Female'],
            ['session_name (required)', 'Format: 2025-26 or 2025-2026'],
            ['dob (date of birth)', 'Format: 8/15/19 or 2019-08-15 or 15-Aug-2019'],
            ['mobile', '10-digit number (e.g. 9876543210)'],
            ['category', 'General, OBC, SC, ST, EWS'],
            ['religion', 'Hindu, Muslim, Christian, Sikh, Buddhist, Jain, Other'],
        ],

        'existing_students' => [
            ['⚠️ IMPORT INSTRUCTIONS', 'DO NOT delete these rows. Start entering data from the row below the GREY header row.'],
            ['students (required)', 'Full name of the student'],
            ['class (required)', 'Use Roman numerals only: NUR, LKG, UKG, I, II, III, IV, V, VI, VII, VIII, IX, X, XI, XII, NC (NOT 1, 2, 3...)'],
            ['section', 'A, B, C, D (default: A if empty)'],
            ['gender', 'BOY, GIRL, Male, Female'],
            ['session_name (required)', 'Format: 2025-26 or 2025-2026'],
            ['dob (date of birth)', 'Format: 8/15/19 or 2019-08-15 or 15-Aug-2019'],
            ['mobile (nullable)', 'Parent mobile (for account reset). Siblings can leave this blank if sharing with a brother/sister.'],
            ['roll_no (optional)', 'Academic roll number (e.g. 101). Will be auto-generated if left empty.'],
            ['category', 'General, OBC, SC, ST, EWS'],
            ['religion', 'Hindu, Muslim, Christian, Sikh, Buddhist, Jain, Other'],
        ],

        'departments' => [
            ['⚠️ IMPORT INSTRUCTIONS', 'DO NOT delete these rows. Start entering data from the row below the GREY header row.'],
            ['name (required)', 'Department name (e.g. Computer Science)'],
            ['code (required)', 'Unique short code (e.g. CS, MATH)'],
        ],

        'fee_payments' => [
            ['⚠️ IMPORT INSTRUCTIONS', 'DO NOT delete these rows. Start entering data from the row below the GREY header row.'],
            ['student_reg_no or student_email', 'At least one is required to identify the student'],
            ['payment_mode', 'cash, upi, bank_transfer, cheque, online'],
            ['payment_date', 'Format: 2025-06-15 (YYYY-MM-DD)'],
            ['for_month', 'Format: June 2025 or 2025-06'],
        ],
    ],

    // ── Valid Values (Sheet 2 reference table) ──────────────────────────
    // Green-header reference table. Each key = column header, value = allowed list.

    'valid_values' => [

        'students' => [
            'class (use one)'        => ['NUR', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'NC'],
            'section (use one)'      => ['A', 'B', 'C', 'D'],
            'gender (use one)'       => ['BOY', 'GIRL', 'Male', 'Female'],
            'session_name (format)'  => ['2025-26', '2026-27'],
            'category (use one)'     => ['General', 'OBC', 'SC', 'ST', 'EWS'],
            'religion (use one)'     => ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other'],
        ],

        'existing_students' => [
            'class (use one)'             => ['NUR', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'NC'],
            'section (use one)'           => ['A', 'B', 'C', 'D'],
            'gender (use one)'            => ['BOY', 'GIRL', 'Male', 'Female'],
            'session_name (format)'       => ['2025-26', '2026-27'],
            'category (use one)'          => ['General', 'OBC', 'SC', 'ST', 'EWS'],
            'religion (use one)'          => ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other'],
        ],
    ],
];
