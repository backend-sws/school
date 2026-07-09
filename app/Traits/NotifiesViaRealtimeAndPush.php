<?php
namespace App\Traits;

use NotificationChannels\WebPush\WebPushChannel;

/**
 * Use on every notification class that should go to in-app realtime (database + broadcast) and web push.
 * Notification class must implement toWebPush() for push to be sent (WebPushMessage).
 */
trait NotifiesViaRealtimeAndPush
{
    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return [
            'database',
            'broadcast',
            WebPushChannel::class,
        ];
    }
}