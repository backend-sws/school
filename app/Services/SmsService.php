<?php

namespace App\Services;

use App\Jobs\SendCommunicationJob;
use App\Models\AlertRule;
use App\Models\CommunicationLog;
use App\Models\Institution;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * SMS Service — sends SMS via configured HTTP API provider (Adcruxmedia).
 *
 * Phone normalization:
 *   - Strips all non-digit characters
 *   - Strips leading country code '91' from 12-digit numbers
 *   - Final number MUST be exactly 10 digits (Indian mobile)
 *
 * Each send creates a CommunicationLog record and dispatches a queued job.
 */
class SmsService
{
    /**
     * Check if SMS sending is properly configured.
     * Returns false when keys are missing — channels will skip SMS silently.
     */
    public static function isConfigured(): bool
    {
        return !empty(config('services.sms.api_key'))
            && !empty(config('services.sms.sender_id'));
    }

    /**
     * Normalize a phone number to 10-digit Indian mobile format.
     *
     * Strips '+', '91' country code, spaces, dashes, etc.
     * Returns exactly 10 digits or logs a warning.
     */
    public static function normalizePhone(string $phone): string
    {
        // Strip everything except digits
        $digits = preg_replace('/[^0-9]/', '', $phone);

        // Strip leading country code '91' from 12-digit numbers
        if (strlen($digits) === 12 && str_starts_with($digits, '91')) {
            $digits = substr($digits, 2);
        }

        // Strip leading '0' from 11-digit numbers (e.g., 09939826940)
        if (strlen($digits) === 11 && str_starts_with($digits, '0')) {
            $digits = substr($digits, 1);
        }

        if (strlen($digits) !== 10) {
            Log::warning("SMS phone normalization: expected 10 digits, got " . strlen($digits), [
                'original' => $phone,
                'normalized' => $digits,
            ]);
        }

        return $digits;
    }

    /**
     * Generate all possible storage formats for a mobile number.
     *
     * Given any input (9939826940, +919939826940, 919939826940),
     * returns all variants the DB might store: bare 10-digit, +91 prefixed, 91 prefixed.
     *
     * @return string[]
     */
    public static function getMobileVariants(string $phone): array
    {
        $digits = preg_replace('/[^0-9]/', '', $phone);

        if (strlen($digits) === 10) {
            return array_unique([$phone, $digits, '+91' . $digits, '91' . $digits]);
        }

        if (strlen($digits) === 12 && str_starts_with($digits, '91')) {
            $bare = substr($digits, 2);
            return array_unique([$phone, $digits, '+' . $digits, $bare]);
        }

        // Fallback: return original + digits-only
        return array_unique([$phone, $digits]);
    }

    /**
     * Send a single SMS (queued).
     */
    public function send(
        ?int $institutionId,
        ?int $sentBy,
        string $phone,
        string $message,
        ?string $recipientName = null,
        ?int $recipientUserId = null,
        ?string $category = null,
        ?string $templateId = null
    ): CommunicationLog {

        // NOTE: Institution branding is baked into DLT-registered templates.
        // Do NOT append extra text here — it will cause DLT mismatch and SMS rejection.

        $normalizedPhone = self::normalizePhone($phone);

        $log = CommunicationLog::create([
            'institution_id'    => $institutionId,
            'channel'           => CommunicationLog::CHANNEL_SMS,
            'sent_by'           => $sentBy,
            'recipient_phone'   => $normalizedPhone,
            'recipient_name'    => $recipientName,
            'recipient_user_id' => $recipientUserId,
            'template_id'       => $templateId,
            'message'           => $message,
            'status'            => 'queued',
            'provider'          => 'sms',
            'category'          => $category,
        ]);

        SendCommunicationJob::dispatch($log);

        return $log;
    }

    /**
     * Send bulk SMS to multiple recipients.
     */
    public function sendBulk(
        ?int $institutionId,
        int $sentBy,
        array $recipients,
        string $message,
        ?string $category = null,
        ?string $templateId = null
    ): array {
        $logs = [];
        foreach ($recipients as $r) {
            $logs[] = $this->send(
                $institutionId,
                $sentBy,
                $r['phone'],
                $message,
                $r['name'] ?? null,
                $r['user_id'] ?? null,
                $category,
                $templateId
            );
        }
        return $logs;
    }

    /**
     * Process an alert rule — send messages to matching recipients.
     */
    public function processAlertRule(AlertRule $rule, array $recipients): int
    {
        $sentCount = 0;
        foreach ($recipients as $r) {
            $message = $rule->renderMessage($r['variables'] ?? []);
            $this->send(
                $rule->institution_id,
                $rule->created_by,
                $r['phone'],
                $message,
                $r['name'] ?? null,
                $r['user_id'] ?? null,
                $rule->trigger_event
            );
            $sentCount++;
        }

        $rule->recordTrigger();

        return $sentCount;
    }

    /**
     * Get SMS usage stats.
     */
    public function getStats(int $institutionId, ?string $from = null, ?string $to = null): array
    {
        $query = CommunicationLog::forInstitution($institutionId)->sms();

        if ($from) $query->where('created_at', '>=', $from);
        if ($to) $query->where('created_at', '<=', $to);

        return [
            'total'       => (clone $query)->count(),
            'sent'        => (clone $query)->where('status', 'sent')->count(),
            'delivered'   => (clone $query)->where('status', 'delivered')->count(),
            'failed'      => (clone $query)->where('status', 'failed')->count(),
            'total_cost'  => round((clone $query)->sum('cost'), 2),
            'by_category' => (clone $query)->selectRaw('category, count(*) as count')
                ->groupBy('category')
                ->pluck('count', 'category')
                ->toArray(),
        ];
    }

    // ── Provider Dispatch ──────────────────────────────────────────

    /**
     * Dispatch SMS to the Adcruxmedia HTTP API.
     * Public so SendCommunicationJob can call it directly.
     *
     * Phone is re-normalized here as a safety net (the DB value
     * should already be 10 digits from send(), but this guards
     * against legacy data or direct calls).
     */
    public function dispatchToProvider(string $phone, string $message, ?string $templateId): string
    {
        $apiKey   = config('services.sms.api_key');
        $senderId = config('services.sms.sender_id');
        $baseUrl  = config('services.sms.base_url', 'http://web.adcruxmedia.in/vb/apikey.php');

        // Resolve DLT template ID — fail fast if none available.
        // Sending without a matching DLT template always results in
        // error 118 (Template not found) or 120 (Template not Matched).
        if ($templateId) {
            $template = $templateId;
        } else {
            $template = config('services.sms.template_id');

            if (empty($template)) {
                throw new \RuntimeException(
                    'SMS send blocked: no DLT template ID provided and no global SMS_TEMPLATE_ID configured. '
                    . 'Register this message template on the DLT portal and update the notification_templates table.'
                );
            }

            Log::warning('[SMS] No DLT template ID provided — falling back to global SMS_TEMPLATE_ID. This will likely cause a DLT mismatch error.', [
                'phone'              => $phone,
                'global_template_id' => $template,
                'message_preview'    => mb_substr($message, 0, 50),
            ]);
        }

        // Safety-net normalization (should already be 10 digits)
        $phone = self::normalizePhone($phone);
        if (strlen($phone) === 10) {
            $phone = '91' . $phone;
        }

        // Detect if message is Unicode (non-ASCII)
        $isUnicode = strlen($message) !== mb_strlen($message, 'UTF-8');

        $params = [
            'apikey'     => $apiKey,
            'senderid'   => $senderId,
            'templateid' => $template,
            'number'     => $phone,
            'message'    => $message,
            'format'     => 'json',
            'route'      => 1, // Default route as shown in docs
        ];

        if ($isUnicode) {
            $params['unicode'] = 2;
        }

        Log::info('[SMS] Dispatching to provider', [
            'phone' => $phone,
            'template' => $template,
            'unicode' => $isUnicode,
        ]);

        $response = Http::get($baseUrl, $params);

        $body = $response->json();
        $code = $body['code'] ?? null;

        Log::info('[SMS] Provider response', [
            'phone' => $phone,
            'code' => $code,
            'body' => $body,
        ]);

        // Success code is "011"
        if ($code !== '011') {
            $knownDesc = config("sms_error_codes.{$code}");
            $desc = $knownDesc ?? $body['description'] ?? $response->body();
            throw new \RuntimeException("SMS send failed [{$code}]: {$desc}");
        }

        return data_get($body, 'data.messageid', 'sms-' . uniqid());
    }
}
