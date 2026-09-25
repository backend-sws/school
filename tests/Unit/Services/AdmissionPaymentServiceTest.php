<?php

namespace Tests\Unit\Services;

use App\Models\AdmissionApplication;
use App\Services\AdmissionPaymentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use RuntimeException;
use Tests\TestCase;

class AdmissionPaymentServiceTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_allows_overpayment_when_cumulative_paid_exceeds_net_payable(): void
    {
        $application = AdmissionApplication::factory()->create([
            'amount' => 1000,
            'discount_amount' => 0,
            'cash_amount' => 900,
            'online_amount' => 0,
        ]);

        $service = app(AdmissionPaymentService::class);

        $result = $service->recordPayment($application, [
            'cash_amount' => 200,
            'online_amount' => 0,
        ], 1);

        $this->assertEquals(0, $result['due_amount']);
        $this->assertEquals(1100, $result['cumulative_paid']);
    }
}
