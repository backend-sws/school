<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Institution types (school, college, coaching, university)
    |--------------------------------------------------------------------------
    */
    'institution_types' => class_exists('App\Enums\InstitutionType')
        ? \App\Enums\InstitutionType::values()
        : ['school', 'college', 'coaching', 'university'],

    /*
    |--------------------------------------------------------------------------
    | Scope types for RBAC (global, institution)
    |--------------------------------------------------------------------------
    */
    'scope_types' => class_exists('App\Enums\ScopeType')
        ? \App\Enums\ScopeType::values()
        : ['global', 'institution'],

    /*
    |--------------------------------------------------------------------------
    | Default Institution ID
    |--------------------------------------------------------------------------
    |
    | Default institution (school, college, coaching, university) for
    | single-institution mode. When multi-institution mode is disabled,
    | all operations use this institution.
    |
    */
    'default_institution_id' => env('EMS_DEFAULT_INSTITUTION_ID', null),

    /*
    |--------------------------------------------------------------------------
    | Default Institution Type (when type cannot be resolved from DB)
    |--------------------------------------------------------------------------
    */
    'default_institution_type' => env('EMS_DEFAULT_INSTITUTION_TYPE', class_exists('App\Enums\InstitutionType') ? \App\Enums\InstitutionType::SCHOOL->value : 'school'),

    'default_brand_theme' => env('EMS_DEFAULT_BRAND_THEME', 'royal'),

    /*
    |--------------------------------------------------------------------------
    | Skip Landing Page (client deployments)
    |--------------------------------------------------------------------------
    | When true, the product landing page (/) redirects to /login instead.
    | Used for white-label client deployments that don't need the marketing page.
    */
    'skip_landing' => env('EMS_SKIP_LANDING', false),

    /*
    |--------------------------------------------------------------------------
    | Legacy: scope-based permission filtering removed
    |--------------------------------------------------------------------------
    | Previously had school_hidden_* arrays here. Now handled entirely via
    | DB-driven workflow_scopes — each scope type gets its own workflow
    | variant with exactly the right permissions. See workflows.php.
    */

    /*
    |--------------------------------------------------------------------------
    | Drop legacy fee tables (fee_particulars, class_fee_structures, fee_structures_legacy)
    |--------------------------------------------------------------------------
    | Set to true only after all code uses fee_types and fee_structures. Then run migrate.
    */
    'drop_legacy_fee_tables' => env('DROP_LEGACY_FEE_TABLES', false),

    /*
    |--------------------------------------------------------------------------
    | Multi-Institution Mode
    |--------------------------------------------------------------------------
    |
    | When enabled, users can select from multiple institutions.
    | When disabled, default_institution_id is used automatically.
    |
    */
    'multi_institution_mode' => env('EMS_MULTI_INSTITUTION_MODE', false),

    /*
    |--------------------------------------------------------------------------
    | Application Settings
    |--------------------------------------------------------------------------
    */
    'app_name' => env('EMS_APP_NAME', 'PDS Education Management System'),
    'app_short_name' => env('EMS_APP_SHORT_NAME', 'PDSE'),

    /*
    |--------------------------------------------------------------------------
    | Domain → Institution mapping (optional)
    |--------------------------------------------------------------------------
    | Path to JSON file with institutions keyed by domain. When set and
    | ResolveInstitutionFromDomain middleware runs, default_institution_id
    | and app.url are set per request from the request host.
    */
    'institutions_config_path' => env('INSTITUTIONS_CONFIG_PATH'),

    /*
    |--------------------------------------------------------------------------
    | Attendance status values
    |--------------------------------------------------------------------------
    | Allowed statuses for attendance records. Default for "no record" in reports
    | is treated as absent or not counted (configurable in report logic).
    */
    'attendance_statuses' => ['present', 'absent', 'late', 'leave', 'holiday'],

    /*
    |--------------------------------------------------------------------------
    | Email Template Design Tokens
    |--------------------------------------------------------------------------
    | Shared styling for all transactional emails (verification, invitation,
    | notification). Every Blade template uses emails.layouts.base which
    | reads these tokens via the EmailTemplate helper.
    |
    */
    'email' => [
        'colors' => [
            'primary' => '#1a1a2e',
            'primary_end' => '#0f3460',
            'accent' => '#e94560',
            'bg' => '#f0f2f5',
            'card' => '#ffffff',
            'text' => '#334155',
            'text_muted' => '#64748b',
            'text_faint' => '#94a3b8',
            'border' => '#e2e8f0',
            'info_bg' => '#f8fafc',
            'fallback_bg' => '#f1f5f9',
            'footer_bg' => '#1a1a2e',
            'footer_text' => 'rgba(255,255,255,0.7)',
            'footer_faint' => 'rgba(255,255,255,0.3)',
            'btn_shadow' => 'rgba(15,52,96,0.3)',
        ],
        'brand' => [
            'powered_by' => env('EMS_POWERED_BY', 'PRADYUMAN EDUCATIONAL AND CHARITABLE FOUNDATION'),
            'powered_by_url' => env('EMS_POWERED_BY_URL', 'https://pdseducation.tech'),
            'designed_by' => env('EMS_DESIGNED_BY', 'StartupWebSupport'),
            'designed_by_url' => env('EMS_DESIGNED_BY_URL', 'https://startupwebsupport.com'),
            'copyright_by' => env('EMS_COPYRIGHT_BY'),
            'site_url' => env('EMS_SITE_URL'),
        ],
    ],
];
