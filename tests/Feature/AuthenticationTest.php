<?php

namespace Tests\Feature;

use App\Models\AdmissionVerificationData;
use App\Models\College;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create([
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
            'status' => 1
        ]);
    }

    #[Test]
    public function admin_can_login()
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'admin@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['data' => ['user' => ['id', 'name', 'email']]]);
    }

    #[Test]
    public function student_can_find_application_for_registration()
    {
        $verificationData = AdmissionVerificationData::factory()->create([
            'admission_id' => 'APP123456'
        ]);

        $response = $this->postJson('/api/v1/student-auth/find-application', [
            'app_no' => 'APP123456',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', $verificationData->student_name);
    }

    #[Test]
    public function student_can_send_otp()
    {
        //send-otp just needs mobile and email in request and calls service
        $response = $this->postJson('/api/v1/student-auth/send-otp', [
            'mobile' => '9876543210',
            'email' => 'student@example.com'
        ]);

        $response->assertStatus(200);
    }
}
