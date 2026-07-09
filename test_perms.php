<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::whereHas('roles', fn($q) => $q->where('key', 'student'))->first();
if (!$user) {
    echo "No student user found.\n";
    exit;
}

echo "User: {$user->name} (ID: {$user->id})\n";
$resolver = app(\App\Services\PermissionResolverService::class);
$institutionId = \App\Support\InstitutionContext::getActiveInstitutionId($user);
echo "Institution ID: " . ($institutionId ?? 'null') . "\n";

$keys = $resolver->resolveEffectivePermissionKeys($user, $institutionId);
echo "Permissions: \n" . implode(", ", $keys) . "\n";
echo "Has student_portal_classes? " . (in_array('student_portal_classes', $keys) ? 'Yes' : 'No') . "\n";
echo "Has view_my_lms_classes? " . (in_array('view_my_lms_classes', $keys) ? 'Yes' : 'No') . "\n";
