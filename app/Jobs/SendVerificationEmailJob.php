<?php

namespace App\Jobs;

use App\Mail\StudentVerificationMail;
use App\Models\User;
use App\Support\VerificationToken;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

/**
 * Generic verification email for any user type (student, staff, etc.).
 * Sends a link to /verify-email?token=xxx where the user sets their password, then is redirected by role.
 */
class SendVerificationEmailJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public User $user
    ) {
    }

    public function handle(): void
    {
        $verifyUrl = VerificationToken::verifyEmailUrl($this->user);

        Mail::to($this->user->email)->send(new StudentVerificationMail($this->user, $verifyUrl));
    }
}
