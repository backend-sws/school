<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$profiles = \App\Models\FeeRegulationProfile::all();
foreach($profiles as $p) {
    echo $p->name . "\n";
}
