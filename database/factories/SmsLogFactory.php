<?php

namespace Database\Factories;

use App\Models\Institution;
use App\Models\SmsLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SmsLogFactory extends Factory
{
    protected $model = SmsLog::class;

    public function definition(): array
    {
        return [
            'institution_id' => Institution::factory(),
            'sent_by' => User::factory(),
            'recipient_phone' => $this->faker->numerify('98########'),
            'recipient_name' => $this->faker->name(),
            'recipient_user_id' => null,
            'template_id' => null,
            'message' => $this->faker->sentence(),
            'status' => 'queued',
            'provider' => 'msg91',
            'provider_message_id' => null,
            'error_message' => null,
            'retry_count' => 0,
            'category' => $this->faker->randomElement(['fee_reminder', 'attendance', 'exam', 'general']),
            'cost' => 0,
            'sent_at' => null,
            'delivered_at' => null,
        ];
    }

    public function sent(): static
    {
        return $this->state(fn () => [
            'status' => 'sent',
            'provider_message_id' => 'msg91-' . uniqid(),
            'sent_at' => now(),
        ]);
    }

    public function delivered(): static
    {
        return $this->state(fn () => [
            'status' => 'delivered',
            'provider_message_id' => 'msg91-' . uniqid(),
            'sent_at' => now()->subMinutes(2),
            'delivered_at' => now(),
        ]);
    }

    public function failed(): static
    {
        return $this->state(fn () => [
            'status' => 'failed',
            'error_message' => 'Provider error: number unreachable',
        ]);
    }
}
