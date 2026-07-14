<?php

/**
 * Route permission groups and middleware stacks.
 * This config drives the UI layer only: which routes/menus a user can access (roles + permission set).
 * Data layer is separate: all data access uses scope_type/scope_id (institution) via BelongsToDefaultInstitution and assignment pivots (see docs/auth-rbac-overview.md).
 *
 * Single source of truth for web and API routes. auth.permissions (shared to frontend) must include at least one key from a group to access routes using that group.
 *
 * 1. Top-level keys (system_console, office_registry, ...) = permission keys per group for EnsurePermissionGroup.
 * 2. 'middleware' = named stacks used in routes: config('route_permissions.middleware.<key>').
 */
return [
    /*
    |--------------------------------------------------------------------------
    | Named middleware stacks (use in routes to avoid literal strings)
    |--------------------------------------------------------------------------
    */
    'middleware' => [
        // Polymorphic: all access checks are permission-based, no hardcoded role lists.
        // If a user has ANY permission from the group, they can access the routes.
        'admin' => ['ensure-permission-group:admin_desk,admission_cell,office_registry,info_pr_hub,accounts_room,expense_tracker,academic_setup,service_branch,redressal_cell,system_console,my_organisation,inventory,transport,attendance,library,lms,timetable,question_bank,examination,hostel'],
        'portal' => ['ensure-permission-group:student_portal'],
        'admin_desk' => ['ensure-permission-group:admin_desk'],
        'admission_cell' => ['ensure-permission-group:admission_cell'],
        'office_registry' => ['ensure-permission-group:office_registry'],
        'info_pr_hub' => ['ensure-permission-group:info_pr_hub'],
        'accounts_room' => ['ensure-permission-group:accounts_room'],
        'expense_tracker' => ['ensure-permission-group:expense_tracker'],
        'academic_setup' => ['ensure-permission-group:academic_setup'],
        'service_branch' => ['ensure-permission-group:service_branch'],
        'redressal_cell' => ['ensure-permission-group:redressal_cell'],
        'system_console' => ['ensure-permission-group:system_console'],
        'my_organisation' => ['ensure-permission-group:my_organisation'],
        'inventory' => ['ensure-permission-group:inventory'],
        'transport' => ['ensure-permission-group:transport'],
        'attendance' => ['ensure-permission-group:attendance'],
        'library' => ['ensure-permission-group:library'],
        'lms' => ['ensure-permission-group:lms'],
        'timetable' => ['ensure-permission-group:timetable'],
        'question_bank' => ['ensure-permission-group:question_bank'],
        'fees' => ['ensure-permission-group:accounts_room'],
        'organization' => ['ensure-permission-group:system_console'],
        'personal_settings' => ['ensure-permission-group:account'],
        'super_admin_only' => ['ensure-permission-group:my_organisation'],
        'examination' => ['ensure-permission-group:examination'],
        'hostel' => ['ensure-permission-group:hostel'],
    ],

    /*
    |--------------------------------------------------------------------------
    | Permission keys per group (for EnsurePermissionGroup middleware)
    |--------------------------------------------------------------------------
    */

    'account' => [
        'update_profile',
        'update_password',
    ],

    'admin_desk' => [
        'view_dashboard',
        'view_all_reports',
        'export_reports',
        'view_audit',
        'view_data_import',
        'perform_data_import',
    ],

    'admission_cell' => [
        'view_applications',
        'create_applications',
        'update_applications',
        'delete_applications',
        'approve_applications',
        'view_admission_heads',
        'create_admission_heads',
        'update_admission_heads',
        'delete_admission_heads',
        'apply_admission',
        'view_promotions',
        'create_promotions',
        'bulk_promote',
        'rollback_promotions',
        'view_readmissions',
        'create_readmissions',
        'bulk_readmit',
        'preview_readmission_fees',
        'rollback_readmissions',
    ],

    'office_registry' => [
        'view_users',
        'create_users',
        'update_users',
        'delete_users',
        'view_students',
        'view_candidates',
        'create_faculty',
        'update_faculty',
        'delete_faculty',
        'view_staff_links',
        'update_staff_links',
    ],

    'info_pr_hub' => [
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

    'accounts_room' => [
        'view_fee_heads',
        'create_fee_heads',
        'update_fee_heads',
        'delete_fee_heads',
        'view_fee_particulars',
        'create_fee_particulars',
        'update_fee_particulars',
        'delete_fee_particulars',
        'collect_fees',
        'view_fee_payments',
        'view_fee_reports',
        'view_fee_regulations',
        'update_fee_regulations',
        'view_fee_collection_settings',
        'update_fee_collection_settings',
        'view_fee_dues',
        'send_fee_reminders',
    ],

    'expense_tracker' => [
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

    'academic_setup' => [
        'view_departments',
        'create_departments',
        'update_departments',
        'delete_departments',
        'view_sessions',
        'create_sessions',
        'update_sessions',
        'delete_sessions',
        'view_streams',
        'create_streams',
        'update_streams',
        'delete_streams',
        'view_subjects',
        'create_subjects',
        'update_subjects',
        'delete_subjects',
        'view_subject_groups',
        'create_subject_groups',
        'update_subject_groups',
        'delete_subject_groups',

        'view_subject_categories',
        'create_subject_categories',
        'update_subject_categories',
        'delete_subject_categories',
        'view_subject_category_mappings',
        'create_subject_category_mappings',
        'update_subject_category_mappings',
        'delete_subject_category_mappings',
    ],

    'examination' => [
        'view_exams',
        'create_exams',
        'update_exams',
        'delete_exams',
        'manage_exam_schedules',
        'enter_marks',
        'view_marks',
        'publish_results',
        'manage_grading_scales',
    ],


    'service_branch' => [
        'view_certificates',
        'create_certificates',
        'update_certificates',
        'delete_certificates',
        'issue_certificates',
        'request_certificate',
        'view_id_card_templates',
        'create_id_card_templates',
        'update_id_card_templates',
        'delete_id_card_templates',
        'generate_id_cards',
        'view_id_cards',
        'download_id_cards',
        'revoke_id_cards',
    ],

    'redressal_cell' => [
        'view_grievances',
        'create_grievances',
        'update_grievances',
        'delete_grievances',
        'submit_grievance',
        'view_all_support_tickets',
        'create_support_tickets',
        'submit_support_ticket',
        'update_support_tickets',
        'close_support_tickets',
        'view_contacts',
        'delete_contacts',
    ],

    'system_console' => [
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

    'my_organisation' => [
        'view_institutes',
        'view_organisations',
        'create_organisations',
        'create_institutes',
    ],

    'inventory' => [
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

    'lms' => [
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
        'view_my_lms_classes',
        'student_portal_classes',
    ],

    'transport' => [
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

    'hostel' => [
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

    'attendance' => [
        'view_attendance',
        'mark_attendance',
        'update_attendance',
        'delete_attendance',
        'view_attendance_reports',
    ],

    'library' => [
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

    'timetable' => [
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

    'question_bank' => [
        'view_question_bank',
        'create_questions',
        'update_questions',
        'delete_questions',
    ],


    /** Portal: student/candidate (student-portal-exclusive keys for route + nav gating) */
    'student_portal' => [
        'portal',
        'student_portal_classes',
        'student_portal_fees',
        'view_my_ledger',
        'student_portal_certificates',
        'student_portal_applications',
        'student_portal_support',
        'student_portal_hostel',
    ],

    /** Portal: parent/guardian (My Students + student-portal-exclusive keys) */
    'parent_portal' => [
        'portal',
        'view_my_students',
        'student_portal_classes',
        'student_portal_fees',
        'view_my_ledger',
        'student_portal_certificates',
        'student_portal_applications',
        'student_portal_support',
        'student_portal_hostel',
    ],

    /*
    |--------------------------------------------------------------------------
    | Landing Pages (ordered – first match wins)
    |--------------------------------------------------------------------------
    | Maps a permission key to the route the user should land on after login.
    | UserRedirectResolver iterates this list and routes to the first entry
    | where the user holds the permission. Keep admin-level entries first.
    */
    'landing_pages' => [
        'view_dashboard'   => 'dashboard', // admin / principal
        'view_attendance'  => 'attendance.index', // staff (attendance)
        'view_lms_courses' => 'lms.index', // staff (lms)
        'view_my_students' => 'dashboard', // parent
        'portal'           => 'dashboard', // student / candidate
    ],
];
