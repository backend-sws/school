<?php

namespace App\Notifications;

use App\Services\NotificationTemplateRenderer;
use App\Traits\NotifiesViaChannelMatrix;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;

class AttendanceMarkedNotification extends Notification implements ShouldQueue
{
    use NotifiesViaChannelMatrix, Queueable;

    public string $notificationType = 'attendance_marked';

    public function __construct(
        public string $date,
        public string $status,
        public ?string $className = null,
        public ?int $institutionId = null
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $classLabel = $this->className ? " for {$this->className}" : '';
        $body = sprintf('Your attendance for %s was marked as %s%s.', $this->date, $this->status, $classLabel);
        return [
            'type' => 'attendance_marked',
            'title' => 'Attendance recorded',
            'body' => $body,
            'url' => '/attendance',
            'date' => $this->date,
            'status' => $this->status,
            'class_name' => $this->className,
        ];
    }

    public function toWebPush(object $notifiable, Notification $notification): WebPushMessage
    {
        $classLabel = $this->className ? " for {$this->className}" : '';
        $body = sprintf('Your attendance for %s was marked as %s%s.', $this->date, $this->status, $classLabel);
        return (new WebPushMessage)
            ->title('Attendance recorded')
            ->body($body)
            ->data([
                'url' => '/attendance',
                'type' => 'attendance_marked',
                'date' => $this->date,
                'status' => $this->status,
            ]);
    }

    public function toSms(object $notifiable): array
    {
        $vars = $this->templateVariables($notifiable);
        $result = NotificationTemplateRenderer::render('attendance_marked', 'sms', $vars);

        return [
            'phone' => $notifiable->phone ?? $notifiable->mobile ?? '',
            'message' => $result['message'],
            'institution_id' => $this->institutionId ?? $notifiable->institution_id ?? config('ems.default_institution_id'),
            'category' => 'attendance',
            'template_id' => $result['provider_template_id'],
        ];
    }

    public function toWhatsapp(object $notifiable): array
    {
        $vars = $this->templateVariables($notifiable);
        $result = NotificationTemplateRenderer::render('attendance_marked', 'whatsapp', $vars);

        return [
            'phone' => $notifiable->phone ?? $notifiable->mobile ?? '',
            'message' => $result['message'],
            'template_name' => $result['provider_template_id'],
            'institution_id' => $this->institutionId ?? $notifiable->institution_id ?? config('ems.default_institution_id'),
            'category' => 'attendance',
        ];
    }

    private function templateVariables(object $notifiable): array
    {
        return [
            'name' => $notifiable->name ?? 'Student',
            'status' => strtoupper($this->status),
            'date' => $this->date,
            'class' => $this->className ? " ({$this->className})" : '',
        ];
    }
}
