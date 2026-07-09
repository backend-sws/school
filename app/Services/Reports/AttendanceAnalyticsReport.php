<?php

namespace App\Services\Reports;

use App\Models\AttendanceRecord;
use App\Models\LmsClassEnrollment;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AttendanceAnalyticsReport extends BaseReport
{
    protected array $dynamicHeaders = [];

    protected function generate(array $filters): array
    {
        $startDate = $filters['start_date'] ?? now()->startOfMonth()->toDateString();
        $endDate = $filters['end_date'] ?? now()->toDateString();
        $classId = $filters['class_id'] ?? null;
        $institutionId = $this->getInstitutionId();

        $query = AttendanceRecord::query()
            ->whereBetween('date', [$startDate, $endDate]);

        if ($institutionId) {
            $query->where('institution_id', $institutionId);
        }

        if ($classId) {
            $query->whereHas('user.academicInfo', function ($q) use ($classId) {
                $q->where('lms_class_id', $classId);
            });
        }

        // Overall Stats
        $stats = (clone $query)->select(
            DB::raw("COUNT(*) as total_records"),
            DB::raw("COUNT(CASE WHEN status = 'present' THEN 1 END) as present_count"),
            DB::raw("COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent_count"),
            DB::raw("COUNT(CASE WHEN status = 'late' THEN 1 END) as late_count")
        )->first();

        $total = (int) $stats->total_records;

        // If class_id is selected, generate the full monthly ledger grid
        if ($classId) {
            $enrollments = LmsClassEnrollment::where('lms_class_id', $classId)
                ->where('role', 'student')
                ->where('status', 'active')
                ->with('user.studentProfile')
                ->get();

            $records = AttendanceRecord::where('lms_class_id', $classId)
                ->whereBetween('date', [$startDate, $endDate])
                ->get()
                ->groupBy('user_id');

            $start = Carbon::parse($startDate);
            $end = Carbon::parse($endDate);
            $dates = [];
            $temp = $start->copy();
            while ($temp->lte($end)) {
                $dates[] = $temp->format('Y-m-d');
                $temp->addDay();
            }

            // Define dynamic headers
            $this->dynamicHeaders = [
                ['key' => 'sl_no', 'label' => 'SL No'],
                ['key' => 'name', 'label' => 'Student'],
                ['key' => 'reg_no', 'label' => 'Reg No'],
            ];
            foreach ($dates as $d) {
                $dayNum = Carbon::parse($d)->day;
                $this->dynamicHeaders[] = ['key' => 'day_' . $dayNum, 'label' => (string) $dayNum];
            }
            $this->dynamicHeaders[] = ['key' => 'total_days', 'label' => 'Total'];
            $this->dynamicHeaders[] = ['key' => 'present_days', 'label' => 'Present'];
            $this->dynamicHeaders[] = ['key' => 'percentage', 'label' => 'Attendance %', 'align' => 'right'];

            $items = [];
            foreach ($enrollments as $index => $enrollment) {
                $student = $enrollment->user;
                if (!$student) continue;

                $studentRecords = collect($records[$student->id] ?? [])->keyBy('date');

                $row = [
                    'sl_no' => $index + 1,
                    'name' => $student->name,
                    'reg_no' => $student->reg_no ?: ($student->studentProfile->reg_no ?? 'N/A'),
                ];

                $presentCount = 0;
                $totalDays = 0;

                foreach ($dates as $d) {
                    $dayNum = Carbon::parse($d)->day;
                    $rec = $studentRecords->get($d);
                    $statusChar = '—';

                    if ($rec) {
                        $totalDays++;
                        if ($rec->status === 'present') {
                            $statusChar = 'P';
                            $presentCount++;
                        } elseif ($rec->status === 'absent') {
                            $statusChar = 'A';
                        } elseif ($rec->status === 'late') {
                            $statusChar = 'L';
                            $presentCount++;
                        } elseif ($rec->status === 'leave') {
                            $statusChar = 'E';
                        } elseif ($rec->status === 'holiday') {
                            $statusChar = 'H';
                        }
                    }
                    $row['day_' . $dayNum] = $statusChar;
                }

                $row['total_days'] = $totalDays;
                $row['present_days'] = $presentCount;
                $row['percentage'] = $totalDays > 0 ? round(($presentCount / $totalDays) * 100, 2) . '%' : '0%';

                $items[] = $row;
            }
        } else {
            // General view: show chronic absentees
            $chronicAbsentees = $this->getChronicAbsentees($startDate, $endDate, $classId, $institutionId);

            $items = collect($chronicAbsentees)->map(function ($item, $index) {
                return [
                    'sl_no' => $index + 1,
                    'name' => $item->name ?: 'N/A',
                    'reg_no' => $item->reg_no ?: 'N/A',
                    'total_days' => (int) $item->total_days,
                    'present_days' => (int) $item->present_days,
                    'percentage' => $item->percentage . '%',
                ];
            })->toArray();

            $this->dynamicHeaders = [
                ['key' => 'sl_no', 'label' => 'SL No'],
                ['key' => 'name', 'label' => 'Student'],
                ['key' => 'reg_no', 'label' => 'Reg No'],
                ['key' => 'total_days', 'label' => 'Total Days'],
                ['key' => 'present_days', 'label' => 'Present Days'],
                ['key' => 'percentage', 'label' => 'Attendance %', 'align' => 'right'],
            ];
        }

        return [
            'summary' => [
                'attendance_percentage' => $total > 0 ? round(($stats->present_count / $total) * 100, 2) : 0,
                'present' => (int) $stats->present_count,
                'absent' => (int) $stats->absent_count,
                'late' => (int) $stats->late_count,
            ],
            'daily_trend' => (clone $query)
                ->select(
                    'date',
                    DB::raw("ROUND((COUNT(CASE WHEN status = 'present' THEN 1 END) * 1.0 / NULLIF(COUNT(*), 0)) * 100, 2) as total")
                )
                ->groupBy('date')
                ->orderBy('date')
                ->get(),
            'breakdown' => [
                ['name' => 'Present', 'total' => (int) $stats->present_count],
                ['name' => 'Absent', 'total' => (int) $stats->absent_count],
                ['name' => 'Late', 'total' => (int) $stats->late_count],
            ],
            'items' => $items,
            'pagination' => [
                'current_page' => 1,
                'last_page' => 1,
                'per_page' => max(15, count($items)),
                'total' => count($items),
            ],
        ];
    }

    protected function getChronicAbsentees($start, $end, $classId, $institutionId)
    {
        // Students with attendance below 75%
        $query = AttendanceRecord::query()
            ->whereBetween('date', [$start, $end]);

        if ($institutionId) {
            $query->where('attendance_records.institution_id', $institutionId);
        }

        if ($classId) {
            $query->whereHas('user.academicInfo', fn($q) => $q->where('lms_class_id', $classId));
        }

        return $query->join('users', 'attendance_records.user_id', '=', 'users.id')
            ->select(
                'users.name',
                'users.reg_no',
                DB::raw("COUNT(*) as total_days"),
                DB::raw("COUNT(CASE WHEN attendance_records.status = 'present' THEN 1 END) as present_days"),
                DB::raw("ROUND((COUNT(CASE WHEN attendance_records.status = 'present' THEN 1 END) * 1.0 / NULLIF(COUNT(*), 0)) * 100, 2) as percentage")
            )
            ->groupBy('users.id', 'users.name', 'users.reg_no')
            ->having(DB::raw("(COUNT(CASE WHEN attendance_records.status = 'present' THEN 1 END) * 1.0 / NULLIF(COUNT(*), 0))"), '<', 0.75)
            ->orderBy('percentage', 'asc')
            ->limit(10)
            ->get();
    }

    public function getHeaders(): array
    {
        if (!empty($this->dynamicHeaders)) {
            return $this->dynamicHeaders;
        }

        return [
            ['key' => 'sl_no', 'label' => 'SL No'],
            ['key' => 'name', 'label' => 'Student'],
            ['key' => 'reg_no', 'label' => 'Reg No'],
            ['key' => 'total_days', 'label' => 'Total Days'],
            ['key' => 'present_days', 'label' => 'Present Days'],
            ['key' => 'percentage', 'label' => 'Attendance %', 'align' => 'right'],
        ];
    }

    public function getMetadata(): array
    {
        return [
            'title' => 'Attendance Analytics',
            'description' => 'Trends and summary of student attendance.',
            'type' => 'dashboard_complex',
            'charts' => [
                'daily_trend' => 'line',
                'fee_type_breakdown' => 'pie',
            ],
        ];
    }
}
