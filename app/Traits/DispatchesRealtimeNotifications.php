<?php

namespace App\Traits;

use Illuminate\Contracts\Notifications\Dispatcher;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Use in any controller or service that needs to send realtime (+ DB + push) notifications.
 * Single entry point: notifyRealtime() / notifyRealtimeMany().
 *
 * Channels run in order: database, broadcast, web push. If broadcast or web push fails,
 * the notification is already stored (database ran first). We catch, log, and do not
 * re-insert to avoid duplicate key errors.
 */
trait DispatchesRealtimeNotifications
{
    /**
     * Send a notification to a single notifiable (database + broadcast + web push).
     */
    protected function notifyRealtime(mixed $notifiable, object $notification): void
    {
        $this->sendRealtimeNotification($notifiable, $notification);
    }

    /**
     * Send a notification to multiple notifiables.
     *
     * @param  \Illuminate\Support\Collection<int, \Illuminate\Contracts\Notifications\CanReceiveNotifications>|array  $notifiables
     */
    protected function notifyRealtimeMany(Collection|array $notifiables, object $notification): void
    {
        $targets = $notifiables instanceof Collection ? $notifiables : collect($notifiables);
        foreach ($targets as $notifiable) {
            $this->sendRealtimeNotification($notifiable, $notification);
        }
    }

    /**
     * Send to one notifiable. Ensure notification has a UUID (required by database channel).
     * If broadcast/web push fails after database has stored the notification, we only log—do not insert again.
     */
    private function sendRealtimeNotification(mixed $notifiable, object $notification): void
    {
        if (! isset($notification->id) || $notification->id === null) {
            $notification->id = (string) Str::uuid();
        }

        try {
            $this->getRealtimeNotificationDispatcher()->send($notifiable, $notification);
        } catch (\Throwable $e) {
            Log::warning('Realtime notification: broadcast or web push failed (database may already have stored it).', [
                'exception' => $e->getMessage(),
                'notifiable_type' => is_object($notifiable) ? get_class($notifiable) : null,
                'notifiable_id' => is_object($notifiable) && method_exists($notifiable, 'getKey') ? $notifiable->getKey() : null,
            ]);
            // Do not call DatabaseChannel::send() here: dispatcher runs database channel first,
            // so the row is already inserted; a second insert would cause a duplicate key error.
        }
    }

    protected function getRealtimeNotificationDispatcher(): Dispatcher
    {
        return app(Dispatcher::class);
    }
}
