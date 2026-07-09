<?php
namespace App\Exports;

use App\Models\AdmissionVerificationData;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\Exportable;

class AdmissionDataExport implements FromQuery, WithHeadings, WithMapping
{
    use Exportable;

    protected $main_stream_id;

    // College aur Main Stream ID construct mein pass karenge
    public function __construct( $main_stream_id)
    {
       
        $this->main_stream_id = $main_stream_id;
    }

    // Database se specific Stream ka data nikalna
    public function query()
    {
        return AdmissionVerificationData::query()
            ->where('main_stream_id', $this->main_stream_id);
    }

    // Excel ke Headers jo aapne reference diye hain
    public function headings(): array
    {
        return [
            'AppNo',
            'CandidateName',
            'Vert', // Category ke liye
            'Gender',
            'DOB',
            'FatherName',
            'MobileNo',
            'EmailID'
        ];
    }

    // Database columns ko Excel columns ke saath map karna
    public function map($data): array
    {
        return [
            $data->admission_id,    // Database: admission_id -> Excel: AppNo
            $data->student_name,    // Database: student_name -> Excel: CandidateName
            $data->category,        // Database: category -> Excel: Vert
            $data->gender,          // Gender
            $data->dob,             // DOB
            $data->fathers_name,     // FatherName
            $data->mobile_number,   // MobileNo
            $data->email,           // EmailID
        ];
    }
}