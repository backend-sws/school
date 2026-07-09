<?php

namespace App\Notifications;

use App\Models\Institution;
use App\Models\Setting;
use App\Services\NotificationTemplateRenderer;
use App\Services\UrlShortener;
use App\Support\VerificationToken;
use App\Traits\NotifiesViaChannelMatrix;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;

/**
 * Sent to students when their admission application is approved and they are onboarded.
 *
 * Uses the same DLT template as StudentImportWelcomeNotification (STUDENT_WELCOME_IMPORT).
 * Channels: mail, sms, whatsapp, database, broadcast, push
 * (auto-filtered by NotifiesViaChannelMatrix based on config + env)
 */
class StudentOnboardNotification extends Notification implements ShouldQueue
{
    use NotifiesViaChannelMatrix, Queueable;

    public string $notificationType = 'student_onboard';

    protected string $institutionName;

    public function __construct(
        public int     $institutionId,
        public string  $regNo,
        public ?string $contactEmail = null
    ) {
        $this->institutionName = Institution::where('id', $institutionId)->value('name')
            ?? Setting::where('setting_key', 'college_name')->value('setting_value')
            ?? 'Our Institution';
    }

    // ── Mail ─────────────────────────────────────────────────────────────

    public function toMail(object $notifiable): MailMessage
    {
        $name = $notifiable->name ?? 'Student';
        $verifyUrl = VerificationToken::verifyEmailUrl($notifiable);

        $mail = (new MailMessage)
            ->subject("Welcome to {$this->institutionName} — Verify Your Account")
            ->greeting("Hello {$name},")
            ->line("Your admission has been approved at **{$this->institutionName}**.")
            ->line("Your registration number: **{$this->regNo}**")
            ->line('Please verify your email to activate your student portal access.')
            ->action('Verify & Set Password', $verifyUrl)
            ->line('If you did not expect this email, please contact your institution.');

        // Route to application email when contactEmail is set
        if ($this->contactEmail) {
            $mail->withSymfonyMessage(function ($message) {
                $message->to($this->contactEmail);
            });
        }

        return $mail;
    }

    // ── Database / In-App ────────────────────────────────────────────────

    public function toArray(object $notifiable): array
    {
        return [
            'type'           => 'student_onboard',
            'title'          => "Welcome to {$this->institutionName}",
            'body'           => "Your admission is approved. Registration number: {$this->regNo}.",
            'url'            => '/dashboard',
            'reg_no'         => $this->regNo,
            'institution_id' => $this->institutionId,
        ];
    }

    // ── Web Push ─────────────────────────────────────────────────────────

    public function toWebPush(object $notifiable, Notification $notification): WebPushMessage
    {
        return (new WebPushMessage)
            ->title("Welcome to {$this->institutionName}")
            ->body("Admission approved. Reg No: {$this->regNo}")
            ->data([
                'url'  => '/dashboard',
                'type' => 'student_onboard',
            ]);
    }

    // ── SMS ──────────────────────────────────────────────────────────────

    public function toSms(object $notifiable): array
    {
        $verifyUrl = VerificationToken::verifyEmailUrl($notifiable);
        $shortUrl  = UrlShortener::shorten($verifyUrl, now()->addDays(7));

        $vars = [
            'name'   => $notifiable->name ?? 'Student',
            'reg_no' => $this->regNo,
            'url'    => $shortUrl,
        ];

        // Reuse STUDENT_WELCOME_IMPORT DLT template (same structure)
        $result = NotificationTemplateRenderer::render('student_import_welcome', 'sms', $vars);

        return [
            'phone'          => $notifiable->phone ?? $notifiable->mobile ?? '',
            'message'        => $result['message'],
            'institution_id' => $this->institutionId,
            'category'       => 'enrollment',
            'template_id'    => $result['provider_template_id'],
        ];
    }

    // ── WhatsApp ─────────────────────────────────────────────────────────

    public function toWhatsapp(object $notifiable): array
    {
        $verifyUrl = VerificationToken::verifyEmailUrl($notifiable);
        $shortUrl  = UrlShortener::shorten($verifyUrl, now()->addDays(7));

        $vars = [
            'name'   => $notifiable->name ?? 'Student',
            'reg_no' => $this->regNo,
            'url'    => $shortUrl,
        ];

        $result = NotificationTemplateRenderer::render('student_import_welcome', 'whatsapp', $vars);

        return [
            'phone'         => $notifiable->phone ?? $notifiable->mobile ?? '',
            'message'       => $result['message'],
            'template_name' => $result['provider_template_id'],
            'institution_id' => $this->institutionId,
            'category'      => 'enrollment',
        ];
    }
}
