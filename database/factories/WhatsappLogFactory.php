<?php

namespace Database\Factories;

use App\Models\Institution;
use App\Models\User;
use App\Models\WhatsappLog;
use Illuminate\Database\Eloquent\Factories\Factory;

class WhatsappLogFactory extends Factory
{
    protected $model = WhatsappLog::class;

    public function definition(): array
    {
        return [
            'institution_id' => Institution::factory(),
            'sent_by' => User::factory(),
            'recipient_phone' => $this->faker->numerify('91##########'),
            'recipient_name' => $this->faker->name(),
            'recipient_user_id' => null,
            'template_name' => 'fee_reminder_v1',
            'message' => $this->faker->sentence(),
            'media_url' => null,
            'media_type' => null,
            'status' => 'queued',
            'provider' => 'msg91',
            'provider_message_id' => null,
            'error_message' => null,
            'retry_count' => 0,
            'category' => $this->faker->randomElement(['fee_reminder', 'attendance', 'exam', 'general']),
            'cost' => 0,
            'sent_at' => null,
            'delivered_at' => null,
            'read_at' => null,
        ];
    }

    public function sent(): static
    {
        return $this->state(fn () => [
            'status' => 'sent',
            'provider_message_id' => 'wa-msg91-' . uniqid(),
            'sent_at' => now(),
        ]);
    }

    public function delivered(): static
    {
        return $this->state(fn () => [
            'status' => 'delivered',
            'provider_message_id' => 'wa-msg91-' . uniqid(),
            'sent_at' => now()->subMinutes(2),
            'delivered_at' => now(),
        ]);
    }

    public function read(): static
    {
        return $this->state(fn () => [
            'status' => 'read',
            'provider_message_id' => 'wa-msg91-' . uniqid(),
            'sent_at' => now()->subMinutes(5),
            'delivered_at' => now()->subMinutes(3),
            'read_at' => now(),
        ]);
    }

    public function failed(): static
    {
        return $this->state(fn () => [
            'status' => 'failed',
            'error_message' => 'WhatsApp: number not registered',
        ]);
    }

    public function withMedia(string $type = 'image'): static
    {
        return $this->state(fn () => [
            'media_url' => 'https://example.com/media/sample.' . ($type === 'image' ? 'jpg' : 'pdf'),
            'media_type' => $type,
        ]);
    }
}
