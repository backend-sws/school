<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
$enrollments = \App\Models\LmsClassEnrollment::where('lms_class_id', 37)->get()->toArray();
echo json_encode($enrollments, JSON_PRETTY_PRINT);
