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
                'month' => $month,
                'year' => $year,
                'status' => 'draft',
                'total_amount' => 0
            ]);

            // Get total days in month
            $daysInMonth = \Carbon\Carbon::createFromDate($year, $month, 1)->daysInMonth;
            
            // Get all staff with active salary structures
            $staffUsers = User::whereHas('staffProfile', function($q) use ($institutionId) {
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
                    
                // Default to all days present if no attendance marked, or calculate from records
                $markedDays = $attendances->count();
                $lwpDays = 0;
                
                foreach ($attendances as $att) {
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
                
                $paidDays = $daysInMonth - $lwpDays;
                $prorationFactor = $daysInMonth > 0 ? ($paidDays / $daysInMonth) : 1;

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
                        // Deductions are typically fixed, not prorated
                        $amount = $originalAmount;
                        $totalDeductions += $amount;
                    }

                    $breakdown[] = [
                        'name' => $cName,
                        'type' => $cType,
                        'amount' => $amount
                    ];
                }
                
                // If LWP days > 0, we can add a tracking element
                if ($lwpDays > 0) {
                    $lwpDeductionAmount = ($originalBasicPay - $basicPay);
                    // Just informational, basicPay is already reduced
                    $breakdown[] = [
                        'name' => "LWP Deduction ($lwpDays days)",
                        'type' => 'info',
                        'amount' => -$lwpDeductionAmount
                    ];
                }

                $netPay = $basicPay + $totalEarnings - $totalDeductions;
                $totalAmount += $netPay;

                Payslip::create([
                    'payroll_id' => $payroll->id,
                    'user_id' => $user->id,
                    'basic_pay' => $basicPay,
                    'total_earnings' => $totalEarnings,
                    'total_deductions' => $totalDeductions,
                    'net_pay' => $netPay,
                    'worked_days' => $paidDays,
                    'status' => 'unpaid',
                    'component_breakdown' => $breakdown
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
                'expense_date' => now(),
                'payment_mode' => 'bank_transfer',
                'status' => 'approved',
                'description' => "Automated expense log for Payroll {$payroll->month}/{$payroll->year}"
            ]);
        });
    }
}
