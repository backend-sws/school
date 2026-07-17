<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::find(9);
if ($user) {
    $projector = app(\App\Services\Fees\StudentFeePeriodBalanceProjector::class);
    $projector->projectPeriod($user, 2, 'annual', 3);
}

dump("StudentFeePeriodBalance:");
dump(\App\Models\StudentFeePeriodBalance::where('user_id', 9)->get()->toArray());
