<?php

use App\Models\LmsClass;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

// Student Login & Register Pages

Route::prefix('student-portal')->name('student.')->group(function () {
    Route::get('/register', fn() => Inertia::render('student-portal/auth/register'))->name('student-register');
});
Route::get('/payment/success', function () {
    return Inertia::render('payment/success', [
        'txn' => request()->query('txn')
    ]);
})->name('payment-success');

// Authenticated portal routes: role (candidate/student) + at least one permission from config route_permissions.portal
Route::middleware(['auth', 'verified'])->group(function () {

    Route::middleware(config('route_permissions.middleware.portal'))->prefix('student-portal')->name('student.')->group(function () {

        Route::get('/dashboard', function () {
            return redirect()->route('dashboard');
        })->name('student-dashboard');

        Route::get('/my-students', function () {
            return redirect()->route('student.student-dashboard');
        })->name('my-students');

        Route::get('/link-account/verify', function () {
            return Inertia::render('student-portal/link-account-verify', [
                'token' => request()->query('token'),
            ]);
        })->name('link-account-verify');

        Route::get('/tickets', function () {
            return Inertia::render('grievances/support-ticket/index');
        })->name('student-ticket');
        Route::get('/readmission', function () {
            return Inertia::render('student-portal/readmission/index');
        })->name('student-readmission');
        Route::get('/admission', function () {
            return Inertia::render('student-portal/admission/index');
        })->name('student-admission');
        Route::get('/my-applications', function () {
            return Inertia::render('admission/applications/index');
        })->name('student-applications');
        Route::get('/certificates', function () {
            return Inertia::render('student-portal/certificates/index');
        })->name('student-certificate');
        Route::get('/my-certificates', function () {
            return Inertia::render('student-portal/certificates/myCertificate');
        })->name('my-student-certificate');
        Route::get('/fees', function () {
            return Inertia::render('student-portal/fees/index');
        })->name('student-fees');
        Route::get('/fees/history', function () {
            return Inertia::render('student-portal/fees/history');
        })->name('student-fees-history');

        Route::get('/my-classes', function () {
            $user = Auth::user();
            if ($user->hasAbility('view_my_lms_classes')) {
                $classes = LmsClass::query()
                    ->where(function ($q) use ($user) {
                        $q->whereHas('enrollments', fn ($eq) => $eq->where('user_id', $user->id)->where('status', 'active'))
                            ->orWhereExists(function ($sub) use ($user) {
                                $sub->selectRaw(1)
                                    ->from('class_subject_allocations as csa')
                                    ->whereColumn('csa.stream_id', 'lms_classes.stream_id')
                                    ->whereColumn('csa.session_id', 'lms_classes.session_id')
                                    ->where('csa.instructor_id', $user->id);
                            });
                    })
                    ->orderBy('name', 'asc')
                    ->get(['id']);
                if ($classes->count() === 1) {
                    return Redirect::route('student.student-my-class-detail', ['id' => $classes->first()->id]);
                }
            }
            return Inertia::render('student-portal/my-classes/index');
        })->name('student-my-classes');
        Route::get('/my-classes/{id}', function () {
            $user = Auth::user();
            $backHref = '/student-portal/my-classes';
            $backLabel = 'Back to My Classes';

            if ($user && $user->hasAbility('view_my_lms_classes')) {
                $classesCount = LmsClass::query()
                    ->where(function ($q) use ($user) {
                        $q->whereHas('enrollments', fn ($eq) => $eq->where('user_id', $user->id)->where('status', 'active'))
                            ->orWhereExists(function ($sub) use ($user) {
                                $sub->selectRaw(1)
                                    ->from('class_subject_allocations as csa')
                                    ->whereColumn('csa.stream_id', 'lms_classes.stream_id')
                                    ->whereColumn('csa.session_id', 'lms_classes.session_id')
                                    ->where('csa.instructor_id', $user->id);
                            });
                    })
                    ->count();

                if ($classesCount === 1) {
                    $backHref = '/student-portal/dashboard';
                    $backLabel = 'Back to Dashboard';
                }
            }

            return Inertia::render('lms/classes/subjects', [
                'id' => (int) request()->route('id'),
                'back_href' => $backHref,
                'back_label' => $backLabel,
            ]);
        })->name('student-my-class-detail')->whereNumber('id');
        Route::get('/my-classes/{id}/subjects/{allocationId}', function () {
            $id = (int) request()->route('id');
            return Inertia::render('lms/classes/subjects/show', [
                'id' => $id,
                'allocationId' => (int) request()->route('allocationId'),
                'back_href' => '/student-portal/my-classes/' . $id,
                'back_label' => 'Back to Class',
            ]);
        })->name('student-my-class-subject')->whereNumber('id')->whereNumber('allocationId');
        Route::get('/my-classes/{id}/rooms/{roomId}', function () {
            return Inertia::render('lms/classes/rooms/show', [
                'id' => (int) request()->route('id'),
                'roomId' => (string) request()->route('roomId'),
                'portal' => 'student',
            ]);
        })->name('student-my-class-room')->whereNumber('id');

        Route::get('/exams/{exam}/marksheet', [\App\Http\Controllers\Examination\MarksheetController::class, 'studentView'])->name('student-marksheet');

    });
});