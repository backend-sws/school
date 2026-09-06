<?php

namespace App\Services;

use App\Models\Payroll;
use App\Models\Payslip;
use App\Models\StaffSalaryStructure;
use App\Models\User;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PayrollService
{
    public function generateDraftPayroll($institutionId, $month, $year)
    {
        return DB::transaction(function () use ($institutionId, $month, $year) {
            // Check if payroll already exists
            $existing = Payroll::where('institution_id', $institutionId)
                ->where('month', $month)
                ->where('year', $year)
                ->first();

            if ($existing) {
                throw new \Exception("Payroll for $month/$year already exists.");
            }

            $payroll = Payroll::create([
                'institution_id' => $institutionId,
                'month'          => $month,
                'year'           => $year,
                'status'         => 'draft',
                'total_amount'   => 0
            ]);

            // ─── Working Days Calculation ────────────────────────────────
            // Total calendar days in the month
            $daysInMonth = Carbon::createFromDate($year, $month, 1)->daysInMonth;

            // Count Sundays in this month (Carbon: dayOfWeek === 0 = Sunday)
            $sundayCount = 0;
            $cursor = Carbon::createFromDate($year, $month, 1)->startOfDay();
            $monthEnd = $cursor->copy()->endOfMonth();
            while ($cursor->lte($monthEnd)) {
                if ($cursor->dayOfWeek === Carbon::SUNDAY) {
                    $sundayCount++;
                }
                $cursor->addDay();
            }

            // Fetch official holidays for this month (excluding those that fall on Sunday to avoid double-deduction)
            $holidayDates = \App\Models\HR\Holiday::where('institution_id', $institutionId)
                ->where(function ($q) use ($month, $year) {
                    // One-time holidays in this year+month
                    $q->where(function ($q2) use ($month, $year) {
                        $q2->where('is_recurring', false)
                           ->whereYear('date', $year)
                           ->whereMonth('date', $month);
                    })
                    // Recurring holidays that fall in this month (any year)
                    ->orWhere(function ($q2) use ($month) {
                        $q2->where('is_recurring', true)
                           ->whereMonth('date', $month);
                    });
                })
                ->get()
                ->map(function ($h) use ($year) {
                    // Normalize recurring holiday date to the requested year
                    if ($h->is_recurring) {
                        return Carbon::createFromDate($year, $h->date->month, $h->date->day);
                    }
                    return Carbon::parse($h->date);
                })
                ->filter(fn($d) => $d->dayOfWeek !== Carbon::SUNDAY) // Skip if it's already a Sunday
                ->unique(fn($d) => $d->toDateString());

            $holidayCount = $holidayDates->count();

            // Actual working days for the month
            $workingDaysInMonth = max(1, $daysInMonth - $sundayCount - $holidayCount);

            // ─── Staff & Payslips ─────────────────────────────────────────
            $staffUsers = User::whereHas('staffProfile', function ($q) use ($institutionId) {
                $q->where('institution_id', $institutionId);
            })->whereHas('salaryStructure')->with(['salaryStructure.components.payrollComponent'])->get();

            $totalAmount = 0;

            foreach ($staffUsers as $user) {
                $structure = $user->salaryStructure;

                // Fetch attendance for this user for this month
                $attendances = \App\Models\HR\StaffAttendance::where('user_id', $user->id)
                    ->whereMonth('date', $month)
                    ->whereYear('date', $year)
                    ->get();

                // Count LWP (Leave Without Pay) days:
                // absent = 1 day LWP, half_day = 0.5 LWP, unpaid on_leave = 1 day LWP
                // Attendance records on Sundays or holidays are ignored in LWP calculation
                $holidayDateStrings = $holidayDates->map(fn($d) => $d->toDateString())->toArray();

                $lwpDays = 0;
                foreach ($attendances as $att) {
                    $attDate = Carbon::parse($att->date);

                    // Skip Sundays and official holidays — they are not working days
                    if ($attDate->dayOfWeek === Carbon::SUNDAY) {
                        continue;
                    }
                    if (in_array($attDate->toDateString(), $holidayDateStrings)) {
                        continue;
                    }

                    if ($att->status === 'absent') {
                        $lwpDays++;
                    } elseif ($att->status === 'half_day') {
                        $lwpDays += 0.5;
                    } elseif ($att->status === 'on_leave') {
                        if ($att->leaveType && !$att->leaveType->is_paid_leave) {
                            $lwpDays++;
                        }
                    }
                }

                // Paid working days = working days in month minus LWP
                $paidWorkingDays   = max(0, $workingDaysInMonth - $lwpDays);
                $prorationFactor   = $workingDaysInMonth > 0 ? ($paidWorkingDays / $workingDaysInMonth) : 1;

                $originalBasicPay  = $structure->basic_salary;
                $basicPay          = round($originalBasicPay * $prorationFactor, 2);

                $totalEarnings   = 0;
                $totalDeductions = 0;
                $breakdown       = [];

                foreach ($structure->components as $comp) {
                    $cType          = $comp->payrollComponent->type;
                    $cName          = $comp->payrollComponent->name;
                    $originalAmount = $comp->amount;

                    if ($cType === 'earning') {
                        $amount          = round($originalAmount * $prorationFactor, 2);
                        $totalEarnings  += $amount;
                    } else {
                        // Deductions are typically fixed, not prorated
                        $amount           = $originalAmount;
                        $totalDeductions += $amount;
                    }

                    $breakdown[] = [
                        'name'   => $cName,
                        'type'   => $cType,
                        'amount' => $amount,
                    ];
                }

                // Informational LWP line
                if ($lwpDays > 0) {
                    $lwpDeductionAmount = $originalBasicPay - $basicPay;
                    $breakdown[]        = [
                        'name'   => "LWP Deduction ($lwpDays days)",
                        'type'   => 'info',
                        'amount' => -$lwpDeductionAmount,
                    ];
                }

                // Informational working-days summary line
                $breakdown[] = [
                    'name'   => "Working Days (excl. Sundays: {$sundayCount}, Holidays: {$holidayCount})",
                    'type'   => 'info',
                    'amount' => $workingDaysInMonth,
                ];

                $netPay       = $basicPay + $totalEarnings - $totalDeductions;
                $totalAmount += $netPay;

                Payslip::create([
                    'payroll_id'          => $payroll->id,
                    'user_id'             => $user->id,
                    'basic_pay'           => $basicPay,
                    'total_earnings'      => $totalEarnings,
                    'total_deductions'    => $totalDeductions,
                    'net_pay'             => $netPay,
                    'worked_days'         => $paidWorkingDays,
                    'status'              => 'unpaid',
                    'component_breakdown' => $breakdown,
                ]);
            }

            $payroll->update(['total_amount' => $totalAmount]);

            return $payroll;
        });
    }

    public function markAsPaid(Payroll $payroll)
    {
        if ($payroll->status === 'paid') {
            throw new \Exception("Payroll is already marked as paid.");
        }

        DB::transaction(function () use ($payroll) {
            $payroll->update([
                'status' => 'paid',
                'payment_date' => now()
            ]);

            $payroll->payslips()->update(['status' => 'paid']);

            // Create Expense log
            $category = ExpenseCategory::firstOrCreate(
                ['institution_id' => $payroll->institution_id, 'name' => 'Salaries & Payroll'],
                ['code' => 'PAYROLL', 'is_active' => true]
            );

            Expense::create([
                'institution_id' => $payroll->institution_id,
                'expense_category_id' => $category->id,
                'title' => "Payroll - {$payroll->month}/{$payroll->year}",
                'amount' => $payroll->total_amount,
                'date' => now()->toDateString(),
                'payment_mode' => 'bank_transfer',
                'status' => 'approved',
                'description' => "Automated expense log for Payroll {$payroll->month}/{$payroll->year}"
            ]);
        });
    }

    /**
     * Check institution readiness before running payroll for given month/year
     */
    public function checkPayrollReadiness(int $institutionId, int $month, int $year): array
    {
        $allStaff = User::whereHas('staffProfile', function ($q) use ($institutionId) {
            $q->where('institution_id', $institutionId);
        })->with(['staffProfile', 'salaryStructure'])->get();

        $readyStaff = [];
        $missingStructure = [];
        $noAttendance = [];

        foreach ($allStaff as $staff) {
            $empId = $staff->staffProfile?->employee_id ?? sprintf('EMP-%03d', $staff->id);
            $hasStructure = (bool) $staff->salaryStructure;

            $attCount = \App\Models\HR\StaffAttendance::where('user_id', $staff->id)
                ->whereMonth('date', $month)
                ->whereYear('date', $year)
                ->count();

            $item = [
                'user_id' => $staff->id,
                'employee_id' => $empId,
                'name' => $staff->name,
                'designation' => $staff->staffProfile?->designation ?? 'Staff',
                'has_salary_structure' => $hasStructure,
                'attendance_days_marked' => $attCount,
            ];

            if ($hasStructure) {
                $readyStaff[] = $item;
            } else {
                $missingStructure[] = $item;
            }

            if ($attCount === 0) {
                $noAttendance[] = $item;
            }
        }

        return [
            'month' => $month,
            'year' => $year,
            'total_staff_count' => count($allStaff),
            'ready_count' => count($readyStaff),
            'missing_structure_count' => count($missingStructure),
            'missing_structure_staff' => $missingStructure,
            'no_attendance_count' => count($noAttendance),
            'no_attendance_staff' => $noAttendance,
            'is_ready' => count($missingStructure) === 0,
        ];
    }

    /**
     * Recalculate a single payslip using active attendance and salary structure
     */
    public function recalculateSinglePayslip(Payslip $payslip): Payslip
    {
        $payroll = $payslip->payroll;
        if ($payroll->status === 'paid') {
            throw new \Exception("Cannot recalculate payslip for a finalized/paid payroll run.");
        }

        $institutionId = $payroll->institution_id;
        $month = $payroll->month;
        $year = $payroll->year;

        $user = User::with(['staffProfile', 'salaryStructure.components.payrollComponent'])
            ->find($payslip->user_id);

        if (!$user || !$user->salaryStructure) {
            throw new \Exception("User does not have an active salary structure configured.");
        }

        $daysInMonth = Carbon::createFromDate($year, $month, 1)->daysInMonth;
        $sundayCount = 0;
        $cursor = Carbon::createFromDate($year, $month, 1)->startOfDay();
        $monthEnd = $cursor->copy()->endOfMonth();
        while ($cursor->lte($monthEnd)) {
            if ($cursor->dayOfWeek === Carbon::SUNDAY) {
                $sundayCount++;
            }
            $cursor->addDay();
        }

        $holidayDates = \App\Models\HR\Holiday::where('institution_id', $institutionId)
            ->where(function ($q) use ($month, $year) {
                $q->where(function ($q2) use ($month, $year) {
                    $q2->where('is_recurring', false)
                       ->whereYear('date', $year)
                       ->whereMonth('date', $month);
                })
                ->orWhere(function ($q2) use ($month) {
                    $q2->where('is_recurring', true)
                       ->whereMonth('date', $month);
                });
            })
            ->get()
            ->map(function ($h) use ($year) {
                if ($h->is_recurring) {
                    return Carbon::createFromDate($year, $h->date->month, $h->date->day);
                }
                return Carbon::parse($h->date);
            })
            ->filter(fn($d) => $d->dayOfWeek !== Carbon::SUNDAY)
            ->unique(fn($d) => $d->toDateString());

        $holidayCount = $holidayDates->count();
        $workingDaysInMonth = max(1, $daysInMonth - $sundayCount - $holidayCount);

        $attendances = \App\Models\HR\StaffAttendance::where('user_id', $user->id)
            ->whereMonth('date', $month)
            ->whereYear('date', $year)
            ->get();

        $holidayDateStrings = $holidayDates->map(fn($d) => $d->toDateString())->toArray();

        $lwpDays = 0;
        foreach ($attendances as $att) {
            $attDate = Carbon::parse($att->date);
            if ($attDate->dayOfWeek === Carbon::SUNDAY || in_array($attDate->toDateString(), $holidayDateStrings)) {
                continue;
            }

            if ($att->status === 'absent') {
                $lwpDays++;
            } elseif ($att->status === 'half_day') {
                $lwpDays += 0.5;
            } elseif ($att->status === 'on_leave') {
                if ($att->leaveType && !$att->leaveType->is_paid_leave) {
                    $lwpDays++;
                }
            }
        }

        $paidWorkingDays = max(0, $workingDaysInMonth - $lwpDays);
        $prorationFactor = $workingDaysInMonth > 0 ? ($paidWorkingDays / $workingDaysInMonth) : 1;

        $structure = $user->salaryStructure;
        $originalBasicPay = $structure->basic_salary;
        $basicPay = round($originalBasicPay * $prorationFactor, 2);

        $totalEarnings = 0;
        $totalDeductions = 0;
        $breakdown = [];

        foreach ($structure->components as $comp) {
            $cType = $comp->payrollComponent->type;
            $cName = $comp->payrollComponent->name;
            $originalAmount = $comp->amount;

            if ($cType === 'earning') {
                $amount = round($originalAmount * $prorationFactor, 2);
                $totalEarnings += $amount;
            } else {
                $amount = $originalAmount;
                $totalDeductions += $amount;
            }

            $breakdown[] = [
                'name' => $cName,
                'type' => $cType,
                'amount' => $amount,
            ];
        }

        if ($lwpDays > 0) {
            $lwpDeductionAmount = $originalBasicPay - $basicPay;
            $breakdown[] = [
                'name' => "LWP Deduction ($lwpDays days)",
                'type' => 'info',
                'amount' => -$lwpDeductionAmount,
            ];
        }

        $breakdown[] = [
            'name' => "Working Days (excl. Sundays: {$sundayCount}, Holidays: {$holidayCount})",
            'type' => 'info',
            'amount' => $workingDaysInMonth,
        ];

        $netPay = $basicPay + $totalEarnings - $totalDeductions;

        $payslip->update([
            'basic_pay' => $basicPay,
            'total_earnings' => $totalEarnings,
            'total_deductions' => $totalDeductions,
            'net_pay' => $netPay,
            'worked_days' => round($paidWorkingDays),
            'component_breakdown' => $breakdown,
        ]);

        $payroll->update([
            'total_amount' => $payroll->payslips()->sum('net_pay')
        ]);

        return $payslip;
    }
}

