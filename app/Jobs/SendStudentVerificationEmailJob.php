<?php

namespace App\Jobs;

use App\Mail\StudentVerificationMail;
use App\Models\User;
use App\Support\VerificationToken;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class SendStudentVerificationEmailJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     *
     * @param  User  $user  The student user (link is for this user).
     * @param  string|null  $sendToEmail  Optional. When set, mail is sent here (e.g. application contact email) so the real recipient gets the link.
     */
    public function __construct(
        public User $user,
        public ?string $sendToEmail = null
    ) {
    }

    /**
     * Execute the job. Sends to real contact email (contact_email or application email), not placeholder.
     */
    public function handle(): void
    {
        $verifyUrl = VerificationToken::verifyEmailUrl($this->user);

        $to = $this->sendToEmail ?? $this->user->getNotificationEmail();
        if (empty($to)) {
            return;
        }

        Mail::to($to)->send(new StudentVerificationMail($this->user, $verifyUrl));
    }
}
