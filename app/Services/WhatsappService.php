<?php

namespace App\Services;

use App\Exceptions\SmsQuotaExceededException;
use App\Jobs\SendCommunicationJob;
use App\Models\CommunicationLog;
use App\Models\Institution;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * WhatsApp Service — Provider-agnostic WhatsApp messaging.
 *
 * Follows the Software Factory pattern:
 * - Repeatable pipeline: send() → log → queue → dispatch → webhook
 * - Provider abstraction: swap via config('services.whatsapp.provider')
 * - Logging & traceability: every message logged with full lifecycle
 * - Auto-retry: via SendCommunicationJob (3 attempts, exponential backoff)
 * - Quota enforcement: per-institution daily/monthly caps
 *
 * Supports Msg91 WhatsApp API out of the box.
 */
class WhatsappService
{
    /**
     * Check if WhatsApp sending is properly configured.
     * Returns false when auth keys/number are missing — channels will skip silently.
     */
    public static function isConfigured(): bool
    {
        $provider = config('services.whatsapp.provider', 'msg91');

        return match ($provider) {
            'msg91' => !empty(config('services.whatsapp.msg91_auth_key'))
                    && !empty(config('services.whatsapp.msg91_integrated_number')),
            default => false,
        };
    }

    /**
     * Send a single WhatsApp message (queued).
     */
    public function send(
        ?int $institutionId,
        ?int $sentBy,
        string $phone,
        string $message,
        string $templateName,
        ?string $recipientName = null,
        ?int $recipientUserId = null,
        ?string $category = null,
        ?string $mediaUrl = null,
        ?string $mediaType = null
    ): CommunicationLog {
        if ($institutionId !== null) {
            $this->checkQuota($institutionId);
        }

        $log = CommunicationLog::create([
            'institution_id'    => $institutionId,
            'channel'           => CommunicationLog::CHANNEL_WHATSAPP,
            'sent_by'           => $sentBy,
            'recipient_phone'   => $phone,
            'recipient_name'    => $recipientName,
            'recipient_user_id' => $recipientUserId,
            'template_id'       => $templateName,
            'message'           => $message,
            'media_url'         => $mediaUrl,
            'media_type'        => $mediaType,
            'status'            => 'queued',
            'provider'          => config('services.whatsapp.provider', 'msg91'),
            'category'          => $category,
        ]);

        SendCommunicationJob::dispatch($log);

        return $log;
    }

    /**
     * Send bulk WhatsApp messages to multiple recipients.
     */
    public function sendBulk(
        ?int $institutionId,
        ?int $sentBy,
        array $recipients, // [{phone, name, user_id?}]
        string $message,
        string $templateName,
        ?string $category = null,
        ?string $mediaUrl = null,
        ?string $mediaType = null
    ): array {
        if ($institutionId !== null) {
            $this->checkQuota($institutionId, count($recipients));
        }

        $logs = [];
        foreach ($recipients as $r) {
            $logs[] = $this->send(
                $institutionId,
                $sentBy,
                $r['phone'],
                $message,
                $templateName,
                $r['name'] ?? null,
                $r['user_id'] ?? null,
                $category,
                $mediaUrl,
                $mediaType
            );
        }
        return $logs;
    }

    /**
     * Get WhatsApp usage stats for an institution.
     */
    public function getStats(int $institutionId, ?string $from = null, ?string $to = null): array
    {
        $query = CommunicationLog::forInstitution($institutionId)->whatsapp();

        if ($from) $query->where('created_at', '>=', $from);
        if ($to) $query->where('created_at', '<=', $to);

        $institution = Institution::find($institutionId);

        $monthlyUsed = CommunicationLog::forInstitution($institutionId)->whatsapp()
            ->where('created_at', '>=', now()->startOfMonth())
            ->count();

        $dailyUsed = CommunicationLog::forInstitution($institutionId)->whatsapp()
            ->where('created_at', '>=', now()->startOfDay())
            ->count();

        return [
            'total'       => (clone $query)->count(),
            'sent'        => (clone $query)->where('status', 'sent')->count(),
            'delivered'   => (clone $query)->where('status', 'delivered')->count(),
            'read'        => (clone $query)->where('status', 'read')->count(),
            'failed'      => (clone $query)->where('status', 'failed')->count(),
            'total_cost'  => round((clone $query)->sum('cost'), 2),
            'by_category' => (clone $query)->selectRaw('category, count(*) as count')
                ->groupBy('category')
                ->pluck('count', 'category')
                ->toArray(),
            'quota' => [
                'monthly_limit'    => $institution?->whatsapp_monthly_quota ?? 500,
                'monthly_used'     => $monthlyUsed,
                'monthly_remaining' => max(0, ($institution?->whatsapp_monthly_quota ?? 500) - $monthlyUsed),
                'daily_limit'      => $institution?->whatsapp_daily_limit ?? 100,
                'daily_used'       => $dailyUsed,
                'daily_remaining'  => max(0, ($institution?->whatsapp_daily_limit ?? 100) - $dailyUsed),
            ],
        ];
    }

    // ── Quota Check ──────────────────────────────────────────────

    /**
     * Check if institution has remaining WhatsApp quota.
     *
     * @throws \App\Exceptions\SmsQuotaExceededException
     */
    public function checkQuota(?int $institutionId, int $count = 1): void
    {
        if ($institutionId === null) return;
        $institution = Institution::find($institutionId);
        if (!$institution) return;

        $monthlyUsed = CommunicationLog::forInstitution($institutionId)->whatsapp()
            ->where('created_at', '>=', now()->startOfMonth())
            ->count();

        if (($monthlyUsed + $count) > ($institution->whatsapp_monthly_quota ?? 500)) {
            throw new SmsQuotaExceededException(
                "Monthly WhatsApp quota exceeded ({$monthlyUsed}/{$institution->whatsapp_monthly_quota})."
            );
        }

        $dailyUsed = CommunicationLog::forInstitution($institutionId)->whatsapp()
            ->where('created_at', '>=', now()->startOfDay())
            ->count();

        if (($dailyUsed + $count) > ($institution->whatsapp_daily_limit ?? 100)) {
            throw new SmsQuotaExceededException(
                "Daily WhatsApp limit exceeded ({$dailyUsed}/{$institution->whatsapp_daily_limit})."
            );
        }
    }

    // ── Provider Dispatch ──────────────────────────────────────────

    /**
     * Dispatch to the configured WhatsApp provider.
     * Public so SendCommunicationJob can call it directly.
     */
    public function dispatchToProvider(CommunicationLog $log): string
    {
        $provider = config('services.whatsapp.provider', 'msg91');

        return match ($provider) {
            'msg91' => $this->sendViaMsg91($log),
            default => $this->sendViaGeneric($log),
        };
    }

    protected function sendViaMsg91(CommunicationLog $log): string
    {
        $payload = [
            'integrated_number' => config('services.whatsapp.msg91_integrated_number'),
            'content_type' => $log->media_url ? 'media_template' : 'template',
            'payload' => [
                'messaging_product' => 'whatsapp',
                'type' => 'template',
                'template' => [
                    'name' => $log->template_id,
                    'language' => ['code' => 'en'],
                    'components' => [
                        [
                            'type' => 'body',
                            'parameters' => [
                                ['type' => 'text', 'text' => $log->message],
                            ],
                        ],
                    ],
                ],
            ],
            'recipients' => [
                ['mobiles' => $log->recipient_phone],
            ],
        ];

        // Add media header component if present
        if ($log->media_url) {
            $mediaComponent = [
                'type' => 'header',
                'parameters' => [
                    [
                        'type' => $log->media_type ?? 'image',
                        $log->media_type ?? 'image' => ['link' => $log->media_url],
                    ],
                ],
            ];
            $payload['payload']['template']['components'][] = $mediaComponent;
        }

        $response = Http::withHeaders([
            'authkey' => config('services.whatsapp.msg91_auth_key'),
            'Content-Type' => 'application/json',
        ])->post('https://control.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/', $payload);

        if (!$response->successful()) {
            throw new \RuntimeException("Msg91 WhatsApp error: " . $response->body());
        }

        return $response->json('request_id', 'wa-msg91-' . uniqid());
    }

    protected function sendViaGeneric(CommunicationLog $log): string
    {
        Log::info('[WhatsApp] Generic provider (no-op)', [
            'phone'    => $log->recipient_phone,
            'template' => $log->template_id,
        ]);
        return 'wa-generic-' . uniqid();
    }

    /**
     * Process an alert rule — send templated WhatsApp messages to matching recipients.
     */
    public function processAlertRule(\App\Models\AlertRule $rule, array $recipients): int
    {
        $sentCount = 0;
        $templateName = config("notifications.whatsapp_templates.{$rule->trigger_event}", 'alert_' . $rule->trigger_event);

        foreach ($recipients as $r) {
            $message = $rule->renderMessage($r['variables'] ?? []);
            $this->send(
                $rule->institution_id,
                $rule->created_by,
                $r['phone'],
                $message,
                $templateName,
                $r['name'] ?? null,
                $r['user_id'] ?? null,
                $rule->trigger_event
            );
            $sentCount++;
        }

        $rule->recordTrigger();

        return $sentCount;
    }
}
