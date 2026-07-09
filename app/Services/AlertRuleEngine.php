<?php

namespace App\Services;

use App\Models\AlertRule;
use Illuminate\Support\Facades\Log;

/**
 * Alert Rule Engine — Software Factory Pattern
 *
 * Evaluates configured alert rules and dispatches via the correct channel
 * (SMS, WhatsApp, or both) based on the rule's `channel` field.
 *
 * Called by a scheduled command (e.g., daily at 8 AM) or triggered by events.
 */
class AlertRuleEngine
{
    public function __construct(
        protected SmsService $smsService,
        protected WhatsappService $whatsappService
    ) {}

    /**
     * Process all active rules for an institution.
     */
    public function processAll(int $institutionId): array
    {
        $rules = AlertRule::forInstitution($institutionId)
            ->active()
            ->get();

        $results = [];
        foreach ($rules as $rule) {
            if (!$this->shouldTrigger($rule)) {
                continue;
            }

            try {
                $recipients = $this->resolveRecipients($rule);
                if (empty($recipients)) {
                    continue;
                }

                $sent = $this->dispatchViaChannel($rule, $recipients);
                $results[] = [
                    'rule' => $rule->name,
                    'event' => $rule->trigger_event,
                    'channel' => $rule->channel,
                    'sent' => $sent,
                ];
            } catch (\Throwable $e) {
                Log::error('[ALERT] Rule processing failed', [
                    'rule_id' => $rule->id,
                    'error' => $e->getMessage(),
                ]);
                $results[] = [
                    'rule' => $rule->name,
                    'event' => $rule->trigger_event,
                    'error' => $e->getMessage(),
                ];
            }
        }

        return $results;
    }

    /**
     * Process rules for a specific event.
     */
    public function processEvent(int $institutionId, string $event, array $context = []): array
    {
        $rules = AlertRule::forInstitution($institutionId)
            ->active()
            ->forEvent($event)
            ->get();

        $results = [];
        foreach ($rules as $rule) {
            $recipients = $this->resolveRecipients($rule, $context);
            if (empty($recipients)) continue;

            $sent = $this->dispatchViaChannel($rule, $recipients);
            $results[] = ['rule' => $rule->name, 'channel' => $rule->channel, 'sent' => $sent];
        }

        return $results;
    }

    /**
     * Dispatch to SMS, WhatsApp, or both based on rule channel.
     */
    protected function dispatchViaChannel(AlertRule $rule, array $recipients): int
    {
        $sent = 0;

        $channel = $rule->channel ?? 'sms';

        if (in_array($channel, ['sms', 'both'])) {
            $sent += $this->smsService->processAlertRule($rule, $recipients);
        }

        if (in_array($channel, ['whatsapp', 'both'])) {
            $sent += $this->whatsappService->processAlertRule($rule, $recipients);
        }

        return $sent;
    }

    /**
     * Check if a rule should trigger based on frequency.
     */
    protected function shouldTrigger(AlertRule $rule): bool
    {
        if (!$rule->last_triggered_at) return true;

        return match ($rule->frequency) {
            'once' => false,
            'daily' => $rule->last_triggered_at->lt(now()->startOfDay()),
            'weekly' => $rule->last_triggered_at->lt(now()->startOfWeek()),
            default => true,
        };
    }

    /**
     * Resolve recipients based on rule configuration.
     */
    protected function resolveRecipients(AlertRule $rule, array $context = []): array
    {
        if (!empty($context['recipients'])) {
            return $context['recipients'];
        }

        return match ($rule->trigger_event) {
            'fee_overdue' => $this->resolveFeeOverdueRecipients($rule),
            'attendance_absent' => $this->resolveAbsenteeRecipients($rule),
            default => [],
        };
    }

    protected function resolveFeeOverdueRecipients(AlertRule $rule): array
    {
        Log::info('[ALERT] Fee overdue resolver called', ['rule_id' => $rule->id]);
        return [];
    }

    protected function resolveAbsenteeRecipients(AlertRule $rule): array
    {
        Log::info('[ALERT] Absentee resolver called', ['rule_id' => $rule->id]);
        return [];
    }
}
