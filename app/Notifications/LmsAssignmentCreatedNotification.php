<?php

namespace App\Notifications;

use App\Models\LmsAssignment;
use App\Models\LmsClass;
use App\Traits\NotifiesViaChannelMatrix;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;

class LmsAssignmentCreatedNotification extends Notification implements ShouldQueue
{
    use NotifiesViaChannelMatrix, Queueable;

    public string $notificationType = 'lms_assignment_created';

    public function __construct(
        public LmsAssignment $assignment,
        public LmsClass $lmsClass
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $className = $this->lmsClass->name ?? 'Your class';
        $due = $this->assignment->due_at
            ? ' Due ' . $this->assignment->due_at->format('M j, Y')
            : '';
        return [
            'type' => 'lms_assignment_created',
            'title' => 'New assignment',
            'body' => sprintf('"%s" added in %s.%s', $this->assignment->title, $className, $due),
            'url' => sprintf('/lms/classes/%d/assignments/%d', $this->lmsClass->id, $this->assignment->id),
            'lms_class_id' => $this->lmsClass->id,
            'lms_assignment_id' => $this->assignment->id,
            'assignment_title' => $this->assignment->title,
            'class_name' => $className,
        ];
    }

    public function toWebPush(object $notifiable, Notification $notification): WebPushMessage
    {
        $className = $this->lmsClass->name ?? 'Your class';
        return (new WebPushMessage)
            ->title('New assignment')
            ->body(sprintf('"%s" in %s', $this->assignment->title, $className))
            ->data([
                'url' => sprintf('/lms/classes/%d/assignments/%d', $this->lmsClass->id, $this->assignment->id),
                'type' => 'lms_assignment_created',
                'lms_class_id' => $this->lmsClass->id,
                'lms_assignment_id' => $this->assignment->id,
            ]);
    }
}
