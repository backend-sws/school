<?php

namespace Tests\Unit\Fees;

use App\Services\FeeCalculationEngine;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class FeeCalculationEngineLateFeeTest extends TestCase
{
    #[Test]
    public function it_calculates_percent_late_fee_from_base_amount(): void
    {
        $engine = app(FeeCalculationEngine::class);

        $fee = $engine->calculateLateFee([
            'late_fee_enabled' => true,
            'late_fee_type' => 'percent',
            'late_fee_value' => 10,
        ], 1234.56);

        $this->assertSame(123.46, $fee);
    }

    #[Test]
    public function it_returns_zero_when_late_fee_is_disabled(): void
    {
        $engine = app(FeeCalculationEngine::class);

        $fee = $engine->calculateLateFee([
            'late_fee_enabled' => false,
            'late_fee_type' => 'fixed',
            'late_fee_value' => 100,
        ], 5000);

        $this->assertSame(0.0, $fee);
    }
}
