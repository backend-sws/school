<?php

namespace App\Http\Controllers\Api\V1\HR;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\PayrollComponent;
use Illuminate\Http\Request;

class PayrollComponentController extends BaseController
{
    public function index(Request $request)
    {
        $components = PayrollComponent::where('institution_id', $request->user()->activeInstitutionId())
            ->get();
        return $this->success($components);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:earning,deduction',
            'is_taxable' => 'boolean',
        ]);

        $component = PayrollComponent::create([
            'institution_id' => $request->user()->activeInstitutionId(),
            'name' => $request->name,
            'type' => $request->type,
            'is_taxable' => $request->is_taxable ?? false,
        ]);

        return $this->created($component, 'Component created successfully');
    }

    public function update(Request $request, PayrollComponent $payrollComponent)
    {
        if ($payrollComponent->institution_id !== $request->user()->activeInstitutionId()) {
            return $this->forbidden('Unauthorized access');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:earning,deduction',
            'is_taxable' => 'boolean',
        ]);

        $payrollComponent->update([
            'name' => $request->name,
            'type' => $request->type,
            'is_taxable' => $request->is_taxable ?? false,
        ]);

        return $this->success($payrollComponent, 'Component updated successfully');
    }

    public function destroy(Request $request, PayrollComponent $payrollComponent)
    {
        if ($payrollComponent->institution_id !== $request->user()->activeInstitutionId()) {
            return $this->forbidden('Unauthorized access');
        }

        if (\App\Models\StaffSalaryComponent::where('payroll_component_id', $payrollComponent->id)->exists()) {
            return $this->error('Cannot delete component as it is used in staff salary structures.', 400);
        }

        $payrollComponent->delete();
        return $this->success(null, 'Component deleted successfully');
    }
}
