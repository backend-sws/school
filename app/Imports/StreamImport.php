<?php

namespace App\Imports;

use App\Models\Stream;
use App\Models\Department;
use App\Models\MainStream;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;

class StreamImport implements ToModel, WithHeadingRow, WithValidation, WithBatchInserts, WithChunkReading, SkipsOnFailure
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

        if (empty($name) || empty($code)) {
            $this->skippedCount++;
            return null;
        }

        // Skip duplicates
        if (Stream::where('institution_id', $this->institutionId)->where('code', $code)->exists()) {
            $this->skippedCount++;
            return null;
        }

        // Resolve department
        $departmentId = null;
        if (!empty($row['department_code'])) {
            $dept = Department::where('institution_id', $this->institutionId)
                ->where('code', trim($row['department_code']))
                ->first();
            if (!$dept) {
                $this->rowErrors[] = "Row with code '{$code}': department_code '{$row['department_code']}' not found";
                $this->skippedCount++;
                return null;
            }
            $departmentId = $dept->id;
        }

        // Resolve main stream
        $mainStreamId = null;
        if (!empty($row['main_stream_code'])) {
            $ms = MainStream::where('institution_id', $this->institutionId)
                ->where('code', trim($row['main_stream_code']))
                ->first();
            if (!$ms) {
                $this->rowErrors[] = "Row with code '{$code}': main_stream_code '{$row['main_stream_code']}' not found";
                $this->skippedCount++;
                return null;
            }
            $mainStreamId = $ms->id;
        }

        $this->importedCount++;

        return new Stream([
            'institution_id' => $this->institutionId,
            'name' => $name,
            'code' => $code,
            'department_id' => $departmentId,
            'main_stream_id' => $mainStreamId,
            'duration_years' => !empty($row['duration_years']) ? (int) $row['duration_years'] : null,
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
    public function getRowErrors(): array
    {
        return $this->rowErrors;
    }
}
