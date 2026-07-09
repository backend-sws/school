<?php

namespace App\Traits;

/**
 * Use on User (or any model that receives notifications) for a single place for
 * realtime channel name and optional push subscription contract.
 */
trait NotifiableRealtime
{
    /**
     * Get the broadcast channel name for this notifiable (private user channel).
     */
    public function realtimeChannelName(): string
    {
        return 'App.Models.User.'.$this->getKey();
    }

    /**
     * Get the channel the notification should be broadcast on (for Laravel broadcast driver).
     *
     * @return string
     */
    public function routeNotificationForBroadcast(): string
    {
        return $this->realtimeChannelName();
    }
}
