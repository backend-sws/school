<?php

namespace Tests\Unit\Fees;

use App\Services\FeeCollectionService;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class FeeCollectionServicePeriodRangeTest extends TestCase
{
    #[Test]
    public function it_generates_monthly_period_keys_inclusive_range(): void
    {
        $service = app(FeeCollectionService::class);

        $keys = $service->getPeriodKeysInRangeForFrequency('2026-01', '2026-04', 'monthly');

        $this->assertSame(['2026-01', '2026-02', '2026-03', '2026-04'], $keys);
    }

    #[Test]
    public function it_generates_quarterly_period_keys_inclusive_range(): void
    {
        $service = app(FeeCollectionService::class);

        $keys = $service->getPeriodKeysInRangeForFrequency('2026-01', '2026-10', 'quarterly');

        $this->assertSame(['2026-01', '2026-04', '2026-07', '2026-10'], $keys);
    }
}
