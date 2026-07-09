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

class OtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $collegeName;
    public ?string $collegeLogo = null;
    public string $email;
    public string $otp;

    /**
     * Create a new message instance.
     *
     * @param string $otp The OTP code
     */
    public function __construct(string $otp, string $email)
    {
        $this->otp = $otp;
        $this->email = $email;
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
            subject: "Your OTP Verification Code – {$this->collegeName}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.otp-verification',
            with: [
                'otp' => $this->otp,
                'email' => $this->email,
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
