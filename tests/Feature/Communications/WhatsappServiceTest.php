<?php

namespace Tests\Feature\Communications;

use App\Exceptions\SmsQuotaExceededException;
use App\Jobs\SendWhatsappJob;
use App\Models\Institution;
use App\Models\WhatsappLog;
use App\Models\User;
use App\Services\WhatsappService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class WhatsappServiceTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Institution $institution;

    protected function setUp(): void
    {
        parent::setUp();

        $this->institution = Institution::factory()->create([
            'whatsapp_monthly_quota' => 50,
            'whatsapp_daily_limit' => 5,
        ]);

        $this->user = User::factory()->create([
            'institution_id' => $this->institution->id,
        ]);

        config(['ems.default_institution_id' => $this->institution->id]);
    }

    // ── Job Dispatch ─────────────────────────────────────────────

    public function test_send_dispatches_job_to_whatsapp_queue(): void
    {
        Queue::fake();

        $service = app(WhatsappService::class);
        $log = $service->send(
            $this->institution->id,
            $this->user->id,
            '919876543210',
            'Fee reminder for March',
            'fee_reminder_v1'
        );

        Queue::assertPushed(SendWhatsappJob::class, function ($job) {
            return $job->queue === 'whatsapp';
        });

        $this->assertEquals('queued', $log->status);
        $this->assertDatabaseHas('whatsapp_logs', [
            'id' => $log->id,
            'status' => 'queued',
            'template_name' => 'fee_reminder_v1',
        ]);
    }

    public function test_send_bulk_creates_multiple_logs(): void
    {
        Queue::fake();

        $service = app(WhatsappService::class);
        $logs = $service->sendBulk(
            $this->institution->id,
            $this->user->id,
            [
                ['phone' => '919876543210', 'name' => 'Student A'],
                ['phone' => '919876543211', 'name' => 'Student B'],
            ],
            'Bulk test message',
            'general_notification_v1'
        );

        $this->assertCount(2, $logs);
        Queue::assertPushed(SendWhatsappJob::class, 2);
    }

    public function test_send_with_media_stores_media_fields(): void
    {
        Queue::fake();

        $service = app(WhatsappService::class);
        $log = $service->send(
            $this->institution->id,
            $this->user->id,
            '919876543210',
            'Your fee receipt',
            'fee_receipt_v1',
            'Student A',
            null,
            'fee_reminder',
            'https://example.com/receipt.pdf',
            'document'
        );

        $this->assertEquals('https://example.com/receipt.pdf', $log->media_url);
        $this->assertEquals('document', $log->media_type);
    }

    // ── Quota Enforcement ────────────────────────────────────────

    public function test_monthly_quota_exceeded_throws(): void
    {
        Queue::fake();

        WhatsappLog::factory()->count(50)->create([
            'institution_id' => $this->institution->id,
            'sent_by' => $this->user->id,
            'created_at' => now(),
        ]);

        $service = app(WhatsappService::class);

        $this->expectException(SmsQuotaExceededException::class);
        $service->send(
            $this->institution->id,
            $this->user->id,
            '919876543210',
            'Over quota',
            'test_template'
        );
    }

    public function test_daily_limit_exceeded_throws(): void
    {
        Queue::fake();

        WhatsappLog::factory()->count(5)->create([
            'institution_id' => $this->institution->id,
            'sent_by' => $this->user->id,
            'created_at' => now(),
        ]);

        $service = app(WhatsappService::class);

        $this->expectException(SmsQuotaExceededException::class);
        $service->send(
            $this->institution->id,
            $this->user->id,
            '919876543210',
            'Over daily limit',
            'test_template'
        );
    }

    // ── WhatsappLog Model ────────────────────────────────────────

    public function test_mark_delivered_updates_status(): void
    {
        $log = WhatsappLog::factory()->create([
            'institution_id' => $this->institution->id,
            'sent_by' => $this->user->id,
            'status' => 'sent',
        ]);

        $log->markDelivered();

        $this->assertEquals('delivered', $log->fresh()->status);
        $this->assertNotNull($log->fresh()->delivered_at);
    }

    public function test_mark_read_updates_status_and_timestamp(): void
    {
        $log = WhatsappLog::factory()->create([
            'institution_id' => $this->institution->id,
            'sent_by' => $this->user->id,
            'status' => 'delivered',
        ]);

        $log->markRead();

        $this->assertEquals('read', $log->fresh()->status);
        $this->assertNotNull($log->fresh()->read_at);
    }

    public function test_increment_retry_updates_count(): void
    {
        $log = WhatsappLog::factory()->create([
            'institution_id' => $this->institution->id,
            'sent_by' => $this->user->id,
            'retry_count' => 0,
        ]);

        $log->incrementRetry();

        $this->assertEquals(1, $log->fresh()->retry_count);
    }

    // ── Webhook Endpoint ─────────────────────────────────────────

    public function test_msg91_whatsapp_webhook_marks_delivered(): void
    {
        $log = WhatsappLog::factory()->create([
            'institution_id' => $this->institution->id,
            'sent_by' => $this->user->id,
            'status' => 'sent',
            'provider_message_id' => 'wa-test-123',
        ]);

        $response = $this->postJson('/api/v1/webhooks/sms/msg91-whatsapp', [
            'request_id' => 'wa-test-123',
            'status' => 'delivered',
        ]);

        $response->assertOk();
        $this->assertEquals('delivered', $log->fresh()->status);
    }

    public function test_msg91_whatsapp_webhook_marks_read(): void
    {
        $log = WhatsappLog::factory()->create([
            'institution_id' => $this->institution->id,
            'sent_by' => $this->user->id,
            'status' => 'delivered',
            'provider_message_id' => 'wa-test-456',
        ]);

        $response = $this->postJson('/api/v1/webhooks/sms/msg91-whatsapp', [
            'request_id' => 'wa-test-456',
            'status' => 'read',
        ]);

        $response->assertOk();
        $this->assertEquals('read', $log->fresh()->status);
        $this->assertNotNull($log->fresh()->read_at);
    }

    public function test_msg91_whatsapp_webhook_marks_failed(): void
    {
        $log = WhatsappLog::factory()->create([
            'institution_id' => $this->institution->id,
            'sent_by' => $this->user->id,
            'status' => 'sent',
            'provider_message_id' => 'wa-test-789',
        ]);

        $response = $this->postJson('/api/v1/webhooks/sms/msg91-whatsapp', [
            'request_id' => 'wa-test-789',
            'status' => 'failed',
            'desc' => 'Number not on WhatsApp',
        ]);

        $response->assertOk();
        $this->assertEquals('failed', $log->fresh()->status);
    }

    // ── API: Send WhatsApp with Quota ────────────────────────────

    public function test_send_whatsapp_api_returns_429_when_quota_exceeded(): void
    {
        Queue::fake();

        WhatsappLog::factory()->count(50)->create([
            'institution_id' => $this->institution->id,
            'sent_by' => $this->user->id,
            'created_at' => now(),
        ]);

        $response = $this->actingAs($this->user)->postJson('/api/v1/communications/whatsapp/send', [
            'recipients' => [['phone' => '919876543210']],
            'message' => 'Quota test',
            'template_name' => 'test_template',
        ]);

        $response->assertStatus(429);
    }

    // ── Stats include Quota ─────────────────────────────────────

    public function test_whatsapp_stats_includes_quota_and_read_count(): void
    {
        $response = $this->actingAs($this->user)->getJson('/api/v1/communications/whatsapp/stats');

        $response->assertOk();
        $response->assertJsonStructure([
            'data' => [
                'total', 'sent', 'delivered', 'read', 'failed',
                'quota' => [
                    'monthly_limit', 'monthly_used', 'monthly_remaining',
                    'daily_limit', 'daily_used', 'daily_remaining',
                ],
            ],
        ]);
    }
}
