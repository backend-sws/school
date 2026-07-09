<?php

namespace App\Jobs;

use App\Models\CommunicationLog;
use App\Services\SmsService;
use App\Services\WhatsappService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * Unified communication dispatch job — handles SMS, WhatsApp, Email.
 *
 * Replaces SendSmsJob + SendWhatsappJob with a single polymorphic job.
 * Routes to the correct provider based on the CommunicationLog channel.
 */
class SendCommunicationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public function backoff(): array
    {
        return [30, 120, 300];
    }

    public function __construct(
        public CommunicationLog $log
    ) {
        // Route to channel-specific queue
        $this->onQueue(match ($log->channel) {
            'sms'      => 'sms',
            'whatsapp' => 'whatsapp',
            'email'    => 'email',
            default    => 'default',
        });
    }

    public function handle(SmsService $smsService, WhatsappService $whatsappService): void
    {
        try {
            $this->log->incrementRetry();

            $providerId = match ($this->log->channel) {
                'sms'      => $smsService->dispatchToProvider(
                    $this->log->recipient_phone,
                    $this->log->message,
                    $this->log->template_id
                ),
                'whatsapp' => $whatsappService->dispatchToProvider($this->log),
                'email'    => $this->dispatchEmail(),
                default    => throw new \RuntimeException("Unknown channel: {$this->log->channel}"),
            };

            $this->log->markSent($providerId);
        } catch (\Throwable $e) {
            Log::warning("[Communication] {$this->log->channel} job attempt failed", [
                'log_id'  => $this->log->id,
                'attempt' => $this->attempts(),
                'error'   => $e->getMessage(),
            ]);

            if ($this->attempts() >= $this->tries) {
                $this->log->markFailed($e->getMessage());
                return;
            }

            throw $e;
        }
    }

    /**
     * Email is already dispatched by Laravel's mail system.
     * This logs the status after the fact.
     */
    protected function dispatchEmail(): string
    {
        // Email is dispatched by Laravel's notification system directly.
        // This job only records the log entry; actual send already happened.
        return 'email-' . uniqid();
    }

    public function failed(\Throwable $exception): void
    {
        $this->log->markFailed($exception->getMessage());

        Log::error("[Communication] {$this->log->channel} job permanently failed", [
            'log_id' => $this->log->id,
            'error'  => $exception->getMessage(),
        ]);
    }
}
