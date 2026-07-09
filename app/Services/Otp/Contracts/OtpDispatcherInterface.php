<?php

namespace App\Services\Otp\Contracts;

interface OtpDispatcherInterface
{
    /**
     * Send OTP to the destination using the implemented channel.
     *
     * @param string|null $mobile
     * @param string|null $email
     * @param string $otp
     * @return bool
     */
    public function send(?string $mobile, ?string $email, string $otp): bool;
}
