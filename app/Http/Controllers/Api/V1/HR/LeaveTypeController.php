<?php

namespace App\Http\Controllers\Api\V1\HR;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\V1\BaseController;
use App\Models\HR\LeaveType;
use Illuminate\Http\Request;

class LeaveTypeController extends BaseController
{
    public function index(Request $request)
    {
        $types = LeaveType::where('institution_id', $request->user()->activeInstitutionId())->get();
        return $this->success($types);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'days_allowed' => 'required|integer|min:0',
            'is_paid_leave' => 'boolean',
        ]);

        $validated['institution_id'] = $request->user()->activeInstitutionId();

        $type = LeaveType::create($validated);
        return $this->created($type, 'Leave type created successfully');
    }

    public function update(Request $request, LeaveType $leaveType)
    {
        if ($leaveType->institution_id !== $request->user()->activeInstitutionId()) {
            return $this->forbidden();
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'days_allowed' => 'required|integer|min:0',
            'is_paid_leave' => 'boolean',
        ]);

        $leaveType->update($validated);
        return $this->success($leaveType, 'Leave type updated successfully');
    }

    public function destroy(Request $request, LeaveType $leaveType)
    {
        if ($leaveType->institution_id !== $request->user()->activeInstitutionId()) {
            return $this->forbidden();
        }

        $leaveType->delete();
        return $this->success(null, 'Leave type deleted successfully');
    }
}
