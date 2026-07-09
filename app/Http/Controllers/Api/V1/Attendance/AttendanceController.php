<?php

namespace App\Http\Controllers\Api\V1\Attendance;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\AttendanceRecord;
use App\Models\ClassSubjectAllocation;
use App\Models\User;
use App\Notifications\AttendanceMarkedNotification;
use App\Traits\DispatchesRealtimeNotifications;
use App\Models\LmsClass;
use App\Models\LmsClassEnrollment;
use App\Models\Setting;
use App\Support\InstitutionContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AttendanceController extends BaseController
{
    use DispatchesRealtimeNotifications;
    /**
     * List classes the user can mark/view attendance for.
     * Scoped: class teacher sees only their classes; subject teacher sees classes with their allocations; staff with permission sees all.
     */
    public function classes(Request $request): JsonResponse
    {
        if (!$request->user()->hasAbility('view_attendance') && !$request->user()->hasAbility('mark_attendance')) {
            return $this->forbidden('You do not have permission to view or mark attendance.');
        }

        $user = $request->user();
        $institutionId = InstitutionContext::getActiveInstitutionId($user);
        if (!$institutionId) {
            return $this->error('No active institution.', 422);
        }

        $query = LmsClass::query()
            ->where('institution_id', $institutionId)
            ->with(['stream:id,name,code', 'session:id,name,start_year,end_year'])
            ->withCount(['enrollments' => fn($q) => $q->where('role', 'student')->where('status', 'active')]);

        if (!$user->hasAbility('view_attendance') && !$user->hasAbility('mark_attendance')) {
            $query->where(function ($q) use ($user) {
                $q->where('class_teacher_id', $user->id)
                    ->orWhereExists(function ($sub) use ($user) {
                        $sub->selectRaw(1)
                            ->from('class_subject_allocations as csa')
                            ->whereColumn('csa.stream_id', 'lms_classes.stream_id')
                            ->whereColumn('csa.session_id', 'lms_classes.session_id')
                            ->where('csa.instructor_id', $user->id);
                    });
            });
        }

        if ($request->filled('session_id')) {
            $query->where('session_id', (int) $request->session_id);
        }

        $perPage = $request->input('per_page', 50);
        if ($request->boolean('all')) {
            $classes = $query->orderBy('name')->get();
            return $this->success(['data' => $classes, 'meta' => ['total' => $classes->count()]]);
        }

        return $this->paginatedWithMap($query->orderBy('name')->paginate($perPage), 'passthrough');
    }

    /**
     * List subject allocations for a class (for subject-level marking).
     */
    public function allocationsForClass(Request $request, int $lms_class_id): JsonResponse
    {
        if (!$request->user()->hasAbility('view_attendance') && !$request->user()->hasAbility('mark_attendance')) {
            return $this->forbidden('You do not have permission to view or mark attendance.');
        }

        $class = LmsClass::find($lms_class_id);
        if (!$class || !$class->stream_id || !$class->session_id) {
            return $this->notFound('Class not found or has no stream/session.');
        }

        if (!$this->canUserAccessClassForAttendance($request->user(), $class)) {
            abort(403, 'You do not have access to this class for attendance.');
        }

        $query = ClassSubjectAllocation::query()
            ->where('stream_id', $class->stream_id)
            ->where('session_id', $class->session_id)
            ->where('institution_id', $class->institution_id)
            ->with(['subject:id,name,code', 'instructor:id,name,email']);

        if (!$request->user()->hasAbility('view_attendance') && !$request->user()->hasAbility('mark_attendance')) {
            $query->where('instructor_id', $request->user()->id);
        }

        $allocations = $query->orderBy('subject_id')->get();

        return $this->success($allocations->map(fn($a) => [
            'id' => $a->id,
            'subject' => $a->subject ? ['id' => $a->subject->id, 'name' => $a->subject->name, 'code' => $a->subject->code] : null,
            'instructor' => $a->instructor ? ['id' => $a->instructor->id, 'name' => $a->instructor->name] : null,
        ]));
    }

    /**
     * GET daily attendance: records for class + date (class-level or subject-level). If none, return skeleton from enrollments.
     * Permission: view_attendance (route middleware) + class/allocation access (authorizeClassOrAllocation).
     */
    public function getDaily(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user->hasAbility('view_attendance')) {
            return $this->forbidden('You do not have permission to view attendance.');
        }

        $validated = $request->validate([
            'lms_class_id' => 'required|exists:lms_classes,id',
            'date' => 'required|date',
            'level' => 'nullable|in:class,subject',
            'class_subject_allocation_id' => 'nullable|required_if:level,subject|exists:class_subject_allocations,id',
        ]);

        $lmsClassId = (int) $validated['lms_class_id'];
        $date = $validated['date'];
        $level = $validated['level'] ?? 'class';
        $csaId = isset($validated['class_subject_allocation_id']) ? (int) $validated['class_subject_allocation_id'] : null;

        $class = LmsClass::find($lmsClassId);
        if (!$class) {
            return $this->notFound('Class not found.');
        }
        $this->authorizeClassOrAllocation($user, $class, $csaId, 'view');

        if ($level === 'subject' && $csaId) {
            $allocation = ClassSubjectAllocation::find($csaId);
            if (!$allocation || $allocation->stream_id != $class->stream_id || $allocation->session_id != $class->session_id) {
                return $this->error('Allocation does not match class stream/session.', 422);
            }
        }

        $data = $this->fetchDailyData($lmsClassId, $date, $level, $csaId);

        return $this->success($this->buildDailyResponse($data['records'], $data['summary'], $level, $csaId));
    }

    private function buildDailyResponse($records, array $summary, string $level, ?int $csaId): array
    {
        return [
            'records' => $records->values()->all(),
            'summary' => $summary,
            'level' => $level,
            'class_subject_allocation_id' => $level === 'subject' ? $csaId : null,
        ];
    }

    private function fetchDailyData(int $lmsClassId, string $date, string $level, ?int $csaId): array
    {
        $students = LmsClassEnrollment::query()
            ->where('lms_class_id', $lmsClassId)
            ->where('role', 'student')
            ->where('status', 'active')
            ->with('user:id,name,email')
            ->get();

        $existing = AttendanceRecord::query()
            ->where('lms_class_id', $lmsClassId)
            ->forDate($date)
            ->when($level === 'class', fn($q) => $q->classLevel())
            ->when($level === 'subject' && $csaId, fn($q) => $q->where('class_subject_allocation_id', $csaId))
            ->get()
            ->keyBy('user_id');

        $records = $students->map(function ($enrollment) use ($existing, $date) {
            $rec = $existing->get($enrollment->user_id);
            return [
                'id' => $rec?->id,
                'user_id' => $enrollment->user_id,
                'user_name' => $enrollment->user?->name ?? '',
                'status' => $rec?->status ?? 'present', // Default to present
                'remarks' => $rec?->remarks,
                'date' => $date,
            ];
        });

        $summary = [
            'present' => $records->where('status', 'present')->count(),
            'absent' => $records->where('status', 'absent')->count(),
            'late' => $records->where('status', 'late')->count(),
            'leave' => $records->where('status', 'leave')->count(),
            'holiday' => $records->where('status', 'holiday')->count(),
            'total' => $records->count(),
        ];

        return ['records' => $records, 'summary' => $summary];
    }

    /**
     * POST daily attendance: upsert records (class-level or subject-level).
     */
    public function submitDaily(Request $request): JsonResponse
    {
        if (!$request->user()->hasAbility('mark_attendance')) {
            return $this->forbidden('You do not have permission to mark attendance.');
        }

        $validated = $request->validate([
            'lms_class_id' => 'required|exists:lms_classes,id',
            'date' => 'required|date',
            'level' => 'required|in:class,subject',
            'class_subject_allocation_id' => 'nullable|required_if:level,subject|exists:class_subject_allocations,id',
            'records' => 'required|array',
            'records.*.user_id' => 'required|exists:users,id',
            'records.*.status' => 'required|string|in:present,absent,late,leave,holiday',
            'records.*.remarks' => 'nullable|string|max:255',
        ]);

        $class = LmsClass::find($validated['lms_class_id']);
        if (!$class) {
            return $this->notFound('Class not found.');
        }
        $csaId = $validated['level'] === 'subject' && isset($validated['class_subject_allocation_id'])
            ? (int) $validated['class_subject_allocation_id']
            : null;
        $this->authorizeClassOrAllocation($request->user(), $class, $csaId, 'mark');

        if ($csaId) {
            $allocation = ClassSubjectAllocation::find($csaId);
            if (!$allocation || $allocation->stream_id != $class->stream_id || $allocation->session_id != $class->session_id) {
                return $this->error('Allocation does not match class stream/session.', 422);
            }
        }

        $institutionId = $class->institution_id;
        $date = $validated['date'];
        $markedBy = $request->user()->id;
        $records = $validated['records'];

        // Ensure each user_id is an active student in this class
        $enrolledUserIds = LmsClassEnrollment::query()
            ->where('lms_class_id', $class->id)
            ->where('role', 'student')
            ->where('status', 'active')
            ->pluck('user_id')
            ->all();
        foreach ($records as $r) {
            if (!in_array((int) $r['user_id'], $enrolledUserIds, true)) {
                return $this->error('User ' . $r['user_id'] . ' is not an active student in this class.', 422);
            }
        }

        DB::transaction(function () use ($institutionId, $class, $csaId, $date, $markedBy, $records) {
            foreach ($records as $r) {
                $userId = (int) $r['user_id'];
                $status = $r['status'];
                $remarks = $r['remarks'] ?? null;

                AttendanceRecord::updateOrCreate(
                    [
                        'lms_class_id' => $class->id,
                        'class_subject_allocation_id' => $csaId, // null or number
                        'user_id' => $userId,
                        'date' => $date,
                    ],
                    [
                        'institution_id' => $institutionId,
                        'status' => $status,
                        'marked_by' => $markedBy,
                        'remarks' => $remarks,
                    ]
                );
            }
        });

        $className = $class->name ?? null;
        foreach ($records as $r) {
            $user = User::find((int) $r['user_id']);
            if ($user) {
                $this->notifyRealtime($user, new AttendanceMarkedNotification($date, $r['status'], $className));
            }
        }

        return $this->success(null, 'Attendance saved successfully.');
    }

    /**
     * Update a single attendance record.
     */
    public function updateRecord(Request $request, int $id): JsonResponse
    {
        if (!$request->user()->hasAbility('update_attendance')) {
            return $this->forbidden('You do not have permission to update attendance.');
        }

        $record = AttendanceRecord::find($id);
        if (!$record) {
            return $this->notFound('Attendance record not found.');
        }
        $this->authorizeClassOrAllocation($request->user(), $record->lmsClass, $record->class_subject_allocation_id, 'update');

        $validated = $request->validate([
            'status' => 'sometimes|string|in:present,absent,late,leave,holiday',
            'remarks' => 'nullable|string|max:255',
        ]);

        $record->update($validated);
        $user = User::find($record->user_id);
        if ($user) {
            $this->notifyRealtime($user, new AttendanceMarkedNotification(
                $record->date,
                $record->status,
                $record->lmsClass?->name
            ));
        }

        return $this->successWithMap($record->fresh(), 'passthrough', 'Record updated.');
    }

    /**
     * Delete an attendance record.
     */
    public function destroyRecord(Request $request, int $id): JsonResponse
    {
        if (!$request->user()->hasAbility('delete_attendance')) {
            return $this->forbidden('You do not have permission to delete attendance.');
        }

        $record = AttendanceRecord::find($id);
        if (!$record) {
            return $this->notFound('Attendance record not found.');
        }
        $this->authorizeClassOrAllocation($request->user(), $record->lmsClass, $record->class_subject_allocation_id, 'delete');

        $record->delete();

        return $this->success(null, 'Record deleted.');
    }

    /**
     * Reports: daily register.
     */
    public function reportsDaily(Request $request): JsonResponse
    {
        if (!$request->user()->hasAbility('view_attendance') && !$request->user()->hasAbility('view_attendance_reports')) {
            return $this->forbidden('You do not have permission to view attendance reports.');
        }

        $validated = $request->validate([
            'lms_class_id' => 'required|exists:lms_classes,id',
            'date' => 'required|date',
            'level' => 'nullable|in:class,subject',
            'class_subject_allocation_id' => 'nullable|exists:class_subject_allocations,id',
        ]);

        $class = LmsClass::find($validated['lms_class_id']);
        if (!$class) {
            return $this->notFound('Class not found.');
        }
        if (!$this->canUserAccessClassForAttendance($request->user(), $class)) {
            abort(403, 'You do not have access to this class for attendance.');
        }

        $level = $validated['level'] ?? 'class';
        $csaId = isset($validated['class_subject_allocation_id']) ? (int) $validated['class_subject_allocation_id'] : null;
        $data = $this->fetchDailyData((int) $validated['lms_class_id'], $validated['date'], $level, $csaId);

        return $this->success($this->buildDailyResponse($data['records'], $data['summary'], $level, $csaId));
    }

    /**
     * Reports: summary (aggregated counts and percentage).
     */
    public function reportsSummary(Request $request): JsonResponse
    {
        if (!$request->user()->hasAbility('view_attendance') && !$request->user()->hasAbility('view_attendance_reports')) {
            return $this->forbidden('You do not have permission to view attendance reports.');
        }

        $validated = $request->validate([
            'lms_class_id' => 'nullable|exists:lms_classes,id',
            'user_id' => 'nullable|exists:users,id',
            'session_id' => 'nullable|exists:academic_sessions,id',
            'from_date' => 'required|date',
            'to_date' => 'required|date|after_or_equal:from_date',
            'level' => 'nullable|in:class,subject',
        ]);

        $user = $request->user();
        $institutionId = InstitutionContext::getActiveInstitutionId($user);
        if (!$institutionId) {
            return $this->error('No active institution.', 422);
        }

        $query = AttendanceRecord::query()
            ->where('institution_id', $institutionId)
            ->whereBetween('date', [$validated['from_date'], $validated['to_date']])
            ->when(isset($validated['level']) && $validated['level'] === 'class', fn($q) => $q->classLevel())
            ->when(isset($validated['level']) && $validated['level'] === 'subject', fn($q) => $q->subjectLevel());

        if (!empty($validated['lms_class_id'])) {
            $query->where('lms_class_id', (int) $validated['lms_class_id']);
        }
        if (!empty($validated['user_id'])) {
            $query->where('user_id', (int) $validated['user_id']);
        }
        if (!empty($validated['session_id'])) {
            $query->forSession((int) $validated['session_id']);
        }

        $totals = $query->selectRaw('status, count(*) as cnt')->groupBy('status')->pluck('cnt', 'status')->all();
        $present = (int) ($totals['present'] ?? 0);
        $absent = (int) ($totals['absent'] ?? 0);
        $late = (int) ($totals['late'] ?? 0);
        $leave = (int) ($totals['leave'] ?? 0);
        $holiday = (int) ($totals['holiday'] ?? 0);
        $total = $present + $absent + $late + $leave + $holiday;
        $percentage = $total > 0 ? round(($present + $late) / $total * 100, 2) : 0;

        $thresholdPercentage = $this->getAttendanceThresholdPercentage($institutionId);

        return $this->success([
            'summary' => [
                'present' => $present,
                'absent' => $absent,
                'late' => $late,
                'leave' => $leave,
                'holiday' => $holiday,
                'total' => $total,
                'percentage_present' => $percentage,
            ],
            'from_date' => $validated['from_date'],
            'to_date' => $validated['to_date'],
            'threshold_percentage' => $thresholdPercentage,
        ]);
    }

    private function getAttendanceThresholdPercentage(int $institutionId): ?float
    {
        $setting = Setting::withoutGlobalScope('institution_scope')
            ->where('institution_id', $institutionId)
            ->where('setting_group', 'academics_policies')
            ->where('setting_key', 'attendance_policies')
            ->value('setting_value');
        if (!$setting) {
            return null;
        }
        $policies = is_string($setting) ? json_decode($setting, true) : $setting;
        if (!is_array($policies) || empty($policies)) {
            return null;
        }
        $first = $policies[0] ?? null;
        $threshold = $first['threshold'] ?? null;
        if (!is_string($threshold)) {
            return null;
        }
        if (preg_match('/^(\d+)\s*%?$/', trim($threshold), $m)) {
            return (float) $m[1];
        }
        return null;
    }

    private function canUserAccessClassForAttendance($user, LmsClass $class): bool
    {
        if (
            $user->hasAbility('view_attendance') || $user->hasAbility('mark_attendance')
            || $user->hasAbility('update_attendance') || $user->hasAbility('delete_attendance') || $user->hasAbility('view_attendance_reports')
        ) {
            return true;
        }
        if ($class->class_teacher_id === $user->id) {
            return true;
        }
        return ClassSubjectAllocation::query()
            ->where('stream_id', $class->stream_id)
            ->where('session_id', $class->session_id)
            ->where('instructor_id', $user->id)
            ->exists();
    }

    private function authorizeClassOrAllocation($user, LmsClass $class, ?int $classSubjectAllocationId, string $action): void
    {
        if (
            $user->hasAbility('view_attendance') || $user->hasAbility('mark_attendance')
            || $user->hasAbility('update_attendance') || $user->hasAbility('delete_attendance') || $user->hasAbility('view_attendance_reports')
        ) {
            return;
        }
        if ($classSubjectAllocationId === null) {
            if ($class->class_teacher_id !== $user->id) {
                abort(403, 'You can only ' . $action . ' attendance for your assigned class.');
            }
            return;
        }
        $allocation = ClassSubjectAllocation::find($classSubjectAllocationId);
        if (!$allocation || $allocation->stream_id != $class->stream_id || $allocation->session_id != $class->session_id) {
            abort(403, 'Invalid allocation for this class.');
        }
        if ($allocation->instructor_id !== $user->id) {
            abort(403, 'You can only ' . $action . ' attendance for your subject.');
        }
    }
}
