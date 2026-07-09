<?php

namespace App\Http\Controllers\Api\V1\Reports;

use App\Http\Controllers\Api\V1\BaseController;
use App\Services\Reports\ReportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends BaseController
{
    use \App\Traits\OptimizesHeavyTasks;

    protected ReportService $reportService;
    protected \App\Services\InstitutionBrandingService $brandingService;

    public function __construct(ReportService $reportService, \App\Services\InstitutionBrandingService $brandingService)
    {
        $this->reportService = $reportService;
        $this->brandingService = $brandingService;
    }

    /**
     * Generate a report based on type and filters.
     *
     * @param Request $request
     * @param string $type
     * @return JsonResponse
     */
    public function show(Request $request, string $type): JsonResponse
    {
        try {
            $filters = $request->all();
            $report = $this->reportService->generateReport($type, $filters);

            return $this->success($report);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    /**
     * Export a report to PDF or Excel.
     *
     * @param Request $request
     * @param string $type
     * @return mixed
     */
    public function export(Request $request, string $type)
    {
        try {
            $this->optimizeForExport('1024M', 600); // 1GB memory, 10 minutes timeout for reports

            $format = $request->input('format', 'excel');
            $filters = $request->all();
            $report = $this->reportService->generateReport($type, $filters);

            if ($format === 'pdf') {
                $institutionId = \App\Support\InstitutionContext::getActiveInstitutionId($request->user());
                $branding = $this->brandingService->resolve($institutionId);

                $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('reports.generic', array_merge($report, [
                    'branding' => $branding,
                    'metadata' => array_merge($report['metadata'] ?? [], [
                        'title' => $report['metadata']['title'] ?? ucfirst($type) . ' Report',
                    ]),
                ]));
                $pdf->setOptions([
                    'isRemoteEnabled' => true,
                    'defaultFont' => 'DejaVu Sans',
                ]);
                return $pdf->download("report_{$type}.pdf");
            }

            return \Maatwebsite\Excel\Facades\Excel::download(
                new \App\Exports\GenericReportExport($report['data']['items'] ?? [], $report['headers']),
                "report_{$type}.xlsx"
            );
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }
}
