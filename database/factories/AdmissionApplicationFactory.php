<?php

namespace Database\Factories;

use App\Models\AdmissionHead;
use App\Models\Session;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AdmissionApplication>
 */
class AdmissionApplicationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'application_id' => 'APP' . date('Y') . $this->faker->unique()->numberBetween(100000, 999999),
            'application_type' => 'new',
            'user_id' => User::factory(),
            'institution_id' => config('ems.default_institution_id'),
            'admission_head_id' => AdmissionHead::factory(),
            'session_id' => Session::factory(),
            'session_name' => '2025-2026',
            'semester' => 1,
            'applicant_name' => $this->faker->name(),
            'father_name' => $this->faker->name('male'),
            'mother_name' => $this->faker->name('female'),
            'dob' => $this->faker->date('Y-m-d', '-18 years'),
            'gender' => $this->faker->randomElement(['Male', 'Female']),
            'category' => 'General',
            'mobile' => $this->faker->numerify('##########'),
            'email' => $this->faker->safeEmail(),
            'payment_status' => 'pending',
            'process_status' => 'pending',
            'submitted_at' => now(),
        ];
    }
}
