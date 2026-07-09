<?php

namespace App\Notifications;

use App\Models\Notice;
use App\Traits\NotifiesViaChannelMatrix;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;

class PublicNoticeNotification extends Notification implements ShouldQueue
{
    use NotifiesViaChannelMatrix, Queueable;

    public string $notificationType = 'public_notice';

    public function __construct(
        public Notice $notice
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $title = $this->notice->title ?? 'New notice';
        $body = \Illuminate\Support\Str::limit(strip_tags((string) ($this->notice->description ?? $title)), 120);
        return [
            'type' => 'public_notice',
            'title' => $title,
            'body' => $body,
            'url' => '/notices/'.$this->notice->id,
            'notice_id' => $this->notice->id,
        ];
    }

    public function toWebPush(object $notifiable, Notification $notification): WebPushMessage
    {
        $title = $this->notice->title ?? 'New notice';
        $body = \Illuminate\Support\Str::limit(strip_tags((string) ($this->notice->description ?? $title)), 120);
        return (new WebPushMessage)
            ->title($title)
            ->body($body)
            ->data([
                'url' => '/notices/'.$this->notice->id,
                'type' => 'public_notice',
                'notice_id' => $this->notice->id,
            ]);
    }

    public function toWhatsapp(object $notifiable): array
    {
        $title = $this->notice->title ?? 'New notice';
        $body = \Illuminate\Support\Str::limit(strip_tags((string) ($this->notice->description ?? $title)), 120);
        return [
            'phone' => $notifiable->phone ?? $notifiable->mobile ?? '',
            'message' => sprintf('Notice: %s — %s', $title, $body),
            'template_name' => config('notifications.whatsapp_templates.public_notice', 'public_notice_v1'),
            'institution_id' => $notifiable->institution_id ?? config('ems.default_institution_id'),
            'category' => 'notice',
        ];
    }
}
