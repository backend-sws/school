<?php
namespace App\Exports;


use App\Models\StudentVerificationData;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\Exportable;

class StudentDataExport implements FromQuery, WithHeadings, WithMapping
{
    use Exportable;

    protected $main_stream_id;

    public function __construct($main_stream_id)
    {
        $this->main_stream_id = $main_stream_id;
    }

    public function query()
    {
        return StudentVerificationData::query()
            ->where('main_stream_id', $this->main_stream_id);
    }

    public function headings(): array
    {
        return [
           'RegistrationNo',
           'StudentName',
        ];
    }

    public function map($data): array
    {
        return [
            $data->registration_no,
            $data->student_name,
        ];
    }
}