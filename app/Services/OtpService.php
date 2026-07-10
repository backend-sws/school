<?php

namespace App\Services;

use App\Services\NotificationTemplateRenderer;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * OTP Service — unified through SmsService.
 *
 * Sends OTP via SmsService so every OTP appears in sms_logs
 * for the communications dashboard. Falls back to 2Factor API
 * if SmsService is unavailable.
 */
class OtpService
{
    public function __construct(
        protected SmsService $smsService
    ) {}

    /**
     * Send OTP using SmsService (logged + tracked) with 2Factor API fallback.
     */
    public function sendOtp(string $mobile, string $otp, ?int $institutionId = null): bool
    {
        $institutionId = $institutionId ?? config('ems.default_institution_id');
        if ($institutionId !== null) {
            $institutionId = (int) $institutionId;
        }

        // Try unified SMS factory first
        try {
            $result = NotificationTemplateRenderer::render('AUTH_OTP_VERIFICATION', 'sms', [
                'otp' => $otp,
                '#var#' => $otp, // User's template literally has {#var#} in DB
            ]);

            // Guard: skip if OTP template isn't configured in DB
            if (empty($result['message']) || empty($result['provider_template_id'])) {
                Log::warning('[OTP] OTP SMS template not found in DB, falling back to 2Factor');
                return $this->sendVia2Factor($mobile, $otp);
            }

            $this->smsService->send(
                $institutionId,
                null, // system-sent (no user)
                $mobile,
                $result['message'],
                null,  // recipientName
                null,  // recipientUserId
                'otp', // category
                $result['provider_template_id'] // DLT template ID
            );

            return true;
        } catch (\Throwable $e) {
            Log::warning('[OTP] SmsService failed, falling back to 2Factor', [
                'mobile' => $mobile,
                'error' => $e->getMessage(),
            ]);
        }

        // Fallback: direct 2Factor API
        return $this->sendVia2Factor($mobile, $otp);
    }

    /**
     * Legacy 2Factor API call (fallback).
     */
    protected function sendVia2Factor(string $mobile, string $otp): bool
    {
        $apiKey = config('services.2factor.api_key');

        if (!$apiKey) {
            Log::error('[OTP] No 2Factor API key configured');
            return false;
        }

        $url = "https://2factor.in/API/V1/{$apiKey}/SMS/{$mobile}/{$otp}/OTP";

        try {
            $response = Http::get($url);
            return $response->successful();
        } catch (\Throwable $e) {
            Log::error('[OTP] 2Factor API failed', ['error' => $e->getMessage()]);
            return false;
        }
    }
}
