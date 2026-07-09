<?php

namespace Database\Factories;

use App\Models\MainStream;
use App\Models\Session;
use App\Models\Stream;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AdmissionHead>
 */
class AdmissionHeadFactory extends Factory
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
            'title' => $this->faker->sentence(3) . ' Admission',
            'course_for' => 'new',
            'main_stream_id' => MainStream::factory(),
            'stream_id' => Stream::factory(),
            'session_id' => Session::factory(),
            'board_criteria' => ['BSEB', 'CBSE', 'ICSE'],
            'gender_criteria' => ['Male', 'Female', 'Other'],
            'category_criteria' => ['General', 'OBC', 'SC', 'ST'],
            'last_date' => $this->faker->dateTimeBetween('+1 month', '+2 months'),
            'payment_gateway' => 'razorpay',
            'created_by' => User::factory(),
            'status' => 0, // Draft
            'is_enabled' => true,
            'allow_subject_paper_selection' => true,
            'has_application_fees' => true,
            'application_fees' => $this->faker->randomFloat(2, 100, 1000),
            'total_admission_fees' => $this->faker->randomFloat(2, 1000, 5000),
            'major_subject_id' => Subject::factory(),
            'semester' => 1,
        ];
    }

    public function published()
    {
        return $this->state(fn(array $attributes) => [
            'status' => 1, // Published
        ]);
    }
}
