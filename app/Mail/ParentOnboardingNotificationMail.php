<?php

namespace App\Mail;

use App\Models\Setting;
use App\Services\R2Service;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ParentOnboardingNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    /** Institution name (from settings). */
    public string $institutionName;

    /** Institution logo URL (from settings). */
    public ?string $institutionLogo = null;

    /**
     * Notify parent that their student is onboarded; link goes to login then redirects to parent dashboard (My Students).
     *
     * @param  string  $studentName  Name of the student who was onboarded
     * @param  string  $loginUrl  Full URL to login page (parent uses existing ID/password; after login redirects to parent dashboard)
     */
    public function __construct(
        public string $studentName,
        public string $loginUrl
    ) {
        // Settings still use college_name / college_logo keys; we expose as institution for consistency
        $this->institutionName = Setting::where('setting_key', 'college_name')->value('setting_value') ?? 'Our Institution';

        $logoPath = Setting::where('setting_key', 'college_logo')->value('setting_value');

        if ($logoPath) {
            if (filter_var($logoPath, FILTER_VALIDATE_URL)) {
                $this->institutionLogo = $logoPath;
            } else {
                try {
                    $r2Service = app(R2Service::class);
                    $this->institutionLogo = $r2Service->viewUrl($logoPath);
                } catch (\Exception $e) {
                    \Log::error('R2 Logo Generation Error: ' . $e->getMessage());
                    $this->institutionLogo = null;
                }
            }
        }
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Your student is onboarded – {$this->institutionName}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.parent-onboarding-notification',
            with: [
                'studentName' => $this->studentName,
                'loginUrl' => $this->loginUrl,
                'institutionName' => $this->institutionName,
                'institutionLogo' => $this->institutionLogo,
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
