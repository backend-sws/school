<?php

namespace App\Services\Analytics\Providers;

use App\Contracts\AnalyticsContract;
use App\Models\StudentProfile;
use App\Models\StudentTransition;
use Illuminate\Support\Facades\DB;

class PromotionAnalytics implements AnalyticsContract
{
    public function getAnalytics(array $filters): array
    {
        $startDate = $filters['start_date'] ?? now()->startOfYear()->toDateString();
        $endDate = $filters['end_date'] ?? now()->toDateString();

        // Normalize YYYY-MM to YYYY-MM-DD
        if (strlen($startDate) === 7) {
            $startDate .= '-01';
        }
        if (strlen($endDate) === 7) {
            $endDate = \Illuminate\Support\Carbon::parse($endDate . '-01')->endOfMonth()->toDateString();
        }

        $institutionId = auth()->user()->institution_id;

        $eligibleCount = StudentProfile::where('institution_id', $institutionId)
            ->where('enrollment_status', 'active')
            ->when($filters['lms_class_id'] ?? null, function ($q, $classId) {
                $q->whereHas('user.academicInfo', fn($ai) => $ai->where('lms_class_id', $classId));
            })
            ->count();

        $promotedCount = StudentTransition::where('institution_id', $institutionId)
            ->where('type', 'promotion')
            ->whereBetween('processed_at', [$startDate, $endDate])
            ->when($filters['lms_class_id'] ?? null, function ($q, $classId) {
                $q->where('from_class_id', $classId);
            })
            ->count();

        return [
            'widgets' => [
                ['title' => 'Eligible Students', 'value' => $eligibleCount, 'description' => 'Students ready for promotion'],
                ['title' => 'Promoted So Far', 'value' => $promotedCount, 'description' => 'Successfully promoted'],
                ['title' => 'Pending Action', 'value' => max(0, $eligibleCount - $promotedCount), 'description' => 'Remaining students'],
                ['title' => 'Success Rate', 'value' => $eligibleCount > 0 ? round(($promotedCount / $eligibleCount) * 100, 1) . '%' : '0%', 'description' => 'Promotion completion rate'],
            ],
            'chart' => [
                ['name' => 'Eligible', 'value' => $eligibleCount],
                ['name' => 'Promoted', 'value' => $promotedCount],
            ],
        ];
    }
}
