<?php

namespace App\Notifications;

use App\Models\LmsClass;
use App\Models\LmsTest;
use App\Traits\NotifiesViaChannelMatrix;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;

class LmsTestCreatedNotification extends Notification implements ShouldQueue
{
    use NotifiesViaChannelMatrix, Queueable;

    public string $notificationType = 'lms_test_created';

    public function __construct(
        public LmsTest $test,
        public LmsClass $lmsClass
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $className = $this->lmsClass->name ?? 'Your class';
        return [
            'type' => 'lms_test_created',
            'title' => 'New test',
            'body' => sprintf('A new test "%s" is available in %s.', $this->test->title, $className),
            'url' => sprintf('/lms/classes/%d/tests/%d', $this->lmsClass->id, $this->test->id),
            'lms_class_id' => $this->lmsClass->id,
            'lms_test_id' => $this->test->id,
            'test_title' => $this->test->title,
            'class_name' => $className,
        ];
    }

    public function toWebPush(object $notifiable, Notification $notification): WebPushMessage
    {
        $className = $this->lmsClass->name ?? 'Your class';
        return (new WebPushMessage)
            ->title('New test')
            ->body(sprintf('A new test "%s" is available in %s.', $this->test->title, $className))
            ->data([
                'url' => sprintf('/lms/classes/%d/tests/%d', $this->lmsClass->id, $this->test->id),
                'type' => 'lms_test_created',
                'lms_class_id' => $this->lmsClass->id,
                'lms_test_id' => $this->test->id,
            ]);
    }
}
