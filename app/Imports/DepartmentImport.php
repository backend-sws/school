<?php

namespace App\Imports;

use App\Models\Department;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;

class DepartmentImport implements ToModel, WithHeadingRow, WithValidation, WithBatchInserts, WithChunkReading, SkipsOnFailure
{
    use SkipsFailures;

    protected int $institutionId;
    protected int $importedCount = 0;
    protected int $skippedCount = 0;

    public function __construct(int $institutionId)
    {
        $this->institutionId = $institutionId;
    }

    public function model(array $row)
    {
        $name = trim($row['name'] ?? '');
        $code = trim($row['code'] ?? '');

        if (empty($name) || empty($code)) {
            $this->skippedCount++;
            return null;
        }

        // Skip duplicates by code within the institution
        if (Department::where('institution_id', $this->institutionId)->where('code', $code)->exists()) {
            $this->skippedCount++;
            return null;
        }

        $this->importedCount++;

        return new Department([
            'institution_id' => $this->institutionId,
            'name' => $name,
            'code' => $code,
            'status' => 1,
        ]);
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:150',
            'code' => 'required|string|max:30',
        ];
    }

    public function batchSize(): int
    {
        return 50;
    }
    public function chunkSize(): int
    {
        return 100;
    }

    public function getImportedCount(): int
    {
        return $this->importedCount;
    }
    public function getSkippedCount(): int
    {
        return $this->skippedCount;
    }
}
