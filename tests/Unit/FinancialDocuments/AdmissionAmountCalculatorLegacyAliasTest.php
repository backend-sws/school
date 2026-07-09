<?php

namespace Tests\Unit\FinancialDocuments;

use App\Models\AdmissionApplication;
use App\Models\FeeType;
use App\Services\FinancialDocuments\AdmissionAmountCalculator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AdmissionAmountCalculatorLegacyAliasTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_resolves_fee_labels_from_legacy_fee_particular_id_rows(): void
    {
        $institutionId = (int) config('ems.default_institution_id');

        $registration = FeeType::create([
            'institution_id' => $institutionId,
            'name' => 'Registration Fee',
            'category' => 'admission',
        ]);
        $uniform = FeeType::create([
            'institution_id' => $institutionId,
            'name' => 'Uniform Fee',
            'category' => 'admission',
        ]);

        $application = new AdmissionApplication([
            'application_type' => 'new',
            'amount' => 3250,
            'fee_breakdown' => [
                ['fee_particular_id' => $registration->id, 'amount' => 1000],
                ['fee_particular_id' => $uniform->id, 'amount' => 2250],
            ],
        ]);

        $rows = AdmissionAmountCalculator::fromApplication($application)->invoiceComponentRows($application);

        $this->assertSame('Registration Fee', $rows[0]['label']);
        $this->assertSame(1000.0, $rows[0]['amount']);
        $this->assertSame('Uniform Fee', $rows[1]['label']);
        $this->assertSame(2250.0, $rows[1]['amount']);
    }
}
