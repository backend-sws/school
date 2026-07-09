<?php

/**
 * Config-driven API response maps.
 *
 * Pattern: Define a map name (e.g. application_show, application_index) with:
 *   - keys: list of allowed keys (dot notation for nesting, e.g. session.name).
 *   - enricher: (optional) FQCN of a class implementing ResponseMapEnricherContract to add computed fields.
 *
 * Controllers use BaseController::successWithMap($model, 'map_name') for single resources
 * and BaseController::paginatedWithMap($paginator, 'map_name') for lists. Only these keys
 * are sent to the frontend. Add new maps here and use the same pattern across the app.
 *
 * Maps with empty 'keys' act as passthrough (full payload). Restrict keys to filter responses.
 */
return [
    // Passthrough: no key filtering (full payload). Use for resources not yet mapped.
    'passthrough' => ['keys' => []],

    'application_show' => [
        'keys' => [
            'id',
            'application_id',
            'applicant_name',
            'submitted_at',
            'amount',
            'due_amount',
            'discount_amount',
            'fee_breakdown',
            'user_id',
            'transport_amount',
            'hostel_amount',
            'cash_amount',
            'online_amount',
            'father_name',
            'mother_name',
            'dob',
            'gender',
            'category',
            'mobile',
            'email',
            'session_name',
            'main_stream_name',
            'branch_stream_name',
            'semester',
            'section_name',
            'application_type',
            'previous_board',
            'previous_marks',
            'fee_regulation_profile_id',
            'payment_status',
            'process_status',
            'admission_head.course_for',
            'session.name',
        ],
        'enricher' => \App\Services\ApiResponseEnrichers\ApplicationShowEnricher::class,
    ],
    'application_index' => [
        'keys' => [
            'id',
            'user_id',
            'application_id',
            'applicant_name',
            'father_name',
            'mother_name',
            'mobile',
            'email',
            'gender',
            'amount',
            'due_amount',
            'discount_amount',
            'application_type',
            'payment_status',
            'process_status',
            'submitted_at',
            'admission_head.stream.name',
            'admission_head.session.name',
            'lms_class.name',
            'stream.name',
            'session.name',
        ],
    ],

    'admission_head_show' => [
        'keys' => [
            'id',
            'title',
            'course_for',
            'main_stream_id',
            'stream_id',
            'session_id',
            'last_date',
            'status',
            'application_fees',
            'total_admission_fees',
            'stream.name',
            'session.name',
        ],
    ],

    'student_show' => [
        'keys' => [
            'id',
            'user_id',
            'stream_id',
            'session_id',
            'university_roll_no',
            'registration_no',
            'user.name',
            'user.email',
            'user.mobile',
            'stream.name',
            'session.name',
        ],
    ],

    'user_show' => [
        'keys' => [
            'id',
            'name',
            'email',
            'mobile',
            'status',
            'email_verified_at',
        ],
    ],

    'student_dashboard_profile' => [
        'keys' => [
            'institution_type',
            'personal_info.name',
            'personal_info.email',
            'personal_info.father_name',
            'personal_info.mother_name',
            'personal_info.dob',
            'personal_info.gender',
            'personal_info.category',
            'personal_info.blood_group',
            'personal_info.mobile',
            'personal_info.aadhar_no',
            'personal_info.abc_no',
            'personal_info.religion',
            'personal_info.caste',
            'personal_info.signature_url',
            'personal_info.photo_url',
            'personal_info.active_status',
            'personal_info.nationality',
            'academic_record.university_roll_no',
            'academic_record.reg_no',
            'academic_record.roll_no',
            'academic_record.current_semester',
            'academic_record.stream_name',
            'academic_record.session_name',
            'academic_record.college_name',
            'academic_record.subject_name',
            'academic_record.admission_date',
            'academic_record.app_no',
            'academic_record.last_academic',
            'addresses',
            'documents',
        ],
    ],

    'fee_type_index' => [
        'keys' => [
            'id',
            'name',
            'category',
            'profile_type',
            'reservation_category',
            'gender',
        ],
    ],

    'stream_index' => [
        'keys' => [
            'id',
            'name',
            'code',
            'duration_years',
            'status',
            'main_stream_id',
            'main_stream.name',
        ],
    ],

    'stream_show' => [
        'keys' => [
            'id',
            'name',
            'code',
            'duration_years',
            'status',
            'main_stream_id',
            'department_id',
            'main_stream.name',
            'department.name',
        ],
    ],

    'fee_profile_index' => [
        'keys' => [
            'id',
            'name',
            'profile_type',
            'gender',
            'category',
            'description',
            'is_default',
            'items',
        ],
    ],

    'fee_dues_index' => [
        'keys' => [
            'user_id',
            'student_name',
            'reg_no',
            'lms_class_id',
            'class_name',
            'period',
            'due_date',
            'expected_amount',
            'paid_amount',
            'balance',
            'status',
        ],
    ],

    'fee_dues_overdue_index' => [
        'keys' => [
            'user_id',
            'student_name',
            'reg_no',
            'lms_class_id',
            'class_name',
            'period',
            'due_date',
            'expected_amount',
            'paid_amount',
            'balance',
        ],
    ],

    'fee_ledger_matrix_row' => [
        'keys' => [
            'month_key',
            'month_name',
            'due_date',
            'previous_dues',
            'admission_fee',
            'transport_fee',
            'hostel_fee',
            'other_fees',
            'expected_particulars',
            'monthly_total',
            'gross_amount',
            'discount',
            'late_fee',
            'total_payable',
            'paid_amount',
            'balance',
            'payment_id',
            'receipt_no',
            'payment_mode',
            'payment_date',
            'status',
        ],
    ],

    'expense_category_index' => [
        'keys' => [
            'id',
            'name',
            'code',
            'description',
            'is_active',
            'created_at',
        ],
    ],

    'expense_index' => [
        'keys' => [
            'id',
            'expense_category_id',
            'title',
            'amount',
            'date',
            'payment_mode',
            'reference_no',
            'payee',
            'description',
            'attachment',
            'status',
            'recorded_by',
            'approved_by',
            'rejection_reason',
            'category.name',
            'recorded_by.name',
            'approved_by.name',
            'created_at',
        ],
    ],

    'expense_budget_index' => [
        'keys' => [
            'id',
            'expense_category_id',
            'session_id',
            'amount',
            'alert_threshold',
            'category.name',
            'session.name',
            'created_at',
        ],
    ],
];
