<?php

namespace App\Contracts;

interface AnalyticsContract
{
    /**
     * Get the analytics data based on provided filters.
     *
     * @param array $filters
     * @return array
     */
    public function getAnalytics(array $filters): array;
}
