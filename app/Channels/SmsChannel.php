<?php

namespace App\Channels;

use App\Services\SmsService;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

/**
 * Custom Laravel notification channel for SMS.
 *
 * Bridges the Laravel notification system to our SmsService factory.
 * Notification classes must implement `toSms($notifiable)` returning:
 * ['phone' => string, 'message' => string, 'category' => ?string, 'template_id' => ?string]
 */
class SmsChannel
{
    public function __construct(
        protected SmsService $smsService
    ) {}

    /**
     * Send the given notification via SMS.
     */
    public function send(object $notifiable, Notification $notification): void
    {
        if (!method_exists($notification, 'toSms')) {
            return;
        }

        // Guard: skip if SMS provider isn't configured (no env keys)
        if (!SmsService::isConfigured()) {
            return;
        }

        $data = $notification->toSms($notifiable);

        if (empty($data['phone'])) {
            Log::debug('[SmsChannel] No phone number, skipping', [
                'notification' => get_class($notification),
                'notifiable_id' => $notifiable->id ?? null,
            ]);
            return;
        }

        try {
            $institutionId = $data['institution_id']
                ?? $notifiable->institution_id
                ?? config('ems.default_institution_id');

            $this->smsService->send(
                $institutionId,
                $data['sent_by'] ?? $notifiable->id ?? 0,
                $data['phone'],
                $data['message'],
                $data['recipient_name'] ?? $notifiable->name ?? null,
                $data['recipient_user_id'] ?? $notifiable->id ?? null,
                $data['category'] ?? null,
                $data['template_id'] ?: null
            );
        } catch (\Throwable $e) {
            Log::warning('[SmsChannel] Failed to dispatch SMS', [
                'notification' => get_class($notification),
                'error' => $e->getMessage(),
            ]);
            // Don't throw — other channels should still send
        }
    }
}
