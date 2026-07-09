<?php

namespace App\Mail;

use App\Models\Setting;
use App\Models\User;
use App\Services\R2Service;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StudentVerificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $collegeName;

    public ?string $collegeLogo = null;

    /**
     * Create a new message instance.
     *
     * @param  string  $verifyUrl  Full URL to verify-email page (generic: students, staff, etc.)
     */
    public function __construct(
        public User $user,
        public string $verifyUrl
    ) {
        $this->collegeName = Setting::where('setting_key', 'college_name')->value('setting_value') ?? 'Our Institution';

        $logoPath = Setting::where('setting_key', 'college_logo')->value('setting_value');

        if ($logoPath) {
            if (filter_var($logoPath, FILTER_VALIDATE_URL)) {
                $this->collegeLogo = $logoPath;
            } else {
                try {
                    $r2Service = app(R2Service::class);
                    $this->collegeLogo = $r2Service->viewUrl($logoPath);
                } catch (\Exception $e) {
                    \Log::error('R2 Logo Generation Error: ' . $e->getMessage());
                    $this->collegeLogo = null;
                }
            }
        }
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Verify your account – {$this->collegeName}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.student-verification',
            with: [
                'userName' => $this->user->name,
                'verifyUrl' => $this->verifyUrl,
                'collegeName' => $this->collegeName,
                'collegeLogo' => $this->collegeLogo,
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
