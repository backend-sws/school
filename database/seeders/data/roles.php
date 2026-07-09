<?php

/**
 * Role keys: single source of truth for RoleSeeder.
 * Level is for ordering only; access is permission-based.
 * scope_type in role_scopes: 'global' = system-wide (super_admin only); null = default institution type; else school|college|coaching|university.
 */
return [
    ['key' => 'super_admin', 'name' => 'Super Administrator', 'level' => 100, 'is_system' => true, 'description' => 'Global; bypass all permission checks', 'scope_type' => 'global'],
    ['key' => 'institution_admin', 'name' => 'Institution Administrator', 'level' => 80, 'is_system' => true, 'description' => 'Full institution admin; restrict per user via user_permissions', 'scope_type' => null],
    ['key' => 'principal', 'name' => 'Principal / HOD', 'level' => 75, 'is_system' => true, 'description' => 'Principal and HOD merged; one default permission set', 'scope_type' => null],
    ['key' => 'staff', 'name' => 'Staff', 'level' => 30, 'is_system' => true, 'description' => 'Teachers, fee collectors, clerks; permission set per user', 'scope_type' => null],
    ['key' => 'student', 'name' => 'Student', 'level' => 10, 'is_system' => true, 'description' => 'Portal user (enrolled); student preset', 'scope_type' => null],
    ['key' => 'candidate', 'name' => 'Admission Candidate', 'level' => 5, 'is_system' => true, 'description' => 'Portal user (applicant); candidate preset', 'scope_type' => null],
    ['key' => 'parent', 'name' => 'Parent / Guardian', 'level' => 8, 'is_system' => true, 'description' => 'Portal user; can view linked students and switch context', 'scope_type' => null],
    ['key' => 'librarian', 'name' => 'Librarian', 'level' => 26, 'is_system' => false, 'description' => 'Library management, book issue/return, and reading programs', 'scope_type' => null],
];
