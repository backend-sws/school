<?php

namespace App\Http\Controllers\Api\V1\HR;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\StaffSalaryStructure;
use App\Models\StaffSalaryComponent;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SalaryStructureController extends BaseController
{
    public function index(Request $request)
    {
        $institutionId = $request->user()->activeInstitutionId();
        
        // Fetch all staff users for the institution
        $staff = User::whereHas('staffProfile', function($q) use ($institutionId) {
            $q->where('institution_id', $institutionId);
        })->with(['staffProfile', 'salaryStructure.components.payrollComponent'])->paginate($request->per_page ?? 50);

        return $this->paginated($staff);
    }

    public function components()
    {
        return $this->success(\App\Models\PayrollComponent::all());
    }

    public function storeOrUpdate(Request $request, User $user)
    {
        $request->validate([
            'basic_salary' => 'required|numeric|min:0',
            'components' => 'array',
            'components.*.payroll_component_id' => 'required|exists:payroll_components,id',
            'components.*.amount' => 'required|numeric|min:0'
        ]);

        DB::transaction(function () use ($request, $user) {
            $structure = StaffSalaryStructure::updateOrCreate(
                ['user_id' => $user->id],
                ['basic_salary' => $request->basic_salary, 'effective_from' => now()]
            );

            // Delete old components
            $structure->components()->delete();

            // Create new
            foreach ($request->components ?? [] as $comp) {
                $structure->components()->create([
                    'payroll_component_id' => $comp['payroll_component_id'],
                    'amount' => $comp['amount']
                ]);
            }
        });

        return $this->success(null, 'Salary structure updated successfully');
    }
}
