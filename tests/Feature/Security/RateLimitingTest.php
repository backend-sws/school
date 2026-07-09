<?php

namespace Tests\Feature\Security;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class RateLimitingTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function login_endpoint_is_rate_limited()
    {
        $user = User::factory()->create(['password' => bcrypt('password')]);
        $url = '/api/v1/auth/login';

        // 5 attempts allowed per minute
        for ($i = 0; $i < 5; $i++) {
            $response = $this->postJson($url, [
                'email' => $user->email,
                'password' => 'wrong-password',
            ]);
            $response->assertStatus(422); // Fortify/Custom Auth returns 422
        }

        // 6th attempt should be rate limited
        $response = $this->postJson($url, [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);
        $response->assertStatus(429);
    }

    #[Test]
    public function register_endpoint_is_rate_limited()
    {
        $url = '/api/v1/auth/register';

        // 3 attempts allowed per minute
        for ($i = 0; $i < 3; $i++) {
            $response = $this->postJson($url, [
                'name' => 'Test User',
                'email' => 'invalid-email',
                'password' => 'pass',
            ]);
            $this->assertTrue(in_array($response->status(), [422, 201, 429]));
        }

        // 4th attempt should be rate limited
        $response = $this->postJson($url, [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);
        $response->assertStatus(429);
    }

    #[Test]
    public function student_send_otp_is_rate_limited()
    {
        $url = '/api/v1/student-auth/send-otp';

        // 3 attempts allowed per minute
        for ($i = 0; $i < 3; $i++) {
            $response = $this->postJson($url, [
                'mobile' => '1234567890'
            ]);
            // Even if it fails validation or mobile not found, it should count towards limit
            $this->assertTrue(in_array($response->status(), [200, 422, 404, 429]));
        }

        $response = $this->postJson($url, [
            'mobile' => '1234567890'
        ]);
        $response->assertStatus(429);
    }
}
