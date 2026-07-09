<?php

namespace App\Services\Otp\Dispatchers;

use App\Services\Otp\Contracts\OtpDispatcherInterface;
use App\Services\OtpService;
use Illuminate\Support\Facades\Log;

class SmsOtpDispatcher implements OtpDispatcherInterface
{
    public function send(?string $mobile, ?string $email, string $otp): bool
    {
        if (empty($mobile)) {
            return false;
        }

        try {
            $otpService = app(OtpService::class);
            return $otpService->sendOtp($mobile, $otp);
        } catch (\Exception $e) {
            Log::error("Failed to send OTP SMS to {$mobile}: " . $e->getMessage());
            return false;
        }
    }
}
