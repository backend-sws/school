<?php

namespace App\Imports;

use App\Models\AttendanceRecord;
use App\Models\LmsClassEnrollment;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToArray;

class StudentAttendanceBulkImport implements ToArray
{
    protected int $institutionId;
    protected int $uploadedBy;
    protected int $lmsClassId;
    protected ?int $allocationId;
    protected ?string $targetMonth;
    protected int $importedCount = 0;
    protected int $skippedCount = 0;
    protected array $rowErrors = [];

    // Caches
    protected array $studentCache = [];

    public function __construct(int $institutionId, int $uploadedBy, int $lmsClassId, ?int $allocationId = null, ?string $targetMonth = null)
    {
        $this->institutionId = $institutionId;
        $this->uploadedBy = $uploadedBy;
        $this->lmsClassId = $lmsClassId;
        $this->allocationId = $allocationId;
        $this->targetMonth = $targetMonth;
        $this->warmCaches();
    }

    protected function warmCaches(): void
    {
        $enrollments = LmsClassEnrollment::query()
            ->where('lms_class_id', $this->lmsClassId)
            ->where('role', 'student')
            ->where('status', 'active')
            ->with(['user.studentProfile'])
            ->get();

        foreach ($enrollments as $enr) {
            $user = $enr->user;
            if (!$user) continue;

            $this->studentCache['id_' . $user->id] = $user->id;

            if ($user->studentProfile?->roll_no) {
                $this->studentCache['roll_' . strtolower(trim((string) $user->studentProfile->roll_no))] = $user->id;
            }
            if ($user->studentProfile?->reg_no) {
                $this->studentCache['reg_' . strtolower(trim((string) $user->studentProfile->reg_no))] = $user->id;
            }
            if ($user->email) {
                $this->studentCache['email_' . strtolower(trim($user->email))] = $user->id;
            }
            if ($user->name) {
                $this->studentCache['name_' . strtolower(trim($user->name))] = $user->id;
            }
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

        $rollOrIdCol = 0;
        $nameCol = 1;
        $dayColumns = []; // colIndex => dayNumber

        foreach ($headerRow as $colIdx => $val) {
            $cleaned = strtolower(trim((string) $val));
            if (str_contains($cleaned, 'roll') || str_contains($cleaned, 'id')) {
                $rollOrIdCol = $colIdx;
            } elseif (str_contains($cleaned, 'name') || str_contains($cleaned, 'student')) {
                $nameCol = $colIdx;
            } elseif (is_numeric($cleaned)) {
                $dayNum = intval($cleaned);
                if ($dayNum >= 1 && $dayNum <= 31) {
                    $dayColumns[$colIdx] = $dayNum;
                }
            }
        }

        $daysInMonth = Carbon::parse($month . '-01')->daysInMonth;

        // Process student data rows
        for ($r = $headerRowIndex + 1; $r < count($rows); $r++) {
            $row = $rows[$r];
            if (empty($row)) continue;

            $rollOrId = trim((string) ($row[$rollOrIdCol] ?? ''));
            $name = trim((string) ($row[$nameCol] ?? ''));

            if (empty($rollOrId) && empty($name)) {
                continue;
            }

            $userId = $this->resolveUserId($rollOrId, '', $name);
            if (!$userId) {
                $ident = $name ?: $rollOrId;
                $this->rowErrors[] = "Student '{$ident}' is not enrolled in this class.";
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
                        AttendanceRecord::updateOrCreate(
                            [
                                'institution_id'              => $this->institutionId,
                                'lms_class_id'                => $this->lmsClassId,
                                'class_subject_allocation_id' => $this->allocationId,
                                'user_id'                     => $userId,
                                'date'                        => $dateStr,
                            ],
                            [
                                'status'    => $status,
                                'marked_by' => $this->uploadedBy,
                                'remarks'   => 'Imported from Excel monthly register',
                            ]
                        );
                        $this->importedCount++;
                    } catch (\Throwable $e) {
                        Log::warning('StudentAttendanceBulkImport matrix row error', [
                            'user_id' => $userId,
                            'date'    => $dateStr,
                            'error'   => $e->getMessage(),
                        ]);
                        $this->skippedCount++;
                    }
                } elseif (strtoupper($rawVal) === 'CLEAR') {
                    AttendanceRecord::where('institution_id', $this->institutionId)
                        ->where('lms_class_id', $this->lmsClassId)
                        ->when($this->allocationId, fn($q) => $q->where('class_subject_allocation_id', $this->allocationId), fn($q) => $q->whereNull('class_subject_allocation_id'))
                        ->where('user_id', $userId)
                        ->where('date', $dateStr)
                        ->delete();
                }
            }
        }
    }

    /**
     * Fallback processor for flat row format (roll_no/id, date, status)
     */
    protected function processFlatRows(array $rows): void
    {
        $headerRow = $rows[0] ?? [];
        $headerMap = [];
        foreach ($headerRow as $idx => $val) {
            $headerMap[strtolower(trim((string) $val))] = $idx;
        }

        $idIdx = $headerMap['user_id'] ?? $headerMap['id'] ?? $headerMap['roll_no'] ?? $headerMap['roll'] ?? null;
        $nameIdx = $headerMap['name'] ?? $headerMap['student_name'] ?? null;
        $emailIdx = $headerMap['email'] ?? null;
        $dateIdx = $headerMap['date'] ?? null;
        $statusIdx = $headerMap['status'] ?? null;

        if ($dateIdx === null || $statusIdx === null) {
            $this->rowErrors[] = "Unrecognized Excel format. Please use the calendar register template.";
            return;
        }

        for ($r = 1; $r < count($rows); $r++) {
            $row = $rows[$r];
            $idOrRoll = $idIdx !== null ? trim((string)($row[$idIdx] ?? '')) : '';
            $name = $nameIdx !== null ? trim((string)($row[$nameIdx] ?? '')) : '';
            $email = $emailIdx !== null ? trim((string)($row[$emailIdx] ?? '')) : '';
            $rawDate = $row[$dateIdx] ?? null;
            $rawStatus = trim((string)($row[$statusIdx] ?? ''));

            if (empty($idOrRoll) && empty($name) && empty($email) && empty($rawDate)) {
                continue;
            }

            $userId = $this->resolveUserId($idOrRoll, $email, $name);
            if (!$userId) {
                $this->skippedCount++;
                continue;
            }

            $date = $this->parseDate($rawDate);
            $status = $this->normalizeStatus($rawStatus);

            if ($date && $status) {
                AttendanceRecord::updateOrCreate(
                    [
                        'institution_id'              => $this->institutionId,
                        'lms_class_id'                => $this->lmsClassId,
                        'class_subject_allocation_id' => $this->allocationId,
                        'user_id'                     => $userId,
                        'date'                        => $date,
                    ],
                    [
                        'status'    => $status,
                        'marked_by' => $this->uploadedBy,
                        'remarks'   => 'Imported from Excel flat list',
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
                if (preg_match('/\b(\d{4})-(0[1-9]|1[0-2])\b/', $str, $matches)) {
                    return $matches[0];
                }
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
            if ($numericDayCount >= 10) {
                return $i;
            }
        }
        return null;
    }

    protected function resolveUserId(string $idOrRoll, string $email, string $name): ?int
    {
        // Check if raw id number exists e.g. "573" or "ID: 573"
        $digitsOnly = preg_replace('/[^\d]/', '', $idOrRoll);
        if ($digitsOnly && isset($this->studentCache['id_' . (int)$digitsOnly])) {
            return $this->studentCache['id_' . (int)$digitsOnly];
        }

        if (!empty($idOrRoll) && isset($this->studentCache['roll_' . strtolower($idOrRoll)])) {
            return $this->studentCache['roll_' . strtolower($idOrRoll)];
        }
        if (!empty($idOrRoll) && isset($this->studentCache['reg_' . strtolower($idOrRoll)])) {
            return $this->studentCache['reg_' . strtolower($idOrRoll)];
        }
        if (!empty($email) && isset($this->studentCache['email_' . strtolower($email)])) {
            return $this->studentCache['email_' . strtolower($email)];
        }
        if (!empty($name) && isset($this->studentCache['name_' . strtolower($name)])) {
            return $this->studentCache['name_' . strtolower($name)];
        }
        return null;
    }

    protected function normalizeStatus(string $raw): ?string
    {
        $cleaned = strtolower(trim($raw));
        return match ($cleaned) {
            'p', 'present', 'pr' => 'present',
            'a', 'absent', 'ab' => 'absent',
            'lt', 'late' => 'late',
            'l', 'leave', 'on_leave', 'lv' => 'leave',
            'h', 'hd', 'hol', 'holiday' => 'holiday',
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
