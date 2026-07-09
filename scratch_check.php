<?php
$app = App\Models\AdmissionApplication::latest()->first();
echo json_encode([
    'class_id' => $app->class_id,
    'lmsClass' => $app->lmsClass?->name,
    'lmsSection' => $app->lmsClass?->section,
    'head_title' => $app->admissionHead?->title,
    'stream_name' => $app->stream?->name
]);
