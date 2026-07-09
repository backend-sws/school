<?php

namespace Tests\Feature\Admission;

use App\Models\AdmissionApplication;
use App\Models\AdmissionHead;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AdmissionOverpaymentGuardTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutMiddleware();
    }

    #[Test]
    public function admission_store_blocks_overpayment_with_422_error_map(): void
    {
        $user = User::factory()->create();
        $head = AdmissionHead::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/v1/applications', [
            'admission_head_id' => $head->id,
            'applicant_name' => 'Overpay Applicant',
            'transport_amount' => 100,
            'cash_amount' => 120,
            'online_amount' => 0,
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonPath('error_code', 'admission.overpayment_not_allowed');
    }

    #[Test]
    public function record_payment_blocks_overpayment_with_422_error_map(): void
    {
        $user = User::factory()->create();
        $application = AdmissionApplication::factory()->create([
            'user_id' => $user->id,
            'amount' => 1000,
            'discount_amount' => 0,
            'cash_amount' => 900,
            'online_amount' => 0,
            'due_amount' => 100,
        ]);

        $response = $this->actingAs($user)->postJson(
            "/api/v1/applications/{$application->id}/record-payment",
            [
                'cash_amount' => 200,
                'online_amount' => 0,
            ]
        );

        $response
            ->assertStatus(422)
            ->assertJsonPath('error_code', 'admission.overpayment_not_allowed');
    }
}
