<?php

namespace App\Notifications;

use App\Models\LmsClass;
use App\Models\LmsMaterial;
use App\Traits\NotifiesViaChannelMatrix;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;

class LmsMaterialCreatedNotification extends Notification implements ShouldQueue
{
    use NotifiesViaChannelMatrix, Queueable;

    public string $notificationType = 'lms_material_created';

    public function __construct(
        public LmsMaterial $material,
        public LmsClass $lmsClass
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $className = $this->lmsClass->name ?? 'Your class';
        return [
            'type' => 'lms_material_created',
            'title' => 'New material',
            'body' => sprintf('"%s" was added to %s.', $this->material->title, $className),
            'url' => sprintf('/lms/classes/%d/materials', $this->lmsClass->id),
            'lms_class_id' => $this->lmsClass->id,
            'lms_material_id' => $this->material->id,
            'material_title' => $this->material->title,
            'class_name' => $className,
        ];
    }

    public function toWebPush(object $notifiable, Notification $notification): WebPushMessage
    {
        $className = $this->lmsClass->name ?? 'Your class';
        return (new WebPushMessage)
            ->title('New material')
            ->body(sprintf('"%s" in %s', $this->material->title, $className))
            ->data([
                'url' => sprintf('/lms/classes/%d/materials', $this->lmsClass->id),
                'type' => 'lms_material_created',
                'lms_class_id' => $this->lmsClass->id,
                'lms_material_id' => $this->material->id,
            ]);
    }
}
