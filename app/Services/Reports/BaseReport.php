<?php

namespace App\Services\Reports;

use App\Contracts\ReportContract;
use App\Support\InstitutionContext;
use Illuminate\Support\Facades\Cache;

abstract class BaseReport implements ReportContract
{
    /**
     * Resolve the active institution id for the current request context.
     */
    protected function getInstitutionId(): ?int
    {
        return InstitutionContext::getActiveInstitutionId();
    }

    /**
     * Cache TTL in minutes.
     */
    protected int $cacheTtl = 5;

    /**
     * Whether to use cache for this report.
     */
    protected bool $useCache = true;

    /**
     * Get cached or fresh data for the report.
     */
    public function getData(array $filters): array
    {
        if (!$this->useCache) {
            return $this->generate($filters);
        }

        $cacheKey = $this->getCacheKey($filters);

        return Cache::remember($cacheKey, now()->addMinutes($this->cacheTtl), function () use ($filters) {
            return $this->generate($filters);
        });
    }

    /**
     * The actual data generation logic.
     */
    abstract protected function generate(array $filters): array;

    /**
     * Generate a unique cache key based on filters.
     */
    protected function getCacheKey(array $filters): string
    {
        return 'report_' . static::class . '_' . md5(json_encode($filters));
    }

    /**
     * Default headers - can be overridden.
     */
    public function getHeaders(): array
    {
        return [];
    }

    /**
     * Default metadata - can be overridden.
     */
    public function getMetadata(): array
    {
        return [
            'title' => 'Generic Report',
            'description' => '',
            'type' => 'table',
        ];
    }
}
