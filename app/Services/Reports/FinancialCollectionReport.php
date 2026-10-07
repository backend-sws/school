<?php

namespace App\Services\Reports;

use App\Models\AdmissionApplication;
use App\Models\FeePayment;
use App\Models\Session;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class FinancialCollectionReport extends BaseReport
{
    protected bool $useCache = false;

    protected function generate(array $filters): array
    {
        $institutionId = $this->getInstitutionId();
        $sessionId = $filters['academic_session_id'] ?? ($filters['session_id'] ?? null);

        $selectedSession = null;
        if ($sessionId && $sessionId !== 'all') {
            $selectedSession = Session::when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
                ->where('id', (int) $sessionId)
                ->first();
        } elseif (!$sessionId && empty($filters['start_date'])) {
            $selectedSession = Session::when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
                ->where('is_current', true)
                ->first();
        }

        if ($selectedSession && empty($filters['start_date'])) {
            $startDate = "{$selectedSession->start_year}-04-01";
            $endDate = $selectedSession->is_current ? now()->toDateString() : "{$selectedSession->end_year}-03-31";
        } else {
            $startDate = $filters['start_date'] ?? now()->startOfMonth()->toDateString();
            $endDate = $filters['end_date'] ?? now()->toDateString();
        }

        $startDateTime = Carbon::parse($startDate)->startOfDay();
        $endDateTime = Carbon::parse($endDate)->endOfDay();
        $startMonth = Carbon::parse($startDate)->format('Y-m');
        $endMonth = Carbon::parse($endDate)->format('Y-m');
        $viewMode = $filters['view_mode'] ?? 'daily';

        // 1. BASE QUERY FOR FEE PAYMENTS
        $query = FeePayment::query()
            ->whereIn('payment_status', ['paid', 'success'])
            ->where(function ($q) use ($startDateTime, $endDateTime, $startMonth, $endMonth) {
                $q->whereBetween('payment_date', [$startDateTime, $endDateTime])
                  ->orWhereBetween('for_month', [$startMonth, $endMonth])
                  ->orWhere(function ($dt) use ($startDateTime, $endDateTime) {
                      $dt->whereNull('payment_date')->whereBetween('created_at', [$startDateTime, $endDateTime]);
                  });
            });

        if ($institutionId) {
            $query->where('institution_id', $institutionId);
        }

        if ($selectedSession) {
            $sessId = $selectedSession->id;
            $sessStartMonth = "{$selectedSession->start_year}-04";
            $sessEndMonth = "{$selectedSession->end_year}-03";

            $query->where(function ($q) use ($sessStartMonth, $sessEndMonth, $sessId) {
                $q->whereBetween('for_month', [$sessStartMonth, $sessEndMonth])
                  ->orWhere(function ($sub) use ($sessId) {
                      $sub->where('payable_entity_type', 'admission_application')
                          ->whereIn('payable_entity_id', function ($admq) use ($sessId) {
                              $admq->select('id')->from('admission_applications')->where('session_id', $sessId);
                          });
                  })
                  ->orWhere(function ($sub) use ($sessId) {
                      $sub->whereNull('for_month')
                          ->whereNull('payable_entity_type')
                          ->whereHas('student.studentProfile', fn($sq) => $sq->where('session_id', $sessId));
                  });
            });
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

        $payments = $query->with(['student.studentProfile', 'feeHead', 'inventorySale'])->get();

        $courseFees = 0.0;
        $admissionFees = 0.0;
        $transportFees = 0.0;
        $hostelFees = 0.0;
        $inventorySales = 0.0;

        foreach ($payments as $payment) {
            $amount = (float) $payment->total_amount;
            $snap = is_array($payment->ledger_snapshot) ? $payment->ledger_snapshot : json_decode($payment->ledger_snapshot ?? '', true);

            if ($payment->payable_entity_type === 'admission_application') {
                $admApp = DB::table('admission_applications')->find($payment->payable_entity_id);
                $t = (float) ($admApp->transport_amount ?? 0);
                $h = (float) ($admApp->hostel_amount ?? 0);

                $transportFees += $t;
                $hostelFees += $h;
                $admissionFees += max(0, $amount - $t - $h);
            } elseif ($payment->inventorySale !== null) {
                $inventorySales += $amount;
            } else {
                $pTransport = 0.0;
                $pHostel = 0.0;
                if (isset($snap['fees']) && is_array($snap['fees'])) {
                    foreach ($snap['fees'] as $f) {
                        $name = strtolower($f['name'] ?? '');
                        $fAmt = (float) ($f['amount'] ?? 0);
                        if (str_contains($name, 'transport')) $pTransport += $fAmt;
                        if (str_contains($name, 'hostel')) $pHostel += $fAmt;
                    }
                }
                $transportFees += $pTransport;
                $hostelFees += $pHostel;
                $courseFees += max(0, $amount - $pTransport - $pHostel);
            }
        }

        // Include any directly paid admission applications not synced to fee_payments
        $missingAdmissions = AdmissionApplication::when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
            ->when($selectedSession, fn($q) => $q->where('session_id', $selectedSession->id))
            ->whereIn('payment_status', ['paid', 'success'])
            ->where(function ($q) use ($startDateTime, $endDateTime) {
                $q->whereBetween(DB::raw('COALESCE(submitted_at, payment_date, admission_date, created_at)'), [$startDateTime, $endDateTime])
                  ->orWhereNull('submitted_at');
            })
            ->whereNotIn('id', function ($sub) {
                $sub->select('payable_entity_id')->from('fee_payments')->where('payable_entity_type', 'admission_application')->whereNotNull('payable_entity_id');
            })
            ->get(['id', 'amount', 'transport_amount', 'hostel_amount']);

        foreach ($missingAdmissions as $admApp) {
            $t = (float) ($admApp->transport_amount ?? 0);
            $h = (float) ($admApp->hostel_amount ?? 0);
            $amt = (float) ($admApp->amount ?? 0);
            $transportFees += $t;
            $hostelFees += $h;
            $admissionFees += max(0, $amt - $t - $h);
        }

        $grandTotal = $courseFees + $admissionFees + $transportFees + $hostelFees + $inventorySales;

        $breakdown = [
            ['name' => 'Tuition & Course Fees', 'total' => round($courseFees, 2)],
            ['name' => 'Admission Fees', 'total' => round($admissionFees, 2)],
            ['name' => 'Transport Fees', 'total' => round($transportFees, 2)],
            ['name' => 'Hostel Fees', 'total' => round($hostelFees, 2)],
        ];
        if ($inventorySales > 0) {
            $breakdown[] = ['name' => 'Inventory Sales', 'total' => round($inventorySales, 2)];
        }
        $breakdown = collect($breakdown)->filter(fn($x) => $x['total'] > 0)->values()->toArray();

        $reportData = [
            'summary' => [
                'course_fees' => round($courseFees, 2),
                'admission_fees' => round($admissionFees, 2),
                'transport_fees' => round($transportFees, 2),
                'hostel_fees' => round($hostelFees, 2),
                'inventory_sales' => round($inventorySales, 2),
                'grand_total' => round($grandTotal, 2),
            ],
            'daily_trend' => $this->getDailyTrend($startDate, $endDate, $institutionId, $selectedSession),
            'breakdown' => $breakdown,
        ];

        if ($viewMode === 'monthly') {
            $reportData['items'] = $this->getMonthlyItems($startDate, $endDate, $institutionId, $selectedSession, $filters['class_id'] ?? null);
            $reportData['pagination'] = null;
        } else {
            $perPage = $filters['per_page'] ?? 15;

            // Map and format daily/transaction list items
            $items = collect();
            foreach ($payments as $payment) {
                $feeTypeLabel = 'Course Fee';
                if ($payment->payable_entity_type === 'admission_application') {
                    $feeTypeLabel = 'Admission Fee';
                } elseif ($payment->inventorySale !== null) {
                    $feeTypeLabel = 'Inventory Sales';
                } elseif ($payment->feeHead !== null) {
                    $feeTypeLabel = $payment->feeHead->title;
                } elseif ($payment->for_month !== null) {
                    $feeTypeLabel = 'Monthly Fee (' . $payment->for_month . ')';
                }

                $pDate = $payment->payment_date ?: ($payment->created_at ?: now()->toDateString());

                $items->push([
                    'transaction_id' => $payment->transaction_id ?: ($payment->online_transaction_id ?: ($payment->receipt_no ?: 'N/A')),
                    'date' => Carbon::parse($pDate)->toDateString(),
                    'student' => $payment->student->name ?? 'N/A',
                    'reg_no' => $payment->student->reg_no ?: ($payment->student->studentProfile->reg_no ?? 'N/A'),
                    'fee_type' => $feeTypeLabel,
                    'amount' => '₹' . number_format($payment->total_amount, 2),
                    'mode' => ucfirst($payment->payment_mode ?: 'cash'),
                    'timestamp' => Carbon::parse($pDate)->timestamp,
                ]);
            }

            // Sort by date (latest first)
            $sorted = $items->sortByDesc('timestamp')->values();

            $isExport = !empty($filters['is_export']) || request()->routeIs('*export*') || request('is_export') || ($filters['per_page'] ?? null) >= 10000;

            if ($isExport) {
                $reportData['items'] = $sorted->map(function ($item, $index) {
                    $item['sl_no'] = $index + 1;
                    unset($item['timestamp']);
                    return $item;
                })->toArray();
                $reportData['pagination'] = null;
            } else {
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
        }

        return $reportData;
    }

    protected function getMonthlyItems($start, $end, $institutionId, $selectedSession = null, $classId = null)
    {
        $enrolledUserIds = null;
        if ($classId) {
            $enrolledUserIds = DB::table('lms_class_enrollments')
                ->where('lms_class_id', $classId)
                ->pluck('user_id')
                ->toArray();
        }

        if ($selectedSession) {
            $sessionStart = Carbon::parse("{$selectedSession->start_year}-04-01")->startOfDay();
            $sessionEnd = Carbon::parse("{$selectedSession->end_year}-03-31")->endOfDay();
        } else {
            $sessionStart = Carbon::parse($start)->startOfMonth()->startOfDay();
            $sessionEnd = Carbon::parse($end)->endOfMonth()->endOfDay();
        }

        // Fetch all payments for this session/range in ONE single query
        $paymentsQuery = FeePayment::query()
            ->whereIn('payment_status', ['paid', 'success'])
            ->when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
            ->when($enrolledUserIds, fn($q) => $q->whereIn('user_id', $enrolledUserIds));

        if ($selectedSession) {
            $sessId = $selectedSession->id;
            $sessStartMonth = "{$selectedSession->start_year}-04";
            $sessEndMonth = "{$selectedSession->end_year}-03";

            $paymentsQuery->where(function ($q) use ($sessStartMonth, $sessEndMonth, $sessId, $sessionStart, $sessionEnd) {
                $q->whereBetween('for_month', [$sessStartMonth, $sessEndMonth])
                  ->orWhereBetween('payment_date', [$sessionStart, $sessionEnd])
                  ->orWhere(function ($dt) use ($sessionStart, $sessionEnd) {
                      $dt->whereNull('payment_date')->whereBetween('created_at', [$sessionStart, $sessionEnd]);
                  });
            });
        } else {
            $startMonth = $sessionStart->format('Y-m');
            $endMonth = $sessionEnd->format('Y-m');
            $paymentsQuery->where(function ($q) use ($sessionStart, $sessionEnd, $startMonth, $endMonth) {
                $q->whereBetween('payment_date', [$sessionStart, $sessionEnd])
                  ->orWhereBetween('for_month', [$startMonth, $endMonth])
                  ->orWhere(function ($dt) use ($sessionStart, $sessionEnd) {
                      $dt->whereNull('payment_date')->whereBetween('created_at', [$sessionStart, $sessionEnd]);
                  });
            });
        }

        $allPayments = $paymentsQuery->with('inventorySale')->get();

        // Bulk load admission applications in 1 single query instead of N queries
        $admAppIds = $allPayments->where('payable_entity_type', 'admission_application')
            ->pluck('payable_entity_id')
            ->filter()
            ->unique()
            ->toArray();

        $admApps = !empty($admAppIds)
            ? DB::table('admission_applications')->whereIn('id', $admAppIds)->get()->keyBy('id')
            : collect();

        // Group payments by Month
        $monthBuckets = [];
        $cursor = $sessionStart->copy()->startOfMonth();
        $limitMonth = $sessionEnd->copy()->startOfMonth();

        while ($cursor->lte($limitMonth)) {
            $monthBuckets[$cursor->format('Y-m')] = [
                'month' => $cursor->format('M Y'),
                'fees' => 0.0,
                'admission' => 0.0,
                'transport' => 0.0,
                'hostel' => 0.0,
                'services' => 0.0,
                'total' => 0.0,
            ];
            $cursor->addMonth();
        }

        foreach ($allPayments as $p) {
            $mKey = $p->for_month ?: Carbon::parse($p->payment_date ?: $p->created_at)->format('Y-m');
            if (!isset($monthBuckets[$mKey])) {
                $monthBuckets[$mKey] = [
                    'month' => Carbon::parse($mKey . '-01')->format('M Y'),
                    'fees' => 0.0,
                    'admission' => 0.0,
                    'transport' => 0.0,
                    'hostel' => 0.0,
                    'services' => 0.0,
                    'total' => 0.0,
                ];
            }

            $amt = (float) $p->total_amount;
            $snap = is_array($p->ledger_snapshot) ? $p->ledger_snapshot : json_decode($p->ledger_snapshot ?? '', true);

            if ($p->payable_entity_type === 'admission_application') {
                $adm = $admApps->get($p->payable_entity_id);
                $t = (float) ($adm->transport_amount ?? 0);
                $h = (float) ($adm->hostel_amount ?? 0);
                $monthBuckets[$mKey]['transport'] += $t;
                $monthBuckets[$mKey]['hostel'] += $h;
                $monthBuckets[$mKey]['admission'] += max(0, $amt - $t - $h);
            } elseif ($p->inventorySale !== null) {
                $monthBuckets[$mKey]['services'] += $amt;
            } else {
                $pTrans = 0.0;
                $pHost = 0.0;
                if (isset($snap['fees']) && is_array($snap['fees'])) {
                    foreach ($snap['fees'] as $f) {
                        $name = strtolower($f['name'] ?? '');
                        $fAmt = (float) ($f['amount'] ?? 0);
                        if (str_contains($name, 'transport')) $pTrans += $fAmt;
                        if (str_contains($name, 'hostel')) $pHost += $fAmt;
                    }
                }
                $monthBuckets[$mKey]['transport'] += $pTrans;
                $monthBuckets[$mKey]['hostel'] += $pHost;
                $monthBuckets[$mKey]['fees'] += max(0, $amt - $pTrans - $pHost);
            }
            $monthBuckets[$mKey]['total'] += $amt;
        }

        // Format items as list
        $items = [];
        krsort($monthBuckets);

        foreach ($monthBuckets as $mKey => $b) {
            if ($b['total'] > 0 || Carbon::parse($mKey . '-01')->lte(now())) {
                $items[] = [
                    'month' => $b['month'],
                    'fees' => '₹' . number_format($b['fees'], 2),
                    'admission' => '₹' . number_format($b['admission'], 2),
                    'transport' => '₹' . number_format($b['transport'], 2),
                    'hostel' => '₹' . number_format($b['hostel'], 2),
                    'services' => '₹' . number_format($b['services'], 2),
                    'total' => '₹' . number_format($b['total'], 2),
                ];
            }
        }

        return $items;
    }

    protected function getDailyTrend($start, $end, $institutionId, $selectedSession = null)
    {
        $rawDateSql = 'COALESCE(payment_date, created_at)';
        $dateExpr = DB::connection()->getDriverName() === 'pgsql' ? "{$rawDateSql}::date" : "DATE({$rawDateSql})";

        $query = DB::table('fee_payments')
            ->select(DB::raw("{$dateExpr} as date"), DB::raw("SUM(total_amount) as total"))
            ->whereIn('payment_status', ['paid', 'success'])
            ->where(function ($q) use ($rawDateSql, $start, $end) {
                $q->whereBetween(DB::raw($rawDateSql), [$start . ' 00:00:00', $end . ' 23:59:59']);
            });

        if ($institutionId) {
            $query->where('institution_id', $institutionId);
        }

        if ($selectedSession) {
            $sessId = $selectedSession->id;
            $sessStartMonth = "{$selectedSession->start_year}-04";
            $sessEndMonth = "{$selectedSession->end_year}-03";

            $query->where(function ($q) use ($sessStartMonth, $sessEndMonth, $sessId) {
                $q->whereBetween('for_month', [$sessStartMonth, $sessEndMonth])
                  ->orWhere(function ($sub) use ($sessId) {
                      $sub->where('payable_entity_type', 'admission_application')
                          ->whereIn('payable_entity_id', function ($admq) use ($sessId) {
                              $admq->select('id')->from('admission_applications')->where('session_id', $sessId);
                          });
                  })
                  ->orWhere(function ($sub) use ($sessId) {
                      $sub->whereNull('for_month')
                          ->whereNull('payable_entity_type')
                          ->whereExists(function ($sq) use ($sessId) {
                              $sq->select(DB::raw(1))
                                  ->from('student_profiles')
                                  ->whereColumn('student_profiles.user_id', 'fee_payments.user_id')
                                  ->where('student_profiles.session_id', $sessId);
                          });
                  });
            });
        }

        return $query->groupBy('date')
            ->orderBy('date')
            ->get();
    }

    public function getHeaders(): array
    {
        $viewMode = $this->filters['view_mode'] ?? request('view_mode', 'daily');

        if ($viewMode === 'monthly') {
            return [
                ['key' => 'month', 'label' => 'Month'],
                ['key' => 'fees', 'label' => 'Course Fees', 'align' => 'right'],
                ['key' => 'admission', 'label' => 'Admission Fees', 'align' => 'right'],
                ['key' => 'transport', 'label' => 'Transport Fees', 'align' => 'right'],
                ['key' => 'hostel', 'label' => 'Hostel Fees', 'align' => 'right'],
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
            'description' => 'Summary of all fees collected across tuition, admissions, transport, hostel and inventory.',
            'type' => 'dashboard_complex',
            'charts' => [
                'daily_trend' => 'line',
                'fee_type_breakdown' => 'bar',
            ],
        ];
    }
}
