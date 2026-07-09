<?php

namespace App\Services\FinancialDocuments;

final class Money
{
    public static function inr(float $amount): string
    {
        return '₹'.number_format($amount, 2);
    }
}
