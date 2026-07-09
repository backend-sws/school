<?php

namespace App\Imports;

use App\Models\StudentVerificationData;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;


class StudentVerificationImport implements ToModel, WithHeadingRow, WithChunkReading, WithBatchInserts
{
    protected $streamId, $collegeId;

    public function __construct($streamId, $collegeId)
    {
        $this->streamId = $streamId;
        $this->collegeId = $collegeId;
    }

    /**
     * @param array $row
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        return new StudentVerificationData([
            'institution_id'  => $this->collegeId,
            'main_stream_id'  => $this->streamId,
            // Slugified headers: registration_no aur student_name
            'registration_no' => $row['registration_no'] ?? $row['registrationno'], 
            'student_name'    => $row['student_name'] ?? $row['studentname'],
        ]);
    }

    /**
     * Batch size: Ek baar mein kitne records insert honge
     */
    public function batchSize(): int
    {
        return 15; 
    }

    /**
     * Chunk size: File ko kitne rows ke tukdon mein padha jayega
     */
    public function chunkSize(): int
    {
        return 15;
    }
}
