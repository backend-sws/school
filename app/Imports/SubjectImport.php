<?php

namespace App\Imports;

use App\Models\Subject;
use App\Models\Stream;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;

class SubjectImport implements ToModel, WithHeadingRow, WithValidation, WithBatchInserts, WithChunkReading, SkipsOnFailure
{
    use SkipsFailures;

    protected int $institutionId;
    protected int $importedCount = 0;
    protected int $skippedCount = 0;
    protected array $rowErrors = [];

    public function __construct(int $institutionId)
    {
        $this->institutionId = $institutionId;
    }

    public function model(array $row)
    {
        $name = trim($row['name'] ?? '');
        $code = trim($row['code'] ?? '');
        $streamCode = trim($row['stream_code'] ?? '');

        if (empty($name) || empty($code) || empty($streamCode)) {
            $this->skippedCount++;
            return null;
        }

        // Resolve stream
        $stream = Stream::where('institution_id', $this->institutionId)
            ->where('code', $streamCode)
            ->first();

        if (!$stream) {
            $this->rowErrors[] = "Row with code '{$code}': stream_code '{$streamCode}' not found";
            $this->skippedCount++;
            return null;
        }

        // Skip duplicates
        if (
            Subject::where('institution_id', $this->institutionId)
                ->where('stream_id', $stream->id)
                ->where('code', $code)
                ->exists()
        ) {
            $this->skippedCount++;
            return null;
        }

        $isPractical = strtolower(trim($row['is_practical'] ?? 'no')) === 'yes';

        $this->importedCount++;

        return new Subject([
            'institution_id' => $this->institutionId,
            'stream_id' => $stream->id,
            'name' => $name,
            'code' => $code,
            'is_practical' => $isPractical,
            'status' => 1,
        ]);
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:150',
            'code' => 'required|string|max:30',
            'stream_code' => 'required|string|max:30',
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
    public function getRowErrors(): array
    {
        return $this->rowErrors;
    }
}
