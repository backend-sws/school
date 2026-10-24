<?php

/**
 * Role keys: single source of truth for RoleSeeder.
 * Level is for ordering only; access is permission-based.
 * scope_type in role_scopes: 'global' = system-wide (super_admin only); null = default institution type; else school|college|coaching|university.
 */
return [
    ['key' => 'super_admin', 'name' => 'Super Administrator', 'level' => 100, 'is_system' => true, 'description' => 'Global; bypass all permission checks', 'scope_type' => 'global'],
    ['key' => 'institution_admin', 'name' => 'Institution Administrator', 'level' => 80, 'is_system' => true, 'description' => 'Full institution admin; restrict per user via user_permissions', 'scope_type' => null],
    ['key' => 'principal', 'name' => 'Principal / HOD', 'level' => 75, 'is_system' => false, 'description' => 'Principal and HOD; full academic and operational control', 'scope_type' => null],
    ['key' => 'teacher', 'name' => 'Teacher', 'level' => 35, 'is_system' => false, 'description' => 'Academic teacher: classes, attendance, exams, timetable, and LMS', 'scope_type' => null],
    ['key' => 'accountant', 'name' => 'Accountant', 'level' => 32, 'is_system' => false, 'description' => 'Accounts and finance: fee collection, expenses, and financial reports', 'scope_type' => null],
    ['key' => 'librarian', 'name' => 'Librarian', 'level' => 26, 'is_system' => false, 'description' => 'Library management, book issue/return, and catalog', 'scope_type' => null],
    ['key' => 'store_manager', 'name' => 'Store Manager', 'level' => 24, 'is_system' => false, 'description' => 'Inventory and store: stock items, vendors, and asset issue/return', 'scope_type' => null],
    ['key' => 'driver', 'name' => 'Driver', 'level' => 20, 'is_system' => false, 'description' => 'Transport operations, bus routes, and vehicle management', 'scope_type' => null],
    ['key' => 'guard', 'name' => 'Security Guard', 'level' => 18, 'is_system' => false, 'description' => 'Gate security, visitor passes, and campus entry tracking', 'scope_type' => null],
    ['key' => 'staff', 'name' => 'Staff (General)', 'level' => 25, 'is_system' => false, 'description' => 'General non-teaching or support staff', 'scope_type' => null],
    ['key' => 'student', 'name' => 'Student', 'level' => 10, 'is_system' => true, 'description' => 'Portal user (enrolled); student preset', 'scope_type' => null],
    ['key' => 'candidate', 'name' => 'Admission Candidate', 'level' => 5, 'is_system' => true, 'description' => 'Portal user (applicant); candidate preset', 'scope_type' => null],
    ['key' => 'parent', 'name' => 'Parent / Guardian', 'level' => 8, 'is_system' => true, 'description' => 'Portal user; can view linked students and switch context', 'scope_type' => null],
];
