<?php

namespace App\Http\Controllers\Api\V1\Attendance;

use App\Exports\StudentAttendanceMonthlyExport;
use App\Http\Controllers\Api\V1\BaseController;
use App\Imports\StudentAttendanceBulkImport;
use App\Models\AttendanceRecord;
use App\Models\ClassSubjectAllocation;
use App\Models\HR\Holiday;
use App\Models\User;
use App\Notifications\AttendanceMarkedNotification;
use App\Traits\DispatchesRealtimeNotifications;
use App\Models\LmsClass;
use App\Models\LmsClassEnrollment;
use App\Models\Setting;
use App\Support\InstitutionContext;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

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

        return $this->success($this->buildDailyResponse($data['records'], $data['summary'], $level, $csaId, $data['meta']));
    }

    private function buildDailyResponse($records, array $summary, string $level, ?int $csaId, ?array $meta = null): array
    {
        return [
            'records' => $records->values()->all(),
            'summary' => $summary,
            'level' => $level,
            'class_subject_allocation_id' => $level === 'subject' ? $csaId : null,
            'meta' => $meta,
        ];
    }

    private function fetchDailyData(int $lmsClassId, string $date, string $level, ?int $csaId): array
    {
        $institutionId = InstitutionContext::getActiveInstitutionId(auth()->user());

        // Check holiday and Sunday for this date
        $carbonDate = Carbon::parse($date);
        $year = $carbonDate->year;
        $isSunday = $carbonDate->isSunday();

        $holiday = Holiday::where('institution_id', $institutionId)
            ->where(function ($q) use ($year) {
                $q->where('year', $year)
                  ->orWhere('is_recurring', true);
            })
            ->get()
            ->first(function ($h) use ($date, $year) {
                $rawDate = $h->getRawOriginal('date');
                if ($h->is_recurring && $rawDate) {
                    $parts = explode('-', $rawDate);
                    if (count($parts) === 3) {
                        $rawDate = sprintf('%04d-%02d-%02d', (int) $year, (int) $parts[1], (int) $parts[2]);
                    }
                }
                return $rawDate === $date;
            });

        $students = LmsClassEnrollment::query()
            ->where('lms_class_id', $lmsClassId)
            ->where('role', 'student')
            ->where('status', 'active')
            ->with(['user:id,name,email', 'user.studentProfile:id,user_id,roll_no,reg_no'])
            ->get();

        $existing = AttendanceRecord::query()
            ->where('lms_class_id', $lmsClassId)
            ->forDate($date)
            ->when($level === 'class', fn($q) => $q->classLevel())
            ->when($level === 'subject' && $csaId, fn($q) => $q->where('class_subject_allocation_id', $csaId))
            ->get()
            ->keyBy('user_id');

        $defaultStatus = ($holiday || $isSunday) ? 'holiday' : 'present';

        $records = $students->map(function ($enrollment) use ($existing, $date, $defaultStatus) {
            $rec = $existing->get($enrollment->user_id);
            $profile = $enrollment->user?->studentProfile;
            $rollNo = $profile?->roll_no ?: ($profile?->reg_no ?: "ID: {$enrollment->user_id}");

            return [
                'id' => $rec?->id,
                'user_id' => $enrollment->user_id,
                'user_name' => $enrollment->user?->name ?? '',
                'roll_no' => $rollNo,
                'status' => $rec ? $rec->status : $defaultStatus,
                'has_record' => (bool) $rec,
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

        $meta = [
            'is_sunday'  => $isSunday,
            'is_holiday' => (bool) $holiday,
            'holiday'    => $holiday ? [
                'id'          => $holiday->id,
                'name'        => $holiday->name,
                'description' => $holiday->description,
            ] : null,
        ];

        return ['records' => $records, 'summary' => $summary, 'meta' => $meta];
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
                        'class_subject_allocation_id' => $csaId,
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
     * Single cell mark/update from Calendar Register Matrix
     */
    public function markCell(Request $request): JsonResponse
    {
        if (!$request->user()->hasAbility('mark_attendance') && !$request->user()->hasAbility('update_attendance')) {
            return $this->forbidden('You do not have permission to mark attendance.');
        }

        $validated = $request->validate([
            'lms_class_id'                => 'required|exists:lms_classes,id',
            'user_id'                     => 'required|exists:users,id',
            'date'                        => 'required|date',
            'status'                      => 'nullable|in:present,absent,late,leave,holiday,clear',
            'level'                       => 'nullable|in:class,subject',
            'class_subject_allocation_id' => 'nullable|exists:class_subject_allocations,id',
            'remarks'                     => 'nullable|string|max:255',
        ]);

        $class = LmsClass::find($validated['lms_class_id']);
        if (!$class) {
            return $this->notFound('Class not found.');
        }

        $level = $validated['level'] ?? 'class';
        $csaId = $level === 'subject' && isset($validated['class_subject_allocation_id'])
            ? (int) $validated['class_subject_allocation_id']
            : null;

        $this->authorizeClassOrAllocation($request->user(), $class, $csaId, 'mark');

        $userId = (int) $validated['user_id'];
        $date = $validated['date'];
        $status = $validated['status'] ?? null;
        $institutionId = $class->institution_id;

        if (!$status || $status === 'clear') {
            AttendanceRecord::where('institution_id', $institutionId)
                ->where('lms_class_id', $class->id)
                ->when($csaId, fn($q) => $q->where('class_subject_allocation_id', $csaId), fn($q) => $q->whereNull('class_subject_allocation_id'))
                ->where('user_id', $userId)
                ->where('date', $date)
                ->delete();
            $savedStatus = null;
        } else {
            $record = AttendanceRecord::updateOrCreate(
                [
                    'institution_id'              => $institutionId,
                    'lms_class_id'                => $class->id,
                    'class_subject_allocation_id' => $csaId,
                    'user_id'                     => $userId,
                    'date'                        => $date,
                ],
                [
                    'status'    => $status,
                    'marked_by' => $request->user()->id,
                    'remarks'   => $validated['remarks'] ?? null,
                ]
            );
            $savedStatus = $record->status;
        }

        // Recalculate monthly summary for this student
        $month = Carbon::parse($date)->format('Y-m');
        $startOfMonth = Carbon::parse($month . '-01')->startOfMonth();
        $endOfMonth = $startOfMonth->copy()->endOfMonth();

        $userAttendances = AttendanceRecord::where('institution_id', $institutionId)
            ->where('lms_class_id', $class->id)
            ->when($csaId, fn($q) => $q->where('class_subject_allocation_id', $csaId), fn($q) => $q->whereNull('class_subject_allocation_id'))
            ->where('user_id', $userId)
            ->whereBetween('date', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
            ->get();

        $presentCount = $userAttendances->where('status', 'present')->count();
        $absentCount = $userAttendances->where('status', 'absent')->count();
        $lateCount = $userAttendances->where('status', 'late')->count();
        $leaveCount = $userAttendances->where('status', 'leave')->count();
        $holidayCount = $userAttendances->where('status', 'holiday')->count();
        $totalMarked = $userAttendances->count();

        $summary = [
            'present'      => $presentCount,
            'absent'       => $absentCount,
            'late'         => $lateCount,
            'leave'        => $leaveCount,
            'holiday'      => $holidayCount,
            'total_marked' => $totalMarked,
        ];

        return $this->success([
            'user_id' => $userId,
            'date'    => $date,
            'status'  => $savedStatus,
            'summary' => $summary,
        ], 'Attendance updated successfully');
    }

    /**
     * GET monthly attendance register / ledger matrix
     */
    public function ledger(Request $request): JsonResponse
    {
        if (!$request->user()->hasAbility('view_attendance')) {
            return $this->forbidden('You do not have permission to view attendance.');
        }

        $validated = $request->validate([
            'lms_class_id'                => 'required|exists:lms_classes,id',
            'month'                       => 'nullable|string',
            'level'                       => 'nullable|in:class,subject',
            'class_subject_allocation_id' => 'nullable|exists:class_subject_allocations,id',
        ]);

        $lmsClassId = (int) $validated['lms_class_id'];
        $class = LmsClass::find($lmsClassId);
        if (!$class) {
            return $this->notFound('Class not found.');
        }

        $level = $validated['level'] ?? 'class';
        $csaId = $level === 'subject' && isset($validated['class_subject_allocation_id'])
            ? (int) $validated['class_subject_allocation_id']
            : null;

        $this->authorizeClassOrAllocation($request->user(), $class, $csaId, 'view');

        $month = $validated['month'] ?? Carbon::today()->format('Y-m');
        $institutionId = InstitutionContext::getActiveInstitutionId($request->user());

        $ledgerData = $this->buildClassLedgerData($institutionId, $class, $month, $level, $csaId);

        return $this->success($ledgerData);
    }

    /**
     * Export Monthly Attendance Register to Excel
     */
    public function export(Request $request)
    {
        if (!$request->user()->hasAbility('view_attendance') && !$request->user()->hasAbility('view_attendance_reports')) {
            return $this->forbidden('You do not have permission to export attendance.');
        }

        $validated = $request->validate([
            'lms_class_id'                => 'required|exists:lms_classes,id',
            'month'                       => 'nullable|string',
            'level'                       => 'nullable|in:class,subject',
            'class_subject_allocation_id' => 'nullable|exists:class_subject_allocations,id',
        ]);

        $lmsClassId = (int) $validated['lms_class_id'];
        $class = LmsClass::find($lmsClassId);
        if (!$class) {
            return $this->notFound('Class not found.');
        }

        $level = $validated['level'] ?? 'class';
        $csaId = $level === 'subject' && isset($validated['class_subject_allocation_id'])
            ? (int) $validated['class_subject_allocation_id']
            : null;

        $month = $validated['month'] ?? Carbon::today()->format('Y-m');
        $institutionId = InstitutionContext::getActiveInstitutionId($request->user());

        $ledgerData = $this->buildClassLedgerData($institutionId, $class, $month, $level, $csaId);

        $cleanClassName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $class->name);
        $fileName = "attendance_register_{$cleanClassName}_{$month}.xlsx";

        return Excel::download(new StudentAttendanceMonthlyExport($month, $ledgerData), $fileName);
    }

    /**
     * Download Class Attendance Import Template (pre-filled with student list)
     */
    public function downloadTemplate(Request $request)
    {
        $validated = $request->validate([
            'lms_class_id'                => 'required|exists:lms_classes,id',
            'month'                       => 'nullable|string',
            'level'                       => 'nullable|in:class,subject',
            'class_subject_allocation_id' => 'nullable|exists:class_subject_allocations,id',
        ]);

        $lmsClassId = (int) $validated['lms_class_id'];
        $class = LmsClass::find($lmsClassId);
        if (!$class) {
            return $this->notFound('Class not found.');
        }

        $level = $validated['level'] ?? 'class';
        $csaId = $level === 'subject' && isset($validated['class_subject_allocation_id'])
            ? (int) $validated['class_subject_allocation_id']
            : null;

        $month = $validated['month'] ?? Carbon::today()->format('Y-m');
        $institutionId = InstitutionContext::getActiveInstitutionId($request->user());

        $ledgerData = $this->buildClassLedgerData($institutionId, $class, $month, $level, $csaId);

        $cleanClassName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $class->name);
        $fileName = "attendance_template_{$cleanClassName}_{$month}.xlsx";

        return Excel::download(new StudentAttendanceMonthlyExport($month, $ledgerData, true), $fileName);
    }

    /**
     * Bulk Import Attendance from Excel
     */
    public function import(Request $request): JsonResponse
    {
        if (!$request->user()->hasAbility('mark_attendance')) {
            return $this->forbidden('You do not have permission to import attendance.');
        }

        $request->validate([
            'file'                        => 'required|file|mimes:xlsx,xls,csv|max:10240',
            'lms_class_id'                => 'required|exists:lms_classes,id',
            'month'                       => 'nullable|string',
            'class_subject_allocation_id' => 'nullable|exists:class_subject_allocations,id',
        ]);

        $lmsClassId = (int) $request->input('lms_class_id');
        $class = LmsClass::find($lmsClassId);
        if (!$class) {
            return $this->notFound('Class not found.');
        }

        $csaId = $request->filled('class_subject_allocation_id') ? (int) $request->input('class_subject_allocation_id') : null;
        $this->authorizeClassOrAllocation($request->user(), $class, $csaId, 'mark');

        $institutionId = InstitutionContext::getActiveInstitutionId($request->user());
        $file = $request->file('file');
        $month = $request->input('month');

        $import = new StudentAttendanceBulkImport($institutionId, $request->user()->id, $lmsClassId, $csaId, $month);
        Excel::import($import, $file);

        $imported = $import->getImportedCount();
        $skipped = $import->getSkippedCount();
        $errors = $import->getRowErrors();

        return $this->success([
            'imported_count' => $imported,
            'skipped_count'  => $skipped,
            'errors'         => array_slice($errors, 0, 10),
            'total_errors'   => count($errors),
        ], "Import completed: {$imported} attendance marks saved.");
    }

    /**
     * Helper to build monthly ledger data for a class
     */
    protected function buildClassLedgerData(int $institutionId, LmsClass $class, string $month, string $level = 'class', ?int $csaId = null): array
    {
        $startOfMonth = Carbon::parse($month . '-01')->startOfMonth();
        $endOfMonth = $startOfMonth->copy()->endOfMonth();
        $daysInMonth = $startOfMonth->daysInMonth;
        $year = $startOfMonth->year;

        // Fetch holidays for this year (and recurring)
        $holidays = Holiday::where('institution_id', $institutionId)
            ->where(function ($q) use ($year) {
                $q->where('year', $year)
                  ->orWhere('is_recurring', true);
            })
            ->get();

        $holidaysMap = [];
        foreach ($holidays as $h) {
            $rawDate = $h->getRawOriginal('date');
            if ($h->is_recurring && $rawDate) {
                $parts = explode('-', $rawDate);
                if (count($parts) === 3) {
                    $rawDate = sprintf('%04d-%02d-%02d', (int) $year, (int) $parts[1], (int) $parts[2]);
                }
            }
            if ($rawDate) {
                $holidaysMap[$rawDate] = [
                    'id'          => $h->id,
                    'name'        => $h->name,
                    'is_recurring'=> (bool) $h->is_recurring,
                    'description' => $h->description,
                ];
            }
        }

        // Build days metadata (day, day_name, is_sunday, holiday)
        $daysMeta = [];
        $holidayCount = 0;
        $sundayCount = 0;
        for ($d = 1; $d <= $daysInMonth; $d++) {
            $dt = $startOfMonth->copy()->addDays($d - 1);
            $dateStr = $dt->toDateString();
            $isSun = $dt->isSunday();
            $hol = $holidaysMap[$dateStr] ?? null;

            if ($isSun) $sundayCount++;
            if ($hol) $holidayCount++;

            $daysMeta[$dateStr] = [
                'day'       => $d,
                'day_name'  => $dt->format('D'),
                'is_sunday' => $isSun,
                'holiday'   => $hol,
            ];
        }

        // Get enrolled students
        $enrollments = LmsClassEnrollment::query()
            ->where('lms_class_id', $class->id)
            ->where('role', 'student')
            ->where('status', 'active')
            ->with(['user:id,name,email', 'user.studentProfile:id,user_id,roll_no,reg_no'])
            ->get();

        // Get attendance records in date range
        $attendances = AttendanceRecord::where('institution_id', $institutionId)
            ->where('lms_class_id', $class->id)
            ->when($level === 'class', fn($q) => $q->classLevel())
            ->when($level === 'subject' && $csaId, fn($q) => $q->where('class_subject_allocation_id', $csaId))
            ->whereBetween('date', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
            ->get();

        $grouped = [];
        foreach ($attendances as $att) {
            $dateKey = is_string($att->date) ? substr($att->date, 0, 10) : $att->date->toDateString();
            $grouped[$att->user_id][$dateKey] = $att;
        }

        $subjectName = 'General (Class Level)';
        if ($csaId) {
            $alloc = ClassSubjectAllocation::with('subject')->find($csaId);
            $subjectName = $alloc?->subject?->name ?? "Subject #{$csaId}";
        }

        $matrix = [];
        foreach ($enrollments as $enr) {
            $user = $enr->user;
            if (!$user) continue;

            $profile = $user->studentProfile;
            $rollNo = $profile?->roll_no ?: ($profile?->reg_no ?: "ID: {$user->id}");

            $row = [
                'user_id'     => $user->id,
                'roll_no'     => $rollNo,
                'name'        => $user->name,
                'summary'     => [
                    'present'      => 0,
                    'absent'       => 0,
                    'late'         => 0,
                    'leave'        => 0,
                    'holiday'      => 0,
                    'total_marked' => 0,
                ],
                'days'        => []
            ];

            for ($d = 1; $d <= $daysInMonth; $d++) {
                $dateStr = sprintf('%s-%02d', $month, $d);
                $att = $grouped[$user->id][$dateStr] ?? null;

                if ($att) {
                    $row['days'][$dateStr] = [
                        'id'      => $att->id,
                        'status'  => $att->status,
                        'remarks' => $att->remarks,
                    ];
                    if (isset($row['summary'][$att->status])) {
                        $row['summary'][$att->status]++;
                    }
                    $row['summary']['total_marked']++;
                } else {
                    $row['days'][$dateStr] = null;
                }
            }

            $matrix[] = $row;
        }

        return [
            'class_id'       => $class->id,
            'class_name'     => $class->name,
            'subject_name'   => $subjectName,
            'level'          => $level,
            'month'          => $month,
            'days_in_month'  => $daysInMonth,
            'days_meta'      => $daysMeta,
            'matrix'         => $matrix,
            'working_days'   => max(0, $daysInMonth - $sundayCount - $holidayCount),
            'total_students' => count($matrix),
        ];
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

        return $this->success($this->buildDailyResponse($data['records'], $data['summary'], $level, $csaId, $data['meta']));
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

