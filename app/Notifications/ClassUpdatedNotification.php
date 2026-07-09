<?php

namespace App\Notifications;

use App\Models\LmsClass;
use App\Traits\NotifiesViaChannelMatrix;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;

class ClassUpdatedNotification extends Notification implements ShouldQueue
{
    use NotifiesViaChannelMatrix, Queueable;

    public string $notificationType = 'class_updated';

    public function __construct(
        public LmsClass $lmsClass
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $className = $this->lmsClass->name ?? 'Your class';
        return [
            'type' => 'class_updated',
            'title' => 'Class update',
            'body' => sprintf('Updates were made to %s. Check the class for details.', $className),
            'url' => '/lms/classes/'.$this->lmsClass->id,
            'lms_class_id' => $this->lmsClass->id,
            'class_name' => $className,
        ];
    }

    public function toWebPush(object $notifiable, Notification $notification): WebPushMessage
    {
        $className = $this->lmsClass->name ?? 'Your class';
        return (new WebPushMessage)
            ->title('Class update')
            ->body(sprintf('Updates were made to %s. Check the class for details.', $className))
            ->data([
                'url' => '/lms/classes/'.$this->lmsClass->id,
                'type' => 'class_updated',
                'lms_class_id' => $this->lmsClass->id,
            ]);
    }
}
