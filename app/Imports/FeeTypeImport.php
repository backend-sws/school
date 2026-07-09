<?php

namespace App\Imports;

use App\Models\FeeType;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;

class FeeTypeImport implements ToModel, WithHeadingRow, WithValidation, WithBatchInserts, WithChunkReading, SkipsOnFailure
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

        if (empty($name)) {
            $this->skippedCount++;
            return null;
        }

        // Skip duplicates by name within institution
        if (FeeType::where('institution_id', $this->institutionId)->where('name', $name)->exists()) {
            $this->skippedCount++;
            return null;
        }

        $this->importedCount++;

        return new FeeType([
            'institution_id' => $this->institutionId,
            'name' => $name,
            'category' => $row['category'] ?? null,
        ]);
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:150',
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
