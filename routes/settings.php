<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/**
 * Settings routes. Permissions from config/route_permissions.php:
 * - personal_settings: role only (institution_admin, staff, super_admin).
 * - Institutional routes: admin + organization (organization = ensure-permission-group:system_console).
 * Same system_console keys (view_settings, update_settings, view_roles, view_workflows, etc.) gate API settings endpoints.
 */
Route::middleware('auth')->group(function () {

    // ── Personal settings (any authenticated admin/staff) ────────────
    Route::middleware(config('route_permissions.middleware.personal_settings'))->group(function () {

        Route::redirect('settings', '/settings/profile');

        Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        Route::get('settings/password', [PasswordController::class, 'edit'])->name(name: 'user-password.edit');

        Route::put('settings/password', [PasswordController::class, 'update'])
            ->middleware('throttle:6,1')
            ->name('user-password.update');

        Route::get('settings/appearance', function () {
            return Inertia::render('settings/appearance');
        })->name('appearance.edit');

        Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
            ->name('two-factor.show');
    });

    // ── Institutional settings (require organization permissions) ────
    Route::middleware(config('route_permissions.middleware.admin'))
        ->middleware(config('route_permissions.middleware.organization'))
        ->group(function () {

            Route::get('settings/admission', function () {
                return Inertia::render('settings/admission');
            })->name('admission.index');
            Route::get('settings/stream-form', function () {
                return Inertia::render('settings/stream-form');
            })->name('stream-form');
            Route::get('settings/fee-rules', fn() => redirect()->route('accounts.fee-hub.fee-types'))->name('settings.fee-rules');

            Route::get('settings/admission-setting', function () {
                return Inertia::render('settings/admission-setting');
            })->name('admission-setting');
            Route::get('settings/readmission-setting', function () {
                return Inertia::render('settings/reAdmission-setting');
            })->name('readmission-setting');
            Route::get('settings/admission-verification', function () {
                return Inertia::render('settings/admission-verification');
            })->name('admission-verification');
            Route::get('settings/student-verification', function () {
                return Inertia::render('settings/student-verification');
            })->name('student-verification');
            Route::get('settings/admission-certificate-head', function () {
                return Inertia::render('settings/admission-certificate-head');
            })->name('admission-certificate-head');

            // Institutional & Landing Page Customizations
            Route::get('settings/institution', function () {
                return Inertia::render('settings/institution');
            })->name('settings.institution');
            Route::get('settings/digital-presence', function () {
                return Inertia::render('settings/digital-presence');
            })->name('settings.digital-presence');
            Route::get('settings/seo', function () {
                return Inertia::render('settings/seo');
            })->name('settings.seo');
            Route::get('settings/landing-page-content', function () {
                return Inertia::render('settings/landing-page-content');
            })->name('settings.landing-page');

            Route::get('settings/institutional-academics', function () {
                return Inertia::render('settings/institutional-academics');
            })->name('settings.institutional-academics');
            Route::get('settings/institutional-departments', function () {
                return Inertia::render('settings/institutional-departments');
            })->name('settings.institutional-departments');
            Route::get('settings/institutional-facilities', function () {
                return Inertia::render('settings/institutional-facilities');
            })->name('settings.institutional-facilities');
            Route::get('settings/institutional-placement', function () {
                return Inertia::render('settings/institutional-placement');
            })->name('settings.institutional-placement');
            Route::get('settings/institutional-approvals', function () {
                return Inertia::render('settings/institutional-approvals');
            })->name('settings.institutional-approvals');

            Route::get('settings/academic-calendar', function () {
                return Inertia::render('settings/academic-calendar');
            })->name('settings.academic-calendar');

            Route::get('settings/staff-directory', function () {
                return Inertia::render('settings/staff-directory/index');
            })->name('settings.staff-directory');
            Route::get('settings/staff-directory/create', function () {
                return Inertia::render('settings/staff-directory/create');
            })->name('settings.staff-directory.create');
            Route::get('settings/staff-directory/{id}/edit', function ($id) {
                return Inertia::render('settings/staff-directory/create', ['id' => (int) $id]);
            })->name('settings.staff-directory.edit');
        });
});
