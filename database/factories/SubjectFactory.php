<?php

namespace Database\Factories;

use App\Models\Stream;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Subject>
 */
class SubjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'stream_id' => Stream::factory(),
            'name' => $this->faker->words(3, true) . ' (MJC)',
            'code' => strtoupper($this->faker->unique()->lexify('???-###')),
            'status' => 1,
            'is_practical' => $this->faker->boolean(),
            'institution_id' => config('ems.default_institution_id'),
        ];
    }
}
