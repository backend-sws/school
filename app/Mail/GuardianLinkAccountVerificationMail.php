<?php

namespace App\Mail;

use App\Models\Setting;
use App\Services\R2Service;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class GuardianLinkAccountVerificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $institutionName;

    public ?string $institutionLogo = null;

    public function __construct(
        public string $verifyUrl
    ) {
        $this->institutionName = Setting::where('setting_key', 'college_name')->value('setting_value') ?? 'Our Institution';

        $logoPath = Setting::where('setting_key', 'college_logo')->value('setting_value');
        if ($logoPath) {
            if (filter_var($logoPath, FILTER_VALIDATE_URL)) {
                $this->institutionLogo = $logoPath;
            } else {
                try {
                    $this->institutionLogo = app(R2Service::class)->viewUrl($logoPath);
                } catch (\Exception $e) {
                    $this->institutionLogo = null;
                }
            }
        }
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Verify your email to link parent account – {$this->institutionName}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.guardian-link-account-verification',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
