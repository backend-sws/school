<?php

namespace App\Imports;

use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\ToModel;
use App\Models\AdmissionVerificationData;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;

class AdmissionVerificationImport implements ToModel, WithHeadingRow, WithChunkReading, WithBatchInserts
{
    protected $streamId;

    public function __construct($streamId, $collegeId)
    {
        $this->streamId = $streamId;
        $this->collegeId = $collegeId;
    }

    public function model(array $row)
    {
       // Excel headers: appno, candidatename, vert, gender, dob, fathername, mobileno, emailid
        return new AdmissionVerificationData([
            'institution_id' => $this->collegeId,
            'main_stream_id' => $this->streamId,
            'admission_id'   => $row['appno'],           // AppNo
            'student_name'   => $row['candidatename'],   // CandidateName
            'category'       => $row['vert'],            // Vert. (Category)
            'gender'         => $row['gender'],          // Gender
            'dob'            => $this->transformDate($row['dob']), // DOB
            'fathers_name'   => $row['fathername'],      // Father Name
            'mobile_number'  => $row['mobileno'],        // MobileNo
            'email'          => $row['emailid'],         // EmailID
        ]);
    }

    private function transformDate($value)
    {
        if (empty($value)) return null;
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
        return 15; // 15 record insert at a time
    }

    public function chunkSize(): int
    {
        return 15; // 15 record insert at a time
    }
}
