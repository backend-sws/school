<?php

namespace App\Http\Controllers\Api\V1\HR;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\V1\BaseController;
use App\Models\HR\StaffAttendance;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;

class StaffAttendanceController extends BaseController
{
    public function index(Request $request)
    {
        $date = $request->get('date', Carbon::today()->toDateString());
        $institutionId = $request->user()->activeInstitutionId();

        $staff = User::whereHas('staffProfile', function($q) use ($institutionId) {
            $q->where('institution_id', $institutionId);
        })->with(['staffProfile', 'salaryStructure'])->get();

        $attendances = StaffAttendance::where('institution_id', $institutionId)
            ->where('date', $date)
            ->get()
            ->keyBy('user_id');

        $result = $staff->map(function ($user) use ($attendances) {
            $attendance = $attendances->get($user->id);
            return [
                'user_id' => $user->id,
                'name' => $user->name,
                'designation' => $user->staffProfile->designation ?? 'Staff',
                'attendance_id' => $attendance ? $attendance->id : null,
                'status' => $attendance ? $attendance->status : 'present', // Default to present
                'leave_type_id' => $attendance ? $attendance->leave_type_id : null,
                'remarks' => $attendance ? $attendance->remarks : null,
            ];
        });

        return $this->success($result);
    }

    public function mark(Request $request)
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

    public function ledger(Request $request)
    {
        $month = $request->get('month', Carbon::today()->format('Y-m'));
        $institutionId = $request->user()->activeInstitutionId();

        $startOfMonth = Carbon::parse($month . '-01')->startOfMonth();
        $endOfMonth = $startOfMonth->copy()->endOfMonth();
        $daysInMonth = $startOfMonth->daysInMonth;

        $staff = User::whereHas('staffProfile', function($q) use ($institutionId) {
            $q->where('institution_id', $institutionId);
        })->with(['staffProfile'])->get();

        $attendances = StaffAttendance::where('institution_id', $institutionId)
            ->whereBetween('date', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
            ->get();

        $grouped = [];
        foreach ($attendances as $att) {
            // Group by user_id -> date -> attendance record
            $grouped[$att->user_id][$att->date->toDateString()] = $att;
        }

        $result = [];
        foreach ($staff as $user) {
            $row = [
                'user_id' => $user->id,
                'name' => $user->name,
                'designation' => $user->staffProfile->designation ?? 'Staff',
                'summary' => [
                    'present' => 0,
                    'absent' => 0,
                    'half_day' => 0,
                    'on_leave' => 0,
                ],
                'days' => []
            ];

            for ($d = 1; $d <= $daysInMonth; $d++) {
                $dateStr = $startOfMonth->copy()->addDays($d - 1)->toDateString();
                $att = $grouped[$user->id][$dateStr] ?? null;

                if ($att) {
                    $row['days'][$dateStr] = [
                        'status' => $att->status,
                        'leave_type_id' => $att->leave_type_id,
                    ];
                    $row['summary'][$att->status]++;
                } else {
                    $row['days'][$dateStr] = null;
                }
            }

            $result[] = $row;
        }

        return $this->success([
            'month' => $month,
            'days_in_month' => $daysInMonth,
            'matrix' => $result,
        ]);
    }
}
