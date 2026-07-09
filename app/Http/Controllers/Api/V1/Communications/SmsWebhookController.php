<?php

namespace App\Http\Controllers\Api\V1\Communications;

use App\Http\Controllers\Controller;
use App\Models\CommunicationLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Handles delivery report (DLR) webhooks from messaging providers.
 *
 * Msg91 sends POST requests when an SMS/WhatsApp message status changes.
 * This controller looks up the log by provider_message_id and updates status.
 */
class SmsWebhookController extends Controller
{
    // ── SMS Webhook ──────────────────────────────────────────────

    /**
     * Handle Msg91 SMS delivery webhook.
     */
    public function msg91(Request $request): JsonResponse
    {
        $secret = config('services.sms.webhook_secret');
        if ($secret && $request->header('X-Webhook-Secret') !== $secret) {
            Log::warning('[SMS Webhook] Invalid secret', [
                'ip' => $request->ip(),
            ]);
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $requestId = $request->input('request_id') ?? $request->input('requestId');
        $status = $request->input('status');
        $description = $request->input('desc') ?? $request->input('description', '');

        if (!$requestId) {
            return response()->json(['error' => 'Missing request_id'], 422);
        }

        $log = CommunicationLog::sms()
            ->where('provider_message_id', $requestId)
            ->first();

        if (!$log) {
            Log::warning('[SMS Webhook] Log not found', [
                'request_id' => $requestId,
            ]);
            return response()->json(['error' => 'Not found'], 404);
        }

        $mappedStatus = $this->mapMsg91SmsStatus($status);

        match ($mappedStatus) {
            'delivered' => $log->markDelivered(),
            'failed' => $log->markFailed($description ?: 'Delivery failed (carrier)'),
            default => Log::info('[SMS Webhook] Unhandled status', [
                'request_id' => $requestId,
                'status' => $status,
            ]),
        };

        Log::info('[SMS Webhook] Processed', [
            'log_id' => $log->id,
            'status' => $mappedStatus,
        ]);

        return response()->json(['message' => 'OK']);
    }

    // ── WhatsApp Webhook ─────────────────────────────────────────

    /**
     * Handle Msg91 WhatsApp delivery webhook.
     *
     * WhatsApp statuses include: sent, delivered, read, failed.
     */
    public function msg91Whatsapp(Request $request): JsonResponse
    {
        $secret = config('services.whatsapp.webhook_secret');
        if ($secret && $request->header('X-Webhook-Secret') !== $secret) {
            Log::warning('[WhatsApp Webhook] Invalid secret', [
                'ip' => $request->ip(),
            ]);
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $requestId = $request->input('request_id') ?? $request->input('requestId');
        $status = $request->input('status');
        $description = $request->input('desc') ?? $request->input('description', '');

        if (!$requestId) {
            return response()->json(['error' => 'Missing request_id'], 422);
        }

        $log = CommunicationLog::whatsapp()
            ->where('provider_message_id', $requestId)
            ->first();

        if (!$log) {
            Log::warning('[WhatsApp Webhook] Log not found', [
                'request_id' => $requestId,
            ]);
            return response()->json(['error' => 'Not found'], 404);
        }

        $mappedStatus = $this->mapMsg91WhatsappStatus($status);

        match ($mappedStatus) {
            'delivered' => $log->markDelivered(),
            'read' => $log->markRead(),
            'failed' => $log->markFailed($description ?: 'Delivery failed'),
            default => Log::info('[WhatsApp Webhook] Unhandled status', [
                'request_id' => $requestId,
                'status' => $status,
            ]),
        };

        Log::info('[WhatsApp Webhook] Processed', [
            'log_id' => $log->id,
            'status' => $mappedStatus,
        ]);

        return response()->json(['message' => 'OK']);
    }

    // ── Status Mappers ───────────────────────────────────────────

    /**
     * Map Msg91 SMS status codes.
     * 1=Delivered, 2=Failed, 9=NDNC, 17=Blocked, 25/26=In transit
     */
    protected function mapMsg91SmsStatus(mixed $status): string
    {
        return match ((string) $status) {
            '1' => 'delivered',
            '2', '9', '17' => 'failed',
            '25', '26' => 'sent',
            default => 'unknown',
        };
    }

    /**
     * Map Msg91 WhatsApp status strings.
     * Msg91 WhatsApp uses string statuses: sent, delivered, read, failed
     */
    protected function mapMsg91WhatsappStatus(mixed $status): string
    {
        return match (strtolower((string) $status)) {
            'sent' => 'sent',
            'delivered' => 'delivered',
            'read' => 'read',
            'failed', 'rejected', 'undelivered' => 'failed',
            default => 'unknown',
        };
    }
}
