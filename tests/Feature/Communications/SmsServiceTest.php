<?php

namespace Tests\Feature\Communications;

use App\Exceptions\SmsQuotaExceededException;
use App\Jobs\SendSmsJob;
use App\Models\Institution;
use App\Models\SmsLog;
use App\Models\User;
use App\Services\SmsService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class SmsServiceTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Institution $institution;

    protected function setUp(): void
    {
        parent::setUp();

        $this->institution = Institution::factory()->create([
            'sms_monthly_quota' => 100,
            'sms_daily_limit' => 10,
        ]);

        $this->user = User::factory()->create([
            'institution_id' => $this->institution->id,
        ]);

        config(['ems.default_institution_id' => $this->institution->id]);
    }

    // ── Job Dispatch ─────────────────────────────────────────────

    public function test_send_dispatches_job_to_sms_queue(): void
    {
        Queue::fake();

        $service = app(SmsService::class);
        $log = $service->send(
            $this->institution->id,
            $this->user->id,
            '9876543210',
            'Test message'
        );

        Queue::assertPushed(SendSmsJob::class, function ($job) {
            return $job->queue === 'sms';
        });

        $this->assertEquals('queued', $log->status);
        $this->assertStringContainsString($this->institution->name, $log->message);
        $this->assertDatabaseHas('sms_logs', [
            'id' => $log->id,
            'status' => 'queued',
            'recipient_phone' => '9876543210',
        ]);
    }

    public function test_send_bulk_creates_multiple_logs(): void
    {
        Queue::fake();

        $service = app(SmsService::class);
        $logs = $service->sendBulk(
            $this->institution->id,
            $this->user->id,
            [
                ['phone' => '9876543210', 'name' => 'Student A'],
                ['phone' => '9876543211', 'name' => 'Student B'],
            ],
            'Bulk test message'
        );

        $this->assertCount(2, $logs);
        Queue::assertPushed(SendSmsJob::class, 2);
    }

    // ── Quota Enforcement ────────────────────────────────────────

    public function test_monthly_quota_exceeded_throws(): void
    {
        Queue::fake();

        // Pre-fill with 100 logs this month (= quota)
        SmsLog::factory()->count(100)->create([
            'institution_id' => $this->institution->id,
            'sent_by' => $this->user->id,
            'created_at' => now(),
        ]);

        $service = app(SmsService::class);

        $this->expectException(SmsQuotaExceededException::class);
        $service->send(
            $this->institution->id,
            $this->user->id,
            '9876543210',
            'Over quota'
        );
    }

    public function test_daily_limit_exceeded_throws(): void
    {
        Queue::fake();

        // Pre-fill with 10 logs today (= daily limit)
        SmsLog::factory()->count(10)->create([
            'institution_id' => $this->institution->id,
            'sent_by' => $this->user->id,
            'created_at' => now(),
        ]);

        $service = app(SmsService::class);

        $this->expectException(SmsQuotaExceededException::class);
        $service->send(
            $this->institution->id,
            $this->user->id,
            '9876543210',
            'Over daily limit'
        );
    }

    // ── SmsLog Model ─────────────────────────────────────────────

    public function test_mark_delivered_updates_status(): void
    {
        $log = SmsLog::factory()->create([
            'institution_id' => $this->institution->id,
            'sent_by' => $this->user->id,
            'status' => 'sent',
        ]);

        $log->markDelivered();

        $this->assertEquals('delivered', $log->fresh()->status);
        $this->assertNotNull($log->fresh()->delivered_at);
    }

    public function test_increment_retry_updates_count(): void
    {
        $log = SmsLog::factory()->create([
            'institution_id' => $this->institution->id,
            'sent_by' => $this->user->id,
            'retry_count' => 0,
        ]);

        $log->incrementRetry();

        $this->assertEquals(1, $log->fresh()->retry_count);
    }

    // ── Webhook Endpoint ─────────────────────────────────────────

    public function test_msg91_webhook_marks_delivered(): void
    {
        $log = SmsLog::factory()->create([
            'institution_id' => $this->institution->id,
            'sent_by' => $this->user->id,
            'status' => 'sent',
            'provider_message_id' => 'msg91-test-123',
        ]);

        $response = $this->postJson('/api/v1/webhooks/sms/msg91', [
            'request_id' => 'msg91-test-123',
            'status' => '1', // delivered
        ]);

        $response->assertOk();
        $this->assertEquals('delivered', $log->fresh()->status);
    }

    public function test_msg91_webhook_marks_failed(): void
    {
        $log = SmsLog::factory()->create([
            'institution_id' => $this->institution->id,
            'sent_by' => $this->user->id,
            'status' => 'sent',
            'provider_message_id' => 'msg91-test-456',
        ]);

        $response = $this->postJson('/api/v1/webhooks/sms/msg91', [
            'request_id' => 'msg91-test-456',
            'status' => '2', // failed
            'desc' => 'Number unreachable',
        ]);

        $response->assertOk();
        $this->assertEquals('failed', $log->fresh()->status);
        $this->assertStringContainsString('unreachable', $log->fresh()->error_message);
    }

    public function test_msg91_webhook_rejects_invalid_secret(): void
    {
        config(['services.sms.webhook_secret' => 'my-secret']);

        $response = $this->postJson('/api/v1/webhooks/sms/msg91', [
            'request_id' => 'msg91-test-789',
            'status' => '1',
        ], [
            'X-Webhook-Secret' => 'wrong-secret',
        ]);

        $response->assertStatus(401);
    }

    // ── API: Send SMS with Quota ─────────────────────────────────

    public function test_send_sms_api_returns_429_when_quota_exceeded(): void
    {
        Queue::fake();

        // Fill up quota
        SmsLog::factory()->count(100)->create([
            'institution_id' => $this->institution->id,
            'sent_by' => $this->user->id,
            'created_at' => now(),
        ]);

        $response = $this->actingAs($this->user)->postJson('/api/v1/communications/sms/send', [
            'recipients' => [['phone' => '9876543210']],
            'message' => 'Quota test',
        ]);

        $response->assertStatus(429);
    }

    // ── Stats include Quota ─────────────────────────────────────

    public function test_sms_stats_includes_quota_info(): void
    {
        $response = $this->actingAs($this->user)->getJson('/api/v1/communications/sms/stats');

        $response->assertOk();
        $response->assertJsonStructure([
            'data' => [
                'total', 'sent', 'delivered', 'failed',
                'quota' => [
                    'monthly_limit', 'monthly_used', 'monthly_remaining',
                    'daily_limit', 'daily_used', 'daily_remaining',
                ],
            ],
        ]);
    }
}
