<?php

namespace App\Notifications;

use App\Models\LmsClass;
use App\Models\LmsRecording;
use App\Traits\NotifiesViaChannelMatrix;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;

class LmsRecordingAddedNotification extends Notification implements ShouldQueue
{
    use NotifiesViaChannelMatrix, Queueable;

    public string $notificationType = 'lms_recording_added';

    public function __construct(
        public LmsRecording $recording,
        public LmsClass $lmsClass
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $className = $this->lmsClass->name ?? 'Your class';
        return [
            'type' => 'lms_recording_added',
            'title' => 'New recording',
            'body' => sprintf('"%s" is now available in %s.', $this->recording->title, $className),
            'url' => sprintf('/lms/classes/%d/recordings', $this->lmsClass->id),
            'lms_class_id' => $this->lmsClass->id,
            'lms_recording_id' => $this->recording->id,
            'recording_title' => $this->recording->title,
            'class_name' => $className,
        ];
    }

    public function toWebPush(object $notifiable, Notification $notification): WebPushMessage
    {
        $className = $this->lmsClass->name ?? 'Your class';
        return (new WebPushMessage)
            ->title('New recording')
            ->body(sprintf('"%s" in %s', $this->recording->title, $className))
            ->data([
                'url' => sprintf('/lms/classes/%d/recordings', $this->lmsClass->id),
                'type' => 'lms_recording_added',
                'lms_class_id' => $this->lmsClass->id,
                'lms_recording_id' => $this->recording->id,
            ]);
    }
}
