<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Session>
 */
class SessionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startYear = $this->faker->unique()->numberBetween(2000, 2099);
        return [
            'name' => "$startYear-" . ($startYear + 1),
            'start_year' => $startYear,
            'end_year' => $startYear + 1,
            'is_current' => false,
            'status' => 1,
            'duration_months' => 12,
            'institution_id' => config('ems.default_institution_id'),
        ];
    }
}
