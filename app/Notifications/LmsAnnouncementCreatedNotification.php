<?php

namespace App\Notifications;

use App\Models\LmsAnnouncement;
use App\Models\LmsClass;
use App\Traits\NotifiesViaChannelMatrix;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;

class LmsAnnouncementCreatedNotification extends Notification implements ShouldQueue
{
    use NotifiesViaChannelMatrix, Queueable;

    public string $notificationType = 'lms_announcement_created';

    public function __construct(
        public LmsAnnouncement $announcement,
        public LmsClass $lmsClass
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $className = $this->lmsClass->name ?? 'Your class';
        $body = \Illuminate\Support\Str::limit(strip_tags((string) $this->announcement->body), 100);
        return [
            'type' => 'lms_announcement_created',
            'title' => 'New announcement',
            'body' => sprintf('%s — %s', $this->announcement->title, $body),
            'url' => sprintf('/lms/classes/%d/announcements', $this->lmsClass->id),
            'lms_class_id' => $this->lmsClass->id,
            'lms_announcement_id' => $this->announcement->id,
            'announcement_title' => $this->announcement->title,
            'class_name' => $className,
        ];
    }

    public function toWebPush(object $notifiable, Notification $notification): WebPushMessage
    {
        return (new WebPushMessage)
            ->title('New announcement')
            ->body(\Illuminate\Support\Str::limit($this->announcement->title, 80))
            ->data([
                'url' => sprintf('/lms/classes/%d/announcements', $this->lmsClass->id),
                'type' => 'lms_announcement_created',
                'lms_class_id' => $this->lmsClass->id,
                'lms_announcement_id' => $this->announcement->id,
            ]);
    }

    public function toWhatsapp(object $notifiable): array
    {
        return [
            'phone' => $notifiable->phone ?? $notifiable->mobile ?? '',
            'message' => sprintf(
                'Announcement in %s: %s',
                $this->lmsClass->name ?? 'Your class',
                $this->announcement->title
            ),
            'template_name' => config('notifications.whatsapp_templates.lms_announcement_created', 'announcement_v1'),
            'institution_id' => $notifiable->institution_id ?? config('ems.default_institution_id'),
            'category' => 'lms',
        ];
    }
}
