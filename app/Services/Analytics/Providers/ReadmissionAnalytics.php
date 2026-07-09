<?php

namespace App\Services\Analytics\Providers;

use App\Contracts\AnalyticsContract;
use App\Models\AdmissionApplication;
use App\Models\StudentTransition;

class ReadmissionAnalytics implements AnalyticsContract
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

        $eligibleCount = AdmissionApplication::where('application_type', 're-admission')
            ->where('process_status', 'pending')
            ->whereBetween('submitted_at', [$startDate, $endDate])
            ->when($filters['lms_class_id'] ?? null, function ($q, $classId) {
                $q->whereHas('admissionHead', function ($h) use ($classId) {
                    $lmsClass = \App\Models\LmsClass::find($classId);
                    if ($lmsClass) {
                        $h->where('stream_id', $lmsClass->stream_id)
                            ->where('session_id', $lmsClass->session_id);
                    }
                });
            })
            ->count();

        $readmittedCount = StudentTransition::where('institution_id', $institutionId)
            ->where('type', 'readmission')
            ->whereBetween('processed_at', [$startDate, $endDate])
            ->when($filters['lms_class_id'] ?? null, function ($q, $classId) {
                $q->where('to_class_id', $classId);
            })
            ->count();

        return [
            'widgets' => [
                ['title' => 'Eligible for Re-Admit', 'value' => $eligibleCount, 'description' => 'Returning student applications'],
                ['title' => 'Successfully Re-Admitted', 'value' => $readmittedCount, 'description' => 'Processed returns'],
                ['title' => 'Processed Extensions', 'value' => 0, 'description' => 'Gap year approvals'],
                ['title' => 'Rollbacks', 'value' => StudentTransition::where('institution_id', $institutionId)->where('type', 'readmission')->where('status', 'rolled_back')->count(), 'description' => 'Reverted actions'],
            ],
            'chart' => [
                ['name' => 'Eligible', 'value' => $eligibleCount],
                ['name' => 'Re-Admitted', 'value' => $readmittedCount],
            ],
        ];
    }
}
