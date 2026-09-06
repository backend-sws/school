<?php

namespace App\Imports;

use App\Models\HR\LeaveType;
use App\Models\HR\StaffAttendance;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToArray;

class StaffAttendanceBulkImport implements ToArray
{
    protected int $institutionId;
    protected int $uploadedBy;
    protected ?string $targetMonth;
    protected int $importedCount = 0;
    protected int $skippedCount = 0;
    protected array $rowErrors = [];

    // Caches
    protected array $userCache = [];
    protected array $leaveTypeCache = [];

    public function __construct(int $institutionId, int $uploadedBy, ?string $targetMonth = null)
    {
        $this->institutionId = $institutionId;
        $this->uploadedBy = $uploadedBy;
        $this->targetMonth = $targetMonth;
        $this->warmCaches();
    }

    protected function warmCaches(): void
    {
        $staff = User::whereHas('staffProfile', function ($q) {
            $q->where('institution_id', $this->institutionId);
        })->with('staffProfile')->get();

        foreach ($staff as $u) {
            if ($u->staffProfile?->employee_id) {
                $this->userCache['emp_' . strtolower(trim($u->staffProfile->employee_id))] = $u->id;
            }
            if ($u->email) {
                $this->userCache['email_' . strtolower(trim($u->email))] = $u->id;
            }
            $this->userCache['name_' . strtolower(trim($u->name))] = $u->id;
        }

        $leaveTypes = LeaveType::where('institution_id', $this->institutionId)->get();
        foreach ($leaveTypes as $lt) {
            $this->leaveTypeCache[strtolower(trim($lt->name))] = $lt->id;
        }
    }

    public function array(array $rows)
    {
        if (empty($rows)) {
            return;
        }

        // 1. Detect Month
        $month = $this->targetMonth;
        if (!$month) {
            $month = $this->detectMonthFromRows($rows);
        }

        // 2. Detect if Calendar Matrix view or Flat view
        $matrixHeaderIndex = $this->findMatrixHeaderRowIndex($rows);

        if ($matrixHeaderIndex !== null) {
            $this->processCalendarMatrix($rows, $matrixHeaderIndex, $month);
        } else {
            $this->processFlatRows($rows);
        }
    }

    /**
     * Process Calendar Matrix format (Days 1..31 across columns)
     */
    protected function processCalendarMatrix(array $rows, int $headerRowIndex, string $month): void
    {
        $headerRow = $rows[$headerRowIndex];

        $empIdCol = 0;
        $nameCol = 1;
        $dayColumns = []; // colIndex => dayNumber

        foreach ($headerRow as $colIdx => $val) {
            $cleaned = strtolower(trim((string) $val));
            if (str_contains($cleaned, 'employee') || str_contains($cleaned, 'emp')) {
                $empIdCol = $colIdx;
            } elseif (str_contains($cleaned, 'name') || str_contains($cleaned, 'staff')) {
                $nameCol = $colIdx;
            } elseif (is_numeric($cleaned)) {
                $dayNum = intval($cleaned);
                if ($dayNum >= 1 && $dayNum <= 31) {
                    $dayColumns[$colIdx] = $dayNum;
                }
            }
        }

        $daysInMonth = Carbon::parse($month . '-01')->daysInMonth;

        // Process staff data rows
        for ($r = $headerRowIndex + 1; $r < count($rows); $r++) {
            $row = $rows[$r];
            if (empty($row)) continue;

            $empId = trim((string) ($row[$empIdCol] ?? ''));
            $name = trim((string) ($row[$nameCol] ?? ''));

            if (empty($empId) && empty($name)) {
                continue;
            }

            $userId = $this->resolveUserId($empId, '', $name);
            if (!$userId) {
                $ident = $name ?: $empId;
                $this->rowErrors[] = "Staff '{$ident}' could not be matched with institution records.";
                $this->skippedCount++;
                continue;
            }

            // Iterate across each day column
            foreach ($dayColumns as $colIdx => $dayNum) {
                if ($dayNum > $daysInMonth) {
                    continue;
                }

                $dateStr = sprintf('%s-%02d', $month, $dayNum);
                $rawVal = trim((string) ($row[$colIdx] ?? ''));

                if ($rawVal === '' || $rawVal === '-' || $rawVal === '—') {
                    continue;
                }

                $status = $this->normalizeStatus($rawVal);

                if ($status) {
                    try {
                        StaffAttendance::updateOrCreate(
                            [
                                'institution_id' => $this->institutionId,
                                'user_id'        => $userId,
                                'date'           => $dateStr,
                            ],
                            [
                                'status'        => $status,
                                'leave_type_id' => null,
                                'remarks'       => 'Imported from monthly calendar',
                            ]
                        );
                        $this->importedCount++;
                    } catch (\Throwable $e) {
                        Log::warning('StaffAttendanceBulkImport matrix row error', [
                            'user_id' => $userId,
                            'date'    => $dateStr,
                            'error'   => $e->getMessage(),
                        ]);
                        $this->skippedCount++;
                    }
                } elseif (strtoupper($rawVal) === 'CLEAR') {
                    StaffAttendance::where('institution_id', $this->institutionId)
                        ->where('user_id', $userId)
                        ->where('date', $dateStr)
                        ->delete();
                }
            }
        }
    }

    /**
     * Fallback processor for flat row format (employee_id, date, status)
     */
    protected function processFlatRows(array $rows): void
    {
        $headerRow = $rows[0] ?? [];
        $headerMap = [];
        foreach ($headerRow as $idx => $val) {
            $headerMap[strtolower(trim((string) $val))] = $idx;
        }

        $empIdx = $headerMap['employee_id'] ?? $headerMap['emp_id'] ?? null;
        $nameIdx = $headerMap['name'] ?? $headerMap['staff_name'] ?? null;
        $emailIdx = $headerMap['email'] ?? null;
        $dateIdx = $headerMap['date'] ?? null;
        $statusIdx = $headerMap['status'] ?? null;

        if ($dateIdx === null || $statusIdx === null) {
            $this->rowErrors[] = "Unrecognized Excel format. Please use the calendar template.";
            return;
        }

        for ($r = 1; $r < count($rows); $r++) {
            $row = $rows[$r];
            $empId = $empIdx !== null ? trim((string)($row[$empIdx] ?? '')) : '';
            $name = $nameIdx !== null ? trim((string)($row[$nameIdx] ?? '')) : '';
            $email = $emailIdx !== null ? trim((string)($row[$emailIdx] ?? '')) : '';
            $rawDate = $row[$dateIdx] ?? null;
            $rawStatus = trim((string)($row[$statusIdx] ?? ''));

            if (empty($empId) && empty($name) && empty($email) && empty($rawDate)) {
                continue;
            }

            $userId = $this->resolveUserId($empId, $email, $name);
            if (!$userId) {
                $this->skippedCount++;
                continue;
            }

            $date = $this->parseDate($rawDate);
            $status = $this->normalizeStatus($rawStatus);

            if ($date && $status) {
                StaffAttendance::updateOrCreate(
                    [
                        'institution_id' => $this->institutionId,
                        'user_id'        => $userId,
                        'date'           => $date,
                    ],
                    [
                        'status'  => $status,
                        'remarks' => 'Imported via flat file',
                    ]
                );
                $this->importedCount++;
            } else {
                $this->skippedCount++;
            }
        }
    }

    protected function detectMonthFromRows(array $rows): string
    {
        for ($i = 0; $i < min(5, count($rows)); $i++) {
            $row = $rows[$i] ?? [];
            foreach ($row as $cell) {
                $str = (string) $cell;
                // Match "Month: YYYY-MM" or "YYYY-MM"
                if (preg_match('/\b(\d{4})-(0[1-9]|1[0-2])\b/', $str, $matches)) {
                    return $matches[0];
                }
                // Try month names like "September 2026"
                try {
                    $parsed = Carbon::parse($str);
                    if ($parsed->year > 2000 && $parsed->year < 2100) {
                        return $parsed->format('Y-m');
                    }
                } catch (\Throwable) {}
            }
        }
        return Carbon::today()->format('Y-m');
    }

    protected function findMatrixHeaderRowIndex(array $rows): ?int
    {
        for ($i = 0; $i < min(8, count($rows)); $i++) {
            $row = $rows[$i] ?? [];
            $numericDayCount = 0;
            foreach ($row as $cell) {
                $val = trim((string) $cell);
                if (is_numeric($val)) {
                    $n = intval($val);
                    if ($n >= 1 && $n <= 31) {
                        $numericDayCount++;
                    }
                }
            }
            // If row has 10 or more day numbers (1..N), it's definitely the calendar header row
            if ($numericDayCount >= 10) {
                return $i;
            }
        }
        return null;
    }

    protected function resolveUserId(string $employeeId, string $email, string $name): ?int
    {
        if (!empty($employeeId) && isset($this->userCache['emp_' . strtolower($employeeId)])) {
            return $this->userCache['emp_' . strtolower($employeeId)];
        }
        if (!empty($email) && isset($this->userCache['email_' . strtolower($email)])) {
            return $this->userCache['email_' . strtolower($email)];
        }
        if (!empty($name) && isset($this->userCache['name_' . strtolower($name)])) {
            return $this->userCache['name_' . strtolower($name)];
        }
        return null;
    }

    protected function normalizeStatus(string $raw): ?string
    {
        $cleaned = strtolower(trim($raw));
        return match ($cleaned) {
            'p', 'present', 'pr' => 'present',
            'a', 'absent', 'ab' => 'absent',
            'h', 'hd', 'half_day', 'half day', 'half-day' => 'half_day',
            'l', 'leave', 'on_leave', 'on leave', 'on-leave', 'lv' => 'on_leave',
            default => null,
        };
    }

    protected function parseDate($value): ?string
    {
        if (empty($value)) return null;
        try {
            if (is_numeric($value)) {
                return Carbon::instance(\PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($value))->format('Y-m-d');
            }
            return Carbon::parse($value)->format('Y-m-d');
        } catch (\Throwable) {
            return null;
        }
    }

    public function getImportedCount(): int
    {
        return $this->importedCount;
    }

    public function getSkippedCount(): int
    {
        return $this->skippedCount;
    }

    public function getRowErrors(): array
    {
        return $this->rowErrors;
    }
}
