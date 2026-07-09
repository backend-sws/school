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
 * Welcome notification sent to students imported via bulk import.
 *
 * Channels: mail, sms, whatsapp, database, broadcast, push
 * (auto-filtered by NotifiesViaChannelMatrix based on config + env)
 */
class StudentImportWelcomeNotification extends Notification implements ShouldQueue
{
    use NotifiesViaChannelMatrix, Queueable;

    public string $notificationType = 'student_import_welcome';

    protected string $institutionName;

    public function __construct(
        public int $institutionId,
        public string $regNo,
        public string $defaultPassword = 'password123'
    ) {
        $this->institutionName = Institution::where('id', $institutionId)->value('name')
            ?? Setting::where('setting_key', 'college_name')->value('setting_value')
            ?? 'Our Institution';
    }

    // ── Mail ─────────────────────────────────────────────────────────────

    public function toMail(object $notifiable): MailMessage
    {
        $name = $notifiable->name ?? 'Student';
        $loginId = $notifiable->email ?? $notifiable->mobile ?? $this->regNo;

        return (new MailMessage)
            ->subject("Welcome to {$this->institutionName} — Your Login Credentials")
            ->greeting("Hello {$name},")
            ->line("You have been enrolled at **{$this->institutionName}**.")
            ->line("Your registration number: **{$this->regNo}**")
            ->line('---')
            ->line('**Your Login Credentials:**')
            ->line("Login ID: **{$loginId}**")
            ->line("Password: **{$this->defaultPassword}**")
            ->line('---')
            ->line('Please login and change your password immediately for security.')
            ->action('Login Now', url('/login'))
            ->line('If you did not expect this email, please contact your institution.');
    }

    // ── Database / In-App ────────────────────────────────────────────────

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'student_import_welcome',
            'title' => "Welcome to {$this->institutionName}",
            'body' => "You have been enrolled. Your registration number is {$this->regNo}.",
            'url' => '/dashboard',
            'reg_no' => $this->regNo,
            'institution_id' => $this->institutionId,
        ];
    }

    // ── Web Push ─────────────────────────────────────────────────────────

    public function toWebPush(object $notifiable, Notification $notification): WebPushMessage
    {
        return (new WebPushMessage)
            ->title("Welcome to {$this->institutionName}")
            ->body("You have been enrolled. Reg No: {$this->regNo}")
            ->data([
                'url' => '/dashboard',
                'type' => 'student_import_welcome',
            ]);
    }

    // ── SMS ──────────────────────────────────────────────────────────────

    public function toSms(object $notifiable): array
    {
        $loginId = $notifiable->email ?? $notifiable->mobile ?? $this->regNo;

        $vars = [
            'institution' => $this->institutionName,
            'reg_no'      => $this->regNo,
            'name'        => $notifiable->name ?? 'Student',
            'login_id'    => $loginId,
            'password'    => $this->defaultPassword,
            'url'         => url('/login'),
        ];
        $result = NotificationTemplateRenderer::render('student_import_welcome', 'sms', $vars);

        return [
            'phone' => $notifiable->phone ?? $notifiable->mobile ?? '',
            'message' => $result['message'],
            'institution_id' => $this->institutionId,
            'category' => 'enrollment',
            'template_id' => $result['provider_template_id'],
        ];
    }

    // ── WhatsApp ─────────────────────────────────────────────────────────

    public function toWhatsapp(object $notifiable): array
    {
        $loginId = $notifiable->email ?? $notifiable->mobile ?? $this->regNo;

        $vars = [
            'institution' => $this->institutionName,
            'reg_no'      => $this->regNo,
            'name'        => $notifiable->name ?? 'Student',
            'login_id'    => $loginId,
            'password'    => $this->defaultPassword,
            'url'         => url('/login'),
        ];
        $result = NotificationTemplateRenderer::render('student_import_welcome', 'whatsapp', $vars);

        return [
            'phone' => $notifiable->phone ?? $notifiable->mobile ?? '',
            'message' => $result['message'],
            'template_name' => $result['provider_template_id'],
            'institution_id' => $this->institutionId,
            'category' => 'enrollment',
        ];
    }
}
