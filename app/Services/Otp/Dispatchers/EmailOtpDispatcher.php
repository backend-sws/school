<?php

namespace App\Services\Otp\Dispatchers;

use App\Services\Otp\Contracts\OtpDispatcherInterface;
use App\Mail\OtpMail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class EmailOtpDispatcher implements OtpDispatcherInterface
{
    public function send(?string $mobile, ?string $email, string $otp): bool
    {
        if (empty($email)) {
            return false;
        }

        try {
            Mail::to($email)->send(new OtpMail($otp, $email));
            return true;
        } catch (\Exception $e) {
            Log::error("Failed to send OTP Email to {$email}: " . $e->getMessage());
            return false;
        }
    }
}
