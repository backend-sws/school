<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$row = [
    'students' => 'Test Student 7000', 'email' => 'test7000@mail.com', 'mobile' => '9999997000', 'gender' => 'BOY', 'dob' => '8/15/19',
    'class' => 'LKG', 'section' => 'A', 'session_name' => '2025-26', 'roll_no' => '', 'father_name' => 'Father 1', 'father_mobile' => '9876543211',
    'mother_name' => 'Mother 1', 'category' => 'General', 'religion' => 'Hindu', 'aadhar_no' => '1234-5678-9011', 'address' => 'Address 1',
    'city' => 'Lucknow', 'state' => 'Uttar Pradesh', 'pincode' => '226001', 'previous_dues' => '1000',
];

$import = new \App\Imports\ExistingStudentBulkImport(2);
$import->model($row);

$user = \App\Models\User::latest()->first();
dump("User ID: " . $user->id);
dump("StudentFeePeriodBalance:");
dump(\App\Models\StudentFeePeriodBalance::where('user_id', $user->id)->get()->toArray());
