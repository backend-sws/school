<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

/**
 * Reset monthly AI token counters.
 *
 * Schedule: 1st of each month at 00:00
 *
 * Note: AI usage is tracked per-request in ai_usage_logs table.
 * The "reset" here is simply a log marker — the quota check uses
 * SUM(tokens_used) WHERE created_at >= startOfMonth, so old months
 * automatically fall out of scope. No actual deletion needed.
 */
class AiResetQuotaCommand extends Command
{
    protected $signature = 'ai:reset-monthly-quota';

    protected $description = 'Monthly AI quota cycle reset (mostly a no-op — usage is date-scoped)';

    public function handle(): int
    {
        Log::info('[AI Quota] Monthly billing cycle reset. Usage counters are date-scoped, no data deletion needed.');

        $this->info('AI monthly quota cycle reset complete.');

        return self::SUCCESS;
    }
}
