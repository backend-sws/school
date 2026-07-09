<?php

namespace App\Jobs;

use App\Mail\ParentOnboardingNotificationMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class SendParentOnboardingNotificationJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $toEmail,
        public string $studentName,
        public string $loginUrl
    ) {
    }

    public function handle(): void
    {
        Mail::to($this->toEmail)->send(
            new ParentOnboardingNotificationMail($this->studentName, $this->loginUrl)
        );
    }
}
