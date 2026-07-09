<?php

namespace App\Http\Controllers\Api\V1\Lms;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\LmsClass;
use App\Models\LmsClassEnrollment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LmsClassEnrollmentController extends BaseController
{
    /**
     * List enrollments for a class.
     * Allowed for: view_lms_classes, manage_lms_enrollments, or view_my_lms_classes when user can access this class (e.g. enrolled).
     */
    public function index(Request $request, LmsClass $lms_class): JsonResponse
    {
        $user = $request->user();
        $canView = $user->hasAbility('view_lms_classes')
            || $user->hasAbility('manage_lms_enrollments')
            || (LmsClass::userCanAccessForRead($user, $lms_class->id));

        if (!$canView) {
            return $this->forbidden('You do not have permission to view enrollments.');
        }

        $enrollments = $lms_class->enrollments()
            ->with(['user:id,name,email'])
            ->orderBy('role')
            ->orderBy('user_id')
            ->get()
            ->map(fn(LmsClassEnrollment $e) => [
                'id' => $e->id,
                'user_id' => $e->user_id,
                'user' => $e->user ? ['id' => $e->user->id, 'name' => $e->user->name, 'email' => $e->user->email] : null,
                'role' => $e->role,
                'status' => $e->status,
                'enrolled_at' => $e->enrolled_at?->toIso8601String(),
            ]);

        return $this->success($enrollments);
    }

    /**
     * Enroll a user in the class.
     */
    public function store(Request $request, LmsClass $lms_class): JsonResponse
    {
        if (!$request->user()->hasAbility('manage_lms_enrollments')) {
            return $this->forbidden('You do not have permission to manage enrollments.');
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'nullable|string|in:student,teacher|max:20',
            'status' => 'nullable|string|in:active,inactive|max:20',
        ]);

        $userId = (int) $validated['user_id'];
        $existing = LmsClassEnrollment::where('lms_class_id', $lms_class->id)->where('user_id', $userId)->first();
        if ($existing) {
            return $this->error('User is already enrolled in this class.', 422);
        }

        $enrollment = LmsClassEnrollment::create([
            'lms_class_id' => $lms_class->id,
            'user_id' => $userId,
            'role' => $validated['role'] ?? 'student',
            'status' => $validated['status'] ?? 'active',
        ]);

        $enrollment->load('user:id,name,email');

        return $this->created([
            'id' => $enrollment->id,
            'user_id' => $enrollment->user_id,
            'user' => $enrollment->user ? ['id' => $enrollment->user->id, 'name' => $enrollment->user->name, 'email' => $enrollment->user->email] : null,
            'role' => $enrollment->role,
            'status' => $enrollment->status,
            'enrolled_at' => $enrollment->enrolled_at?->toIso8601String(),
        ], 'Enrollment created successfully');
    }

    /**
     * Remove a user from the class.
     */
    public function destroy(Request $request, LmsClass $lms_class, int $user_id): JsonResponse
    {
        if (!$request->user()->hasAbility('manage_lms_enrollments')) {
            return $this->forbidden('You do not have permission to manage enrollments.');
        }

        $deleted = LmsClassEnrollment::where('lms_class_id', $lms_class->id)->where('user_id', $user_id)->delete();

        if (!$deleted) {
            return $this->error('Enrollment not found.', 404);
        }

        return $this->success(null, 'Enrollment removed successfully');
    }

    /**
     * List students not yet enrolled in the class.
     */
    public function availableStudents(Request $request, LmsClass $lms_class): JsonResponse
    {
        if (!$request->user()->hasAbility('manage_lms_enrollments')) {
            return $this->forbidden('You do not have permission to view available students.');
        }

        $users = \App\Services\UserQueryService::availableForClass(
            'student',
            $lms_class->id,
            $request->search,
            (int) config('ems.default_institution_id')
        );

        return $this->success($users);
    }
}
