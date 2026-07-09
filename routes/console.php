<?php

use App\Jobs\SendFeeDueRemindersJob;
use App\Jobs\SendFeeOverdueRemindersJob;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Fee collection workflow: due and overdue reminders
Schedule::job(new SendFeeDueRemindersJob)->dailyAt('09:00');
Schedule::job(new SendFeeOverdueRemindersJob)->dailyAt('10:00');

// Process background queues automatically (For Shared Hosting)
Schedule::command('queue:work --stop-when-empty')->everyMinute()->withoutOverlapping();
