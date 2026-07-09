<?php

namespace App\Http\Controllers\Api\V1\HR;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\Payroll;
use App\Models\Payslip;
use App\Services\PayrollService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PayrollController extends BaseController
{
    use \App\Traits\OptimizesHeavyTasks;

    protected $payrollService;

    public function __construct(PayrollService $payrollService)
    {
        $this->payrollService = $payrollService;
    }

    public function index(Request $request)
    {
        $payrolls = Payroll::where('institution_id', $request->user()->activeInstitutionId())
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->paginate($request->per_page ?? 15);
        return response()->json($payrolls);
    }

    public function generate(Request $request)
    {
        $request->validate([
            'month' => 'required|integer|between:1,12',
            'year' => 'required|integer'
        ]);

        try {
            $payroll = $this->payrollService->generateDraftPayroll(
                $request->user()->activeInstitutionId(),
                $request->month,
                $request->year
            );
            return response()->json(['message' => 'Payroll generated successfully', 'data' => $payroll]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function markPaid(Payroll $payroll, Request $request)
    {
        if ((int)$payroll->institution_id !== (int)$request->user()->activeInstitutionId()) {
            abort(403);
        }

        try {
            $this->payrollService->markAsPaid($payroll);
            return response()->json(['message' => 'Payroll marked as paid successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function slips(Payroll $payroll, Request $request)
    {
        if ((int)$payroll->institution_id !== (int)$request->user()->activeInstitutionId()) {
            return $this->forbidden();
        }

        $slips = $payroll->payslips()->with(['user.staffProfile'])->paginate($request->per_page ?? 50);
        return $this->paginated($slips);
    }

    public function staffHistory($userId, Request $request)
    {
        $slips = Payslip::where('user_id', $userId)
            ->whereHas('payroll', function($q) use ($request) {
                $q->where('institution_id', $request->user()->activeInstitutionId());
            })
            ->with('payroll')
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 15);
            
        return $this->paginated($slips);
    }

    public function downloadSlip(Payslip $payslip, Request $request)
    {
        if ((int)$payslip->payroll->institution_id !== (int)$request->user()->activeInstitutionId()) {
            return $this->forbidden();
        }

        $this->optimizeForExport('512M', 300); // Dynamic limits for PDF generation

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdfs.payslip', compact('payslip'));
        
        $monthStr = \Carbon\Carbon::createFromDate($payslip->payroll->year, $payslip->payroll->month, 1)->format('M_Y');
        $fileName = "Payslip_{$payslip->user->name}_{$monthStr}.pdf";
        
        return $pdf->download($fileName);
    }

    public function emailSlip(Payslip $payslip, Request $request)
    {
        if ((int)$payslip->payroll->institution_id !== (int)$request->user()->activeInstitutionId()) {
            return $this->forbidden();
        }

        if (!$payslip->user->email) {
            return $this->error('Staff member does not have an email address', 400);
        }

        $this->optimizeForExport('512M', 300); // Dynamic limits for PDF generation

        try {
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdfs.payslip', compact('payslip'));
            $pdfData = $pdf->output();

            \Illuminate\Support\Facades\Mail::to($payslip->user->email)
                ->send(new \App\Mail\PayslipEmail($payslip, $pdfData));

            return $this->success(message: 'Payslip emailed successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to send email: ' . $e->getMessage(), 500);
        }
    }

    public function payslips(Payroll $payroll, Request $request)
    {
        if ($payroll->institution_id !== $request->attributes->get('institution_id')) {
            abort(403);
        }

        $payslips = $payroll->payslips()->with('user:id,name,email,photo_url')->get();
        return response()->json(['data' => $payslips]);
    }


    public function destroy(Payroll $payroll, Request $request)
    {
        if ((int)$payroll->institution_id !== (int)$request->user()->activeInstitutionId()) {
            return $this->forbidden();
        }

        if ($payroll->status !== 'draft') {
            return $this->error('Only draft payrolls can be deleted', 400);
        }

        try {
            DB::transaction(function () use ($payroll) {
                $payroll->payslips()->delete();
                $payroll->delete();
            });
            return $this->success(message: 'Draft payroll deleted successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to delete payroll: ' . $e->getMessage(), 500);
        }
    }

    public function updatePayslip(Payslip $payslip, Request $request)
    {
        if ((int)$payslip->payroll->institution_id !== (int)$request->user()->activeInstitutionId()) {
            return $this->forbidden();
        }

        if ($payslip->payroll->status !== 'draft') {
            return $this->error('Only draft payslips can be edited', 400);
        }

        $validated = $request->validate([
            'basic_pay' => 'required|numeric|min:0',
            'total_earnings' => 'required|numeric|min:0',
            'total_deductions' => 'required|numeric|min:0',
            'net_pay' => 'required|numeric|min:0',
            'component_breakdown' => 'required|array',
        ]);

        try {
            DB::transaction(function () use ($payslip, $validated) {
                // Update payslip
                $payslip->update([
                    'basic_pay' => $validated['basic_pay'],
                    'total_earnings' => $validated['total_earnings'],
                    'total_deductions' => $validated['total_deductions'],
                    'net_pay' => $validated['net_pay'],
                    'component_breakdown' => $validated['component_breakdown'],
                ]);

                // Recalculate parent payroll total_amount
                $newTotal = $payslip->payroll->payslips()->sum('net_pay');
                $payslip->payroll->update(['total_amount' => $newTotal]);
            });

            return $this->success(message: 'Payslip updated successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to update payslip: ' . $e->getMessage(), 500);
        }
    }
}
