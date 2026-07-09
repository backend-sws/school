<?php

namespace App\Services\Reports;

use App\Contracts\ReportContract;
use Exception;

class ReportService
{
    /**
     * Map of report types to their corresponding classes.
     */
    protected array $reportMap = [
        'financial-collection' => \App\Services\Reports\FinancialCollectionReport::class,
        'outstanding-dues' => \App\Services\Reports\OutstandingDuesReport::class,
        'admission-analytics' => \App\Services\Reports\AdmissionAnalyticsReport::class,
        'promotion-analytics' => \App\Services\Reports\PromotionReport::class,
        'readmission-analytics' => \App\Services\Reports\ReadmissionReport::class,
        'attendance-analytics' => \App\Services\Reports\AttendanceAnalyticsReport::class,
        'inventory' => \App\Services\Reports\InventoryReport::class,
        'student-performance' => \App\Services\Reports\StudentPerformanceReport::class,
    ];

    /**
     * Resolve and execute a report.
     *
     * @param string $type
     * @param array $filters
     * @return array
     */
    public function generateReport(string $type, array $filters): array
    {
        $report = $this->resolveReport($type);

        return [
            'data' => $report->getData($filters),
            'headers' => $report->getHeaders(),
            'metadata' => $report->getMetadata(),
        ];
    }

    /**
     * Resolve the report class for a given type.
     *
     * @param string $type
     * @return ReportContract
     * @throws Exception
     */
    protected function resolveReport(string $type): ReportContract
    {
        if (!isset($this->reportMap[$type])) {
            throw new Exception("Report type '{$type}' not supported.");
        }

        $class = $this->reportMap[$type];

        if (!class_exists($class)) {
            throw new Exception("Report class '{$class}' does not exist.");
        }

        return app($class);
    }

    /**
     * Register a new report implementation. (Mainly for testing or dynamic extensions)
     */
    public function register(string $type, string $class): void
    {
        $this->reportMap[$type] = $class;
    }
}
