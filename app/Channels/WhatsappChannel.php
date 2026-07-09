<?php

namespace App\Channels;

use App\Services\WhatsappService;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

/**
 * Custom Laravel notification channel for WhatsApp.
 *
 * Bridges the Laravel notification system to our WhatsappService factory.
 * Notification classes must implement `toWhatsapp($notifiable)` returning:
 * ['phone' => string, 'message' => string, 'template_name' => string,
 *  'category' => ?string, 'media_url' => ?string, 'media_type' => ?string]
 */
class WhatsappChannel
{
    public function __construct(
        protected WhatsappService $whatsappService
    ) {}

    /**
     * Send the given notification via WhatsApp.
     */
    public function send(object $notifiable, Notification $notification): void
    {
        if (!method_exists($notification, 'toWhatsapp')) {
            return;
        }

        // Guard: skip if WhatsApp provider isn't configured (no env keys)
        if (!WhatsappService::isConfigured()) {
            return;
        }

        $data = $notification->toWhatsapp($notifiable);

        if (empty($data['phone'])) {
            Log::debug('[WhatsappChannel] No phone number, skipping', [
                'notification' => get_class($notification),
                'notifiable_id' => $notifiable->id ?? null,
            ]);
            return;
        }

        try {
            $institutionId = $data['institution_id']
                ?? $notifiable->institution_id
                ?? config('ems.default_institution_id');

            $this->whatsappService->send(
                $institutionId,
                $data['sent_by'] ?? $notifiable->id ?? 0,
                $data['phone'],
                $data['message'],
                $data['template_name'] ?: config('services.whatsapp.msg91_default_template', 'default_notification_v1'),
                $data['recipient_name'] ?? $notifiable->name ?? null,
                $data['recipient_user_id'] ?? $notifiable->id ?? null,
                $data['category'] ?? null,
                $data['media_url'] ?? null,
                $data['media_type'] ?? null
            );
        } catch (\Throwable $e) {
            Log::warning('[WhatsappChannel] Failed to dispatch WhatsApp', [
                'notification' => get_class($notification),
                'error' => $e->getMessage(),
            ]);
            // Don't throw — other channels should still send
        }
    }
}
