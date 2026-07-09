<?php

namespace App\Http\Controllers\Api\V1\HR;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\V1\BaseController;
use App\Models\HR\LeaveRequest;
use Illuminate\Http\Request;

class LeaveRequestController extends BaseController
{
    public function index(Request $request)
    {
        $requests = LeaveRequest::where('institution_id', $request->user()->activeInstitutionId())
            ->with(['user.staffProfile', 'leaveType'])
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 15);
            
        return $this->paginated($requests);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'leave_type_id' => 'required|exists:hr_leave_types,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'nullable|string',
        ]);

        $validated['institution_id'] = $request->user()->activeInstitutionId();

        $leaveRequest = LeaveRequest::create($validated);
        
        return $this->created($leaveRequest, 'Leave request created successfully');
    }

    public function updateStatus(Request $request, LeaveRequest $leaveRequest)
    {
        if ($leaveRequest->institution_id !== $request->user()->activeInstitutionId()) {
            return $this->forbidden();
        }

        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'rejection_reason' => 'nullable|string|required_if:status,rejected'
        ]);

        $leaveRequest->update($validated);

        if ($validated['status'] === 'approved') {
            $startDate = \Carbon\Carbon::parse($leaveRequest->start_date);
            $endDate = \Carbon\Carbon::parse($leaveRequest->end_date);
            
            for ($date = $startDate; $date->lte($endDate); $date->addDay()) {
                \App\Models\HR\StaffAttendance::updateOrCreate([
                    'institution_id' => $leaveRequest->institution_id,
                    'user_id' => $leaveRequest->user_id,
                    'date' => $date->toDateString(),
                ], [
                    'status' => 'on_leave',
                    'leave_type_id' => $leaveRequest->leave_type_id,
                    'remarks' => 'Auto-marked: Leave Approved',
                ]);
            }
        } elseif ($validated['status'] === 'rejected') {
            $startDate = \Carbon\Carbon::parse($leaveRequest->start_date);
            $endDate = \Carbon\Carbon::parse($leaveRequest->end_date);
            
            \App\Models\HR\StaffAttendance::where('institution_id', $leaveRequest->institution_id)
                ->where('user_id', $leaveRequest->user_id)
                ->whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])
                ->where('status', 'on_leave')
                ->where('leave_type_id', $leaveRequest->leave_type_id)
                ->delete();
        }

        return $this->success($leaveRequest, 'Leave request status updated');
    }
}
