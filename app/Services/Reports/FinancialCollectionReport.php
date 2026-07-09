<?php

namespace App\Services\Reports;

use App\Models\FeePayment;
use Illuminate\Support\Facades\DB;

class FinancialCollectionReport extends BaseReport
{
    protected bool $useCache = false;

    protected function generate(array $filters): array
    {
        $startDate = $filters['start_date'] ?? now()->startOfMonth()->toDateString();
        $endDate = $filters['end_date'] ?? now()->toDateString();
        $viewMode = $filters['view_mode'] ?? 'daily';
        $institutionId = $this->getInstitutionId();

        // 1. BASE QUERY FOR ALL COLLECTIONS IN FEEPAYMENT
        $query = FeePayment::query()
            ->whereIn('payment_status', ['paid', 'success'])
            ->whereBetween('payment_date', [$startDate, $endDate]);

        if ($institutionId) {
            $query->where('institution_id', $institutionId);
        }

        if (isset($filters['class_id'])) {
            $query->whereHas('student.academicInfo', function ($q) use ($filters) {
                $q->where('lms_class_id', $filters['class_id']);
            });
        }

        if (isset($filters['transaction_id']) && !empty($filters['transaction_id'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('transaction_id', 'like', '%' . $filters['transaction_id'] . '%')
                  ->orWhere('online_transaction_id', 'like', '%' . $filters['transaction_id'] . '%')
                  ->orWhere('receipt_no', 'like', '%' . $filters['transaction_id'] . '%');
            });
        }

        if (isset($filters['search_date']) && !empty($filters['search_date'])) {
            $query->whereDate('payment_date', $filters['search_date']);
        }

        // Fetch payments
        $payments = $query->with(['student.studentProfile', 'feeHead', 'inventorySale'])->get();

        $courseFees = 0.0;
        $admissionFees = 0.0;
        $inventorySales = 0.0;

        foreach ($payments as $payment) {
            $amount = (float) $payment->total_amount;
            if ($payment->payable_entity_type === 'admission_application') {
                $admissionFees += $amount;
            } elseif ($payment->inventorySale !== null) {
                $inventorySales += $amount;
            } else {
                // Regular Course/Monthly Ledger Fees
                $courseFees += $amount;
            }
        }

        $reportData = [
            'summary' => [
                'course_fees' => $courseFees,
                'admission_fees' => $admissionFees,
                'inventory_sales' => $inventorySales,
                'grand_total' => $courseFees + $admissionFees + $inventorySales,
            ],
            'daily_trend' => $this->getDailyTrend($startDate, $endDate, $institutionId),
            'breakdown' => $this->getFeeTypeBreakdown($payments),
        ];

        if ($viewMode === 'monthly') {
            $reportData['items'] = $this->getMonthlyItems($startDate, $endDate, $institutionId, $filters['class_id'] ?? null);
            $reportData['pagination'] = null; // Monthly is usually full period
        } else {
            $perPage = $filters['per_page'] ?? 15;

            // Map and format daily/transaction list items
            $items = collect();
            foreach ($payments as $payment) {
                // Determine fee type display label
                $feeTypeLabel = 'General';
                if ($payment->payable_entity_type === 'admission_application') {
                    $feeTypeLabel = 'Admission Fee';
                } elseif ($payment->inventorySale !== null) {
                    $feeTypeLabel = 'Inventory Sales';
                } elseif ($payment->feeHead !== null) {
                    $feeTypeLabel = $payment->feeHead->title;
                } elseif ($payment->for_month !== null) {
                    $feeTypeLabel = 'Monthly Fees (' . $payment->for_month . ')';
                }

                $items->push([
                    'transaction_id' => $payment->transaction_id ?: ($payment->online_transaction_id ?: ($payment->receipt_no ?: 'N/A')),
                    'date' => \Carbon\Carbon::parse($payment->payment_date)->toDateString(),
                    'student' => $payment->student->name ?? 'N/A',
                    'reg_no' => $payment->student->reg_no ?: ($payment->student->studentProfile->reg_no ?? 'N/A'),
                    'fee_type' => $feeTypeLabel,
                    'amount' => '₹' . number_format($payment->total_amount, 2),
                    'mode' => $payment->payment_mode ?: 'cash',
                    'timestamp' => \Carbon\Carbon::parse($payment->payment_date)->timestamp,
                ]);
            }

            // Sort by date (latest first)
            $sorted = $items->sortByDesc('timestamp')->values();

            // Paginate manually
            $totalCount = $sorted->count();
            $currentPage = \Illuminate\Pagination\LengthAwarePaginator::resolveCurrentPage();
            $itemsForCurrentPage = $sorted->slice(($currentPage - 1) * $perPage, $perPage)->values();

            $reportData['items'] = $itemsForCurrentPage->map(function ($item, $index) use ($currentPage, $perPage) {
                $item['sl_no'] = (($currentPage - 1) * $perPage) + $index + 1;
                unset($item['timestamp']);
                return $item;
            })->toArray();

            $reportData['pagination'] = [
                'current_page' => $currentPage,
                'last_page' => (int) ceil($totalCount / $perPage),
                'per_page' => $perPage,
                'total' => $totalCount,
            ];
        }

        return $reportData;
    }

    protected function getMonthlyItems($start, $end, $institutionId, $classId = null)
    {
        // Enrolled user IDs if class filtered
        $enrolledUserIds = null;
        if ($classId) {
            $enrolledUserIds = DB::table('lms_class_enrollments')
                ->where('lms_class_id', $classId)
                ->pluck('user_id')
                ->toArray();
        }

        $monthExpr = DB::connection()->getDriverName() === 'pgsql'
            ? "to_char(payment_date, 'YYYY-MM')"
            : "DATE_FORMAT(payment_date, '%Y-%m')";

        // We fetch all records from fee_payments and group by month/type
        $feePaymentsQuery = DB::table('fee_payments')
            ->select(
                DB::raw("{$monthExpr} as month"),
                DB::raw("SUM(CASE WHEN payable_entity_type = 'admission_application' THEN total_amount ELSE 0 END) as admission"),
                DB::raw("SUM(CASE WHEN id IN (SELECT fee_payment_id FROM inventory_sales WHERE fee_payment_id IS NOT NULL) THEN total_amount ELSE 0 END) as inventory"),
                DB::raw("SUM(CASE WHEN (payable_entity_type IS NULL OR payable_entity_type != 'admission_application') AND id NOT IN (SELECT fee_payment_id FROM inventory_sales WHERE fee_payment_id IS NOT NULL) THEN total_amount ELSE 0 END) as fees")
            )
            ->whereIn('payment_status', ['paid', 'success'])
            ->whereBetween('payment_date', [$start, $end]);

        if ($institutionId) {
            $feePaymentsQuery->where('institution_id', $institutionId);
        }
        if ($enrolledUserIds) {
            $feePaymentsQuery->whereIn('user_id', $enrolledUserIds);
        }

        $monthlyData = $feePaymentsQuery->groupBy('month')->get()->keyBy('month');

        $startDate = \Carbon\Carbon::parse($start)->startOfMonth();
        $endDate = \Carbon\Carbon::parse($end)->endOfMonth();
        $items = [];

        while ($startDate->lte($endDate)) {
            $key = $startDate->format('Y-m');
            $row = $monthlyData->get($key);

            $fees = $row ? (float) $row->fees : 0.0;
            $admission = $row ? (float) $row->admission : 0.0;
            $inventory = $row ? (float) $row->inventory : 0.0;
            $total = $fees + $admission + $inventory;

            if ($total > 0) {
                $items[] = [
                    'month' => $startDate->format('M Y'),
                    'fees' => '₹' . number_format($fees, 2),
                    'admission' => '₹' . number_format($admission, 2),
                    'services' => '₹' . number_format($inventory, 2), // Maps to Inventory in Monthly headers
                    'total' => '₹' . number_format($total, 2),
                ];
            }
            $startDate->addMonth();
        }

        return array_reverse($items);
    }

    protected function getDailyTrend($start, $end, $institutionId)
    {
        $dateExpr = DB::connection()->getDriverName() === 'pgsql' ? 'payment_date::date' : 'DATE(payment_date)';

        $query = DB::table('fee_payments')
            ->select(DB::raw("{$dateExpr} as date"), DB::raw("SUM(total_amount) as total"))
            ->whereIn('payment_status', ['paid', 'success'])
            ->whereBetween('payment_date', [$start, $end]);

        if ($institutionId) {
            $query->where('institution_id', $institutionId);
        }

        return $query->groupBy('date')
            ->orderBy('date')
            ->get();
    }

    protected function getFeeTypeBreakdown($payments)
    {
        $breakdown = [];

        foreach ($payments as $payment) {
            $amount = (float) $payment->total_amount;
            $feeTypeLabel = 'General';

            if ($payment->payable_entity_type === 'admission_application') {
                $feeTypeLabel = 'Admission Fee';
            } elseif ($payment->inventorySale !== null) {
                $feeTypeLabel = 'Inventory Sales';
            } elseif ($payment->feeHead !== null) {
                $feeTypeLabel = $payment->feeHead->name;
            } elseif ($payment->ledger_snapshot !== null && isset($payment->ledger_snapshot['fees'])) {
                // Parse monthly payment to attribute individual components (Hostel, Transport, Tuition, etc.)
                foreach ($payment->ledger_snapshot['fees'] as $feeComponent) {
                    $compId = $feeComponent['fee_particular_id'] ?? null;
                    $compAmount = (float) ($feeComponent['amount'] ?? 0);
                    
                    $typeName = $this->getFeeTypeName($compId);
                    if ($typeName) {
                        $breakdown[$typeName] = ($breakdown[$typeName] ?? 0.0) + $compAmount;
                    } else {
                        $breakdown['General Fee'] = ($breakdown['General Fee'] ?? 0.0) + $compAmount;
                    }
                }
                continue; // Skip base amount addition
            } elseif ($payment->for_month !== null) {
                $feeTypeLabel = 'Monthly Academic Fee';
            }

            $breakdown[$feeTypeLabel] = ($breakdown[$feeTypeLabel] ?? 0.0) + $amount;
        }

        $formatted = [];
        foreach ($breakdown as $name => $total) {
            if ($total > 0) {
                $formatted[] = [
                    'name' => $name,
                    'total' => $total,
                ];
            }
        }

        return $formatted;
    }

    protected array $feeTypeNameCache = [];

    protected function getFeeTypeName($id)
    {
        if (!$id) return null;
        if (isset($this->feeTypeNameCache[$id])) {
            return $this->feeTypeNameCache[$id];
        }

        $feeType = \App\Models\FeeType::find($id);
        $name = $feeType?->name;
        $this->feeTypeNameCache[$id] = $name;
        return $name;
    }

    public function getHeaders(): array
    {
        $viewMode = request('view_mode', 'daily');

        if ($viewMode === 'monthly') {
            return [
                ['key' => 'month', 'label' => 'Month'],
                ['key' => 'fees', 'label' => 'Course Fees', 'align' => 'right'],
                ['key' => 'admission', 'label' => 'Admission', 'align' => 'right'],
                ['key' => 'services', 'label' => 'Inventory Sales', 'align' => 'right'],
                ['key' => 'total', 'label' => 'Total', 'align' => 'right'],
            ];
        }

        return [
            ['key' => 'sl_no', 'label' => 'SL No'],
            ['key' => 'transaction_id', 'label' => 'TXN ID'],
            ['key' => 'date', 'label' => 'Date'],
            ['key' => 'student', 'label' => 'Student'],
            ['key' => 'reg_no', 'label' => 'Reg No'],
            ['key' => 'fee_type', 'label' => 'Fee Type'],
            ['key' => 'amount', 'label' => 'Amount', 'align' => 'right'],
            ['key' => 'mode', 'label' => 'Payment Mode'],
        ];
    }

    public function getMetadata(): array
    {
        return [
            'title' => 'Financial Collection Report',
            'description' => 'Summary of all fees collected within the selected period.',
            'type' => 'dashboard_complex',
            'charts' => [
                'daily_trend' => 'line',
                'fee_type_breakdown' => 'pie',
            ],
        ];
    }
}
