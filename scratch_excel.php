<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $res = App\Models\StudentFeePeriodBalance::updateOrCreate([
        'institution_id' => 2,
        'user_id' => 6,
        'session_id' => 1,
        'period_key' => 'arrears'
    ], [
        'frequency' => 'annual',
        'opening_balance' => 1000,
        'total_payable' => 1000,
        'closing_balance' => 1000,
        'version_hash' => md5(1000)
    ]);
    dump($res->toArray());
} catch (\Throwable $e) {
    dump($e->getMessage());
}
