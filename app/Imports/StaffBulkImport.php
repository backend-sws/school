<?php

namespace App\Imports;

use App\Enums\StaffCategory;
use App\Models\User;
use App\Models\Role;
use App\Models\StaffProfile;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;

class StaffBulkImport implements ToModel, WithHeadingRow, WithBatchInserts, WithChunkReading, SkipsOnFailure
{
    use SkipsFailures;

    protected int $institutionId;
    protected int $importedCount = 0;
    protected int $skippedCount = 0;
    protected array $rowErrors = [];
    protected ?int $staffRoleId = null;

    public function __construct(int $institutionId)
    {
        $this->institutionId = $institutionId;
        $this->staffRoleId = Role::where('key', 'staff')->value('id');
    }

    public function model(array $row)
    {
        $name = trim($row['name'] ?? '');
        $email = trim($row['email'] ?? '');

        if (empty($name) || empty($email)) {
            $this->skippedCount++;
            return null;
        }

        // Skip if staff already exists with this email for this institution
        $existingUser = User::where('email', $email)->first();
        if ($existingUser && StaffProfile::where('user_id', $existingUser->id)->where('institution_id', $this->institutionId)->exists()) {
            $this->skippedCount++;
            return null;
        }

        try {
            // Create or reuse user
            $user = $existingUser ?? User::create([
                'name' => $name,
                'email' => $email,
                'mobile' => $row['mobile'] ?? null,
                'institution_id' => $this->institutionId,
                'password' => Hash::make(bin2hex(random_bytes(16))), // random unusable password
                'email_verified_at' => null,
                'status' => 1,
            ]);

            // Assign staff role
            if ($this->staffRoleId && !$user->roles()->where('role_id', $this->staffRoleId)->exists()) {
                $user->roles()->attach($this->staffRoleId, ['assigned_at' => now()]);
            }

            // Map category text to enum
            $categoryValue = null;
            $categoryText = strtolower(trim($row['category'] ?? ''));
            if ($categoryText === 'teaching') {
                $categoryValue = StaffCategory::TEACHING->value;
            } elseif ($categoryText === 'non-teaching' || $categoryText === 'non_teaching') {
                $categoryValue = StaffCategory::NON_TEACHING->value;
            }

            // Create staff profile
            StaffProfile::create([
                'user_id' => $user->id,
                'institution_id' => $this->institutionId,
                'employee_id' => $row['employee_id'] ?? null,
                'designation' => $row['designation'] ?? null,
                'category' => $categoryValue,
                'joining_date' => $this->parseDate($row['joining_date'] ?? null),
                'status' => 1,
            ]);

            $this->importedCount++;
        } catch (\Throwable $e) {
            Log::warning('StaffBulkImport row error', ['name' => $name, 'error' => $e->getMessage()]);
            $this->rowErrors[] = "Staff '{$name}': " . $e->getMessage();
            $this->skippedCount++;
        }

        return null;
    }

    protected function parseDate($value): ?string
    {
        if (empty($value))
            return null;
        try {
            if (is_numeric($value)) {
                return Carbon::instance(\PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($value))->format('Y-m-d');
            }
            return Carbon::parse($value)->format('Y-m-d');
        } catch (\Exception $e) {
            return null;
        }
    }

    public function batchSize(): int
    {
        return 25;
    }
    public function chunkSize(): int
    {
        return 50;
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
