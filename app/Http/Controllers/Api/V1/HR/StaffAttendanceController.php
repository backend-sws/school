<?php

namespace App\Http\Controllers\Api\V1\HR;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\HR\StaffAttendance;
use App\Models\HR\Holiday;
use App\Models\User;
use App\Exports\StaffAttendanceMonthlyExport;
use App\Exports\StaffAttendanceTemplateExport;
use App\Imports\StaffAttendanceBulkImport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Maatwebsite\Excel\Facades\Excel;

class StaffAttendanceController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        $date = $request->get('date', Carbon::today()->toDateString());
        $institutionId = $request->user()->activeInstitutionId();

        $carbonDate = Carbon::parse($date);
        $year = $carbonDate->year;

        // Check holiday & Sunday for this date
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

        $staff = User::whereHas('staffProfile', function ($q) use ($institutionId, $date) {
            $q->where('institution_id', $institutionId)
              ->where(function ($sq) use ($date) {
                  $sq->whereNull('joining_date')
                     ->orWhere('joining_date', '<=', $date);
              })
              ->where(function ($sq) use ($date) {
                  $sq->whereNull('leaving_date')
                     ->orWhere('leaving_date', '>', $date);
              })
              ->where(function ($sq) use ($date) {
                  $sq->where('status', '!=', 0)
                     ->orWhere(function ($s2) use ($date) {
                         $s2->where('status', 0)
                            ->whereNotNull('leaving_date')
                            ->where('leaving_date', '>', $date);
                     });
              });
        })->with(['staffProfile', 'salaryStructure'])->get();

        $attendances = StaffAttendance::where('institution_id', $institutionId)
            ->where('date', $date)
            ->get()
            ->keyBy('user_id');

        $result = $staff->map(function ($user) use ($attendances) {
            $attendance = $attendances->get($user->id);
            $empId = $user->staffProfile->employee_id ?? null;
            if (empty($empId)) {
                $empId = sprintf('EMP-%03d', $user->id);
            }

            return [
                'user_id' => $user->id,
                'employee_id' => $empId,
                'name' => $user->name,
                'designation' => $user->staffProfile->designation ?? 'Staff',
                'attendance_id' => $attendance ? $attendance->id : null,
                'status' => $attendance ? $attendance->status : 'present', // Default to present
                'leave_type_id' => $attendance ? $attendance->leave_type_id : null,
                'remarks' => $attendance ? $attendance->remarks : null,
            ];
        });

        return $this->success([
            'date' => $date,
            'records' => $result,
            'meta' => [
                'is_sunday'  => $isSunday,
                'is_holiday' => (bool) $holiday,
                'holiday'    => $holiday ? [
                    'id'          => $holiday->id,
                    'name'        => $holiday->name,
                    'description' => $holiday->description,
                ] : null,
            ],
        ]);
    }

    public function mark(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'attendances' => 'required|array',
            'attendances.*.user_id' => 'required|exists:users,id',
            'attendances.*.status' => 'required|in:present,absent,half_day,on_leave',
            'attendances.*.leave_type_id' => 'nullable|exists:hr_leave_types,id',
            'attendances.*.remarks' => 'nullable|string',
        ]);

        $institutionId = $request->user()->activeInstitutionId();
        $date = $validated['date'];

        foreach ($validated['attendances'] as $att) {
            StaffAttendance::updateOrCreate(
                [
                    'institution_id' => $institutionId,
                    'user_id' => $att['user_id'],
                    'date' => $date
                ],
                [
                    'status' => $att['status'],
                    'leave_type_id' => $att['leave_type_id'] ?? null,
                    'remarks' => $att['remarks'] ?? null,
                ]
            );
        }

        return $this->success(null, 'Attendance marked successfully');
    }

    public function markCell(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id'       => 'required|exists:users,id',
            'date'          => 'required|date',
            'status'        => 'nullable|in:present,absent,half_day,on_leave,clear',
            'leave_type_id' => 'nullable|exists:hr_leave_types,id',
            'remarks'       => 'nullable|string|max:255',
        ]);

        $institutionId = $request->user()->activeInstitutionId();
        $userId = $validated['user_id'];
        $date = $validated['date'];
        $status = $validated['status'] ?? null;

        $staffProfile = \App\Models\StaffProfile::where('user_id', $userId)
            ->when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
            ->first();

        if ($staffProfile && $staffProfile->hasLeftOnOrBefore($date)) {
            $formattedDate = $staffProfile->leaving_date ? $staffProfile->leaving_date->format('d M Y') : 'an earlier date';
            return $this->error("Cannot mark attendance. Staff member left the school on {$formattedDate}.", 422);
        }

        if (!$status || $status === 'clear') {
            StaffAttendance::where('institution_id', $institutionId)
                ->where('user_id', $userId)
                ->where('date', $date)
                ->delete();
            $savedStatus = null;
            $leaveTypeId = null;
        } else {
            $record = StaffAttendance::updateOrCreate(
                [
                    'institution_id' => $institutionId,
                    'user_id'        => $userId,
                    'date'           => $date,
                ],
                [
                    'status'        => $status,
                    'leave_type_id' => $status === 'on_leave' ? ($validated['leave_type_id'] ?? null) : null,
                    'remarks'       => $validated['remarks'] ?? null,
                ]
            );
            $savedStatus = $record->status;
            $leaveTypeId = $record->leave_type_id;
        }

        // Recalculate monthly summary for this staff user
        $month = Carbon::parse($date)->format('Y-m');
        $startOfMonth = Carbon::parse($month . '-01')->startOfMonth();
        $endOfMonth = $startOfMonth->copy()->endOfMonth();

        $userAttendances = StaffAttendance::where('institution_id', $institutionId)
            ->where('user_id', $userId)
            ->whereBetween('date', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
            ->get();

        $summary = [
            'present'   => $userAttendances->where('status', 'present')->count(),
            'absent'    => $userAttendances->where('status', 'absent')->count(),
            'half_day'  => $userAttendances->where('status', 'half_day')->count(),
            'on_leave'  => $userAttendances->where('status', 'on_leave')->count(),
        ];

        return $this->success([
            'user_id'       => $userId,
            'date'          => $date,
            'status'        => $savedStatus,
            'leave_type_id' => $leaveTypeId,
            'summary'       => $summary,
        ], 'Attendance updated successfully');
    }

    /**
     * Mark a staff member as having left the school (school exit).
     * Automatically sets leaving_date, marks inactive, and removes attendance from that date onwards.
     */
    public function markLeft(Request $request, $userId): JsonResponse
    {
        $userId = (int) $userId;
        if ($userId <= 0) {
            return $this->error('Invalid staff user ID.', 422);
        }

        $validated = $request->validate([
            'leaving_date'   => 'required|date',
            'leaving_reason' => 'nullable|string|max:255',
        ]);

        $institutionId = $request->user()->activeInstitutionId();

        $user = User::where('id', $userId)
            ->whereHas('staffProfile', function ($q) use ($institutionId) {
                if ($institutionId) {
                    $q->where('institution_id', $institutionId);
                }
            })->firstOrFail();

        $staffProfile = $user->staffProfile;
        if (!$staffProfile) {
            return $this->error('Staff profile not found.', 404);
        }

        $leavingDate = Carbon::parse($validated['leaving_date'])->toDateString();

        $staffProfile->update([
            'leaving_date'   => $leavingDate,
            'leaving_reason' => $validated['leaving_reason'] ?? 'Resigned / Relieved',
            'status'         => 0, // Inactive
        ]);

        $user->update(['status' => 0]);

        // Clean up any attendance marks recorded on or after the leaving date
        $deletedCount = StaffAttendance::where('user_id', $userId)
            ->where('date', '>=', $leavingDate)
            ->delete();

        return $this->success([
            'user_id'               => $userId,
            'name'                  => $user->name,
            'leaving_date'          => $leavingDate,
            'deleted_records_count' => $deletedCount,
        ], "Staff '{$user->name}' marked as left from {$leavingDate}. Records on or after this date removed.");
    }

    /**
     * Re-activate a staff member who was previously marked as left or inactive.
     */
    public function reactivate(Request $request, $userId): JsonResponse
    {
        $userId = (int) $userId;
        if ($userId <= 0) {
            return $this->error('Invalid staff user ID.', 422);
        }

        $institutionId = $request->user()->activeInstitutionId();

        $user = User::where('id', $userId)
            ->whereHas('staffProfile', function ($q) use ($institutionId) {
                if ($institutionId) {
                    $q->where('institution_id', $institutionId);
                }
            })->firstOrFail();

        $staffProfile = $user->staffProfile;
        if ($staffProfile) {
            $staffProfile->update([
                'leaving_date'   => null,
                'leaving_reason' => null,
                'status'         => 1, // Active
            ]);
        }

        $user->update(['status' => 1]);

        return $this->success([
            'user_id' => $userId,
            'name'    => $user->name,
        ], "Staff member '{$user->name}' re-activated successfully.");
    }

    public function ledger(Request $request): JsonResponse
    {
        $month = $request->get('month', Carbon::today()->format('Y-m'));
        $institutionId = $request->user()->activeInstitutionId();

        $ledgerData = $this->buildLedgerData($institutionId, $month);

        return $this->success($ledgerData);
    }

    public function export(Request $request)
    {
        $month = $request->get('month', Carbon::today()->format('Y-m'));
        $institutionId = $request->user()->activeInstitutionId();

        $ledgerData = $this->buildLedgerData($institutionId, $month);

        $fileName = "staff_attendance_{$month}.xlsx";
        return Excel::download(new StaffAttendanceMonthlyExport($month, $ledgerData), $fileName);
    }

    public function downloadTemplate(Request $request)
    {
        $institutionId = $request->user()->activeInstitutionId();
        $month = $request->get('month', Carbon::today()->format('Y-m'));

        $ledgerData = $this->buildLedgerData($institutionId, $month);

        $fileName = "staff_attendance_template_{$month}.xlsx";
        return Excel::download(new StaffAttendanceMonthlyExport($month, $ledgerData, true), $fileName);
    }

    public function import(Request $request): JsonResponse
    {
        $request->validate([
            'file'  => 'required|file|mimes:xlsx,xls,csv|max:10240', // 10MB max
            'month' => 'nullable|string',
        ]);

        $institutionId = $request->user()->activeInstitutionId();
        $file = $request->file('file');
        $month = $request->input('month');

        $import = new StaffAttendanceBulkImport($institutionId, $request->user()->id, $month);
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
     * Helper to build monthly ledger data and date metadata
     */
    protected function buildLedgerData(int $institutionId, string $month): array
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

        // Build days metadata (is_sunday, holiday)
        $daysMeta = [];
        for ($d = 1; $d <= $daysInMonth; $d++) {
            $dt = $startOfMonth->copy()->addDays($d - 1);
            $dateStr = $dt->toDateString();
            $daysMeta[$dateStr] = [
                'day'       => $d,
                'is_sunday' => $dt->isSunday(),
                'holiday'   => $holidaysMap[$dateStr] ?? null,
            ];
        }

        $startStr = $startOfMonth->toDateString();
        $endStr = $endOfMonth->toDateString();

        $staff = User::whereHas('staffProfile', function ($q) use ($institutionId, $startStr, $endStr) {
            $q->where('institution_id', $institutionId)
              // Did not join after this month ended
              ->where(function ($sq) use ($endStr) {
                  $sq->whereNull('joining_date')
                     ->orWhere('joining_date', '<=', $endStr);
              })
              // Did not leave before this month started
              ->where(function ($sq) use ($startStr) {
                  $sq->whereNull('leaving_date')
                     ->orWhere('leaving_date', '>=', $startStr);
              })
              // Exclude inactive staff who have no leaving date (or left before this month)
              ->where(function ($sq) use ($startStr) {
                  $sq->where('status', '!=', 0)
                     ->orWhere(function ($s2) use ($startStr) {
                         $s2->where('status', 0)
                            ->whereNotNull('leaving_date')
                            ->where('leaving_date', '>=', $startStr);
                     });
              });
        })->with(['staffProfile'])->get();

        $attendances = StaffAttendance::where('institution_id', $institutionId)
            ->whereBetween('date', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
            ->get();

        $grouped = [];
        foreach ($attendances as $att) {
            $grouped[$att->user_id][$att->date->toDateString()] = $att;
        }

        $result = [];
        foreach ($staff as $user) {
            $sp = $user->staffProfile;
            $leavingDateStr = $sp?->leaving_date ? $sp->leaving_date->format('Y-m-d') : null;
            $joiningDateStr = $sp?->joining_date ? $sp->joining_date->format('Y-m-d') : null;

            $row = [
                'user_id'        => $user->id,
                'employee_id'    => !empty($sp?->employee_id) ? $sp->employee_id : sprintf('EMP-%03d', $user->id),
                'name'           => $user->name,
                'designation'    => $sp?->designation ?? 'Staff',
                'joining_date'   => $joiningDateStr,
                'leaving_date'   => $leavingDateStr,
                'leaving_reason' => $sp?->leaving_reason,
                'is_active'      => (int) ($sp?->status ?? 1) === 1,
                'has_left'       => !empty($leavingDateStr) || (int) ($sp?->status ?? 1) === 0,
                'summary'        => [
                    'present'  => 0,
                    'absent'   => 0,
                    'half_day' => 0,
                    'on_leave' => 0,
                ],
                'days'           => []
            ];

            for ($d = 1; $d <= $daysInMonth; $d++) {
                $dateStr = sprintf('%s-%02d', $month, $d);
                $att = $grouped[$user->id][$dateStr] ?? null;

                if ($leavingDateStr && $dateStr >= $leavingDateStr) {
                    $row['days'][$dateStr] = [
                        'status'  => 'left',
                        'label'   => 'Left',
                        'is_left' => true,
                    ];
                } elseif ($joiningDateStr && $dateStr < $joiningDateStr) {
                    $row['days'][$dateStr] = [
                        'status'  => 'not_joined',
                        'label'   => '—',
                    ];
                } elseif ($att) {
                    $row['days'][$dateStr] = [
                        'status'        => $att->status,
                        'leave_type_id' => $att->leave_type_id,
                        'remarks'       => $att->remarks,
                    ];
                    if (isset($row['summary'][$att->status])) {
                        $row['summary'][$att->status]++;
                    }
                } else {
                    $row['days'][$dateStr] = null;
                }
            }

            $result[] = $row;
        }

        return [
            'month'         => $month,
            'days_in_month' => $daysInMonth,
            'days_meta'     => $daysMeta,
            'matrix'        => $result,
        ];
    }
}
