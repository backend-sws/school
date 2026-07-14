<?php

namespace App\Traits;

use App\Channels\SmsChannel;
use App\Channels\WhatsappChannel;
use App\Services\SmsService;
use App\Services\WhatsappService;
use App\Support\ChannelMap;

/**
 * Config-driven notification channel resolution — Software Factory Pattern.
 *
 * Reads `config('notifications.channels.<type>')` to determine which
 * channels each notification should use (database, broadcast, push, mail, sms, whatsapp).
 *
 * Safety: automatically filters out unconfigured channels (e.g., if SMS env keys
 * are missing, 'sms' is silently dropped — no jobs dispatched, no errors).
 *
 * Usage:
 *   class FeeDueReminderNotification extends Notification {
 *       use NotifiesViaChannelMatrix, Queueable;
 *       public string $notificationType = 'fee_due_reminder';
 *   }
 */
trait NotifiesViaChannelMatrix
{
    /**
     * Get the notification's delivery channels from the channel matrix config.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        $type = $this->notificationType ?? 'default';

        $channels = config("notifications.channels.{$type}", ['database', 'broadcast', 'push']);

        // Filter out channels that aren't configured (missing env keys)
        $channels = array_filter($channels, function (string $channel) {
            return match ($channel) {
                'sms'      => SmsService::isConfigured(),
                'whatsapp' => WhatsappService::isConfigured(),
                'broadcast' => $this->isBroadcastConfigured(),
                'push'     => $this->isWebPushConfigured(),
                default    => true, // database, mail — always available
            };
        });

        return ChannelMap::resolveMany(array_values($channels));
    }

    private function isBroadcastConfigured(): bool
    {
        $driver = config('broadcasting.default', 'null');
        if ($driver === 'null' || empty($driver)) {
            return false;
        }

        if ($driver === 'pusher') {
            $key = config('broadcasting.connections.pusher.key');
            return !empty($key) && $key !== 'your_pusher_key' && $key !== 'your_pusher_app_key';
        }

        if ($driver === 'reverb') {
            $key = config('broadcasting.connections.reverb.key');
            return !empty($key);
        }

        return true;
    }

    private function isWebPushConfigured(): bool
    {
        $pubKey = config('webpush.vapid.public_key');
        return !empty($pubKey);
    }
}
