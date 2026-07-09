<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SubjectCategory>
 */
class SubjectCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->randomElement(['Major (MJC)', 'Minor (MIC)', 'Multidisciplinary (MDC)', 'AEC', 'SEC', 'VAC']),
            'code' => strtoupper($this->faker->unique()->lexify('???')),
            'institution_id' => config('ems.default_institution_id'),
        ];
    }
}
