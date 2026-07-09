<?php

namespace App\Support;

use App\Channels\SmsChannel;
use App\Channels\WhatsappChannel;
use NotificationChannels\WebPush\WebPushChannel;

/**
 * Maps channel string keys (from config/notifications.php) to Laravel notification channel classes.
 *
 * Allows the channel matrix config to use human-readable strings like 'sms', 'whatsapp', 'push'
 * which get resolved to the actual channel classes at runtime.
 */
class ChannelMap
{
    /**
     * Map of string key → channel class.
     */
    protected static array $map = [
        'database'  => 'database',
        'broadcast' => 'broadcast',
        'mail'      => 'mail',
        'push'      => WebPushChannel::class,
        'sms'       => SmsChannel::class,
        'whatsapp'  => WhatsappChannel::class,
    ];

    /**
     * Resolve a string channel key to its class.
     */
    public static function resolve(string $key): string
    {
        return static::$map[$key] ?? $key;
    }

    /**
     * Resolve an array of channel keys.
     *
     * @param  array<string>  $keys
     * @return array<string>
     */
    public static function resolveMany(array $keys): array
    {
        return array_map([static::class, 'resolve'], $keys);
    }
}
