<?php

namespace App\Http\Controllers\Api\V1\Analytics;

use App\Http\Controllers\Api\V1\BaseController;
use App\Services\Analytics\AnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnalyticsController extends BaseController
{
    protected AnalyticsService $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    /**
     * Get analytics data based on type and filters.
     *
     * @param Request $request
     * @param string $type
     * @return JsonResponse
     */
    public function show(Request $request, string $type): JsonResponse
    {
        try {
            $filters = $request->all();
            $data = $this->analyticsService->getAnalytics($type, $filters);

            return $this->success($data);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }
}
