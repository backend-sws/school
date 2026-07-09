<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

/*
|--------------------------------------------------------------------------
| Monitoring (Prometheus scrape - no auth)
|--------------------------------------------------------------------------
*/
Route::get('/metrics', function () {
    if (class_exists(\App\Http\Controllers\MetricsController::class)) {
        return app()->call(\App\Http\Controllers\MetricsController::class);
    }
    return response('', 404);
})->name('metrics');

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
// Public ID Card Verification (no auth — QR code scans)
Route::get("/verify/id-card/{token}", fn(string $token) => Inertia::render("verify/id-card", ["token" => $token]))->name("verify.id-card");

// Short URL redirect (no auth — used in SMS links)
// Flattened to root (/{code}) to keep length under 30 chars for DLT whitelisting.
// Route::get('/{code}', \App\Http\Controllers\ShortUrlController::class)
//     ->where('code', '^[a-zA-Z0-9]{4}$')
//     ->name('short-url.redirect');
// The Main Landing Page for the root domain (product landing)
// Only registered when EMS_SKIP_LANDING is false (multi-tenant SaaS mode).
// Singleton deployments (EMS_SKIP_LANDING=true) skip this so '/' serves the institution website.
if (!config('ems.skip_landing')) {
    Route::domain(parse_url(config('app.url'), PHP_URL_HOST))->group(function () {
        Route::get('/', \App\Http\Controllers\Web\MainLandingController::class)->name('marketing.home');
    });
}

// Default root route — serves institution public website when institution ID is configured.
Route::get('/', function (\Illuminate\Http\Request $request) {
    if (config('ems.default_institution_id')) {
        return app(\App\Http\Controllers\Web\WebsiteController::class)->index($request);
    }

    // No institution configured — try marketing landing if it exists, otherwise show login
    if (Route::has('marketing.home')) {
        return redirect()->route('marketing.home');
    }

    return redirect()->route('login');
})->name('home');

/*
|--------------------------------------------------------------------------
| Legal Pages (Terms & Privacy — public, no auth)
|--------------------------------------------------------------------------
*/
Route::get('/terms', [\App\Http\Controllers\Web\LegalController::class, 'show'])->defaults('slug', 'terms')->name('legal.terms');
Route::get('/privacy', [\App\Http\Controllers\Web\LegalController::class, 'show'])->defaults('slug', 'privacy')->name('legal.privacy');

// Student Login & Register Pages

Route::get('/about-us', function () {
    return Inertia::render('about-us');
})->name('about-us');

Route::get('/contact', function () {
    return Inertia::render('contact');
})->name('contact');

Route::get('/gallery', function () {
    return Inertia::render('gallery/index');
})->name('gallery');

Route::get('/approval', function () {
    return Inertia::render('approval');
})->name('approval');

Route::get('/academics', function () {
    return Inertia::render('academics/index');
})->name('academics');

Route::get('/departments', function () {
    return Inertia::render('departments/index');
})->name('departments');

Route::get('/facilities', function () {
    return Inertia::render('facilities/index');
})->name('facilities');

Route::get('/training-placement', function () {
    return Inertia::render('training-placement/index');
})->name('training-placement');

// Generic verification link (students, staff, etc.): verify token → set password page
Route::get('verify-email', \App\Http\Controllers\Web\VerifyEmailController::class)->name('verify.email.custom');

Route::get('/verify-account', function () {
    return Inertia::render('auth/verify-account');
})->name('verify-account');

/*
|--------------------------------------------------------------------------
| Authenticated Routes (Admin Panel)
|--------------------------------------------------------------------------
|
| Public website routes are defined in routes/public.php.
|
*/
// Onboarding — /register works for both guests and authenticated users
Route::get('/register', [\App\Http\Controllers\Web\OnboardingController::class, 'showAccountForm'])->name('register');

// Onboarding — Guest routes (Step 1: Account)
Route::middleware('guest')->group(function () {
    Route::post('/onboarding/account', [\App\Http\Controllers\Web\OnboardingController::class, 'storeAccountData'])->name('onboarding.account.store');
});

// Onboarding — Verify notice & resend (works for both guests and authenticated users)
Route::get('/onboarding/verify-notice', [\App\Http\Controllers\Web\OnboardingController::class, 'showVerifyNotice'])->name('onboarding.verify.notice');
Route::post('/onboarding/resend-verification', [\App\Http\Controllers\Web\OnboardingController::class, 'resendVerification'])->name('onboarding.resend');
Route::get('/onboarding/check-verification', [\App\Http\Controllers\Web\OnboardingController::class, 'checkVerificationStatus'])->name('onboarding.check-verification');

// Onboarding — Verification link (token-based, no auth needed)
Route::get('/onboarding/verify/{token}', [\App\Http\Controllers\Web\OnboardingController::class, 'verifyEmail'])->name('onboarding.verify');

// Onboarding — Steps 3-7 (auth required)
Route::middleware('auth')->group(function () {
    // Step 3: Plan selection
    Route::get('/onboarding/plan', [\App\Http\Controllers\Web\OnboardingController::class, 'showPlanSelection'])->name('onboarding.plan');
    Route::post('/onboarding/plan', [\App\Http\Controllers\Web\OnboardingController::class, 'storePlanSelection'])->name('onboarding.plan.store');

    // Step 4: Card details (encrypted)
    Route::get('/onboarding/card', [\App\Http\Controllers\Web\OnboardingController::class, 'showCardDetails'])->name('onboarding.card');
    Route::post('/onboarding/card', [\App\Http\Controllers\Web\OnboardingController::class, 'storeCardDetails'])->name('onboarding.card.store');

    // Step 5: Organization setup
    Route::get('/onboarding/setup', [\App\Http\Controllers\Web\OnboardingController::class, 'showOrgSetup'])->name('onboarding.setup');
    Route::post('/onboarding/setup', [\App\Http\Controllers\Web\OnboardingController::class, 'storeOrgSetup'])->name('onboarding.setup.store');

    // Step 6: Data import
    Route::get('/onboarding/data-import', [\App\Http\Controllers\Web\OnboardingController::class, 'showDataImport'])->name('onboarding.data-import');
    Route::post('/onboarding/data-import/auto-seed/{category}', [\App\Http\Controllers\Web\OnboardingController::class, 'autoSeedCategory'])->name('onboarding.data-import.seed');
    Route::post('/onboarding/data-import/upload/{category}', [\App\Http\Controllers\Web\OnboardingController::class, 'uploadCategory'])->name('onboarding.data-import.upload');
    Route::get('/onboarding/data-import/template/{category}', [\App\Http\Controllers\Web\OnboardingController::class, 'downloadSampleTemplate'])->name('onboarding.data-import.template');

    // Step 7: Platform setup (visual-only — all seeding happens at app bootstrap)
    Route::get('/onboarding/platform-setup', [\App\Http\Controllers\Web\OnboardingController::class, 'showPlatformSetup'])->name('onboarding.platform-setup');
});

Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard - role-based redirect handled by middleware, role-based render handled by closure
    Route::get('/dashboard', function () {
        $user = auth()->user();
        if ($user->hasAbility('portal')) {
            return Inertia::render('student-portal/dashboard');
        }
        return Inertia::render('dashboard');
    })
        ->middleware('dashboard-redirect')
        ->name('dashboard');

    // Notifications (all authenticated users)
    Route::get('/notifications', fn() => Inertia::render('notifications/index'))->name('notifications');

    // Documentation Guides
    // Route::get('/admin/guides', [\App\Http\Controllers\Web\DocumentationController::class, 'index'])->name('admin.guides.index');
    // Route::get('/admin/guides/{slug}', [\App\Http\Controllers\Web\DocumentationController::class, 'show'])->name('admin.guides.show');

    // Subscription & Billing
    Route::prefix('billing')->name('billing.')->group(function () {
        Route::get('/plans', [\App\Http\Controllers\Api\V1\Organization\BillingController::class, 'index'])->name('plans');
        Route::post('/checkout', [\App\Http\Controllers\Api\V1\Organization\BillingController::class, 'checkout'])->name('checkout');
        Route::match(['get', 'post'], '/success', [\App\Http\Controllers\Api\V1\Organization\BillingController::class, 'paymentSuccess'])->name('success');
    });

    // Super Admin: institution list (with domains) + audit log access
    Route::get('/super-admin', [\App\Http\Controllers\Web\SuperAdminLandingController::class, '__invoke'])
        ->middleware(config('route_permissions.middleware.super_admin_only'))
        ->name('admin.super-admin-landing');

    // Admin panel: role (admin) + permission groups from config/route_permissions.php.
    // Shared with frontend via auth.permissions; same keys gate these routes (EnsurePermissionGroup).
    // Groups used here: academic_setup, accounts_room, office_registry, admission_cell, service_branch, info_pr_hub, redressal_cell, my_organisation, system_console.
    Route::middleware(config('route_permissions.middleware.admin'))->group(function () {

        // ==========================================================================
        // Academic Setup (Foundation & Rules)
        // ==========================================================================
        Route::middleware(config('route_permissions.middleware.academic_setup'))->group(function () {
            Route::prefix('organization')->name('organization.')->group(function () {
                Route::get('/departments', fn() => Inertia::render('organization/departments/index'))->name('departments');
                Route::get('/departments/create', fn() => Inertia::render('organization/departments/create'))->name('departments.create');
                Route::get('/departments/{id}', fn($id) => Inertia::render('organization/departments/show', ['id' => $id]))->name('departments.show');
                Route::get('/departments/{id}/edit', fn($id) => Inertia::render('organization/departments/edit', ['id' => $id]))->name('departments.edit');

                Route::get('/main-streams', fn() => Inertia::render('organization/main-streams/index'))->name('main-streams');
                Route::get('/main-streams/create', fn() => Inertia::render('organization/main-streams/create'))->name('main-streams.create');
                Route::get('/main-streams/{id}/edit', fn($id) => Inertia::render('organization/main-streams/edit', ['id' => $id]))->name('main-streams.edit');

                Route::get('/streams', fn() => Inertia::render('organization/streams/index'))->name('streams');
                Route::get('/streams/create', fn() => Inertia::render('organization/streams/create'))->name('streams.create');
                Route::get('/streams/{id}/edit', fn($id) => Inertia::render('organization/streams/edit', ['id' => $id]))->name('streams.edit');

                Route::get('/sessions', fn() => Inertia::render('organization/sessions/index'))->name('sessions');
                Route::get('/sessions/create', fn() => Inertia::render('organization/sessions/create'))->name('sessions.create');
                Route::get('/sessions/{id}/edit', fn($id) => Inertia::render('organization/sessions/edit', ['id' => $id]))->name('sessions.edit');

                Route::get('/subject-category', fn() => Inertia::render('organization/subject-category/index'))->name('subject-category');
                Route::get('/subject-groups', fn() => Inertia::render('organization/subject-groups/index'))->name('subject-groups');
                Route::get('/subject', fn() => Inertia::render('organization/subject/index'))->name('subject');
                Route::get('/subject-category-mapping', fn() => Inertia::render('organization/subject-category-mapping/index'))->name('subject-category-mapping');
            });
        });

        // ==========================================================================
        // Accounts Room (Finance & Fees)
        // ==========================================================================
        Route::middleware(config('route_permissions.middleware.accounts_room'))->group(function () {
            Route::prefix('fee-payment')->name('fee-payment.')->group(function () {
                Route::get('/dashboard', fn() => Inertia::render('fee-payment/dashboard'))->name('dashboard');
                Route::get('/manage-fee-head', fn() => Inertia::render('fee-payment/manage-fee-head/index'))->name('manage-fee-head');
            });
            Route::prefix('fees')->name('fees.')->group(function () {
                Route::get('/fee-particulars', fn() => redirect('/accounts/fee-hub/fee-types'))->name('fee-particulars');
                Route::get('/heads', fn() => Inertia::render('fees/heads/index'))->name('heads');
                Route::get('/heads/create', fn() => Inertia::render('fees/heads/create'))->name('heads.create');
                Route::get('/heads/{id}/edit', fn($id) => Inertia::render('fees/heads/edit', ['id' => $id]))->name('fees.edit');

                Route::get('/payments', fn() => Inertia::render('fees/payments/index'))->name('payments');
                Route::get('/payments/{id}', fn($id) => Inertia::render('fees/payments/show', ['id' => $id]))->name('payments.show');
            });
            Route::prefix('accounts/fee-hub')->name('accounts.fee-hub.')->group(function () {
                Route::get('/analytics', fn() => Inertia::render('accounts/fee-hub/Analytics'))->name('analytics');
                Route::get('/fee-types', fn() => Inertia::render('accounts/fee-hub/FeeTypes'))->name('fee-types');
                Route::get('/profiles', fn() => Inertia::render('accounts/fee-hub/Profiles'))->name('profiles');
                Route::get('/profiles/create', fn() => Inertia::render('accounts/fee-hub/FeeProfileForm'))->name('profiles.create');
                Route::get('/profiles/{id}/edit', fn($id) => Inertia::render('accounts/fee-hub/FeeProfileForm', ['id' => (int) $id]))->name('profiles.edit');
                Route::get('/students', fn() => Inertia::render('accounts/fee-hub/StudentLedgers'))->name('students');
                Route::get('/regulations', fn() => Inertia::render('accounts/fee-hub/Regulations'))->name('regulations');
                Route::get('/regulations/{id}', fn($id) => Inertia::render('accounts/fee-hub/ClassRegulation', ['id' => (int) $id]))->name('regulations.show');
                Route::get('/collection-settings', fn() => Inertia::render('accounts/fee-hub/FeeCollectionSettings'))->name('collection-settings');
                Route::get('/dues', fn() => Inertia::render('accounts/fee-hub/DuesOverdue'))->name('dues');
                Route::get('/ad-hoc-charges', fn() => Inertia::render('accounts/fee-hub/AdHocCharges/index'))->name('ad-hoc-charges');
                Route::get('/configurations', fn() => redirect()->route('accounts.fee-hub.fee-types'))->name('configurations');
            });
            Route::get('/accounts/fee-hub', fn() => redirect()->route('accounts.fee-hub.fee-types'))->name('accounts.fee-hub');
        });

        // ==========================================================================
        // HR & Payroll
        // ==========================================================================
        Route::middleware(config('route_permissions.middleware.office_registry'))->group(function () {
            Route::prefix('hr/payroll')->name('hr.payroll.')->group(function () {
                Route::get('/', fn() => Inertia::render('hr/payroll/Dashboard'))->name('dashboard');
                Route::get('/components', fn() => Inertia::render('hr/payroll/Components'))->name('components');
                Route::get('/salary-structures', fn() => Inertia::render('hr/payroll/SalaryStructures'))->name('salary-structures');
                Route::get('/{payroll}', fn($payroll) => Inertia::render('hr/payroll/RunDetails', ['payrollId' => $payroll]))->name('run-details');
            });
            Route::prefix('hr')->name('hr.')->group(function () {
                Route::get('/attendance', fn() => Inertia::render('hr/attendance/StaffAttendance'))->name('attendance');
                Route::get('/leave-types', fn() => Inertia::render('hr/leave/LeaveTypes'))->name('leave-types');
                Route::get('/leave-requests', fn() => Inertia::render('hr/leave/LeaveRequests'))->name('leave-requests');
            });
        });

        // ==========================================================================
        // Expense Tracker (Outflows & Budgets)
        // ==========================================================================
        Route::middleware(config('route_permissions.middleware.expense_tracker'))->group(function () {
            Route::prefix('accounts/expenses')->name('accounts.expenses.')->group(function () {
                Route::get('/', fn() => Inertia::render('accounts/expenses/Dashboard'))->name('dashboard');
                Route::get('/records', fn() => Inertia::render('accounts/expenses/Records'))->name('records');
                Route::get('/categories', fn() => Inertia::render('accounts/expenses/Categories'))->name('categories');
            });
        });

        // ==========================================================================
        // Office Registry (Records & Personnel)
        // ==========================================================================
        Route::middleware(config('route_permissions.middleware.office_registry'))->group(function () {
            Route::prefix('students')->name('students.')->group(function () {
                Route::get('/analytics', fn() => Inertia::render('students/index'))->name('analytics');
                Route::get('/manage', fn() => Inertia::render('students/manage'))->name('manage');
                Route::get('/manage/{id}', fn($id) => Inertia::render('students/show', ['id' => $id]))->name('manage.show');
                Route::get('/manage/{id}/edit', fn($id) => Inertia::render('students/edit', ['id' => $id]))->name('manage.edit');
                Route::get('/candidate', fn() => Inertia::render('students/candidate'))->name('candidate');
            });
            Route::prefix('admin')->name('admin.')->group(function () {
                Route::get('/users', fn() => Inertia::render('admin/users/index'))->name('users');
                Route::get('/users/create', fn() => Inertia::render('admin/users/create'))->name('users.create');
                Route::get('/users/{id}/edit', fn($id) => Inertia::render('admin/users/edit', ['id' => $id]))->name('users.edit');
            });
        });

        // ==========================================================================
        // Admission Cell (Enrollment Desk)
        // ==========================================================================
        Route::middleware(config('route_permissions.middleware.admission_cell'))->group(function () {
            Route::prefix('admission')->name('admission.')->group(function () {
                Route::get('/stats', fn() => redirect()->route('analytics'))->name('stats');
                Route::get('/manage-course', fn() => Inertia::render('admission/manage-course'))->name('manage-course');

                Route::get('/heads', fn() => Inertia::render('admission/heads/index'))->name('heads');
                Route::get('/heads/create', fn() => Inertia::render('admission/heads/create'))->name('heads.create');
                Route::get('/heads/{id}', fn($id) => Inertia::render('admission/heads/show', ['id' => $id]))->name('heads.show');
                Route::get('/heads/{id}/edit', fn($id) => Inertia::render('admission/heads/edit', ['id' => $id]))->name('heads.edit');

                Route::get('/applications', fn() => Inertia::render('admission/applications/index'))->name('applications');
                Route::get('/applications/new/{step?}', fn($step = 'identity') => Inertia::render('admission/applications/new', ['step' => $step]))
                    ->where('step', 'identity|address-guardian|medical-documents|academic|services|payment|review')
                    ->name('applications.new');
                Route::get('/applications/{id}', fn($id) => Inertia::render('admission/applications/show', ['id' => $id]))->name('applications.show');
                Route::get('/applications/{id}/pay', fn($id) => Inertia::render('admission/applications/pay', ['id' => $id]))->name('applications.pay');

                Route::get('/promotions', fn() => Inertia::render('admission/promotions/index'))->name('promotions');
                Route::get('/readmissions', fn() => Inertia::render('admission/readmissions/index'))->name('readmissions');
                Route::get('/readmissions/new/{step?}', fn($step = 'identity') => Inertia::render('admission/readmissions/new', ['step' => $step]))
                    ->where('step', 'identity|address-guardian|medical-documents|academic|services|payment|review')
                    ->name('readmissions.new');
                Route::get('/analytics/promotions', fn() => Inertia::render('admission/analytics/PromotionAnalytics'))->name('analytics.promotions');
                Route::get('/analytics/readmissions', fn() => Inertia::render('admission/analytics/ReadmissionAnalytics'))->name('analytics.readmissions');
            });
        });

        // ==========================================================================
        // Service Branch (Verification & Certs)
        // ==========================================================================
        Route::middleware(config('route_permissions.middleware.service_branch'))->group(function () {
            Route::prefix('certificates')->name('certificates.')->group(function () {
                Route::get('/', fn() => Inertia::render('certificates/index'))->name('index');
                Route::get('/manage-certificate-head', fn() => Inertia::render('certificates/manage-certificate-head/index'))->name('manage-certificate-head');
                Route::get('/rules', fn() => Inertia::render('certificates/rules/index'))->name('manage-certificate-rules');

                Route::get('/types', fn() => Inertia::render('certificates/types/index'))->name('types');
                Route::get('/types/create', fn() => Inertia::render('certificates/types/create'))->name('types.create');
                Route::get('/types/{id}/edit', fn($id) => Inertia::render('certificates/types/edit', ['id' => $id]))->name('types.edit');

                Route::get('/applications', fn() => Inertia::render('certificates/applications/index'))->name('applications');
                Route::get('/applications/{id}', fn($id) => Inertia::render('certificates/applications/show', ['id' => $id]))->name('applications.show');

                // ID Cards
                Route::get('/id-cards', fn() => Inertia::render('certificates/id-cards/index'))->name('id-cards.index');
                Route::get('/id-cards/templates', fn() => Inertia::render('certificates/id-cards/templates'))->name('id-cards.templates.index');
                Route::get('/id-cards/templates/create', fn() => Inertia::render('certificates/id-cards/templates/create'))->name('id-cards.templates.create');
                Route::get('/id-cards/templates/{id}/edit', fn($id) => Inertia::render('certificates/id-cards/templates/edit', ['id' => (int) $id]))->name('id-cards.templates.edit');
                Route::get('/id-cards/generate', fn() => Inertia::render('certificates/id-cards/generate'))->name('id-cards.generate');
                Route::get('/id-cards/{id}', fn($id) => Inertia::render('certificates/id-cards/show', ['id' => (int) $id]))->name('id-cards.show');
            });
        });

        // ==========================================================================
        // Information & PR Hub (Website & Communications)
        // ==========================================================================
        Route::middleware(config('route_permissions.middleware.info_pr_hub'))->group(function () {
            Route::prefix('website')->name('website.')->group(function () {
                Route::get('/builder', fn() => Inertia::render('website/builder/index'))->name('builder');
                Route::get('/sliders', fn() => Inertia::render('website/sliders/index'))->name('sliders');
                Route::get('/tickers', fn() => Inertia::render('website/tickers/index'))->name('tickers');
                Route::get('/news', fn() => Inertia::render('website/news/index'))->name('news');
                Route::get('/galleries', fn() => Inertia::render('website/galleries/index'))->name('galleries');
                Route::get('/galleries/{id}', fn($id) => Inertia::render('website/galleries/manage', ['id' => $id]))->name('galleries.manage');
                Route::get('/faculties', fn() => Inertia::render('website/faculties/index'))->name('faculties');
            });
            Route::get('/notice-management', fn() => Inertia::render('students/notice-management'))->name('notice-management');
        });

        // ==========================================================================
        // Redressal Cell (Grievances & Support)
        // ==========================================================================
        Route::middleware(config('route_permissions.middleware.redressal_cell'))->group(function () {
            Route::prefix('grievances')->name('grievances.')->group(function () {
                Route::get('/', fn() => Inertia::render('grievances/index'))->name('index');
                Route::get('/feedback', fn() => Inertia::render('grievances/feedback/index'))->name('feedback');
                Route::get('/contacts', fn() => Inertia::render('grievances/contacts/index'))->name('contacts');
                Route::get('/support-ticket', fn() => Inertia::render('grievances/support-ticket/index'))->name('support-ticket');
                Route::get('/contacts/{id}', fn($id) => Inertia::render('grievances/contacts/show', ['id' => $id]))->name('contacts.show');
            });
        });

        // ==========================================================================
        // Inventory (Assets & Stock)
        // ==========================================================================
        Route::middleware(config('route_permissions.middleware.inventory'))->group(function () {
            Route::prefix('inventory')->name('inventory.')->group(function () {
                Route::get('/', fn() => Inertia::render('inventory/index'))->name('index');
                Route::get('/categories', fn() => Inertia::render('inventory/categories/index'))->name('categories.index');
                Route::get('/categories/create', fn() => Inertia::render('inventory/categories/create'))->name('categories.create');
                Route::get('/categories/{id}/edit', fn($id) => Inertia::render('inventory/categories/edit', ['id' => (int) $id]))->name('categories.edit');
                Route::get('/locations', fn() => Inertia::render('inventory/locations/index'))->name('locations.index');
                Route::get('/items', fn() => Inertia::render('inventory/items/index'))->name('items.index');
                Route::get('/items/create', fn() => Inertia::render('inventory/items/create'))->name('items.create');
                Route::get('/items/{id}', fn($id) => Inertia::render('inventory/items/show', ['id' => (int) $id]))->name('items.show');
                Route::get('/items/{id}/edit', fn($id) => Inertia::render('inventory/items/edit', ['id' => (int) $id]))->name('items.edit');
                Route::get('/movements', fn() => Inertia::render('inventory/movements/index'))->name('movements.index');
                Route::get('/reports/low-stock', fn() => Inertia::render('inventory/reports/low-stock'))->name('reports.low-stock');
                Route::get('/sales', fn() => Inertia::render('inventory/sales/index'))->name('sales.index');
                Route::get('/sales/create', fn() => Inertia::render('inventory/sales/create'))->name('sales.create');
                Route::get('/sales/{id}', fn($id) => Inertia::render('inventory/sales/show', ['id' => (int) $id]))->name('sales.show');
                Route::get('/sales/{id}/collect-payment', fn($id) => Inertia::render('inventory/sales/collect-payment', ['id' => (int) $id]))->name('sales.collect-payment');
            });
        });

        // ==========================================================================
        // Transport (Routes, Vehicles, Assignments)
        // ==========================================================================
        Route::middleware(config('route_permissions.middleware.transport'))->group(function () {
            Route::prefix('transport')->name('transport.')->group(function () {
                Route::get('/', fn() => Inertia::render('transport/index'))->name('index');
                Route::get('/stops', fn() => Inertia::render('transport/stops/index'))->name('stops.index');
                Route::get('/routes', fn() => Inertia::render('transport/routes/index'))->name('routes.index');
                Route::get('/routes/{id}', fn($id) => Inertia::render('transport/routes/show', ['id' => (int) $id]))->name('routes.show');
                Route::get('/vehicles', fn() => Inertia::render('transport/vehicles/index'))->name('vehicles.index');
                Route::get('/drivers', fn() => Inertia::render('transport/drivers/index'))->name('drivers.index');
                Route::get('/assignments', fn() => Inertia::render('transport/assignments/index'))->name('assignments.index');
                Route::get('/reports/manifest', fn() => Inertia::render('transport/reports/manifest'))->name('reports.manifest');
                Route::get('/reports/occupancy', fn() => Inertia::render('transport/reports/occupancy'))->name('reports.occupancy');
            });
        });

        // ==========================================================================
        // Hostel
        // ==========================================================================
        Route::middleware(config('route_permissions.middleware.hostel'))->group(function () {
            Route::prefix('hostel')->name('hostel.')->group(function () {
                Route::get('/', fn() => Inertia::render('hostel/index'))->name('index');
                Route::get('/hostels', fn() => Inertia::render('hostel/hostels/index'))->name('hostels.index');
                Route::get('/hostels/{id}', fn($id) => Inertia::render('hostel/hostels/show', ['id' => (int) $id]))->name('hostels.show');
                Route::get('/rooms', fn() => Inertia::render('hostel/rooms/index'))->name('rooms.index');
                Route::get('/allocations', fn() => Inertia::render('hostel/allocations/index'))->name('allocations.index');
                Route::get('/complaints', fn() => Inertia::render('hostel/complaints/index'))->name('complaints.index');
                Route::get('/mess-plans', fn() => Inertia::render('hostel/mess-plans/index'))->name('mess-plans.index');
            });
        });

        // ==========================================================================
        // Library (Books, Copies, Issue/Return)
        // ==========================================================================
        Route::middleware(config('route_permissions.middleware.library'))->group(function () {
            Route::prefix('library')->name('library.')->group(function () {
                Route::redirect('/', '/library/books')->name('index');
                Route::get('/books', fn() => Inertia::render('library/books/index'))->name('books.index');
                Route::get('/books/{id}', fn($id) => Inertia::render('library/books/show', ['id' => (int) $id]))->name('books.show');
                Route::get('/copies', fn() => Inertia::render('library/copies/index'))->name('copies.index');
                Route::get('/issues', fn() => Inertia::render('library/issues/index'))->name('issues.index');
                Route::get('/reports/overdue', fn() => Inertia::render('library/reports/overdue'))->name('reports.overdue');
            });
        });

        // ==========================================================================
        // Attendance (Mark & Reports – class-level and subject-level)
        // ==========================================================================
        Route::middleware(config('route_permissions.middleware.attendance'))->group(function () {
            Route::prefix('attendance')->name('attendance.')->group(function () {
                Route::get('/', fn() => Inertia::render('attendance/index'))->name('index');
                Route::get('/mark', fn() => Inertia::render('attendance/mark'))->name('mark');
                Route::get('/reports/daily', fn() => Inertia::render('attendance/reports/daily'))->name('reports.daily');
                Route::get('/reports/summary', fn() => Inertia::render('attendance/reports/summary'))->name('reports.summary');
            });
        });

        // ==========================================================================
        // LMS (Courses, Classrooms, Allocations)
        // ==========================================================================
        Route::middleware(config('route_permissions.middleware.lms'))->group(function () {
            Route::prefix('lms')->name('lms.')->group(function () {
                Route::get('/', fn() => Inertia::render('lms/index'))->name('index');
                Route::get('/courses', fn() => Inertia::render('lms/courses/index'))->name('courses.index');
                Route::get('/classes', fn() => Inertia::render('lms/classes/index'))->name('classes.index');
                Route::get('/classes/stream/{streamId}', fn($streamId) => Inertia::render('lms/classes/stream/index', ['streamId' => (int) $streamId]))->name('classes.stream')->whereNumber('streamId');
                Route::get('/classes/{id}', fn($id) => Inertia::render('lms/classes/subjects', ['id' => (int) $id, 'back_href' => '/lms/classes', 'back_label' => 'Back to Classes']))->name('classes.show');
                Route::get('/classes/{id}/subjects/{allocationId}', fn($id, $allocationId) => Inertia::render('lms/classes/subjects/show', ['id' => (int) $id, 'allocationId' => (int) $allocationId, 'back_href' => '/lms/classes/' . (int) $id, 'back_label' => 'Back to Class']))->name('classes.subjects.show')->whereNumber('allocationId');
                Route::get('/classes/{id}/rooms/{roomId}', fn($id, $roomId) => Inertia::render('lms/classes/rooms/show', ['id' => (int) $id, 'roomId' => $roomId]))->name('classes.rooms.show');
            });
        });

        // ==========================================================================
        // Question Bank (Repository)
        // ==========================================================================
        Route::middleware(config('route_permissions.middleware.question_bank'))->group(function () {

        });

        // ==========================================================================
        // Examination Cell
        // ==========================================================================
        Route::middleware(config('route_permissions.middleware.examination'))->group(function () {
            Route::prefix('examination')->name('examination.')->group(function () {
                // Dashboard / Index
                Route::get('/', fn() => redirect()->route('examination.exams.index'))->name('index');
                
                // Exams
                Route::get('/exams', [\App\Http\Controllers\Examination\ExamController::class, 'index'])->name('exams.index');
                Route::get('/exams/create', [\App\Http\Controllers\Examination\ExamController::class, 'create'])->name('exams.create');
                Route::post('/exams', [\App\Http\Controllers\Examination\ExamController::class, 'store'])->name('exams.store');
                Route::get('/exams/{exam}', [\App\Http\Controllers\Examination\ExamController::class, 'show'])->name('exams.show');
                Route::get('/exams/{exam}/edit', [\App\Http\Controllers\Examination\ExamController::class, 'edit'])->name('exams.edit');
                Route::put('/exams/{exam}', [\App\Http\Controllers\Examination\ExamController::class, 'update'])->name('exams.update');
                Route::patch('/exams/{exam}/publish', [\App\Http\Controllers\Examination\ExamController::class, 'togglePublish'])->name('exams.toggle-publish');
                Route::delete('/exams/{exam}', [\App\Http\Controllers\Examination\ExamController::class, 'destroy'])->name('exams.destroy');
                
                // Exam Schedules (standalone)
                Route::get('/schedules', [\App\Http\Controllers\Examination\ExamScheduleController::class, 'index'])->name('schedules.index');
                Route::get('/schedules/create', [\App\Http\Controllers\Examination\ExamScheduleController::class, 'create'])->name('schedules.create');
                Route::post('/schedules', [\App\Http\Controllers\Examination\ExamScheduleController::class, 'store'])->name('schedules.store');
                Route::get('/schedules/{schedule}/edit', [\App\Http\Controllers\Examination\ExamScheduleController::class, 'edit'])->name('schedules.edit');
                Route::put('/schedules/{schedule}', [\App\Http\Controllers\Examination\ExamScheduleController::class, 'update'])->name('schedules.update');
                Route::delete('/schedules/{schedule}', [\App\Http\Controllers\Examination\ExamScheduleController::class, 'destroy'])->name('schedules.destroy');
                
                // Grading Scales
                Route::get('/grading-scales', [\App\Http\Controllers\Examination\GradingScaleController::class, 'index'])->name('grading-scales.index');
                Route::get('/grading-scales/create', [\App\Http\Controllers\Examination\GradingScaleController::class, 'create'])->name('grading-scales.create');
                Route::post('/grading-scales', [\App\Http\Controllers\Examination\GradingScaleController::class, 'store'])->name('grading-scales.store');
                Route::get('/grading-scales/{scale}/edit', [\App\Http\Controllers\Examination\GradingScaleController::class, 'edit'])->name('grading-scales.edit');
                Route::put('/grading-scales/{scale}', [\App\Http\Controllers\Examination\GradingScaleController::class, 'update'])->name('grading-scales.update');
                Route::delete('/grading-scales/{scale}', [\App\Http\Controllers\Examination\GradingScaleController::class, 'destroy'])->name('grading-scales.destroy');
                
                // Marks Entry
                Route::get('/schedules/{schedule}/marks', [\App\Http\Controllers\Examination\MarksEntryController::class, 'showGrid'])->name('marks-entry.show');
                Route::post('/schedules/{schedule}/marks', [\App\Http\Controllers\Examination\MarksEntryController::class, 'saveBatch'])->name('marks-entry.save');
                
                // Marksheet Viewer
                Route::get('/exams/{exam}/marksheet/{student}', [\App\Http\Controllers\Examination\MarksheetController::class, 'show'])->name('marksheet.show');
                
                // Results & Bulk Print
                Route::get('/results', [\App\Http\Controllers\Examination\ExamResultController::class, 'listExams'])->name('results.list');
                Route::get('/exams/{exam}/results', [\App\Http\Controllers\Examination\ExamResultController::class, 'index'])->name('results.index');
                Route::post('/exams/{exam}/marksheets/bulk-print', [\App\Http\Controllers\Examination\ExamResultController::class, 'bulkPrint'])->name('marksheets.bulk-print');
                Route::post('/exams/{exam}/results/print-summary', [\App\Http\Controllers\Examination\ExamResultController::class, 'printSummary'])->name('results.print-summary');
                Route::post('/exams/{exam}/results/print-broadsheet', [\App\Http\Controllers\Examination\ExamResultController::class, 'printBroadsheet'])->name('results.print-broadsheet');
            });
        });


        // ==========================================================================
        // Admin Desk (Analytics & Audit – view_audit)
        // ==========================================================================
        Route::middleware(config('route_permissions.middleware.admin_desk'))->group(function () {
            Route::get('/analytics', fn() => Inertia::render('analytics/index'))->name('analytics');
            Route::get('/admin/audit-logs', fn() => Inertia::render('admin/audit-logs/index'))->name('admin.audit-logs');
            Route::get('/admin/analytics/import-logs', fn() => Inertia::render('admin/import-logs/index'))->name('admin.import-logs');
            Route::get('/admin/data-import', fn() => Inertia::render('admin/data-import/index'))->name('admin.data-import');
        });


        // ==========================================================================
        // Timetable & Scheduling
        // ==========================================================================
        Route::middleware(config('route_permissions.middleware.timetable'))->prefix('timetable')->name('timetable.')->group(function () {
            Route::get('/', [\App\Http\Controllers\Timetable\TimetablePageController::class, 'index'])->name('index');
            Route::get('/templates', [\App\Http\Controllers\Timetable\TimetablePageController::class, 'templates'])->name('templates');
            Route::get('/rooms', [\App\Http\Controllers\Timetable\TimetablePageController::class, 'rooms'])->name('rooms');
            Route::get('/daily', [\App\Http\Controllers\Timetable\TimetablePageController::class, 'daily'])->name('daily');
            Route::get('/substitutions', [\App\Http\Controllers\Timetable\TimetablePageController::class, 'substitutions'])->name('substitutions');
            Route::get('/{id}/builder', [\App\Http\Controllers\Timetable\TimetablePageController::class, 'builder'])->name('builder');
        });

        // ==========================================================================
        // My Organisation (Organisations & Institutes)
        // ==========================================================================
        Route::middleware(config('route_permissions.middleware.my_organisation'))->group(function () {
            Route::prefix('my-organisation')->name('my-organisation.')->group(function () {
                Route::get('/', fn() => Inertia::render('my-organisation/index'))->name('index');
                Route::get('/create', fn() => Inertia::render('my-organisation/create'))->name('create');
                Route::get('/institutions/create', [\App\Http\Controllers\Web\CreateInstitutionController::class, '__invoke'])->name('institutions.create');
            });
        });

        // ==========================================================================
        // System Console (Access & Governance)
        // ==========================================================================
        Route::middleware(config('route_permissions.middleware.system_console'))->group(function () {
            Route::prefix('admin')->name('admin.')->group(function () {
                Route::get('/roles', fn() => Inertia::render('admin/roles/index'))->name('roles');
                Route::get('/roles/create', fn() => Inertia::render('admin/roles/create'))->name('roles.create');
                Route::get('/roles/{id}/edit', fn($id) => Inertia::render('admin/roles/edit', ['id' => $id]))->name('roles.edit');

                Route::get('/workflows', fn() => Inertia::render('admin/workflows/index'))->name('workflows');
                Route::get('/workflows/create', fn() => Inertia::render('admin/workflows/create'))->name('workflows.create');
                Route::get('/workflows/{id}/edit', fn($id) => Inertia::render('admin/workflows/edit', ['id' => (int) $id]))->name('workflows.edit');
            });
        });

    });
});

require __DIR__ . '/settings.php';

require __DIR__ . '/student.php';
