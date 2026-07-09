<?php

namespace Tests\Unit\Fees;

use App\Models\FeePayment;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class FeePaymentStatusNormalizationTest extends TestCase
{
    #[Test]
    public function paid_and_success_statuses_are_both_treated_as_paid(): void
    {
        $paid = new FeePayment(['payment_status' => 'paid']);
        $success = new FeePayment(['payment_status' => 'success']);
        $pending = new FeePayment(['payment_status' => 'pending']);

        $this->assertTrue($paid->isPaid());
        $this->assertTrue($success->isPaid());
        $this->assertFalse($pending->isPaid());
    }
}
