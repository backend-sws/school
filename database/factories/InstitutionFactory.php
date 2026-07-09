<?php

namespace Database\Factories;

use App\Enums\InstitutionType;
use App\Models\Institution;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Institution>
 */
class InstitutionFactory extends Factory
{
    protected $model = Institution::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => InstitutionType::SCHOOL,
            'name' => 'Default Testing Institution',
            'code' => 'TEST',
            'address' => '123 Testing St',
            'city' => 'Test City',
            'state' => 'Test State',
            'pincode' => '123456',
            'phone' => '1234567890',
            'email' => 'test@institution.com',
            'website' => 'https://test-institution.com',
            'logo_url' => 'https://test-institution.com/logo.png',
            'status' => 1,
        ];
    }
}
