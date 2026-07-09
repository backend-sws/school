<?php

namespace App\Notifications;

use App\Models\AdmissionApplication;
use App\Services\NotificationTemplateRenderer;
use App\Traits\NotifiesViaChannelMatrix;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;

class AdmissionApplicationSubmittedNotification extends Notification implements ShouldQueue
{
    use NotifiesViaChannelMatrix, Queueable;

    public string $notificationType = 'admission_application_submitted';

    public function __construct(
        public AdmissionApplication $application
    ) {}

    // ── Polymorphic Helpers ─────────────────────────────────────────────

    private function isReadmission(): bool
    {
        return ($this->application->application_type ?? 'new') === 're-admission';
    }

    private function label(): string
    {
        return $this->isReadmission() ? 're-admission' : 'admission';
    }

    private function titleText(): string
    {
        return $this->isReadmission()
            ? 'Re-admission application received'
            : 'New admission application';
    }

    private function bodyText(): string
    {
        $type = $this->isReadmission() ? 'Re-admission' : 'Admission';
        return sprintf(
            '%s application %s submitted by %s.',
            $type,
            $this->application->application_id,
            $this->application->applicant_name
        );
    }

    // ── Channel Methods ─────────────────────────────────────────────────

    private function mailConfig(): array
    {
        $key = $this->isReadmission() ? 'readmission' : 'new';
        return config("admission_mail.submitted.{$key}");
    }

    public function toMail(object $notifiable): MailMessage
    {
        $name = $this->application->applicant_name ?? 'Applicant';
        $cfg = $this->mailConfig();

        return (new MailMessage)
            ->subject($this->titleText() . ' — ' . $this->application->application_id)
            ->greeting(str_replace(':name', $name, $cfg['greeting']))
            ->line($this->bodyText())
            ->line('**Application ID:** ' . $this->application->application_id)
            ->line('**Session:** ' . ($this->application->session_name ?? '—'))
            ->action('View Application', url('/admission/applications/' . $this->application->id))
            ->line($cfg['closing'])
            ->line('[' . $cfg['cta_label'] . '](' . url($cfg['cta_url']) . ')');
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'admission_application_submitted',
            'title' => $this->titleText(),
            'body' => $this->bodyText(),
            'url' => '/admission/applications/'.$this->application->id,
            'application_id' => $this->application->id,
            'application_id_display' => $this->application->application_id,
            'applicant_name' => $this->application->applicant_name,
            'application_type' => $this->application->application_type,
        ];
    }

    public function toWebPush(object $notifiable, Notification $notification): WebPushMessage
    {
        return (new WebPushMessage)
            ->title($this->titleText())
            ->body($this->bodyText())
            ->data([
                'url' => '/admission/applications/'.$this->application->id,
                'type' => 'admission_application_submitted',
                'application_id' => $this->application->id,
            ]);
    }

    public function toSms(object $notifiable): array
    {
        $vars = ['type' => $this->label(), 'app_id' => $this->application->application_id];
        $result = NotificationTemplateRenderer::render('admission_application_submitted', 'sms', $vars);

        return [
            'phone' => $notifiable->phone ?? $notifiable->mobile ?? '',
            'message' => $result['message'],
            'institution_id' => $this->application->institution_id ?? config('ems.default_institution_id'),
            'category' => 'admission',
            'template_id' => $result['provider_template_id'],
        ];
    }

    public function toWhatsapp(object $notifiable): array
    {
        $vars = ['type' => $this->label(), 'app_id' => $this->application->application_id];
        $result = NotificationTemplateRenderer::render('admission_application_submitted', 'whatsapp', $vars);

        return [
            'phone' => $notifiable->phone ?? $notifiable->mobile ?? '',
            'message' => $result['message'],
            'template_name' => $result['provider_template_id'],
            'institution_id' => $this->application->institution_id ?? config('ems.default_institution_id'),
            'category' => 'admission',
        ];
    }
}
