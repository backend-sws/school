<?php

namespace App\Services\Otp;

use App\Services\Otp\Contracts\OtpDispatcherInterface;
use App\Services\Otp\Dispatchers\EmailOtpDispatcher;
use App\Services\Otp\Dispatchers\SmsOtpDispatcher;

class OtpDispatcherFactory
{
    /**
     * Create an instance of the specific OTP dispatcher.
     *
     * @param string $channel ('sms', 'email', etc.)
     * @return OtpDispatcherInterface
     * @throws \InvalidArgumentException
     */
    public static function make(string $channel): OtpDispatcherInterface
    {
        return match (strtolower($channel)) {
            'sms' => new SmsOtpDispatcher(),
            'email', 'mail' => new EmailOtpDispatcher(),
            default => throw new \InvalidArgumentException("Invalid OTP channel dispatch: {$channel}"),
        };
    }
}
