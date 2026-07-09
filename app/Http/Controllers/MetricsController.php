<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

/**
 * Prometheus metrics endpoint for monitoring.
 * Exposes app health, DB connectivity, and basic runtime info.
 * Access: GET /metrics (no auth). Used by Prometheus scrape.
 */
class MetricsController extends Controller
{
    public function __invoke(): Response
    {
        $dbConnected = 0;
        try {
            DB::connection()->getPdo();
            $dbConnected = 1;
        } catch (\Throwable) {
            // DB down or not configured
        }

        $institutionId = config('ems.default_institution_id', '');
        $lines = [
            '# HELP cms_app_up Application is up (1) or down (0).',
            '# TYPE cms_app_up gauge',
            'cms_app_up{institution_id="' . (string) $institutionId . '"} 1',
            '# HELP cms_db_connected Database connection status (1=ok, 0=down).',
            '# TYPE cms_db_connected gauge',
            'cms_db_connected{institution_id="' . (string) $institutionId . '"} ' . $dbConnected,
        ];

        return response(implode("\n", $lines) . "\n", 200, [
            'Content-Type' => 'text/plain; charset=utf-8',
        ]);
    }
}
