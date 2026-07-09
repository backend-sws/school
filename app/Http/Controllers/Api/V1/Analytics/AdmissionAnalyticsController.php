<?php

namespace App\Http\Controllers\Api\V1\Analytics;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\AdmissionApplication;
use App\Support\InstitutionContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdmissionAnalyticsController extends BaseController
{


    /**
     * @OA\Get(
     * path="/admission-analytics",
     * summary="Get admission analytics with multi-level filters",
     * tags={"Admin: Admission Analytics"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="year", in="query", description="Year filter (e.g. 2026)", @OA\Schema(type="integer")),
     * @OA\Parameter(name="application_type", in="query", description="Filter by 'new' or 'readmission'", @OA\Schema(type="string", enum={"new", "readmission"})),
     * @OA\Parameter(name="start_date", in="query", description="Calendar start date (YYYY-MM-DD)", @OA\Schema(type="string", format="date")),
     * @OA\Parameter(name="end_date", in="query", description="Calendar end date (YYYY-MM-DD)", @OA\Schema(type="string", format="date")),
     * @OA\Response(
     * response=200,
     * description="Filtered Analytics Data",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="data", type="object")
     * )
     * )
     * )
     */
    public function index(Request $request): JsonResponse
    {
        // 1. FILTERS 
        $year = $request->input('year', date('Y'));
        $type = $request->input('application_type');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        // 2. BASE QUERY FOR WIDGETS
        $query = AdmissionApplication::query()
            ->leftJoin('admission_heads', 'admission_applications.admission_head_id', '=', 'admission_heads.id')
            ->where('admission_applications.payment_status', 'success');

        // Apply Filters
        if ($year) {
            $query->whereYear('admission_applications.created_at', $year);
        }
        if ($type) {
            $query->where('admission_applications.application_type', $type);
        }
        if ($startDate && $endDate) {
            $query->whereBetween('admission_applications.created_at', [$startDate, $endDate]);
        }

        $analyticsData = (clone $query)->select(
            DB::raw('COUNT(admission_applications.id) as total_received'),
            DB::raw('SUM(admission_heads.application_fees) as total_app_fees'),
            DB::raw('SUM(admission_applications.amount - admission_heads.application_fees) as total_admission_fees_only'),
            DB::raw('SUM(admission_applications.amount) as total_collected'),
            DB::raw("COUNT(CASE WHEN admission_applications.application_type = 'new' THEN 1 END) as new_count"),
            DB::raw("COUNT(CASE WHEN admission_applications.application_type = 'readmission' THEN 1 END) as readmission_count")
        )->first();

        // 3. STREAM-WISE TABLE WITH FILTERS
        $institutionId = InstitutionContext::getActiveInstitutionId();
        $streamTableQuery = DB::table('streams as s')
            ->leftJoin('admission_heads as h', 's.id', '=', 'h.stream_id')
            ->leftJoin('admission_applications as a', function ($join) use ($year, $type, $startDate, $endDate, $institutionId) {
                $join->on('h.id', '=', 'a.admission_head_id');

                if ($institutionId)
                    $join->where('a.institution_id', $institutionId);
                if ($year)
                    $join->whereYear('a.created_at', $year);
                if ($type)
                    $join->where('a.application_type', $type);
                if ($startDate && $endDate)
                    $join->whereBetween('a.created_at', [$startDate, $endDate]);
            });

        if ($institutionId) {
            $streamTableQuery->where('s.institution_id', $institutionId);
        }

        $streamTable = $streamTableQuery->select(
            's.name as stream',
            DB::raw('COUNT(a.id) as application_submitted'),
            DB::raw("SUM(CASE WHEN a.payment_status = 'success' THEN h.application_fees ELSE 0 END) as app_fee_paid"),
            DB::raw("SUM(CASE WHEN a.payment_status = 'success' THEN (a.amount - h.application_fees) ELSE 0 END) as admission_fee_paid"),
            DB::raw("SUM(CASE WHEN a.payment_status = 'success' THEN a.amount ELSE 0 END) as total_amount"),
            DB::raw("COUNT(CASE WHEN a.process_status = 'approved' THEN 1 END) as admission_approved")
        )
            ->groupBy('s.id', 's.name')
            ->get();

        return $this->success([
            'filters_applied' => [
                'year' => $year,
                'type' => $type ?? 'all',
                'date_range' => $startDate ? "$startDate to $endDate" : 'all_time'
            ],
            'widgets' => [
                'application_received' => (int) $analyticsData->total_received,
                'new_admission_count' => (int) $analyticsData->new_count,
                're_admission_count' => (int) $analyticsData->readmission_count,
                'application_fee_paid' => (float) $analyticsData->total_app_fees,
                'admission_fee_paid' => (float) $analyticsData->total_admission_fees_only,
                'total_collected' => (float) $analyticsData->total_collected
            ],
            'stream_table' => $streamTable,
            'summary_footer' => [
                'total_apps' => $streamTable->sum('application_submitted'),
                'total_app_fee' => $streamTable->sum('app_fee_paid'),
                'total_admission_fee' => $streamTable->sum('admission_fee_paid'),
                'grand_total' => $streamTable->sum('total_amount')
            ]
        ]);
    }
}
