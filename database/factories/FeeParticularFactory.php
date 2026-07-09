<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FeeParticular>
 */
class FeeParticularFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->randomElement(['Tution Fee', 'Registration Fee', 'Library Fee', 'Development Fee', 'Examination Fee']),
            'type' => $this->faker->randomElement(['college', 'university']),
            'institution_id' => config('ems.default_institution_id'),
        ];
    }
}
