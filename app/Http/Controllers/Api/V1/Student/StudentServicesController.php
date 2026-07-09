<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Models\HostelAllocation;
use App\Models\TransportAssignment;
use Illuminate\Http\Request;

class StudentServicesController extends Controller
{
    /**
     * Stop a service (transport/hostel) mid-session for a student.
     */
    public function stopService(Request $request, $studentId)
    {
        $institutionId = $request->input('institution_id') ?: \App\Support\InstitutionContext::getActiveInstitutionId();
        
        if (!$institutionId) {
            return response()->json(['message' => 'Institution context is required.'], 422);
        }

        $validated = $request->validate([
            'service_type' => 'required|in:transport,hostel',
            'end_date' => 'required|date',
        ]);

        if ($validated['service_type'] === 'transport') {
            $assignment = TransportAssignment::where('user_id', $studentId)
                ->where('institution_id', $institutionId)
                ->whereNull('effective_until')
                ->first();

            if (!$assignment) {
                return response()->json(['message' => 'No active transport assignment found.'], 404);
            }

            $assignment->update([
                'effective_until' => $validated['end_date'],
                'remarks' => trim($assignment->remarks . ' | Stopped on ' . $validated['end_date']),
            ]);

            return response()->json(['message' => 'Transport service stopped successfully.']);
        }

        if ($validated['service_type'] === 'hostel') {
            $allocation = HostelAllocation::where('user_id', $studentId)
                ->where('institution_id', $institutionId)
                ->whereNull('check_out_date')
                ->where('status', 'active')
                ->first();

            if (!$allocation) {
                return response()->json(['message' => 'No active hostel allocation found.'], 404);
            }

            $allocation->update([
                'check_out_date' => $validated['end_date'],
                'status' => 'checked_out',
                'remarks' => trim($allocation->remarks . ' | Checked out on ' . $validated['end_date']),
            ]);

            if ($allocation->hostel_bed_id) {
                \App\Models\HostelBed::where('id', $allocation->hostel_bed_id)->update(['status' => 'vacant']);
            }

            return response()->json(['message' => 'Hostel service stopped successfully.']);
        }

        return response()->json(['message' => 'Invalid service type.'], 400);
    }
}
