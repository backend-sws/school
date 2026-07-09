<?php

namespace App\Imports;

use App\Models\FeePayment;
use App\Models\FeeType;
use App\Models\StudentProfile;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;

class FeePaymentImport implements ToModel, WithHeadingRow, WithBatchInserts, WithChunkReading, SkipsOnFailure
{
    use SkipsFailures;

    protected int $institutionId;
    protected int $uploadedBy;
    protected int $importedCount = 0;
    protected int $skippedCount = 0;
    protected array $rowErrors = [];

    // Lookup caches
    protected array $feeTypeCache = [];
    protected array $studentCache = [];

    public function __construct(int $institutionId, int $uploadedBy)
    {
        $this->institutionId = $institutionId;
        $this->uploadedBy = $uploadedBy;
    }

    public function model(array $row)
    {
        $studentIdent = trim($row['student_reg_no'] ?? $row['student_email'] ?? '');
        $feeHeadTitle = trim($row['fee_head'] ?? $row['fee_type'] ?? '');
        $amount = $row['amount'] ?? null;

        if (empty($studentIdent) || empty($feeHeadTitle) || empty($amount)) {
            $this->skippedCount++;
            return null;
        }

        // Resolve student user_id
        $userId = $this->resolveStudentUserId($studentIdent);
        if (!$userId) {
            $this->rowErrors[] = "Student '{$studentIdent}' not found in this institution";
            $this->skippedCount++;
            return null;
        }

        // Resolve fee type
        $feeTypeId = $this->resolveFeeTypeId($feeHeadTitle);
        if (!$feeTypeId) {
            $this->rowErrors[] = "Fee type '{$feeHeadTitle}' not found for this institution";
            $this->skippedCount++;
            return null;
        }

        $paymentDate = $this->parseDate($row['payment_date'] ?? null) ?? now()->toDateString();
        $paymentMode = strtolower(trim($row['payment_mode'] ?? 'cash'));
        $receiptNo = trim($row['receipt_no'] ?? '');
        $forMonth = trim($row['for_month'] ?? '');
        $remarks = trim($row['remarks'] ?? 'Imported from legacy system');
        $totalAmount = floatval($amount);

        try {
            FeePayment::create([
                'institution_id' => $this->institutionId,
                'user_id' => $userId,
                'fee_head_id' => $feeTypeId,
                'amount' => $totalAmount,
                'total_amount' => $totalAmount,
                'late_fee_applied' => 0,
                'payment_mode' => $paymentMode,
                'payment_status' => 'paid',
                'payment_date' => $paymentDate,
                'for_month' => !empty($forMonth) ? $forMonth : null,
                'receipt_no' => !empty($receiptNo) ? $receiptNo : 'IMP-' . strtoupper(Str::random(8)),
                'remarks' => $remarks,
                'collected_by' => $this->uploadedBy,
                'process_status' => 'approved',
                'processed_by' => $this->uploadedBy,
                'processed_at' => now(),
                'cash_amount' => $paymentMode === 'cash' ? $totalAmount : 0,
                'online_amount' => $paymentMode !== 'cash' ? $totalAmount : 0,
                'online_transaction_id' => $row['transaction_ref'] ?? null,
            ]);

            $this->importedCount++;
        } catch (\Throwable $e) {
            Log::warning('FeePaymentImport row error', [
                'student' => $studentIdent,
                'fee_head' => $feeHeadTitle,
                'error' => $e->getMessage(),
            ]);
            $this->rowErrors[] = "Payment for '{$studentIdent}' / '{$feeHeadTitle}': " . $e->getMessage();
            $this->skippedCount++;
        }

        return null;
    }

    protected function resolveStudentUserId(string $ident): ?int
    {
        if (isset($this->studentCache[$ident])) {
            return $this->studentCache[$ident];
        }

        // Try by reg_no first
        $profile = StudentProfile::where('institution_id', $this->institutionId)
            ->where('reg_no', $ident)
            ->first();

        if (!$profile) {
            // Try by email
            $user = User::where('email', $ident)
                ->orWhere('contact_email', $ident)
                ->first();
            if ($user) {
                $profile = StudentProfile::where('institution_id', $this->institutionId)
                    ->where('user_id', $user->id)
                    ->first();
            }
        }

        $userId = $profile?->user_id;
        $this->studentCache[$ident] = $userId;
        return $userId;
    }

    protected function resolveFeeTypeId(string $title): ?int
    {
        if (isset($this->feeTypeCache[$title])) {
            return $this->feeTypeCache[$title];
        }

        $feeType = FeeType::where('institution_id', $this->institutionId)
            ->where('name', $title)
            ->first();

        $id = $feeType?->id;
        $this->feeTypeCache[$title] = $id;
        return $id;
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
