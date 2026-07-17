<?php

namespace App\Imports;

use App\Models\Role;
use App\Models\StudentProfile;
use App\Imports\Concerns\StudentImportHelpers;
use App\Imports\Concerns\SkipsInstructionRows;
use App\Services\StudentIdentifierService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;

/**
 * Import students as CANDIDATES (pre-admission).
 *
 * Differences from ExistingStudentBulkImport:
 * - Assigns `candidate` role (not `student`)
 * - No LmsClass enrollment, fee ledger, or notifications
 * - No dedup logic (handled separately during admission)
 */
class StudentBulkImport implements ToModel, WithHeadingRow, WithValidation, WithBatchInserts, WithChunkReading, SkipsOnFailure, SkipsEmptyRows
{
    use SkipsFailures, SkipsInstructionRows, StudentImportHelpers;

    protected string $importModule = 'students';

    protected array $usedEmails = [];
    protected array $usedMobiles = [];
    protected int $institutionId;
    protected int $importedCount = 0;
    protected int $skippedCount = 0;
    protected int $dedupSkipped = 0;
    protected array $rowErrors = [];
    protected ?int $candidateRoleId = null;

    protected array $streamCache = [];
    protected array $sessionCache = [];
    protected array $classAliases = [];

    public function __construct(int $institutionId)
    {
        $this->institutionId = $institutionId;
        $this->candidateRoleId = Role::where('key', 'candidate')->value('id');
        $this->classAliases = config('class_aliases', []);
    }

    public function model(array $row)
    {
        $name = trim($row['name'] ?? $row['students'] ?? '');
        if (empty($name)) {
            $this->skippedCount++;
            $this->rowErrors[] = "Skipped (Student name is missing)";
            return null;
        }

        // ── Resolve stream ──
        $stream = $this->resolveStreamFromRow($row, $name);
        if ($stream === false) {
            $this->skippedCount++;
            return null;
        }

        // ── Resolve session ──
        $sessionId = $this->resolveSessionFromRow($row, $name);
        if ($sessionId === false) {
            $this->skippedCount++;
            return null;
        }

        $email  = trim($row['email'] ?? '');
        $mobile = trim($row['mobile'] ?? '');

        // ── Contact uniqueness ──
        $finalEmail  = !empty($email) ? $this->resolveUniqueEmail($email) : null;
        $finalMobile = !empty($mobile) ? $this->resolveUniqueMobile($mobile) : null;

        try {
            // 1. Create User (verified, with default password)
            [$user, $plainPassword] = $this->createUserForImport($name, $finalEmail, $finalMobile);

            // 2. Assign CANDIDATE role
            if ($this->candidateRoleId) {
                DB::table('user_roles')->insertOrIgnore([
                    'user_id'        => $user->id,
                    'role_id'        => $this->candidateRoleId,
                    'institution_id' => $this->institutionId,
                    'assigned_at'    => now(),
                ]);
            }

            // 3. Create StudentProfile
            $profileData = $this->buildProfileData($row, $user, $stream, $sessionId, $mobile);
            $identifierService = app(StudentIdentifierService::class);
            $profileData['reg_no']  = $row['reg_no'] ?? $identifierService->generateRegNumber($this->institutionId, $sessionId);
            $profileData['roll_no'] = $row['roll_no'] ?? $identifierService->generateRollNumber($this->institutionId, $sessionId, $stream?->id);

            StudentProfile::create($profileData);

            // 4. Create Guardian
            $this->createGuardianIfAvailable($row, $user, $email, $mobile);

            $this->importedCount++;
        } catch (\Throwable $e) {
            Log::warning('StudentBulkImport row error', ['name' => $name, 'error' => $e->getMessage()]);
            $this->rowErrors[] = "Student '{$name}': " . $e->getMessage();
            $this->skippedCount++;
        }

        return null;
    }

    // ── Validation ──────────────────────────────────────────────────

    public function prepareForValidation($data, $index)
    {
        $hasData = collect($data)->filter(fn($v) => !is_null($v) && trim((string) $v) !== '')->isNotEmpty();
        if (!$hasData || empty(trim($data['name'] ?? ''))) {
            return [];
        }

        return $this->normalizeImportRow($data);
    }

    public function rules(): array
    {
        $validClasses = implode(',', array_keys($this->classAliases));

        return [
            'name'         => 'required|string|max:200',
            'email'        => 'required_without:*.mobile|nullable|email',
            'mobile'       => 'required_without:*.email|nullable|string|min:10|max:15',
            'class'        => "nullable|string|in:{$validClasses}",
            'stream_code'  => 'nullable|string|max:30',
            'gender'       => 'nullable|string|in:Male,Female,Other',
            'session_name' => ['nullable', 'string', 'regex:/^\d{4}-\d{2,4}$/'],
            'dob'          => 'nullable',
        ];
    }

    public function customValidationMessages(): array
    {
        return [
            'name.required'             => 'Student name is required.',
            'class.in'                  => 'Invalid class ":input". Valid: NUR, LKG, UKG, I-VIII, IX, X, NC.',
            'gender.in'                 => 'Invalid gender ":input". Valid: BOY, GIRL, Male, Female.',
            'session_name.regex'        => 'Invalid session format ":input". Use: 2025-26 or 2025-2026.',
            'mobile.min'                => 'Mobile must be at least 10 digits.',
            'email.required_without'    => 'At least one contact method (Email or Mobile) must be provided.',
            'mobile.required_without'   => 'At least one contact method (Email or Mobile) must be provided.',
        ];
    }
}
