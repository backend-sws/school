<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$users = \App\Models\User::whereHas('roles', function($q) { $q->where('key', 'student'); })
    ->whereDate('created_at', '>=', now()->subDays(2))
    ->get();

echo "Found " . $users->count() . " recently imported students:\n";
foreach($users as $u) {
    $class = $u->studentProfile && $u->studentProfile->lmsClasses->count() > 0 
        ? $u->studentProfile->lmsClasses->first()->name 
        : 'No Class';
    echo $u->name . ' - Class: ' . $class . "\n";
}
