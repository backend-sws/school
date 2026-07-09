<?php

namespace App\Services;

use App\Models\NotificationTemplate;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

/**
 * Unified Notification Template Renderer.
 *
 * Resolves message templates from DB for any channel (sms, whatsapp, email, push, in_app).
 * Substitutes {variable} placeholders and returns the rendered result.
 *
 * Usage:
 *   // SMS
 *   $sms = NotificationTemplateRenderer::render('fee_due_reminder', 'sms', [
 *       'amount' => '5,000.00', 'date' => '01 Apr 2026', 'name' => 'Rahul', 'period' => 'April',
 *   ]);
 *   // => ['message' => 'Fee reminder: ₹5,000.00 due on ...', 'subject' => null, 'provider_template_id' => '123456']
 *
 *   // Email
 *   $email = NotificationTemplateRenderer::render('fee_due_reminder', 'email', [...]);
 *   // => ['message' => 'Your fee for ...', 'subject' => 'Fee Due Reminder', 'provider_template_id' => null]
 */
class NotificationTemplateRenderer
{
    /** Cache TTL in seconds (1 hour). */
    private const CACHE_TTL = 3600;

    /** Supported channels. */
    public const CHANNEL_SMS      = 'sms';
    public const CHANNEL_WHATSAPP = 'whatsapp';
    public const CHANNEL_EMAIL    = 'email';
    public const CHANNEL_PUSH     = 'push';
    public const CHANNEL_IN_APP   = 'in_app';

    /**
     * Render a notification template for a specific channel.
     *
     * @return array{message: string, subject: string|null, provider_template_id: string|null}
     */
    public static function render(string $key, string $channel, array $variables = []): array
    {
        $template = self::resolveTemplate($key, $channel);

        if (!$template) {
            Log::warning("[NotificationTemplate] Template not found: {$key}/{$channel}");
            return [
                'message' => '',
                'subject' => null,
                'provider_template_id' => null,
            ];
        }

        return [
            'message' => $template->render($variables),
            'subject' => $template->subject,
            'provider_template_id' => $template->provider_template_id,
        ];
    }

    /**
     * Check if a template exists and is active.
     */
    public static function has(string $key, string $channel): bool
    {
        return self::resolveTemplate($key, $channel) !== null;
    }

    /**
     * Resolve template from cache or DB.
     */
    private static function resolveTemplate(string $key, string $channel): ?NotificationTemplate
    {
        return Cache::remember(
            "notification_tpl:{$key}:{$channel}",
            self::CACHE_TTL,
            fn () => NotificationTemplate::findByKeyAndChannel($key, $channel)
        );
    }

    /**
     * Flush cached templates (call after admin updates).
     */
    public static function clearCache(?string $key = null, ?string $channel = null): void
    {
        if ($key && $channel) {
            Cache::forget("notification_tpl:{$key}:{$channel}");
            return;
        }

        $templates = NotificationTemplate::query();
        if ($key) {
            $templates->where('key', $key);
        }

        foreach ($templates->get() as $t) {
            Cache::forget("notification_tpl:{$t->key}:{$t->channel}");
        }
    }
}
