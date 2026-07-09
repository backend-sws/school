<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AdmissionVerificationData>
 */
class AdmissionVerificationDataFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'institution_id' => config('ems.default_institution_id'),
            'admission_id' => 'APP' . $this->faker->unique()->numberBetween(100000, 999999),
            'student_name' => $this->faker->name,
            'category' => 'General',
            'gender' => $this->faker->randomElement(['Male', 'Female']),
            'dob' => $this->faker->date(),
            'fathers_name' => $this->faker->name('male'),
            'mobile_number' => $this->faker->numerify('##########'),
            'email' => $this->faker->unique()->safeEmail,
        ];
    }
}
