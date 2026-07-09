<?php

namespace App\Console\Commands;

use App\Models\AiUsageLog;
use App\Models\Institution;
use App\Enums\SubscriptionTier;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

/**
 * Sync daily AI usage from local logs and alert institutions nearing quota.
 *
 * Schedule: daily at midnight
 */
class AiSyncUsageCommand extends Command
{
    protected $signature = 'ai:sync-usage';

    protected $description = 'Sync AI usage stats and alert institutions at 80%+ quota';

    public function handle(): int
    {
        $institutions = Institution::with('organization.subscription')->get();

        foreach ($institutions as $institution) {
            $subscription = $institution->organization?->subscription;
            if (!$subscription || !$subscription->hasModule('ai_assistant')) {
                continue;
            }

            $tier = $subscription->resolvedTier();
            $maxTokens = $tier->maxAiTokensPerMonth();

            if ($maxTokens <= 0) {
                continue;
            }

            $usedTokens = AiUsageLog::forInstitution($institution->id)
                ->thisMonth()
                ->sum('tokens_used');

            $usagePercent = ($usedTokens / $maxTokens) * 100;

            if ($usagePercent >= 100) {
                Log::warning("[AI Quota] Institution {$institution->id} ({$institution->name}) exceeded AI quota: {$usedTokens}/{$maxTokens}");
                // TODO: Trigger notification via AlertRuleEngine when 'ai_quota_warning' event is implemented
            } elseif ($usagePercent >= 80) {
                Log::info("[AI Quota] Institution {$institution->id} at {$usagePercent}% AI quota");
                // TODO: Trigger warning notification
            }
        }

        $this->info('AI usage sync complete.');

        return self::SUCCESS;
    }
}
