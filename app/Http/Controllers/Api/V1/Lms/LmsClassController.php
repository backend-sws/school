<?php

namespace App\Http\Controllers\Api\V1\Lms;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\ClassSubjectAllocation;
use App\Models\LmsClass;
use App\Models\LmsClassEnrollment;
use App\Notifications\ClassUpdatedNotification;
use App\Traits\DispatchesRealtimeNotifications;
use App\Models\Stream;
use App\Models\Subject;
use App\Support\EffectiveStudentContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LmsClassController extends BaseController
{
    use DispatchesRealtimeNotifications;
    public function index(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_lms_classes')) {
            return $this->forbidden('You do not have permission to view LMS classes.');
        }

        $query = LmsClass::query()
            ->with([
                'stream:id,name,code,department_id',
                'stream.department:id,name,code',
                'lmsCourse:id,title,slug',
                'classSubjectAllocation:id,stream_id,subject_id,session_id,instructor_id',
                'session:id,name,start_year,end_year',
                'classTeacher:id,name,email',
            ])
            ->withCount('enrollments');

        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(COALESCE(code, \'\')) LIKE ?', [$search]);
            });
        }

        if ($request->filled('status')) {
            $query->where('status', (int) $request->status);
        }

        if ($request->filled('stream_id')) {
            $query->where('stream_id', (int) $request->stream_id);
        }

        if ($request->filled('department_id')) {
            $query->whereHas('stream', fn ($q) => $q->where('department_id', (int) $request->department_id));
        }

        if ($request->filled('lms_course_id')) {
            $query->where('lms_course_id', (int) $request->lms_course_id);
        }

        if ($request->filled('session_id')) {
            $query->where('session_id', (int) $request->session_id);
        }

        return $this->paginatedWithMap(
            $query->orderBy('name', 'asc')->paginate($request->input('per_page', 15)),
            'passthrough'
        );
    }

    /**
     * Classes the effective user is enrolled in (student portal or parent viewing a linked student).
     * When a parent has set active student context, returns that student's classes.
     */
    public function myClasses(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_my_lms_classes') && ! $request->user()->hasAbility('student_portal_classes')) {
            return $this->forbidden('You do not have permission to view your classes.');
        }

        $user = EffectiveStudentContext::getEffectiveUser($request->user());
        if (! $user) {
            return $this->error('No student context available.', 422);
        }
        $userId = $user->id;
        $query = LmsClass::query()
            ->where(function ($q) use ($userId) {
                $q->whereHas('enrollments', fn ($eq) => $eq->where('user_id', $userId)->where('status', 'active'))
                    ->orWhereExists(function ($sub) use ($userId) {
                        $sub->selectRaw(1)
                            ->from('class_subject_allocations as csa')
                            ->whereColumn('csa.stream_id', 'lms_classes.stream_id')
                            ->whereColumn('csa.session_id', 'lms_classes.session_id')
                            ->where('csa.instructor_id', $userId);
                    });
            })
            ->with([
                'stream:id,name,code',
                'session:id,name,start_year,end_year',
            ])
            ->orderBy('name', 'asc');

        return $this->paginatedWithMap($query->paginate($request->input('per_page', 15)), 'passthrough');
    }

    public function store(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('create_lms_classes')) {
            return $this->forbidden('You do not have permission to create LMS classes.');
        }

        $validated = $request->validate([
            'stream_id' => 'nullable|exists:streams,id',
            'lms_course_id' => 'nullable|exists:lms_courses,id',
            'class_subject_allocation_id' => 'nullable|exists:class_subject_allocations,id',
            'session_id' => 'nullable|exists:academic_sessions,id',
            'class_teacher_id' => 'nullable|exists:users,id',
            'section' => 'nullable|string|max:50',
            'name' => 'required|string|max:200',
            'code' => 'nullable|string|max:50',
            'status' => 'nullable|integer|min:0|max:255',
        ]);

        $validated['status'] = $validated['status'] ?? 1;
        $validated['created_by'] = $request->user()->id;

        $lmsClass = LmsClass::create($validated);

        if ($lmsClass->stream_id && $lmsClass->session_id) {
            $existingSubjectIds = ClassSubjectAllocation::withoutGlobalScopes()
                ->where('institution_id', $lmsClass->institution_id)
                ->where('stream_id', $lmsClass->stream_id)
                ->where('session_id', $lmsClass->session_id)
                ->pluck('subject_id');

            $missingSubjectIds = Subject::where('stream_id', $lmsClass->stream_id)
                ->where('status', 1)
                ->whereNotIn('id', $existingSubjectIds)
                ->pluck('id');

            if ($missingSubjectIds->isNotEmpty()) {
                $rows = $missingSubjectIds->map(fn ($subjectId) => [
                    'institution_id' => $lmsClass->institution_id,
                    'stream_id' => $lmsClass->stream_id,
                    'session_id' => $lmsClass->session_id,
                    'subject_id' => $subjectId,
                    'instructor_id' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ])->toArray();
                ClassSubjectAllocation::withoutGlobalScopes()->insert($rows);
            }
        }

        return $this->created(
            $lmsClass->load([
                'stream:id,name,code,department_id',
                'stream.department:id,name,code',
                'lmsCourse:id,title,slug',
                'session:id,name',
                'classTeacher:id,name,email',
            ]),
            'LMS class created successfully'
        );
    }

    public function show(Request $request, LmsClass $lms_class): JsonResponse
    {
        if (! LmsClass::userCanAccessForRead($request->user(), $lms_class->id)) {
            return $this->forbidden('You do not have permission to view this class.');
        }

        $lms_class->load([
            'stream:id,name,code,department_id',
            'stream.department:id,name,code',
            'lmsCourse:id,title,slug,description',
            'classSubjectAllocation.stream:id,name,code',
            'classSubjectAllocation.subject:id,name,code',
            'classSubjectAllocation.session:id,name',
            'classSubjectAllocation.instructor:id,name,email',
            'session:id,name,start_year,end_year',
            'createdBy:id,name',
            'classTeacher:id,name,email',
        ]);
        $lms_class->loadCount('enrollments');

        return $this->successWithMap($lms_class, 'passthrough');
    }

    public function update(Request $request, LmsClass $lms_class): JsonResponse
    {
        if (! $request->user()->hasAbility('update_lms_classes')) {
            return $this->forbidden('You do not have permission to update LMS classes.');
        }

        $validated = $request->validate([
            'stream_id' => 'nullable|exists:streams,id',
            'lms_course_id' => 'nullable|exists:lms_courses,id',
            'class_subject_allocation_id' => 'nullable|exists:class_subject_allocations,id',
            'session_id' => 'nullable|exists:academic_sessions,id',
            'class_teacher_id' => 'nullable|exists:users,id',
            'section' => 'nullable|string|max:50',
            'name' => 'sometimes|string|max:200',
            'code' => 'nullable|string|max:50',
            'status' => 'nullable|integer|min:0|max:255',
        ]);

        $lms_class->update($validated);

        $enrolledUsers = LmsClassEnrollment::query()
            ->where('lms_class_id', $lms_class->id)
            ->where('role', 'student')
            ->where('status', 'active')
            ->with('user')
            ->get()
            ->pluck('user')
            ->filter();
        if ($enrolledUsers->isNotEmpty()) {
            $this->notifyRealtimeMany($enrolledUsers, new ClassUpdatedNotification($lms_class->fresh()));
        }

        return $this->success(
            $lms_class->fresh([
                'stream:id,name,code,department_id',
                'stream.department:id,name,code',
                'lmsCourse:id,title,slug',
                'session:id,name',
                'classTeacher:id,name,email',
            ]),
            'LMS class updated successfully'
        );
    }

    public function destroy(Request $request, LmsClass $lms_class): JsonResponse
    {
        if (! $request->user()->hasAbility('delete_lms_classes')) {
            return $this->forbidden('You do not have permission to delete LMS classes.');
        }

        $lms_class->delete();

        return $this->success(null, 'LMS class deleted');
    }

    /**
     * List subject/room allocations for this class (same session + institution).
     * Used to show "subjects as rooms" when user clicks a class.
     * Backfills missing allocations so every active stream subject has one row for this session.
     */
    public function allocations(Request $request, LmsClass $lms_class): JsonResponse
    {
        if (! LmsClass::userCanAccessForRead($request->user(), $lms_class->id)) {
            return $this->forbidden('You do not have permission to view this class.');
        }

        $sessionId = $lms_class->session_id;
        if (! $sessionId) {
            return $this->success([]);
        }

        $institutionId = $lms_class->institution_id;
        $streamId = $lms_class->stream_id;

        // Backfill: ensure every active subject for this stream has an allocation for this session
        if ($streamId) {
            $existingSubjectIds = ClassSubjectAllocation::withoutGlobalScopes()
                ->where('institution_id', $institutionId)
                ->where('stream_id', $streamId)
                ->where('session_id', $sessionId)
                ->pluck('subject_id');

            $missingSubjectIds = Subject::withoutGlobalScope('institution_scope')
                ->where('institution_id', $institutionId)
                ->where('stream_id', $streamId)
                ->where('status', 1)
                ->whereNotIn('id', $existingSubjectIds)
                ->pluck('id');

            if ($missingSubjectIds->isNotEmpty()) {
                $rows = $missingSubjectIds->map(fn ($subjectId) => [
                    'institution_id' => $institutionId,
                    'stream_id' => $streamId,
                    'session_id' => $sessionId,
                    'subject_id' => $subjectId,
                    'instructor_id' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ])->toArray();
                ClassSubjectAllocation::withoutGlobalScopes()->insert($rows);
            }
        }

        $q = ClassSubjectAllocation::query()
            ->where('session_id', $sessionId)
            ->where('institution_id', $institutionId);

        if ($streamId) {
            $q->where('stream_id', $streamId);
        }

        $allocations = $q->with(['subject:id,name,code', 'instructor:id,name,email'])
            ->orderBy('subject_id')
            ->get()
            ->map(fn ($a) => [
                'id' => $a->id,
                'subject' => $a->subject ? ['id' => $a->subject->id, 'name' => $a->subject->name, 'code' => $a->subject->code] : null,
                'instructor' => $a->instructor ? ['id' => $a->instructor->id, 'name' => $a->instructor->name] : null,
            ]);

        return $this->success($allocations);
    }

    /**
     * Streams that have at least one LMS class, with class counts.
     * Used for the stream-cards landing page.
     */
    public function lmsStreams(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_lms_classes')) {
            return $this->forbidden('You do not have permission to view LMS classes.');
        }

        $sessionFilter = fn ($q) => $request->filled('session_id')
            ? $q->where('session_id', (int) $request->session_id)
            : $q;

        $query = Stream::query()
            ->withCount(['lmsClasses' => $sessionFilter])
            ->with('department:id,name,code')
            ->orderBy('name');

        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $searchBy = $request->input('search_by', 'name');
            $query->where(function ($q) use ($search, $searchBy) {
                if ($searchBy === 'code') {
                    $q->whereRaw('LOWER(COALESCE(code, \'\')) LIKE ?', [$search]);
                } else {
                    $q->whereRaw('LOWER(name) LIKE ?', [$search]);
                }
            });
        }

        return $this->paginatedWithMap($query->paginate($request->input('per_page', 20)), 'passthrough');
    }

    /**
     * Find-or-create an LMS class for a given stream.
     * Used by Fee Regulations to ensure every stream has at least one class configured.
     */
    public function findOrCreateForStream(Request $request): JsonResponse
    {
        $request->validate(['stream_id' => 'required|exists:streams,id']);

        $streamId = (int) $request->stream_id;
        $user = $request->user();
        $institutionId = $user->institution_id;

        // Try to find an existing LMS class for this stream
        $lmsClass = LmsClass::where('stream_id', $streamId)
            ->where('institution_id', $institutionId)
            ->first();

        if (! $lmsClass) {
            $stream = Stream::findOrFail($streamId);
            $lmsClass = LmsClass::create([
                'institution_id' => $institutionId,
                'stream_id' => $streamId,
                'name' => $stream->name,
                'code' => $stream->code,
                'status' => 1,
                'created_by' => $user->id,
            ]);
        }

        return $this->success(['id' => $lmsClass->id], 'Class resolved');
    }

    public function feeStructures(Request $request, LmsClass $lms_class): JsonResponse
    {
        if (! $request->user()->hasAbility('view_lms_classes')) {
            return $this->forbidden('You do not have permission to view LMS classes.');
        }

        $structures = \App\Models\FeeStructureRule::with('feeType')
            ->where('scope_type', \App\Models\FeeStructureRule::SCOPE_CLASS)
            ->where('scope_id', $lms_class->id)
            ->get();

        return $this->success($structures);
    }

    public function syncFeeStructures(Request $request, LmsClass $lms_class): JsonResponse
    {
        if (! $request->user()->hasAbility('update_lms_classes')) {
            return $this->forbidden('You do not have permission to update LMS classes.');
        }

        $validated = $request->validate([
            'structures' => 'array',
            'structures.*.fee_type_id' => 'required|exists:fee_types,id',
            'structures.*.amount' => 'required|numeric|min:0',
            'fee_slot' => 'nullable|string',
        ]);

        // Clear existing rules
        \App\Models\FeeStructureRule::where('scope_type', \App\Models\FeeStructureRule::SCOPE_CLASS)
            ->where('scope_id', $lms_class->id)
            ->delete();

        if (!empty($validated['structures'])) {
            // Create new rules
            foreach ($validated['structures'] as $structure) {
                \App\Models\FeeStructureRule::create([
                    'institution_id' => $lms_class->institution_id,
                    'fee_type_id' => $structure['fee_type_id'],
                    'amount' => $structure['amount'],
                    'scope_type' => \App\Models\FeeStructureRule::SCOPE_CLASS,
                    'scope_id' => $lms_class->id,
                    'fee_slot' => $validated['fee_slot'] ?? null,
                ]);
            }
        }

        return $this->success(null, 'Fee structures synced successfully');
    }
}
