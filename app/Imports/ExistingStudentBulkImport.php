<?php

namespace App\Imports;

use App\Models\User;
use App\Models\Role;
use App\Models\Stream;
use App\Models\Session;
use App\Models\Institution;
use App\Models\StudentProfile;
use App\Models\FeePayment;
use App\Models\FeeRegulationProfile;
use App\Models\LmsClass;
use App\Models\LmsClassEnrollment;
use App\Exports\ImportTemplateExport;
use App\Imports\Concerns\StudentImportHelpers;
use App\Imports\Concerns\TracksImportProgress;
use App\Notifications\StudentImportWelcomeNotification;
use App\Services\StudentIdentifierService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use PhpOffice\PhpSpreadsheet\IOFactory;

/**
 * Imports already-admitted ("existing") students directly as enrolled users.
 *
 * Unique features vs StudentBulkImport:
 * - Assigns `student` role (not `candidate`)
 * - O(1) batch + DB dedup (name|mobile|class|father)
 * - Auto-enrolls into LmsClass (including NC generic class)
 * - Creates fee ledger entry from CSV fee columns
 * - Sends welcome notification
 * - Smart heading row auto-detection for templates
 */
class ExistingStudentBulkImport implements ToModel, WithHeadingRow, WithValidation, WithBatchInserts, WithChunkReading, SkipsOnFailure, SkipsEmptyRows
{
    use SkipsFailures, TracksImportProgress, StudentImportHelpers;

    protected string $importModule = 'existing_students';
    protected ?int $detectedHeadingRow = null;
    protected ?string $filePath = null;
    protected ?string $fileDisk = null;

    protected array $usedEmails = [];
    protected array $usedMobiles = [];
    protected array $dedupIndex = [];     // O(1) dedup hash
    protected int $institutionId;
    protected int $importedCount = 0;
    protected int $skippedCount = 0;
    protected int $dedupSkipped = 0;
    protected array $rowErrors = [];
    protected ?int $studentRoleId = null;
    protected ?string $institutionCode = null;

    protected array $streamCache = [];
    protected array $sessionCache = [];
    protected array $lmsClassCache = [];
    protected array $classAliases = [];

    public function __construct(int $institutionId, ?string $filePath = null, ?string $fileDisk = null)
    {
        $this->institutionId = $institutionId;
        $this->filePath = $filePath;
        $this->fileDisk = $fileDisk;

        // Resolve student role (enrolled)
        $this->studentRoleId = Role::forInstitution($institutionId)->where('key', 'student')->value('id')
            ?? Role::withoutGlobalScope('institution_scope')->where('key', 'student')->value('id');

        // Resolve institution code for reg number generation
        $institution = Institution::find($institutionId);
        if ($institution) {
            $code = $institution->code;
            if (empty($code)) {
                $words = preg_split('/[\s\-_]+/', trim($institution->name ?? 'INST'));
                $code = collect($words)
                    ->filter(fn($w) => strlen($w) > 0)
                    ->map(fn($w) => strtoupper(mb_substr($w, 0, 1)))
                    ->implode('');
            }
            $this->institutionCode = strtoupper($code);
        }

        $this->classAliases = config('class_aliases', []);

        // Auto-detect heading row
        if ($filePath) {
            $this->detectedHeadingRow = $this->detectHeadingRow($filePath, $fileDisk);
        }
    }

    // ── Heading Detection (unique to template-based imports) ─────

    protected function detectHeadingRow(string $filePath, ?string $disk): int
    {
        $knownHeaders = ['students', 'student_name', 'name', 'class', 'session_name', 'session', 'roll_no', 'reg_no'];
        $fallback = ImportTemplateExport::getHeadingRow($this->importModule);

        try {
            if ($disk) {
                $tempFile = tempnam(sys_get_temp_dir(), 'import_detect_');
                $contents = Storage::disk($disk)->get($filePath);
                file_put_contents($tempFile, $contents);
                $shouldCleanup = true;
            } elseif (file_exists($filePath)) {
                $tempFile = $filePath;
                $shouldCleanup = false;
            } else {
                return $fallback;
            }

            $reader = IOFactory::createReaderForFile($tempFile);
            $reader->setReadDataOnly(true);
            $spreadsheet = $reader->load($tempFile);
            $sheet = $spreadsheet->getActiveSheet();

            $maxScan = min(30, $sheet->getHighestRow());
            for ($row = 1; $row <= $maxScan; $row++) {
                $cells = [];
                foreach ($sheet->getRowIterator($row, $row) as $rowObj) {
                    foreach ($rowObj->getCellIterator() as $cell) {
                        $val = strtolower(trim((string) $cell->getValue()));
                        if (!empty($val)) {
                            $cells[] = $val;
                        }
                    }
                }

                if (count(array_intersect($knownHeaders, $cells)) >= 3) {
                    if ($shouldCleanup) @unlink($tempFile);
                    return $row;
                }
            }

            if ($shouldCleanup) @unlink($tempFile);
        } catch (\Throwable $e) {
            Log::warning("Import heading auto-detect failed", ['error' => $e->getMessage()]);
        }

        return $fallback;
    }

    public function headingRow(): int
    {
        return $this->detectedHeadingRow ?? ImportTemplateExport::getHeadingRow($this->importModule);
    }

    // ── Main Import Logic ───────────────────────────────────────────

    public function model(array $row)
    {
        $this->tickProgress();

        $name = trim($row['students'] ?? $row['name'] ?? '');
        if (empty($name)) {
            $this->skippedCount++;
            $this->rowErrors[] = "Skipped (Student name is missing)";
            return null;
        }

        // ── Stage 3: O(1) Dedup ──
        if ($this->isDuplicate($row, $name)) {
            return null;
        }

        // ── Resolve Stream ──
        $stream = $this->resolveStreamFromRow($row, $name);
        if ($stream === false) {
            $this->skippedCount++;
            return null;
        }

        // ── Resolve Session ──
        $sessionId = $this->resolveSessionFromRow($row, $name, autoCreate: true);
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
            // ── 1. Create User (verified, with default password) ──
            [$user, $plainPassword] = $this->createUserForImport($name, $finalEmail, $finalMobile);

            // ── 2. Assign STUDENT role ──
            if ($this->studentRoleId) {
                DB::table('user_roles')->insertOrIgnore([
                    'user_id'        => $user->id,
                    'role_id'        => $this->studentRoleId,
                    'institution_id' => $this->institutionId,
                    'assigned_at'    => now(),
                ]);
            }

            // ── 3. Generate identifiers ──
            $identifierService = app(StudentIdentifierService::class);
            $regNo  = $identifierService->generateRegNumber($this->institutionId, $sessionId);
            $rollNo = trim($row['roll_no'] ?? '') ?: $identifierService->generateRollNumber($this->institutionId, $sessionId, $stream?->id);

            // ── 4. Create StudentProfile ──
            $profileData = $this->buildProfileData($row, $user, $stream, $sessionId, $mobile);
            $profileData['reg_no']  = $regNo;
            $profileData['roll_no'] = $rollNo;

            // Auto-resolve Fee Profile based on class/stream, category, and gender
            $feeEngine = app(\App\Services\FeeCalculationEngine::class);
            $resolvedProfile = null;
            
            if ($stream) {
                $resolvedProfile = $feeEngine->resolveProfile(
                    $this->institutionId,
                    $stream->name,
                    $row['category'] ?? null,
                    $row['gender'] ?? null
                );
            }
            if (!$resolvedProfile && isset($row['class'])) {
                $resolvedProfile = $feeEngine->resolveProfile(
                    $this->institutionId,
                    $row['class'],
                    $row['category'] ?? null,
                    $row['gender'] ?? null
                );
            }
            // Fallback: match by profile name (contains stream name)
            if (!$resolvedProfile && $stream) {
                $resolvedProfile = \App\Models\FeeRegulationProfile::where('institution_id', $this->institutionId)
                    ->where('name', 'LIKE', "%{$stream->name}%")
                    ->first();
            }
            // Fallback: match by profile name (contains original class name)
            if (!$resolvedProfile && isset($row['class'])) {
                $resolvedProfile = \App\Models\FeeRegulationProfile::where('institution_id', $this->institutionId)
                    ->where('name', 'LIKE', "%{$row['class']}%")
                    ->first();
            }
            if (!$resolvedProfile) {
                $resolvedProfile = \App\Models\FeeRegulationProfile::where('institution_id', $this->institutionId)
                    ->where('is_default', true)
                    ->first();
            }
            $feeProfileId = $resolvedProfile?->id;
            
            $profileData['fee_regulation_profile_id'] = $feeProfileId;
            
            // Set admission date: use today for current session, session start date for historical sessions
            $resolvedSession = \App\Models\Session::find($sessionId);
            if ($resolvedSession) {
                if ($resolvedSession->is_current) {
                    $profileData['admission_date'] = now()->toDateString();
                } else {
                    $profileData['admission_date'] = "{$resolvedSession->start_year}-04-01"; // start of session
                }
            } else {
                $profileData['admission_date'] = now()->toDateString();
            }

            StudentProfile::create($profileData);

            // ── 5. Enroll in LmsClass ──
            $section = strtoupper(trim($row['section'] ?? 'A')) ?: 'A';
            if ($stream && $sessionId) {
                $this->enrollInLmsClass($user->id, $stream, $sessionId, $section);
            } elseif ($sessionId) {
                $this->enrollInGenericClass($user->id, $sessionId, $section);
            }

            // ── 6. Create Guardian ──
            $this->createGuardianIfAvailable($row, $user, $email, $mobile);

            // ── 7. Fee Ledger & One-Time Admission Fee Handling ──
            $this->processAdmissionFeeAndLedger(
                $row,
                $user,
                $sessionId,
                $resolvedProfile,
                $profileData['admission_date'] ?? null
            );

            // ── 8. Notification (includes default password) ──
            try {
                $user->notify(new StudentImportWelcomeNotification($this->institutionId, $regNo, $plainPassword));
            } catch (\Throwable $e) {
                Log::warning('Import notification failed', ['name' => $name, 'error' => $e->getMessage()]);
            }

            $this->importedCount++;
        } catch (\Throwable $e) {
            Log::warning('ExistingStudentBulkImport row error', ['name' => $name, 'error' => $e->getMessage()]);
            $this->rowErrors[] = "Student '{$name}': " . $e->getMessage();
            $this->skippedCount++;
        }

        return null;
    }

    // ── Unique Logic: Dedup ─────────────────────────────────────────

    /**
     * O(1) dedup: name|mobile|class|father — batch + DB check.
     */
    protected function isDuplicate(array $row, string $name): bool
    {
        $rawMobile   = trim($row['mobile'] ?? '');
        $rawClass    = strtoupper(trim($row['class'] ?? ''));
        $rawFather   = mb_strtolower(trim($row['father_name'] ?? ''));
        $dedupKey    = mb_strtolower(trim($name)) . '|' . $rawMobile . '|' . $rawClass . '|' . $rawFather;

        // 1. Batch check
        if (isset($this->dedupIndex[$dedupKey])) {
            $this->dedupSkipped++;
            return true;
        }

        // 2. DB check
        $exists = User::where('institution_id', $this->institutionId)
            ->where('name', $name)
            ->whereHas('studentProfile', function ($q) use ($rawMobile, $rawFather) {
                $q->where('institution_id', $this->institutionId);
                if (!empty($rawMobile)) {
                    $q->where('mobile', $rawMobile);
                } elseif (!empty($rawFather)) {
                    $q->where('father_name', $rawFather);
                }
            })
            ->exists();

        if ($exists) {
            $this->dedupSkipped++;
            $this->dedupIndex[$dedupKey] = true;
            return true;
        }

        $this->dedupIndex[$dedupKey] = true;
        return false;
    }

    // ── Unique Logic: LmsClass Enrollment ───────────────────────────

    protected function enrollInLmsClass(int $userId, Stream $stream, int $sessionId, string $section): void
    {
        $cacheKey = "{$stream->id}-{$sessionId}-{$section}";

        if (!isset($this->lmsClassCache[$cacheKey])) {
            // 1. Try exact match: stream + session + section
            $lmsClass = LmsClass::withoutGlobalScopes()
                ->where('institution_id', $this->institutionId)
                ->where('stream_id', $stream->id)
                ->where('session_id', $sessionId)
                ->where('section', $section)
                ->first();

            // 2. Fallback: reuse existing class with same stream + section (any session)
            if (!$lmsClass) {
                $lmsClass = LmsClass::withoutGlobalScopes()
                    ->where('institution_id', $this->institutionId)
                    ->where('stream_id', $stream->id)
                    ->where('section', $section)
                    ->first();

                if ($lmsClass) {
                    Log::info("Import: reusing existing class '{$lmsClass->name}' (session {$lmsClass->session_id}) for stream {$stream->id} section {$section} — CSV session was {$sessionId}");
                }
            }

            // 3. Create new class only if nothing exists at all
            if (!$lmsClass) {
                $name = $stream->name . ' – Section ' . $section;
                $words = preg_split('/\s+/', trim($name), -1, PREG_SPLIT_NO_EMPTY);
                $code = count($words) === 1
                    ? strtoupper(mb_substr($words[0], 0, 3))
                    : strtoupper(implode('', array_map(fn(string $w) => mb_substr($w, 0, 1), $words)));

                $lmsClass = LmsClass::withoutGlobalScopes()->create([
                    'institution_id' => $this->institutionId,
                    'stream_id'      => $stream->id,
                    'session_id'     => $sessionId,
                    'section'        => $section,
                    'name'           => $name,
                    'code'           => $code,
                    'status'         => 1,
                ]);
            }

            $this->lmsClassCache[$cacheKey] = $lmsClass;
        }

        LmsClassEnrollment::firstOrCreate(
            ['lms_class_id' => $this->lmsClassCache[$cacheKey]->id, 'user_id' => $userId],
            ['enrolled_at' => now(), 'role' => 'student', 'status' => 'active']
        );
    }

    protected function enrollInGenericClass(int $userId, int $sessionId, string $section = 'A'): void
    {
        $cacheKey = "nc-{$sessionId}-{$section}";

        if (!isset($this->lmsClassCache[$cacheKey])) {
            // 1. Exact match
            $lmsClass = LmsClass::withoutGlobalScopes()
                ->where('institution_id', $this->institutionId)
                ->whereNull('stream_id')
                ->where('session_id', $sessionId)
                ->where('section', $section)
                ->first();

            // 2. Fallback: any session
            if (!$lmsClass) {
                $lmsClass = LmsClass::withoutGlobalScopes()
                    ->where('institution_id', $this->institutionId)
                    ->whereNull('stream_id')
                    ->where('section', $section)
                    ->first();
            }

            // 3. Create new
            if (!$lmsClass) {
                $lmsClass = LmsClass::withoutGlobalScopes()->create([
                    'institution_id' => $this->institutionId,
                    'stream_id'      => null,
                    'session_id'     => $sessionId,
                    'section'        => $section,
                    'name'           => 'Non-Class – Section ' . $section,
                    'code'           => 'NC-' . $section,
                    'status'         => 1,
                ]);
            }

            $this->lmsClassCache[$cacheKey] = $lmsClass;
        }

        LmsClassEnrollment::firstOrCreate(
            ['lms_class_id' => $this->lmsClassCache[$cacheKey]->id, 'user_id' => $userId],
            ['enrolled_at' => now(), 'role' => 'student', 'status' => 'active']
        );
    }

    // ── Unique Logic: Admission Fee & Fee Ledger ────────────────────

    /**
     * Handle one-time admission fee and previous dues ledger.
     *
     * 1. If admission_fee_paid is YES, PAID, or a numeric amount:
     *    - Creates FeePayment (status = 'paid') with prefix 'PAY-ADM-'
     *    - Automatically recognized in Dashboard Analytics & Monthly Ledger
     *    - If paid amount < total one-time fee, the difference is carried to arrears
     *
     * 2. If admission_fee_paid is 0, EXEMPT, or NA:
     *    - Excluded from one-time fees (no payment, no dues)
     *
     * 3. If admission_fee_paid is BLANK or DUE / PENDING:
     *    - The entire one-time fee is considered unpaid and added to opening arrears (previous dues)
     */
    protected function processAdmissionFeeAndLedger(
        array $row,
        User $user,
        int $sessionId,
        ?FeeRegulationProfile $resolvedProfile,
        ?string $admissionDate
    ): void {
        // A. Resolve one-time fees from the student's fee profile
        $oneTimeItems = collect();
        if ($resolvedProfile) {
            $resolvedProfile->loadMissing('items.feeType');
            if ($resolvedProfile->items) {
                $oneTimeItems = $resolvedProfile->items->filter(function ($item) {
                    $cat = $item->feeType?->category;
                    if ($cat !== null && !in_array($cat, [\App\Enums\FeeCategory::RECURRING->value, \App\Enums\FeeCategory::DISCOUNT->value], true)) {
                        return (float) $item->amount > 0;
                    }
                    if ($cat === null && preg_match('/admission|registration|one[-_\s]?time|prospectus|caution|security/i', $item->feeType?->name ?? '')) {
                        return (float) $item->amount > 0;
                    }
                    return false;
                });
            }
        }

        $totalOneTimeFee = (float) $oneTimeItems->sum('amount');
        $primaryFeeTypeId = $oneTimeItems->first()?->fee_type_id;

        // B. Parse Excel inputs
        $rawAdmPaid = trim((string) ($row['admission_fee_paid'] ?? ''));
        $rawPaymentDate = trim((string) ($row['admission_payment_date'] ?? ''));
        $rawPaymentMode = strtolower(trim((string) ($row['admission_payment_mode'] ?? 'cash'))) ?: 'cash';
        $receiptNo = trim((string) ($row['admission_receipt_no'] ?? ''));

        $unpaidOneTime = 0.0;
        $paidAmount = 0.0;

        $isExempt = in_array(strtolower($rawAdmPaid), ['0', 'exempt', 'na', 'n/a', 'no_fee', 'promoted', 'none', 'false'], true);
        $isFullPaid = in_array(strtolower($rawAdmPaid), ['yes', 'paid', 'true', '1'], true);
        $cleanNumericPaid = preg_replace('/[^0-9.]/', '', $rawAdmPaid);
        $isNumericPaid = !$isExempt && $cleanNumericPaid !== '' && is_numeric($cleanNumericPaid) && (float) $cleanNumericPaid > 0;

        if ($isExempt) {
            // Old or exempt student: 0 paid, 0 added to dues
            $paidAmount = 0.0;
            $unpaidOneTime = 0.0;
        } elseif ($isFullPaid) {
            // Full one-time fee paid
            $paidAmount = $totalOneTimeFee > 0 ? $totalOneTimeFee : 0.0;
            $unpaidOneTime = 0.0;
        } elseif ($isNumericPaid) {
            // Specific amount paid
            $paidAmount = (float) $cleanNumericPaid;
            if ($totalOneTimeFee > 0 && $paidAmount < $totalOneTimeFee) {
                $unpaidOneTime = $totalOneTimeFee - $paidAmount;
            } else {
                $unpaidOneTime = 0.0;
            }
        } else {
            // Blank / Unspecified / DUE: Entire one-time fee is unpaid and carried to arrears
            $paidAmount = 0.0;
            $unpaidOneTime = $totalOneTimeFee;
        }

        // C. If an admission payment was made, record FeePayment (for Analytics & Ledger)
        if ($paidAmount > 0) {
            $paymentMode = in_array($rawPaymentMode, ['cash', 'online', 'upi', 'cheque', 'bank_transfer'], true)
                ? $rawPaymentMode
                : 'cash';

            $parsedDate = !empty($rawPaymentDate) ? $this->parseDate($rawPaymentDate) : null;
            $finalPaymentDate = $parsedDate ?? $admissionDate ?? now()->toDateString();
            $forMonth = substr($finalPaymentDate, 0, 7);

            if (empty($receiptNo)) {
                $receiptNo = 'ADM-' . date('Y') . '-' . strtoupper(Str::random(6));
            }

            $collectedBy = auth()->id() ?? $this->resolveCollectedBy() ?? 1;

            // fee_payments.fee_head_id has a foreign key to fee_heads(id)
            $verifiedFeeHeadId = $primaryFeeTypeId
                ? DB::table('fee_heads')->where('id', $primaryFeeTypeId)->value('id')
                : null;

            FeePayment::create([
                'institution_id'   => $this->institutionId,
                'payment_id'       => 'PAY-ADM-' . strtoupper(uniqid()),
                'user_id'          => $user->id,
                'fee_head_id'      => $verifiedFeeHeadId,
                'for_month'        => $forMonth,
                'amount'           => $paidAmount,
                'late_fee_applied' => 0,
                'total_amount'     => $paidAmount,
                'cash_amount'      => $paymentMode === 'cash' ? $paidAmount : 0,
                'online_amount'    => $paymentMode !== 'cash' ? $paidAmount : 0,
                'payment_mode'     => $paymentMode,
                'payment_status'   => 'paid',
                'payment_date'     => $finalPaymentDate,
                'receipt_no'       => $receiptNo,
                'remarks'          => 'Admission/one-time fee recorded on bulk import',
                'collected_by'     => $collectedBy,
                'process_status'   => 'approved',
            ]);
        }

        // D. Calculate total opening arrears (CSV previous dues + unpaid one-time fees)
        $rawDues = $row['previous_dues'] ?? $row['previous_due'] ?? $row['arrears'] ?? $row['opening_balance'] ?? null;
        $cleanDues = $rawDues !== null && $rawDues !== '' ? (float) preg_replace('/[^0-9.]/', '', (string) $rawDues) : 0.0;

        $totalArrears = $cleanDues + $unpaidOneTime;

        if ($totalArrears > 0) {
            \App\Models\StudentFeePeriodBalance::updateOrCreate([
                'institution_id' => $this->institutionId,
                'user_id'        => $user->id,
                'session_id'     => $sessionId,
                'period_key'     => 'arrears',
            ], [
                'frequency'       => 'annual',
                'opening_balance' => $totalArrears,
                'total_payable'   => $totalArrears,
                'closing_balance' => $totalArrears,
                'version_hash'    => md5((string) $totalArrears),
            ]);
        }
    }

    protected function resolveCollectedBy(): ?int
    {
        if (property_exists($this, 'importLog') && $this->importLog) {
            return $this->importLog->uploaded_by;
        }
        return User::where('institution_id', $this->institutionId)
            ->whereHas('roles', fn($q) => $q->whereIn('key', ['super_admin', 'admin']))
            ->value('id');
    }

    // ── Validation & Normalization ──────────────────────────────────

    public function prepareForValidation($data, $index)
    {
        $hasData = collect($data)->filter(fn($v) => !is_null($v) && trim((string) $v) !== '')->isNotEmpty();
        if (!$hasData || empty(trim($data['students'] ?? $data['name'] ?? ''))) {
            return [];
        }

        return $this->normalizeImportRow($data);
    }

    public function rules(): array
    {
        $aliasKeys = array_keys($this->classAliases);
        $allVariants = array_unique(array_merge(
            $aliasKeys,
            array_map('strtolower', $aliasKeys),
            array_map('strtoupper', $aliasKeys),
        ));
        $validClasses = implode(',', $allVariants);

        return [
            'students'         => 'required_without:*.name|string|max:200',
            'name'             => 'required_without:*.students|string|max:200',
            'class'            => "required|string|in:{$validClasses}",
            'section'          => 'nullable|string|in:A,B,C,D',
            'gender'           => 'nullable|string',
            'email'            => 'nullable|email',
            'mobile'           => 'nullable|string|min:10|max:15',
            'dob'              => 'nullable',
            'previous_dues'    => 'nullable',
        ];
    }

    public function customValidationMessages(): array
    {
        return [
            'students.required'          => 'Student name is required.',
            'class.required'             => 'Class is required. Use: NUR, LKG, UKG, I-VIII, IX, X, NC.',
            'class.in'                   => 'Invalid class ":input". Valid: NUR, LKG, UKG, I-XII, NC.',
            'section.in'                 => 'Invalid section ":input". Valid: A, B, C, D.',
            'gender.in'                  => 'Invalid gender ":input". Valid: BOY, GIRL, Male, Female.',
            'mobile.min'                 => 'Mobile must be at least 10 digits.',
            'email.required_without'     => 'At least one contact method (Email or Mobile) must be provided.',
            'mobile.required_without'    => 'At least one contact method (Email or Mobile) must be provided.',
        ];
    }
}
