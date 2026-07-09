<?php

namespace App\Notifications;

use App\Models\LmsClass;
use App\Models\LmsLiveSession;
use App\Traits\NotifiesViaChannelMatrix;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;

class LmsLiveSessionScheduledNotification extends Notification implements ShouldQueue
{
    use NotifiesViaChannelMatrix, Queueable;

    public string $notificationType = 'lms_live_session_scheduled';

    public function __construct(
        public LmsLiveSession $liveSession,
        public LmsClass $lmsClass
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $className = $this->lmsClass->name ?? 'Your class';
        $at = $this->liveSession->scheduled_at
            ? $this->liveSession->scheduled_at->format('M j, g:i A')
            : 'soon';
        return [
            'type' => 'lms_live_session_scheduled',
            'title' => 'Live session scheduled',
            'body' => sprintf('"%s" in %s at %s.', $this->liveSession->title, $className, $at),
            'url' => sprintf('/lms/classes/%d/live-sessions/%d', $this->lmsClass->id, $this->liveSession->id),
            'lms_class_id' => $this->lmsClass->id,
            'lms_live_session_id' => $this->liveSession->id,
            'session_title' => $this->liveSession->title,
            'scheduled_at' => $this->liveSession->scheduled_at?->toIso8601String(),
            'class_name' => $className,
        ];
    }

    public function toWebPush(object $notifiable, Notification $notification): WebPushMessage
    {
        $className = $this->lmsClass->name ?? 'Your class';
        $at = $this->liveSession->scheduled_at ? $this->liveSession->scheduled_at->format('M j, g:i A') : 'soon';
        return (new WebPushMessage)
            ->title('Live session scheduled')
            ->body(sprintf('"%s" in %s at %s', $this->liveSession->title, $className, $at))
            ->data([
                'url' => sprintf('/lms/classes/%d/live-sessions/%d', $this->lmsClass->id, $this->liveSession->id),
                'type' => 'lms_live_session_scheduled',
                'lms_class_id' => $this->lmsClass->id,
                'lms_live_session_id' => $this->liveSession->id,
            ]);
    }

    public function toWhatsapp(object $notifiable): array
    {
        $className = $this->lmsClass->name ?? 'Your class';
        $at = $this->liveSession->scheduled_at
            ? $this->liveSession->scheduled_at->format('M j, g:i A')
            : 'soon';
        return [
            'phone' => $notifiable->phone ?? $notifiable->mobile ?? '',
            'message' => sprintf(
                'Live session "%s" in %s at %s. Join from your student portal.',
                $this->liveSession->title,
                $className,
                $at
            ),
            'template_name' => config('notifications.whatsapp_templates.lms_live_session_scheduled', 'live_session_v1'),
            'institution_id' => $notifiable->institution_id ?? config('ems.default_institution_id'),
            'category' => 'lms',
        ];
    }
}
