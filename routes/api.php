<?php

use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group.
|
*/

Route::prefix(env('API_VERSION', 'v1'))->name('api.')->group(function () {

    // Public routes (no auth required) - Rate limited to prevent brute force
    Route::prefix('auth')->group(function () {
        Route::post('login', [\App\Http\Controllers\Api\V1\Auth\AuthController::class, 'login'])
            ->middleware('throttle:5,1'); // 5 attempts per minute
        Route::post('register', [\App\Http\Controllers\Api\V1\Auth\AuthController::class, 'register'])
            ->middleware('throttle:3,1'); // 3 attempts per minute
        Route::post('request-otp-login', [\App\Http\Controllers\Api\V1\Auth\AuthController::class, 'requestOtpLogin'])
            ->middleware('throttle:3,1'); // 3 attempts per minute (OTP limit)
        Route::post('verify-otp-login', [\App\Http\Controllers\Api\V1\Auth\AuthController::class, 'verifyOtpLogin'])
            ->middleware('throttle:5,1'); // 5 attempts per minute
        Route::post('verify-otp', [\App\Http\Controllers\Api\V1\Auth\AuthController::class, 'verifyOtp']);
        Route::post('verify-otp-and-set-password', [\App\Http\Controllers\Api\V1\Auth\AuthController::class, 'verifyOtpAndSetPassword']);
        Route::post('set-password-with-token', [\App\Http\Controllers\Api\V1\Auth\AuthController::class, 'setPasswordWithToken'])
            ->middleware('throttle:5,1'); // Generic verification: student, staff, etc.
    });

    Route::prefix('student-auth')->group(function () {
        Route::post('find-application', [\App\Http\Controllers\Api\V1\Auth\StudentAuthController::class, 'findApplication'])
            ->middleware('throttle:10,1'); // 10 attempts per minute
        Route::post('send-otp', [\App\Http\Controllers\Api\V1\Auth\StudentAuthController::class, 'sendOtp'])
            ->middleware('throttle:3,1'); // 3 attempts per minute (OTP limit)
        Route::post('register', [\App\Http\Controllers\Api\V1\Auth\StudentAuthController::class, 'register'])
            ->middleware('throttle:3,1'); // 3 attempts per minute
        Route::post('login', [\App\Http\Controllers\Api\V1\Auth\StudentAuthController::class, 'login'])
            ->middleware('throttle:5,1'); // 5 attempts per minute
        Route::post('forgot-password', [\App\Http\Controllers\Api\V1\Auth\StudentAuthController::class, 'forgotPassword'])
            ->middleware('throttle:3,1'); // 3 attempts per minute
        Route::post('reset-password', [\App\Http\Controllers\Api\V1\Auth\StudentAuthController::class, 'resetPassword'])
            ->middleware('throttle:5,1'); // 5 attempts per minute
        Route::post('request-otp-login', [\App\Http\Controllers\Api\V1\Auth\StudentAuthController::class, 'requestOtpLogin'])
            ->middleware('throttle:3,1');
        Route::post('verify-otp-login', [\App\Http\Controllers\Api\V1\Auth\StudentAuthController::class, 'verifyOtpLogin'])
            ->middleware('throttle:5,1');
    });

    Route::group(['prefix' => '/payments'], function () {

        // PayU Success/Failure Callback
        Route::post('/payu/callback', [App\Http\Controllers\Api\V1\Payment\PaymentController::class, 'handleCallback'])
            ->name('payment.payu.callback');
        // Future Gateways will be added here with their respective callbacks
        // Route::post('/sabpaisa/callback', [PaymentController::class, 'handleSabpaisaCallback']);
    });

    // ─── SMS & WhatsApp Provider Webhooks (public, no auth) ────
    Route::prefix('webhooks/sms')->group(function () {
        Route::post('msg91', [\App\Http\Controllers\Api\V1\Communications\SmsWebhookController::class, 'msg91']);
        Route::post('msg91-whatsapp', [\App\Http\Controllers\Api\V1\Communications\SmsWebhookController::class, 'msg91Whatsapp']);
    });
    // Public website endpoints
    Route::prefix('public')->name('public.')->group(function () {
        // Resilient: works when InstitutionLogoController is missing (e.g. older image)
        Route::get('institution-logo', function (\Illuminate\Http\Request $request) {
            if (class_exists(\App\Http\Controllers\Api\V1\Organization\InstitutionLogoController::class)) {
                return app()->call(\App\Http\Controllers\Api\V1\Organization\InstitutionLogoController::class);
            }
            abort(404);
        })->name('institution-logo');
        Route::get('sliders', [\App\Http\Controllers\Api\V1\Website\SliderController::class, 'publicIndex']);
        Route::get('sessions', [\App\Http\Controllers\Api\V1\Organization\SessionController::class, 'publicIndex']);
        Route::get('news', [\App\Http\Controllers\Api\V1\Website\NewsController::class, 'index']);
        Route::get('galleries', [\App\Http\Controllers\Api\V1\Website\GalleryController::class, 'index']);
        Route::post('contact', [\App\Http\Controllers\Api\V1\Grievance\ContactController::class, 'store']);

        Route::get('r2/asset', [\App\Http\Controllers\Api\V1\R2\R2Controller::class, 'streamAsset']);

        Route::post('grievances', [\App\Http\Controllers\Api\V1\Grievance\GrievanceController::class, 'publicStore']);
        Route::post('feedback', [\App\Http\Controllers\Api\V1\Grievance\FeedbackController::class, 'store']);

        // ID Card verification (public, no auth)
        Route::get('verify/id-card/{token}', [\App\Http\Controllers\Api\V1\IdCards\IdCardVerificationController::class, 'verify']);

    });


    Route::middleware(['auth'])->group(function () {

        // Auth (any authenticated user)
        Route::prefix('auth')->group(function () {
            Route::post('logout', [\App\Http\Controllers\Api\V1\Auth\AuthController::class, 'logout']);
            Route::get('me', [\App\Http\Controllers\Api\V1\Auth\AuthController::class, 'me']);
        });

        // Notifications (any authenticated user: list, mark read, push subscribe)
        Route::prefix('notifications')->name('notifications.')->group(function () {
            Route::get('/', [\App\Http\Controllers\Api\V1\Notifications\NotificationController::class, 'index']);
            Route::get('unread', [\App\Http\Controllers\Api\V1\Notifications\NotificationController::class, 'unread']);
            Route::post('{id}/read', [\App\Http\Controllers\Api\V1\Notifications\NotificationController::class, 'markAsRead']);
            Route::post('read-all', [\App\Http\Controllers\Api\V1\Notifications\NotificationController::class, 'markAllAsRead']);
            Route::get('channels/{type}', [\App\Http\Controllers\Api\V1\Notifications\NotificationController::class, 'channels']);
            Route::post('push/subscribe', [\App\Http\Controllers\Api\V1\Notifications\PushSubscriptionController::class, 'subscribe']);
            Route::post('push/unsubscribe', [\App\Http\Controllers\Api\V1\Notifications\PushSubscriptionController::class, 'unsubscribe']);
            // Dev only: send a test notification to the current user (for local real-time testing)
            if (config('app.debug')) {
                Route::post('test', function (\Illuminate\Http\Request $request) {
                    $request->user()->notify(new \App\Notifications\TestNotification('Test notification', 'Real-time notifications are working.'));
                    return response()->json(['message' => 'Test notification sent. Check your browser for the toast.']);
                })->name('test');
            }
        });

        // Admin API: role (admin) + permission groups from config/route_permissions.php.
        // Same permission keys as web routes; auth.permissions (shared to frontend) must include at least one key from the group for each route.
        // Groups used: office_registry, system_console, admin_desk, academic_setup, info_pr_hub, admission_cell, accounts_room, service_branch, redressal_cell.
        // R2 Storage (shared for profile uploads, documents, etc.)
        Route::get('r2/view-url', [\App\Http\Controllers\Api\V1\R2\R2Controller::class, 'viewUrl']);
        Route::get('r2/proxy', [\App\Http\Controllers\Api\V1\R2\R2Controller::class, 'proxy']);
        Route::post('r2/upload-url', [\App\Http\Controllers\Api\V1\R2\R2Controller::class, 'uploadUrl']);
        Route::post('r2/upload', [\App\Http\Controllers\Api\V1\R2\R2Controller::class, 'upload']);


        // ─── Redressal Cell (Support Tickets) ─────────────────────
        // Accessible by any user with redressal_cell permissions (Admins & Students)
        Route::middleware(config('route_permissions.middleware.redressal_cell'))->group(function () {
            Route::get('support/tickets', [\App\Http\Controllers\Api\V1\Support\SupportTicketController::class, 'index']);
            Route::post('support/tickets/create', [\App\Http\Controllers\Api\V1\Support\SupportTicketController::class, 'store']);
            Route::get('support/tickets/{id}', [\App\Http\Controllers\Api\V1\Support\SupportTicketController::class, 'show']);
            Route::post('support/tickets/{id}/reply', [\App\Http\Controllers\Api\V1\Support\SupportTicketController::class, 'postReply']);
            Route::post('support/tickets/{id}/close', [\App\Http\Controllers\Api\V1\Support\SupportTicketController::class, 'close']);
            Route::patch('support/tickets/{id}/priority', [\App\Http\Controllers\Api\V1\Support\SupportTicketController::class, 'updatePriority']);
        });

        // Admin API: role (admin) + permission groups from config/route_permissions.php.
        Route::middleware(config('route_permissions.middleware.admin'))->group(function () {

            // ─── Users & Registry ──────────────────────────────────────
            Route::middleware(config('route_permissions.middleware.office_registry'))->group(function () {
                Route::apiResource('users', \App\Http\Controllers\Api\V1\Auth\UserController::class);
                Route::post('users/{user}/roles', [\App\Http\Controllers\Api\V1\Auth\UserController::class, 'assignRole']);
                Route::delete('users/{user}/roles/{role}', [\App\Http\Controllers\Api\V1\Auth\UserController::class, 'removeRole']);

                // Staff Granular Permissions & Overrides
                Route::get('staff/{user}/permissions', [\App\Http\Controllers\Api\V1\Auth\StaffPermissionController::class, 'show']);
                Route::post('staff/{user}/workflows', [\App\Http\Controllers\Api\V1\Auth\StaffPermissionController::class, 'syncWorkflows']);
                Route::post('staff/{user}/overrides', [\App\Http\Controllers\Api\V1\Auth\StaffPermissionController::class, 'syncOverrides']);

                Route::post('staff/{staff}/resend-invitation', [\App\Http\Controllers\Api\V1\Staff\StaffController::class, 'resendInvitation']);
                Route::apiResource('staff', \App\Http\Controllers\Api\V1\Staff\StaffController::class);
            });

            // ─── Roles & Permissions (Console) ──────────────────────────
            Route::middleware(config('route_permissions.middleware.system_console'))->group(function () {
                Route::get('roles/custom', [\App\Http\Controllers\Api\V1\Auth\RoleController::class, 'customIndex']);
                Route::apiResource('roles', \App\Http\Controllers\Api\V1\Auth\RoleController::class);
                Route::post('roles/{role}/workflows', [\App\Http\Controllers\Api\V1\Auth\RoleController::class, 'syncWorkflows']);
                Route::post('roles/{role}/permissions', [\App\Http\Controllers\Api\V1\Auth\RoleController::class, 'syncPermissions']);

                Route::apiResource('workflows', \App\Http\Controllers\Api\V1\Auth\WorkflowController::class);
                Route::post('workflows/{workflow}/permissions', [\App\Http\Controllers\Api\V1\Auth\WorkflowController::class, 'syncPermissions']);

                Route::get('permissions', [\App\Http\Controllers\Api\V1\Auth\PermissionController::class, 'index']);
            });

            // ─── My Organisation (Organisations & Institutes) ───
            Route::middleware(config('route_permissions.middleware.my_organisation'))->group(function () {
                Route::get('organizations/{organization}/institutions', [\App\Http\Controllers\Api\V1\Organization\OrganizationController::class, 'institutions']);
                Route::apiResource('organizations', \App\Http\Controllers\Api\V1\Organization\OrganizationController::class);
                Route::apiResource('institutions', \App\Http\Controllers\Api\V1\Organization\InstitutionController::class);
            });

            // ─── Admin Desk (Analytics & Audit) ────────────────────────
            Route::middleware(config('route_permissions.middleware.admin_desk'))->group(function () {
                Route::get('dashboard-stats', [\App\Http\Controllers\Api\V1\Analytics\DashboardAnalyticsController::class, 'index']);
                Route::get('admission-analytics', [\App\Http\Controllers\Api\V1\Analytics\AdmissionAnalyticsController::class, 'index']);

                // Generic Analytics Engine
                Route::get('analytics/{type}', [\App\Http\Controllers\Api\V1\Analytics\AnalyticsController::class, 'show']);
                Route::get('reports/{type}', [\App\Http\Controllers\Api\V1\Reports\ReportController::class, 'show']);
                Route::get('reports/{type}/export', [\App\Http\Controllers\Api\V1\Reports\ReportController::class, 'export']);

                Route::get('audit-logs', [\App\Http\Controllers\Api\V1\Settings\AuditLogController::class, 'index']);
                Route::get('audit-logs/{auditLog}', [\App\Http\Controllers\Api\V1\Settings\AuditLogController::class, 'show']);
            });

            // ─── Bulk Data Import ──────────────────────────────────────
            Route::prefix('import')->group(function () {
                Route::get('modules', [\App\Http\Controllers\Api\V1\Organization\BulkImportController::class, 'modules']);
                Route::get('{module}/template', [\App\Http\Controllers\Api\V1\Organization\BulkImportController::class, 'downloadTemplate']);
                Route::post('{module}/upload', [\App\Http\Controllers\Api\V1\Organization\BulkImportController::class, 'upload']);
                Route::get('history', [\App\Http\Controllers\Api\V1\Organization\BulkImportController::class, 'history']);
                Route::get('{importLogId}/status', [\App\Http\Controllers\Api\V1\Organization\BulkImportController::class, 'status']);
            });

            // ─── Academic Setup ────────────────────────────────────────
            Route::middleware(config('route_permissions.middleware.academic_setup'))->group(function () {
                Route::patch('departments/{id}/toggle-status', [\App\Http\Controllers\Api\V1\Organization\DepartmentController::class, 'toggleStatus']);
                Route::apiResource('departments', \App\Http\Controllers\Api\V1\Organization\DepartmentController::class);
                Route::get('sessions/current', [\App\Http\Controllers\Api\V1\Organization\SessionController::class, 'current']);
                Route::get('sessions/suggested-years', [\App\Http\Controllers\Api\V1\Organization\SessionController::class, 'suggestedYears']);
                Route::patch('sessions/{id}/toggle-status', [\App\Http\Controllers\Api\V1\Organization\SessionController::class, 'toggleStatus']);
                Route::apiResource('sessions', \App\Http\Controllers\Api\V1\Organization\SessionController::class);
                Route::patch('main-streams/{id}/toggle-status', [\App\Http\Controllers\Api\V1\Organization\MainStreamController::class, 'toggleStatus']);
                Route::apiResource('main-streams', \App\Http\Controllers\Api\V1\Organization\MainStreamController::class);
                Route::patch('streams/{id}/toggle-status', [\App\Http\Controllers\Api\V1\Organization\StreamController::class, 'toggleStatus']);
                Route::apiResource('streams', \App\Http\Controllers\Api\V1\Organization\StreamController::class);
                Route::patch('subjects/{id}/toggle-status', [\App\Http\Controllers\Api\V1\Organization\SubjectController::class, 'toggleStatus']);
                Route::apiResource('subjects', \App\Http\Controllers\Api\V1\Organization\SubjectController::class);
                Route::apiResource('subject-categories', \App\Http\Controllers\Api\V1\Organization\SubjectCategoryController::class);
                Route::apiResource('subject-category-mappings', \App\Http\Controllers\Api\V1\Organization\SubjectCategoryMappingController::class);
                Route::apiResource('subject-groups', \App\Http\Controllers\Api\V1\Organization\SubjectGroupController::class);
            });

            // ─── Office Registry (Students & Staff) ───────────────────
            Route::middleware(config('route_permissions.middleware.office_registry'))->group(function () {
                Route::post('students/resend-verification', [\App\Http\Controllers\Api\V1\Student\StudentController::class, 'resendVerificationEmail']);
                Route::post('students/verification-link', [\App\Http\Controllers\Api\V1\Student\StudentController::class, 'getVerificationLink']);
                Route::get('students/candidates', [\App\Http\Controllers\Api\V1\Student\StudentController::class, 'candidates']);
                Route::get('students/list', [\App\Http\Controllers\Api\V1\Student\StudentController::class, 'getStudents']);
                Route::get('students/export', [\App\Http\Controllers\Api\V1\Student\StudentController::class, 'export']);

                Route::get('students/candidates/{id}/edit', [\App\Http\Controllers\Api\V1\Student\StudentController::class, 'editCandidate']);
                Route::put('students/candidates/{id}', [\App\Http\Controllers\Api\V1\Student\StudentController::class, 'updateCandidate']);
                Route::put('students/candidates/{id}/status', [\App\Http\Controllers\Api\V1\Student\StudentController::class, 'toggleCandidateStatus']);
                Route::put('students/{id}/services/stop', [\App\Http\Controllers\Api\V1\Student\StudentServicesController::class, 'stopService']);
                Route::apiResource('students', \App\Http\Controllers\Api\V1\Student\StudentController::class);
            });            // ─── Information & PR Hub ──────────────────────────────────
            Route::middleware(config('route_permissions.middleware.info_pr_hub'))->group(function () {
                Route::get('notices/{id}/edit', [\App\Http\Controllers\Api\V1\Notices\NoticeController::class, 'edit']);
                Route::patch('notices/{id}/toggle-status', [\App\Http\Controllers\Api\V1\Notices\NoticeController::class, 'toggleStatus']);
                Route::apiResource('notices', \App\Http\Controllers\Api\V1\Notices\NoticeController::class);
            });

            // ─── Admission Cell ────────────────────────────────────────
            Route::middleware(config('route_permissions.middleware.admission_cell'))->group(function () {
                Route::apiResource('admission-heads.fee-structures', \App\Http\Controllers\Api\V1\Admission\FeeStructureController::class)->shallow();
                Route::get('applications/re-admissions', [\App\Http\Controllers\Api\V1\Admission\ApplicationController::class, 'reAdmissions']);
                Route::get('applications/preview-fees', [\App\Http\Controllers\Api\V1\Admission\ApplicationController::class, 'previewFees']);
                Route::get('applications/{application}/invoice', [\App\Http\Controllers\Api\V1\Admission\ApplicationController::class, 'invoice'])->name('applications.invoice');
                Route::apiResource('applications', \App\Http\Controllers\Api\V1\Admission\ApplicationController::class);
                Route::post('applications/{application}/process', [\App\Http\Controllers\Api\V1\Admission\ApplicationController::class, 'process']);
                Route::post('applications/{application}/record-payment', [\App\Http\Controllers\Api\V1\Admission\ApplicationController::class, 'recordPayment']);

                //Admission verification
                Route::post('admission/verification/toggle-stream/{streamId}', [\App\Http\Controllers\Api\V1\Admission\AdmissionSettingsController::class, 'toggleStream']);
                Route::post('admission/verification/toggle-global', [\App\Http\Controllers\Api\V1\Admission\AdmissionSettingsController::class, 'toggleGlobal']);
                Route::get('admission/verification', [\App\Http\Controllers\Api\V1\Admission\AdmissionSettingsController::class, 'index']);
                Route::post('admission/verification/upload/{streamId}', [\App\Http\Controllers\Api\V1\Admission\AdmissionSettingsController::class, 'uploadExcel']);
                Route::get('admission/verification/download-sample', [\App\Http\Controllers\Api\V1\Admission\AdmissionSettingsController::class, 'downloadSample']);
                Route::get('admission/verification/export-stream', [\App\Http\Controllers\Api\V1\Admission\AdmissionSettingsController::class, 'exportByStream']);

                //Student verification
                Route::get('student/verification', [\App\Http\Controllers\Api\V1\Admission\StudentVerificationController::class, 'index']);
                Route::post('student/verification/toggle-global', [\App\Http\Controllers\Api\V1\Admission\StudentVerificationController::class, 'toggleGlobal']);
                Route::post('student/verification/toggle-stream/{streamId}', [\App\Http\Controllers\Api\V1\Admission\StudentVerificationController::class, 'toggleStream']);
                Route::post('student/verification/upload/{streamId}', [\App\Http\Controllers\Api\V1\Admission\StudentVerificationController::class, 'upload']);
                Route::get('student/verification/download-sample', [\App\Http\Controllers\Api\V1\Admission\StudentVerificationController::class, 'downloadSample']);
                Route::get('student/verification/export-stream', [\App\Http\Controllers\Api\V1\Admission\StudentVerificationController::class, 'exportByStream']);

                // ─── Promotions ────────────────────────────────────────────
                Route::prefix('promotions')->group(function () {
                    Route::get('eligible', [\App\Http\Controllers\Api\V1\Admission\PromotionController::class, 'eligible']);
                    Route::post('promote', [\App\Http\Controllers\Api\V1\Admission\PromotionController::class, 'promote']);
                    Route::post('bulk-promote', [\App\Http\Controllers\Api\V1\Admission\PromotionController::class, 'bulkPromote']);
                    Route::post('{transition}/rollback', [\App\Http\Controllers\Api\V1\Admission\PromotionController::class, 'rollback']);
                    Route::get('history', [\App\Http\Controllers\Api\V1\Admission\PromotionController::class, 'history']);
                });

                // ─── Re-Admissions ─────────────────────────────────────────
                Route::prefix('readmissions')->group(function () {
                    Route::get('eligible', [\App\Http\Controllers\Api\V1\Admission\ReadmissionController::class, 'eligible']);
                    Route::get('prefill/{studentProfile}', [\App\Http\Controllers\Api\V1\Admission\ReadmissionController::class, 'prefill']);
                    Route::get('preview-fees/{studentProfileId}', [\App\Http\Controllers\Api\V1\Admission\ReadmissionController::class, 'previewFees']);
                    Route::post('process', [\App\Http\Controllers\Api\V1\Admission\ReadmissionController::class, 'process']);
                    Route::post('bulk', [\App\Http\Controllers\Api\V1\Admission\ReadmissionController::class, 'bulk']);
                    Route::post('{transition}/rollback', [\App\Http\Controllers\Api\V1\Admission\ReadmissionController::class, 'rollback']);
                    Route::get('history', [\App\Http\Controllers\Api\V1\Admission\ReadmissionController::class, 'history']);
                });
            });

            // ─── Accounts Room ─────────────────────────────────────────
            Route::middleware(config('route_permissions.middleware.accounts_room'))->group(function () {
                Route::post('fee-types/restore-defaults', [\App\Http\Controllers\Api\V1\Fees\FeeTypeController::class, 'restoreDefaults']);
                Route::apiResource('fee-types', \App\Http\Controllers\Api\V1\Fees\FeeTypeController::class);
                Route::apiResource('fee-regulation-profiles', \App\Http\Controllers\Api\V1\Fees\FeeRegulationProfileController::class);
                Route::apiResource('fee-payments', \App\Http\Controllers\Api\V1\Fees\FeePaymentController::class);
                Route::post('fee-payments/{payment}/collect', [\App\Http\Controllers\Api\V1\Fees\FeePaymentController::class, 'collect']);

                // Monthly Ledger & Student Ledger Matrix
                Route::get('fees/ledger/monthly', [\App\Http\Controllers\Api\V1\Fees\MonthlyLedgerController::class, 'index']);
                Route::get('fees/ledger/student/{studentId}', [\App\Http\Controllers\Api\V1\Fees\StudentLedgerController::class, 'getMatrix']);
                Route::post('fees/ledger/collect', [\App\Http\Controllers\Api\V1\Fees\StudentLedgerController::class, 'collect']);
                Route::post('fees/ledger/collect-advance', [\App\Http\Controllers\Api\V1\Fees\StudentLedgerController::class, 'collectAdvance']);
                Route::post('fees/ledger/resend-receipt', [\App\Http\Controllers\Api\V1\Fees\StudentLedgerController::class, 'resendReceipt']);
                Route::post('fees/ledger/mark-as-paid', [\App\Http\Controllers\Api\V1\Fees\StudentLedgerController::class, 'markAsPaid']);
                Route::get('fees/ledger/download-receipt/{payment}', [\App\Http\Controllers\Api\V1\Fees\StudentLedgerController::class, 'downloadReceipt']);
                Route::get('fees/ad-hoc-charges', [\App\Http\Controllers\Api\V1\Fees\AdHocChargeController::class, 'index']);
                Route::post('fees/ad-hoc-charges', [\App\Http\Controllers\Api\V1\Fees\AdHocChargeController::class, 'store']);
                Route::delete('fees/ad-hoc-charges/{id}', [\App\Http\Controllers\Api\V1\Fees\AdHocChargeController::class, 'destroy']);

                // Fee collection workflow: settings, dues, overdue, send reminder
                Route::get('fees/collection-settings', [\App\Http\Controllers\Api\V1\Fees\FeeCollectionSettingsController::class, 'show']);
                Route::patch('fees/collection-settings', [\App\Http\Controllers\Api\V1\Fees\FeeCollectionSettingsController::class, 'update']);
                Route::get('fees/dues', [\App\Http\Controllers\Api\V1\Fees\FeeDuesController::class, 'index']);
                Route::get('fees/dues/overdue', [\App\Http\Controllers\Api\V1\Fees\FeeDuesController::class, 'overdue']);
                Route::post('fees/dues/send-reminder', [\App\Http\Controllers\Api\V1\Fees\FeeDuesController::class, 'sendReminder']);
            });

            // ─── Expenses Tracker ──────────────────────────────────────
            Route::middleware(config('route_permissions.middleware.expense_tracker'))->group(function () {
                Route::get('expenses/analytics', [\App\Http\Controllers\Api\V1\Expense\ExpenseController::class, 'analytics']);
                Route::post('expenses/{expense}/approve', [\App\Http\Controllers\Api\V1\Expense\ExpenseController::class, 'approve']);
                Route::post('expenses/{expense}/reject', [\App\Http\Controllers\Api\V1\Expense\ExpenseController::class, 'reject']);
                Route::apiResource('expenses', \App\Http\Controllers\Api\V1\Expense\ExpenseController::class);
                Route::apiResource('expense-categories', \App\Http\Controllers\Api\V1\Expense\ExpenseCategoryController::class);
                Route::apiResource('expense-budgets', \App\Http\Controllers\Api\V1\Expense\ExpenseBudgetController::class);
            });

            // ─── HR & Payroll ──────────────────────────────────────────
            Route::middleware(config('route_permissions.middleware.office_registry'))->group(function () {
                Route::prefix('hr')->name('hr.')->group(function () {
                    Route::apiResource('payrolls', \App\Http\Controllers\Api\V1\HR\PayrollController::class)->only(['index', 'destroy']);
                    Route::post('payrolls/generate', [\App\Http\Controllers\Api\V1\HR\PayrollController::class, 'generate'])->name('payrolls.generate');
                    Route::post('payrolls/{payroll}/mark-paid', [\App\Http\Controllers\Api\V1\HR\PayrollController::class, 'markPaid'])->name('payrolls.mark-paid');
                    Route::get('payrolls/{payroll}/payslips', [\App\Http\Controllers\Api\V1\HR\PayrollController::class, 'payslips'])->name('payrolls.payslips');
                    Route::get('payrolls/{payroll}/slips', [\App\Http\Controllers\Api\V1\HR\PayrollController::class, 'slips'])->name('payrolls.slips');
                    Route::get('payslips/staff/{userId}', [\App\Http\Controllers\Api\V1\HR\PayrollController::class, 'staffHistory'])->name('payslips.history');
                    Route::get('payslips/{payslip}/download', [\App\Http\Controllers\Api\V1\HR\PayrollController::class, 'downloadSlip'])->name('payslips.download');
                    Route::post('payslips/{payslip}/email', [\App\Http\Controllers\Api\V1\HR\PayrollController::class, 'emailSlip'])->name('payslips.email');
                    Route::put('payslips/{payslip}', [\App\Http\Controllers\Api\V1\HR\PayrollController::class, 'updatePayslip'])->name('payslips.update');

                    // Leave & Attendance
                    Route::apiResource('leave-types', \App\Http\Controllers\Api\V1\HR\LeaveTypeController::class);
                    Route::apiResource('leave-requests', \App\Http\Controllers\Api\V1\HR\LeaveRequestController::class)->except(['destroy', 'show']);
                    Route::patch('leave-requests/{leaveRequest}/status', [\App\Http\Controllers\Api\V1\HR\LeaveRequestController::class, 'updateStatus']);
                    
                    Route::get('staff-attendance/ledger', [\App\Http\Controllers\Api\V1\HR\StaffAttendanceController::class, 'ledger']);
                    Route::get('staff-attendance', [\App\Http\Controllers\Api\V1\HR\StaffAttendanceController::class, 'index']);
                    Route::post('staff-attendance', [\App\Http\Controllers\Api\V1\HR\StaffAttendanceController::class, 'mark']);
                    Route::get('salary-structures', [\App\Http\Controllers\Api\V1\HR\SalaryStructureController::class, 'index'])->name('salary-structures.index');
                    Route::post('salary-structures/{user}', [\App\Http\Controllers\Api\V1\HR\SalaryStructureController::class, 'storeOrUpdate'])->name('salary-structures.store');
                    Route::apiResource('payroll-components', \App\Http\Controllers\Api\V1\HR\PayrollComponentController::class);
                });
            });

            // ─── Service Branch ────────────────────────────────────────
            Route::middleware(config('route_permissions.middleware.service_branch'))->group(function () {
                Route::patch('certificate-heads/{id}/toggle-status', [\App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::class, 'toggleStatus']);
                Route::apiResource('certificate-heads', \App\Http\Controllers\Api\V1\Certificates\CertificateHeadController::class);
                Route::patch('certificate-applications/{id}/toggle-download', [\App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::class, 'toggleDownload']);
                Route::post('certificate-applications/{id}/process', [\App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::class, 'process']);
                Route::get('certificate-applications/{id}/edit', [\App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::class, 'edit']);

                Route::apiResource('certificate-applications', \App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::class);

                Route::post('certificate-applications/{application}/issue', [\App\Http\Controllers\Api\V1\Certificates\CertificateApplicationController::class, 'issue']);

                // ─── ID Cards ─────────────────────────────────────────
                Route::patch('id-card-templates/{id}/toggle-status', [\App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::class, 'toggleStatus']);
                Route::apiResource('id-card-templates', \App\Http\Controllers\Api\V1\IdCards\IdCardTemplateController::class);
                Route::post('id-cards/generate', [\App\Http\Controllers\Api\V1\IdCards\IdCardController::class, 'generate']);
                Route::get('id-cards/bulk-download', [\App\Http\Controllers\Api\V1\IdCards\IdCardController::class, 'bulkDownload']);
                Route::post('id-cards/{id}/regenerate', [\App\Http\Controllers\Api\V1\IdCards\IdCardController::class, 'regenerate']);
                Route::patch('id-cards/{id}/revoke', [\App\Http\Controllers\Api\V1\IdCards\IdCardController::class, 'revoke']);
                Route::get('id-cards/{id}/download', [\App\Http\Controllers\Api\V1\IdCards\IdCardController::class, 'download']);
                Route::apiResource('id-cards', \App\Http\Controllers\Api\V1\IdCards\IdCardController::class)->only(['index', 'show']);
            });

            // ─── Information & PR Hub (Website Content) ────────────────
            Route::middleware(config('route_permissions.middleware.info_pr_hub'))->group(function () {
                Route::prefix('website')->name('website.')->group(function () {
                    Route::post('galleries/bulk-store', [\App\Http\Controllers\Api\V1\Website\GalleryController::class, 'bulkStore']);
                    Route::put('galleries/{id}/bulk-update', [\App\Http\Controllers\Api\V1\Website\GalleryController::class, 'bulkUpdate']);
                    Route::patch('gallery-images/sort', [\App\Http\Controllers\Api\V1\Website\GalleryImageController::class, 'updateSorting']);
                    Route::patch('sliders/{slider}/toggle-status', [\App\Http\Controllers\Api\V1\Website\SliderController::class, 'toggleStatus']);

                    Route::apiResource('sliders', \App\Http\Controllers\Api\V1\Website\SliderController::class);
                    Route::apiResource('tickers', \App\Http\Controllers\Api\V1\Website\TickerController::class);
                    Route::patch('news/{news}/toggle-status', [\App\Http\Controllers\Api\V1\Website\NewsController::class, 'toggleStatus']);
                    Route::apiResource('news', \App\Http\Controllers\Api\V1\Website\NewsController::class);
                    Route::get('galleries/{gallery}/images', [\App\Http\Controllers\Api\V1\Website\GalleryImageController::class, 'index']);
                    Route::post('galleries/{gallery}/images', [\App\Http\Controllers\Api\V1\Website\GalleryImageController::class, 'store']);
                    Route::apiResource('galleries', \App\Http\Controllers\Api\V1\Website\GalleryController::class);
                    Route::apiResource('galleries/images', \App\Http\Controllers\Api\V1\Website\GalleryImageController::class)->shallow()->except(['index', 'store']);

                    // ─── Website Builder (themes & section manager) ────
                    Route::get('builder/themes', [\App\Http\Controllers\Api\WebsiteBuilderController::class, 'themes']);
                    Route::post('builder/themes/activate', [\App\Http\Controllers\Api\WebsiteBuilderController::class, 'activateTheme']);
                    Route::get('builder/sections/{page?}', [\App\Http\Controllers\Api\WebsiteBuilderController::class, 'sections']);
                    Route::post('builder/sections/{page}/reorder', [\App\Http\Controllers\Api\WebsiteBuilderController::class, 'reorderSections']);
                    Route::patch('builder/sections/{page}/{section}', [\App\Http\Controllers\Api\WebsiteBuilderController::class, 'toggleSection']);

                    // ─── Website Nav Config (footer, menu, links) ──────
                    Route::get('builder/nav', [\App\Http\Controllers\Api\WebsiteBuilderController::class, 'getNavConfig']);
                    Route::post('builder/nav', [\App\Http\Controllers\Api\WebsiteBuilderController::class, 'saveNavConfig']);
                });
            });

            // ─── Redressal Cell (Grievances & Feedback) ────────────────
            Route::middleware(config('route_permissions.middleware.redressal_cell'))->group(function () {
                Route::apiResource('grievances', \App\Http\Controllers\Api\V1\Grievance\GrievanceController::class);
                Route::post('grievances/{grievance}/resolve', [\App\Http\Controllers\Api\V1\Grievance\GrievanceController::class, 'resolve']);
                Route::apiResource('contacts', \App\Http\Controllers\Api\V1\Grievance\ContactController::class)->only(['index', 'show', 'destroy']);

                Route::apiResource('feedbacks', \App\Http\Controllers\Api\V1\Grievance\FeedbackController::class);
                Route::patch('feedbacks/{id}/toggle-read', [\App\Http\Controllers\Api\V1\Grievance\FeedbackController::class, 'toggleRead']);
            });

            // ─── System Console (Settings) ─────────────────────────────
            Route::middleware(config('route_permissions.middleware.system_console'))->group(function () {
                Route::get('settings', [\App\Http\Controllers\Api\V1\Settings\SettingController::class, 'index']);
                Route::get('settings/group/{group}', [\App\Http\Controllers\Api\V1\Settings\SettingController::class, 'getByGroup']);
                Route::post('settings/group/{group}', [\App\Http\Controllers\Api\V1\Settings\SettingController::class, 'updateByGroup']);
                Route::post('settings', [\App\Http\Controllers\Api\V1\Settings\SettingController::class, 'store']);
                Route::put('settings', [\App\Http\Controllers\Api\V1\Settings\SettingController::class, 'update']);
                Route::get('settings/{key}', [\App\Http\Controllers\Api\V1\Settings\SettingController::class, 'show']);

                Route::get('academic-calendar/settings', [\App\Http\Controllers\Api\V1\Organization\AcademicCalendarSettingsController::class, 'show']);
                Route::patch('academic-calendar/settings', [\App\Http\Controllers\Api\V1\Organization\AcademicCalendarSettingsController::class, 'update']);
            });



            // ─── Inventory ─────────────────────────────────────────────
            Route::middleware(config('route_permissions.middleware.inventory'))->prefix('inventory')->group(function () {
                Route::apiResource('categories', \App\Http\Controllers\Api\V1\Inventory\InventoryCategoryController::class)->parameters(['categories' => 'inventory_category']);
                Route::apiResource('locations', \App\Http\Controllers\Api\V1\Inventory\InventoryLocationController::class)->parameters(['locations' => 'inventory_location']);
                Route::apiResource('items', \App\Http\Controllers\Api\V1\Inventory\InventoryItemController::class)->parameters(['items' => 'inventory_item']);
                Route::get('movements', [\App\Http\Controllers\Api\V1\Inventory\InventoryMovementController::class, 'index']);
                Route::post('movements', [\App\Http\Controllers\Api\V1\Inventory\InventoryMovementController::class, 'store']);
                Route::get('movements/{inventory_movement}', [\App\Http\Controllers\Api\V1\Inventory\InventoryMovementController::class, 'show'])->whereNumber('inventory_movement');
                 Route::get('reports/low-stock/export', [\App\Http\Controllers\Api\V1\Inventory\InventoryReportController::class, 'exportLowStock']);
                Route::get('reports/low-stock', [\App\Http\Controllers\Api\V1\Inventory\InventoryReportController::class, 'lowStock']);
                Route::get('sales', [\App\Http\Controllers\Api\V1\Inventory\InventorySaleController::class, 'index']);
                Route::post('sales', [\App\Http\Controllers\Api\V1\Inventory\InventorySaleController::class, 'store']);
                Route::get('sales/{inventory_sale}', [\App\Http\Controllers\Api\V1\Inventory\InventorySaleController::class, 'show'])->whereNumber('inventory_sale');
                Route::get('sales/{inventory_sale}/receipt', [\App\Http\Controllers\Api\V1\Inventory\InventorySaleController::class, 'receipt'])->whereNumber('inventory_sale')->name('inventory.sales.receipt');
                Route::post('sales/{inventory_sale}/confirm', [\App\Http\Controllers\Api\V1\Inventory\InventorySaleController::class, 'confirm'])->whereNumber('inventory_sale');
            });

            // ─── Transport ─────────────────────────────────────────────
            Route::middleware(config('route_permissions.middleware.transport'))->prefix('transport')->group(function () {
                Route::apiResource('stops', \App\Http\Controllers\Api\V1\Transport\TransportStopController::class)->parameters(['stops' => 'transport_stop']);
                Route::apiResource('routes', \App\Http\Controllers\Api\V1\Transport\TransportRouteController::class)->parameters(['routes' => 'transport_route']);
                Route::get('routes/{transport_route}/stops', [\App\Http\Controllers\Api\V1\Transport\TransportRouteController::class, 'indexStops'])->whereNumber('transport_route');
                Route::post('routes/{transport_route}/stops', [\App\Http\Controllers\Api\V1\Transport\TransportRouteController::class, 'storeStop'])->whereNumber('transport_route');
                Route::put('routes/{transport_route}/stops', [\App\Http\Controllers\Api\V1\Transport\TransportRouteController::class, 'updateStops'])->whereNumber('transport_route');
                Route::delete('routes/{transport_route}/stops/{route_stop_id}', [\App\Http\Controllers\Api\V1\Transport\TransportRouteController::class, 'destroyStop'])->whereNumber('transport_route')->whereNumber('route_stop_id');
                Route::apiResource('drivers', \App\Http\Controllers\Api\V1\Transport\TransportDriverController::class)->parameters(['drivers' => 'transport_driver']);
                Route::apiResource('vehicles', \App\Http\Controllers\Api\V1\Transport\TransportVehicleController::class)->parameters(['vehicles' => 'transport_vehicle']);
                Route::get('assignments/export', [\App\Http\Controllers\Api\V1\Transport\TransportAssignmentController::class, 'export']);
                Route::apiResource('assignments', \App\Http\Controllers\Api\V1\Transport\TransportAssignmentController::class)->parameters(['assignments' => 'transport_assignment']);
                Route::get('reports/manifest', [\App\Http\Controllers\Api\V1\Transport\TransportReportController::class, 'manifest']);
                Route::get('reports/occupancy', [\App\Http\Controllers\Api\V1\Transport\TransportReportController::class, 'occupancy']);
            });

            // ─── Hostel ────────────────────────────────────────────────
            Route::middleware(config('route_permissions.middleware.hostel'))->prefix('hostel')->group(function () {
                Route::apiResource('hostels', \App\Http\Controllers\Api\V1\Hostel\HostelController::class);
                Route::apiResource('hostels.floors', \App\Http\Controllers\Api\V1\Hostel\HostelFloorController::class)->shallow();
                Route::get('rooms/export', [\App\Http\Controllers\Api\V1\Hostel\HostelRoomController::class, 'export']);
                Route::apiResource('rooms', \App\Http\Controllers\Api\V1\Hostel\HostelRoomController::class)->parameters(['rooms' => 'hostel_room'])->names('hostel.rooms');
                Route::apiResource('beds', \App\Http\Controllers\Api\V1\Hostel\HostelBedController::class)->parameters(['beds' => 'hostel_bed'])->only(['index', 'update', 'destroy']);
                Route::get('allocations/export', [\App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::class, 'export']);
                Route::apiResource('allocations', \App\Http\Controllers\Api\V1\Hostel\HostelAllocationController::class)->parameters(['allocations' => 'hostel_allocation']);
                Route::get('complaints/export', [\App\Http\Controllers\Api\V1\Hostel\HostelComplaintController::class, 'export']);
                Route::apiResource('complaints', \App\Http\Controllers\Api\V1\Hostel\HostelComplaintController::class)->parameters(['complaints' => 'hostel_complaint']);
                Route::get('mess-plans/export', [\App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::class, 'export']);
                Route::apiResource('mess-plans', \App\Http\Controllers\Api\V1\Hostel\HostelMessPlanController::class)->parameters(['mess-plans' => 'hostel_mess_plan']);
                Route::get('reports/occupancy', [\App\Http\Controllers\Api\V1\Hostel\HostelReportController::class, 'occupancy']);
                Route::get('reports/summary', [\App\Http\Controllers\Api\V1\Hostel\HostelReportController::class, 'summary']);
            });

            // ─── Library ─────────────────────────────────────────────
            Route::middleware(config('route_permissions.middleware.library'))->prefix('library')->group(function () {
                Route::apiResource('books', \App\Http\Controllers\Api\V1\Library\LibraryBookController::class)->parameters(['books' => 'library_book']);
                Route::apiResource('copies', \App\Http\Controllers\Api\V1\Library\LibraryCopyController::class)->parameters(['copies' => 'library_copy']);
                Route::apiResource('issues', \App\Http\Controllers\Api\V1\Library\LibraryIssueController::class)->parameters(['issues' => 'library_issue']);
                Route::post('issues/{library_issue}/return', [\App\Http\Controllers\Api\V1\Library\LibraryIssueController::class, 'returnBook'])->whereNumber('library_issue');
            });

            // ─── Attendance ─────────────────────────────────────────────
            Route::middleware(config('route_permissions.middleware.attendance'))->prefix('attendance')->group(function () {
                Route::get('classes', [\App\Http\Controllers\Api\V1\Attendance\AttendanceController::class, 'classes']);
                Route::get('classes/{lms_class_id}/allocations', [\App\Http\Controllers\Api\V1\Attendance\AttendanceController::class, 'allocationsForClass'])->whereNumber('lms_class_id');
                Route::get('daily', [\App\Http\Controllers\Api\V1\Attendance\AttendanceController::class, 'getDaily']);
                Route::post('daily', [\App\Http\Controllers\Api\V1\Attendance\AttendanceController::class, 'submitDaily']);
                Route::put('records/{id}', [\App\Http\Controllers\Api\V1\Attendance\AttendanceController::class, 'updateRecord'])->whereNumber('id');
                Route::delete('records/{id}', [\App\Http\Controllers\Api\V1\Attendance\AttendanceController::class, 'destroyRecord'])->whereNumber('id');
                Route::get('reports/daily', [\App\Http\Controllers\Api\V1\Attendance\AttendanceController::class, 'reportsDaily']);
                Route::get('reports/summary', [\App\Http\Controllers\Api\V1\Attendance\AttendanceController::class, 'reportsSummary']);
            });

            // ─── Timetable & Scheduling ──────────────────────────────
            Route::middleware(config('route_permissions.middleware.timetable'))->prefix('timetable')->group(function () {
                Route::apiResource('templates', \App\Http\Controllers\Api\V1\Timetable\TimetableTemplateController::class);
                Route::apiResource('rooms', \App\Http\Controllers\Api\V1\Timetable\RoomController::class);
                Route::post('timetables/{timetable}/entries', [\App\Http\Controllers\Api\V1\Timetable\TimetableController::class, 'saveEntries']);
                Route::post('timetables/{timetable}/publish', [\App\Http\Controllers\Api\V1\Timetable\TimetableController::class, 'publish']);
                Route::apiResource('timetables', \App\Http\Controllers\Api\V1\Timetable\TimetableController::class);
                Route::get('substitutions/candidates', [\App\Http\Controllers\Api\V1\Timetable\SubstitutionController::class, 'getCandidates']);



        }); // end check-role: admin only

        }); // end admin middleware group

        // ─── LMS (admin + student portal: view_lms_classes or view_my_lms_classes + enrollment) ───
        Route::middleware(config('route_permissions.middleware.lms'))->prefix('lms')->group(function () {
            Route::apiResource('courses', \App\Http\Controllers\Api\V1\Lms\LmsCourseController::class)->parameters(['courses' => 'lms_course']);
            Route::get('streams', [\App\Http\Controllers\Api\V1\Lms\LmsClassController::class, 'lmsStreams']);
            Route::post('classes/find-or-create-for-stream', [\App\Http\Controllers\Api\V1\Lms\LmsClassController::class, 'findOrCreateForStream']);
            Route::get('my-classes', [\App\Http\Controllers\Api\V1\Lms\LmsClassController::class, 'myClasses']);
            Route::get('classes/{lms_class}/allocations', [\App\Http\Controllers\Api\V1\Lms\LmsClassController::class, 'allocations']);
            Route::post('classes/{lms_class}/allocations', [\App\Http\Controllers\Api\V1\Lms\ClassSubjectAllocationController::class, 'storeForClass']);
            Route::put('allocations/{class_subject_allocation}', [\App\Http\Controllers\Api\V1\Lms\ClassSubjectAllocationController::class, 'update'])->whereNumber('class_subject_allocation');
            Route::delete('allocations/{class_subject_allocation}', [\App\Http\Controllers\Api\V1\Lms\ClassSubjectAllocationController::class, 'destroy'])->whereNumber('class_subject_allocation');
            Route::get('classes/{lms_class}/available-students', [\App\Http\Controllers\Api\V1\Lms\LmsClassEnrollmentController::class, 'availableStudents']);
            Route::get('classes/{lms_class}/fee-structures', [\App\Http\Controllers\Api\V1\Lms\LmsClassController::class, 'feeStructures']);
            Route::post('classes/{lms_class}/fee-structures', [\App\Http\Controllers\Api\V1\Lms\LmsClassController::class, 'syncFeeStructures']);
            Route::apiResource('classes', \App\Http\Controllers\Api\V1\Lms\LmsClassController::class)->parameters(['classes' => 'lms_class']);
            Route::get('classes/{lms_class}/enrollments', [\App\Http\Controllers\Api\V1\Lms\LmsClassEnrollmentController::class, 'index']);
            Route::post('classes/{lms_class}/enrollments', [\App\Http\Controllers\Api\V1\Lms\LmsClassEnrollmentController::class, 'store']);
            Route::delete('classes/{lms_class}/enrollments/{user_id}', [\App\Http\Controllers\Api\V1\Lms\LmsClassEnrollmentController::class, 'destroy'])->whereNumber('user_id');


            Route::get('classes/{lms_class_id}/assignments', [\App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::class, 'index']);
            Route::post('classes/{lms_class_id}/assignments', [\App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::class, 'store']);
            Route::get('classes/{lms_class_id}/assignments/{id}', [\App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::class, 'show']);
            Route::put('classes/{lms_class_id}/assignments/{id}', [\App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::class, 'update']);
            Route::delete('classes/{lms_class_id}/assignments/{id}', [\App\Http\Controllers\Api\V1\Lms\LmsAssignmentController::class, 'destroy']);
            Route::get('classes/{lms_class_id}/assignments/{assignment_id}/submissions', [\App\Http\Controllers\Api\V1\Lms\LmsAssignmentSubmissionController::class, 'index']);
            Route::post('classes/{lms_class_id}/assignments/{assignment_id}/submissions', [\App\Http\Controllers\Api\V1\Lms\LmsAssignmentSubmissionController::class, 'store']);
            Route::patch('classes/{lms_class_id}/assignments/{assignment_id}/submissions/{submission_id}', [\App\Http\Controllers\Api\V1\Lms\LmsAssignmentSubmissionController::class, 'update']);
            Route::get('classes/{lms_class_id}/tests', [\App\Http\Controllers\Api\V1\Lms\LmsTestController::class, 'index']);
            Route::post('classes/{lms_class_id}/tests', [\App\Http\Controllers\Api\V1\Lms\LmsTestController::class, 'store']);
            Route::get('classes/{lms_class_id}/tests/{id}', [\App\Http\Controllers\Api\V1\Lms\LmsTestController::class, 'show']);
            Route::put('classes/{lms_class_id}/tests/{id}', [\App\Http\Controllers\Api\V1\Lms\LmsTestController::class, 'update']);
            Route::delete('classes/{lms_class_id}/tests/{id}', [\App\Http\Controllers\Api\V1\Lms\LmsTestController::class, 'destroy']);

            // Test Questions
            Route::get('classes/{lms_class_id}/tests/{test_id}/questions', [\App\Http\Controllers\Api\V1\Lms\LmsTestQuestionController::class, 'index']);
            Route::post('classes/{lms_class_id}/tests/{test_id}/questions', [\App\Http\Controllers\Api\V1\Lms\LmsTestQuestionController::class, 'store']);
            Route::put('classes/{lms_class_id}/tests/{test_id}/questions/{id}', [\App\Http\Controllers\Api\V1\Lms\LmsTestQuestionController::class, 'update']);
            Route::delete('classes/{lms_class_id}/tests/{test_id}/questions/{id}', [\App\Http\Controllers\Api\V1\Lms\LmsTestQuestionController::class, 'destroy']);

            // Test Attempts
            Route::get('classes/{lms_class_id}/tests/{test_id}/attempts', [\App\Http\Controllers\Api\V1\Lms\LmsTestAttemptController::class, 'myAttempts']);
            Route::post('classes/{lms_class_id}/tests/{test_id}/attempts', [\App\Http\Controllers\Api\V1\Lms\LmsTestAttemptController::class, 'start']);
            Route::patch('classes/{lms_class_id}/tests/{test_id}/attempts/{id}/submit', [\App\Http\Controllers\Api\V1\Lms\LmsTestAttemptController::class, 'submit']);

            Route::get('classes/{lms_class_id}/live-sessions', [\App\Http\Controllers\Api\V1\Lms\LmsLiveSessionController::class, 'index']);
            Route::post('classes/{lms_class_id}/live-sessions', [\App\Http\Controllers\Api\V1\Lms\LmsLiveSessionController::class, 'store']);
            Route::get('classes/{lms_class_id}/live-sessions/{id}', [\App\Http\Controllers\Api\V1\Lms\LmsLiveSessionController::class, 'show']);
            Route::put('classes/{lms_class_id}/live-sessions/{id}', [\App\Http\Controllers\Api\V1\Lms\LmsLiveSessionController::class, 'update']);
            Route::delete('classes/{lms_class_id}/live-sessions/{id}', [\App\Http\Controllers\Api\V1\Lms\LmsLiveSessionController::class, 'destroy']);
            Route::get('classes/{lms_class_id}/recordings', [\App\Http\Controllers\Api\V1\Lms\LmsRecordingController::class, 'index']);
            Route::post('classes/{lms_class_id}/recordings', [\App\Http\Controllers\Api\V1\Lms\LmsRecordingController::class, 'store']);
            Route::get('classes/{lms_class_id}/recordings/{id}', [\App\Http\Controllers\Api\V1\Lms\LmsRecordingController::class, 'show']);
            Route::put('classes/{lms_class_id}/recordings/{id}', [\App\Http\Controllers\Api\V1\Lms\LmsRecordingController::class, 'update']);
            Route::delete('classes/{lms_class_id}/recordings/{id}', [\App\Http\Controllers\Api\V1\Lms\LmsRecordingController::class, 'destroy']);
            Route::get('classes/{lms_class_id}/announcements', [\App\Http\Controllers\Api\V1\Lms\LmsAnnouncementController::class, 'index']);
            Route::post('classes/{lms_class_id}/announcements', [\App\Http\Controllers\Api\V1\Lms\LmsAnnouncementController::class, 'store']);
            Route::get('classes/{lms_class_id}/announcements/{id}', [\App\Http\Controllers\Api\V1\Lms\LmsAnnouncementController::class, 'show']);
            Route::put('classes/{lms_class_id}/announcements/{id}', [\App\Http\Controllers\Api\V1\Lms\LmsAnnouncementController::class, 'update']);
            Route::delete('classes/{lms_class_id}/announcements/{id}', [\App\Http\Controllers\Api\V1\Lms\LmsAnnouncementController::class, 'destroy']);
            Route::get('classes/{lms_class_id}/materials', [\App\Http\Controllers\Api\V1\Lms\LmsMaterialController::class, 'index']);
            Route::post('classes/{lms_class_id}/materials', [\App\Http\Controllers\Api\V1\Lms\LmsMaterialController::class, 'store']);
            Route::get('classes/{lms_class_id}/materials/{id}', [\App\Http\Controllers\Api\V1\Lms\LmsMaterialController::class, 'show']);
            Route::put('classes/{lms_class_id}/materials/{id}', [\App\Http\Controllers\Api\V1\Lms\LmsMaterialController::class, 'update']);
            Route::delete('classes/{lms_class_id}/materials/{id}', [\App\Http\Controllers\Api\V1\Lms\LmsMaterialController::class, 'destroy']);
        });

        // ─── Routes accessible by any authenticated user (students, guardians, staff) ───

        // ─── Doubt Forum ─────────────────────────────────────────
        Route::prefix('doubts')->group(function () {
            Route::get('/', [\App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::class, 'index']);
            Route::post('/', [\App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::class, 'store']);
            Route::get('{id}', [\App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::class, 'show'])->whereNumber('id');
            Route::put('{id}', [\App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::class, 'update'])->whereNumber('id');
            Route::delete('{id}', [\App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::class, 'destroy'])->whereNumber('id');
            Route::post('{id}/replies', [\App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::class, 'storeReply'])->whereNumber('id');
            Route::patch('{id}/replies/{replyId}/accept', [\App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::class, 'acceptReply'])->whereNumber('id');
            Route::patch('{id}/resolve', [\App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::class, 'resolveThread'])->whereNumber('id');
            Route::patch('{id}/upvote', [\App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::class, 'upvoteThread'])->whereNumber('id');
            Route::patch('{id}/replies/{replyId}/upvote', [\App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::class, 'upvoteReply'])->whereNumber('id');
            Route::patch('{id}/pin', [\App\Http\Controllers\Api\V1\DoubtForum\DoubtForumController::class, 'togglePin'])->whereNumber('id');

        });

        // Profile (any authenticated user)
        Route::get('settings/profile', [\App\Http\Controllers\Settings\ProfileController::class, 'show']);
        Route::patch('settings/profile', [\App\Http\Controllers\Settings\ProfileController::class, 'update']);

        // ─── Communications & Alerts ─────────────────────────────
        Route::prefix('communications')->group(function () {
            // SMS
            Route::get('sms-logs', [\App\Http\Controllers\Api\V1\Communications\CommunicationsController::class, 'smsLogs']);
            Route::post('sms/send', [\App\Http\Controllers\Api\V1\Communications\CommunicationsController::class, 'sendSms']);
            Route::get('sms/stats', [\App\Http\Controllers\Api\V1\Communications\CommunicationsController::class, 'smsStats']);
            // WhatsApp
            Route::get('same-email-accounts', [\App\Http\Controllers\Api\V1\Guardian\GuardianController::class, 'sameEmailAccounts']);
            Route::post('link-account', [\App\Http\Controllers\Api\V1\Guardian\GuardianController::class, 'linkAccount']);
            Route::post('verify-link-account', [\App\Http\Controllers\Api\V1\Guardian\GuardianController::class, 'verifyLinkAccount']);
            Route::post('active-student', [\App\Http\Controllers\Api\V1\Guardian\GuardianController::class, 'setActiveStudent']);
            Route::post('clear-active-student', [\App\Http\Controllers\Api\V1\Guardian\GuardianController::class, 'clearActiveStudent']);
            Route::get('me', [\App\Http\Controllers\Api\V1\Guardian\GuardianController::class, 'me']);
        });

        // Students routes for auth and dashboard data (portal)
        Route::prefix('student-auth')->group(function () {
            Route::post('change-password', [\App\Http\Controllers\Api\V1\Auth\StudentAuthController::class, 'changePassword']);
            Route::post('logout', [\App\Http\Controllers\Api\V1\Auth\StudentAuthController::class, 'logout']);
        });

        Route::prefix('student')->group(function () {
            // Route::get('/dashboard-stats', [\App\Http\Controllers\Api\V1\StudentDashboard\StudentDashboardController::class, 'dashboardStats']);
            Route::get('profile', [\App\Http\Controllers\Api\V1\StudentDashboard\StudentProfileController::class, 'getProfile']);

            Route::get('applications', [\App\Http\Controllers\Api\V1\StudentDashboard\StudentDashboardController::class, 'myApplications']);

            Route::post('admission-form/submit', [\App\Http\Controllers\Api\V1\StudentDashboard\AdmissionSubmissionController::class, 'submitForm']);
            Route::get('/admission-applications/{id}/fee-preview', [\App\Http\Controllers\Api\V1\StudentDashboard\AdmissionSubmissionController::class, 'getFeePreview']);
            Route::get('/admission/{id}/download-receipt', [\App\Http\Controllers\Api\V1\StudentDashboard\AdmissionApplicationController::class, 'downloadReceipt']);

            Route::get('certificate/list', [\App\Http\Controllers\Api\V1\StudentDashboard\CertificateHeadController::class, 'getAvailableCertificates']);
            Route::get('certificate/details/{id}', [\App\Http\Controllers\Api\V1\StudentDashboard\CertificateHeadController::class, 'getCertificateDetails']);

            Route::post('certificate/submit', [\App\Http\Controllers\Api\V1\StudentDashboard\CertificateApplicationController::class, 'submitCertificateApplication']);
            Route::get('certificate/my-applications', [\App\Http\Controllers\Api\V1\StudentDashboard\CertificateApplicationController::class, 'myApplications']);

            // ID Card
            Route::get('id-card', [\App\Http\Controllers\Api\V1\StudentDashboard\StudentIdCardController::class, 'show']);
            Route::get('id-card/download', [\App\Http\Controllers\Api\V1\StudentDashboard\StudentIdCardController::class, 'download']);

            // Transactions
            Route::get('transactions', [\App\Http\Controllers\Api\V1\StudentDashboard\StudentTransactionController::class, 'index']);
            Route::get('financial-ledger', [\App\Http\Controllers\Api\V1\StudentDashboard\StudentFinancialLedgerController::class, 'index']);

            //Notices
            Route::get('notices', [\App\Http\Controllers\Api\V1\StudentDashboard\StudentNoticeController::class, 'index']);
            Route::get('notices/{id}', [\App\Http\Controllers\Api\V1\StudentDashboard\StudentNoticeController::class, 'show']);


            // Payload: { "id": 1, "type": "admission" }
            Route::post('/payment/initiate', [\App\Http\Controllers\Api\V1\Payment\PaymentController::class, 'initiate']);
        });
    }); // end auth middleware
}); // end api prefix
