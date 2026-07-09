<?php

namespace Database\Factories;

use App\Models\MainStream;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Stream>
 */
class StreamFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'main_stream_id' => MainStream::factory(),
            'name' => $this->faker->words(3, true),
            'code' => strtoupper($this->faker->unique()->lexify('????')),
            'duration_years' => 3,
            'status' => 1,
            'institution_id' => config('ems.default_institution_id'),
        ];
    }
}
