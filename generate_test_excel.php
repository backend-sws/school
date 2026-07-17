<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Maatwebsite\Excel\Concerns\FromArray;

class TestImportExport implements FromArray
{
    public function array(): array
    {
        return [
            // Headings
            [
                'students', 'email', 'mobile', 'gender', 'dob', 'class', 'section',
                'session_name', 'roll_no', 'father_name', 'father_mobile', 'mother_name',
                'category', 'religion', 'aadhar_no', 'address', 'city', 'state', 'pincode', 'previous_dues',
            ],
            // Student 1 (With 1000 dues)
            [
                'Test Student 1', 'test1@mail.com', '9999999991', 'BOY', '8/15/19',
                'LKG', 'A', '2025-26', '', 'Father 1', '9876543211',
                'Mother 1', 'General', 'Hindu', '1234-5678-9011', 'Address 1',
                'Lucknow', 'Uttar Pradesh', '226001', '1000',
            ],
            // Student 2 (With 750 dues)
            [
                'Test Student 2', 'test2@mail.com', '9999999992', 'GIRL', '8/15/19',
                'LKG', 'A', '2025-26', '', 'Father 2', '9876543212',
                'Mother 2', 'General', 'Hindu', '1234-5678-9012', 'Address 2',
                'Lucknow', 'Uttar Pradesh', '226001', '750',
            ]
        ];
    }
}

\Maatwebsite\Excel\Facades\Excel::store(new TestImportExport, 'test_import.xlsx', 'public');
echo "File generated at: " . storage_path('app/public/test_import.xlsx') . "\n";
