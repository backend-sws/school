<?php

/**
 * Maps each role to permissions and workflows.
 * Role's effective permissions = role_permissions (direct) + permissions from role_workflows.
 * Used by RoleMappingSeeder to sync role_permissions and role_workflows.
 *
 * IMPORTANT: Both school AND higher-ed workflow variants are listed per role.
 * `Role::getAllPermissionKeys($institutionId)` filters by `workflow_scopes`
 * to select only the matching variant for the institution's type at runtime.
 *
 * Workflow variants (scope_type driven):
 *   School-only:   admission_cell_school, office_registry_school, accounts_room_school,
 *                  academic_setup_school, service_branch_school, system_console_school,
 *                  student_portal_school, parent_portal_school.
 *   Higher-ed:     admission_cell, office_registry, accounts_room,
 *                  academic_setup, service_branch, system_console,
 *                  student_portal, parent_portal.
 *   All types:     account, admin_desk, my_organisation, info_pr_hub, redressal_cell,
 *                  inventory, transport, attendance, library, lms, timetable.
 *
 * super_admin is intentionally empty — hidden for now.
 */
return [
    // ── Super Admin (hidden – no workflows/permissions for now) ──────
    'super_admin' => [
        'permissions' => [],
        'workflows' => [],
    ],

    // ── Institution Admin ───────────────────────────────────────────
    'institution_admin' => [
        'permissions' => [],
        'workflows' => [
            // All-type workflows
            'account',
            'admin_desk',
            'my_organisation',
            'info_pr_hub',
            'redressal_cell',
            'inventory',
            'transport',
            'attendance',
            'library',
            'lms',
            'timetable',
            'examination',
            'hostel',
            'gate_security',
            // Specific Modules
            'admission_cell',
            'office_registry',
            'accounts_room',
            'academic_setup',
            'service_branch',
            'system_console',
            'question_bank',
        ],
    ],

    // ── Principal / HOD ─────────────────────────────────────────────
    'principal' => [
        'permissions' => [],
        'workflows' => [
            // All-type workflows
            'account',
            'admin_desk',
            'info_pr_hub',
            'redressal_cell',
            'inventory',
            'transport',
            'attendance',
            'library',
            'lms',
            'timetable',
            'examination',
            'hostel',
            'gate_security',
            // Specific Modules
            'admission_cell',
            'office_registry',
            'accounts_room',
            'expense_tracker',
            'academic_setup',
            'service_branch',
            'question_bank',
        ],
    ],

    // ── Teacher ─────────────────────────────────────────────────────
    'teacher' => [
        'permissions' => [],
        'workflows' => [
            'account',
            'attendance',
            'lms',
            'timetable',
            'examination',
            'question_bank',
            'info_pr_hub',
            'library',
            'redressal_cell',
        ],
    ],

    // ── Accountant ──────────────────────────────────────────────────
    'accountant' => [
        'permissions' => [],
        'workflows' => [
            'account',
            'accounts_room',
            'expense_tracker',
            'admin_desk',
            'info_pr_hub',
        ],
    ],

    // ── Librarian ───────────────────────────────────────────────────
    'librarian' => [
        'permissions' => [],
        'workflows' => [
            'account',
            'library',
            'info_pr_hub',
        ],
    ],

    // ── Store Manager (Inventory) ───────────────────────────────────
    'store_manager' => [
        'permissions' => [],
        'workflows' => [
            'account',
            'inventory',
            'info_pr_hub',
        ],
    ],

    // ── Driver (Transport) ──────────────────────────────────────────
    'driver' => [
        'permissions' => [],
        'workflows' => [
            'account',
            'transport',
        ],
    ],

    // ── Security Guard (Gate Security) ──────────────────────────────
    'guard' => [
        'permissions' => [],
        'workflows' => [
            'account',
            'gate_security',
        ],
    ],

    // ── Staff (General) ─────────────────────────────────────────────
    'staff' => [
        'permissions' => [],
        'workflows' => [
            'account',
            'attendance',
            'info_pr_hub',
            'redressal_cell',
        ],
    ],

    // ── Student (enrolled) ──────────────────────────────────────────
    'student' => [
        'permissions' => [],
        'workflows' => [
            'account',
            'student_portal',
        ],
    ],

    // ── Candidate (applicant) ───────────────────────────────────────
    'candidate' => [
        'permissions' => [],
        'workflows' => [
            'account',
            'student_portal',
        ],
    ],

    // ── Parent / Guardian ───────────────────────────────────────────
    'parent' => [
        'permissions' => [],
        'workflows' => [
            'account',
            'parent_portal',
        ],
    ],
];
