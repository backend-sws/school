<?php

namespace App\Services\Analytics;

use App\Contracts\AnalyticsContract;
use Exception;

class AnalyticsService
{
    /**
     * Map of analytics types to their corresponding provider classes.
     */
    protected array $providerMap = [
        'fee-hub' => \App\Services\Analytics\Providers\FeeHubAnalytics::class,
        'promotion' => \App\Services\Analytics\Providers\PromotionAnalytics::class,
        'readmission' => \App\Services\Analytics\Providers\ReadmissionAnalytics::class,
    ];

    /**
     * Resolve and execute analytics.
     *
     * @param string $type
     * @param array $filters
     * @return array
     */
    public function getAnalytics(string $type, array $filters): array
    {
        $provider = $this->resolveProvider($type);

        return $provider->getAnalytics($filters);
    }

    /**
     * Resolve the analytics provider class for a given type.
     *
     * @param string $type
     * @return AnalyticsContract
     * @throws Exception
     */
    protected function resolveProvider(string $type): AnalyticsContract
    {
        if (!isset($this->providerMap[$type])) {
            throw new Exception("Analytics type '{$type}' not supported.");
        }

        $class = $this->providerMap[$type];

        if (!class_exists($class)) {
            throw new Exception("Analytics provider class '{$class}' does not exist.");
        }

        return app($class);
    }
}
