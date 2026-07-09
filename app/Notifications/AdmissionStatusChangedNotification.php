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

class AdmissionStatusChangedNotification extends Notification implements ShouldQueue
{
    use NotifiesViaChannelMatrix, Queueable;

    public string $notificationType = 'admission_status_changed';

    public function __construct(
        public AdmissionApplication $application,
        public string $status
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
        if ($this->status === 'approved') {
            return $this->isReadmission() ? 'Re-admission approved — Welcome back!' : 'Application approved';
        }
        return $this->isReadmission() ? 'Re-admission update' : 'Application update';
    }

    private function bodyText(): string
    {
        $type = ucfirst($this->label());
        if ($this->status === 'approved') {
            return sprintf('Your %s application %s has been approved.', $this->label(), $this->application->application_id);
        }
        return sprintf('Your %s application %s has been %s.', $this->label(), $this->application->application_id, $this->status);
    }

    // ── Channel Methods ─────────────────────────────────────────────────

    private function mailConfig(): array
    {
        $key = $this->isReadmission() ? 'readmission' : 'new';
        return config("admission_mail.status.{$key}");
    }

    public function toMail(object $notifiable): MailMessage
    {
        $name = $this->application->applicant_name ?? 'Applicant';
        $cfg = $this->mailConfig();

        $closingLine = match ($this->status) {
            'approved' => $cfg['closing_approved'],
            'rejected' => $cfg['closing_rejected'],
            default    => $cfg['closing_default'],
        };

        return (new MailMessage)
            ->subject($this->titleText() . ' — ' . $this->application->application_id)
            ->greeting(str_replace(':name', $name, $cfg['greeting']))
            ->line($this->bodyText())
            ->line('**Application ID:** ' . $this->application->application_id)
            ->action('View Application', url('/admission/applications/' . $this->application->id))
            ->line($closingLine)
            ->line('[' . $cfg['cta_label'] . '](' . url($cfg['cta_url']) . ')');
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'admission_status_changed',
            'title' => $this->titleText(),
            'body' => $this->bodyText(),
            'url' => '/admission/applications/'.$this->application->id,
            'application_id' => $this->application->id,
            'application_id_display' => $this->application->application_id,
            'status' => $this->status,
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
                'type' => 'admission_status_changed',
                'application_id' => $this->application->id,
                'status' => $this->status,
            ]);
    }

    public function toSms(object $notifiable): array
    {
        $vars = $this->templateVariables();
        $result = NotificationTemplateRenderer::render('admission_status_changed', 'sms', $vars);

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
        $vars = $this->templateVariables();
        $result = NotificationTemplateRenderer::render('admission_status_changed', 'whatsapp', $vars);

        return [
            'phone' => $notifiable->phone ?? $notifiable->mobile ?? '',
            'message' => $result['message'],
            'template_name' => $result['provider_template_id'],
            'institution_id' => $this->application->institution_id ?? config('ems.default_institution_id'),
            'category' => 'admission',
        ];
    }

    private function templateVariables(): array
    {
        $statusText = $this->status === 'approved'
            ? 'APPROVED! Please complete the formalities.'
            : strtoupper($this->status) . '.';

        return [
            'type' => ucfirst($this->label()),
            'app_id' => $this->application->application_id,
            'status' => $statusText,
        ];
    }
}
