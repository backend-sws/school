<?php

namespace App\Services;

use App\Services\OtpService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class AuthService
{
    public function sendOtp($mobile, $email)
    {
        $otp = rand(100000, 999999);
        // 10 min expiry
        if ($mobile) {
            Cache::put('otp_' . $mobile, $otp, now()->addMinutes(10));
        }
        if ($email) {
            Cache::put('otp_' . $email, $otp, now()->addMinutes(10));
        }

        $channels = config('notifications.channels.AUTH_OTP_VERIFICATION', ['sms', 'mail']);

        foreach ($channels as $channel) {
            // Only mail and sms are supported currently by OtpDispatcherFactory, but matrix can request more
            if (!in_array($channel, ['sms', 'email', 'mail'])) {
                continue;
            }
            try {
                $dispatcher = \App\Services\Otp\OtpDispatcherFactory::make($channel);
                $dispatcher->send($mobile, $email, $otp);
            } catch (\Exception $e) {
                Log::error("Failed to dispatch OTP via {$channel}: " . $e->getMessage());
            }
        }

        Log::info("OTP generated for Mobile: {$mobile}, Email: {$email}: {$otp}");

        return $otp;
    }

    public function verify($mobile, $otp)
    {
        return $this->verifyOtp($mobile, $otp);
    }
    
    public function verifyOtp($identifier, $otp)
    {
        return Cache::get('otp_' . $identifier) == $otp;
    }
    
    public function clearOtp($identifier)
    {
        Cache::forget('otp_' . $identifier);
    }
}