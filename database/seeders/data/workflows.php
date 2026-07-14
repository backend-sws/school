<?php

/**
 * Default workflow sets for PDS Education.
 *
 * `scope_types` controls which institution types see this workflow.
 * The WorkflowSeeder creates workflow_scopes entries for each listed type.
 * EVERY workflow MUST have explicit scope_types — no implicit "all types" fallback.
 *
 * Where permissions differ by scope type, create separate variants:
 *   admission_cell       → college/coaching/university (full)
 *   admission_cell_school → school (simplified)
 *
 * Subscription modules & their tiers:
 *   STARTER:      core, dashboard, academics, student_portal, notifications_basic
 *   PROFESSIONAL: + lms, fee_management, admissions, certificates, library,
 *                   grievances, website_cms, inventory, transport, advanced_analytics
 *   ENTERPRISE:   + multi_campus, training_placement, white_label, api_access, sso
 *   PLUS:         + on_premise, white_label_plus
 *
 * Each workflow is a named set of permission keys.
 * Re-running WorkflowSeeder will reset each workflow's permission set to this default.
 */

$ALL_TYPES = ['school'];

return [

    // ── Account (personal – every user) ─────────────────────────
    [
        'key' => 'account',
        'name' => 'Account – Personal Settings',
        'description' => 'Personal profile and password management.',
        'subscription_module' => 'core',
        'scope_types' => $ALL_TYPES,
        'permissions' => ['update_profile', 'update_password'],
    ],

    // ── Admin Desk ─────────────────────────────────────────────
    [
        'key' => 'admin_desk',
        'name' => 'Admin Desk – Dashboard & Analytics',
        'description' => 'Access to institutional analytics, audit trails, and reports.',
        'subscription_module' => 'core',
        'scope_types' => $ALL_TYPES,
        'permissions' => ['view_dashboard', 'view_all_reports', 'export_reports', 'view_audit', 'view_data_import', 'perform_data_import'],
    ],

    // ── My Organisation ─────────────────────────────────────────
    [
        'key' => 'my_organisation',
        'name' => 'My Organisation – Institutes & Orgs',
        'description' => 'Manage organisations and institutes under the umbrella.',
        'subscription_module' => 'core',
        'scope_types' => $ALL_TYPES,
        'permissions' => ['view_institutes', 'view_organisations', 'create_organisations', 'create_institutes'],
    ],

    // ── Admission Cell ─────────────────────────────────────────
    [
        'key' => 'admission_cell',
        'name' => 'Enrollment Office – Application Desk',
        'description' => 'Simplified: applications, promotions, re-admissions. No admission heads or candidates.',
        'subscription_module' => 'admissions',
        'scope_types' => $ALL_TYPES,
        'permissions' => [
            'view_applications',
            'create_applications',
            'update_applications',
            'delete_applications',
            'approve_applications',
            'view_promotions',
            'create_promotions',
            'bulk_promote',
            'rollback_promotions',
            'view_readmissions',
            'create_readmissions',
            'bulk_readmit',
            'preview_readmission_fees',
            'rollback_readmissions',
            // Field-level: admission (no higher-ed-only fields)
            'field_admission_applicant_name', 'field_admission_roll_no',
            'field_admission_father_name', 'field_admission_father_qual', 'field_admission_father_occ',
            'field_admission_mother_name', 'field_admission_dob', 'field_admission_gender',
            'field_admission_category', 'field_admission_caste', 'field_admission_nationality',
            'field_admission_religion', 'field_admission_marital_status', 'field_admission_blood_group',
            'field_admission_differently_abled',
            'field_admission_mobile', 'field_admission_father_mobile', 'field_admission_aadhar_no',
            'field_admission_perm_village', 'field_admission_perm_post', 'field_admission_perm_police',
            'field_admission_perm_district', 'field_admission_perm_state', 'field_admission_perm_pincode',
            'field_admission_corr_village', 'field_admission_corr_post', 'field_admission_corr_police',
            'field_admission_corr_district', 'field_admission_corr_state', 'field_admission_corr_pincode',
            'field_admission_last_inst', 'field_admission_last_class', 'field_admission_last_session',
            'field_admission_last_section', 'field_admission_last_roll',
            // Field-level: readmission (no higher-ed-only fields)
            'field_readmission_applicant_name', 'field_readmission_roll_no',
            'field_readmission_father_name', 'field_readmission_father_qual', 'field_readmission_father_occ',
            'field_readmission_mother_name', 'field_readmission_dob', 'field_readmission_gender',
            'field_readmission_category', 'field_readmission_caste', 'field_readmission_nationality',
            'field_readmission_religion', 'field_readmission_marital_status', 'field_readmission_blood_group',
            'field_readmission_differently_abled',
            'field_readmission_mobile', 'field_readmission_father_mobile', 'field_readmission_aadhar_no',
            'field_readmission_perm_village', 'field_readmission_perm_post', 'field_readmission_perm_police',
            'field_readmission_perm_district', 'field_readmission_perm_state', 'field_readmission_perm_pincode',
            'field_readmission_corr_village', 'field_readmission_corr_post', 'field_readmission_corr_police',
            'field_readmission_corr_district', 'field_readmission_corr_state', 'field_readmission_corr_pincode',
            'field_readmission_last_inst', 'field_readmission_last_class', 'field_readmission_last_session',
            'field_readmission_last_section', 'field_readmission_last_roll',
            // Field-level: application desk
            'field_application_stream_id', 'field_application_applicant_name',
            'field_application_father_name', 'field_application_mother_name',
            'field_application_dob', 'field_application_email', 'field_application_mobile',
            'field_application_gender', 'field_application_category', 'field_application_blood_group',
            'field_application_religion', 'field_application_nationality',
            'field_application_aadhaar_no', 'field_application_previous_school',
            'field_application_addr_line1', 'field_application_addr_line2',
            'field_application_addr_city', 'field_application_addr_state', 'field_application_addr_pincode',
            'field_application_guardian_name', 'field_application_guardian_occupation',
            'field_application_guardian_aadhaar', 'field_application_guardian_income',
            'field_application_local_guardian_name', 'field_application_local_guardian_phone',
            'field_application_local_guardian_rel',
            'field_application_emergency_name', 'field_application_emergency_rel',
            'field_application_emergency_mobile', 'field_application_emergency_alt_mobile',
            'field_application_medical_condition', 'field_application_disability', 'field_application_allergy',
            'field_application_class_id', 'field_application_has_tc',
            'field_application_hostel_required', 'field_application_hostel_amount',
            'field_application_discount_amount', 'field_application_discount_reason',
            'field_application_cash_amount', 'field_application_online_amount',
            'field_application_txn_id', 'field_application_notes',
            'field_application_doc_birth_cert', 'field_application_doc_aadhaar',
            'field_application_doc_tc', 'field_application_doc_marksheet',
            'field_application_doc_caste', 'field_application_doc_parent_sig',
            // Transport: view-only so admission desk can pick routes/stops in Services step
            'view_transport_routes', 'view_transport_stops',
        ],
    ],

    // ── Office Registry ─────────────────────────────────────────
    [
        'key' => 'office_registry',
        'name' => 'Office Registry – Records & Personnel (School)',
        'description' => 'Simplified: users, students, faculty. No staff dept/subject links.',
        'subscription_module' => 'core',
        'scope_types' => $ALL_TYPES,
        'permissions' => [
            'view_users',
            'create_users',
            'update_users',
            'delete_users',
            'view_students',
            'create_faculty',
            'update_faculty',
            'delete_faculty',
        ],
    ],

    // ── Information & PR Hub ────────────────────────────────────
    [
        'key' => 'info_pr_hub',
        'name' => 'Information & PR Hub – Communication Centre',
        'description' => 'Manage internal notices, public news, and digital galleries.',
        'subscription_module' => 'core',
        'scope_types' => $ALL_TYPES,
        'permissions' => [
            'view_notices',
            'create_notices',
            'update_notices',
            'delete_notices',
            'view_website',
            'create_website',
            'update_website',
            'delete_website',
            'create_news',
            'update_news',
            'delete_news',
            'create_gallery',
            'update_gallery',
            'delete_gallery',
            'manage_website_builder',
            'manage_website_themes',
        ],
    ],

    // ── Accounts Room ──────────────────────────────────────────
    [
        'key' => 'accounts_room',
        'name' => 'Accounts Room – Finance & Fees (School)',
        'description' => 'Simplified: no fee heads. Particulars, collection, regulations, dues, ledger.',
        'subscription_module' => 'fee_management',
        'scope_types' => $ALL_TYPES,
        'permissions' => [
            'view_fee_particulars',
            'create_fee_particulars',
            'update_fee_particulars',
            'delete_fee_particulars',
            'collect_fees',
            'view_fee_payments',
            'view_fee_reports',
            'view_fee_collection_settings',
            'update_fee_collection_settings',
            'view_fee_dues',
            'view_student_ledger',
            'send_fee_reminders',
            // Field-level: fee types (only $ALL scope keys for school)
            'field_fee_type_name', 'field_fee_type_category',
            // Field-level: fee profiles
            'field_fee_profile_name', 'field_fee_profile_type', 'field_fee_profile_category',
            'field_fee_profile_gender', 'field_fee_profile_description',
            'field_fee_profile_is_default', 'field_fee_profile_items',
        ],
    ],

    // ── Expense Tracker ─────────────────────────────────────────
    [
        'key' => 'expense_tracker',
        'name' => 'Expense Tracker – Outflow & Budgets (School)',
        'description' => 'Record expenses, manage categories, set budgets, and approve payments.',
        'subscription_module' => 'fee_management',
        'scope_types' => $ALL_TYPES,
        'permissions' => [
            'view_expense_categories',
            'create_expense_categories',
            'update_expense_categories',
            'delete_expense_categories',
            'view_expenses',
            'create_expenses',
            'update_expenses',
            'delete_expenses',
            'approve_expenses',
            'view_expense_budgets',
            'create_expense_budgets',
            'update_expense_budgets',
            'delete_expense_budgets',
        ],
    ],

    // ── Academic Setup ──────────────────────────────────────────
    [
        'key' => 'academic_setup',
        'name' => 'Academic Setup – Classes & Subjects',
        'description' => 'Simplified: classes, subjects, categories. No sessions, departments, subject groups.',
        'subscription_module' => 'academics',
        'scope_types' => $ALL_TYPES,
        'permissions' => [
            'view_main_streams',
            'create_main_streams',
            'update_main_streams',
            'delete_main_streams',
            'field_main_stream_name',
            'field_main_stream_code',
            'view_streams',
            'create_streams',
            'update_streams',
            'delete_streams',
            'field_stream_name',
            'field_stream_code',
            'field_stream_main_stream_id',
            'view_subjects',
            'create_subjects',
            'update_subjects',
            'delete_subjects',
            'field_subject_name',
            'field_subject_code',
            'field_subject_stream_id',
            'field_subject_is_practical',
            'view_subject_categories',
            'create_subject_categories',
            'update_subject_categories',
            'delete_subject_categories',
            'view_subject_category_mappings',
            'create_subject_category_mappings',
            'update_subject_category_mappings',
            'delete_subject_category_mappings',
        ],
    ],

    // ── Service Branch ──────────────────────────────────────────
    [
        'key' => 'service_branch',
        'name' => 'Service Branch – ID Cards (School)',
        'description' => 'Simplified: ID card generation only. No certificate heads or applications.',
        'subscription_module' => 'certificates',
        'scope_types' => $ALL_TYPES,
        'permissions' => [
            'view_id_card_templates',
            'create_id_card_templates',
            'update_id_card_templates',
            'delete_id_card_templates',
            'generate_id_cards',
            'view_id_cards',
            'download_id_cards',
            'revoke_id_cards',
            // Field-level: ID card templates
            'field_id_card_template_name', 'field_id_card_template_card_type',
            'field_id_card_template_bg_color', 'field_id_card_template_is_default', 'field_id_card_template_is_active',
            'field_id_card_color_primary', 'field_id_card_color_secondary',
            'field_id_card_color_text', 'field_id_card_color_bg',
            'field_id_card_gen_template', 'field_id_card_gen_session', 'field_id_card_gen_stream',
            // Field-level: ID card editor (no department/session for school)
            'field_id_card_photo', 'field_id_card_name', 'field_id_card_reg_no',
            'field_id_card_stream', 'field_id_card_blood_group', 'field_id_card_dob',
            'field_id_card_mobile', 'field_id_card_valid_until',
            'field_id_card_father_name', 'field_id_card_mother_name', 'field_id_card_address',
        ],
    ],

    // ── Redressal Cell ─────────────────────────────────────────
    [
        'key' => 'redressal_cell',
        'name' => 'Redressal Cell – Support & Feedback',
        'description' => 'Grievances, support tickets, feedback, and contact enquiries.',
        'subscription_module' => 'grievances',
        'scope_types' => $ALL_TYPES,
        'permissions' => [
            'view_grievances',
            'create_grievances',
            'update_grievances',
            'delete_grievances',
            'view_all_support_tickets',
            'create_support_tickets',
            'update_support_tickets',
            'close_support_tickets',
            'view_contacts',
            'delete_contacts',
        ],
    ],

    // ── System Console ─────────────────────────────────────────
    [
        'key' => 'system_console',
        'name' => 'System Console – Admin Authority (School)',
        'description' => 'Simplified: roles, workflows, settings. No institutional departments or academics.',
        'subscription_module' => 'core',
        'scope_types' => $ALL_TYPES,
        'permissions' => [
            'view_roles',
            'create_roles',
            'update_roles',
            'delete_roles',
            'view_workflows',
            'create_workflows',
            'update_workflows',
            'delete_workflows',
            'view_settings',
            'update_settings',
            'view_academic_calendar_settings',
            'update_academic_calendar_settings',
        ],
    ],

    // ── Inventory ─────────────────────────────────────────────
    [
        'key' => 'inventory',
        'name' => 'Inventory – Assets & Stock',
        'description' => 'Categories, locations, items, stock movements, sales, and reports.',
        'subscription_module' => 'inventory',
        'scope_types' => $ALL_TYPES,
        'permissions' => [
            'view_inventory_categories',
            'create_inventory_categories',
            'update_inventory_categories',
            'delete_inventory_categories',
            'view_inventory_locations',
            'create_inventory_locations',
            'update_inventory_locations',
            'delete_inventory_locations',
            'view_inventory_items',
            'create_inventory_items',
            'update_inventory_items',
            'delete_inventory_items',
            'view_inventory_movements',
            'create_inventory_movements',
            'view_inventory_reports',
            'view_inventory_sales',
            'create_inventory_sales',
            'view_inventory_sale_reports',
        ],
    ],

    // ── Examination ───────────────────────────────────────────
    [
        'key' => 'examination',
        'name' => 'Examination & Grading',
        'description' => 'Exams, exam schedules, grading scales, and marksheets.',
        'subscription_module' => 'academics',
        'scope_types' => $ALL_TYPES,
        'permissions' => [
            'view_exams',
            'create_exams',
            'update_exams',
            'delete_exams',
            'manage_exam_schedules',
            'enter_marks',
            'view_marks',
            'publish_results',
            'manage_grading_scales',
            'view_marksheets',
        ],
    ],

    // ── Transport ─────────────────────────────────────────────
    [
        'key' => 'transport',
        'name' => 'Transport – Routes, Vehicles & Assignments',
        'description' => 'Stops, routes, vehicles, drivers, student assignments, and reports.',
        'subscription_module' => 'transport',
        'scope_types' => $ALL_TYPES,
        'permissions' => [
            'view_transport_routes',
            'create_transport_routes',
            'update_transport_routes',
            'delete_transport_routes',
            'view_transport_stops',
            'create_transport_stops',
            'update_transport_stops',
            'delete_transport_stops',
            'view_transport_vehicles',
            'create_transport_vehicles',
            'update_transport_vehicles',
            'delete_transport_vehicles',
            'view_transport_drivers',
            'create_transport_drivers',
            'update_transport_drivers',
            'delete_transport_drivers',
            'view_transport_assignments',
            'create_transport_assignments',
            'update_transport_assignments',
            'delete_transport_assignments',
            'view_transport_reports',
        ],
    ],

    // ── Hostel ────────────────────────────────────────────────
    [
        'key' => 'hostel',
        'name' => 'Hostel – Rooms, Beds & Allocations',
        'description' => 'Hostel buildings, rooms, bed allocations, and mess plans.',
        'subscription_module' => 'core', // Assuming core or you can define a 'hostel' module
        'scope_types' => $ALL_TYPES,
        'permissions' => [
            'view_hostels',
            'create_hostels',
            'update_hostels',
            'delete_hostels',
            'view_hostel_rooms',
            'create_hostel_rooms',
            'update_hostel_rooms',
            'delete_hostel_rooms',
            'view_hostel_beds',
            'create_hostel_beds',
            'update_hostel_beds',
            'delete_hostel_beds',
            'view_hostel_allocations',
            'create_hostel_allocations',
            'update_hostel_allocations',
            'delete_hostel_allocations',
            'view_hostel_complaints',
            'create_hostel_complaints',
            'update_hostel_complaints',
            'view_hostel_mess_plans',
            'create_hostel_mess_plans',
            'update_hostel_mess_plans',
            'delete_hostel_mess_plans',
            'view_hostel_reports',
        ],
    ],

    // ── Library ─────────────────────────────────────────────
    [
        'key' => 'library',
        'name' => 'Library – Books, Copies & Issue/Return',
        'description' => 'Book catalog, copies, issue/return transactions, and reports.',
        'subscription_module' => 'library',
        'scope_types' => $ALL_TYPES,
        'permissions' => [
            'view_library_books',
            'create_library_books',
            'update_library_books',
            'delete_library_books',
            'view_library_copies',
            'create_library_copies',
            'update_library_copies',
            'delete_library_copies',
            'view_library_issues',
            'create_library_issues',
            'update_library_issues',
            'view_library_reports',
        ],
    ],

    // ── Attendance ─────────────────────────────────────────────
    [
        'key' => 'attendance',
        'name' => 'Attendance – Mark & Reports',
        'description' => 'Mark daily attendance, edit records, and view reports.',
        'subscription_module' => 'academics',
        'scope_types' => $ALL_TYPES,
        'permissions' => [
            'view_attendance',
            'mark_attendance',
            'update_attendance',
            'delete_attendance',
            'view_attendance_reports',
        ],
    ],

    // ── LMS ─────────────────────────────────────────────────────
    [
        'key' => 'lms',
        'name' => 'LMS – Courses & Classrooms',
        'description' => 'Courses, class–subject allocations, classes, and enrollments.',
        'subscription_module' => 'lms',
        'scope_types' => $ALL_TYPES,
        'permissions' => [
            'view_lms_courses',
            'create_lms_courses',
            'update_lms_courses',
            'delete_lms_courses',
            'view_lms_allocations',
            'manage_lms_allocations',
            'view_lms_classes',
            'create_lms_classes',
            'update_lms_classes',
            'delete_lms_classes',
            'manage_lms_enrollments',
            'assign_lms_subject_teachers',
        ],
    ],

    // ── Timetable & Scheduling ──────────────────────────────────
    [
        'key' => 'timetable',
        'name' => 'Timetable & Scheduling',
        'description' => 'Academic schedules, rooms, and teacher substitutions.',
        'subscription_module' => 'academics',
        'scope_types' => $ALL_TYPES,
        'permissions' => [
            'view_timetables',
            'create_timetables',
            'update_timetables',
            'delete_timetables',
            'publish_timetables',
            'view_rooms',
            'create_rooms',
            'update_rooms',
            'delete_rooms',
            'view_substitutions',
            'create_substitutions',
        ],
    ],

    // ── Student Portal ─────────────────────────────────────────
    [
        'key' => 'student_portal',
        'name' => 'Student Portal – My Services (School)',
        'description' => 'Simplified: no certificates or admissions. Adds school dashboard.',
        'subscription_module' => 'student_portal',
        'scope_types' => $ALL_TYPES,
        'permissions' => [
            'portal',
            'view_my_ledger',
            'submit_grievance',
            'submit_support_ticket',
            'view_my_lms_classes',
            'view_lms_as_student',
            'use_school_student_dashboard',
            // Dedicated student-portal-exclusive keys (for nav + route gating)
            'student_portal_classes',
            'student_portal_fees',
            'student_portal_support',
        ],
    ],

    // ── Parent Portal ──────────────────────────────────────────
    [
        'key' => 'parent_portal',
        'name' => 'Parent Portal – My Students & Services (School)',
        'description' => 'Simplified: no certificates or admissions. Adds school dashboard.',
        'subscription_module' => 'student_portal',
        'scope_types' => $ALL_TYPES,
        'permissions' => [
            'portal',
            'view_my_students',
            'submit_grievance',
            'submit_support_ticket',
            'view_my_lms_classes',
            'view_lms_as_student',
            'view_notices',
            'view_my_ledger',
            'use_school_student_dashboard',
            // Dedicated student-portal-exclusive keys (for nav + route gating)
            'student_portal_classes',
            'student_portal_fees',
            'student_portal_support',
        ],
    ],

    // ── Video Engine ────────────────────────────────────────────
    [
        'key' => 'video_engine',
        'name' => 'Video Engine – Upload & Stream',
        'description' => 'Upload, transcode, and stream videos across the platform.',
        'subscription_module' => 'lms',
        'scope_types' => $ALL_TYPES,
        'permissions' => ['upload_videos', 'view_videos', 'delete_videos', 'view_video_analytics'],
    ],

    // ── Test Series ────────────────────────────────────────────
    [
        'key' => 'test_series',
        'name' => 'Test Series – Curated Assessments',
        'description' => 'Group tests into curated series with performance analytics and leaderboards.',
        'subscription_module' => 'lms',
        'scope_types' => $ALL_TYPES,
        'permissions' => [
            'view_test_series', 'create_test_series', 'update_test_series',
            'delete_test_series', 'publish_test_series', 'view_test_analytics',
            'view_test_leaderboard', 'recalculate_test_results', 'attempt_test_series',
        ],
    ],

    // ── Doubt Forum ────────────────────────────────────────────
    [
        'key' => 'doubt_forum',
        'name' => 'Doubt Forum – Q&A',
        'description' => 'Subject-wise doubt threads with faculty replies and voting.',
        'subscription_module' => 'lms',
        'scope_types' => $ALL_TYPES,
        'permissions' => ['view_doubts', 'create_doubts', 'reply_doubts', 'resolve_doubts', 'delete_doubts'],
    ],

    // ── Question Bank ────────────────────────────────────────────
    [
        'key' => 'question_bank',
        'name' => 'Question Bank – Subject Wise Repository',
        'description' => 'Manage questions, question types, and tagging for assignments and test series.',
        'subscription_module' => 'lms',
        'scope_types' => $ALL_TYPES,
        'permissions' => ['view_question_bank', 'create_questions', 'update_questions', 'delete_questions'],
    ],

];
