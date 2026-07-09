<?php

namespace App\Traits;

trait OptimizesHeavyTasks
{
    /**
     * Dynamically boosts PHP resource limits for heavy export tasks.
     * Prevents hanging or crashing on shared hosting environments.
     *
     * @param string $memoryLimit Default is '512M'
     * @param int $timeLimit Default is 300 seconds (5 minutes)
     * @return void
     */
    protected function optimizeForExport(string $memoryLimit = '512M', int $timeLimit = 300): void
    {
        // Suppress errors if safe mode or host restricts ini_set
        @ini_set('memory_limit', $memoryLimit);
        @set_time_limit($timeLimit);
    }
}
