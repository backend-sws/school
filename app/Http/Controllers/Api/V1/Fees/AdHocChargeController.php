<?php

namespace App\Http\Controllers\Api\V1\Fees;

use App\Http\Controllers\Controller;
use App\Models\StudentAdHocCharge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdHocChargeController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'institution_id' => 'required|exists:institutions,id',
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
            'name' => 'required|string|max:150',
            'amount' => 'required|numeric|min:0',
            'for_month' => 'required|date_format:Y-m',
            'remarks' => 'nullable|string',
        ]);

        $charges = [];
        foreach ($validated['user_ids'] as $userId) {
            $charges[] = [
                'institution_id' => $validated['institution_id'],
                'user_id' => $userId,
                'name' => $validated['name'],
                'amount' => $validated['amount'],
                'for_month' => $validated['for_month'],
                'remarks' => $validated['remarks'] ?? null,
                'created_by' => $request->user()->id,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        StudentAdHocCharge::insert($charges);

        return response()->json([
            'message' => count($charges) . ' ad-hoc charges assigned successfully.',
        ], 201);
    }
    public function index(Request $request)
    {
        $request->validate(['institution_id' => 'required|exists:institutions,id']);
        
        $query = StudentAdHocCharge::with([
            'user:id,name,email',
            'user.studentProfile:id,user_id,reg_no,roll_no',
            'creator:id,name'
        ])->where('institution_id', $request->institution_id);

        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', [$search])
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->whereRaw('LOWER(name) LIKE ?', [$search]);
                  })
                  ->orWhereHas('user.studentProfile', function ($sq) use ($search) {
                      $sq->whereRaw('LOWER(reg_no) LIKE ?', [$search]);
                  });
            });
        }

        if ($request->filled('lms_class_id')) {
            $query->whereIn('user_id', function ($q) use ($request) {
                $q->select('user_id')
                  ->from('lms_class_enrollments')
                  ->where('lms_class_id', $request->lms_class_id)
                  ->where('role', 'student')
                  ->where('status', 'active');
            });
        }

        if ($request->filled('for_month')) {
            $query->where('for_month', $request->for_month);
        }

        $charges = $query->orderBy('created_at', 'desc')
                         ->paginate($request->per_page ?? 20);

        return response()->json($charges);
    }

    public function destroy(Request $request, $id)
    {
        $charge = StudentAdHocCharge::findOrFail($id);
        
        // Optional: Ensure it belongs to the current institution
        $institutionId = \App\Support\InstitutionContext::getActiveInstitutionId($request->user());
        if ($institutionId && $charge->institution_id != $institutionId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $charge->delete();

        return response()->json(['message' => 'Ad-hoc charge deleted successfully.']);
    }
}
