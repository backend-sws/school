<?php

namespace Database\Factories;

use App\Models\Session;
use App\Models\Stream;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StudentProfile>
 */
class StudentProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'institution_id' => config('ems.default_institution_id'),
            'stream_id' => Stream::factory(),
            'session_id' => Session::factory(),
            'reg_no' => $this->faker->unique()->numerify('REG-##########'),
            'roll_no' => $this->faker->unique()->numerify('ROLL-####'),
            'father_name' => $this->faker->name('male'),
            'mother_name' => $this->faker->name('female'),
            'dob' => $this->faker->date('Y-m-d', '-18 years'),
            'gender' => $this->faker->randomElement(['Male', 'Female']),
            'category' => 'General',
            'verified' => false,
        ];
    }
}
