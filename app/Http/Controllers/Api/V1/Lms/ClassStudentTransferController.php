<?php

namespace App\Http\Controllers\Api\V1\Lms;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\AttendanceRecord;
use App\Models\ClassSubjectAllocation;
use App\Models\LmsClass;
use App\Models\LmsClassEnrollment;
use App\Models\Session;
use App\Models\StudentProfile;
use App\Models\StudentTransition;
use App\Models\Subject;
use App\Support\InstitutionContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ClassStudentTransferController extends BaseController
{
    /**
     * Get transfer options for a classroom:
     * - Source class info
     * - Enrolled students list
     * - Available academic sessions for the institution
     * - Existing sections for the stream across sessions
     */
    public function options(Request $request, LmsClass $lms_class): JsonResponse
    {
        $user = $request->user();
        if (!LmsClass::userCanAccessForRead($user, $lms_class->id)) {
            return $this->forbidden('You do not have permission to view this classroom.');
        }

        $institutionId = (int) ($lms_class->institution_id ?? InstitutionContext::getActiveInstitutionId($user));

        // 1. Enrolled students
        $enrollments = LmsClassEnrollment::query()
            ->where('lms_class_id', $lms_class->id)
            ->where('role', 'student')
            ->where('status', 'active')
            ->with([
                'user:id,name,email,reg_no,mobile,photo_url,status',
                'user.studentProfile:id,user_id,stream_id,session_id,roll_no,enrollment_status',
            ])
            ->get();

        $students = $enrollments->map(function ($e) {
            $u = $e->user;
            $sp = $u?->studentProfile;
            return [
                'user_id' => $e->user_id,
                'name' => $u?->name ?? 'Unknown Student',
                'email' => $u?->email,
                'mobile' => $u?->mobile,
                'photo_url' => $u?->photo_url,
                'reg_no' => $u?->reg_no,
                'roll_no' => $sp?->roll_no,
                'enrolled_at' => $e->enrolled_at?->format('Y-m-d'),
            ];
        })->values();

        // 2. Academic sessions for this institution
        $sessions = Session::withoutGlobalScopes()
            ->where('institution_id', $institutionId)
            ->orderByDesc('is_current')
            ->orderByDesc('start_year')
            ->get(['id', 'name', 'start_year', 'end_year', 'is_current']);

        // 3. Existing classrooms for this stream across sessions
        $streamClasses = LmsClass::withoutGlobalScopes()
            ->where('institution_id', $institutionId)
            ->when($lms_class->stream_id, fn($q) => $q->where('stream_id', $lms_class->stream_id))
            ->with(['session:id,name,is_current'])
            ->withCount(['enrollments' => fn($q) => $q->where('status', 'active')->where('role', 'student')])
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'code' => $c->code,
                'section' => $c->section,
                'stream_id' => $c->stream_id,
                'session_id' => $c->session_id,
                'session_name' => $c->session?->name ?? 'No Session',
                'is_current_session' => (bool) ($c->session?->is_current ?? false),
                'active_students' => $c->enrollments_count,
            ]);

        return $this->success([
            'source_class' => [
                'id' => $lms_class->id,
                'name' => $lms_class->name,
                'code' => $lms_class->code,
                'section' => $lms_class->section,
                'stream_id' => $lms_class->stream_id,
                'stream_name' => $lms_class->stream?->name ?? $lms_class->name,
                'session_id' => $lms_class->session_id,
                'session_name' => $lms_class->session?->name ?? 'Academic Session',
                'enrolled_count' => $students->count(),
            ],
            'students' => $students,
            'sessions' => $sessions,
            'available_classes' => $streamClasses,
        ]);
    }

    /**
     * Transfer students between sections or sessions.
     */
    public function transfer(Request $request, LmsClass $lms_class): JsonResponse
    {
        $user = $request->user();
        if (!$user->hasAbility('manage_lms_enrollments') && !$user->hasAbility('edit_lms_classes') && !LmsClass::userCanAccessForRead($user, $lms_class->id)) {
            return $this->forbidden('You do not have permission to transfer students.');
        }

        $validated = $request->validate([
            'transfer_mode' => 'required|in:section,session',
            'student_user_ids' => 'required|array|min:1',
            'student_user_ids.*' => 'required|integer|exists:users,id',
            'target_class_id' => 'nullable|integer|exists:lms_classes,id',
            'target_session_id' => 'nullable|integer|exists:academic_sessions,id',
            'target_section' => 'nullable|string|max:20',
            'remarks' => 'nullable|string|max:500',
        ]);

        $institutionId = (int) ($lms_class->institution_id ?? InstitutionContext::getActiveInstitutionId($user));
        $transferMode = $validated['transfer_mode'];
        $studentUserIds = array_unique(array_map('intval', $validated['student_user_ids']));
        $remarks = $validated['remarks'] ?? null;

        // Resolve Target LmsClass
        $targetClass = null;

        if (!empty($validated['target_class_id'])) {
            $targetClass = LmsClass::withoutGlobalScopes()
                ->where('institution_id', $institutionId)
                ->find($validated['target_class_id']);

            if (!$targetClass) {
                return $this->error('The selected target class does not exist or does not belong to your institution.', 422);
            }
        } elseif (!empty($validated['target_section'])) {
            $targetSection = strtoupper(trim($validated['target_section']));
            $targetSessionId = $transferMode === 'session'
                ? (!empty($validated['target_session_id']) ? (int) $validated['target_session_id'] : null)
                : $lms_class->session_id;

            // Search for existing class with this stream, session, and section
            $targetClass = LmsClass::withoutGlobalScopes()
                ->where('institution_id', $institutionId)
                ->where('stream_id', $lms_class->stream_id)
                ->where(function ($q) use ($targetSessionId) {
                    if ($targetSessionId) {
                        $q->where('session_id', $targetSessionId);
                    } else {
                        $q->whereNull('session_id');
                    }
                })
                ->where('section', $targetSection)
                ->first();

            // If not found, create it automatically
            if (!$targetClass) {
                $stream = $lms_class->stream;
                $streamName = $stream ? $stream->name : 'Class';
                $name = $streamName . ' – Section ' . $targetSection;
                $words = preg_split('/\s+/', trim($name), -1, PREG_SPLIT_NO_EMPTY);
                $code = count($words) === 1
                    ? strtoupper(mb_substr($words[0], 0, 3)) . '-S' . $targetSection
                    : strtoupper(implode('', array_map(fn(string $w) => mb_substr($w, 0, 1), $words))) . '-S' . $targetSection;

                $targetClass = LmsClass::withoutGlobalScopes()->create([
                    'institution_id' => $institutionId,
                    'stream_id' => $lms_class->stream_id,
                    'session_id' => $targetSessionId,
                    'section' => $targetSection,
                    'name' => $name,
                    'code' => $code,
                    'status' => 1,
                    'created_by' => $user->id,
                ]);

                // Backfill subject allocations for the new class
                if ($targetClass->stream_id && $targetClass->session_id) {
                    $existingSubjectIds = ClassSubjectAllocation::withoutGlobalScopes()
                        ->where('institution_id', $institutionId)
                        ->where('stream_id', $targetClass->stream_id)
                        ->where('session_id', $targetClass->session_id)
                        ->pluck('subject_id');

                    $missingSubjectIds = Subject::withoutGlobalScope('institution_scope')
                        ->where('institution_id', $institutionId)
                        ->where('stream_id', $targetClass->stream_id)
                        ->where('status', 1)
                        ->whereNotIn('id', $existingSubjectIds)
                        ->pluck('id');

                    if ($missingSubjectIds->isNotEmpty()) {
                        $rows = $missingSubjectIds->map(fn ($subjectId) => [
                            'institution_id' => $institutionId,
                            'stream_id' => $targetClass->stream_id,
                            'session_id' => $targetClass->session_id,
                            'subject_id' => $subjectId,
                            'instructor_id' => null,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ])->toArray();
                        ClassSubjectAllocation::withoutGlobalScopes()->insert($rows);
                    }
                }
            }
        }

        if (!$targetClass) {
            return $this->error('Please select a target class or provide a target section letter.', 422);
        }

        if ($targetClass->id === $lms_class->id) {
            return $this->error('Target section is identical to the source section. Please select a different section or session.', 422);
        }

        // Perform Transfer within DB Transaction
        $transferredCount = 0;
        $now = now();

        DB::transaction(function () use (
            $lms_class,
            $targetClass,
            $studentUserIds,
            $transferMode,
            $remarks,
            $user,
            $institutionId,
            $now,
            &$transferredCount
        ) {
            foreach ($studentUserIds as $studentUserId) {
                // 1. Check or create enrollment in target class
                $targetEnrollment = LmsClassEnrollment::where('lms_class_id', $targetClass->id)
                    ->where('user_id', $studentUserId)
                    ->first();

                if ($targetEnrollment) {
                    $targetEnrollment->update([
                        'status' => 'active',
                        'role' => 'student',
                        'enrolled_at' => $now,
                    ]);
                } else {
                    LmsClassEnrollment::create([
                        'lms_class_id' => $targetClass->id,
                        'user_id' => $studentUserId,
                        'role' => 'student',
                        'status' => 'active',
                        'enrolled_at' => $now,
                    ]);
                }

                // 2. Delete source enrollment so student is exclusively in new section
                LmsClassEnrollment::where('lms_class_id', $lms_class->id)
                    ->where('user_id', $studentUserId)
                    ->delete();

                // 3. Update StudentProfile
                $profile = StudentProfile::withoutGlobalScopes()->where('user_id', $studentUserId)->first();
                if (!$profile) {
                    $profile = StudentProfile::withoutGlobalScopes()->create([
                        'user_id' => $studentUserId,
                        'institution_id' => $institutionId,
                        'stream_id' => $targetClass->stream_id,
                        'session_id' => $targetClass->session_id,
                        'enrollment_status' => 'active',
                    ]);
                } else {
                    $profileUpdates = [];
                    if ($transferMode === 'session' || ($targetClass->session_id && $profile->session_id !== $targetClass->session_id)) {
                        $profileUpdates['session_id'] = $targetClass->session_id;
                    }
                    if ($targetClass->stream_id && $profile->stream_id !== $targetClass->stream_id) {
                        $profileUpdates['stream_id'] = $targetClass->stream_id;
                    }
                    if (!empty($profileUpdates)) {
                        $profile->update($profileUpdates);
                    }
                }

                // 4. Update attendance records
                AttendanceRecord::withoutGlobalScopes()
                    ->where('lms_class_id', $lms_class->id)
                    ->where('user_id', $studentUserId)
                    ->update(['lms_class_id' => $targetClass->id]);

                // 5. Record StudentTransition Audit Log
                StudentTransition::withoutGlobalScopes()->create([
                    'institution_id' => $institutionId,
                    'student_profile_id' => $profile->id,
                    'user_id' => $studentUserId,
                    'type' => $transferMode === 'session' ? 'session_transfer' : 'section_transfer',
                    'from_session_id' => $lms_class->session_id ?? $profile->session_id,
                    'to_session_id' => $targetClass->session_id,
                    'from_class_id' => $lms_class->id,
                    'to_class_id' => $targetClass->id,
                    'status' => 'approved',
                    'remarks' => $remarks ?: ($transferMode === 'session'
                        ? "Transferred across academic sessions to {$targetClass->name}"
                        : "Section transfer to {$targetClass->name}"),
                    'processed_by' => $user->id,
                    'processed_at' => $now,
                ]);

                $transferredCount++;
            }
        });

        $targetClass->load('session:id,name');

        Log::info("Transferred {$transferredCount} students from Class {$lms_class->id} ({$lms_class->name}) to Class {$targetClass->id} ({$targetClass->name}) by user {$user->id}");

        return $this->success([
            'transferred_count' => $transferredCount,
            'target_class' => [
                'id' => $targetClass->id,
                'name' => $targetClass->name,
                'section' => $targetClass->section,
                'session_id' => $targetClass->session_id,
                'session_name' => $targetClass->session?->name,
            ],
        ], "Successfully transferred {$transferredCount} student(s) to {$targetClass->name}.");
    }
}
